/* La analogía de los bloques, en sus dos estados.
   ----------------------------------------------------------------------------
   El contraste ES el mensaje: T-Rex de cientos de piezas contra un dinosaurio de
   ocho. Desde 2026-08-13 el chico empieza TAPADO y aparece al tocar, para que el
   contraste llegue de golpe en vez de estar ya ahí.

   Eso mete una forma nueva de romperse en silencio: si el remate o el texto de
   la figura chica se escaparan del estado «revelado», contarían el final antes
   de que pase y el chiste se cae sin que nada falle. Y al revés: si el botón
   dejara de tener nombre accesible, quien navega por teclado o lector se queda
   sin la mitad del mensaje.

   Se renderiza el COMPONENTE porque es donde vive la decisión, y JSX no lo
   importa Node directo: se compila con la misma herramienta que la app.

   Correr:  node tools/check-analogia.mjs        (desde Grammar HUB/) */
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { transformSync } from 'esbuild';

let problemas = 0;
const fallo = (m) => { console.log('   ✗ ' + m); problemas++; };

/* Compila el JSX a un módulo temporal. `translations` se importa desde i18n.js,
   que es JS puro, así que el texto que se comprueba es EL DE VERDAD.
   Dos detalles de Node que hacen falta y no son obvios:
     · el temporal va AL LADO del componente, porque su `../i18n` es relativo;
     · y hay que ponerle la extensión, que Vite resuelve sola y Node no. */
const tmp = new URL('../src/components/.analogia.tmp.mjs', import.meta.url);
const jsx = readFileSync(new URL('../src/components/BrickAnalogy.jsx', import.meta.url), 'utf8');
/* `jsx: 'automatic'` como en la app: el componente no importa React, así que la
   transformación clásica emitiría `React.createElement` y reventaría. */
const js = transformSync(jsx, { loader: 'jsx', jsx: 'automatic', format: 'esm' }).code
  .replace(/from ['"]\.\.\/i18n['"]/, "from '../i18n.js'");
writeFileSync(tmp, js);

globalThis.window = { localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } };

/* `tmp.href` y no la ruta: en Windows convertir a mano deja «C:\C:\…». */
const { default: BrickAnalogy } = await import(tmp.href);
const { translations } = await import('../src/i18n.js');
rmSync(tmp);

console.log('GRAMMAR HUB · la analogía de los bloques\n');

for (const lang of ['es', 'en']) {
  const t = translations[lang];
  const html = renderToStaticMarkup(createElement(BrickAnalogy, { lang }));
  console.log(`${lang} · estado inicial (el chico tapado)`);

  /* 1. El T-Rex se ve desde el principio: es el planteamiento. */
  if (!html.includes('dino-grande.svg')) fallo(`[${lang}] no se muestra el T-Rex`);

  /* 2. El chico NO, ni su figura ni su explicación. */
  if (html.includes('dino-chico.svg')) fallo(`[${lang}] la figura chica se ve antes de tocar`);
  if (html.includes(t.whyBricksL2)) fallo(`[${lang}] el texto de la figura chica adelanta el chiste`);

  /* 3. Y el remate tampoco: nombra el diente y la figura simple, o sea cuenta
        el final. Es lo que más fácil se escapa al tocar el componente. */
  if (html.includes(t.whyBricksPunch)) fallo(`[${lang}] el remate se lee antes de la revelación`);

  /* 4. Pero el título de la columna SÍ, porque es la pregunta. */
  if (!html.includes(t.whyBricksL2Title)) fallo(`[${lang}] falta el título de la segunda columna`);

  /* 5. Hay una forma evidente y accesible de destapar. */
  if (!html.includes(t.whyBricksReveal)) fallo(`[${lang}] no hay botón para descubrir`);
  if (!html.includes(t.whyBricksRevealAria)) fallo(`[${lang}] el botón no tiene nombre accesible`);
  if (!/<button[^>]*aria-label/.test(html)) fallo(`[${lang}] el nombre accesible no cuelga de un button`);

  if (!problemas) console.log('   ✓ T-Rex a la vista · figura, texto y remate escondidos · botón con nombre');
}

/* ── El otro estado ─────────────────────────────────────────────────────────
   `renderToStaticMarkup` no puede hacer clic, así que el estado destapado se
   monta arrancando `revelado` en true. Es medio artesanal, pero renderiza EL
   COMPONENTE de verdad: si la figura chica tuviera mal la ruta, le faltara el
   `alt` o el remate se hubiera quedado colgando de la rama que no es, aquí
   revienta. Comprobarlo leyendo el JSX no lo habría cazado. */
console.log('\nestado destapado');
const tmp2 = new URL('../src/components/.analogia2.tmp.mjs', import.meta.url);
const conRevelado = js.replace('useState(false)', 'useState(true)');
if (conRevelado === js) fallo('no se encontró el estado inicial de `revelado`; este bloque ya no prueba nada');
writeFileSync(tmp2, conRevelado);
const { default: Revelada } = await import(tmp2.href);
rmSync(tmp2);
const abierto = renderToStaticMarkup(createElement(Revelada, { lang: 'es' }));
const es = translations.es;
if (!abierto.includes('dino-chico.svg')) fallo('destapado y no aparece la figura chica');
if (!abierto.includes(es.whyBricksL2)) fallo('destapado y falta el texto de la figura chica');
if (!abierto.includes(es.whyBricksPunch)) fallo('destapado y falta el remate');
if (abierto.includes(es.whyBricksReveal)) fallo('el botón de descubrir sigue ahí después de descubrir');
if (!/alt="[^"]{20,}"/.test(abierto)) fallo('la figura chica se queda sin descripción para lectores');
if (!abierto.includes('aria-live')) fallo('el remate aparece sin avisar a un lector de pantalla');
if (!problemas) console.log('   ✓ figura, texto y remate presentes · el botón desaparece · con alt y aria-live');

/* El alto de la caja tapada tiene que ser el MISMO que el de la destapada: es lo
   que hace el chiste. Si la caja creciera al revelar, el vacío alrededor de los
   ocho bloques se perdería en la animación de tamaño. */
console.log('\nla caja no cambia de tamaño al destaparse');
const html = renderToStaticMarkup(createElement(BrickAnalogy, { lang: 'es' }));
const cajas = html.match(/h-32 sm:h-36/g) || [];
if (cajas.length !== 2) fallo(`hay ${cajas.length} cajas con el alto fijo, y son 2`);
else console.log('   ✓ las dos columnas miden igual, tapada o no');

console.log(problemas ? `\n✗ ${problemas} problema(s)` : '\nANALOGÍA OK');
process.exit(problemas ? 1 : 0);
