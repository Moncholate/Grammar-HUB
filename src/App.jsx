import React, { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import HubHome from './components/HubHome';
import InstallPrompt from './components/InstallPrompt';

const App = () => {
  const [installedAsApp, setInstalledAsApp] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header with Navigation */}
      <HeaderNav />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <HubHome />
      </main>

      {/* Install Prompt */}
      {!installedAsApp && <InstallPrompt />}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-sm text-slate-600 mt-auto">
        <p>Grammar HUB v1.0.0 • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
