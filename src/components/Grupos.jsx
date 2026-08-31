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
import { leerHistorico, pareceHistorico, ERRORES } from '../listaCurso';
import { ACCION, opcion, ENLACE, NUMERO } from '../ui';

/* `grande` = proyectando: lo que se mira son los grupos, así que las tarjetas se
   reparten a lo ancho y los nombres crecen. Las fichas de la lista y los
   controles se quedan igual — esos se tocan de cerca, no se leen de lejos. */
const Grupos = ({ lang = 'es', grande = false }) => {
  const es = lang === 'es';
  const [texto, setTexto] = useState('');
  const [nombres, setNombres] = useState([]);
  const [ausentes, setAusentes] = useState(() => new Set());
  const [modo, setModo] = useState('porGrupo');
  const [n, setN] = useState(4);
  const [grupos, setGrupos] = useState(null);
  /* De dónde salió la lista, para poder decirlo en pantalla. `null` = pegada a
     mano; si vino del histórico, la clase y la fecha que se usaron. */
  const [origen, setOrigen] = useState(null);
  const [aviso, setAviso] = useState(null);

  const presentes = nombres.filter(x => !ausentes.has(x));

  /* Cuando el histórico no se puede leer, el mensaje dice QUÉ pasó. «No pude
     leerlo» no ayuda a arreglar nada, y lo que hay que arreglar suele ser algo
     concreto: pegaste la lista de nombres, o la clase de hoy todavía no tiene
     asistencia pasada. */
  const PORQUE = {
    [ERRORES.sinListasTomadas]: es
      ? 'Ese curso todavía no tiene ninguna lista pasada.'
      : 'That course has no attendance recorded yet.',
    [ERRORES.sinAlumnos]: es
      ? 'El histórico llegó sin alumnos: revisa que hayas copiado también las filas.'
      : 'The export came with no students: check that you copied the rows too.',
    [ERRORES.sinFechas]: es
      ? 'Faltan las filas de fechas: copia también la cabecera del histórico.'
      : 'The date rows are missing: copy the export header too.',
  };

  const usarLista = () => {
    /* Dos cosas se pegan en el mismo sitio a propósito: el profesor pega lo que
       tiene a mano y la herramienta reconoce qué es. Preguntarle antes qué va a
       pegar es un paso que no aporta nada. */
    if (pareceHistorico(texto)) {
      const h = leerHistorico(texto);
      if (h.error) {
        setAviso(PORQUE[h.error] || (es
          ? 'Eso no parece el histórico de asistencia. Pega también la cabecera, o escribe los nombres uno por línea.'
          : 'That does not look like the attendance export. Paste the header too, or type one name per line.'));
        return;
      }
      setNombres(h.alumnos.map(a => a.corto));
      /* La ganancia de todo esto: los que faltaron llegan apagados. Antes eran
         tres toques por ausencia y a ojo. */
      setAusentes(new Set(h.ausentes.map(a => a.corto)));
      setOrigen({ curso: h.curso, fecha: h.fecha, clase: h.clase, ausentes: h.ausentes.length });
      setAviso(null);
      setGrupos(null);
      return;
    }
    const lista = parsearNombres(texto);
    setNombres(lista);
    setAusentes(new Set());
    setOrigen(null);
    setAviso(null);
    setGrupos(null);
  };

  const alternar = (nombre) => setAusentes(a => {
    const s = new Set(a);
    if (s.has(nombre)) s.delete(nombre); else s.add(nombre);
    return s;
  });

  const generar = () => setGrupos(repartir(presentes, { modo, n }));

  return (
    <section className={grande ? 'w-full' : 'w-full max-w-xl mx-auto'}>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{es ? 'Grupos' : 'Groups'}</h2>
      <p className="text-sm text-muted mb-4">
        {es ? 'Pega la lista del curso —o el histórico de asistencia en Excel, y los que faltaron vienen apagados— y reparte. No guarda nada.'
            : 'Paste the class list —or the attendance export from Excel, and whoever was absent comes switched off— and split. Nothing is stored.'}
      </p>

      {!nombres.length ? (
        <>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={6}
            placeholder={es ? 'Un nombre por línea, o pega el histórico de asistencia' : 'One name per line, or paste the attendance export'}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {/* Se dice ANTES de tocar el botón: reconocido el histórico, el botón
              cambia de rótulo. Así no hay que apretar para descubrir si lo que
              pegaste sirve. */}
          {pareceHistorico(texto) && !aviso && (
            <p className="mt-2 text-xs font-semibold text-indigo-700">
              {es ? 'Histórico de asistencia reconocido.' : 'Attendance export recognised.'}
            </p>
          )}
          {aviso && (
            <p role="alert" className="mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-2">
              {aviso}
            </p>
          )}
          <button
            onClick={usarLista}
            disabled={!texto.trim() || (!pareceHistorico(texto) && !parsearNombres(texto).length)}
            className={`mt-2 ${ACCION}`}
          >
            {pareceHistorico(texto)
              ? (es ? 'Cargar el curso de ese día' : 'Load that day’s class')
              : (es ? 'Usar esta lista' : 'Use this list')}
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

          {/* DE QUÉ DÍA ES ESTA LISTA. Va arriba y no escondida: el histórico
              cae a la última clase con lista pasada, que si hoy aún no la pasas
              es la clase ANTERIOR. Una lista que usa en silencio las ausencias
              del viernes es peor que no tener lista. */}
          {origen && (
            <p className="mb-3 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-2">
              {es
                ? `${origen.curso || 'Curso'} · clase ${origen.clase} del ${origen.fecha}: ${origen.ausentes} apagados por inasistencia. Si hoy aún no pasas lista, esta es la clase anterior.`
                : `${origen.curso || 'Course'} · class ${origen.clase} on ${origen.fecha}: ${origen.ausentes} switched off for absence. If today’s roll is not taken yet, this is the previous class.`}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
            <span className="text-sm text-slate-600">
              {presentes.length} {es ? 'de' : 'of'} {nombres.length} {es ? 'presentes' : 'present'}
            </span>
            <button
              onClick={() => { setNombres([]); setGrupos(null); setOrigen(null); }}
              className={ENLACE}
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
                className={opcion(modo === id)}
              >
                {rotulo}
              </button>
            ))}
            <input
              type="number" min="1" max="30" value={n}
              onChange={(e) => setN(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
              aria-label={modo === 'porGrupo' ? (es ? 'personas por grupo' : 'people per group') : (es ? 'cantidad de grupos' : 'number of groups')}
              className={NUMERO}
            />
          </div>

          <button
            onClick={generar}
            disabled={!presentes.length}
            className={ACCION}
          >
            {grupos ? (es ? 'Repartir otra vez' : 'Split again') : (es ? 'Repartir' : 'Split')}
          </button>

          {grupos && (
            /* Los grupos se proyectan: nombres grandes y una tarjeta por grupo.
               `aria-live` para que el reparto también se anuncie. */
            <div aria-live="polite" className={`mt-4 grid gap-3 ${grande ? 'sm:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-2'}`}>
              {grupos.map((g, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-bold text-indigo-600 mb-1.5">
                    {es ? 'Grupo' : 'Group'} {i + 1} · {g.length}
                  </p>
                  <ul className="space-y-0.5">
                    {g.map(nombre => (
                      <li key={nombre} className={`text-slate-900 ${grande ? 'text-[1.6vw]' : 'text-base'}`}>{nombre}</li>
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
