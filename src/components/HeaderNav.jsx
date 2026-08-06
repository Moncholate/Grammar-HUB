import { useState, useEffect } from 'react';

const THEME_ICON = { light: '☀️', dark: '🌙' };
const THEME_NAME = { es: { light: 'Claro', dark: 'Oscuro' }, en: { light: 'Light', dark: 'Dark' } };

/* El toggle de tema, exportado aparte: además de la cabecera del Hub lo usa la
   barra del iframe. Dentro de una app embebida el tema se maneja desde ahí, no
   desde la cabecera de la app — en celular esa cabecera queda cargada de
   información y el botón compite con el título. */
export function ThemeToggle({ lang = 'es', compacto = false }) {
  // Arranca en auto (sigue al SO). El toggle es binario y ofrece el modo destino.
  const [eff, setEff] = useState(() => (typeof window !== 'undefined' && window.ghTheme ? window.ghTheme.effective() : 'light'));
  useEffect(() => {
    if (!window.ghTheme) return;
    const sync = () => setEff(window.ghTheme.effective());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);
    const onStorage = (e) => { if (e.key === 'gh_theme') sync(); };
    window.addEventListener('storage', onStorage);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', sync) : mq.removeListener(sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  const target = eff === 'dark' ? 'light' : 'dark';   // el modo al que puedes cambiar
  const etiqueta = `${lang === 'es' ? 'Cambiar a modo' : 'Switch to'} ${THEME_NAME[lang][target].toLowerCase()}`;
  return (
    <button
      onClick={() => { if (window.ghTheme) setEff(window.ghTheme.toggle()); }}
      className={`flex items-center gap-1.5 rounded-lg font-bold bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all ${
        compacto ? 'px-2.5 py-1.5 text-sm' : 'px-2.5 py-1 text-sm'}`}
      title={etiqueta}
      aria-label={etiqueta}
    >
      <span className="text-base leading-none">{THEME_ICON[target]}</span>
      <span>{THEME_NAME[lang][target]}</span>
    </button>
  );
}

const HeaderNav = ({ lang, setLang }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="relative max-w-2xl mx-auto px-5 py-4 flex flex-col items-center gap-2">

        {/* Tema de la suite — esquina superior izquierda */}
        <div className="absolute top-4 left-5 flex flex-col items-start">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-1 mb-0.5">
            {lang === 'es' ? 'Tema' : 'Theme'}
          </span>
          <ThemeToggle lang={lang} />
        </div>

        {/* Selector de idioma — esquina superior derecha */}
        <div className="absolute top-4 right-5 flex flex-col items-start">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-1 mb-0.5">
            {lang === 'es' ? 'Idioma' : 'Language'}
          </span>
          <div className="flex bg-slate-100 border border-slate-300 rounded-lg p-0.5">
            <button
              onClick={() => setLang('es')}
              className={`px-3 py-1 rounded text-sm font-bold transition-all ${lang === 'es' ? 'bg-white shadow-sm text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}
              title="Español"
            >ES</button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded text-sm font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}
              title="English"
            >EN</button>
          </div>
        </div>

        {/* Logo */}
        <img
          src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
          alt="Grammar HUB"
          className="w-16 h-16 rounded-2xl shadow-md"
        />

        {/* Título y subtítulo */}
        <div className="text-center leading-tight">
          <p className="font-extrabold text-slate-900 text-2xl tracking-tight">Grammar HUB</p>
          <p className="text-sm text-slate-400 mt-0.5">
            {lang === 'es' ? 'Tu laboratorio de inglés' : 'Your English laboratory'}
          </p>
        </div>

      </div>
    </header>
  );
};

export default HeaderNav;
