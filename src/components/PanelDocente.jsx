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
import { ArrowLeft, Maximize2, Minimize2, Table2 } from 'lucide-react';
import Dado from './Dado';
import Ruleta from './Ruleta';
import Grupos from './Grupos';
import Temporizador from './Temporizador';
import { apps } from './HubHome';
import { CAPSULA, pestana } from '../ui';
import { translations } from '../i18n';

const PanelDocente = ({ lang = 'es', nivel = null, onVolver }) => {
  const es = lang === 'es';
  const t = translations[lang];
  const [vista, setVista] = useState('dado');
  /* La tabla de tiempos es una vista más de `vista`, pero no una pestaña de la
     cápsula: no es una herramienta que se lance, es material que se consulta.
     Y se monta la primera vez que se pide —no antes—: es un iframe de otra app,
     y cargarla al entrar a las herramientas costaría una descarga a quien solo
     venía a tirar el dado. Una vez montada se queda, como las cuatro. */
  const [tablaPedida, setTablaPedida] = useState(false);
  const [presentando, setPresentando] = useState(false);
  const caja = useRef(null);
  const tabla = useRef(null);

  /* La tabla filtra por CURSO —solo los tiempos que ese curso ya vio— y se
     rotula en el idioma de la suite. Embebida no hereda ninguno de los dos: son
     dos despliegues distintos, cada uno con su propio recuerdo. Así que se le
     dicen, con los mismos mensajes que el hub le manda a las apps del iframe.
     Al cargar y cuando cambian: el profesor puede cambiar el curso desde el hub
     con la tabla ya abierta. */
  const decirleALaTabla = () => {
    const w = tabla.current?.contentWindow;
    if (!w) return;
    w.postMessage({ type: 'GRAMMAR_HUB_LANG', lang }, '*');
    if (nivel) w.postMessage({ type: 'GRAMMAR_HUB_LEVEL', level: nivel }, '*');
  };
  useEffect(() => { if (tablaPedida) decirleALaTabla(); }, [lang, nivel, tablaPedida]);

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
    /* «Reloj» y no «Temporizador»: con la palabra larga la cápsula medía 347px y
       se salía de una pantalla de 360. La herramienta se sigue titulando
       «Temporizador» dentro; esto es solo la pestaña. */
    { id: 'tiempo', rotulo: es ? 'Reloj' : 'Timer' },
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
        <span className="text-sm font-bold text-slate-900 min-w-0 truncate">
          {es ? 'Herramientas de clase' : 'Classroom tools'}
        </span>
      </div>

      <div ref={caja} className={presentando ? 'fixed inset-0 z-50 bg-white overflow-auto flex flex-col' : 'contents'}>
      <div className="px-4 pt-3 flex flex-wrap items-center gap-2">
        {/* Las cuatro dentro de una cápsula: así se leen como «una de estas» y
            no como cuatro botones sueltos con el mismo peso que todo lo demás. */}
        <div className={CAPSULA} role="tablist">
          {HERRAMIENTAS.map(h => (
            <button
              key={h.id}
              onClick={() => setVista(h.id)}
              aria-pressed={vista === h.id}
              className={pestana(vista === h.id)}
            >
              {h.rotulo}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
        {/* LA TABLA DE TIEMPOS. No es una quinta pestaña de la cápsula: allí van
            las herramientas que se lanzan, y esto es material que se consulta.
            Vive en Grammaster —donde está el motor que la genera— y por eso se
            trae embebida, NO en otra pestaña del navegador. Abrirla fuera era
            abandonar el hub a mitad de clase: el profesor perdía el temporizador
            corriendo y los grupos ya repartidos, que no se guardan en ninguna
            parte.
            Está en esta fila y no en el encabezado por lo mismo que el botón de
            proyectar: fuera del contenedor de pantalla completa, proyectando no
            habría con qué abrirla ni cerrarla, y proyectada es justo como se usa
            —se deja puesta y se explica encima—. */}
        <button
          onClick={() => { setTablaPedida(true); setVista(v => (v === 'tiempos' ? 'dado' : 'tiempos')); }}
          aria-pressed={vista === 'tiempos'}
          title={es ? 'Tabla de tiempos (de Grammaster)' : 'Tense table (from Grammaster)'}
          /* El hover NO cambia el fondo: en oscuro el tinte -100 se eleva a #2a3042 y
              la tinta de marca sobre ese gris cae a 4,23:1 — lo cazó
              check-contraste-tw. Un anillo dice lo mismo y no toca el par. */
          className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 transition-all ${vista === 'tiempos' ? 'ring-1 ring-indigo-400' : 'hover:ring-1 hover:ring-indigo-300'}`}
        >
          {es ? 'Tiempos' : 'Tenses'}
          <Table2 size={13} />
        </button>

        {/* Para proyectar. Se queda DENTRO del contenedor que va a pantalla
            completa: si viviera en el encabezado, proyectando no habría botón
            para salir —solo Esc—. Apagado, porque no compite con la acción. */}
        <button
          onClick={alternarPantalla}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {presentando ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          <span className="hidden sm:inline">
            {presentando ? (es ? 'Salir' : 'Exit') : (es ? 'Pantalla completa' : 'Full screen')}
          </span>
        </button>
        </div>
      </div>

      <div className={`flex-1 px-5 py-6 ${presentando ? 'flex flex-col justify-center' : ''}`}>
        <div className={vista === 'dado' ? '' : 'hidden'}><Dado lang={lang} nivel={nivel} grande={presentando} /></div>
        <div className={vista === 'ruleta' ? '' : 'hidden'}><Ruleta lang={lang} grande={presentando} /></div>
        <div className={vista === 'grupos' ? '' : 'hidden'}><Grupos lang={lang} grande={presentando} /></div>
        <div className={vista === 'tiempo' ? '' : 'hidden'}><Temporizador lang={lang} grande={presentando} /></div>

        {/* La tabla, embebida de Grammaster por el hash que abre su pestaña de
            Tiempos. Alto explícito y no 'lo que ocupe': un iframe sin altura
            colapsa a 150px, y aquí el contenedor tampoco tiene una altura fija
            que heredar. Proyectando pide todo lo que queda bajo la fila de
            pestañas; en la vista normal se queda en 70vh para que se siga viendo
            que hay hub debajo.
            'contain' en overscroll para que al llegar al final de la tabla el
            gesto no arrastre la página del hub por detrás. */}
        {tablaPedida && (
          <div className={vista === 'tiempos' ? 'w-full' : 'hidden'}>
            <iframe
              ref={tabla}
              onLoad={decirleALaTabla}
              src={`${apps.find(a => a.id === 'grammaster').url}#tiempos`}
              title={es ? 'Tabla de tiempos' : 'Tense table'}
              className="w-full border border-slate-200 rounded-xl bg-white"
              style={{ height: presentando ? 'calc(100vh - 9rem)' : '70vh', overscrollBehavior: 'contain' }}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-downloads allow-modals"
            />
          </div>
        )}

      </div>
      </div>
    </div>
  );
};

export default PanelDocente;
