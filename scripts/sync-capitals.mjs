/* ============================================================================
   Grammar Hub · sync del motor de MAYÚSCULAS
   Lee capitals-engine.js + vocabulary.json y genera el consumible de cada app.
   Uso:  node scripts/sync-capitals.mjs   (desde Grammar HUB)

   Mismo patrón que sync-spelling.mjs: el motor es LÓGICA compartida y la lista
   son DATOS derivados del vocabulario, que es la fuente única.

   Reparto:
     · Grammaster   → src/data/capitals.generated.js   (ESM)
     · Question Lab → capitals.generated.js            (global window.GH_CAPS)

   Desgramatizador NO recibe nada, y es una decisión: analiza texto que el
   alumno PEGA —muchas veces del libro, ya correcto— y no corrige a nadie.
   Avisar ahí de mayúsculas sería ruido sobre material ajeno. Cuando tenga un
   sitio donde corregir producción propia, se añade aquí y no en otro sitio.

   Al añadir una app nueva hay que registrar el generado en TODOS sus sitios
   —en QL son `index.html`, `ACTIVOS` de `build.mjs` y `urlsToCache` de
   `sw.js`—. Olvidar uno rompió tres despliegues en agosto.

   ── De dónde sale la lista ─────────────────────────────────────────────────
   De vocabulary.json, y solo del conjunto donde el español y el inglés NO
   coinciden: nacionalidades, meses y días. El porqué largo está en la cabecera
   del motor; en corto, es el único sitio donde hay interferencia que corregir.
   Los países quedan fuera aunque estén con mayúscula en el vocabulario: el
   español también los capitaliza.

   MESES y DIAS se declaran aquí y no como categoría del vocabulario porque son
   conjuntos CERRADOS del idioma, no una selección de nadie, y porque las
   categorías de vocabulary.json son gramaticales (un mes es un sustantivo, y
   con eso es con lo que tiene que ordenarse en las sugerencias).
   ============================================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const hub = join(here, '..');
const apps = join(hub, '..');

const engine = readFileSync(join(hub, 'capitals-engine.js'), 'utf8');
const vocab = JSON.parse(readFileSync(join(hub, 'vocabulary.json'), 'utf8'));

const EXPORTA = ['revisarMayusculas', 'corregirMayusculas'];
const faltan = EXPORTA.filter(n => !new RegExp(`export const ${n}\\b`).test(engine));
if (faltan.length) {
  console.error(`capitals-engine.js ya no exporta: ${faltan.join(', ')}`);
  process.exit(1);
}

const MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
               'August', 'September', 'October', 'November', 'December'];
const DIAS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/* Que estén en el vocabulario NO es un detalle burocrático: si un mes falta
   allí, el corrector ortográfico no lo conoce y marcaría «January» como errata
   justo después de que esta regla le pidiera al alumno que lo escribiera así.
   Las dos comprobaciones tienen que ver el mismo mundo. */
const enVocab = new Set(Object.entries(vocab)
  .filter(([k]) => !k.startsWith('$'))
  .flatMap(([, v]) => v));
const ausentes = [...MESES, ...DIAS].filter(p => !enVocab.has(p));
if (ausentes.length) {
  console.error(`Faltan en vocabulary.json: ${ausentes.join(', ')}`);
  console.error('Sin ellas el corrector las marcaría como erratas. Añádelas a `sustantivo`.');
  process.exit(1);
}

const NACIONALIDADES = vocab.nacionalidad || [];

/* Ambiguas: tienen un uso legítimo en minúscula, así que el motor solo las
   marca con prueba de que se habla del mes. `may` es la importante — es un
   MODAL, y en esta suite se usa muchísimo más que el mes. */
const AMBIGUAS = ['may', 'march', 'august'];

/* Las palabras que el vocabulario guarda EN MINÚSCULA en algún sitio. Sirven de
   veto: si una parte de una nacionalidad compuesta es además una palabra
   corriente, no puede entrar sola en la regla.

   EL FALLO QUE ESTO ARREGLA: «North America» se partía en «north» + «america»,
   así que `north` y `south` acababan exigiendo mayúscula por su cuenta y «go
   south» salía marcado como error. Una oración correcta señalada como incorrecta
   — el fallo caro, el que la cabecera del motor dice evitar por encima de todo.
   Se pierde el aviso sobre el «North» de «North American», y se pierde a
   propósito: vale mucho más callar ahí que gritar en cada «go south». */
const enMinuscula = new Set([...enVocab].filter(p => p === p.toLowerCase())
  .flatMap(p => p.split(/\s+/)));

const CANONICO = {};
for (const p of [...MESES, ...DIAS, ...NACIONALIDADES]) {
  // Las compuestas («North American») se parten porque el motor trabaja token a
  // token; cada parte entra solo si es mayúscula Y no es palabra corriente.
  for (const parte of p.split(/\s+/)) {
    if (!/^[A-Z]/.test(parte)) continue;
    if (enMinuscula.has(parte.toLowerCase())) continue;
    CANONICO[parte.toLowerCase()] = parte;
  }
}

const BANNER =
  '/* AUTO-GENERATED from Grammar HUB/capitals-engine.js + vocabulary.json — do not edit.\n' +
  '   Regenerate: node scripts/sync-capitals.mjs (from Grammar HUB). */\n';

const datos = (exportar) =>
  `\n${exportar}const CAPS_CANONICO = ${JSON.stringify(CANONICO)};\n` +
  `${exportar}const CAPS_AMBIGUAS = ${JSON.stringify(AMBIGUAS)};\n`;

/* ---- Question Lab: global window.GH_CAPS (vanilla, sin imports) ---- */
const enginePlain = engine.replace(/^export\s+/gm, '');
writeFileSync(
  join(apps, 'Question Lab', 'capitals.generated.js'),
  `${BANNER}window.GH_CAPS = (function(){\n${enginePlain}${datos('')}\n` +
  `  return { ${EXPORTA.join(', ')}, CAPS_CANONICO, CAPS_AMBIGUAS };\n})();\n`
);
console.log('  ✓ Question Lab/capitals.generated.js');

/* ---- Grammaster: ESM tal cual ---- */
writeFileSync(
  join(apps, 'Grammaster', 'src', 'data', 'capitals.generated.js'),
  BANNER + engine + datos('export ')
);
console.log('  ✓ Grammaster/src/data/capitals.generated.js');

console.log(`mayúsculas sincronizadas: ${Object.keys(CANONICO).length} palabras ` +
            `(${MESES.length} meses, ${DIAS.length} días, ${NACIONALIDADES.length} nacionalidades), ` +
            `${AMBIGUAS.length} ambiguas`);
