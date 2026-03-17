import React, { useState } from 'react';
import { BookOpen, Lightbulb, ArrowRight, X, ArrowLeft } from 'lucide-react';

const HubHome = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const apps = [
    {
      id: 'grammaster',
      title: 'Grammaster',
      icon: '📝',
      color: 'from-blue-500 to-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-600',
      description: 'Construye oraciones en inglés seleccionando sujeto, verbo y complemento. Aprende tiempos verbales y modos de forma interactiva.',
      features: [
        '✅ Constructor de oraciones',
        '✅ Todos los tiempos verbales',
        '✅ Modo práctica con ejercicios'
      ],
      url: 'https://moncholate.github.io/GramMaster/',
      Component: BookOpen
    },
    {
      id: 'desgramatizador',
      title: 'DesGramatizador',
      icon: '🔍',
      color: 'from-purple-500 to-purple-600',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      textColor: 'text-purple-600',
      description: 'Analiza automáticamente las partes de la oración (POS) y la estructura de frases en inglés. Practica identificando componentes gramaticales.',
      features: [
        '✅ Análisis automático POS',
        '✅ Estructura de oraciones',
        '✅ Práctica interactiva'
      ],
      url: 'https://moncholate.github.io/DesGramatizador/',
      Component: Lightbulb
    }
  ];

  const currentApp = selectedApp ? apps.find(app => app.id === selectedApp) : null;

  // Vista de App Embebida
  if (currentApp) {
    return (
      <div className="h-screen flex flex-col bg-white">
        {/* Header con botón atrás */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-4 flex items-center gap-3">
          <button
            onClick={() => setSelectedApp(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-100 transition-colors font-medium text-slate-700 border border-slate-200"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <h2 className="text-xl font-bold text-slate-900 flex-1">
            {currentApp.icon} {currentApp.title}
          </h2>
          <span className="text-sm text-slate-600">Presiona Volver para regresar al menú</span>
        </div>

        {/* iFrame */}
        <iframe
          key={currentApp.id}
          src={currentApp.url}
          title={currentApp.title}
          className="flex-1 border-0 w-full"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    );
  }

  // Vista Principal
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-4">
          <span className="text-6xl">🎓</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4">
          Grammar HUB
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Tu plataforma integral para dominar la gramática inglesa. 
          Construye oraciones perfectas y analiza sus estructuras.
        </p>
      </div>

      {/* Apps Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
        {apps.map((app) => {
          const IconComponent = app.Component;
          return (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 border border-slate-200 overflow-hidden text-left cursor-pointer"
            >
              <div className={`h-32 bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                <span className="text-6xl">{app.icon}</span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <IconComponent size={28} className={app.textColor} />
                  {app.title}
                </h2>
                <p className="text-slate-600 mb-4">
                  {app.description}
                </p>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  {app.features.map((feature, idx) => (
                    <p key={idx}>{feature}</p>
                  ))}
                </div>
                <div className={`w-full ${app.buttonColor} text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group-hover:gap-3`}>
                  Abrir
                  <ArrowRight size={18} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Características de Grammar HUB
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">📱</div>
            <h4 className="font-bold text-slate-900 mb-2">Instalable en móvil</h4>
            <p className="text-sm text-slate-600">
              Instala la app en tu celular y accede a todas tus herramientas
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-bold text-slate-900 mb-2">Rápido y Ligero</h4>
            <p className="text-sm text-slate-600">
              Carga instantáneamente y usa mínimos recursos
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-bold text-slate-900 mb-2">Todo Integrado</h4>
            <p className="text-sm text-slate-600">
              Acceso a todas las herramientas desde un único hub
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 rounded p-6 max-w-4xl w-full">
        <h4 className="font-bold text-blue-900 mb-2">💡 Nota</h4>
        <p className="text-blue-800 text-sm">
          Todas las aplicaciones están integradas en Grammar HUB. Haz clic en una herramienta para empezar a usarla, presiona "Volver" para regresar al menú principal.
        </p>
      </div>
    </div>
  );
};

export default HubHome;
