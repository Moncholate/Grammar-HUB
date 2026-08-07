/* ---------- color ---------- */
const hx = n => { n = Math.max(0, Math.min(255, Math.round(n))); return n.toString(16).padStart(2, '0'); };
const parse = h => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
const mix = (h, amt) => {
  let [r, g, b] = parse(h);
  if (amt >= 0) { r += (255 - r) * amt; g += (255 - g) * amt; b += (255 - b) * amt; }
  else { r *= (1 + amt); g *= (1 + amt); b *= (1 + amt); }
  return '#' + hx(r) + hx(g) + hx(b);
};

const P = { indigo: '#6366F1', coral: '#FB7185', amber: '#FBBF24', teal: '#2DD4BF' };

/* ---------- letras ---------- */
const LETTERS = {
  // H: el travesano es UNA pieza de 8 studs que amarra las dos columnas
  H: { cols: 8, units: 10, bricks: [
    { x: 0, y: 0, w: 2, h: 2, c: P.indigo }, { x: 6, y: 0, w: 2, h: 2, c: P.indigo },
    { x: 0, y: 2, w: 2, h: 2, c: P.amber },  { x: 6, y: 2, w: 2, h: 2, c: P.amber },
    { x: 0, y: 4, w: 8, h: 2, c: P.coral },
    { x: 0, y: 6, w: 2, h: 2, c: P.teal },   { x: 6, y: 6, w: 2, h: 2, c: P.teal },
    { x: 0, y: 8, w: 2, h: 2, c: P.indigo }, { x: 6, y: 8, w: 2, h: 2, c: P.indigo },
  ] },
  G: { cols: 8, units: 10, bricks: [
    { x: 0, y: 0, w: 8, h: 2, c: P.indigo },
    { x: 0, y: 2, w: 2, h: 2, c: P.indigo },
    { x: 0, y: 4, w: 2, h: 2, c: P.indigo }, { x: 4, y: 4, w: 4, h: 2, c: P.amber },
    { x: 0, y: 6, w: 2, h: 2, c: P.indigo }, { x: 6, y: 6, w: 2, h: 2, c: P.indigo },
    { x: 0, y: 8, w: 4, h: 2, c: P.indigo }, { x: 4, y: 8, w: 4, h: 2, c: P.amber },
  ] },
  // D: la panza sobresale 1 stud del filo de las barras; plates hacen la curva
  D: { cols: 9, units: 10, bricks: [
    { x: 0, y: 0, w: 8, h: 2, c: P.coral },
    { x: 0, y: 2, w: 2, h: 1, c: P.coral }, { x: 5, y: 2, w: 4, h: 1, c: P.indigo },
    { x: 0, y: 3, w: 2, h: 2, c: P.coral }, { x: 7, y: 3, w: 2, h: 2, c: P.coral },
    { x: 0, y: 5, w: 2, h: 2, c: P.coral }, { x: 7, y: 5, w: 2, h: 2, c: P.coral },
    { x: 0, y: 7, w: 2, h: 1, c: P.coral }, { x: 5, y: 7, w: 4, h: 1, c: P.indigo },
    { x: 0, y: 8, w: 8, h: 2, c: P.coral },
  ] },
  // ?: arco con voladizo + cola en escalera + punto suelto
  Q: { cols: 8, units: 11, bricks: [
    { x: 0, y: 0, w: 8, h: 2, c: P.teal },
    { x: 0, y: 2, w: 2, h: 2, c: P.teal }, { x: 6, y: 2, w: 2, h: 2, c: P.teal },
    { x: 4, y: 4, w: 4, h: 1, c: P.coral },
    { x: 2, y: 5, w: 4, h: 2, c: P.teal },
    { x: 2, y: 7, w: 2, h: 1, c: P.teal },
    { x: 2, y: 9, w: 2, h: 2, c: P.coral },
  ] },
};

/* ---------- render de la letra ---------- */
function buildLetter(def, s, idp) {
  const u = s / 2;                       // un stud = una media altura
  const dx = u * 0.80, dy = u * 0.56;
  // Los studs sobresalen por encima de la cara superior: alto del cilindro
  // (0.31u) mas el radio de su elipse (0.115u). El margen tiene que cubrirlo o
  // se recortan contra el borde del lienzo.
  const OVER = u * 0.235;
  const pad = u * 0.28;
  const sw = Math.max(0.6, u * 0.044);
  const { cols, units, bricks } = def;

  const occ = Array.from({ length: units }, () => Array(cols).fill(false));
  bricks.forEach(b => { for (let r = b.y; r < b.y + b.h; r++) for (let c = b.x; c < b.x + b.w; c++) occ[r][c] = true; });
  const filled = (r, c) => r >= 0 && r < units && c >= 0 && c < cols && occ[r][c];

  const W = cols * u + dx + pad * 2, Ht = units * u + dy + pad * 2;
  const ox = pad, oy = pad + dy;
  const X = c => ox + c * u, Y = r => oy + r * u;

  let defs = '';
  [...new Set(bricks.map(b => b.c))].forEach(col => {
    defs += `<linearGradient id="${idp}f${col.slice(1)}" x1="0" y1="0" x2="0" y2="1">`
      + `<stop offset="0" stop-color="${mix(col, .10)}"/><stop offset="1" stop-color="${mix(col, -.06)}"/></linearGradient>`;
  });

  const stud = (px, py, base, sc) => {
    const rx = u * 0.23 * sc, ry = rx * 0.5, hgt = u * 0.31 * sc;
    let g = '';
    g += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${mix(base, -.22)}"/>`;
    g += `<rect x="${(px - rx).toFixed(1)}" y="${(py - hgt).toFixed(1)}" width="${(2 * rx).toFixed(1)}" height="${hgt.toFixed(1)}" fill="${mix(base, .02)}"/>`;
    g += `<rect x="${(px + rx * 0.34).toFixed(1)}" y="${(py - hgt).toFixed(1)}" width="${(rx * 0.66).toFixed(1)}" height="${hgt.toFixed(1)}" fill="${mix(base, -.15)}" opacity="0.7"/>`;
    g += `<ellipse cx="${px.toFixed(1)}" cy="${(py - hgt).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${mix(base, .32)}" stroke="${mix(base, -.26)}" stroke-width="${(sw * 0.7).toFixed(2)}"/>`;
    g += `<ellipse cx="${(px - rx * 0.3).toFixed(1)}" cy="${(py - hgt - ry * 0.14).toFixed(1)}" rx="${(rx * 0.44).toFixed(1)}" ry="${(ry * 0.5).toFixed(1)}" fill="#ffffff" opacity="0.5"/>`;
    return g;
  };

  // pintor: hiladas de abajo hacia arriba
  const ys = [...new Set(bricks.map(b => b.y))].sort((a, b) => b - a);
  let g = '';
  for (const yy of ys) {
    const row = bricks.filter(b => b.y === yy).sort((a, b) => a.x - b.x);
    const studQ = [];
    for (const b of row) {
      const x0 = X(b.x), y0 = Y(b.y), w = b.w * u, ht = b.h * u;
      const edge = mix(b.c, -.34), topc = mix(b.c, .26), sidec = mix(b.c, -.30);
      // cara derecha por tramos expuestos
      let r = b.y;
      while (r < b.y + b.h) {
        if (filled(r, b.x + b.w)) { r++; continue; }
        let re = r; while (re + 1 < b.y + b.h && !filled(re + 1, b.x + b.w)) re++;
        const sy = Y(r), sh = (re - r + 1) * u;
        g += `<polygon points="${(x0 + w).toFixed(1)},${sy.toFixed(1)} ${(x0 + w + dx).toFixed(1)},${(sy - dy).toFixed(1)} ${(x0 + w + dx).toFixed(1)},${(sy + sh - dy).toFixed(1)} ${(x0 + w).toFixed(1)},${(sy + sh).toFixed(1)}" fill="${sidec}" stroke="${edge}" stroke-width="${sw.toFixed(2)}"/>`;
        r = re + 1;
      }
      // tapas por tramos sin pieza encima
      let k = b.x;
      while (k < b.x + b.w) {
        if (filled(b.y - 1, k)) { k++; continue; }
        let ke = k; while (ke + 1 < b.x + b.w && !filled(b.y - 1, ke + 1)) ke++;
        const cx0 = X(k), capW = (ke - k + 1) * u;
        g += `<polygon points="${cx0.toFixed(1)},${y0.toFixed(1)} ${(cx0 + capW).toFixed(1)},${y0.toFixed(1)} ${(cx0 + capW + dx).toFixed(1)},${(y0 - dy).toFixed(1)} ${(cx0 + dx).toFixed(1)},${(y0 - dy).toFixed(1)}" fill="${topc}" stroke="${edge}" stroke-width="${sw.toFixed(2)}"/>`;
        g += `<polygon points="${cx0.toFixed(1)},${y0.toFixed(1)} ${(cx0 + capW * 0.5).toFixed(1)},${y0.toFixed(1)} ${(cx0 + capW * 0.5 + dx).toFixed(1)},${(y0 - dy).toFixed(1)} ${(cx0 + dx).toFixed(1)},${(y0 - dy).toFixed(1)}" fill="#ffffff" opacity="0.08"/>`;
        for (let q = k; q <= ke; q++) studQ.push([q, b.c]);
        k = ke + 1;
      }
      // frente: una cara por pieza => la junta queda visible
      g += `<rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${w.toFixed(1)}" height="${ht.toFixed(1)}" rx="${(u * 0.11).toFixed(1)}" fill="url(#${idp}f${b.c.slice(1)})" stroke="${edge}" stroke-width="${sw.toFixed(2)}"/>`;
      g += `<rect x="${(x0 + sw).toFixed(1)}" y="${(y0 + sw).toFixed(1)}" width="${(w - 2 * sw).toFixed(1)}" height="${(ht * 0.30).toFixed(1)}" rx="${(u * 0.09).toFixed(1)}" fill="#ffffff" opacity="0.10"/>`;
    }
    // un stud por columna de stud, en dos profundidades
    for (const [q, col] of studQ) {
      const cx = X(q) + u * 0.5, y0 = Y(yy);
      for (const [v, sc] of [[0.66, 1.0], [0.32, 0.93]]) g += stud(cx + v * dx, y0 - v * dy, col, sc);
    }
  }

  let cmin = 999, cmax = -1, ymax = 0;
  bricks.forEach(b => { cmin = Math.min(cmin, b.x); cmax = Math.max(cmax, b.x + b.w - 1); ymax = Math.max(ymax, b.y + b.h); });
  // Borde superior real: la cara de arriba del ladrillo llega a `pad` (la
  // proyeccion `dy` ya esta descontada en `oy`), y los studs sobresalen OVER.
  return { defs, g, W, Ht, pad, dx, dy, u, cmin, cmax, ymax, X, Y, ytop: pad - OVER };
}

/**
 * Extension REAL de lo dibujado. El borde superior no es la cara del ladrillo
 * sino la punta de los studs, y el derecho no es la cara frontal sino la
 * proyeccion 3D. Medir mal esto descentra la letra dentro del icono.
 */

export { mix, P, buildLetter };
