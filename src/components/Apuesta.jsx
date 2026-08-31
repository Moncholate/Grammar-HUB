/* ============================================================================
   APUESTA · tercera herramienta de CIERRE
   ----------------------------------------------------------------------------
   El movimiento que más enseña de los cuatro, y el único que no se puede hacer
   sin una herramienta que imponga el orden.

   PREDECIR Y DESPUÉS COMPROBAR. El alumno escribe cinco oraciones, APUESTA
   cuántas cree tener bien, y recién entonces corrige. Lo que enseña no es
   acertar: es descubrir que creías cuatro y tenías dos. Esa distancia —la
   calibración— es literalmente el objeto de la metacognición, y es información
   que ninguna nota entrega, porque la produce el propio alumno sobre sí mismo.

   EL ORDEN NO ES NEGOCIABLE, y por eso son cuatro pantallas y no una. Si la
   apuesta se pide después de ver las respuestas, no es una apuesta: es una
   descripción. La herramienta existe para que ese orden no dependa de la buena
   fe de nadie a las 12:50 de un viernes.

     ESCRIBIR   las cinco consignas y el reloj
     APOSTAR    «¿cuántas crees que tienes bien?» — se escribe y se tapa
     COMPARAR   «aposté ___ · tuve ___» y la pregunta que importa

   NO CORRIGE, y es a propósito. Corregir aquí sería otra app: la suite ya tiene
   tres que lo hacen, y la pestaña Tiempos de Grammaster está a un toque en el
   mismo proyector. Lo que esta herramienta aporta es el momento del compromiso,
   que es lo que ninguna de las otras tiene.

   EL SET SE REPARTE, no se sortea cinco veces. Un dado tirado cinco veces puede
   dar cinco veces el mismo tiempo o las cinco en afirmativa, y entonces se
   acierta o se falla en bloque y la distancia no dice nada. Las reglas y sus
   pruebas están en `../apuesta.js`.
   ========================================================================== */
import React, { useState, useRef, useEffect } from 'react';
import { sacarConsignas, CUANTAS } from '../apuesta';
import { tiemposHasta, nombreDeCurso } from '../tiempos';
import { FORM_SIGNS, FORM_ORDER } from '../forms.generated.jsx';
import { formatoReloj, estadoReloj } from '../temporizador';
import { ACCION, APAGADO, opcion } from '../ui';

/* Cuatro minutos para cinco oraciones. Menos deja a media clase sin terminar,
   y una apuesta sobre algo que no se terminó no mide calibración: mide prisa. */
const MINUTOS = [3, 4, 5];

const Apuesta = ({ lang = 'es', nivel = null, grande = false }) => {
  const es = lang === 'es';
  const tiempos = tiemposHasta(nivel);

  const [fase, setFase] = useState('preparar');
  const [cuantas, setCuantas] = useState(5);
  const [minutos, setMinutos] = useState(4);
  const [consignas, setConsignas] = useState([]);
  const [restante, setRestante] = useState(4 * 60);
  const finRef = useRef(0);
  const tick = useRef(null);

  useEffect(() => () => clearInterval(tick.current), []);

  const sacar = () => setConsignas(sacarConsignas({ tiempos, formas: FORM_ORDER, cuantas }));

  const arrancar = () => {
    const set = sacarConsignas({ tiempos, formas: FORM_ORDER, cuantas });
    setConsignas(set);
    clearInterval(tick.current);
    setRestante(minutos * 60);
    finRef.current = Date.now() + minutos * 60 * 1000;
    setFase('escribir');
    /* Contra el reloj del sistema y no restando uno por segundo: un intervalo
       que se retrasa acumula el retraso y miente mientras la clase mira. */
    tick.current = setInterval(() => {
      const quedan = Math.max(0, Math.round((finRef.current - Date.now()) / 1000));
      setRestante(quedan);
      if (quedan <= 0) clearInterval(tick.current);
    }, 250);
  };

  const M = {
    consigna: 'min(2.6vw, 5vh)',
    numero:   'min(1.8vw, 3.4vh)',
    reloj:    'min(6vw, 11vh)',
    pregunta: 'min(3.6vw, 7vh)',
    rotulo:   'min(2vw, 3.6vh)',
    hueco:    'min(7vw, 13vh)',
  };

  const etiqueta = (c) => {
    const f = FORM_SIGNS[c.forma];
    return `${es ? c.tiempo.es : c.tiempo.en} · ${c.sujeto} · ${f ? f.label[es ? 'es' : 'en'] : c.forma}`;
  };

  /* Las consignas, numeradas. Lo que se lee de lejos y lo que se copia en el
     cuaderno, así que el número tiene que ser inequívoco: se apuesta sobre
     «cuántas de estas cinco» y hay que poder señalar cuál falló. */
  const Consignas = () => (
    <ol className={`mx-auto ${grande ? 'max-w-4xl' : 'max-w-lg'} flex flex-col ${grande ? 'gap-2' : 'gap-1.5'}`}>
      {consignas.map((c, i) => (
        <li key={i} className="flex items-baseline gap-3 border-b border-slate-200 pb-1.5 last:border-b-0">
          <span className="font-bold text-muted tabular-nums shrink-0"
                style={{ fontSize: grande ? M.numero : undefined }}>{i + 1}</span>
          <span className={`font-semibold text-slate-900 ${grande ? '' : 'text-base'}`}
                style={{ fontSize: grande ? M.consigna : undefined }}>
            {etiqueta(c)}
          </span>
        </li>
      ))}
    </ol>
  );

  const estado = estadoReloj(restante);

  return (
    <section className={grande ? 'w-full' : 'w-full max-w-xl mx-auto'}>
      {!grande && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-1">{es ? 'Apuesta' : 'The bet'}</h2>
          <p className="text-sm text-muted mb-4">
            {es ? 'Para cerrar: escriben, apuestan cuántas creen tener bien, y recién entonces corrigen. No guarda nada.'
                : 'To close the lesson: they write, bet how many they think are right, and only then check. Nothing is stored.'}
          </p>
        </>
      )}

      {/* ── PREPARAR ──────────────────────────────────────────────────────── */}
      {fase === 'preparar' && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">
              {es ? 'Cuántas' : 'How many'}{' '}
              <span className="font-normal text-muted">
                {nivel ? (es ? `· de los tiempos de ${nombreDeCurso(nivel, lang)}` : `· from ${nombreDeCurso(nivel, lang)}’s tenses`)
                       : (es ? '· sin curso elegido, de todos los tiempos' : '· no course selected, all tenses')}
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CUANTAS.map(c => (
                <button key={c} onClick={() => setCuantas(c)} aria-pressed={cuantas === c} className={opcion(cuantas === c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">{es ? 'Para escribirlas' : 'To write them'}</p>
            <div className="flex flex-wrap gap-1.5">
              {MINUTOS.map(m => (
                <button key={m} onClick={() => setMinutos(m)} aria-pressed={minutos === m} className={opcion(minutos === m)}>
                  {formatoReloj(m * 60)}
                </button>
              ))}
            </div>
          </div>

          {/* Una vista previa que se puede volver a barajar antes de proyectar:
              a veces el set sale con un tiempo que hoy no se tocó. */}
          {consignas.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <Consignas />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button onClick={sacar} className={`flex-1 ${APAGADO}`}>
              {consignas.length ? (es ? 'Otras' : 'Others') : (es ? 'Ver el set' : 'See the set')}
            </button>
          </div>

          <button onClick={arrancar} disabled={!tiempos.length} className={ACCION}>
            {es ? 'Proyectar y arrancar' : 'Project and start'}
          </button>
        </div>
      )}

      {/* ── ESCRIBIR ──────────────────────────────────────────────────────── */}
      {fase === 'escribir' && (
        <div className="space-y-4">
          <p className="text-center font-bold uppercase tracking-wider" style={{ color: 'var(--marca)', fontSize: grande ? M.rotulo : undefined }}>
            {es ? `Escribe las ${consignas.length}` : `Write the ${consignas.length}`}
          </p>
          <Consignas />
          <p className={`text-center font-extrabold tabular-nums leading-none ${
              estado === 'normal' ? 'text-slate-900' : 'text-red-600'
            } ${grande ? '' : 'text-5xl'}`}
            style={{ fontSize: grande ? M.reloj : undefined }}>
            {formatoReloj(restante)}
          </p>

          <div className={grande ? 'max-w-3xl mx-auto' : ''}>
            <button onClick={() => { clearInterval(tick.current); setFase('apostar'); }} className={ACCION}>
              {es ? 'Ya: a apostar' : 'Time: place the bet'}
            </button>
            <button onClick={() => { clearInterval(tick.current); setFase('preparar'); }} className={`mt-2 w-full ${APAGADO}`}>
              {es ? 'Volver' : 'Back'}
            </button>
          </div>
        </div>
      )}

      {/* ── APOSTAR ───────────────────────────────────────────────────────── */}
      {fase === 'apostar' && (
        <div className="space-y-4">
          {/* Las consignas DESAPARECEN aquí. Con la lista delante, la apuesta se
              convierte en revisarlas una por una, que es corregir sin corregir;
              lo que se quiere es lo que el alumno cree ANTES de mirar. */}
          <p className="text-center font-bold text-slate-900" style={{ fontSize: grande ? M.pregunta : undefined }}>
            <span className={grande ? '' : 'text-2xl'}>
              {es ? `De las ${consignas.length}, ¿cuántas crees que tienes bien?` : `Of the ${consignas.length}, how many do you think are right?`}
            </span>
          </p>
          <p className="text-center font-extrabold text-muted leading-none select-none" aria-hidden="true"
             style={{ fontSize: grande ? M.hueco : undefined }}>
            {grande ? '?' : <span className="text-6xl">?</span>}
          </p>
          <p className="text-center text-muted" style={{ fontSize: grande ? M.rotulo : undefined }}>
            {es ? 'Escribe el número y tápalo. Sin mirar las respuestas.'
                : 'Write the number and cover it. No peeking at the answers.'}
          </p>

          <div className={grande ? 'max-w-3xl mx-auto' : ''}>
            <button onClick={() => setFase('comparar')} className={ACCION}>
              {es ? 'Ahora corrijan' : 'Now check'}
            </button>
          </div>
        </div>
      )}

      {/* ── COMPARAR ──────────────────────────────────────────────────────── */}
      {fase === 'comparar' && (
        <div className="space-y-4">
          <Consignas />
          {/* El marco de la comparación. Los números los pone cada alumno en su
              cuaderno: la herramienta no sabe —ni tiene por qué saber— cuántas
              tuvo nadie. Lo que aporta es la pregunta de abajo. */}
          <div className={`mx-auto flex gap-3 ${grande ? 'max-w-2xl' : 'max-w-sm'}`}>
            {[[es ? 'Aposté' : 'I bet'], [es ? 'Tuve' : 'I got']].map(([rot]) => (
              <div key={rot} className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-3 text-center">
                <p className="font-bold uppercase tracking-wider text-muted" style={{ fontSize: grande ? M.rotulo : undefined }}>
                  <span className={grande ? '' : 'text-[11px]'}>{rot}</span>
                </p>
                {/* Una RAYA sobre la que escribir, no un guion de texto. El guion
                    iba en slate-300 y daba 1,48:1 sobre el blanco —lo cazó la
                    sonda—, y subirle la tinta lo habría convertido en un signo
                    menos que se lee como parte del dato. Una línea dice «aquí va
                    tu número» sin decir nada más, y en slate-400 pasa el 3:1 que
                    piden los elementos gráficos. */}
                <div aria-hidden="true" className="mt-4 mx-auto border-b-2 border-slate-400"
                     style={{ width: '60%', height: grande ? '3vh' : '1.4rem' }} />
              </div>
            ))}
          </div>
          <p className="text-center font-bold text-slate-900" style={{ fontSize: grande ? M.rotulo : undefined }}>
            {es ? '¿En cuál te sobró confianza?' : 'Where were you overconfident?'}
          </p>

          <div className={`flex flex-wrap gap-2 ${grande ? 'max-w-3xl mx-auto' : ''}`}>
            <button onClick={arrancar} className={`flex-1 ${APAGADO}`}>{es ? 'Otra ronda' : 'Another round'}</button>
            <button onClick={() => setFase('preparar')} className={`flex-1 ${APAGADO}`}>{es ? 'Cambiar' : 'Change'}</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Apuesta;
