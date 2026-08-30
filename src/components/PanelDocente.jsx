/* ============================================================================
   HERRAMIENTAS DE CLASE
   ----------------------------------------------------------------------------
   La primera sección de la suite que NO es para el alumno. Todo lo demás está
   pensado para quien aprende; esto es para quien enseña, de pie frente al
   curso: se usa en cinco segundos, a veces proyectado, y a veces sin internet
   —el hub es instalable, así que esto funciona igual—.

   Vive en el hub y no dentro de una app porque no es de ninguna: el dado sirve
   para cualquier actividad. Y está aparte de la página del alumno porque
   mezclarlas fue justo lo que hizo que la Guía de Grammaster se sintiera
   sobrecargada: no era el tamaño, era el sitio.

   NADA SE GUARDA. Es la regla de esta sección, dicha por el profesor para el
   generador de grupos y aplicada a todo: lo que se escribe aquí vive mientras
   la pestaña está abierta. Así no hay nombres de alumnos en ningún repositorio
   ni en ningún despliegue, y no hay nada que explicar sobre qué queda guardado.
   ========================================================================== */
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Dado from './Dado';
import { translations } from '../i18n';

const PanelDocente = ({ lang = 'es', onVolver }) => {
  const es = lang === 'es';
  const t = translations[lang];

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <button
          onClick={onVolver}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft size={16} />
          {t.backToHub}
        </button>
        <span className="text-sm font-bold text-slate-900">
          {es ? 'Herramientas de clase' : 'Classroom tools'}
        </span>
      </div>

      <div className="flex-1 px-5 py-6">
        <Dado lang={lang} />
      </div>
    </div>
  );
};

export default PanelDocente;
