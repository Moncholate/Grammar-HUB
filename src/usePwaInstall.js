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
 *  - `beforeinstallprompt` es la palabra del propio navegador diciendo "esto se
 *    puede instalar aquí". Si se dispara, se BORRA cualquier marca previa de
 *    instalada: el navegador sabe más que nuestra memoria.
 *  - `display-mode: standalone` solo es cierto DENTRO de la app instalada, pero
 *    como la app y el navegador comparten localStorage (mismo origen), al
 *    abrirla queda una marca que la pestaña normal después puede leer.
 *  - `getInstalledRelatedApps()` se usa SOLO en positivo: varios navegadores de
 *    escritorio devuelven vacío aunque la app esté instalada, y Brave la
 *    restringe por privacidad, así que un vacío no prueba nada.
 *  - La X no oculta para siempre: pospone. Un "nunca más" es justo lo que dejó
 *    el aviso bloqueado sin manera de recuperarlo.
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

    // El navegador dice que se puede instalar => no está instalada aquí
    const markInstallable = () => {
      setEvent(window.__ghInstall);
      setInstalled(false);
      save({ installed: false });
    };
    if (window.__ghInstall && !isStandalone()) markInstallable();

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
