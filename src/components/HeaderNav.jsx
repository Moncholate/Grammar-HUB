const HeaderNav = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-5 py-4 flex flex-col items-center gap-2">
        <img
          src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
          alt="Grammar HUB"
          className="w-16 h-16 rounded-2xl shadow-md"
        />
        <div className="text-center leading-tight">
          <p className="font-extrabold text-slate-900 text-2xl tracking-tight">Grammar HUB</p>
          <p className="text-sm text-slate-400 mt-0.5">Tu laboratorio de inglés</p>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
