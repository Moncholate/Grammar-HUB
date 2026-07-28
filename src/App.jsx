import React, { useState } from 'react';
import HeaderNav from './components/HeaderNav';
import HubHome from './components/HubHome';
import InstallPrompt from './components/InstallPrompt';
import { LEVELS } from './i18n';

const LEVEL_KEY = 'gh_level';

// El nivel se recuerda entre visitas; se valida contra la lista por si el
// guardado quedó de una versión con otros ids.
const loadLevel = () => {
  try {
    const saved = localStorage.getItem(LEVEL_KEY);
    return LEVELS.some(l => l.id === saved) ? saved : null;
  } catch { return null; }
};

const App = () => {
  const [lang, setLang] = useState('es');
  const [level, setLevelState] = useState(loadLevel);

  const setLevel = (id) => {
    setLevelState(id);
    try { localStorage.setItem(LEVEL_KEY, id); } catch { /* modo privado */ }
  };

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
