/* ============================================================================
   Grammar Hub · sync de gamificación
   Lee gamification-engine.js (lógica) + gamification.json (modelo) y genera el
   consumible de cada app. Por ahora: Question Lab (vanilla → global window.GH_GAME).
   Uso:  node scripts/sync-gamification.mjs   (desde Grammar HUB)
   ============================================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const hub = join(here, '..');        // Grammar HUB
const apps = join(hub, '..');        // Apps

const engine = readFileSync(join(hub, 'gamification-engine.js'), 'utf8');
const model = JSON.parse(readFileSync(join(hub, 'gamification.json'), 'utf8'));

/* Las claves que empiezan con `_` son notas para quien lea el modelo, no datos:
   explican POR QUÉ una insignia es como es, que es justo lo que se pierde con el
   tiempo. Se quedan en gamification.json y NO viajan al bundle — sin esto, la
   justificación de un icono la descargaba el alumno en cada visita. Mismo
   criterio que `tokens.json`, donde las notas tampoco salen por `sync.mjs`. */
const sinNotas = (v) => Array.isArray(v) ? v.map(sinNotas)
  : (v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).filter(([k]) => !k.startsWith('_')).map(([k, x]) => [k, sinNotas(x)]))
      : v);
model.badges = sinNotas(model.badges);

const BANNER =
  '/* AUTO-GENERATED from Grammar HUB/gamification-engine.js + gamification.json — do not edit.\n' +
  '   Regenerate: node scripts/sync-gamification.mjs (from Grammar HUB). */\n';

/* ---- Question Lab: global window.GH_GAME (vanilla, sin imports) ---- */
const enginePlain = engine.replace(/^export\s+/gm, '');   // quita los `export` para el IIFE
const qlBody = `${BANNER}window.GH_GAME = (function(){
${enginePlain}
  return {
    SHARED_KEY, SCHEMA_V, emptyProgress, loadProgress, saveProgress, recordAttempt, recordRound, evaluateBadges,
    todayISO, dayGap,
    BADGES: ${JSON.stringify(model.badges)}
  };
})();
`;
writeFileSync(join(apps, 'Question Lab', 'gamification.generated.js'), qlBody);
console.log('  ✓ Question Lab/gamification.generated.js');

/* ---- Hub + apps React: ESM (motor tal cual + BADGES exportadas) ---- */
const esmBody = `${BANNER}${engine}\nexport const BADGES = ${JSON.stringify(model.badges)};\n`;
const esmTargets = [
  ['Grammar HUB', 'src', 'gamification.generated.js'],
  ['Grammaster', 'src', 'gamification.generated.js'],
  ['Desgramatizador', 'pos-highlighter', 'src', 'gamification.generated.js'],
];
for (const parts of esmTargets) {
  const p = join(apps, ...parts);
  writeFileSync(p, esmBody);
  console.log('  ✓', parts.join('/'));
}
console.log('Gamificación sincronizada.');
