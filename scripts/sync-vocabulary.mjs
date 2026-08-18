/* ============================================================================
   Grammar Hub · sync del vocabulario
   Lee vocabulary.json (fuente única) y escribe el consumible de cada app.
   Uso:  node scripts/sync-vocabulary.mjs   (desde Grammar HUB)

   Por qué generado y no copiado: el diccionario vivía solo dentro de Grammaster
   con 285 palabras a mano, y Question Lab no tenía ninguno. Copiarlo habría
   creado la segunda copia que siempre acaba divergiendo; es la misma lección de
   sync-phrasal.mjs con los frasales.

   Reparto:
     · Grammaster  → src/data/vocabulary.generated.js  (ESM)
     · Question Lab → vocabulary.generated.js          (global, es vanilla)
     · Desgramatizador NO recibe nada por ahora: analiza texto libre y no tiene
       corrector. Cuando lo tenga, se añade aquí y no en otro sitio.

   Lo que se genera son DOS cosas con trabajos distintos, y conviene no
   confundirlas nunca (ver `$dosTrabajosDistintos` en vocabulary.json):

     PALABRAS  — la unión de todo. Decide si una palabra existe. Si esto se
                 filtrara por la unidad del alumno, una palabra correcta de una
                 unidad posterior saldría marcada como error.
     UNIDAD_DE — el número de unidad de cada palabra. Solo para desempatar
                 sugerencias que están a la misma distancia.
     CATEGORIA_DE — sustantivo/adjetivo/verbo/… Sirve para que el hueco detrás
                 de `be` prefiera adjetivos, que es el caso que originó todo.
   ============================================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));   // Grammar HUB/scripts
const apps = join(here, '..', '..');                    // Apps/
const src = JSON.parse(readFileSync(join(here, '..', 'vocabulary.json'), 'utf8'));

/* ---------- Validación ----------------------------------------------------
   Una entrada mal escrita no rompe nada: deja de reconocerse esa palabra y el
   corrector la marca como errata en silencio, que es exactamente el fallo que
   este archivo viene a evitar. Por eso se comprueba aquí. */
const problemas = [];
const CATEGORIAS = new Set(['sustantivo', 'adjetivo', 'verbo', 'numero', 'nacionalidad', 'adverbio']);
const vistas = new Map();   // palabra suelta → primera unidad en que aparece

const PALABRAS = new Set();
const UNIDAD_DE = {};
const CATEGORIA_DE = {};
const FRASES = [];

for (const [nivel, unidades] of Object.entries(src.niveles || {})) {
  for (const [unidad, grupos] of Object.entries(unidades)) {
    const nUnidad = Number(unidad);
    if (!Number.isInteger(nUnidad) || nUnidad < 1) {
      problemas.push(`${nivel}: la unidad «${unidad}» no es un número`);
      continue;
    }
    for (const [categoria, lista] of Object.entries(grupos)) {
      if (categoria.startsWith('$')) continue;          // documentación
      if (!CATEGORIAS.has(categoria)) {
        problemas.push(`${nivel}/${unidad}: categoría desconocida «${categoria}»`);
        continue;
      }
      if (!Array.isArray(lista)) {
        problemas.push(`${nivel}/${unidad}/${categoria}: se esperaba una lista`);
        continue;
      }
      for (const entrada of lista) {
        if (typeof entrada !== 'string' || !entrada.trim()) {
          problemas.push(`${nivel}/${unidad}/${categoria}: entrada vacía o no textual`);
          continue;
        }
        if (/^(a|an|the)\s/i.test(entrada)) {
          problemas.push(`«${entrada}»: sin artículo — el libro escribe «a chair», aquí va «chair»`);
        }
        if (entrada.includes('  ') || entrada !== entrada.trim()) {
          problemas.push(`«${entrada}»: espacios de más`);
        }

        if (entrada.includes(' ')) FRASES.push(entrada);

        /* La frase se separa en palabras sueltas porque el corrector trabaja
           palabra a palabra: «orange juice» tiene que dejar «orange» y «juice»
           en el diccionario o «juise» no se corrige. La frase entera se guarda
           aparte, que es otro uso. */
        for (const palabra of entrada.split(/\s+/)) {
          const limpia = palabra.toLowerCase().replace(/[.,;:!?]/g, '');
          if (!limpia) continue;
          if (!/^[a-záéíóúñü'-]+$/i.test(limpia)) {
            problemas.push(`«${entrada}»: «${palabra}» tiene caracteres raros`);
            continue;
          }
          PALABRAS.add(limpia);
          /* Primera unidad gana: si «watch» aparece en la 3 como sustantivo y
             en la 5 como verbo, el alumno ya la vio en la 3. Para «esto ya lo
             conoces» la primera vez es la que cuenta. */
          if (!(limpia in UNIDAD_DE) || nUnidad < UNIDAD_DE[limpia]) {
            UNIDAD_DE[limpia] = nUnidad;
          }
          /* La categoría, en cambio, se ACUMULA: «watch» es sustantivo y verbo,
             y quedarse con una sola sería mentir sobre la palabra. */
          (CATEGORIA_DE[limpia] ??= []).includes(categoria) ||
            CATEGORIA_DE[limpia].push(categoria);
          const antes = vistas.get(limpia);
          if (antes && antes !== `${nivel}/${nUnidad}`) { /* repetida entre unidades: legítimo */ }
          else vistas.set(limpia, `${nivel}/${nUnidad}`);
        }
      }
    }
  }
}

if (problemas.length) {
  console.error('vocabulary.json tiene problemas:\n  ' + problemas.join('\n  '));
  process.exit(1);
}
if (PALABRAS.size === 0) {
  console.error('vocabulary.json no produjo ninguna palabra — algo va mal.');
  process.exit(1);
}

const ordenadas = [...PALABRAS].sort();
const cabecera = (comando) =>
  `/* AUTO-GENERATED from Grammar HUB/vocabulary.json — do not edit by hand.\n` +
  `   Change vocabulary.json and run \`${comando}\` in Grammar HUB.\n\n` +
  `   PALABRAS es la UNIÓN de todos los niveles y unidades: decide si una palabra\n` +
  `   existe. Nunca se filtra por la unidad del alumno — una palabra correcta de\n` +
  `   una unidad posterior no puede salir marcada como error.\n` +
  `   UNIDAD_DE y CATEGORIA_DE solo ordenan sugerencias. */\n\n`;

const cuerpo = (exportar) =>
  `${exportar}const VOCAB_PALABRAS = ${JSON.stringify(ordenadas, null, 0)};\n\n` +
  `${exportar}const VOCAB_UNIDAD_DE = ${JSON.stringify(UNIDAD_DE, null, 0)};\n\n` +
  `${exportar}const VOCAB_CATEGORIA_DE = ${JSON.stringify(CATEGORIA_DE, null, 0)};\n\n` +
  `${exportar}const VOCAB_FRASES = ${JSON.stringify(FRASES.sort(), null, 0)};\n`;

// Grammaster — ESM
writeFileSync(
  join(apps, 'Grammaster', 'src', 'data', 'vocabulary.generated.js'),
  cabecera('npm run sync-vocabulary') + cuerpo('export '),
  'utf8'
);

// Question Lab — vanilla: se cuelga de window, como el resto de sus generados
writeFileSync(
  join(apps, 'Question Lab', 'vocabulary.generated.js'),
  cabecera('npm run sync-vocabulary') + cuerpo('') +
  `\nwindow.VOCAB_PALABRAS = VOCAB_PALABRAS;\n` +
  `window.VOCAB_UNIDAD_DE = VOCAB_UNIDAD_DE;\n` +
  `window.VOCAB_CATEGORIA_DE = VOCAB_CATEGORIA_DE;\n` +
  `window.VOCAB_FRASES = VOCAB_FRASES;\n`,
  'utf8'
);

const porCategoria = {};
for (const cats of Object.values(CATEGORIA_DE)) for (const c of cats) porCategoria[c] = (porCategoria[c] || 0) + 1;

console.log(`vocabulario sincronizado: ${ordenadas.length} palabras, ${FRASES.length} frases`);
console.log('  por categoría: ' + Object.entries(porCategoria).map(([c, n]) => `${c} ${n}`).join(', '));
console.log('  → Grammaster/src/data/vocabulary.generated.js');
console.log('  → Question Lab/vocabulary.generated.js');
