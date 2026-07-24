/* ============================================================================
   Grammar Hub · motor de progreso (gamificación)
   ----------------------------------------------------------------------------
   Lógica PURA y neutral al framework sobre la forma `gh_progress` definida en
   gamification.json. Se distribuye a cada app (vanilla o React la importan).
   No toca el DOM: recibe un `storage` (localStorage) y los defs de insignias.
   ============================================================================ */
export const SHARED_KEY = 'gh_progress';
export const SCHEMA_V = 1;

const todayISO = (d = new Date()) => d.toISOString().slice(0, 10);
const dayGap = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

export function emptyProgress() {
  return {
    v: SCHEMA_V,
    dayStreak: { count: 0, best: 0, lastDay: null },
    practiceDays: [],
    totalCorrect: 0,
    bestAnswerStreak: 0,
    tenses: {},                 // { [tenseId]: { attempts, correct, days: [ISO] } }
    appsUsed: {},               // { grammaster:true, ... }
    badges: {}                  // { [badgeId]: unlockedISO }  (perTense → `${id}:${tenseId}`)
  };
}

export function loadProgress(storage) {
  try {
    const raw = storage && storage.getItem(SHARED_KEY);
    if (!raw) return emptyProgress();
    const p = JSON.parse(raw);
    if (!p || p.v !== SCHEMA_V) return emptyProgress();   // schema bumped → start clean
    return { ...emptyProgress(), ...p };
  } catch (e) { return emptyProgress(); }
}

export function saveProgress(storage, p) {
  try { storage && storage.setItem(SHARED_KEY, JSON.stringify(p)); } catch (e) {}
}

/* Registra UN intento de práctica calificado. Muta y devuelve `p`.
   `answerStreak` (opcional) = racha de aciertos actual de la actividad local. */
export function recordAttempt(p, { app, tenseId, correct, answerStreak } = {}) {
  const today = todayISO();
  if (app) p.appsUsed[app] = true;

  // Racha de días: cualquier práctica cuenta como "practiqué hoy".
  if (p.dayStreak.lastDay !== today) {
    const gap = p.dayStreak.lastDay ? dayGap(p.dayStreak.lastDay, today) : null;
    p.dayStreak.count = gap === 1 ? p.dayStreak.count + 1 : 1;
    p.dayStreak.lastDay = today;
    p.dayStreak.best = Math.max(p.dayStreak.best, p.dayStreak.count);
    if (!p.practiceDays.includes(today)) p.practiceDays.push(today);
  }

  if (correct) p.totalCorrect += 1;
  if (typeof answerStreak === 'number') p.bestAnswerStreak = Math.max(p.bestAnswerStreak, answerStreak);

  if (tenseId) {
    const t = p.tenses[tenseId] || (p.tenses[tenseId] = { attempts: 0, correct: 0, days: [] });
    t.attempts += 1;
    if (correct) t.correct += 1;
    if (!t.days.includes(today)) t.days.push(today);
  }
  return p;
}

function meets(p, criteria, tenseId) {
  const c = criteria;
  switch (c.type) {
    case 'dayStreak':        return p.dayStreak.count >= c.gte || p.dayStreak.best >= c.gte;
    case 'totalCorrect':     return p.totalCorrect >= c.gte;
    case 'bestAnswerStreak': return p.bestAnswerStreak >= c.gte;
    case 'appsUsed':         return Object.values(p.appsUsed).filter(Boolean).length >= c.gte;
    case 'tenseFamiliar': {
      const t = p.tenses[tenseId];
      return !!t && t.correct >= c.correctGte;
    }
    case 'tenseMastery': {
      const t = p.tenses[tenseId];
      return !!t && t.attempts >= c.attemptsGte && t.days.length >= c.daysGte && (t.correct / t.attempts) >= c.accuracyGte;
    }
    default: return false;
  }
}

/* Evalúa todas las insignias contra el progreso. Estampa las nuevas en p.badges
   y devuelve { newly:[keys], all:[keys] }. `tenseIds` acota las perTense. */
export function evaluateBadges(p, badges, tenseIds) {
  const newly = [];
  const stamp = today => today;
  for (const b of badges) {
    if (b.perTense) {
      const ids = tenseIds && tenseIds.length ? tenseIds : Object.keys(p.tenses);
      for (const tid of ids) {
        const key = `${b.id}:${tid}`;
        if (!p.badges[key] && meets(p, b.criteria, tid)) { p.badges[key] = todayISO(); newly.push(key); }
      }
    } else {
      if (!p.badges[b.id] && meets(p, b.criteria)) { p.badges[b.id] = todayISO(); newly.push(b.id); }
    }
  }
  return { newly, all: Object.keys(p.badges) };
}
