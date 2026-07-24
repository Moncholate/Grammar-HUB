import { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { translations, LEVELS } from '../i18n';
import { loadProgress, BADGES } from '../gamification.generated.js';

const apps = [
  {
    id: 'grammaster',
    title: 'GramMaster',
    logo: 'https://moncholate.github.io/GramMaster/apple-touch-icon.png',
    btnClass: 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800',
    ringClass: 'ring-violet-200',
    logoBg: 'from-violet-50 to-purple-50',
    url: 'https://moncholate.github.io/GramMaster/',
  },
  {
    id: 'desgramatizador',
    title: 'DesGramatizador',
    logo: 'https://moncholate.github.io/DesGramatizador/apple-touch-icon.png',
    btnClass: 'bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-800',
    ringClass: 'ring-fuchsia-200',
    logoBg: 'from-fuchsia-50 to-pink-50',
    url: 'https://moncholate.github.io/DesGramatizador/',
  },
  {
    id: 'questionlab',
    title: 'Question Lab',
    logo: 'https://moncholate.github.io/Question-Lab/favicon.svg',
    btnClass: 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800',
    ringClass: 'ring-teal-200',
    logoBg: 'from-teal-50 to-cyan-50',
    url: 'https://moncholate.github.io/Question-Lab/',
  },
];

const HubHome = ({ lang, level, setLevel }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const iframeRef = useRef(null);
  const touchStartX = useRef(null);
  const t = translations[lang];

  // Progreso compartido de la suite (lo escriben las apps en gh_progress)
  const [progress, setProgress] = useState(null);
  const [showBadges, setShowBadges] = useState(false);
  useEffect(() => {
    try { setProgress(loadProgress(window.localStorage)); } catch (e) {}
  }, [selectedApp]);

  const sendToIframe = (payload) => {
    setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(payload, '*');
    }, 300);
  };

  // Enviar idioma al iframe cuando cambia
  useEffect(() => {
    if (!iframeRef.current || !selectedApp) return;
    sendToIframe({ type: 'GRAMMAR_HUB_LANG', lang });
  }, [lang, selectedApp]);

  // Enviar nivel al iframe cuando cambia
  useEffect(() => {
    if (!iframeRef.current || !selectedApp || !level) return;
    sendToIframe({ type: 'GRAMMAR_HUB_LEVEL', level });
  }, [level, selectedApp]);

  const currentApp = selectedApp ? apps.find(a => a.id === selectedApp) : null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (touchStartX.current < 60 && deltaX > 80) setSelectedApp(null);
    touchStartX.current = null;
  };

  const handleIframeLoad = () => {
    sendToIframe({ type: 'GRAMMAR_HUB_LANG', lang });
    if (level) sendToIframe({ type: 'GRAMMAR_HUB_LEVEL', level });
  };

  // Vista iframe — fullscreen
  if (currentApp) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <button
            onClick={() => setSelectedApp(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ArrowLeft size={16} />
            {t.back}
          </button>
        </div>

        <div
          className="flex-1 overflow-auto"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        >
          <iframe
            key={currentApp.id}
            ref={iframeRef}
            src={currentApp.url}
            title={currentApp.title}
            className="border-0 w-full"
            style={{ height: '100%', minHeight: '100%', display: 'block' }}
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            allow="fullscreen"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    );
  }

  const dayStreak = progress?.dayStreak?.count || 0;
  const badgesMap = progress?.badges || {};
  const isUnlocked = (b) => b.perTense
    ? Object.keys(badgesMap).some(k => k.startsWith(b.id + ':'))
    : !!badgesMap[b.id];
  const unlockedCount = BADGES.filter(isUnlocked).length;

  // Vista principal
  return (
    <div className={`flex flex-col items-center px-5 py-8 ${showBadges ? 'justify-start min-h-full' : 'justify-center h-full'}`}>

      {/* Hero */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5">
          {t.hero}
        </h1>
        <p className="text-slate-500 text-sm">{t.heroSub}</p>
      </div>

      {/* Progreso compartido de la suite */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-5" aria-label={lang === 'es' ? 'Tu progreso' : 'Your progress'}>
        {dayStreak > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-br from-rose-500 to-amber-400 shadow-sm">
            🔥 {dayStreak} {lang === 'es' ? (dayStreak === 1 ? 'día' : 'días') : (dayStreak === 1 ? 'day' : 'days')}
          </span>
        )}
        <button
          onClick={() => setShowBadges(v => !v)}
          aria-expanded={showBadges}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          🏅 {unlockedCount}/{BADGES.length} {lang === 'es' ? 'logros' : 'badges'} <span className="text-[10px]">{showBadges ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Selector de nivel */}
      <div className="w-full max-w-lg mb-5">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-1 mb-1.5 block">
          {t.levelLabel}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setLevel(lvl.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all touch-manipulation ${
                level === lvl.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {lvl[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-3 w-full max-w-lg">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => level && setSelectedApp(app.id)}
            className={`group bg-white rounded-2xl border border-slate-200 transition-all text-left touch-manipulation overflow-hidden ${
              level
                ? 'hover:border-slate-300 hover:shadow-lg active:scale-[0.98] cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            title={!level ? (lang === 'es' ? 'Selecciona un nivel primero' : 'Select a level first') : ''}
          >
            <div className={`applogo flex items-center justify-center py-6 bg-gradient-to-br ${app.logoBg}`}>
              <img
                src={app.logo}
                alt={app.title}
                className={`w-16 h-16 rounded-2xl shadow-sm ring-4 ${app.ringClass}`}
              />
            </div>
            <div className="px-4 pb-4 pt-3">
              <h2 className="text-base font-bold text-slate-900 mb-0.5">{app.title}</h2>
              <p className="text-xs text-slate-500 mb-3">{t[app.id]?.tagline}</p>
              <div className={`w-full ${app.btnClass} text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5`}>
                {t.open}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Galería de insignias */}
      {showBadges && (
        <div className="w-full max-w-lg mt-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BADGES.map((b) => {
              const unlocked = isUnlocked(b);
              const name = (lang === 'es' ? b.name.es : b.name.en).replace('{tense}', lang === 'es' ? 'un tiempo' : 'a tense');
              const desc = lang === 'es' ? b.desc.es : b.desc.en;
              return (
                <div
                  key={b.id}
                  title={unlocked ? name : (lang === 'es' ? 'Bloqueado' : 'Locked')}
                  className={`rounded-xl border p-2.5 flex items-start gap-2 ${unlocked ? 'bg-white border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-200'}`}
                >
                  <span className={`text-2xl leading-none ${unlocked ? '' : 'opacity-30 grayscale'}`}>{b.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-tight ${unlocked ? 'text-slate-800' : 'text-slate-400'}`}>{name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-8 text-xs text-slate-400 text-center">
        <span className="font-medium text-slate-500">Grammar HUB</span> – By Besto Teacher Víctor Morales
      </p>
    </div>
  );
};

export default HubHome;
