/* ============================================================================
   CRUCIGRAMA
   ----------------------------------------------------------------------------
   El docente pega las palabras de la clase y sale un crucigrama. «Otra vez» y
   sale otro distinto con las mismas.

   NADA PRECARGADO, como el resto de la sección: las palabras son las de hoy.
   Las pistas son opcionales —`palabra = pista` por línea— porque hay dos formas
   legítimas de usarlo, y las dos se dan: con la pista escrita, y con el docente
   dictándola mientras el curso mira la cuadrícula.

   DOS SALIDAS, PORQUE HAY DOS USOS:

     · PROYECTADO se resuelve entre todos: sale la cuadrícula vacía, se leen las
       pistas y el curso va cantando palabras. Para eso está «ver las
       respuestas», que rellena las casillas de golpe cuando toca corregir.
     · IMPRESO se reparte. Un crucigrama que no se puede repartir es medio
       crucigrama, así que hay una hoja de verdad: cuadrícula vacía, pistas
       debajo, y NADA de la interfaz. La hoja del alumno nunca lleva respuestas
       —eso lo decide `@media print` en index.css, no un botón que se puede
       olvidar apagado.

   LAS CASILLAS SE MIDEN SOLAS. Una cuadrícula de 8 columnas y una de 25 no
   pueden usar la misma casilla: la segunda se sale de la pantalla y del papel.
   El lado sale del ancho disponible dividido por las columnas, con un tope para
   que un crucigrama de tres palabras no salga con casillas de diez centímetros,
   y con un SUELO para que una de veinte columnas no salga con casillas de
   dieciséis píxeles en un teléfono. Lo que no quepa se desplaza, que es
   preferible a una cuadrícula que se ve entera y no se puede leer.

   ────────────────────────────────────────────────────────────────────────────
   DUA: LO QUE AQUÍ NO ES OPCIONAL
   ────────────────────────────────────────────────────────────────────────────
   1. LA CUADRÍCULA NO SE LE LEE A NADIE, y es una decisión, no un olvido. Son
      cientos de casillas sueltas; un lector de pantalla las recorrería en orden
      de documento y diría «C, H, A, vacío, vacío, I…», que no es el crucigrama
      sino su ruido. Va silenciada con una frase que dice su tamaño, y todo lo
      que se puede usar de verdad está debajo: las dos listas de pistas, que son
      listas numeradas de verdad, con el largo de cada palabra y su respuesta.

   2. EL LARGO DE CADA PALABRA, ESCRITO. Es lo que hace cualquier crucigrama de
      periódico, y aquí evita además tener que contar casillas en una proyección
      desde el fondo de la sala, o con poca visión.

   3. LA RESPUESTA NO SE DISTINGUE SOLO POR EL COLOR. Lleva negrita y una flecha
      delante: proyectado, el acento se lava hasta casi el gris del texto.

   4. EL NÚMERO TIENE SUELO PROPIO. Es el texto más pequeño de toda la suite y
      estaba atado al 30% de la casilla; sin el suyo, con el suelo de la casilla
      todavía se quedaba en ocho píxeles.

   5. LO QUE CAMBIA SIN AVISAR, SE DICE. «Ver las respuestas» rellena la
      cuadrícula silenciada: al oído no pasaba nada. Hay un aviso que lo cuenta.

   LO QUE NO ENTRA SE DICE Y NO SE ESCONDE. Una palabra sin letras en común con
   las demás no se puede colocar; el docente pidió diez y tiene que saber que
   salieron ocho, o repartirá una hoja a la que le faltan dos.

   El motor y sus pruebas están en `../crucigrama.js`: un crucigrama mal armado
   no da error, da una cuadrícula que se ve perfecta y no se puede resolver.
   ========================================================================== */
import React, { useState } from 'react';
import { parsearPalabras, generar, pistas, MAX_PALABRAS } from '../crucigrama';
import { ACCION, APAGADO, ENLACE } from '../ui';

/* LA CUADRÍCULA ES PAPEL, y va fija en los dos temas — igual que la carcasa del
   semáforo es un objeto oscuro en los dos. Un crucigrama es una hoja: blanco con
   tinta negra es lo que la mano espera al ir a escribir, y en modo oscuro unas
   casillas gris marengo con letras índigo no se leen ni se imprimen.
   Va en estilos y no en clases para que la capa de modo oscuro no lo toque: no
   hay nada que invertir en una hoja de papel. */
const PAPEL = '#ffffff';
const TRAZO = '#334155';   /* el borde de la casilla */
const NUMERO = '#475569';  /* 7,4:1 sobre el papel, y es el texto más chico */
const TINTA = '#4338ca';   /* la letra de la solución: 8,1:1 sobre el papel */

const Crucigrama = ({ lang = 'es', grande = false }) => {
  const es = lang === 'es';
  const [texto, setTexto] = useState('');
  const [cruci, setCruci] = useState(null);
  const [descartes, setDescartes] = useState([]);
  const [respuestas, setRespuestas] = useState(false);

  const { lista, fuera } = parsearPalabras(texto);

  const armar = () => {
    const c = generar({ palabras: lista });
    setCruci(c);
    setDescartes(fuera);
    setRespuestas(false);
  };

  /* EL LADO DE LA CASILLA, en unidades del VIEWPORT y nunca en porcentaje. Un
     % en el ancho se mide contra el ancho del contenedor y en el alto contra su
     alto, así que la misma cadena servía para `width` y no para `height`: las
     casillas salían aplastadas. `vw` mide lo mismo en los dos.
     El tope evita que tres palabras salgan con casillas de diez centímetros; el
     reparto por columnas evita que veinte se salgan del teléfono. Lo que no
     quepa lo resuelve el scroll horizontal del contenedor, que es de la
     cuadrícula y no de la página. */
  const lado = cruci
    ? `clamp(28px, calc(88vw / ${cruci.ancho}), ${grande ? '6.5vh' : '2rem'})`
    : '2rem';

  /* EL NÚMERO NECESITA SU PROPIO SUELO. Es el texto más pequeño de toda la suite
     y estaba atado a la casilla al 30%: en una cuadrícula de veinte columnas, en
     un teléfono, salía a menos de cinco píxeles. Con el suelo de la casilla en
     28 sigue quedándose en ocho, que tampoco se lee. Se le pone el suyo, y si en
     una casilla apretada el número ocupa más de la cuenta, que ocupe: un número
     que no se lee no sirve de nada, y sin él no se sabe qué pista va dónde. */
  const numeroTam = `max(10px, calc(${lado} * 0.3))`;

  const { horizontales, verticales } = cruci ? pistas(cruci) : { horizontales: [], verticales: [] };

  const numeroEn = (f, c) => cruci.numeros.find(n => n.fila === f && n.col === c)?.numero;

  const Lista = ({ titulo, items }) => (
    items.length === 0 ? null : (
      <div className="min-w-0 flex-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">{titulo}</h3>
        <ol className="space-y-1">
          {items.map(p => (
            <li key={p.numero + p.dir} className="text-sm text-slate-800 flex gap-2">
              <span className="font-bold tabular-nums shrink-0">{p.numero}.</span>
              <span className="min-w-0">
                {/* Sin pista escrita se deja el sitio marcado: el docente la dicta,
                    y una línea vacía dice «aquí va algo» mejor que la nada. */}
                {p.pista || <span className="text-muted">{'_'.repeat(10)}</span>}
                {/* EL LARGO, ESCRITO. Es lo que hace cualquier crucigrama de
                    periódico, y aquí además evita tener que contar casillas en
                    una proyección desde el fondo de la sala o con poca visión.
                    Va entre paréntesis, que es como se lee en el papel. */}
                <span className="ml-1.5 tabular-nums text-muted">
                  {/* Los paréntesis son para el ojo; al oído sobran y se leen
                      como signos sueltos. Dos versiones de lo mismo. */}
                  <span aria-hidden="true">({p.palabra.length})</span>
                  <span className="sr-only">{p.palabra.length} {es ? 'letras' : 'letters'}</span>
                </span>
                {/* LA RESPUESTA NO SE DISTINGUE SOLO POR EL COLOR. Va en negrita
                    y con una flecha delante: el color es la lectura rápida, pero
                    proyectado se lava, y quien no lo distinga tiene el peso y la
                    forma. Para quien la escucha, la flecha no dice nada, así que
                    ahí va la palabra «Respuesta».
                    El color va sobre el fondo de la PÁGINA, no sobre el papel: el
                    indigo-700 daba 2,44:1 en oscuro y lo cazó la sonda. `--marca`
                    es lo que los tokens ofrecen para el acento de interfaz, con un
                    valor por tema. */}
                {respuestas && (
                  <b className="gh-solucion ml-2" style={{ color: 'var(--marca)' }}>
                    <span aria-hidden="true">→ </span>
                    <span className="sr-only">{es ? 'Respuesta: ' : 'Answer: '}</span>
                    {p.original}
                  </b>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
    )
  );

  return (
    <section className={grande ? 'w-full' : 'w-full max-w-xl mx-auto'}>
      {!grande && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-1 gh-no-print">{es ? 'Crucigrama' : 'Crossword'}</h2>
          <p className="text-sm text-muted mb-4 gh-no-print">
            {es ? 'Pega las palabras de la clase, una por línea, y sale un crucigrama. Se proyecta o se imprime. No guarda nada.'
                : 'Paste the words from today’s lesson, one per line, and out comes a crossword. Project it or print it. Nothing is stored.'}
          </p>
        </>
      )}

      {!cruci ? (
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">
              {es ? 'Las palabras' : 'The words'}{' '}
              <span className="font-normal text-muted">
                {es ? '· una por línea, o varias separadas por comas; la pista, opcional, detrás de «=», «:» o entre paréntesis'
                    : '· one per line, or several separated by commas; the clue, optional, after “=”, “:” or in brackets'}
              </span>
            </span>
            <textarea
              value={texto} rows={8}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={es
                ? 'apple\nbanana = it is yellow and long\ncherry = a small red fruit'
                : 'apple\nbanana = it is yellow and long\ncherry = a small red fruit'}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </label>

          <p className="text-xs text-muted">
            {es ? `${lista.length} ${lista.length === 1 ? 'palabra' : 'palabras'}. Con menos de cuatro el crucigrama queda pobre; más de ${MAX_PALABRAS} no caben en una hoja.`
                : `${lista.length} ${lista.length === 1 ? 'word' : 'words'}. Fewer than four makes a thin crossword; more than ${MAX_PALABRAS} will not fit on a sheet.`}
          </p>

          <button onClick={armar} disabled={lista.length < 2} className={ACCION}>
            {es ? 'Armar el crucigrama' : 'Build the crossword'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* LA HOJA. Es lo único que se imprime: todo lo demás lleva
              `gh-no-print`. */}
          <div className="gh-hoja">
            {/* LA CUADRÍCULA NO SE LE LEE A NADIE, y esto es deliberado. Son
                cientos de casillas sueltas: un lector de pantalla las recorrería
                en el orden del documento y diría «C, H, A, vacío, vacío, I…»,
                que no es el crucigrama sino su ruido. Lo que ESTÁ dicho es lo
                que se puede usar: cuántas casillas hay, y debajo las dos listas
                de pistas, que sí son listas de verdad, numeradas, con el largo
                de cada palabra y con la respuesta cuando se piden. */}
            <p className="sr-only">
              {es ? `Cuadrícula de ${cruci.alto} filas por ${cruci.ancho} columnas con ${cruci.colocadas.length} palabras cruzadas. Las palabras, su número y su largo están en las listas de pistas que siguen.`
                  : `Grid of ${cruci.alto} rows by ${cruci.ancho} columns with ${cruci.colocadas.length} interlocking words. The words, their numbers and their lengths are in the clue lists below.`}
            </p>
            <div className="overflow-x-auto">
              <div
                aria-hidden="true"
                className="mx-auto grid w-max"
                style={{ gridTemplateColumns: `repeat(${cruci.ancho}, ${lado})` }}
              >
                {cruci.celdas.map((fila, f) => fila.map((letra, c) => {
                  const num = letra ? numeroEn(f, c) : null;
                  return (
                    <div
                      key={`${f},${c}`}
                      className={letra ? 'relative' : ''}
                      style={{
                        width: lado, height: lado,
                        ...(letra ? { background: PAPEL, border: `1px solid ${TRAZO}` } : null),
                      }}
                    >
                      {num && (
                        <span className="absolute top-0 left-0.5 font-bold leading-none tabular-nums"
                              style={{ color: NUMERO, fontSize: numeroTam }}>
                          {num}
                        </span>
                      )}
                      {letra && respuestas && (
                        <span className="gh-solucion absolute inset-0 flex items-center justify-center font-bold"
                              style={{ color: TINTA, fontSize: `calc(${lado} * 0.55)` }}>
                          {letra}
                        </span>
                      )}
                    </div>
                  );
                }))}
              </div>
            </div>

            <div className={`mt-4 flex flex-col sm:flex-row gap-x-8 gap-y-4 ${grande ? 'max-w-5xl mx-auto' : ''}`}>
              <Lista titulo={es ? 'Horizontales' : 'Across'} items={horizontales} />
              <Lista titulo={es ? 'Verticales' : 'Down'} items={verticales} />
            </div>
          </div>

          {/* «VER LAS RESPUESTAS» CAMBIA LA PANTALLA ENTERA y no dice nada al
              oído: las letras aparecen dentro de una cuadrícula que está
              silenciada a propósito. Aquí se cuenta lo que pasó. */}
          <p role="status" aria-live="polite" className="sr-only">
            {respuestas
              ? (es ? 'Respuestas a la vista, en la cuadrícula y en cada pista.' : 'Answers shown, in the grid and next to each clue.')
              : (es ? 'Respuestas ocultas.' : 'Answers hidden.')}
          </p>

          {/* LAS QUE NO ENTRARON. Va debajo de la hoja y fuera de ella: es
              información para el docente, no para el alumno. */}
          {(cruci.fuera.length > 0 || descartes.length > 0) && (
            /* DOS MOTIVOS DISTINTOS, Y NO DAN EL MISMO CONSEJO. Una palabra que
               no cruza puede entrar con «otra vez»; un renglón que se leyó mal
               no va a entrar nunca por insistir, hay que separarlo. Decirle al
               docente «prueba otra vez» ante lo segundo es mandarlo a repetir
               algo que no puede funcionar. */
            <div className="gh-no-print text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2 space-y-1">
              {cruci.fuera.length > 0 && (
                <p>
                  {es ? 'No entraron: ' : 'Left out: '}
                  <strong>{cruci.fuera.map(p => p.original).join(', ')}</strong>
                  {'. '}
                  {es ? 'Una palabra sin letras en común con las demás no se puede cruzar. Prueba «otra vez».'
                      : 'A word with no letters in common cannot cross anything. Try “again”.'}
                </p>
              )}
              {descartes.length > 0 && (
                <p>
                  {es ? 'No se usaron: ' : 'Not used: '}
                  <strong>{descartes.map(d => d.original).join(', ')}</strong>
                  {'. '}
                  {descartes.some(d => d.motivo === 'larga')
                    ? (es ? 'Alguna quedó demasiado larga: suele pasar cuando un renglón trae varias palabras y el separador no se reconoce. Sepáralas con coma, o pon la pista detrás de «=», «:» o entre paréntesis.'
                          : 'One is too long: that usually means a line held several words. Separate them with commas, or put the clue after “=”, “:” or in brackets.')
                    : (es ? 'Estaban repetidas o eran demasiado cortas.' : 'They were duplicates or too short.')}
                </p>
              )}
            </div>
          )}

          <div className="gh-no-print flex flex-wrap gap-2">
            <button onClick={armar} className={`flex-1 ${APAGADO}`}>{es ? 'Otra vez' : 'Again'}</button>
            <button onClick={() => setRespuestas(v => !v)} aria-pressed={respuestas} className={`flex-1 ${APAGADO}`}>
              {respuestas ? (es ? 'Ocultar respuestas' : 'Hide answers') : (es ? 'Ver las respuestas' : 'Show answers')}
            </button>
            <button onClick={() => window.print()} className={`flex-1 ${APAGADO}`}>
              {es ? 'Imprimir' : 'Print'}
            </button>
          </div>

          <p className="gh-no-print text-xs text-muted">
            {es ? 'Lo impreso es siempre la hoja del alumno: cuadrícula vacía y pistas, sin respuestas aunque estén a la vista aquí.'
                : 'What prints is always the student sheet: empty grid and clues, with no answers even if they are showing here.'}
          </p>

          <button onClick={() => { setCruci(null); setRespuestas(false); }} className={`gh-no-print ${ENLACE}`}>
            {es ? 'cambiar las palabras' : 'change the words'}
          </button>
        </div>
      )}
    </section>
  );
};

export default Crucigrama;
