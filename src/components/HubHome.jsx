import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const apps = [
  {
    id: 'grammaster',
    title: 'GramMaster',
    tagline: 'Explora la ciencia detrás de cada oración en inglés.',
    logo: 'https://moncholate.github.io/GramMaster/apple-touch-icon.png',
    btnClass: 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800',
    ringClass: 'ring-violet-200',
    logoBg: 'from-violet-50 to-purple-50',
    url: 'https://moncholate.github.io/GramMaster/',
  },
  {
    id: 'desgramatizador',
    title: 'DesGramatizador',
    tagline: 'Desgrana y descubre los ladrillos que componen tus oraciones en inglés.',
    logo: 'https://moncholate.github.io/DesGramatizador/apple-touch-icon.png',
    btnClass: 'bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-800',
    ringClass: 'ring-fuchsia-200',
    logoBg: 'from-fuchsia-50 to-pink-50',
    url: 'https://moncholate.github.io/DesGramatizador/',
  },
];

const HubHome = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const currentApp = selectedApp ? apps.find(a => a.id === selectedApp) : null;

  // Vista iframe — fullscreen
  if (currentApp) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <button
            onClick={() => setSelectedApp(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>

        <div
          className="flex-1 overflow-auto"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        >
          <iframe
            key={currentApp.id}
            src={currentApp.url}
            title={currentApp.title}
            className="border-0 w-full"
            style={{ height: '100%', minHeight: '100%', display: 'block' }}
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            allow="fullscreen"
          />
        </div>
      </div>
    );
  }

  // Vista principal
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8">

      {/* Hero */}
      <div className="text-center mb-7">
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
          Herramientas de gramática
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5">
          ¿Qué quieres practicar?
        </h1>
        <p className="text-slate-500 text-sm">
          Elige una app para empezar
        </p>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-3 w-full max-w-lg">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedApp(app.id)}
            className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg active:scale-[0.98] transition-all text-left touch-manipulation overflow-hidden"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Logo area */}
            <div className={`flex items-center justify-center py-6 bg-gradient-to-br ${app.logoBg}`}>
              <img
                src={app.logo}
                alt={app.title}
                className={`w-16 h-16 rounded-2xl shadow-sm ring-4 ${app.ringClass}`}
              />
            </div>

            {/* Info */}
            <div className="px-4 pb-4 pt-3">
              <h2 className="text-base font-bold text-slate-900 mb-0.5">
                {app.title}
              </h2>
              <p className="text-xs text-slate-500 mb-3">
                {app.tagline}
              </p>
              <div
                className={`w-full ${app.btnClass} text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5`}
              >
                Abrir
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-slate-400 text-center">
        <span className="font-medium text-slate-500">Grammar HUB</span> · By Besto Teacher Víctor Morales
      </p>
    </div>
  );
};

export default HubHome;
