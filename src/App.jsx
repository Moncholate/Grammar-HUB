import React, { useState } from 'react';
import HeaderNav from './components/HeaderNav';
import HubHome from './components/HubHome';
import InstallPrompt from './components/InstallPrompt';

const App = () => {
  const [lang, setLang] = useState('es');
  const [level, setLevel] = useState(null);

  return (
    <div className="min-h-screen bg-[#f5f6fb] flex flex-col">
      <HeaderNav lang={lang} setLang={setLang} />
      <main className="flex-1 w-full flex flex-col">
        <HubHome lang={lang} level={level} setLevel={setLevel} />
      </main>
      {/* Decide solo si corresponde mostrarse (ver usePwaInstall) */}
      <InstallPrompt />
    </div>
  );
};

export default App;
