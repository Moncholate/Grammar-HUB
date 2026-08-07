/* Genera los dos SVG definitivos AL MISMO TAMAÑO DE LADRILLO y calcula el
   porcentaje de alto con que hay que mostrarlos para que sigan a escala.
   Es la parte que se puede arruinar sin darse cuenta: si cada figura se ajusta
   a su caja, el T-rex —que es ancho— se encoge y termina VIÉNDOSE más chico
   que el pequeño, o sea al revés del mensaje. */
import { writeFileSync, readFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { buildLetter } from './render.mjs';
import { TREX, CHICO, ojoSVG } from './piezas.mjs';

const S = 26;   // mismo stud para los dos: son el mismo juego de piezas

const uno = (def, id) => {
  const L = buildLetter(def, S, id);
  return { L, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.W.toFixed(1)} ${L.Ht.toFixed(1)}" width="${L.W.toFixed(1)}" height="${L.Ht.toFixed(1)}"><defs>${L.defs}</defs>${L.g}${ojoSVG(L, def.ojo, S / 2, def.ojoColor)}</svg>` };
};

const a = uno(TREX, 'g_'), b = uno(CHICO, 'p_');
writeFileSync('out-grande.svg', a.svg);
writeFileSync('out-chico.svg', b.svg);

const pct = (b.L.Ht / a.L.Ht * 100).toFixed(1);
console.log(`grande ${a.L.W.toFixed(0)}x${a.L.Ht.toFixed(0)} · ${TREX.bricks.length} piezas`);
console.log(`chico  ${b.L.W.toFixed(0)}x${b.L.Ht.toFixed(0)} · ${CHICO.bricks.length} piezas`);
console.log(`\nalto del chico en la tarjeta: ${pct}%  (el grande va al 100%)`);

/* Maqueta de las dos tarjetas tal cual quedan en el Hub. */
const H = 170;
const card = (x, { L, svg }, rel, titulo, texto) => {
  const dh = H * rel, esc = dh / L.Ht, dw = L.W * esc;
  const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return `<g transform="translate(${x},0)">
    <rect width="340" height="262" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
    <g transform="translate(${(340 - dw) / 2},${12 + (H - dh)}) scale(${esc})">${inner}</g>
    <text x="14" y="212" font-family="sans-serif" font-size="11" font-weight="700" fill="#334155" letter-spacing="0.6">${titulo}</text>
    <text x="14" y="232" font-family="sans-serif" font-size="11" fill="#475569">${texto}</text>
  </g>`;
};
const hoja = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 710 280" width="710" height="280"><rect width="710" height="280" fill="#ffffff"/>
${card(10, a, 1, 'EN TU IDIOMA', 'Armas esto sin pensarlo.')}
${card(360, b, b.L.Ht / a.L.Ht, 'EN INGLÉS, POR AHORA', 'Y está bien: se entiende.')}</svg>`;
writeFileSync('final.png', new Resvg(hoja, { fitTo: { mode: 'width', value: 1420 } }).render().asPng());
console.log(`peso: grande ${(a.svg.length / 1024).toFixed(0)} KB · chico ${(b.svg.length / 1024).toFixed(0)} KB`);
