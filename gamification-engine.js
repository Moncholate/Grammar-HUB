/* ============================================================================
   Grammar Hub · motor de progreso (gamificación)
   ----------------------------------------------------------------------------
   Lógica PURA y neutral al framework sobre la forma `gh_progress` definida en
   gamification.json. Se distribuye a cada app (vanilla o React la importan).
   No toca el DOM: recibe un `storage` (localStorage) y los defs de insignias.
   ============================================================================ */
export const SHARED_KEY = 'gh_progress';
export const SCHEMA_V = 1;

/* Fecha LOCAL, no UTC. Con `toISOString()` el día cambiaba a medianoche de
   Greenwich, o sea a las 20:00 en Chile, y la racha dejaba de contar el día del
   alumno. Dos fallas reales, las dos sobre el que estudia de noche:
     · practicar lunes 18:00 y lunes 22:00 → el motor veía DOS días (racha inflada)
     · practicar domingo 22:00 y lunes 18:00 → veía UN día, y la racha no avanzaba
       aunque el alumno sí había practicado dos días seguidos.
   `dayGap` no cambia: compara dos strings del mismo formato, así que la resta
   sigue dando días completos.
   Se EXPORTAN los dos: la revisión periódica de la unidad del curso necesita la
   misma noción de «día» que la racha, y una segunda copia del helper acabaría
   divergiendo justo en el caso de las 22:00 que costó encontrar. */
export const todayISO = (d = new Date()) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
export const dayGap = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

export function emptyProgress() {
  return {
    v: SCHEMA_V,
    dayStreak: { count: 0, best: 0, lastDay: null },
    practiceDays: [],
    totalCorrect: 0,
    bestAnswerStreak: 0,
    sentencesAnalyzed: 0,       // Desgramatizador
    tenses: {},                 // { [tenseId]: { attempts, correct, days: [ISO] } }
    appsUsed: {},               // { grammaster:true, ... }
    modesUsed: {},              // { [app]: { [mode]:true } } — actividades distintas dentro de una app
    roundsDone: 0,              // rondas de práctica completadas
    perfectRounds: 0,           // …de esas, cuántas sin un solo fallo
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
/* Marca "practiqué hoy" y actualiza la racha de días. Devuelve la fecha de hoy. */
function markDay(p) {
  const today = todayISO();
  if (p.dayStreak.lastDay !== today) {
    const gap = p.dayStreak.lastDay ? dayGap(p.dayStreak.lastDay, today) : null;
    p.dayStreak.count = gap === 1 ? p.dayStreak.count + 1 : 1;
    p.dayStreak.lastDay = today;
    p.dayStreak.best = Math.max(p.dayStreak.best, p.dayStreak.count);
    if (!p.practiceDays.includes(today)) p.practiceDays.push(today);
  }
  return today;
}

/* `mode` (opcional) = la actividad dentro de la app (Question Lab:
   build / identify / respond). Sirve para premiar variedad DENTRO de una app,
   no solo entre apps. Se registra aunque la respuesta sea incorrecta: lo que
   cuenta es haber probado la actividad. */
export function recordAttempt(p, { app, mode, tenseId, correct, answerStreak } = {}) {
  if (app) p.appsUsed[app] = true;
  if (app && mode) {
    if (!p.modesUsed) p.modesUsed = {};       // progreso guardado antes de v1.2
    (p.modesUsed[app] || (p.modesUsed[app] = {}))[mode] = true;
  }
  const today = markDay(p);

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

/* Registra UN análisis de oración (Desgramatizador): cuenta para racha de días,
   apps usadas y el contador de oraciones analizadas. */
export function recordAnalysis(p, { app } = {}) {
  if (app) p.appsUsed[app] = true;
  markDay(p);
  p.sentencesAnalyzed = (p.sentencesAnalyzed || 0) + 1;
  return p;
}

/* Registra el cierre de UNA ronda de práctica.
   Solo cuenta como perfecta si tenía al menos MIN_RONDA_PERFECTA ejercicios: en
   Question Lab la ronda de Construye se acota a los desafíos disponibles del
   nivel, y una ronda de 3 sin fallos no es el mismo logro que una de 10. Sin
   este piso, la insignia se ganaría en el nivel con menos desafíos. */
export const MIN_RONDA_PERFECTA = 5;
export function recordRound(p, { app, ok = 0, total = 0 } = {}) {
  if (app) p.appsUsed[app] = true;
  p.roundsDone = (p.roundsDone || 0) + 1;
  if (total >= MIN_RONDA_PERFECTA && ok === total) {
    p.perfectRounds = (p.perfectRounds || 0) + 1;
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
    case 'modesUsed':        return Object.values((p.modesUsed || {})[c.app] || {}).filter(Boolean).length >= c.gte;
    case 'perfectRounds':    return (p.perfectRounds || 0) >= c.gte;
    case 'sentencesAnalyzed':return (p.sentencesAnalyzed || 0) >= c.gte;
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
