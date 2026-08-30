/* ============================================================================
   LA RULETA DEL WARM-UP
   ----------------------------------------------------------------------------
   El profesor escribe verbos («que armen una oración con este») o preguntas de
   unidades pasadas, y la rueda saca una. No sortea alumnos: sortea CONTENIDO,
   que es para lo que la usa.

   Eso decide el dibujo. Una pregunta no cabe en un sector, y con veinte
   tarjetas cada sector mide 18°, así que:

     · dentro de la rueda solo hay etiqueta cuando de verdad cabe (hasta doce
       tarjetas, y recortada). Con más, la rueda son colores girando.
     · el resultado se lee ABAJO, en grande. La rueda es la expectativa; el
       cartel es la información.

   La geometría y el sorteo están en `../ruleta.js`, con pruebas
   (`tools/check-ruleta.mjs`): el ángulo es lo que se rompe en silencio.
   ========================================================================== */
import React, { useState, useRef, useEffect } from 'react';
import { parsearLista } from '../lista';
import { siguienteIndice, deltaHasta, ordenInicial, centroDelSector } from '../ruleta';

const TINTES = ['#e0e7ff', '#c7d2fe'];   // indigo-100 / indigo-200: la rueda no compite con el resultado
const GIRO_MS = 3000;

const reducirMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

/* Un sector como path SVG, con la rueda centrada en (100,100) y radio 96. */
const sector = (indice, total) => {
  const paso = 360 / total;
  const a0 = (indice * paso - 90) * Math.PI / 180;
  const a1 = ((indice + 1) * paso - 90) * Math.PI / 180;
  const [x0, y0] = [100 + 96 * Math.cos(a0), 100 + 96 * Math.sin(a0)];
  const [x1, y1] = [100 + 96 * Math.cos(a1), 100 + 96 * Math.sin(a1)];
  return `M100,100 L${x0.toFixed(2)},${y0.toFixed(2)} A96,96 0 ${paso > 180 ? 1 : 0},1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
};

/* `grande` = proyectando: la rueda pasa a medirse en alto de pantalla y el
   cartel del resultado crece con ella. Es el que se lee; la rueda es el gancho. */
const Ruleta = ({ lang = 'es', grande = false }) => {
  const es = lang === 'es';
  const [texto, setTexto] = useState('');
  const [items, setItems] = useState([]);
  const [rotacion, setRotacion] = useState(0);
  const [girando, setGirando] = useState(false);
  const [usados, setUsados] = useState([]);
  const [elegido, setElegido] = useState(null);
  const [sinRepetir, setSinRepetir] = useState(true);
  const [vueltaNueva, setVueltaNueva] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const usarLista = () => {
    const lista = parsearLista(texto);
    if (!lista.length) return;
    /* Se baraja UNA vez, al cargar: si la rueda se reordenara en cada tirada,
       el alumno no vería girar nada — vería otra rueda. */
    setItems(ordenInicial(lista));
    setUsados([]);
    setElegido(null);
    setRotacion(0);
  };

  const girar = () => {
    if (girando || !items.length) return;
    const tirada = siguienteIndice({ total: items.length, usados, sinRepetir });
    if (!tirada) return;
    const { indice, reinicia } = tirada;
    const nuevosUsados = reinicia ? [indice] : [...usados, indice];

    const cerrar = () => {
      setElegido(indice);
      setUsados(nuevosUsados);
      setVueltaNueva(reinicia);
      setGirando(false);
    };

    setElegido(null);
    setRotacion(r => r + deltaHasta({ indice, total: items.length, rotacionActual: r, vueltas: 4 }));
    if (reducirMovimiento()) { cerrar(); return; }
    setGirando(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(cerrar, GIRO_MS);
  };

  const quedan = items.length - usados.length;

  return (
    <section className={grande ? 'w-full max-w-3xl mx-auto' : 'w-full max-w-xl mx-auto'}>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{es ? 'Ruleta' : 'Wheel'}</h2>
      <p className="text-sm text-muted mb-4">
        {es ? 'Para el warm-up: pon los verbos o las preguntas, una por línea, y gira. No guarda nada.'
            : 'For warm-ups: add the verbs or questions, one per line, and spin. Nothing is stored.'}
      </p>

      {!items.length ? (
        <>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={6}
            placeholder={es ? 'Un verbo o una pregunta por línea' : 'One verb or question per line'}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={usarLista}
            disabled={!parsearLista(texto).length}
            className="mt-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-semibold transition-colors"
          >
            {es ? 'Usar esta lista' : 'Use this list'}
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center">
            {/* El puntero, arriba. La rueda gira debajo de él. */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 -top-1 w-0 h-0 z-10"
                style={{ borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: '16px solid #4338ca' }}
              />
              <svg
                viewBox="0 0 200 200"
                role="img"
                aria-label={es ? `Ruleta con ${items.length} tarjetas` : `Wheel with ${items.length} cards`}
                className={grande ? 'w-[46vh] h-[46vh]' : 'w-56 h-56 sm:w-64 sm:h-64'}
                style={{
                  transform: `rotate(${rotacion}deg)`,
                  transition: girando ? `transform ${GIRO_MS}ms cubic-bezier(.15,.9,.2,1)` : 'none',
                }}
              >
                {items.map((item, i) => (
                  <path key={i} d={sector(i, items.length)} fill={TINTES[i % 2]} stroke="#fff" strokeWidth="0.8" />
                ))}
                {/* Etiquetas solo si caben: con más de doce, la rueda son colores. */}
                {items.length <= 12 && items.map((item, i) => (
                  <text
                    key={i}
                    x="100" y="100"
                    transform={`rotate(${centroDelSector(i, items.length)} 100 100) translate(0 -58)`}
                    textAnchor="middle"
                    className="fill-slate-700"
                    style={{ fontSize: '8px', fontWeight: 600 }}
                  >
                    {item.length > 14 ? item.slice(0, 13) + '…' : item}
                  </text>
                ))}
                <circle cx="100" cy="100" r="10" fill="#fff" stroke="#c7d2fe" strokeWidth="2" />
              </svg>
            </div>

            <button
              onClick={girar}
              disabled={girando}
              className="mt-3 w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors"
            >
              {girando ? (es ? 'Girando…' : 'Spinning…') : (es ? 'Girar' : 'Spin')}
            </button>
          </div>

          {/* El resultado, que es lo que de verdad se lee. */}
          <div
            aria-live="polite"
            className="mt-3 rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center"
          >
            {elegido == null ? (
              <p className="text-muted text-sm">{es ? 'Toca Girar' : 'Tap Spin'}</p>
            ) : (
              <p className={`font-bold text-slate-900 ${grande ? 'text-[5vw] leading-tight' : 'text-2xl sm:text-3xl'}`}>{items[elegido]}</p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={sinRepetir} onChange={(e) => { setSinRepetir(e.target.checked); setUsados([]); setVueltaNueva(false); }} />
              {es ? 'sin repetir' : 'no repeats'}
            </label>
            {sinRepetir && (
              <span className="text-sm text-slate-600">
                {vueltaNueva
                  ? (es ? 'salieron todas · vuelta nueva' : 'all came out · new round')
                  : `${quedan} ${es ? 'por salir' : 'left'}`}
              </span>
            )}
            <button
              onClick={() => { setItems([]); setElegido(null); setUsados([]); }}
              className="text-xs font-medium text-slate-600 underline underline-offset-2 hover:text-slate-800"
            >
              {es ? 'cambiar lista' : 'change list'}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Ruleta;
