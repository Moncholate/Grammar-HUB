/* ============================================================================
   LA DUDA · segunda herramienta de CIERRE
   ----------------------------------------------------------------------------
   «¿Alguna duda?» produce silencio, y no porque no las haya. Nombrar el propio
   hueco desde cero es la parte difícil de tener una duda: hay que saber ya
   bastante para poder decir QUÉ es lo que no sabes. Un molde a medio hacer se
   completa; una pregunta en blanco, no.

       «No me queda claro cuándo se usa ____ en vez de ____.»

   Y el molde llega con los dos huecos puestos: el par que ESE curso confunde,
   filtrado por lo que ya vio (`../confusiones.js`). Dos huecos vacíos serían
   otra vez una pregunta en blanco.

   TRES FASES, UNA ACCIÓN CADA UNA:
     PREPARAR  qué molde y cuánto tiempo   → «Proyectar»
     ESCRIBIR  el molde grande, el reloj corriendo
     LEER      a quién le toca contarla

   EL RELOJ VA CONTRA EL RELOJ DEL SISTEMA, no restando uno por segundo. Es lo
   mismo que aprendió el temporizador: un intervalo que se retrasa —pestaña de
   fondo, teléfono que se duerme— acumula el retraso y el reloj miente justo
   cuando la clase lo está mirando.

   SE ESCRIBE EN SILENCIO Y DESPUÉS SE LEE. El minuto y medio a solas no es
   relleno: sin él contesta el mismo de siempre, y el que necesita pensarlo se
   queda sin decir nada. Lo que se lee en voz alta es una frase que ya está
   escrita, no una confesión improvisada.

   LOS NOMBRES SALEN DE LA LISTA QUE YA ESTÁ EN GRUPOS, y solo de quien vino
   hoy: llamar a alguien que no está es el fallo clásico de sortear nombres. Si
   no hay lista cargada, la herramienta sigue sirviendo — pide tres voluntarios
   y ya. Nada se guarda, aquí tampoco.
   ========================================================================== */
import React, { useState, useRef, useEffect } from 'react';
import { paresDe, parPorDefecto } from '../confusiones';
import { nombreDeCurso } from '../tiempos';
import { barajar } from '../lista';
import { formatoReloj, estadoReloj } from '../temporizador';
import { ACCION, APAGADO, opcion, ENLACE } from '../ui';

/* Minuto y medio por defecto. Menos no alcanza para releer lo que se hizo y
   más se convierte en tiempo muerto: se nota en la sala cuando sobra. */
const SEGUNDOS = [60, 90, 120];
const CUANTOS = 3;

const Duda = ({ lang = 'es', nivel = null, curso = [], grande = false }) => {
  const es = lang === 'es';
  const pares = paresDe(nivel);

  const [fase, setFase] = useState('preparar');
  const [par, setPar] = useState(() => parPorDefecto(nivel));
  const [molde, setMolde] = useState('par');
  const [total, setTotal] = useState(90);
  const [restante, setRestante] = useState(90);
  const [elegidos, setElegidos] = useState([]);
  const finRef = useRef(0);
  const tick = useRef(null);

  useEffect(() => () => clearInterval(tick.current), []);

  /* Los tres moldes. El del par es el que el currículo puede rellenar; los otros
     dos existen para el día que la clase no fue de gramática, que también los
     hay. Se escriben partidos porque el hueco se pinta distinto que el texto. */
  const MOLDES = [
    { id: 'par',    rotulo: es ? 'Dos que se parecen' : 'Two that look alike' },
    { id: 'costo',  rotulo: es ? 'Lo que costó' : 'What was hard' },
    { id: 'porque', rotulo: es ? 'El porqué' : 'The why' },
  ];

  const frase = () => {
    if (molde === 'costo') return { partes: [es ? 'Lo que más me costó hoy fue' : 'The hardest thing today was'], huecos: 1 };
    if (molde === 'porque') return { partes: [es ? 'Todavía no entiendo por qué' : 'I still do not understand why'], huecos: 1 };
    return {
      partes: es
        ? ['No me queda claro cuándo se usa', 'en vez de']
        : ['I am not sure when to use', 'instead of'],
      rellenos: par ? [es ? par.a.es : par.a.en, es ? par.b.es : par.b.en] : ['', ''],
      huecos: 0,
    };
  };

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

  /* Las medidas de proyección, atadas al alto además de al ancho: el molde es
     una frase larga y el reloj es alto, y con `vw` solo, en 1280×720 el
     conjunto se salía. Mismo criterio que el semáforo. */
  const M = {
    molde:   'min(4vw, 8vh)',
    hueco:   'min(4vw, 8vh)',
    reloj:   'min(9vw, 16vh)',
    nombre:  'min(3.4vw, 6vh)',
    rotulo:  'min(2vw, 3.6vh)',
  };

  const f = frase();
  const estado = estadoReloj(restante);

  /* El molde, que es lo que se lee de lejos. Los huecos se pintan como huecos
     —línea de puntos— cuando hay que rellenarlos, y como el nombre del tiempo
     cuando el currículo ya lo puso: son dos cosas distintas y tienen que
     verse distintas. */
  const Molde = () => (
    <p
      className={`text-center font-bold text-slate-900 ${grande ? 'leading-tight' : 'text-xl sm:text-2xl'}`}
      style={{ fontSize: grande ? M.molde : undefined }}
    >
      {f.partes.map((p, i) => (
        <React.Fragment key={i}>
          {p}{' '}
          {f.rellenos
            ? <span style={{ color: 'var(--marca)' }}>{f.rellenos[i]}</span>
            : <span className="text-muted">______</span>}
          {i < f.partes.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
      {f.rellenos ? '.' : '…'}
    </p>
  );

  return (
    <section className={grande ? 'w-full' : 'w-full max-w-xl mx-auto'}>
      {!grande && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-1">{es ? 'La duda' : 'The doubt'}</h2>
          <p className="text-sm text-muted mb-4">
            {es ? 'Para cerrar: cada uno nombra lo que le quedó a medias, con un molde. No guarda nada.'
                : 'To close the lesson: everyone names what is still unclear, with a sentence frame. Nothing is stored.'}
          </p>
        </>
      )}

      {/* ── PREPARAR ──────────────────────────────────────────────────────── */}
      {fase === 'preparar' && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">{es ? 'Molde' : 'Frame'}</p>
            <div className="flex flex-wrap gap-1.5">
              {MOLDES.map(m => (
                <button key={m.id} onClick={() => setMolde(m.id)} aria-pressed={molde === m.id}
                        disabled={m.id === 'par' && !pares.length}
                        className={`${opcion(molde === m.id)} ${m.id === 'par' && !pares.length ? 'opacity-40' : ''}`}>
                  {m.rotulo}
                </button>
              ))}
            </div>
          </div>

          {molde === 'par' && pares.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1.5">
                {es ? 'El par' : 'The pair'}{' '}
                <span className="font-normal text-muted">
                  {nivel ? (es ? `· los que ${nombreDeCurso(nivel, lang)} puede confundir` : `· the ones ${nombreDeCurso(nivel, lang)} can mix up`)
                         : (es ? '· sin curso elegido, salen todos' : '· no course selected, all of them')}
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pares.map(p => (
                  <button key={p.id} onClick={() => setPar(p)} aria-pressed={par?.id === p.id}
                          title={p.porque} className={opcion(par?.id === p.id)}>
                    {es ? `${p.a.es} / ${p.b.es}` : `${p.a.en} / ${p.b.en}`}
                  </button>
                ))}
              </div>
              {/* El porqué del par elegido, para el profesor y no para proyectar:
                  a veces hace falta acordarse de por qué ese y no otro. */}
              {par && <p className="mt-2 text-xs text-muted">{par.porque}</p>}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">{es ? 'Para escribirla' : 'To write it'}</p>
            <div className="flex flex-wrap gap-1.5">
              {SEGUNDOS.map(s => (
                <button key={s} onClick={() => { setTotal(s); setRestante(s); }} aria-pressed={total === s}
                        className={opcion(total === s)}>
                  {formatoReloj(s)}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
            <Molde />
          </div>

          <button onClick={arrancar} className={ACCION}>{es ? 'Proyectar' : 'Project it'}</button>
        </div>
      )}

      {/* ── ESCRIBIR ──────────────────────────────────────────────────────── */}
      {fase === 'escribir' && (
        <div className="space-y-4">
          <Molde />
          <p className="text-center text-muted" style={{ fontSize: grande ? M.rotulo : undefined }}>
            {es ? 'En silencio. Vale decir «casi todo»: eso también es un lugar.'
                : 'In silence. “Almost everything” is a valid answer: that is a place too.'}
          </p>
          {/* El reloj, con los últimos diez segundos en rojo. `aria-live` off:
              cantarlo cada segundo sería insoportable. */}
          <p
            className={`text-center font-extrabold tabular-nums leading-none ${
              estado === 'normal' ? 'text-slate-900' : 'text-red-600'
            } ${grande ? '' : 'text-6xl'}`}
            style={{ fontSize: grande ? M.reloj : undefined }}
          >
            {formatoReloj(restante)}
          </p>

          <div className={grande ? 'max-w-3xl mx-auto' : ''}>
            <button onClick={sortear} className={ACCION}>
              {curso.length ? (es ? 'A quién le toca' : 'Whose turn') : (es ? 'Se acabó' : 'Time is up')}
            </button>
            <button onClick={() => { clearInterval(tick.current); setFase('preparar'); }} className={`mt-2 w-full ${APAGADO}`}>
              {es ? 'Cambiar el molde' : 'Change the frame'}
            </button>
          </div>
        </div>
      )}

      {/* ── LEER ──────────────────────────────────────────────────────────── */}
      {fase === 'leer' && (
        <div className="space-y-4">
          <Molde />
          <div aria-live="polite" className="text-center">
            <p className="font-bold uppercase tracking-wider" style={{ color: 'var(--marca)', fontSize: grande ? M.rotulo : undefined }}>
              {es ? 'Y ahora cuentan' : 'And now they tell us'}
            </p>
            {elegidos.length ? (
              <ul className={`mt-2 flex flex-wrap justify-center gap-x-6 gap-y-1 font-bold text-slate-900 ${grande ? '' : 'text-2xl'}`}
                  style={{ fontSize: grande ? M.nombre : undefined }}>
                {elegidos.map(n => <li key={n}>{n}</li>)}
              </ul>
            ) : (
              /* Sin lista cargada la herramienta no se cae: pide voluntarios,
                 que es lo que se hacía antes de que existiera. */
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
              {es ? 'Otra duda' : 'Another doubt'}
            </button>
          </div>

          {!curso.length && (
            <p className="text-xs text-muted text-center">
              {es ? 'Con la lista del curso cargada en Grupos, aquí salen tres nombres de quienes vinieron hoy.'
                  : 'With the class list loaded in Groups, three names of whoever came today show up here.'}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default Duda;
