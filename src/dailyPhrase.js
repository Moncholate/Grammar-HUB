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

/* Tramo de prioridad: 1 sale primero. Lo declara cada ítem (ver phrases.js).
   Antes había además un override por `tag` que adelantaba meta_mindset y
   tip_constancia: se quitó porque contradecía los podios de la deduplicación
   (subía a la entrada dos ítems de espaciamiento que el podio manda al fondo).
   `tramo` es la única fuente. */
const tier = (p) => p.tramo || 2;

/* Orden de los niveles del curso, para el filtro. Un ítem con `nivel` es el
   curso MÍNIMO en que su estructura se enseña: se oculta a quien va más abajo,
   pero NUNCA a quien va más arriba. Los errores y las estructuras básicas
   siguen sirviendo en niveles avanzados; filtrar hacia abajo sería asumir que
   lo básico ya está resuelto, y no lo está. */
export const NIVELES = ['basico1', 'basico2', 'elemental1', 'elemental2',
                        'intermedio1', 'intermedio2', 'avanzado'];

export function visibleEn(p, level) {
  if (!p.nivel) return true;                       // sin estructura concreta → siempre
  if (!level) return true;                         // sin nivel elegido → no se oculta nada
  const i = NIVELES.indexOf(level), j = NIVELES.indexOf(p.nivel);
  return i < 0 || j < 0 || j <= i;
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
  const byTier = { 1: [], 2: [], 3: [] };
  for (const p of eligible()) (byTier[tier(p)] || byTier[2]).push(p.id);
  return [1, 2, 3].flatMap(t => shuffle(byTier[t], rnd));
}

function read(storage) {
  try {
    const s = JSON.parse(storage.getItem(KEY));
    if (s && s.v === SCHEMA_V) return s;
  } catch (e) { /* corrupto o modo privado → baraja nueva */ }
  return null;
}

/* Devuelve la frase de hoy (y la fija, si aún no estaba fijada).
   `seen` = ya se abrió el aviso hoy; es lo que decide si el modal salta solo.

   `storage` puede ser null: se degrada a "una frase estable para hoy" sin
   memoria entre días, y con seen=true, porque sin dónde anotar que ya se vio
   el modal saltaría en cada recarga. Esos usuarios la leen desde la línea. */
export function pickToday(storage, { now = new Date(), rnd = Math.random, level = null } = {}) {
  const pool = eligible();
  if (!pool.length) return null;
  const today = localDayISO(now);
  const byId = (id) => pool.find(p => p.id === id);
  const sirve = (id) => { const p = byId(id); return p && visibleEn(p, level); };

  if (!storage) {
    // Sin almacenamiento: índice derivado de la fecha. Estable dentro del día.
    const vis = pool.filter(p => visibleEn(p, level));
    const n = Math.floor(Date.parse(today) / 86400000);
    return { phrase: vis[((n % vis.length) + vis.length) % vis.length], day: today, left: null, seen: true };
  }

  let s = read(storage);
  if (s && s.day === today && byId(s.id)) {
    return { phrase: byId(s.id), day: today, left: s.queue.length, seen: !!s.seen };
  }

  // Día nuevo (o primer uso): sacar la siguiente carta.
  // Se descartan ids que ya no existan en el banco, por si se editó.
  let queue = (s?.queue || []).filter(byId);
  if (!queue.length) queue = buildDeck(rnd);

  /* Los ítems por encima del nivel del alumno se saltan, pero vuelven AL FINAL
     de la cola en vez de descartarse: si más adelante sube de nivel, los ve.
     El tope evita el bucle si ninguno sirve (nivel muy bajo, banco muy alto). */
  let id = null;
  for (let i = 0; i < queue.length; i++) {
    const cand = queue.shift();
    if (sirve(cand)) { id = cand; break; }
    queue.push(cand);
  }
  if (id === null) id = queue.shift();   // nada calza: mejor una frase que ninguna

  const next = { v: SCHEMA_V, day: today, id, queue, seen: false };
  try { storage.setItem(KEY, JSON.stringify(next)); } catch (e) { /* modo privado */ }
  return { phrase: byId(id), day: today, left: queue.length, seen: false };
}

/* Anota que el aviso de hoy ya se mostró, para que no vuelva a saltar solo.
   Solo marca si el registro guardado sigue siendo el de hoy: si el usuario
   dejó la pestaña abierta y cruzó la medianoche, no se pisa el día nuevo. */
export function markSeen(storage, { now = new Date() } = {}) {
  if (!storage) return;
  const s = read(storage);
  if (!s || s.day !== localDayISO(now) || s.seen) return;
  try { storage.setItem(KEY, JSON.stringify({ ...s, seen: true })); } catch (e) { /* modo privado */ }
}
