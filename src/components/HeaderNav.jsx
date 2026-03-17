const HeaderNav = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-5 py-3 flex flex-col items-center gap-1.5">
        <img
          src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
          alt="Grammar HUB"
          className="w-11 h-11 rounded-2xl shadow-sm"
        />
        <span className="font-bold text-slate-900 text-base tracking-tight leading-none">
          Grammar HUB
        </span>
      </div>
    </header>
  );
};

export default HeaderNav;
