/* ============================================================================
   SEMÁFORO · la primera herramienta de CIERRE
   ----------------------------------------------------------------------------
   Las otras cuatro sirven para empezar la clase y repartir. Esta es para los
   últimos cinco minutos: el curso mira lo que acaba de hacer y dice dónde está.

   TRES FASES, UNA ACCIÓN CADA UNA, que es la regla de la sección:
     PREPARAR  elegir el objetivo del día (dos toques)   → «Proyectar»
     CONTAR    manos alzadas, sin que se vea el resultado → «Mostrar el semáforo»
     MOSTRAR   el semáforo encendido                      → «Contar otra vez»

   EL CONTEO NO SE VE MIENTRAS SE CUENTA, y es la decisión que más cambia lo que
   pasa en la sala. La autoevaluación pública tiene un problema viejo: si el
   verde ya se ve lleno, el que dudaba levanta la mano en verde. Mientras se
   cuenta solo se proyecta cuántas manos van —que el profesor necesita para no
   perder la cuenta— y no CÓMO van repartidas. El semáforo aparece de golpe al
   final, que además le da su momento.

   EL OBJETIVO SE COMPONE, no se escribe. Un tiempo del curso —solo los que ese
   curso ya vio, como el dado— más una de las tres habilidades, que son las tres
   formas que la suite entera enseña (afirmativa, interrogativa, negativa). Dos
   toques y está. El campo libre existe para el día que el objetivo no sea de
   gramática, que también hay clases así.

   EL IDIOMA VA PARTIDO A PROPÓSITO: el objetivo en inglés y los tres niveles en
   español. No es un descuido ni una traducción a medias. El objetivo es
   contenido de la clase y se dice en el idioma que se enseña; la reflexión
   sobre el propio aprendizaje es pensamiento fino, y en Básico I no existe el
   vocabulario para hacerla en inglés — pedirla así devuelve el silencio o una
   copia del ejemplo. Decisión del profesor, 31-ago-2026. Si algún día la suite
   atiende a alguien que no hable español, esta es la línea que hay que tocar.

   La aritmética de las luces está en `../semaforo.js`, con pruebas
   (`tools/check-semaforo.mjs`): un mapeo mal calibrado no da error, da una
   pantalla creíble que dice otra cosa.
   ========================================================================== */
import React, { useState } from 'react';
import { lectura, sumar, VACIO } from '../semaforo';
import { tiemposHasta, nombreDeCurso } from '../tiempos';
import { ACCION, APAGADO, opcion, ENLACE } from '../ui';

/* Colores de LÁMPARA, no de interfaz: verde, ámbar y rojo de semáforo de calle.
   Van fijos en los dos temas porque la carcasa también es fija — es un objeto
   oscuro, como el propio semáforo, y no una tarjeta de la página. Por eso
   tampoco pasan por la capa de modo oscuro: nada que invertir. */
const LAMPARA = {
  verde: '#22c55e',
  ambar: '#f59e0b',
  rojo:  '#ef4444',
};

/* LA TINTA NO ES LA LÁMPARA. El número de cada nivel va en su color para atarlo
   a su luz, pero el rojo de lámpara sobre la carcasa da 4,4:1 y el texto tiene
   un suelo que un gráfico no tiene: una lámpara puede ser todo lo tenue que
   haga falta —eso ES el dato— y un número, no. Se sube un escalón cada uno.
   Los tres pasan holgados sobre la carcasa; el rojo es el que lo necesitaba. */
const TINTA = {
  verde: '#4ade80',   /* 10.6:1 sobre la carcasa */
  ambar: '#fbbf24',   /* 10.5:1 */
  rojo:  '#fca5a5',   /*  8.7:1 · era 4.4:1 con el rojo de lámpara */
};
const CARCASA = '#12172a';
const CARCASA_INT = '#080b16';

/* Los tres niveles, en español y por orden de dominio. Son CRITERIOS: cada uno
   se puede comprobar solo, que es lo que los separa de «lo entendí». */
const NIVELES = [
  { id: 'verde', texto: 'Se lo puedo explicar a alguien' },
  { id: 'ambar', texto: 'Me sale, pero mirando el ejemplo' },
  { id: 'rojo',  texto: 'Todavía no me sale solo' },
];

/* Las tres habilidades son las tres formas de la suite. Se dicen en inglés
   porque son el objetivo, no la reflexión. */
const HABILIDADES = [
  { id: 'usar',      es: 'Usarlo',    en: 'Use it',    frase: 'I can use it without looking at an example.' },
  { id: 'preguntar', es: 'Preguntar', en: 'Ask',       frase: 'I can ask questions with it.' },
  { id: 'negar',     es: 'Negar',     en: 'Make it negative', frase: 'I can make it negative.' },
];

const Semaforo = ({ lang = 'es', nivel = null, grande = false }) => {
  const es = lang === 'es';
  const tiempos = tiemposHasta(nivel);

  const [fase, setFase] = useState('preparar');
  /* El último tiempo del curso por defecto: es el que se acaba de enseñar, así
     que el camino normal son cero toques aquí. */
  const [tiempo, setTiempo] = useState(() => tiempos[tiempos.length - 1] || null);
  const [habilidad, setHabilidad] = useState('usar');
  const [propio, setPropio] = useState('');
  const [conteo, setConteo] = useState(VACIO);

  const r = lectura(conteo);
  const frase = propio.trim() || (HABILIDADES.find(h => h.id === habilidad) || HABILIDADES[0]).frase;
  const titulo = propio.trim() ? null : (tiempo ? tiempo.en : null);

  const empezar = () => { setConteo(VACIO); setFase('contar'); };

  /* Lo que se lee de lejos. En `grande` crece el objetivo y crece el semáforo;
     los controles se quedan como están, que es lo que hace que quepan.

     Y las medidas de proyección van atadas al ALTO además de al ancho. Las
     otras herramientas proyectan una línea y les basta con `vw`; aquí hay
     carcasa, tres niveles y la lectura de abajo, y con `vw` solo, un proyector
     de 1280×720 —el más chico que se encuentra en una sala— dejaba la frase
     final fuera de la pantalla. `min()` deja que mande la dimensión que
     escasee. Va en `style` y no en clases: son fórmulas, no una escala. */
  const M = {
    rotulo:  'min(2.2vw, 4vh)',
    frase:   'min(4vw, 8vh)',
    lampara: 'min(11.5vh, 8vw)',
    nivel:   'min(1.9vw, 3.6vh)',
    numero:  'min(1.5vw, 2.8vh)',
    lectura: 'min(2.2vw, 4vh)',
  };
  const Objetivo = () => (
    <div className="text-center">
      {/* `--marca`, no `text-indigo-600`. El rótulo del tiempo va sobre el fondo
          de la PÁGINA, no sobre una tarjeta blanca, y ahí la capa oscura no
          tiene nada que invertir: el índigo-600 daba 3,07:1 y lo cazó la sonda.
          La variable es justo lo que los tokens ofrecen para «el acento de
          interfaz», con un valor por tema: 6,1:1 en los dos. */}
      {titulo && (
        <p className={`font-bold uppercase tracking-wider ${grande ? '' : 'text-xs'}`}
           style={{ color: 'var(--marca)', fontSize: grande ? M.rotulo : undefined }}>
          {titulo}
        </p>
      )}
      <p className={`font-bold text-slate-900 ${grande ? 'leading-tight mt-2' : 'text-xl sm:text-2xl mt-1'}`}
         style={{ fontSize: grande ? M.frase : undefined }}>
        {frase}
      </p>
    </div>
  );

  /* La carcasa con las tres lámparas. El hueco de cada lámpara mide siempre lo
     máximo aunque la luz esté chica: si el hueco encogiera, las tres se moverían
     de sitio en cada conteo y el semáforo dejaría de ser un objeto quieto. */
  const maxLampara = grande ? M.lampara : '4.6rem';
  const Luz = ({ id, brillo, tamano, votos, texto, encendido }) => (
    <div className="flex items-center gap-3 sm:gap-4">
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: maxLampara, height: maxLampara }}
      >
        {/* El cristal: se ve siempre, esté la luz encendida o no. */}
        <span
          aria-hidden="true"
          className="absolute rounded-full"
          style={{ width: '100%', height: '100%', background: CARCASA_INT, border: '1px solid rgba(255,255,255,.07)' }}
        />
        <span
          aria-hidden="true"
          className="relative rounded-full transition-all duration-500"
          style={{
            width: `calc(${maxLampara} * ${encendido ? tamano : 0.45} * 0.86)`,
            height: `calc(${maxLampara} * ${encendido ? tamano : 0.45} * 0.86)`,
            background: LAMPARA[id],
            opacity: encendido ? brillo : 0.12,
            /* El halo crece con el brillo: es lo que hace que una luz encendida
               se lea como encendida y no como un círculo de color. */
            boxShadow: encendido && brillo > 0.3
              ? `0 0 ${Math.round(brillo * (grande ? 70 : 30))}px ${LAMPARA[id]}`
              : 'none',
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-semibold text-white ${grande ? 'leading-snug' : 'text-sm sm:text-base'}`}
           style={{ fontSize: grande ? M.nivel : undefined }}>
          {texto}
        </p>
        {encendido && (
          <p className={`font-bold tabular-nums ${grande ? '' : 'text-xs'}`} style={{ color: TINTA[id], fontSize: grande ? M.numero : undefined }}>
            {votos}
          </p>
        )}
      </div>
    </div>
  );

  const Carcasa = ({ encendido }) => (
    <div
      className={`mx-auto rounded-3xl ${grande ? 'px-8 py-6' : 'px-5 py-5'}`}
      style={{ background: CARCASA, maxWidth: grande ? '54rem' : '30rem' }}
    >
      <div className={`flex flex-col ${grande ? 'gap-4' : 'gap-3'}`}>
        {NIVELES.map(n => {
          const l = r.luces.find(x => x.id === n.id);
          return <Luz key={n.id} id={n.id} texto={n.texto} encendido={encendido}
                      brillo={l.brillo} tamano={l.tamano} votos={l.votos} />;
        })}
      </div>
    </div>
  );

  return (
    <section className={grande ? 'w-full' : 'w-full max-w-xl mx-auto'}>
      {!grande && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-1">{es ? 'Semáforo' : 'Traffic light'}</h2>
          <p className="text-sm text-muted mb-4">
            {es ? 'Para cerrar: el curso se autoevalúa contra un criterio y se ve dónde está. No guarda nada.'
                : 'To close the lesson: the class self-assesses against a criterion and sees where it stands. Nothing is stored.'}
          </p>
        </>
      )}

      {/* ── PREPARAR ──────────────────────────────────────────────────────── */}
      {fase === 'preparar' && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">
              {es ? 'Tiempo' : 'Tense'}
              {' '}
              <span className="font-normal text-muted">
                {nivel ? (es ? `· los de ${nombreDeCurso(nivel, lang)}` : `· from ${nombreDeCurso(nivel, lang)}`)
                       : (es ? '· sin curso elegido, salen todos' : '· no course selected, all of them')}
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tiempos.map(t => (
                <button key={t.id} onClick={() => setTiempo(t)} aria-pressed={tiempo?.id === t.id}
                        disabled={!!propio.trim()}
                        className={`${opcion(tiempo?.id === t.id)} ${propio.trim() ? 'opacity-40' : ''}`}>
                  {es ? t.es : t.en}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">{es ? 'Puedo…' : 'I can…'}</p>
            <div className="flex flex-wrap gap-1.5">
              {HABILIDADES.map(h => (
                <button key={h.id} onClick={() => setHabilidad(h.id)} aria-pressed={habilidad === h.id}
                        disabled={!!propio.trim()}
                        className={`${opcion(habilidad === h.id)} ${propio.trim() ? 'opacity-40' : ''}`}>
                  {es ? h.es : h.en}
                </button>
              ))}
            </div>
          </div>

          {/* El campo libre GANA a lo compuesto en cuanto tiene algo escrito: si
              los dos valieran a la vez habría que explicar cuál manda. */}
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">
              {es ? 'O escribe otro objetivo' : 'Or write another objective'}
            </span>
            <input
              type="text" value={propio} onChange={(e) => setPropio(e.target.value)}
              placeholder={es ? 'I can order food in a restaurant.' : 'I can order food in a restaurant.'}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
            <Objetivo />
          </div>

          <button onClick={empezar} disabled={!titulo && !propio.trim()} className={ACCION}>
            {es ? 'Proyectar' : 'Project it'}
          </button>
        </div>
      )}

      {/* ── CONTAR ────────────────────────────────────────────────────────── */}
      {fase === 'contar' && (
        <div className="space-y-4">
          <Objetivo />
          {/* Los tres niveles SIN luces: el curso tiene que poder leerlos para
              levantar la mano, pero no ver cómo va el reparto. */}
          <Carcasa encendido={false} />

          <div className={grande ? 'max-w-3xl mx-auto' : ''}>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">
              {es ? 'Cuenta las manos' : 'Count the hands'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {NIVELES.map(n => (
                <button
                  key={n.id}
                  onClick={() => setConteo(c => sumar(c, n.id))}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl border border-slate-300 bg-white hover:border-slate-400 transition-colors touch-manipulation"
                >
                  <span aria-hidden="true" className="w-5 h-5 rounded-full" style={{ background: LAMPARA[n.id] }} />
                  <span className="text-xs font-bold text-slate-700">+1</span>
                </button>
              ))}
            </div>

            {/* Cuántas van, NO cómo van repartidas: el profesor necesita lo
                primero para no perder la cuenta y lo segundo es justo lo que no
                puede verse todavía. */}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-sm text-slate-600 tabular-nums">
                {r.total} {es ? (r.total === 1 ? 'mano contada' : 'manos contadas') : (r.total === 1 ? 'hand counted' : 'hands counted')}
              </span>
              <button onClick={() => setConteo(VACIO)} disabled={!r.total} className={ENLACE}>
                {es ? 'empezar la cuenta de nuevo' : 'start the count again'}
              </button>
            </div>

            <button onClick={() => setFase('mostrar')} disabled={!r.total} className={`mt-3 ${ACCION}`}>
              {es ? 'Mostrar el semáforo' : 'Show the traffic light'}
            </button>
            <button onClick={() => setFase('preparar')} className={`mt-2 w-full ${APAGADO}`}>
              {es ? 'Cambiar el objetivo' : 'Change the objective'}
            </button>
          </div>
        </div>
      )}

      {/* ── MOSTRAR ───────────────────────────────────────────────────────── */}
      {fase === 'mostrar' && (
        <div className="space-y-4">
          <Objetivo />
          <div aria-live="polite">
            <Carcasa encendido />
            {/* La lectura en una frase, que es lo que se dice en voz alta. Con
                empate no se canta ninguna: elegir por ellos sería inventar. */}
            <p className={`text-center font-bold text-slate-900 mt-3 ${grande ? '' : 'text-base'}`}
               style={{ fontSize: grande ? M.lectura : undefined }}>
              {r.dominante
                ? (es ? `El curso está en ${{ verde: 'verde', ambar: 'ámbar', rojo: 'rojo' }[r.dominante]}.`
                      : `The class is on ${{ verde: 'green', ambar: 'amber', rojo: 'red' }[r.dominante]}.`)
                : (es ? 'El curso está repartido.' : 'The class is split.')}
            </p>
          </div>

          <div className={`flex flex-wrap gap-2 ${grande ? 'max-w-3xl mx-auto' : ''}`}>
            <button onClick={empezar} className={`flex-1 ${APAGADO}`}>
              {es ? 'Contar otra vez' : 'Count again'}
            </button>
            <button onClick={() => setFase('preparar')} className={`flex-1 ${APAGADO}`}>
              {es ? 'Otro objetivo' : 'Another objective'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Semaforo;
