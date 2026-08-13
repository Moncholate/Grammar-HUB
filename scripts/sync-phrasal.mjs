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
for (const lista of ['adverbialHeads', 'determiners'])
  for (const w of src[lista])
    if (w !== w.toLowerCase()) problemas.push(`${lista}: «${w}» tiene que ir en minúscula`);
if (problemas.length) {
  console.error('✗ phrasal-verbs.json no cuadra:');
  for (const p of problemas) console.error('   · ' + p);
  process.exit(1);
}

const datos = {
  verbs: src.verbs,
  prepParticles: src.prepParticles,
  adverbialHeads: src.adverbialHeads,
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

/* ---- Question Lab: vanilla, así que global ---- */
const ql = `${BANNER}window.GRAMMAR_PHRASAL = ${JSON.stringify(datos, null, 2)};\n`;
writeFileSync(join(apps, 'Question Lab', 'phrasal.generated.js'), ql);
console.log('  ✓ Question Lab/phrasal.generated.js');

console.log(`Frasales sincronizados — ${datos.verbs.length} entradas.`);
