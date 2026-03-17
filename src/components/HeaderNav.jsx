import React from 'react';

const HeaderNav = () => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold text-blue-600 hidden sm:block">Grammar HUB</h1>
        </div>

        {/* Subtitle */}
        <p className="hidden md:block text-sm text-slate-600">
          Centro integrado de herramientas para aprender inglés
        </p>
      </div>
    </header>
  );
};

export default HeaderNav;
