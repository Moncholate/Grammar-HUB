import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { usePwaInstall } from '../usePwaInstall';

const InstallPrompt = () => {
  const { canPrompt, needsManualSteps, dismiss, install, markSeen } = usePwaInstall();
  const ios = needsManualSteps;
  // En iOS no hay evento del navegador, así que el aviso se muestra tras un
  // momento; en el resto solo cuando el navegador confirma que es instalable.
  const [delayPassed, setDelayPassed] = useState(!ios);

  useEffect(() => {
    if (!ios) return;
    const t = setTimeout(() => setDelayPassed(true), 2000);
    return () => clearTimeout(t);
  }, [ios]);

  const visible = delayPassed && (canPrompt || ios);

  // Se registra en cuanto aparece: este aviso se muestra una sola vez por
  // navegador, se haya instalado la app o no.
  useEffect(() => { if (visible) markSeen(); }, [visible]);

  const handleInstall = async () => {
    const ok = await install();
    if (!ok) dismiss();   // si lo rechaza, no insistir
  };

  if (!visible) return null;

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
            onClick={dismiss}
            aria-label="No volver a mostrar"
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
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
