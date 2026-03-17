import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white rounded-lg shadow-lg p-4 border-l-4 border-primary z-40">
      <div className="flex items-start gap-3">
        <Download size={24} className="text-primary flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 mb-1">Instala Grammar HUB</h3>
          <p className="text-sm text-slate-600 mb-3">
            Accede desde tu pantalla de inicio sin conexión a internet
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
