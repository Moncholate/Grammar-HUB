import { useEffect, useState } from 'react';

const DISMISS_KEY = 'gh_install_dismissed';
const SEEN_KEY = 'gh_install_seen';

/** Corriendo como app instalada (no en una pestaña del navegador). */
const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches === true ||
  window.navigator.standalone === true;

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

const readDismissed = () => {
  try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
};

/**
 * Estado único de instalación de la PWA.
 *
 * Detectar "ya está instalada" es sorprendentemente difícil: `appinstalled` solo
 * avisa en la sesión donde ocurrió la instalación, y `display-mode: standalone`
 * solo es cierto cuando ya estás DENTRO de la app instalada, no cuando abres el
 * sitio en el navegador. Por eso el aviso reaparecía una y otra vez. Aquí se
 * combinan tres señales y se recuerda el descarte en localStorage.
 */
export function usePwaInstall() {
  // El evento puede dispararse antes de que React monte; index.html lo guarda.
  const [event, setEvent] = useState(() => window.__ghInstall || null);
  const [installed, setInstalled] = useState(isStandalone);
  const [dismissed, setDismissed] = useState(readDismissed);
  // `checked` evita que el aviso parpadee antes de saber si ya está instalada.
  const [checked, setChecked] = useState(() => !navigator.getInstalledRelatedApps);
  // Se captura AL MONTAR: si ya se mostró alguna vez en este navegador, no se
  // vuelve a mostrar nunca. Es la única garantía real de no ser insistente,
  // porque cada navegador lleva su propio registro de apps instaladas: si se
  // instaló con uno y se navega con otro, el segundo no puede saberlo.
  const [seenBefore] = useState(() => {
    try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    const onReady = () => setEvent(window.__ghInstall);
    const onInstalled = () => {
      window.__ghInstall = null;
      setEvent(null);
      setInstalled(true);
    };
    window.addEventListener('gh-installable', onReady);
    window.addEventListener('appinstalled', onInstalled);

    // Chrome/Android: preguntar al sistema si la app ya está instalada. Requiere
    // `related_applications` en el manifest. Es la mejor señal disponible, pero
    // solo ve las apps instaladas desde ESTE navegador.
    navigator.getInstalledRelatedApps?.()
      .then(apps => { if (apps && apps.length) setInstalled(true); })
      .catch(() => {})
      .finally(() => setChecked(true));

    return () => {
      window.removeEventListener('gh-installable', onReady);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  /** Marca que el aviso ya se mostró, para no repetirlo en futuras visitas. */
  const markSeen = () => {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* modo privado */ }
  };

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* modo privado */ }
    setDismissed(true);
  };

  const install = async () => {
    const e = window.__ghInstall;
    if (!e) return false;
    e.prompt();
    const { outcome } = await e.userChoice;   // el evento sirve una sola vez
    window.__ghInstall = null;
    setEvent(null);
    if (outcome === 'accepted') setInstalled(true);
    return outcome === 'accepted';
  };

  // Bloqueos que aplican pase lo que pase
  const blocked = installed || dismissed || seenBefore || !checked;

  return {
    installed,
    dismissed,
    dismiss,
    install,
    markSeen,
    /** Hay un evento real del navegador para lanzar la instalación. */
    canPrompt: !blocked && !!event,
    /** iOS no expone ese evento: solo se pueden dar instrucciones manuales. */
    needsManualSteps: !blocked && !event && isIOS(),
  };
}
