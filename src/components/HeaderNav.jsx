const HeaderNav = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-center gap-3">
        <img
          src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
          alt="Grammar HUB"
          className="w-9 h-9 rounded-xl shadow-sm flex-shrink-0"
        />
        <span className="font-bold text-slate-900 text-xl tracking-tight">
          Grammar HUB
        </span>
      </div>
    </header>
  );
};

export default HeaderNav;
