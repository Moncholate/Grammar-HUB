import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { usePwaInstall, isIOS } from '../usePwaInstall';

/**
 * Panel de diagnóstico en pantalla, visible solo con `?debugInstall` en la URL.
 * Va en la pantalla y no en la consola del navegador para poder revisarlo desde
 * el celular, donde abrir las herramientas de desarrollo no es practico.
 */
const InstallDebug = ({ data, visible }) => (
  <div className="fixed top-2 left-2 right-2 z-50 rounded-xl bg-slate-900 text-slate-100 text-xs p-3 shadow-xl font-mono leading-relaxed">
    <div className="font-bold mb-1">Diagnóstico de instalación</div>
    <div>¿se muestra el aviso?: <b>{visible ? 'SÍ' : 'no'}</b></div>
    <div>corriendo como app: {String(data.standalone)}</div>
    <div>la damos por instalada: {String(data.instalada)} (desde {data.desde})</div>
    <div>aviso pospuesto: {String(data.pospuesta)}</div>
    <div>el navegador ofrece instalar: {String(data.eventoDelNavegador)}</div>
    <div>API de consulta disponible: {String(data.apiDisponible)}</div>
    <div>guardado: {JSON.stringify(data.guardado)}</div>
  </div>
);

/* `paused`: hay otro panel encima (la frase del día). No se cancela el aviso,
   solo espera a que se cierre, para no apilar dos interrupciones. */
const InstallPrompt = ({ paused = false }) => {
  const { canPrompt, needsManualSteps, canInstallManually,
          snooze, markInstalled, install, debug } = usePwaInstall();
  const showDebug = typeof location !== 'undefined' && location.search.includes('debugInstall');
  const iosSteps = needsManualSteps || (isIOS() && !canPrompt);
  // En iOS no hay evento del navegador, así que el aviso se muestra tras un
  // momento; en el resto solo cuando el navegador confirma que es instalable.
  const [delayPassed, setDelayPassed] = useState(!needsManualSteps);
  /* Abierto a mano desde el botón chico. Va aparte de `canPrompt` justamente
     para que funcione cuando el aviso automático está bloqueado. */
  const [abiertoAMano, setAbiertoAMano] = useState(false);

  useEffect(() => {
    if (!needsManualSteps) return;
    const t = setTimeout(() => setDelayPassed(true), 2000);
    return () => clearTimeout(t);
  }, [needsManualSteps]);

  const auto = !paused && delayPassed && (canPrompt || needsManualSteps);
  const visible = auto || abiertoAMano;

  const handleInstall = async () => {
    const ok = await install();
    if (!ok) snooze();   // si lo rechaza, no insistir por un buen tiempo
    setAbiertoAMano(false);
  };
  const cerrar = () => { setAbiertoAMano(false); if (auto) snooze(); };

  if (showDebug) return <InstallDebug data={debug} visible={visible} />;

  /* Botón chico y permanente. Sin él, «pospuesto» o una marca de instalada mal
     puesta dejaban la instalación sin ninguna vía de acceso: solo se recuperaba
     con ?resetInstall en la URL. */
  if (!visible) {
    if (!canInstallManually || paused) return null;
    return (
      <button
        onClick={() => setAbiertoAMano(true)}
        title="Instalar Grammar HUB"
        /* Relleno azul, no una píldora blanca con texto gris: así se veía
           deshabilitada y un botón que parece apagado se lee como roto. */
        className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg px-3.5 py-2.5 text-xs font-semibold transition-colors touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <Download size={14} />
        Instalar app
      </button>
    );
  }

  const ios = iosSteps;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
              alt="Grammar HUB"
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-bold text-slate-900 text-sm">Grammar HUB</span>
          </div>
          <button
            onClick={cerrar}
            aria-label="Ahora no"
            className="text-slate-400 hover:text-slate-600 transition-colors touch-manipulation p-1"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          {ios ? (
            <>
              <p className="text-sm text-slate-600 mb-3">
                Instala esta app en tu iPhone para acceso rápido desde la pantalla de inicio.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-xs">1</span>
                  </div>
                  <span>Toca el botón <Share size={11} className="inline mx-0.5 text-blue-500" /> <strong>Compartir</strong> en Safari</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-xs">2</span>
                  </div>
                  <span>Selecciona <strong>"Añadir a pantalla de inicio"</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-xs">3</span>
                  </div>
                  <span>Toca <strong>Añadir</strong></span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600 mb-3">
                Instala Grammar HUB en tu dispositivo para acceso rápido.
              </p>
              <button
                onClick={handleInstall}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Download size={15} />
                Instalar app
              </button>
            </>
          )}

          {/* Salida definitiva: algunos navegadores ofrecen instalar aunque la
              app ya esté instalada, y no hay forma de detectarlo desde la web. */}
          <button
            onClick={() => { markInstalled(); setAbiertoAMano(false); }}
            className="w-full mt-2 text-xs text-slate-400 hover:text-slate-600 py-1.5 touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Ya la tengo instalada
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
