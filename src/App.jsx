import React, { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import HubHome from './components/HubHome';
import InstallPrompt from './components/InstallPrompt';

const App = () => {
  const [installedAsApp, setInstalledAsApp] = useState(false);
  const [lang, setLang] = useState('es');

  useEffect(() => {
    // Detect if app is installed
    window.addEventListener('beforeinstallprompt', (e) => {
      setInstalledAsApp(false);
    });
    
    window.addEventListener('appinstalled', () => {
      setInstalledAsApp(true);
    });

    // Check if running as standalone PWA
    if (window.navigator.standalone === true) {
      setInstalledAsApp(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeaderNav lang={lang} setLang={setLang} />
      <main className="flex-1 w-full flex flex-col">
        <HubHome lang={lang} />
      </main>
      {!installedAsApp && <InstallPrompt />}
    </div>
  );
};

export default App;
