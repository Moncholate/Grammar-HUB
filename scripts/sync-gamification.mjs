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

const BANNER =
  '/* AUTO-GENERATED from Grammar HUB/gamification-engine.js + gamification.json — do not edit.\n' +
  '   Regenerate: node scripts/sync-gamification.mjs (from Grammar HUB). */\n';

/* ---- Question Lab: global window.GH_GAME (vanilla, sin imports) ---- */
const enginePlain = engine.replace(/^export\s+/gm, '');   // quita los `export` para el IIFE
const qlBody = `${BANNER}window.GH_GAME = (function(){
${enginePlain}
  return {
    SHARED_KEY, SCHEMA_V, emptyProgress, loadProgress, saveProgress, recordAttempt, evaluateBadges,
    BADGES: ${JSON.stringify(model.badges)}
  };
})();
`;
writeFileSync(join(apps, 'Question Lab', 'gamification.generated.js'), qlBody);
console.log('  ✓ Question Lab/gamification.generated.js');
console.log('Gamificación sincronizada.');
