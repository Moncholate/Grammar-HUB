const HeaderNav = ({ lang, setLang }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="relative max-w-2xl mx-auto px-5 py-4 flex flex-col items-center gap-2">

        {/* Selector de idioma — esquina superior derecha */}
        <div className="absolute top-4 right-5 flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setLang('es')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${lang === 'es' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            ES
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            EN
          </button>
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
