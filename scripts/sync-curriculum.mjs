/* ============================================================================
   Grammar Hub · sync del currículo (niveles CEFR)
   Lee curriculum.json (fuente única: escala de niveles + mapa tiempo→nivel) y
   escribe el consumible de cada app. Por ahora: Question Lab.
   Uso:  npm run sync-curriculum   (desde Grammar HUB)
   ============================================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));   // Grammar HUB/scripts
const apps = join(here, '..', '..');                    // Apps/
const cur = JSON.parse(readFileSync(join(here, '..', 'curriculum.json'), 'utf8'));

const BANNER =
  '/* AUTO-GENERATED from Grammar HUB/curriculum.json — do not edit by hand.\n' +
  '   Change curriculum.json and run `npm run sync-curriculum` in Grammar HUB. */\n';

/* ---- Question Lab: script clásico que expone window.GRAMMAR_CEFR ----
   Question Lab es vanilla (no ESM), así que en vez de `export` asignamos a
   window para que su script inline lo lea. */
const qlBody =
  `${BANNER}window.GRAMMAR_CEFR = ${JSON.stringify({ levels: cur.levels, labels: cur.labels, tenses: cur.tenses }, null, 2)};\n`;
const qlPath = join(apps, 'Question Lab', 'cefr.generated.js');
writeFileSync(qlPath, qlBody);
console.log('  ✓ Question Lab/cefr.generated.js');

console.log('Currículo sincronizado.');
