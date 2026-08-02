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

/* ── Fases ────────────────────────────────────────────────────────────────
   Los tramos NO se agotan uno antes de empezar el siguiente. Con el banco
   completo el tramo de entrada solo pasa los 90 ítems, o sea que un alumno de
   un semestre no alcanzaría a ver JAMÁS un ítem de interferencia. La baraja se
   arma por fases, y la mezcla de cada fase dice de qué tramo sale cada carta:

     días 1-20    solo entrada — bajar la guardia antes de pedir nada
     días 21-60   2 de cada 3 de entrada, 1 de método
     día 61+      parejo entre los tres

   El patrón de la fase 2 es además el cupo que pidió el docente para los ítems
   de corrección de errores: como máximo uno de cada tres, nunca de los primeros. */
const FASES = [
  { hasta: 20,       mezcla: [1] },
  { hasta: 60,       mezcla: [1, 1, 2] },
  { hasta: Infinity, mezcla: [1, 2, 3, 2] },
];

/* ── Adyacencia ───────────────────────────────────────────────────────────
   Hay pares que por separado están bien y juntos se contradicen o suenan a
   reproche. La clase de un ítem sale de su área (o de su tag, para la ética). */
const CLASE_POR_AREA = { 2: 'interferencia', 4: 'variedades', 7: 'evaluacion', 11: 'evaluacion' };
const clase = (p) => (p.tag === 'ia_etica' ? 'etica' : CLASE_POR_AREA[p.area] || null);

const CHOCAN = new Set([
  'interferencia|interferencia',   // dos correcciones seguidas = la app te reta
  'interferencia|etica', 'etica|interferencia', // "este error cometes" + "no copies" = sospecha
  'variedades|evaluacion', 'evaluacion|variedades', // "ambas son correctas" y "se evalúa precisión"
  'evaluacion|evaluacion',         // dos de exigencia seguidos
  'etica|etica',
]);

const chocan = (a, b) => {
  const ca = clase(a), cb = clase(b);
  return !!ca && !!cb && CHOCAN.has(`${ca}|${cb}`);
};

/* Separa los pares que chocan: cuando una carta choca con la anterior, se
   adelanta la primera de más adelante que no choque. Si no hay ninguna, se deja
   como está — mejor un par repetido que una baraja incompleta.

   El candidato TIENE que ser del mismo tramo. Sin esa restricción la reparación
   rompía las fases: se traía una carta de método a los primeros 20 días, que
   deben ser solo de entrada. Cada posición conserva su tramo y solo cambia qué
   carta de ese tramo la ocupa. */
function separar(deck, byId) {
  /* Dos pasadas: la primera hacia adelante y la segunda hacia atrás. Una sola
     pasada dejaba unos pocos choques cerca del final de cada tramo, donde ya no
     quedaban candidatos por delante; buscando también hacia atrás se resuelven. */
  for (const haciaAdelante of [true, false]) {
    for (let i = 1; i < deck.length; i++) {
      const prev = byId(deck[i - 1]);
      if (!chocan(prev, byId(deck[i]))) continue;
      const tramoAqui = tier(byId(deck[i]));
      const orden = haciaAdelante
        ? Array.from({ length: deck.length - i - 1 }, (_, k) => i + 1 + k)
        : Array.from({ length: i - 1 }, (_, k) => i - 2 - k);
      for (const j of orden) {
        const cand = byId(deck[j]);
        if (tier(cand) !== tramoAqui) continue;      // no romper las fases
        if (chocan(prev, cand)) continue;
        if (i + 1 < deck.length && chocan(cand, byId(deck[i + 1]))) continue;
        // Al traerla de atrás hay que revisar el hueco que deja.
        const movida = byId(deck[i]);
        if (!haciaAdelante) {
          if (j > 0 && chocan(byId(deck[j - 1]), movida)) continue;
          if (j + 1 < deck.length && j + 1 !== i && chocan(movida, byId(deck[j + 1]))) continue;
        }
        [deck[i], deck[j]] = [deck[j], deck[i]];
        break;
      }
    }
  }
  return deck;
}

/* ── Encadenado ───────────────────────────────────────────────────────────
   Lo contrario de la adyacencia: hay pares que deben caer JUNTOS, no separados.
   Un ítem de historia puede declarar `explica: <id>` y entonces se coloca unos
   días DESPUÉS del error que explica. Primero el alumno ve que en inglés hay que
   poner el sujeto siempre; tres o cuatro días después, que es porque el idioma
   perdió las terminaciones que lo indicaban. El orden importa: la explicación
   histórica sin el error antes es un dato suelto.

   Igual que `separar`, solo mueve dentro del mismo tramo — busca el primer hueco
   de ese tramo a partir del segundo día siguiente, para no romper las fases. */
const HUECO_MAX = 10;   // si no hay sitio en 10 posiciones, se deja donde estaba

function encadenar(deck, byId, pool) {
  const pos = new Map(deck.map((id, i) => [id, i]));
  for (const p of pool) {
    if (!p.explica) continue;
    const i = pos.get(p.explica), j = pos.get(p.id);
    if (i === undefined || j === undefined) continue;
    if (j > i && j - i <= HUECO_MAX) continue;         // ya cae bastante cerca

    /* Cambia de sitio UNA de las dos, la que se pueda:
       (a) llevar la explicación a los días siguientes al error, o
       (b) si no hay hueco —o si la explicación ya venía ANTES—, traer el error
           a los días previos a la explicación. El resultado es el mismo, el
           alumno ve primero el error y después el porqué.
       Solo se cambia por una carta del mismo tramo, para no romper las fases. */
    const mover = (quien, desde, hastaK, paso) => {
      for (let k = hastaK; k !== desde && k >= 0 && k < deck.length; k += paso) {
        if (tier(byId(deck[k])) !== tier(quien)) continue;
        /* La carta desplazada ocupa el hueco que deja: hay que comprobar que
           ahí no choque, porque este paso corre al final y ya no hay una
           separación después que lo arregle. */
        const desplazada = byId(deck[k]);
        const hueco = pos.get(quien.id);
        if (hueco > 0 && chocan(byId(deck[hueco - 1]), desplazada)) continue;
        if (hueco + 1 < deck.length && chocan(desplazada, byId(deck[hueco + 1]))) continue;
        /* Y al revés: cuando el que se mueve es el ERROR (clase conflictiva, a
           diferencia de la explicación) hay que comprobar que no choque en su
           destino. Sin esto la cadena arreglaba una cosa y rompía otra. */
        if (k > 0 && k - 1 !== hueco && chocan(byId(deck[k - 1]), quien)) continue;
        if (k + 1 < deck.length && k + 1 !== hueco && chocan(quien, byId(deck[k + 1]))) continue;
        deck[k] = quien.id;
        deck[hueco] = desplazada.id;
        pos.set(quien.id, k);
        pos.set(desplazada.id, hueco);
        return true;
      }
      return false;
    };

    // (a) la explicación baja hasta los 2-10 días después del error
    if (j > i || !mover(byId(p.explica), i, Math.max(0, j - 2), -1)) {
      mover(p, j, Math.min(deck.length - 1, i + 2), +1);
    }
  }
  return deck;
}

/* Baraja completa de ids: mezclada dentro de cada tramo, repartida por fases,
   con los pares que chocan separados y los que se explican, encadenados. */
export function buildDeck(rnd = Math.random) {
  const pilas = { 1: [], 2: [], 3: [] };
  const pool = eligible();
  for (const p of pool) (pilas[tier(p)] || pilas[2]).push(p.id);
  for (const t of [1, 2, 3]) pilas[t] = shuffle(pilas[t], rnd);

  const total = pool.length;
  const deck = [];
  while (deck.length < total) {
    const i = deck.length;
    const fase = FASES.find(f => i < f.hasta);
    const quiere = fase.mezcla[i % fase.mezcla.length];
    // Si el tramo que toca ya se acabó, se toma del primero que quede.
    const t = pilas[quiere].length ? quiere : [1, 2, 3].find(x => pilas[x].length);
    if (!t) break;
    deck.push(pilas[t].shift());
  }
  // Mapa y no `find`: la reparación mira muchos pares y con 400+ ítems una
  // búsqueda lineal dentro de dos bucles anidados se nota.
  const mapa = new Map(pool.map(p => [p.id, p]));
  const byId = (id) => mapa.get(id);
  /* `encadenar` va AL FINAL, y no en medio. Los ítems de historia no pertenecen
     a ninguna clase conflictiva, o sea que son el candidato perfecto para
     reparar un choque — y por eso una separación posterior se los robaba a su
     cadena y los mandaba a 190 días de distancia. Corriendo último, nada los
     mueve; a cambio, encadenar tiene que verificar él mismo que la carta que
     desplaza no choque en su nuevo hueco. */
  separar(deck, byId);
  return encadenar(deck, byId, pool);
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
