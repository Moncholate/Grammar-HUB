import { useState } from 'react';

const THEME_ICON = { auto: '🌗', light: '☀️', dark: '🌙' };

const HeaderNav = ({ lang, setLang }) => {
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' && window.ghTheme ? window.ghTheme.get() : 'auto'));
  const cycleTheme = () => { if (window.ghTheme) setTheme(window.ghTheme.cycle()); };
  const themeName = { es: { auto: 'automático', light: 'claro', dark: 'oscuro' }, en: { auto: 'auto', light: 'light', dark: 'dark' } };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="relative max-w-2xl mx-auto px-5 py-4 flex flex-col items-center gap-2">

        {/* Tema de la suite — esquina superior izquierda */}
        <div className="absolute top-4 left-5 flex flex-col items-start">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-1 mb-0.5">
            {lang === 'es' ? 'Tema' : 'Theme'}
          </span>
          <button
            onClick={cycleTheme}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all"
            title={`${lang === 'es' ? 'Tema' : 'Theme'}: ${themeName[lang][theme]}`}
          >
            <span className="text-base leading-none">{THEME_ICON[theme]}</span>
            <span className="capitalize">{themeName[lang][theme]}</span>
          </button>
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
