/* ============================================================================
   Grammar Hub · sync de verbos frasales
   Lee phrasal-verbs.json (fuente única) y escribe el consumible de cada app que
   ANALIZA: Desgramatizador (ESM) y Question Lab (global, es vanilla).
   Uso:  node scripts/sync-phrasal.mjs   (desde Grammar HUB)

   Por qué generado y no copiado: la lista vivía solo en Desgramatizador y
   Question Lab no tenía NINGUNA, así que «get up» salía bien en una app y mal en
   la otra. Copiarla habría creado la segunda copia que siempre acaba
   divergiendo; es la misma lección de sync-curriculum.mjs con el nivel de
   `would`.

   Grammaster no recibe nada a propósito: genera oraciones en vez de analizarlas
   y deja los frasales fuera de su lista de verbos.
   ============================================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));   // Grammar HUB/scripts
const apps = join(here, '..', '..');                    // Apps/
const src = JSON.parse(readFileSync(join(here, '..', 'phrasal-verbs.json'), 'utf8'));

/* ---------- Validación ----------------------------------------------------
   Una entrada mal escrita no rompe nada: deja de reconocerse ese frasal y la
   partícula se va al complemento en silencio, que es exactamente el fallo que
   este archivo viene a evitar. Por eso se comprueba aquí. */
const problemas = [];
const vistos = new Set();
for (const e of src.verbs) {
  if (!Array.isArray(e) || e.length < 2) { problemas.push(`entrada mal formada: ${JSON.stringify(e)}`); continue; }
  if (e.some(w => typeof w !== 'string' || w !== w.toLowerCase() || /\s/.test(w)))
    problemas.push(`«${e.join(' ')}»: cada palabra va en minúscula y sin espacios`);
  const clave = e.join(' ');
  if (vistos.has(clave)) problemas.push(`«${clave}» está repetido`);
  vistos.add(clave);
}
/* Toda partícula ambigua declarada tiene que usarse: una `prepParticle` que no
   aparece en ningún frasal es una regla que no se aplica a nada, y esconde una
   errata. */
const particulasUsadas = new Set(src.verbs.flatMap(e => e.slice(1)));
for (const p of src.prepParticles)
  if (!particulasUsadas.has(p)) problemas.push(`prepParticles: «${p}» no aparece en ningún frasal`);
const LISTAS = ['adverbialHeadsTime', 'adverbialHeadsOtros', 'determiners',
                'advTiempoSueltos', 'cuantificadoresTiempo', 'preposicionesTiempo',
                'preposicionesSecuencia', 'nucleosDeEvento'];
/* Las de secuencia son un SUBCONJUNTO de las de tiempo: si una se sale, deja de
   aplicarse la regla general y el caso pasa desapercibido. */
for (const p of src.preposicionesSecuencia)
  if (!src.preposicionesTiempo.includes(p))
    problemas.push(`preposicionesSecuencia: «${p}» no está en preposicionesTiempo`);
/* Un evento en la lista general rompería la distinción que justifica separarlos:
   «after school» es cuándo, «at school» es dónde. */
for (const w of src.nucleosDeEvento)
  if (src.adverbialHeadsTime.includes(w))
    problemas.push(`nucleosDeEvento: «${w}» también está en adverbialHeadsTime, y ahí «at ${w}» pasaría por tiempo`);
for (const lista of LISTAS)
  for (const w of src[lista])
    if (w !== w.toLowerCase()) problemas.push(`${lista}: «${w}» tiene que ir en minúscula`);
/* Las dos mitades de los núcleos adverbiales no pueden solaparse: si una palabra
   estuviera en las dos, «de tiempo o no» dejaría de tener respuesta única y el
   orden lugar-tiempo saldría distinto según qué lista se consultara antes. */
for (const w of src.adverbialHeadsOtros)
  if (src.adverbialHeadsTime.includes(w))
    problemas.push(`«${w}» está en adverbialHeadsTime y en adverbialHeadsOtros a la vez`);
if (problemas.length) {
  console.error('✗ phrasal-verbs.json no cuadra:');
  for (const p of problemas) console.error('   · ' + p);
  process.exit(1);
}

/* `adverbialHeads` se emite DERIVADO, como la unión de las dos mitades: los
   frasales solo preguntan «¿es adverbial?» y les da igual de qué tipo. Así el
   consumidor viejo no cambia y el nuevo tiene el corte que necesita. */
const datos = {
  verbs: src.verbs,
  prepParticles: src.prepParticles,
  adverbialHeads: [...src.adverbialHeadsTime, ...src.adverbialHeadsOtros],
  adverbialHeadsTime: src.adverbialHeadsTime,
  advTiempoSueltos: src.advTiempoSueltos,
  cuantificadoresTiempo: src.cuantificadoresTiempo,
  preposicionesTiempo: src.preposicionesTiempo,
  preposicionesSecuencia: src.preposicionesSecuencia,
  nucleosDeEvento: src.nucleosDeEvento,
  determiners: src.determiners,
};
const BANNER =
  '/* AUTO-GENERATED from Grammar HUB/phrasal-verbs.json — do not edit by hand.\n' +
  '   Change phrasal-verbs.json and run `node scripts/sync-phrasal.mjs` in Grammar HUB. */\n';

/* ---- Desgramatizador: ESM ---- */
const esm = `${BANNER}
export const PHRASAL_VERB_LIST = ${JSON.stringify(datos.verbs)};

/* Partículas que también son preposiciones: ver \`$prepParticles\` en el JSON. */
export const PREP_PARTICLES = new Set(${JSON.stringify(datos.prepParticles)});

/* Sustantivos que marcan adverbial en vez de objeto del frasal. */
export const ADVERBIAL_HEADS = new Set(${JSON.stringify(datos.adverbialHeads)});

export const DETERMINERS = ${JSON.stringify(datos.determiners)};
`;
writeFileSync(join(apps, 'Desgramatizador', 'pos-highlighter', 'src', 'nlp', 'phrasal.generated.js'), esm);
console.log('  ✓ Desgramatizador/src/nlp/phrasal.generated.js');

/* ---- Grammaster: ESM, solo la lista ----
   Faltaba, y era el hueco de siempre: Desgramatizador y Question Lab tenían los
   frasales y Grammaster no, que es justo la app donde el ALUMNO los escribe. Su
   campo Verbo los rechazaba con «no está en nuestra lista de verbos» —a los 13
   que el propio vocabulario del curso enseña incluidos— y si el alumno seguía
   igual, la app generaba «She get ups».
   Solo se reparte `verbs`: aquí no hace falta distinguir objeto de adverbial,
   que es para lo que las otras dos usan el resto del archivo. */
writeFileSync(
  join(apps, 'Grammaster', 'src', 'data', 'phrasal.generated.js'),
  `${BANNER}\nexport const PHRASAL_VERB_LIST = ${JSON.stringify(datos.verbs)};\n`
);
console.log('  ✓ Grammaster/src/data/phrasal.generated.js');

/* ---- Question Lab: vanilla, así que global ---- */
const ql = `${BANNER}window.GRAMMAR_PHRASAL = ${JSON.stringify(datos, null, 2)};\n`;
writeFileSync(join(apps, 'Question Lab', 'phrasal.generated.js'), ql);
console.log('  ✓ Question Lab/phrasal.generated.js');

console.log(`Frasales sincronizados — ${datos.verbs.length} entradas.`);
