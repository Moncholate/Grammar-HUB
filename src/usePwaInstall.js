import { useEffect, useState } from 'react';

const DISMISS_KEY = 'gh_install_dismissed';
const INSTALLED_KEY = 'gh_installed';

/** Corriendo como app instalada (no en una pestaña del navegador). */
const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches === true ||
  window.navigator.standalone === true;

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

const read = key => {
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
};
const write = (key, on) => {
  try { on ? localStorage.setItem(key, '1') : localStorage.removeItem(key); } catch { /* modo privado */ }
};

/**
 * Estado único de instalación de la PWA.
 *
 * Reconocer que la app YA está instalada es el punto difícil, porque las señales
 * obvias no sirven desde una pestaña del navegador:
 *   - `appinstalled` solo avisa en la sesión donde ocurrió la instalación.
 *   - `display-mode: standalone` solo es cierto DENTRO de la app instalada.
 *
 * La clave: la app instalada y el navegador comparten localStorage, porque es el
 * mismo origen. Así que al abrir la app instalada se deja una marca, y esa marca
 * queda visible después desde la pestaña normal. Se combina con
 * `getInstalledRelatedApps()`, que le pregunta directo al sistema, y esa consulta
 * tambien sirve para LIMPIAR la marca si la app se desinstalo.
 */
export function usePwaInstall() {
  // El evento puede dispararse antes de que React monte; index.html lo guarda.
  const [event, setEvent] = useState(() => window.__ghInstall || null);
  const [installed, setInstalled] = useState(() => isStandalone() || read(INSTALLED_KEY));
  const [dismissed, setDismissed] = useState(() => read(DISMISS_KEY));
  // Evita que el aviso parpadee antes de saber si ya está instalada.
  const [checked, setChecked] = useState(() => !navigator.getInstalledRelatedApps);

  useEffect(() => {
    // Si estamos dentro de la app instalada, dejar la marca para que la pestaña
    // del navegador tambien sepa que existe.
    if (isStandalone()) write(INSTALLED_KEY, true);

    const onReady = () => setEvent(window.__ghInstall);
    const onInstalled = () => {
      window.__ghInstall = null;
      setEvent(null);
      setInstalled(true);
      write(INSTALLED_KEY, true);
    };
    window.addEventListener('gh-installable', onReady);
    window.addEventListener('appinstalled', onInstalled);

    // Consulta al sistema. Requiere `related_applications` e `id` en el manifest.
    navigator.getInstalledRelatedApps?.()
      .then(apps => {
        const yes = !!(apps && apps.length);
        setInstalled(yes);
        write(INSTALLED_KEY, yes);   // tambien limpia la marca si se desinstalo
      })
      .catch(() => {})
      .finally(() => setChecked(true));

    return () => {
      window.removeEventListener('gh-installable', onReady);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    write(DISMISS_KEY, true);
    setDismissed(true);
  };

  const install = async () => {
    const e = window.__ghInstall;
    if (!e) return false;
    e.prompt();
    const { outcome } = await e.userChoice;   // el evento sirve una sola vez
    window.__ghInstall = null;
    setEvent(null);
    if (outcome === 'accepted') { setInstalled(true); write(INSTALLED_KEY, true); }
    return outcome === 'accepted';
  };

  const blocked = installed || dismissed || !checked;

  return {
    installed,
    dismissed,
    dismiss,
    install,
    /** Hay un evento real del navegador para lanzar la instalación. */
    canPrompt: !blocked && !!event,
    /** iOS no expone ese evento: solo se pueden dar instrucciones manuales. */
    needsManualSteps: !blocked && !event && isIOS(),
  };
}
