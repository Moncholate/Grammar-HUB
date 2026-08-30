/* ============================================================================
   GRUPOS AL AZAR
   ----------------------------------------------------------------------------
   Se pega la lista del curso una vez y se reparte las veces que haga falta.

   LO QUE COSTÓ DECIDIR: quién faltó. Pegar la lista de Blackboard y borrar a
   mano a los tres que no vinieron es incómodo, y además rompe la lista para la
   siguiente vuelta. Aquí cada nombre es una ficha que se apaga con un toque:
   apagada sigue ahí —se ve, se puede volver a encender— pero no entra en el
   sorteo. Tres ausencias son tres toques, no una edición de texto.

   El reparto va en `../grupos.js`, que es puro y tiene sus pruebas
   (`tools/check-grupos.mjs`). Aquí solo está la pantalla.

   NADA SE GUARDA: ni la lista ni los grupos. Al cerrar la pestaña se va, que es
   lo que pidió el profesor y lo que hace que no haya nombres de alumnos en
   ningún sitio.
   ========================================================================== */
import React, { useState } from 'react';
import { parsearNombres, repartir } from '../grupos';

const Grupos = ({ lang = 'es' }) => {
  const es = lang === 'es';
  const [texto, setTexto] = useState('');
  const [nombres, setNombres] = useState([]);
  const [ausentes, setAusentes] = useState(() => new Set());
  const [modo, setModo] = useState('porGrupo');
  const [n, setN] = useState(4);
  const [grupos, setGrupos] = useState(null);

  const presentes = nombres.filter(x => !ausentes.has(x));

  const usarLista = () => {
    const lista = parsearNombres(texto);
    setNombres(lista);
    setAusentes(new Set());
    setGrupos(null);
  };

  const alternar = (nombre) => setAusentes(a => {
    const s = new Set(a);
    if (s.has(nombre)) s.delete(nombre); else s.add(nombre);
    return s;
  });

  const generar = () => setGrupos(repartir(presentes, { modo, n }));

  return (
    <section className="w-full max-w-xl mx-auto">
      <h2 className="text-lg font-bold text-slate-900 mb-1">{es ? 'Grupos' : 'Groups'}</h2>
      <p className="text-sm text-muted mb-4">
        {es ? 'Pega la lista del curso, apaga a quien faltó y reparte. No guarda nada.'
            : 'Paste the class list, switch off whoever is absent and split. Nothing is stored.'}
      </p>

      {!nombres.length ? (
        <>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={6}
            placeholder={es ? 'Un nombre por línea' : 'One name per line'}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={usarLista}
            disabled={!parsearNombres(texto).length}
            className="mt-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-semibold transition-colors"
          >
            {es ? 'Usar esta lista' : 'Use this list'}
          </button>
        </>
      ) : (
        <>
          {/* Las fichas. Apagar a alguien no lo borra: `aria-pressed` dice el
              estado en voz alta, y el tachado lo dice a la vista. */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {nombres.map(nombre => {
              const falta = ausentes.has(nombre);
              return (
                <button
                  key={nombre}
                  onClick={() => alternar(nombre)}
                  aria-pressed={!falta}
                  className={`px-2.5 py-1 rounded-lg text-sm border transition-colors ${
                    falta
                      /* text-slate-600 y no -500: apagado no es ilegible. El
                         -500 sobre el tinte -100 daba 4,34:1 y lo cazó la sonda
                         de contraste renderizado. Lo que dice «este no juega» es
                         el tachado, no que cueste leerlo. */
                      ? 'bg-slate-100 text-slate-600 border-slate-200 line-through'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {nombre}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
            <span className="text-sm text-slate-600">
              {presentes.length} {es ? 'de' : 'of'} {nombres.length} {es ? 'presentes' : 'present'}
            </span>
            <button
              onClick={() => { setNombres([]); setGrupos(null); }}
              className="text-xs font-medium text-slate-600 underline underline-offset-2 hover:text-slate-800"
            >
              {es ? 'cambiar lista' : 'change list'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {[['porGrupo', es ? 'Grupos de' : 'Groups of'], ['cantidad', es ? 'Nº de grupos' : 'No. of groups']].map(([id, rotulo]) => (
              <button
                key={id}
                onClick={() => setModo(id)}
                aria-pressed={modo === id}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                  modo === id ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {rotulo}
              </button>
            ))}
            <input
              type="number" min="1" max="30" value={n}
              onChange={(e) => setN(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
              aria-label={modo === 'porGrupo' ? (es ? 'personas por grupo' : 'people per group') : (es ? 'cantidad de grupos' : 'number of groups')}
              className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={generar}
            disabled={!presentes.length}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors"
          >
            {grupos ? (es ? 'Repartir otra vez' : 'Split again') : (es ? 'Repartir' : 'Split')}
          </button>

          {grupos && (
            /* Los grupos se proyectan: nombres grandes y una tarjeta por grupo.
               `aria-live` para que el reparto también se anuncie. */
            <div aria-live="polite" className="mt-4 grid gap-3 sm:grid-cols-2">
              {grupos.map((g, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-bold text-indigo-600 mb-1.5">
                    {es ? 'Grupo' : 'Group'} {i + 1} · {g.length}
                  </p>
                  <ul className="space-y-0.5">
                    {g.map(nombre => (
                      <li key={nombre} className="text-base text-slate-900">{nombre}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Grupos;
