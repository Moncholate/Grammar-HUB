/* ============================================================================
   SOPA DE LETRAS
   ----------------------------------------------------------------------------
   El docente pega las palabras de la clase y sale una sopa. «Otra vez» y sale
   otra distinta con las mismas. Nada precargado, como el resto de la sección.

   LA DIFICULTAD SE ELIGE, y es la decisión que de verdad cambia el ejercicio:
   con solo → y ↓ es reconocer una palabra escrita; con las ocho direcciones es
   reconstruirla. La misma lista sirve para Básico I y para Intermedio según
   dónde se ponga esa perilla. El porqué está en `../sopa.js`.

   DOS SALIDAS, LAS MISMAS QUE EL CRUCIGRAMA:

     · PROYECTADA se busca entre todos y se van cantando; «ver las respuestas»
       marca las palabras de golpe al corregir.
     · IMPRESA se reparte, y la hoja NUNCA lleva la solución aunque esté
       encendida en pantalla. Eso lo decide `@media print`, no un botón que se
       puede olvidar apagado — y es la misma maquinaria (`gh-hoja`,
       `gh-no-print`, `gh-solucion`) que ya estrenó el crucigrama.

   LAS CASILLAS SE MIDEN SOLAS, en unidades del viewport y nunca en porcentaje:
   un % se mide contra el ancho en `width` y contra el alto en `height`, y con la
   misma cadena para las dos las casillas salen aplastadas. Lo aprendió el
   crucigrama.
   ========================================================================== */
import React, { useState } from 'react';
import { parsearPalabras, MAX_PALABRAS } from '../palabras';
import { generar, casillasDe, NIVELES } from '../sopa';
import { ACCION, APAGADO, opcion, ENLACE } from '../ui';

/* La cuadrícula es PAPEL, y va fija en los dos temas — como la del crucigrama y
   como la carcasa del semáforo va oscura en los dos. Un pasatiempo es una hoja:
   blanco con tinta negra es lo que la mano espera al ir a escribir, y en modo
   oscuro unas casillas gris marengo no se leen ni se imprimen. */
const PAPEL = '#ffffff';
const TRAZO = '#334155';
const LETRA = '#1e293b';
const MARCA = '#c7d2fe';   /* el resaltado de la solución, sobre el papel */

const Sopa = ({ lang = 'es', grande = false }) => {
  const es = lang === 'es';
  const [texto, setTexto] = useState('');
  const [dificultad, setDificultad] = useState('media');
  const [sopa, setSopa] = useState(null);
  const [descartes, setDescartes] = useState([]);
  const [respuestas, setRespuestas] = useState(false);

  const { lista, fuera } = parsearPalabras(texto);

  const armar = (dif = dificultad) => {
    setSopa(generar({ palabras: lista, dificultad: dif }));
    setDescartes(fuera);
    setRespuestas(false);
  };

  const NIVEL = [
    { id: 'facil', rotulo: es ? 'Fácil' : 'Easy', nota: es ? 'solo → y ↓' : 'only → and ↓' },
    { id: 'media', rotulo: es ? 'Media' : 'Medium', nota: es ? 'y las diagonales' : 'plus diagonals' },
    { id: 'dificil', rotulo: es ? 'Difícil' : 'Hard', nota: es ? 'y al revés' : 'plus backwards' },
  ];

  const lado = sopa && sopa.lado
    ? `min(${grande ? '6.5vh' : '1.9rem'}, calc(88vw / ${sopa.lado}))`
    : '1.9rem';

  /* Las casillas de la solución, en un conjunto para pintarlas de un vistazo. */
  const marcadas = new Set(
    sopa ? sopa.colocadas.flatMap(p => casillasDe(p).map(({ fila, col }) => `${fila},${col}`)) : []
  );

  return (
    <section className={grande ? 'w-full' : 'w-full max-w-xl mx-auto'}>
      {!grande && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-1 gh-no-print">{es ? 'Sopa de letras' : 'Word search'}</h2>
          <p className="text-sm text-muted mb-4 gh-no-print">
            {es ? 'Pega las palabras de la clase, una por línea, y sale una sopa. Se proyecta o se imprime. No guarda nada.'
                : 'Paste the words from today’s lesson, one per line, and out comes a word search. Project it or print it. Nothing is stored.'}
          </p>
        </>
      )}

      {!sopa ? (
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">
              {es ? 'Las palabras' : 'The words'}{' '}
              <span className="font-normal text-muted">{es ? '· una por línea' : '· one per line'}</span>
            </span>
            <textarea
              value={texto} rows={8}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={es ? 'apple\nbanana\ncherry' : 'apple\nbanana\ncherry'}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">
              {es ? 'Dificultad' : 'Difficulty'}{' '}
              <span className="font-normal text-muted">
                {es ? '· lo que cambia el ejercicio no es el tamaño, son las direcciones'
                    : '· what changes the task is the directions, not the size'}
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {NIVEL.map(n => (
                <button key={n.id} onClick={() => setDificultad(n.id)} aria-pressed={dificultad === n.id}
                        title={n.nota} className={opcion(dificultad === n.id)}>
                  {n.rotulo} <span className="font-normal opacity-70">· {n.nota}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted">
            {es ? `${lista.length} ${lista.length === 1 ? 'palabra' : 'palabras'}. Con menos de cinco la sopa queda vacía; más de ${MAX_PALABRAS} no caben.`
                : `${lista.length} ${lista.length === 1 ? 'word' : 'words'}. Fewer than five leaves an empty grid; more than ${MAX_PALABRAS} will not fit.`}
          </p>

          <button onClick={() => armar()} disabled={!lista.length} className={ACCION}>
            {es ? 'Armar la sopa' : 'Build the word search'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* LA HOJA. Es lo único que se imprime. */}
          <div className="gh-hoja">
            <div className="overflow-x-auto">
              <div className="mx-auto grid w-max" style={{ gridTemplateColumns: `repeat(${sopa.lado}, ${lado})` }}>
                {sopa.celdas.map((fila, f) => fila.map((letra, c) => {
                  const dentro = respuestas && marcadas.has(`${f},${c}`);
                  return (
                    <div
                      key={`${f},${c}`}
                      className={dentro ? 'gh-solucion-fondo flex items-center justify-center font-bold' : 'flex items-center justify-center font-bold'}
                      style={{
                        width: lado, height: lado,
                        background: dentro ? MARCA : PAPEL,
                        border: `1px solid ${TRAZO}`,
                        color: LETRA,
                        fontSize: `calc(${lado} * 0.55)`,
                      }}
                    >
                      {letra}
                    </div>
                  );
                }))}
              </div>
            </div>

            {/* LA LISTA DE PALABRAS A BUSCAR. Va en el original —con sus tildes y
                sus espacios—: nadie quiere leer «ICECREAM» en la lista. */}
            <ul className={`mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 ${grande ? 'max-w-5xl mx-auto' : ''}`}>
              {sopa.colocadas.map(p => (
                <li key={p.palabra} className="text-sm font-semibold text-slate-800">{p.original}</li>
              ))}
            </ul>
          </div>

          {(sopa.fuera.length > 0 || descartes.length > 0) && (
            <p className="gh-no-print text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2">
              {es ? 'No entraron: ' : 'Left out: '}
              {[...sopa.fuera.map(p => p.original), ...descartes.map(d => d.original)].join(', ')}
              {'. '}
              {es ? 'Prueba «otra vez», o quita alguna palabra larga.' : 'Try “again”, or drop one of the long words.'}
            </p>
          )}

          <div className="gh-no-print flex flex-wrap gap-2">
            <button onClick={() => armar()} className={`flex-1 ${APAGADO}`}>{es ? 'Otra vez' : 'Again'}</button>
            <button onClick={() => setRespuestas(v => !v)} aria-pressed={respuestas} className={`flex-1 ${APAGADO}`}>
              {respuestas ? (es ? 'Ocultar respuestas' : 'Hide answers') : (es ? 'Ver las respuestas' : 'Show answers')}
            </button>
            <button onClick={() => window.print()} className={`flex-1 ${APAGADO}`}>{es ? 'Imprimir' : 'Print'}</button>
          </div>

          {/* Cambiar la dificultad rearma en el momento: es lo que se toca cuando
              la sopa sale demasiado fácil o demasiado dura para ESTE curso, y
              hacerlo volviendo atrás sería perder las palabras pegadas. */}
          <div className="gh-no-print flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600 mr-1">{es ? 'Dificultad' : 'Difficulty'}</span>
            {NIVEL.map(n => (
              <button key={n.id} onClick={() => { setDificultad(n.id); armar(n.id); }}
                      aria-pressed={dificultad === n.id} title={n.nota} className={opcion(dificultad === n.id)}>
                {n.rotulo}
              </button>
            ))}
          </div>

          <p className="gh-no-print text-xs text-muted">
            {es ? 'Lo impreso es siempre la hoja del alumno: la sopa y la lista, sin la solución aunque esté a la vista aquí.'
                : 'What prints is always the student sheet: the grid and the word list, with no solution even if it is showing here.'}
          </p>

          <button onClick={() => { setSopa(null); setRespuestas(false); }} className={`gh-no-print ${ENLACE}`}>
            {es ? 'cambiar las palabras' : 'change the words'}
          </button>
        </div>
      )}
    </section>
  );
};

export default Sopa;
