/* ============================================================================
   Grammar Hub · sync del motor de corrección
   Lee spelling-engine.js y genera el consumible de cada app.
   Uso:  node scripts/sync-spelling.mjs   (desde Grammar HUB)

   Mismo patrón que sync-gamification.mjs, y por la misma razón: es LÓGICA
   compartida, no datos. Vivía dentro de Grammaster; Question Lab la necesita
   para dejar de decirle al alumno «te falta el verbo» cuando el verbo está y
   solo tiene una letra cruzada.

   Reparto:
     · Grammaster   → src/data/spelling.generated.js   (ESM)
     · Question Lab → spelling.generated.js            (global window.GH_SPELL)
     · Desgramatizador NO recibe nada por ahora: analiza texto libre y no tiene
       corrector. Cuando lo tenga, se añade aquí y no en otro sitio.
   ============================================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const hub = join(here, '..');        // Grammar HUB
const apps = join(hub, '..');        // Apps

const engine = readFileSync(join(hub, 'spelling-engine.js'), 'utf8');

/* Comprobación mínima de que el motor sigue siendo el que se espera: si alguien
   renombra una función, el error tiene que salir aquí y no como un `undefined`
   dentro de una app. */
const EXPORTA = ['damerauLevenshtein', 'sugerenciasDe'];
const faltan = EXPORTA.filter(n => !new RegExp(`export const ${n}\\b`).test(engine));
if (faltan.length) {
  console.error(`spelling-engine.js ya no exporta: ${faltan.join(', ')}`);
  process.exit(1);
}

const BANNER =
  '/* AUTO-GENERATED from Grammar HUB/spelling-engine.js — do not edit.\n' +
  '   Regenerate: node scripts/sync-spelling.mjs (from Grammar HUB). */\n';

/* ---- Question Lab: global window.GH_SPELL (vanilla, sin imports) ---- */
const enginePlain = engine.replace(/^export\s+/gm, '');   // quita los `export` para el IIFE
writeFileSync(
  join(apps, 'Question Lab', 'spelling.generated.js'),
  `${BANNER}window.GH_SPELL = (function(){\n${enginePlain}\n  return { ${EXPORTA.join(', ')} };\n})();\n`
);
console.log('  ✓ Question Lab/spelling.generated.js');

/* ---- Grammaster: ESM tal cual ---- */
writeFileSync(
  join(apps, 'Grammaster', 'src', 'data', 'spelling.generated.js'),
  `${BANNER}${engine}`
);
console.log('  ✓ Grammaster/src/data/spelling.generated.js');

console.log('Motor de corrección sincronizado.');
