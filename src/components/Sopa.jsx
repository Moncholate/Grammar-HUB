/* ============================================================================
   SOPA DE LETRAS
   ----------------------------------------------------------------------------
   El docente pega las palabras de la clase y sale una sopa. «Otra vez» y sale
   otra distinta con las mismas. Nada precargado, como el resto de la sección.

   LA DIFICULTAD SE ELIGE, y es la decisión que de verdad cambia el ejercicio:
   con solo → y ↓ es reconocer una palabra escrita; con las ocho direcciones es
   reconstruirla. La misma lista sirve para Básico I y para Intermedio según
   dónde se ponga esa perilla. El porqué está en `../sopa.js`.

   SE RESUELVE PROYECTADA, A CLICS. Clic en la primera letra y clic en la
   última: la palabra queda marcada y se tacha de la lista. No se arrastra —
   proyectando, el profesor maneja el ratón desde el computador y arrastrar en
   diagonal sobre una cuadrícula es lo que no sale a la primera delante de todo
   el curso—. Dos clics no fallan, y en una pizarra táctil funcionan igual.

   Lo encontrado va en VERDE y la solución del profesor en índigo: son dos cosas
   distintas —lo que el curso ya sacó y lo que falta por sacar— y verlas del
   mismo color al corregir no diría nada.

   CADA PALABRA SE MARCA CON SU PROPIO TRAZO, no pintando casillas. Pintadas, dos
   palabras que se tocan o se cruzan forman un solo bloque de color y el ojo lee
   una palabra larga que nadie escribió — lo reportó el profesor usándola. Un
   trazo redondeado alrededor de cada una es lo que se hace en el papel con un
   lápiz, y dos trazos que se cruzan siguen siendo dos: cada uno conserva su
   principio y su final.

   El trazo va en un SVG DEBAJO de las letras y en unidades de casilla —el
   `viewBox` mide lo que la cuadrícula, así que cada casilla es 1— y así no hay
   que saber cuántos píxeles mide nada. Debajo y no encima porque encima teñiría
   las letras y les bajaría el contraste; debajo, la letra se lee igual que
   siempre y el trazo la rodea.

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
import { generar, casillasDe, palabraEntre, NIVELES } from '../sopa';
import { ACCION, APAGADO, opcion, ENLACE } from '../ui';

/* La cuadrícula es PAPEL, y va fija en los dos temas — como la del crucigrama y
   como la carcasa del semáforo va oscura en los dos. Un pasatiempo es una hoja:
   blanco con tinta negra es lo que la mano espera al ir a escribir, y en modo
   oscuro unas casillas gris marengo no se leen ni se imprimen. */
const PAPEL = '#ffffff';
const TRAZO = '#334155';
const LETRA = '#1e293b';
const MARCA = '#818cf8';    /* la solución del profesor, índigo */
const HALLADA = '#10b981';  /* lo que el curso ya encontró, verde */
const ANCLA = '#fde68a';    /* la primera letra elegida, esperando la segunda */

const Sopa = ({ lang = 'es', grande = false }) => {
  const es = lang === 'es';
  const [texto, setTexto] = useState('');
  const [dificultad, setDificultad] = useState('media');
  const [sopa, setSopa] = useState(null);
  const [descartes, setDescartes] = useState([]);
  const [respuestas, setRespuestas] = useState(false);
  /* Lo que el curso ha ido encontrando, y la primera casilla de la selección en
     curso. Nada de esto se guarda: muere con la pestaña, como todo aquí. */
  const [halladas, setHalladas] = useState(() => new Set());
  const [ancla, setAncla] = useState(null);
  const [fallo, setFallo] = useState(false);

  const { lista, fuera } = parsearPalabras(texto);

  const armar = (dif = dificultad) => {
    setSopa(generar({ palabras: lista, dificultad: dif }));
    setDescartes(fuera);
    setRespuestas(false);
    setHalladas(new Set());
    setAncla(null);
    setFallo(false);
  };

  /* CLIC EN LA PRIMERA LETRA, CLIC EN LA ÚLTIMA. El primero deja el ancla; el
     segundo cierra la selección y se comprueba. Tocar la misma casilla otra vez
     cancela: es lo que hace todo el mundo cuando se equivoca al empezar. */
  const tocar = (fila, col) => {
    setFallo(false);
    if (!ancla) { setAncla({ fila, col }); return; }
    if (ancla.fila === fila && ancla.col === col) { setAncla(null); return; }
    const p = palabraEntre(sopa, ancla, { fila, col });
    setAncla(null);
    if (p) setHalladas(h => new Set([...h, p.palabra]));
    else setFallo(true);   // no había palabra ahí, y se dice sin castigar a nadie
  };

  const NIVEL = [
    { id: 'facil', rotulo: es ? 'Fácil' : 'Easy', nota: es ? 'solo → y ↓' : 'only → and ↓' },
    { id: 'media', rotulo: es ? 'Media' : 'Medium', nota: es ? 'y las diagonales' : 'plus diagonals' },
    { id: 'dificil', rotulo: es ? 'Difícil' : 'Hard', nota: es ? 'y al revés' : 'plus backwards' },
  ];

  const lado = sopa && sopa.lado
    ? `min(${grande ? '6.5vh' : '1.9rem'}, calc(88vw / ${sopa.lado}))`
    : '1.9rem';

  /* UN TRAZO POR PALABRA, del centro de la primera casilla al de la última. Lo
     que el curso encontró va siempre; la solución del profesor, solo si la pidió
     y esa palabra no está ya encontrada — marcarla dos veces no diría nada. */
  const trazos = !sopa ? [] : sopa.colocadas.flatMap(p => {
    const encontrada = halladas.has(p.palabra);
    if (!encontrada && !respuestas) return [];
    const cs = casillasDe(p);
    const a = cs[0], z = cs[cs.length - 1];
    return [{
      palabra: p.palabra,
      color: encontrada ? HALLADA : MARCA,
      x1: a.col + 0.5, y1: a.fila + 0.5,
      x2: z.col + 0.5, y2: z.fila + 0.5,
    }];
  });

  return (
    <section className={grande ? 'w-full' : 'w-full max-w-xl mx-auto'}>
      {!grande && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-1 gh-no-print">{es ? 'Sopa de letras' : 'Word search'}</h2>
          <p className="text-sm text-muted mb-4 gh-no-print">
            {es ? 'Pega las palabras de la clase, una por línea. Proyectada se resuelve a clics —primera letra y última—, o se imprime para repartir. No guarda nada.'
                : 'Paste the words from today’s lesson, one per line. Projected, it is solved by clicking — first letter, then last — or printed to hand out. Nothing is stored.'}
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
              <div className="relative mx-auto w-max" style={{ background: PAPEL }}>
                {/* Los trazos, DEBAJO de las letras. El viewBox mide lo que la
                    cuadrícula en casillas, así que las coordenadas son las de la
                    sopa y no hay que traducir píxeles. `pointer-events: none`
                    para que los clics sigan llegando a las casillas. */}
                <svg
                  viewBox={`0 0 ${sopa.lado} ${sopa.lado}`}
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: 'none', zIndex: 0 }}
                >
                  {trazos.map(t => (
                    <line
                      key={t.palabra}
                      x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                      stroke={t.color} strokeWidth="0.82" strokeLinecap="round"
                      fill="none" opacity="0.32"
                    />
                  ))}
                </svg>
              <div className="relative grid w-max" style={{ gridTemplateColumns: `repeat(${sopa.lado}, ${lado})`, zIndex: 1 }}>
                {sopa.celdas.map((fila, f) => fila.map((letra, c) => {
                  const esAncla = ancla && ancla.fila === f && ancla.col === c;
                  /* La casilla ya no se pinta: de eso se encargan los trazos de
                     debajo. Solo el ancla lleva fondo, y es una casilla suelta
                     esperando la segunda: no hay nada con lo que pueda fundirse. */
                  return (
                    <button
                      key={`${f},${c}`}
                      onClick={() => tocar(f, c)}
                      aria-label={`${letra}, ${es ? 'fila' : 'row'} ${f + 1}, ${es ? 'columna' : 'column'} ${c + 1}`}
                      aria-pressed={!!esAncla}
                      className="gh-celda flex items-center justify-center font-bold"
                      style={{
                        width: lado, height: lado,
                        background: esAncla ? ANCLA : 'transparent',
                        border: `1px solid ${TRAZO}`,
                        color: LETRA,
                        fontSize: `calc(${lado} * 0.55)`,
                      }}
                    >
                      {letra}
                    </button>
                  );
                }))}
              </div>
              </div>
            </div>

            {/* LA LISTA DE PALABRAS A BUSCAR. Va en el original —con sus tildes y
                sus espacios—: nadie quiere leer «ICECREAM» en la lista. */}
            <ul className={`mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 ${grande ? 'max-w-5xl mx-auto' : ''}`}>
              {sopa.colocadas.map(p => (
                <li key={p.palabra}
                    className={`text-sm font-semibold ${halladas.has(p.palabra)
                      ? 'gh-hallada text-emerald-700 line-through decoration-2'
                      : 'text-slate-800'}`}>
                  {p.original}
                </li>
              ))}
            </ul>
          </div>

          {/* EL MARCADOR, fuera de la hoja: es del momento de resolverla en clase,
              no de la hoja que se reparte. */}
          <p className="gh-no-print text-center text-sm font-bold text-slate-900" aria-live="polite">
            {halladas.size === sopa.colocadas.length && sopa.colocadas.length > 0
              ? (es ? '¡Están todas!' : 'All of them!')
              : (es ? `${halladas.size} de ${sopa.colocadas.length} encontradas`
                    : `${halladas.size} of ${sopa.colocadas.length} found`)}
            {ancla && <span className="ml-2 font-normal text-muted">{es ? '· ahora la última letra' : '· now the last letter'}</span>}
            {fallo && <span className="ml-2 font-normal text-amber-800">{es ? '· ahí no hay ninguna, prueba otra vez' : '· nothing there, try again'}</span>}
          </p>

          {(sopa.fuera.length > 0 || descartes.length > 0) && (
            <p className="gh-no-print text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2">
              {es ? 'No entraron: ' : 'Left out: '}
              {[...sopa.fuera.map(p => p.original), ...descartes.map(d => d.original)].join(', ')}
              {'. '}
              {es ? 'Prueba «otra vez», o quita alguna palabra larga.' : 'Try “again”, or drop one of the long words.'}
            </p>
          )}

          <div className="gh-no-print flex flex-wrap gap-2">
            {halladas.size > 0 && (
              <button onClick={() => { setHalladas(new Set()); setAncla(null); setFallo(false); }} className={`flex-1 ${APAGADO}`}>
                {es ? 'Empezar de nuevo' : 'Start over'}
              </button>
            )}
            <button onClick={() => armar()} className={`flex-1 ${APAGADO}`}>{es ? 'Otra sopa' : 'New grid'}</button>
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
