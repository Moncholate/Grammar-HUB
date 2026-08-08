import { useEffect, useState } from 'react';

/* v3: se guarda CUÁNDO se supo que estaba instalada, no un «sí, para siempre».
   La v2 escribía `installed: true` sin fecha y nada lo borraba: bastaba una
   señal —abrirla una vez ya instalada, un positivo de getInstalledRelatedApps,
   o tocar «ya la tengo»— para que el aviso no volviera NUNCA en ese navegador,
   ni después de desinstalar la app. La única salida era ?resetInstall, que
   nadie va a adivinar. Por eso el nombre nuevo: lo guardado por la v2 se
   ignora a propósito. */
const KEY = 'gh_pwa_v3';

const SNOOZE_DAYS = 90;
/* Cuánto vale la última prueba de que está instalada. Cada visita con una
   señal positiva la renueva, así que a quien la tiene instalada no se le
   vuelve a preguntar; a quien la desinstaló, la marca se le vence sola. */
const TRUST_DAYS = 60;
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
 *  - Ninguna señal prueba lo contrario —que NO está instalada—, así que la marca
 *    no se borra: se deja **vencer**. Es la única forma de que el aviso vuelva
 *    después de desinstalar sin inventarse un negativo que el navegador no da.
 *  - Cuando ninguna señal alcanza, decide la persona: el aviso ofrece "ya la
 *    tengo instalada", que fija la marca a mano.
 *  - La X no oculta para siempre: pospone. Un "nunca más" dejó el aviso
 *    bloqueado sin manera de recuperarlo.
 */
export function usePwaInstall() {
  const [event, setEvent] = useState(() => window.__ghInstall || null);
  const [installedAt, setInstalledAt] = useState(
    () => (isStandalone() ? Date.now() : load().installedAt || 0));
  const [snoozeUntil, setSnoozeUntil] = useState(() => load().snoozeUntil || 0);
  const [checked, setChecked] = useState(() => !navigator.getInstalledRelatedApps);

  /** Renueva la prueba de que está instalada. Con fecha, para que pueda vencer. */
  const markInstalled = () => {
    const ahora = Date.now();
    setInstalledAt(ahora);
    save({ installedAt: ahora });
  };

  useEffect(() => {
    if (location.search.includes('resetInstall')) {
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
      setInstalledAt(0);
      setSnoozeUntil(0);
    }

    // Dentro de la app instalada: dejar constancia para la pestaña del navegador
    if (isStandalone()) markInstalled();

    // Solo guarda el evento con el que se puede lanzar la instalación. NO se
    // toma como prueba de que la app no esté instalada (ver comentario arriba).
    const markInstallable = () => setEvent(window.__ghInstall);
    if (window.__ghInstall) markInstallable();

    const onInstalled = () => {
      window.__ghInstall = null;
      setEvent(null);
      markInstalled();
    };
    window.addEventListener('gh-installable', markInstallable);
    window.addEventListener('appinstalled', onInstalled);

    navigator.getInstalledRelatedApps?.()
      .then(apps => { if (apps && apps.length) markInstalled(); })
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
    if (outcome === 'accepted') markInstalled();
    return outcome === 'accepted';
  };

  const installed = installedAt > 0 && Date.now() - installedAt < TRUST_DAYS * DAY;
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
    /* Vía manual, siempre a mano: no la tapan ni «pospuesto» ni «ya instalada».
       Es la salida cuando alguna de esas dos marcas quedó mal puesta, que es
       justo lo que dejó el aviso muerto en la v2. Solo se esconde corriendo ya
       como app, que es el único caso en que instalar no significa nada. */
    canInstallManually: (!!event || isIOS()) && !isStandalone(),
    /** Para el panel de diagnóstico */
    debug: {
      standalone: isStandalone(),
      guardado: load(),
      instalada: installed,
      desde: installedAt ? new Date(installedAt).toISOString().slice(0, 10) : 'sin dato',
      pospuesta: snoozed,
      eventoDelNavegador: !!event,
      apiDisponible: !!navigator.getInstalledRelatedApps,
      consultaLista: checked,
    },
  };
}
