/* ============================================================================
   HERRAMIENTAS DE CLASE
   ----------------------------------------------------------------------------
   La primera sección de la suite que NO es para el alumno. Todo lo demás está
   pensado para quien aprende; esto es para quien enseña, de pie frente al
   curso: se usa en cinco segundos, a veces proyectado, y a veces sin internet
   —el hub es instalable, así que esto funciona igual—.

   Vive en el hub y no dentro de una app porque no es de ninguna. Y está aparte
   de la página del alumno porque mezclarlas fue justo lo que hizo que la Guía
   de Grammaster se sintiera sobrecargada: no era el tamaño, era el sitio.

   POR QUÉ PESTAÑAS Y NO UNA LISTA. Con cuatro herramientas apiladas volvería a
   pasar lo de la Guía: para llegar a la última hay que barrer tres. Cada una
   ocupa la pantalla cuando le toca.

   Y se montan TODAS aunque solo se vea una —se ocultan con CSS, no se
   desmontan—: si el temporizador se desmontara al cambiar de pestaña, la cuenta
   se perdería justo cuando el profesor va a sortear algo mientras corre el
   tiempo. Ese es el caso normal, no el raro.

   PANTALLA COMPLETA, para proyectar. Se pide sobre el contenedor de las
   herramientas y no sobre la página entera: así la cabecera del hub se queda
   fuera sola, sin tener que esconderla a mano.

   Dos cosas que no son obvias:
     · el navegador puede negarla —iPhone no la da nunca fuera de un vídeo—, así
       que si falla se queda el modo «a lo ancho» (fijo sobre la página), que es
       casi todo lo que se gana y no depende de nadie.
     · las herramientas reciben `grande` y deciden ELLAS qué crece: el resultado,
       no los controles. Un dado con el número gigante y los botones normales es
       lo que se ve desde el fondo de la sala; escalarlo todo por igual deja los
       controles ocupando media pantalla.

   NADA SE GUARDA. Es la regla de esta sección, dicha por el profesor para el
   generador de grupos y aplicada a todo: lo que se escribe aquí vive mientras
   la pestaña está abierta. Así no hay nombres de alumnos en ningún repositorio
   ni en ningún despliegue, y no hay nada que explicar sobre qué queda guardado.
   ========================================================================== */
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import Dado from './Dado';
import Ruleta from './Ruleta';
import Grupos from './Grupos';
import Temporizador from './Temporizador';
import { apps } from './HubHome';
import { translations } from '../i18n';

const PanelDocente = ({ lang = 'es', nivel = null, onVolver }) => {
  const es = lang === 'es';
  const t = translations[lang];
  const [vista, setVista] = useState('dado');
  const [presentando, setPresentando] = useState(false);
  const caja = useRef(null);

  /* El estado lo manda el navegador, no el botón: si el profesor sale con Esc
     —que es como se sale— la pantalla volvería a su sitio pero el botón seguiría
     diciendo «salir». */
  useEffect(() => {
    /* Solo interesa SALIR: entrar lo hace el botón. Y hay que escucharlo porque
       de la pantalla completa se sale con Esc, no con el botón. */
    const alSalir = () => { if (!document.fullscreenElement) setPresentando(false); };
    /* Esc también cierra el modo «a lo ancho» cuando el navegador negó la
       pantalla completa (iPhone): ahí no hay evento de fullscreen que escuchar. */
    const alTeclear = (e) => { if (e.key === 'Escape' && !document.fullscreenElement) setPresentando(false); };
    document.addEventListener('fullscreenchange', alSalir);
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('fullscreenchange', alSalir);
      document.removeEventListener('keydown', alTeclear);
    };
  }, []);

  const alternarPantalla = async () => {
    if (presentando) {
      try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { /* ya estaba fuera */ }
      setPresentando(false);
      return;
    }
    setPresentando(true);
    try { await caja.current?.requestFullscreen?.(); }
    catch { /* sin API o denegada: queda el modo a lo ancho, que ya sirve */ }
  };

  const HERRAMIENTAS = [
    { id: 'dado', rotulo: es ? 'Dado' : 'Dice' },
    { id: 'ruleta', rotulo: es ? 'Ruleta' : 'Wheel' },
    { id: 'grupos', rotulo: es ? 'Grupos' : 'Groups' },
    { id: 'tiempo', rotulo: es ? 'Temporizador' : 'Timer' },
  ];

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

      <div ref={caja} className={presentando ? 'fixed inset-0 z-50 bg-white overflow-auto flex flex-col' : 'contents'}>
      <div className="px-4 pt-3 flex flex-wrap items-center gap-1.5">
        {HERRAMIENTAS.map(h => (
          <button
            key={h.id}
            onClick={() => setVista(h.id)}
            aria-pressed={vista === h.id}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
              vista === h.id ? 'bg-indigo-600 text-white border-indigo-600'
                             : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {h.rotulo}
          </button>
        ))}

        {/* Para proyectar. Va junto a las pestañas porque en clase se toca con
            la actividad ya elegida. */}
        <button
          onClick={alternarPantalla}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:border-slate-300 transition-colors"
        >
          {presentando ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          {presentando ? (es ? 'Salir' : 'Exit') : (es ? 'Pantalla completa' : 'Full screen')}
        </button>
      </div>

      <div className={`flex-1 px-5 py-6 ${presentando ? 'flex flex-col justify-center' : ''}`}>
        <div className={vista === 'dado' ? '' : 'hidden'}><Dado lang={lang} nivel={nivel} grande={presentando} /></div>
        <div className={vista === 'ruleta' ? '' : 'hidden'}><Ruleta lang={lang} grande={presentando} /></div>
        <div className={vista === 'grupos' ? '' : 'hidden'}><Grupos lang={lang} grande={presentando} /></div>
        <div className={vista === 'tiempo' ? '' : 'hidden'}><Temporizador lang={lang} grande={presentando} /></div>

        {/* LA TABLA DE TIEMPOS vive en Grammaster, que es donde está el motor que
            la genera: traerla aquí obligaría a copiar ese motor, y copiar es lo
            que esta suite ya pagó caro. Esto es la puerta —`#tiempos` la abre
            directa— y se abre en otra pestaña a propósito: en clase se proyecta
            y se deja puesta mientras el hub sigue donde estaba. */}
        <section className={`w-full max-w-xl mx-auto mt-10 pt-6 border-t border-slate-200 ${presentando ? 'hidden' : ''}`}>
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            {es ? 'Tabla de tiempos' : 'Tense table'}
          </h2>
          <p className="text-sm text-muted mb-3">
            {es ? 'Cada tiempo con su uso, su auxiliar y qué le pasa al verbo en + − ?. Se abre en Grammaster, en otra pestaña.'
                : 'Every tense with its use, its auxiliary and what happens to the verb in + − ?. It opens in Grammaster, in another tab.'}
          </p>
          <a
            href={`${apps.find(a => a.id === 'grammaster').url}#tiempos`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            {es ? 'Abrir la tabla' : 'Open the table'} →
          </a>
        </section>
      </div>
      </div>
    </div>
  );
};

export default PanelDocente;
