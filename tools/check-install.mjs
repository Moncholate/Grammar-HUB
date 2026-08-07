/* Que el aviso de instalar pueda VOLVER.
   La v2 del hook guardaba `installed: true` sin fecha y nada lo borraba: una
   sola señal lo mataba para siempre en ese navegador, incluso tras desinstalar
   la app. Se recuperaba solo con ?resetInstall, que nadie adivina.

   Se prueba el hook, no el componente: `usePwaInstall.js` es JS puro (Node lo
   importa tal cual, sin compilar JSX) y es donde vive la decisión. useEffect no
   corre en SSR, y da igual: lo que importa es el estado INICIAL, que es donde
   se lee la marca guardada y donde estaba el bug.

   Correr:  node tools/check-install.mjs        (desde Grammar HUB/) */
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

const DIA = 24 * 60 * 60 * 1000;
const definir = (k, v) => Object.defineProperty(global, k, { value: v, configurable: true, writable: true });

/** Monta un navegador de mentira. */
function navegador({ guardado = null, claveVieja = null, hayEvento = true, ios = false, app = false } = {}) {
  const store = new Map();
  if (guardado) store.set('gh_pwa_v3', JSON.stringify(guardado));
  if (claveVieja) store.set('gh_pwa_v2', JSON.stringify(claveVieja));

  const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: k => store.delete(k),
  };
  // En Node 22 `navigator` es un global de solo lectura: hay que redefinirlo.
  const nav = {
    userAgent: ios ? 'iPhone' : 'Mozilla/5.0 (Linux; Android 14) Chrome/120',
    standalone: ios ? app : undefined,
    // Sin getInstalledRelatedApps: `checked` arranca en true y la decisión se
    // puede tomar ya en el primer render, que es lo que se quiere medir.
  };
  definir('navigator', nav);
  definir('localStorage', localStorage);
  definir('location', { search: '' });
  definir('window', {
    __ghInstall: hayEvento ? { prompt() {}, userChoice: Promise.resolve({ outcome: 'dismissed' }) } : null,
    matchMedia: () => ({ matches: !ios && app, addEventListener() {}, removeEventListener() {} }),
    navigator: nav,
    localStorage,
    addEventListener() {}, removeEventListener() {},
  });
}

const { usePwaInstall } = await import('../src/usePwaInstall.js');

/** Devuelve lo que el componente mostraría con ese navegador. */
function mostrar(estado) {
  navegador(estado);
  let s;
  const Probe = () => { s = usePwaInstall(); return null; };
  renderToStaticMarkup(createElement(Probe));
  return {
    // El panel grande sale solo (InstallPrompt: auto = canPrompt || needsManualSteps)
    panel: s.canPrompt || s.needsManualSteps,
    // El botón chico y permanente
    boton: s.canInstallManually,
  };
}

const casos = [
  { nombre: 'sin nada guardado → sale el panel',
    estado: {}, panel: true },

  { nombre: 'instalada hace 2 días → callado, pero queda el botón',
    estado: { guardado: { installedAt: Date.now() - 2 * DIA } }, panel: false, boton: true },

  { nombre: 'instalada hace 61 días sin renovar → VUELVE el panel (se desinstaló)',
    estado: { guardado: { installedAt: Date.now() - 61 * DIA } }, panel: true },

  { nombre: 'marca vieja de la v2 (installed:true, sin fecha) → se ignora, vuelve',
    estado: { claveVieja: { installed: true } }, panel: true },

  { nombre: 'pospuesto → el panel no insiste, el botón sigue disponible',
    estado: { guardado: { snoozeUntil: Date.now() + 30 * DIA } }, panel: false, boton: true },

  { nombre: 'pospuesto y el navegador no ofrece instalar → nada',
    estado: { guardado: { snoozeUntil: Date.now() + 30 * DIA }, hayEvento: false },
    panel: false, boton: false },

  { nombre: 'iOS sin marca → instrucciones manuales',
    estado: { hayEvento: false, ios: true }, panel: true },

  { nombre: 'corriendo YA como app instalada → ni panel ni botón',
    estado: { app: true, guardado: { installedAt: Date.now() } }, panel: false, boton: false },
];

let fallos = 0;
for (const c of casos) {
  const r = mostrar(c.estado);
  const malas = ['panel', 'boton']
    .filter(k => c[k] !== undefined && c[k] !== r[k])
    .map(k => `${k}: esperaba ${c[k]}, dio ${r[k]}`);
  if (malas.length) fallos++;
  console.log(`  ${malas.length ? '✗' : '✓'} ${c.nombre}${malas.length ? '  → ' + malas.join(' · ') : ''}`);
}

console.log(fallos ? `\n${fallos} fallo(s)` : '\nAVISO DE INSTALACIÓN OK');
process.exit(fallos ? 1 : 0);
