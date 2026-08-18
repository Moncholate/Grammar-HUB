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

   Se generan DOS cosas con trabajos distintos, y conviene no confundirlas
   nunca (ver `$dosTrabajosDistintos` en vocabulary.json):

     PALABRAS      — la unión de todo. Decide si una palabra existe.
     CATEGORIA_DE  — sustantivo/adjetivo/verbo/… Solo ordena sugerencias, y solo
                     dentro de una misma distancia. Sirve para que el hueco de
                     detrás de `be` prefiera adjetivos, que es el caso que
                     originó todo.

   NO hay dato de unidad, y no es un olvido. Hubo una versión organizada por
   unidad del curso y se aplanó por dos razones que apuntan al mismo sitio: la
   unidad se midió como criterio de orden y salió NEUTRA (98% → 98%, cero
   ganados y cero perdidos), y agrupar vocabulario por unidades reproduce una
   selección y disposición ajena, que es la parte de una compilación que sí
   puede tener dueño — las palabras sueltas no. Un dato que no aporta nada y sí
   abre una discusión sobra por los dos lados.
   ============================================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));   // Grammar HUB/scripts
const apps = join(here, '..', '..');                    // Apps/
const src = JSON.parse(readFileSync(join(here, '..', 'vocabulary.json'), 'utf8'));

/* `gerundio` va aparte de `verbo` a propósito: son las dos cosas que pueden
   seguir a `be` y la que NO puede es el verbo en forma base. «He is swimming»
   sí, «He is swim» no. */
/* `preposicion` está por exactitud, no porque algún hueco la pida todavía. La
   alternativa era meter «between» y «across from» en adverbio, y una etiqueta
   falsa sí hace daño: se usa para ordenar sugerencias y empuja fuera del primer
   puesto a la palabra correcta. Una etiqueta verdadera que nadie consulta, en
   cambio, es inocua. */
const CATEGORIAS = new Set(['sustantivo', 'adjetivo', 'verbo', 'gerundio', 'numero', 'nacionalidad', 'adverbio', 'preposicion']);

/* ---------- Validación ----------------------------------------------------
   Una entrada mal escrita no rompe nada: deja de reconocerse esa palabra y el
   corrector la marca como errata en silencio, que es exactamente el fallo que
   este archivo viene a evitar. Por eso se comprueba aquí. */
const problemas = [];
const PALABRAS = new Set();
const CATEGORIA_DE = {};
const FRASES = [];

for (const [categoria, lista] of Object.entries(src)) {
  if (categoria.startsWith('$')) continue;              // documentación
  if (!CATEGORIAS.has(categoria)) {
    problemas.push(`categoría desconocida «${categoria}»`);
    continue;
  }
  if (!Array.isArray(lista)) {
    problemas.push(`${categoria}: se esperaba una lista`);
    continue;
  }
  for (const entrada of lista) {
    if (typeof entrada !== 'string' || !entrada.trim()) {
      problemas.push(`${categoria}: entrada vacía o no textual`);
      continue;
    }
    if (/^(a|an|the)\s/i.test(entrada)) {
      problemas.push(`«${entrada}»: sin artículo — «a chair» se guarda como «chair»`);
    }
    if (entrada.includes('  ') || entrada !== entrada.trim()) {
      problemas.push(`«${entrada}»: espacios de más`);
    }

    if (entrada.includes(' ')) FRASES.push(entrada);

    /* La frase se separa en palabras sueltas porque el corrector trabaja
       palabra a palabra: «orange juice» tiene que dejar «orange» y «juice» en
       el diccionario o «juise» no se corrige. La frase entera se guarda aparte,
       que es otro uso. */
    let esNucleo = true;
    for (const palabra of entrada.split(/\s+/)) {
      const limpia = palabra.toLowerCase().replace(/[.,;:!?]/g, '');
      if (!limpia) continue;
      if (!/^[a-záéíóúñü'-]+$/i.test(limpia)) {
        problemas.push(`«${entrada}»: «${palabra}» tiene caracteres raros`);
        continue;
      }
      PALABRAS.add(limpia);

      /* La categoría va SOLO al núcleo de la entrada, que es su primera
         palabra. En «buying clothes» la categoría es «gerundio» y describe a
         «buying»; pegársela también a «clothes» diría que «clothes» es un
         gerundio, y esa etiqueta se usa para ordenar sugerencias — una mentira
         ahí saca del top-1 a la palabra correcta. El resto de palabras de la
         frase entran en el diccionario sin categoría, y la reciben si aparecen
         listadas por su cuenta, que es como está «clothes».

         La categoría, en cambio, se ACUMULA entre entradas: «watch» es
         sustantivo y verbo, «swimming» es gerundio y sustantivo («swimming
         pool»). Quedarse con una sola sería mentir igual, por omisión. */
      if (esNucleo) {
        (CATEGORIA_DE[limpia] ??= []).includes(categoria) ||
          CATEGORIA_DE[limpia].push(categoria);
        esNucleo = false;
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
const cabecera =
  `/* AUTO-GENERATED from Grammar HUB/vocabulary.json — do not edit by hand.\n` +
  `   Change vocabulary.json and run \`npm run sync-vocabulary\` in Grammar HUB.\n\n` +
  `   PALABRAS decide si una palabra existe y nunca se recorta.\n` +
  `   CATEGORIA_DE solo ordena sugerencias, dentro de una misma distancia. */\n\n`;

const cuerpo = (exportar) =>
  `${exportar}const VOCAB_PALABRAS = ${JSON.stringify(ordenadas, null, 0)};\n\n` +
  `${exportar}const VOCAB_CATEGORIA_DE = ${JSON.stringify(CATEGORIA_DE, null, 0)};\n\n` +
  `${exportar}const VOCAB_FRASES = ${JSON.stringify(FRASES.sort(), null, 0)};\n`;

// Grammaster — ESM
writeFileSync(
  join(apps, 'Grammaster', 'src', 'data', 'vocabulary.generated.js'),
  cabecera + cuerpo('export '),
  'utf8'
);

// Question Lab — vanilla: se cuelga de window, como el resto de sus generados
writeFileSync(
  join(apps, 'Question Lab', 'vocabulary.generated.js'),
  cabecera + cuerpo('') +
  `\nwindow.VOCAB_PALABRAS = VOCAB_PALABRAS;\n` +
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
