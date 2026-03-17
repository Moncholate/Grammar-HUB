import React from 'react';
import { BookOpen, Lightbulb, ArrowRight } from 'lucide-react';

const HubHome = () => {
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
      url: 'https://moncholate.github.io/Desgramatizador/',
      Component: Lightbulb
    }
  ];

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
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 border border-slate-200 overflow-hidden"
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
                  Abrir en nueva pestaña
                  <ArrowRight size={18} />
                </div>
              </div>
            </a>
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
              Instala la app en tu celular y accede fácilmente a tus herramientas
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
            <h4 className="font-bold text-slate-900 mb-2">Aprendizaje Integral</h4>
            <p className="text-sm text-slate-600">
              Acceso centralizado a dos herramientas complementarias
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 rounded p-6 max-w-4xl w-full">
        <h4 className="font-bold text-blue-900 mb-2">💡 Nota</h4>
        <p className="text-blue-800 text-sm">
          Cada app se abrirá en una nueva pestaña. Las aplicaciones están alojadas en GitHub Pages y funcionan completamente en línea.
        </p>
      </div>
    </div>
  );
};

export default HubHome;
