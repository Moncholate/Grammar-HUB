/* ============================================================================
   Frase del día · selección
   ----------------------------------------------------------------------------
   Lógica PURA (no toca el DOM ni React: recibe un `storage`), para poder
   probarla desde Node.

   Reglas:
   1. UNA frase por día calendario, la misma durante todo el día.
   2. Un día sin abrir la app no consume frase: el estudiante que entra los
      lunes ve la 1, la 2, la 3… y no se salta contenido.
   3. No se repite ninguna hasta agotar el banco (105 días ≈ dos semestres),
      porque se recorre una baraja mezclada y guardada, no un `random` por día.
   4. La baraja se mezcla DENTRO de tramos de prioridad, no entera. Al inicio
      salen las frases que bajan la ansiedad y arman hábito; después la
      técnica de estudio; al final el fundamento teórico y las citas. Es la
      progresión que recomienda el propio banco.
   ========================================================================== */
import { PHRASES } from './data/phrases.js';

export const KEY = 'gh_daily_phrase';
export const SCHEMA_V = 1;

/* Las apócrifas (sin ninguna fuente primaria) quedan fuera de la rotación:
   el sentido de esta sección es mostrar datos verificables, y una cita sin
   respaldo es justo la "frase motivacional tradicional" que se quiere evitar.
   Siguen en el banco por si se quieren usar en clase, con su advertencia. */
export const INCLUIR_APOCRIFAS = false;

/* Fecha LOCAL, no UTC: en Chile (UTC-3/-4) `toISOString()` cambia de día a las
   20:00 o 21:00, y "hoy" tiene que significar hoy para el estudiante. */
export function localDayISO(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* Tramo de prioridad: 0 sale primero. */
function tier(p) {
  if (p.cat === 'ansiedad' || p.cat === 'refuerzo') return 0;
  if (p.tag === 'meta_mindset' || p.tag === 'tip_constancia') return 0;
  if (p.cat === 'ciencia' || p.cat === 'tips') return 1;
  return 2;
}

function shuffle(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function eligible() {
  return PHRASES.filter(p => INCLUIR_APOCRIFAS || p.status !== 'apocrifa');
}

/* Baraja completa de ids: mezclada dentro de cada tramo, tramos en orden. */
export function buildDeck(rnd = Math.random) {
  const byTier = [[], [], []];
  for (const p of eligible()) byTier[tier(p)].push(p.id);
  return byTier.flatMap(ids => shuffle(ids, rnd));
}

function read(storage) {
  try {
    const s = JSON.parse(storage.getItem(KEY));
    if (s && s.v === SCHEMA_V) return s;
  } catch (e) { /* corrupto o modo privado → baraja nueva */ }
  return null;
}

/* Devuelve la frase de hoy (y la fija, si aún no estaba fijada).
   `storage` puede ser null: se degrada a "una frase estable para hoy" sin
   memoria entre días, que es lo mejor posible sin almacenamiento. */
export function pickToday(storage, { now = new Date(), rnd = Math.random } = {}) {
  const pool = eligible();
  if (!pool.length) return null;
  const today = localDayISO(now);
  const byId = (id) => pool.find(p => p.id === id);

  if (!storage) {
    // Sin almacenamiento: índice derivado de la fecha. Estable dentro del día.
    const n = Math.floor(Date.parse(today) / 86400000);
    return { phrase: pool[((n % pool.length) + pool.length) % pool.length], day: today, left: null };
  }

  let s = read(storage);
  if (s && s.day === today && byId(s.id)) {
    return { phrase: byId(s.id), day: today, left: s.queue.length };
  }

  // Día nuevo (o primer uso): sacar la siguiente carta.
  // Se descartan ids que ya no existan en el banco, por si se editó.
  let queue = (s?.queue || []).filter(byId);
  if (!queue.length) queue = buildDeck(rnd);
  const id = queue.shift();

  const next = { v: SCHEMA_V, day: today, id, queue };
  try { storage.setItem(KEY, JSON.stringify(next)); } catch (e) { /* modo privado */ }
  return { phrase: byId(id), day: today, left: queue.length };
}
