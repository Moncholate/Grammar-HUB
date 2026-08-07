import { P } from './render.mjs';
const CORAL = P.coral, AMBER = P.amber, TEAL = P.teal, INDIGO = P.indigo;
const HUESO = '#F1F5F9';   // dientes
const TINTA_OJO = '#1E293B';
const ROSA  = '#E11D48';   // acento dentro de la misma familia: lee como detalle, no como pieza equivocada


const COLS = 50, ROWS = 30;
const V = '.';                       // vacío
const C = {                          // paleta: la de la referencia, roja/oscura/gris
  R: '#E11D48',   // rojo base
  L: '#FB7185',   // rojo claro (lomo, reflejos)
  K: '#334155',   // rayas oscuras
  G: '#94A3B8',   // panza y pata delantera
  D: '#475569',   // pata LEJANA: bien oscura, si no se funde con la cercana
  W: '#F1F5F9',   // dientes
  P: '#F472B6',   // lengua
  A: '#FBBF24',   // garras
  B: '#B45309',   // la MISMA garra pero en sombra, para la pata lejana
};

const g = Array.from({ length: ROWS }, () => Array(COLS).fill(V));
const dentro = (x, y) => x >= 0 && x < COLS && y >= 0 && y < ROWS;
const put = (x, y, ch) => { if (dentro(x, y)) g[y][x] = ch; };
const rect = (x, y, w, h, ch) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) put(i, j, ch); };
/* Tramo horizontal en una fila: x0..x1 inclusive. Dibujar la silueta fila por
   fila da control exacto; con funciones de curva salía un cuerpo plano y las
   dos patas fundidas en una sola losa. */
const span = (y, x0, x1, ch) => { for (let x = x0; x <= x1; x++) put(x, y, ch); };
const spans = (lista, ch) => lista.forEach(([y, a, b]) => span(y, a, b, ch));

// ── cola: fina y BAJA, muy por debajo de la joroba del lomo ──
spans([
  [11, 0, 5], [12, 0, 5],
  [10, 4, 11], [13, 4, 11],
  [9, 9, 14], [14, 9, 14],
], 'R');
// ── cuerpo: joroba alta. TERMINA en x=28 para que el cuello se estreche ──
spans([
  [2, 17, 24], [3, 15, 26], [4, 14, 27], [5, 13, 28],
  [6, 12, 28], [7, 12, 28], [8, 12, 28], [9, 12, 28],
  [10, 12, 28], [11, 12, 28], [12, 12, 28], [13, 13, 28],
  [14, 14, 28], [15, 15, 28], [16, 16, 27], [17, 17, 26],
], 'R');
// ── cuello: mucho mas delgado que el cuerpo. Ese pellizco es lo que separa
//    la cabeza del lomo; sin el, todo el lado derecho es una sola masa ──
spans([
  [8, 27, 36], [9, 27, 37], [10, 28, 38], [11, 28, 38], [12, 29, 38], [13, 29, 37],
], 'R');
// ── cabeza: MAS ALTA que el cuello y con el craneo por encima de el ──
spans([
  [6, 39, 47], [7, 38, 48], [8, 37, 49], [9, 37, 49],
  [10, 36, 49], [11, 36, 49], [12, 36, 49], [13, 36, 49], [14, 36, 48],
], 'R');
/* ── DENTADURA SERRADA ────────────────────────────────────────────────────────
   Dos bandas blancas macizas leían como dos plates, no como dientes. Ahora hay
   una encía maciza y, colgando de ella, colmillos de UN stud con un stud de
   hueco: eso es lo que da la sierra. Arriba y abajo van desfasados para que
   engranen, y los dos de adelante bajan una fila más — el canino largo es lo
   que lo hace amenazante, y contrasta con la pupila redonda del pequeño. */
span(15, 37, 48, 'W');                                   // encía de arriba
for (let x = 37; x <= 48; x += 2) put(x, 16, 'W');       // colmillos hacia abajo
put(47, 17, 'W'); put(45, 17, 'W');                      // los dos delanteros, más largos
span(17, 37, 40, 'P');                                   // lengua, al fondo
//   el resto de y=16..18 queda VACÍO: es la boca abierta
for (let x = 38; x <= 46; x += 2) put(x, 19, 'W');       // colmillos hacia arriba
span(20, 37, 47, 'W');                                   // encía de abajo
spans([[21, 36, 47], [22, 36, 46]], 'R');                // mandíbula
spans([[15, 34, 36], [16, 34, 36], [17, 34, 37], [18, 34, 36],
       [19, 34, 36], [20, 35, 36]], 'R');                // articulación

/* ── LAS DOS PATAS ────────────────────────────────────────────────────────────
   El T-rex es BIPEDO: no son delantera y trasera, son la izquierda y la derecha
   del mismo par, y salen de la MISMA cadera. Yo las habia separado como si
   fuera un cuadrupedo.
   En vista de perfil eso significa que se superponen — y esta bien. Lo que hace
   que el solape lea como PROFUNDIDAD y no como error es el tono: la de mas
   lejos va oscura, la de mas cerca clara y corrida un poco a la derecha. La
   lejana se dibuja PRIMERO para que la cercana la tape en las columnas que
   comparten. */
/* `dx` corre la cadera; `dy` SUBE el pie. La profundidad va en la ALTURA, no en
   el costado: sobre un plano de suelo, lo que está más al fondo se apoya más
   arriba en la imagen. Correrlo de lado solo lo hace más largo, no más lejano —
   y eso fue lo que hice primero.
   La cadera se queda donde está: es la misma en las dos patas, porque el bicho
   es bípedo. Lo que se acorta es la parte de abajo. */
const pata = (dx, dy, muslo, resto, garra) => {
  for (let y = 15; y <= 20 - dy; y++) span(y, (y >= 19 ? 16 : 15) + dx, 21 + dx, muslo);
  for (let y = 21 - dy; y <= 25 - dy; y++) span(y, 16 + dx, 20 + dx, resto);
  spans([[26 - dy, 14 + dx, 21 + dx], [27 - dy, 14 + dx, 21 + dx]], resto);
  span(28 - dy, 13 + dx, 22 + dx, garra);
};
pata(0, 2, 'D', 'D', 'B');     // la de más lejos: en sombra y apoyada MÁS ARRIBA
pata(4, 0, 'R', 'G', 'A');     // la de más cerca

/* ── BRACITOS ─────────────────────────────────────────────────────────────────
   Faltaban. Son la firma del T-rex: cortos, pegados al pecho y con DOS garras
   — dos dedos, no tres. Cuelgan del pecho, en el hueco que queda entre el
   cuerpo y la cabeza ahora que el cuello es largo. */
/* Va en GRIS y no en rojo: pegado al pecho rojo y del mismo color se fundia con
   el cuerpo. El gris lo despega sin tener que separarlo — un brazo flotando
   romperia la regla de que toda pieza se apoya en otra. Ademas es el color que
   tiene en la referencia.
   La ventana libre es x 31..33: a la izquierda esta el muslo cercano (llega a
   x=30) y a la derecha la articulacion de la mandibula (empieza en x=34). */
spans([[16, 26, 28], [17, 27, 29], [18, 28, 30]], 'G');
put(28, 19, 'A'); put(30, 19, 'A');       // dos dedos, no tres

// ── panza gris: las 4 filas de abajo DE CADA COLUMNA, asi sigue la curva
for (let x = 12; x <= 31; x++) { let ultima = -1; for (let y = 0; y < ROWS; y++) if (g[y][x] === 'R') ultima = y;
  if (ultima >= 0) for (let y = Math.max(0, ultima - 3); y <= ultima; y++) if (g[y][x] === 'R') g[y][x] = 'G'; }
// ── lomo claro: la franja de arriba ──
for (let x = 0; x < COLS; x++) {
  for (let y = 0; y < ROWS; y++) { if (g[y][x] === 'R') { put(x, y, 'L'); if (g[y + 1] && g[y + 1][x] === 'R') put(x, y + 1, 'L'); break; } }
}
/* ── rayas: bandas diagonales sobre el lomo y la cola, como en la referencia.
   Solo sobre rojo, para que no se coman la panza ni los dientes. */
for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
  if ((g[y][x] === 'R' || g[y][x] === 'L') && ((x + Math.floor(y / 2) * 2) % 9) < 2 && y <= 14) g[y][x] = 'K';
}
// mancha del craneo y linea del maxilar: es lo que le da caracter a la cabeza
spans([[7, 41, 45], [8, 40, 43], [13, 38, 42], [14, 43, 47]], 'K');

// ojo: se dibuja aparte, encima
const OJO = { x: 40.5, y: 10.2 };

/* ── tejedor: cada fila se parte en piezas de 1..4 studs, con la junta corrida
   según la fila para que no queden alineadas. Eso es lo que hace que lea
   CONSTRUIDO y no pintado. */
const bricks = [];
for (let y = 0; y < ROWS; y++) {
  let x = 0;
  while (x < COLS) {
    const ch = g[y][x];
    if (ch === V) { x++; continue; }
    let fin = x; while (fin + 1 < COLS && g[y][fin + 1] === ch) fin++;
    let i = x;
    const desfase = (y * 3) % 4;                    // corre la primera junta por fila
    let primero = true;
    while (i <= fin) {
      const largo = primero && desfase ? Math.min(desfase, fin - i + 1)
        : Math.min(2 + ((i + y) % 3), fin - i + 1); // 2..4 studs
      bricks.push({ x: i, y, w: largo, h: 1, c: C[ch] });
      i += largo; primero = false;
    }
    x = fin + 1;
  }
}


export const TREX = { cols: COLS, units: ROWS, ojo: { ...OJO, r: 0.80 }, ojoColor: "#FBBF24", bricks };
const CHICO = { cols: 11, units: 12, ojo: { x: 6.6, y: 1.0, r: 0.50 }, bricks: [
  { x:5,  y:0,  w:4, h:2, c:TEAL },      // cabeza
  { x:8,  y:2,  w:2, h:1, c:TEAL },      // hocico
  { x:5,  y:2,  w:2, h:3, c:TEAL },      // cuello
  { x:2,  y:5,  w:7, h:3, c:TEAL },      // cuerpo
  { x:3,  y:8,  w:5, h:1, c:AMBER },     // panza
  { x:0,  y:6,  w:3, h:1, c:TEAL },      // cola
  { x:2,  y:9,  w:2, h:2, c:TEAL },      // pata
  { x:6,  y:9,  w:2, h:2, c:TEAL },      // pata
]};
/* El ojo va ENCIMA de las piezas: como celda de la grilla lo tapaba la fila de
   arriba, porque el pintor va de abajo hacia arriba.
   Se dibuja con CUENCA oscura y el iris grande. En la tarjeta la figura se ve a
   ~170px de alto, así que el ojo anterior —0,3 del stud— quedaba en 2 o 3
   píxeles y desaparecía. Todo se mide en studs para que escale con la figura. */
export function ojoSVG(L, o, u, color) {
  if (!o) return '';
  const cx = L.X(o.x), cy = L.Y(o.y);
  /* El radio va por figura: la cabeza del chico mide 2 studs, asi que el
     mismo ojo que en el T-rex se la comia entera. */
  const r = u * (o.r || 0.80);
  const q = (n) => n.toFixed(1);
  const el = (dx, dy, rx, ry, fill, extra = '') =>
    `<ellipse cx="${q(cx + dx)}" cy="${q(cy + dy)}" rx="${q(rx)}" ry="${q(ry)}" fill="${fill}"${extra}/>`;
  /* Pupila de ranura solo cuando el iris es de color: es la mirada de reptil
     de la referencia. El chiquitito lleva pupila redonda — con ranura queda con
     cara de depredador, que es lo contrario de lo que tiene que transmitir. */
  const ranura = !!color;
  return el(0, 0, r * 1.32, r * 1.24, TINTA_OJO, ' opacity="0.9"')          // cuenca
    + el(0, 0, r, r * 0.92, color || '#ffffff', ` stroke="${TINTA_OJO}" stroke-width="${q(u * 0.1)}"`)
    + el(r * 0.12, 0, r * (ranura ? 0.30 : 0.46), r * (ranura ? 0.74 : 0.46), TINTA_OJO)
    + el(-r * 0.34, -r * 0.30, r * 0.26, r * 0.20, '#ffffff', ' opacity="0.9"'); // brillo
}


export { CHICO };
