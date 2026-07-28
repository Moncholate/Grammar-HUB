import { useEffect, useState } from 'react';

// v2: nombre nuevo a proposito. El estado guardado por la version anterior se
// ignora, porque podia quedar atascado en "descartado para siempre".
const KEY = 'gh_pwa_v2';

const SNOOZE_DAYS = 90;
const DAY = 24 * 60 * 60 * 1000;

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
};
const save = patch => {
  try { localStorage.setItem(KEY, JSON.stringify({ ...load(), ...patch })); } catch { /* modo privado */ }
};

/** Corriendo como app instalada (no en una pestaña del navegador). */
const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches === true ||
  window.navigator.standalone === true;

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

/**
 * Estado de instalación de la PWA.
 *
 * Reglas, después de varias vueltas aprendiendo qué señal sirve para qué:
 *
 *  - `beforeinstallprompt` NO prueba que la app no esté instalada. Comprobado en
 *    Edge sobre Android: lo dispara igual con la app ya instalada desde ese mismo
 *    Edge. Por eso solo se usa para saber que hay un evento con el que lanzar la
 *    instalación, nunca para borrar la marca de instalada.
 *  - `getInstalledRelatedApps()` se usa SOLO en positivo: en ese mismo caso
 *    devuelve vacío aunque la app esté instalada, y Brave la restringe por
 *    privacidad. Un vacío no prueba nada.
 *  - `display-mode: standalone` es la señal fiable: solo es cierto DENTRO de la
 *    app instalada, y como la app y el navegador comparten localStorage (mismo
 *    origen), al abrirla queda una marca que la pestaña normal después lee.
 *  - Cuando ninguna señal alcanza, decide la persona: el aviso ofrece "ya la
 *    tengo instalada", que fija la marca a mano.
 *  - La X no oculta para siempre: pospone. Un "nunca más" dejó el aviso
 *    bloqueado sin manera de recuperarlo.
 */
export function usePwaInstall() {
  const [event, setEvent] = useState(() => window.__ghInstall || null);
  const [installed, setInstalled] = useState(() => isStandalone() || load().installed === true);
  const [snoozeUntil, setSnoozeUntil] = useState(() => load().snoozeUntil || 0);
  const [checked, setChecked] = useState(() => !navigator.getInstalledRelatedApps);

  useEffect(() => {
    if (location.search.includes('resetInstall')) {
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
      setInstalled(isStandalone());
      setSnoozeUntil(0);
    }

    // Dentro de la app instalada: dejar constancia para la pestaña del navegador
    if (isStandalone()) { setInstalled(true); save({ installed: true }); }

    // Solo guarda el evento con el que se puede lanzar la instalación. NO se
    // toma como prueba de que la app no esté instalada (ver comentario arriba).
    const markInstallable = () => setEvent(window.__ghInstall);
    if (window.__ghInstall) markInstallable();

    const onInstalled = () => {
      window.__ghInstall = null;
      setEvent(null);
      setInstalled(true);
      save({ installed: true });
    };
    window.addEventListener('gh-installable', markInstallable);
    window.addEventListener('appinstalled', onInstalled);

    navigator.getInstalledRelatedApps?.()
      .then(apps => { if (apps && apps.length) { setInstalled(true); save({ installed: true }); } })
      .catch(() => {})
      .finally(() => setChecked(true));

    return () => {
      window.removeEventListener('gh-installable', markInstallable);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const snooze = () => {
    const until = Date.now() + SNOOZE_DAYS * DAY;
    save({ snoozeUntil: until });
    setSnoozeUntil(until);
  };

  /** "Ya la tengo instalada": la última palabra cuando el navegador no ayuda. */
  const markInstalled = () => {
    setInstalled(true);
    save({ installed: true });
  };

  const install = async () => {
    const e = window.__ghInstall;
    if (!e) return false;
    e.prompt();
    const { outcome } = await e.userChoice;   // el evento sirve una sola vez
    window.__ghInstall = null;
    setEvent(null);
    if (outcome === 'accepted') { setInstalled(true); save({ installed: true }); }
    return outcome === 'accepted';
  };

  const snoozed = Date.now() < snoozeUntil;
  const blocked = installed || snoozed || !checked;

  return {
    installed,
    snoozed,
    snooze,
    markInstalled,
    install,
    /** Hay un evento real del navegador para lanzar la instalación. */
    canPrompt: !blocked && !!event,
    /** iOS no expone ese evento: solo se pueden dar instrucciones manuales. */
    needsManualSteps: !blocked && !event && isIOS(),
    /** Para el panel de diagnóstico */
    debug: {
      standalone: isStandalone(),
      guardado: load(),
      instalada: installed,
      pospuesta: snoozed,
      eventoDelNavegador: !!event,
      apiDisponible: !!navigator.getInstalledRelatedApps,
      consultaLista: checked,
    },
  };
}
