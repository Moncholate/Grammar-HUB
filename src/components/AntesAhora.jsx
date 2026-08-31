/* ============================================================================
   ANTES / AHORA · cuarta y última herramienta de CIERRE
   ----------------------------------------------------------------------------
   La única de las cuatro que pide evidencia de CAMBIO.

       Antes pensaba que ____ estaba bien · Ahora pienso ____ porque ____

   «Sí, entendí» se puede fingir sin darse cuenta —el alumno lo cree cuando lo
   dice—; «antes creía X y ahora creo Y porque Z» no. Hay que haber movido algo
   para poder contarlo, y si la razón que da está equivocada, eso es exactamente
   lo que había que ver: la herramienta NO juzga la respuesta.

   LA MITAD QUE VALE ES LA SEGUNDA. Voltear la frase es fácil y se puede copiar
   del pizarrón; el «porque» no. Por eso el porqué de cada error vive en los
   datos pero NO se proyecta: si sale en pantalla, la rutina se convierte en
   copiar. El profesor lo ve al elegir, para saber si ese error le sirve.

   EL ERROR TIENE QUE HABER PARECIDO BIEN. Uno que el alumno nunca creyó no
   deja nada que voltear. Los mejores son los de interferencia —«lo he visto
   ayer» es español impecable, así que «I have seen him yesterday» suena bien—
   y los de la marca que se muda, que es el error más repetido de la clase.
   Están en `../errores.js`, filtrados por lo que el curso vio.

   Y HAY MODO EN BLANCO: los dos lados vacíos, para que cada uno ponga el suyo.
   Es el que sirve el día que la clase no fue de gramática, y también el que
   pide más — pero el que da mejor material cuando el curso ya tiene el hábito.

   Tres fases, una acción cada una, como las otras tres del cierre.
   ========================================================================== */
import React, { useState, useRef, useEffect } from 'react';
import { erroresDe, errorPorDefecto } from '../errores';
import { nombreDeCurso } from '../tiempos';
import { barajar } from '../lista';
import { formatoReloj, estadoReloj } from '../temporizador';
import CargarCurso from './CargarCurso';
import { ACCION, APAGADO, opcion, ENLACE } from '../ui';

/* Dos minutos. Es más que «La duda» porque aquí se escriben dos frases y una
   razón, y menos que la apuesta porque no hay que producir gramática nueva. */
const SEGUNDOS = [90, 120, 180];
const CUANTOS = 3;

const AntesAhora = ({ lang = 'es', nivel = null, curso = [], origen = null, onCargar, onCambiarLista, grande = false }) => {
  const es = lang === 'es';
  const errores = erroresDe(nivel);

  const [fase, setFase] = useState('preparar');
  const [error, setError] = useState(() => errorPorDefecto(nivel));
  const [enBlanco, setEnBlanco] = useState(false);
  const [total, setTotal] = useState(120);
  const [restante, setRestante] = useState(120);
  const [elegidos, setElegidos] = useState([]);
  const finRef = useRef(0);
  const tick = useRef(null);

  useEffect(() => () => clearInterval(tick.current), []);

  const arrancar = () => {
    clearInterval(tick.current);
    setRestante(total);
    finRef.current = Date.now() + total * 1000;
    setFase('escribir');
    tick.current = setInterval(() => {
      const quedan = Math.max(0, Math.round((finRef.current - Date.now()) / 1000));
      setRestante(quedan);
      if (quedan <= 0) clearInterval(tick.current);
    }, 250);
  };

  const sortear = () => {
    clearInterval(tick.current);
    setElegidos(barajar(curso).slice(0, CUANTOS));
    setFase('leer');
  };

  const M = {
    rotulo:  'min(1.8vw, 3.2vh)',
    frase:   'min(3vw, 5.5vh)',
    cola:    'min(1.9vw, 3.4vh)',
    reloj:   'min(6vw, 11vh)',
    nombre:  'min(3.2vw, 5.6vh)',
  };

  const hayError = !enBlanco && !!error;
  const estado = estadoReloj(restante);

  /* Los dos paneles. El de la izquierda va apagado —es lo que YA NO se piensa—
     y el de la derecha en tinta plena. Que se vean distintos es la mitad del
     mensaje: uno quedó atrás. */
  const Panel = ({ rotulo, frase, cola, viejo }) => (
    <div className={`flex-1 rounded-xl border px-4 py-4 ${viejo ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-white'}`}>
      <p className="font-bold uppercase tracking-wider text-muted" style={{ fontSize: grande ? M.rotulo : undefined }}>
        <span className={grande ? '' : 'text-[11px]'}>{rotulo}</span>
      </p>
      <p className={`mt-2 font-bold ${viejo ? 'text-slate-600 line-through decoration-2' : 'text-slate-900'} ${grande ? 'leading-tight' : 'text-lg'}`}
         style={{ fontSize: grande ? M.frase : undefined }}>
        {frase || <span className="text-muted no-underline">______</span>}
      </p>
      <p className="mt-3 text-muted" style={{ fontSize: grande ? M.cola : undefined }}>
        <span className={grande ? '' : 'text-sm'}>{cola}</span>
      </p>
    </div>
  );

  const Marco = () => (
    <div className={`mx-auto flex flex-col sm:flex-row gap-3 ${grande ? 'max-w-6xl' : 'max-w-2xl'}`}>
      <Panel
        viejo
        rotulo={es ? 'Antes pensaba' : 'I used to think'}
        frase={hayError ? error.mal : ''}
        cola={es ? '…que estaba bien.' : '…that it was fine.'}
      />
      <Panel
        rotulo={es ? 'Ahora pienso' : 'Now I think'}
        frase={hayError ? error.bien : ''}
        cola={es ? '…porque ______' : '…because ______'}
      />
    </div>
  );

  return (
    <section className={grande ? 'w-full' : 'w-full max-w-xl mx-auto'}>
      {!grande && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-1">{es ? 'Antes / Ahora' : 'Then / Now'}</h2>
          <p className="text-sm text-muted mb-4">
            {es ? 'Para cerrar: qué creía al empezar la clase que ya no creo, y por qué. No guarda nada.'
                : 'To close the lesson: what I believed when the class started that I no longer believe, and why. Nothing is stored.'}
          </p>
        </>
      )}

      {/* ── PREPARAR ──────────────────────────────────────────────────────── */}
      {fase === 'preparar' && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">
              {es ? 'El error' : 'The mistake'}{' '}
              <span className="font-normal text-muted">
                {nivel ? (es ? `· de los tiempos de ${nombreDeCurso(nivel, lang)}` : `· from ${nombreDeCurso(nivel, lang)}’s tenses`)
                       : (es ? '· sin curso elegido, de todos' : '· no course selected, all of them')}
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {errores.map(e => (
                <button key={e.id} onClick={() => { setError(e); setEnBlanco(false); }}
                        aria-pressed={!enBlanco && error?.id === e.id}
                        className={opcion(!enBlanco && error?.id === e.id)}>
                  {es ? e.tiempo.es : e.tiempo.en}
                </button>
              ))}
              {/* En blanco: cada uno pone el suyo. Pide más y da mejor material
                  cuando el curso ya tiene el hábito. */}
              <button onClick={() => setEnBlanco(true)} aria-pressed={enBlanco} className={opcion(enBlanco)}>
                {es ? 'En blanco' : 'Blank'}
              </button>
            </div>
            {/* El porqué, para el profesor. NO se proyecta: es lo que el alumno
                tiene que producir, y en pantalla la rutina sería copiar. */}
            {hayError && <p className="mt-2 text-xs text-muted">{error.porque}</p>}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">{es ? 'Para escribirlo' : 'To write it'}</p>
            <div className="flex flex-wrap gap-1.5">
              {SEGUNDOS.map(s => (
                <button key={s} onClick={() => { setTotal(s); setRestante(s); }} aria-pressed={total === s} className={opcion(total === s)}>
                  {formatoReloj(s)}
                </button>
              ))}
            </div>
          </div>

          <Marco />

          <button onClick={arrancar} className={ACCION}>{es ? 'Proyectar' : 'Project it'}</button>

          {/* La misma puerta a la lista que «La duda»: plegada y después de la
              acción, porque sin lista la herramienta funciona igual. */}
          <details className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <summary className="text-sm font-semibold text-slate-700 cursor-pointer">
              {curso.length
                ? (es ? `Lista del curso · ${curso.length} presentes` : `Class list · ${curso.length} present`)
                : (es ? 'Cargar la lista del curso, para sortear a quién le toca' : 'Load the class list, to draw whose turn it is')}
            </summary>
            <div className="mt-3">
              {curso.length ? (
                <>
                  {origen && (
                    <p className="mb-3 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-2">
                      {es
                        ? `${origen.curso || 'Curso'} · clase ${origen.clase} del ${origen.fecha}: ${origen.ausentes} no vinieron y no entran en el sorteo.`
                        : `${origen.curso || 'Course'} · class ${origen.clase} on ${origen.fecha}: ${origen.ausentes} were absent and are out of the draw.`}
                    </p>
                  )}
                  <p className="text-xs text-muted mb-2">{curso.join(' · ')}</p>
                  <button onClick={() => onCambiarLista?.()} className={ENLACE}>
                    {es ? 'cambiar lista' : 'change list'}
                  </button>
                </>
              ) : (
                <CargarCurso lang={lang} onCargar={onCargar} compacto />
              )}
            </div>
          </details>
        </div>
      )}

      {/* ── ESCRIBIR ──────────────────────────────────────────────────────── */}
      {fase === 'escribir' && (
        <div className="space-y-4">
          <Marco />
          <p className="text-center font-bold text-slate-900" style={{ fontSize: grande ? M.cola : undefined }}>
            {es ? 'La mitad que vale es el porqué.' : 'The half that counts is the why.'}
          </p>
          <p className={`text-center font-extrabold tabular-nums leading-none ${
              estado === 'normal' ? 'text-slate-900' : 'text-red-600'
            } ${grande ? '' : 'text-5xl'}`}
            style={{ fontSize: grande ? M.reloj : undefined }}>
            {formatoReloj(restante)}
          </p>

          <div className={grande ? 'max-w-3xl mx-auto' : ''}>
            <button onClick={sortear} className={ACCION}>
              {curso.length ? (es ? 'A quién le toca' : 'Whose turn') : (es ? 'Se acabó' : 'Time is up')}
            </button>
            <button onClick={() => { clearInterval(tick.current); setFase('preparar'); }} className={`mt-2 w-full ${APAGADO}`}>
              {es ? 'Cambiar el error' : 'Change the mistake'}
            </button>
          </div>
        </div>
      )}

      {/* ── LEER ──────────────────────────────────────────────────────────── */}
      {fase === 'leer' && (
        <div className="space-y-4">
          <Marco />
          <div aria-live="polite" className="text-center">
            <p className="font-bold uppercase tracking-wider" style={{ color: 'var(--marca)', fontSize: grande ? M.rotulo : undefined }}>
              {es ? 'Y ahora cuentan el porqué' : 'And now they tell us the why'}
            </p>
            {elegidos.length ? (
              <ul className={`mt-2 flex flex-wrap justify-center gap-x-6 gap-y-1 font-bold text-slate-900 ${grande ? '' : 'text-2xl'}`}
                  style={{ fontSize: grande ? M.nombre : undefined }}>
                {elegidos.map(n => <li key={n}>{n}</li>)}
              </ul>
            ) : (
              <p className={`mt-2 font-bold text-slate-900 ${grande ? '' : 'text-2xl'}`}
                 style={{ fontSize: grande ? M.nombre : undefined }}>
                {es ? 'Tres voluntarios' : 'Three volunteers'}
              </p>
            )}
          </div>

          <div className={`flex flex-wrap gap-2 ${grande ? 'max-w-3xl mx-auto' : ''}`}>
            {curso.length > CUANTOS && (
              <button onClick={sortear} className={`flex-1 ${APAGADO}`}>{es ? 'Otros tres' : 'Another three'}</button>
            )}
            <button onClick={() => setFase('preparar')} className={`flex-1 ${APAGADO}`}>
              {es ? 'Otro error' : 'Another mistake'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AntesAhora;
