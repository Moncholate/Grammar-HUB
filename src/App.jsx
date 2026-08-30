import React, { useState } from 'react';
import HeaderNav from './components/HeaderNav';
import HubHome from './components/HubHome';
import PanelDocente from './components/PanelDocente';
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
  // Con el aviso de la frase del día abierto, el de instalar espera su turno:
  // dos paneles superpuestos en la misma carga se cierran sin leer ninguno.
  const [phraseOpen, setPhraseOpen] = useState(false);
  // Y con una app abierta en el iframe tampoco: flotaría sobre la app.
  const [appOpen, setAppOpen] = useState(false);
  /* Las herramientas de clase son otra VISTA, no otra app: no van en el iframe
     porque no son de nadie, y no van dentro del hub del alumno porque no son
     para él. */
  const [vista, setVista] = useState('hub');

  const setLevel = (id) => {
    setLevelState(id);
    try { localStorage.setItem(LEVEL_KEY, id); } catch { /* modo privado */ }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fb] flex flex-col">
      <HeaderNav lang={lang} setLang={setLang} />
      <main className="flex-1 w-full flex flex-col">
        {vista === 'docente'
          ? <PanelDocente lang={lang} nivel={level} onVolver={() => setVista('hub')} />
          : <HubHome lang={lang} level={level} setLevel={setLevel}
                     onPhraseOpenChange={setPhraseOpen} onAppOpenChange={setAppOpen}
                     onDocente={() => setVista('docente')} />}
      </main>
      {/* Decide solo si corresponde mostrarse (ver usePwaInstall). En las
          herramientas también espera: flotaría sobre el dado. */}
      <InstallPrompt paused={phraseOpen || appOpen || vista === 'docente'} />
    </div>
  );
};

export default App;
