import { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { translations, STAGES } from '../i18n';
import { loadProgress, BADGES } from '../gamification.generated.js';

// Colores alineados a la identidad de los logos de bloques:
// Grammaster índigo (#6366F1) · Desgramatizador coral (#FB7185 = rose-400) ·
// Question Lab turquesa (#2DD4BF = teal-400).
const apps = [
  {
    id: 'grammaster',
    title: 'Grammaster',
    logo: 'https://moncholate.github.io/GramMaster/apple-touch-icon.png',
    btnClass: 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700',
    ringClass: 'ring-indigo-200',
    logoBg: 'from-indigo-50 to-violet-50',
    url: 'https://moncholate.github.io/GramMaster/',
  },
  {
    id: 'desgramatizador',
    title: 'Desgramatizador',
    logo: 'https://moncholate.github.io/DesGramatizador/apple-touch-icon.png',
    btnClass: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700',
    ringClass: 'ring-rose-200',
    logoBg: 'from-rose-50 to-pink-50',
    url: 'https://moncholate.github.io/DesGramatizador/',
  },
  {
    id: 'questionlab',
    title: 'Question Lab',
    logo: 'https://moncholate.github.io/Question-Lab/apple-touch-icon.png',
    btnClass: 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700',
    ringClass: 'ring-teal-200',
    logoBg: 'from-teal-50 to-cyan-50',
    url: 'https://moncholate.github.io/Question-Lab/',
  },
];

// Tinte progresivo por etapa: más intensidad = más avanzado (mismo lenguaje
// que las familias de tiempos: la intensidad codifica progresión).
const STAGE_TINTS = [
  { box: 'bg-indigo-50/50 border-indigo-100',  label: 'text-indigo-400' },
  { box: 'bg-indigo-50 border-indigo-200',     label: 'text-indigo-500' },
  { box: 'bg-indigo-100/70 border-indigo-300', label: 'text-indigo-600' },
];

const HubHome = ({ lang, level, setLevel }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const iframeRef = useRef(null);
  const touchStartX = useRef(null);
  const t = translations[lang];

  // Progreso compartido de la suite (lo escriben las apps en gh_progress)
  const [progress, setProgress] = useState(null);
  const [showBadges, setShowBadges] = useState(false);

  // Aviso activo al tocar una app sin nivel elegido (en móvil el tooltip de
  // title no existe; esto sí se ve): pulso en el selector + mensaje, 2.5 s.
  const [needLevel, setNeedLevel] = useState(false);
  const nudgeTimer = useRef(null);
  const nudge = () => {
    clearTimeout(nudgeTimer.current);
    setNeedLevel(true);
    nudgeTimer.current = setTimeout(() => setNeedLevel(false), 2500);
  };
  useEffect(() => () => clearTimeout(nudgeTimer.current), []);
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

      {/* Paso 1 · Selector de nivel por etapas */}
      <div className={`w-full max-w-lg mb-6 rounded-2xl transition-shadow ${needLevel ? 'gh-nudge' : ''}`}>
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">1</span>
          <span className="text-sm font-bold text-slate-700">{t.step1}</span>
          {needLevel && (
            <span role="alert" className="text-xs font-semibold text-rose-600 ml-auto">{t.needLevel}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((stage, i) => (
            <fieldset
              key={stage.id}
              className={`flex-1 min-w-[136px] rounded-xl border px-2 pt-1.5 pb-2 ${STAGE_TINTS[i].box}`}
            >
              <legend className={`text-[10px] font-bold uppercase tracking-wide px-1 ${STAGE_TINTS[i].label}`}>
                {stage[lang]}
              </legend>
              <div className="flex gap-1.5">
                {stage.levels.map((lvl) => {
                  const label = typeof lvl.short === 'string' ? lvl.short : lvl.short[lang];
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setLevel(lvl.id)}
                      aria-pressed={level === lvl.id}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-sm font-semibold border transition-all touch-manipulation ${
                        level === lvl.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {/* Paso 2 · Cards */}
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${level ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-white'}`}>2</span>
          <span className={`text-sm font-bold ${level ? 'text-slate-700' : 'text-slate-400'}`}>{t.step2}</span>
        </div>
      <div className="grid sm:grid-cols-2 gap-3 w-full">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => (level ? setSelectedApp(app.id) : nudge())}
            className={`group bg-white rounded-2xl border border-slate-200 transition-all text-left touch-manipulation overflow-hidden ${
              level
                ? 'hover:border-slate-300 hover:shadow-lg active:scale-[0.98] cursor-pointer'
                : 'opacity-60'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
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
