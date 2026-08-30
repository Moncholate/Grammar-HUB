/* ============================================================================
   EL TEMPORIZADOR
   ----------------------------------------------------------------------------
   «Tres minutos para esto». Se proyecta, así que el número es lo único grande
   de la pantalla y los últimos diez segundos se ponen en rojo: el aviso tiene
   que significar «ya», no «pronto».

   DOS COSAS QUE NO SON OBVIAS:

   · La cuenta va contra el RELOJ del sistema (una hora de fin), no restando uno
     cada segundo. Un intervalo que se retrasa —pestaña de fondo, teléfono que
     se duerme— acumularía el retraso y el reloj mentiría justo cuando la clase
     lo está mirando.
   · El pitido se crea con WebAudio en el momento, sin archivo. Se enciende con
     el gesto de arrancar, que es lo que piden los navegadores para dejar sonar
     algo, y se puede apagar: en una sala con otro curso al lado, un pitido no
     siempre se agradece.

   El formato y el estado están en `../temporizador.js`, con pruebas.
   ========================================================================== */
import React, { useState, useRef, useEffect } from 'react';
import { formatoReloj, estadoReloj, PRESETS } from '../temporizador';

const Temporizador = ({ lang = 'es' }) => {
  const es = lang === 'es';
  const [total, setTotal] = useState(180);        // lo que se puso, en segundos
  const [restante, setRestante] = useState(180);
  const [corriendo, setCorriendo] = useState(false);
  const [suena, setSuena] = useState(true);
  const finRef = useRef(0);
  const tick = useRef(null);
  const yaSono = useRef(false);

  useEffect(() => () => clearInterval(tick.current), []);

  const pitar = () => {
    if (!suena) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      vol.gain.value = 0.15;
      osc.connect(vol); vol.connect(ctx.destination);
      osc.start();
      /* Dos toques cortos: uno solo se confunde con cualquier notificación. */
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.18);
      vol.gain.setValueAtTime(0, ctx.currentTime + 0.18);
      vol.gain.setValueAtTime(0.15, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(() => { try { ctx.close(); } catch { /* ya cerrado */ } }, 900);
    } catch { /* sin audio disponible: el reloj sigue funcionando igual */ }
  };

  const arrancar = () => {
    if (corriendo || restante <= 0) return;
    yaSono.current = false;
    finRef.current = Date.now() + restante * 1000;
    setCorriendo(true);
    clearInterval(tick.current);
    tick.current = setInterval(() => {
      const quedan = Math.max(0, Math.round((finRef.current - Date.now()) / 1000));
      setRestante(quedan);
      if (quedan === 0) {
        clearInterval(tick.current);
        setCorriendo(false);
        if (!yaSono.current) { yaSono.current = true; pitar(); }
      }
    }, 250);
  };

  const pausar = () => { clearInterval(tick.current); setCorriendo(false); };
  const reiniciar = () => { clearInterval(tick.current); setCorriendo(false); setRestante(total); };
  const poner = (minutos) => {
    clearInterval(tick.current);
    setCorriendo(false);
    const s = Math.max(1, Math.round(minutos * 60));
    setTotal(s);
    setRestante(s);
  };

  const estado = estadoReloj(restante);
  const color = estado === 'normal' ? 'text-slate-900' : 'text-red-700';

  return (
    <section className="w-full max-w-xl mx-auto">
      <h2 className="text-lg font-bold text-slate-900 mb-1">{es ? 'Temporizador' : 'Timer'}</h2>
      <p className="text-sm text-muted mb-4">
        {es ? 'Para las actividades con tiempo. Los últimos diez segundos se ponen en rojo.'
            : 'For timed activities. The last ten seconds turn red.'}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {PRESETS.map(m => (
          <button
            key={m}
            onClick={() => poner(m)}
            aria-pressed={total === m * 60}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
              total === m * 60 ? 'bg-indigo-600 text-white border-indigo-600'
                               : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {m} min
          </button>
        ))}
        <label className="flex items-center gap-1.5 text-sm text-slate-600">
          <span>{es ? 'otro' : 'other'}</span>
          <input
            type="number" min="1" max="90"
            onChange={(e) => poner(Math.max(1, Math.min(90, Number(e.target.value) || 1)))}
            aria-label={es ? 'minutos' : 'minutes'}
            className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </label>
      </div>

      {/* El número, que es todo lo que hay que ver desde el fondo de la sala. */}
      <div
        aria-live="polite"
        className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center"
      >
        <p className={`text-6xl sm:text-7xl font-extrabold tabular-nums ${color}`}>{formatoReloj(restante)}</p>
        {estado === 'fin' && (
          <p className="mt-1 text-base font-bold text-red-700">{es ? '¡Se acabó el tiempo!' : "Time's up!"}</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={corriendo ? pausar : arrancar}
          disabled={!corriendo && restante <= 0}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors"
        >
          {corriendo ? (es ? 'Pausar' : 'Pause') : (es ? 'Empezar' : 'Start')}
        </button>
        <button
          onClick={reiniciar}
          className="px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:border-slate-400 transition-colors"
        >
          {es ? 'Reiniciar' : 'Reset'}
        </button>
      </div>

      <label className="mt-3 flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
        <input type="checkbox" checked={suena} onChange={(e) => setSuena(e.target.checked)} />
        {es ? 'pitar al terminar' : 'beep when done'}
      </label>
    </section>
  );
};

export default Temporizador;
