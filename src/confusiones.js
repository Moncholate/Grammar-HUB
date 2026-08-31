/* ============================================================================
   LOS PARES QUE SE CONFUNDEN
   ----------------------------------------------------------------------------
   Para «La duda» del cierre. La herramienta no pregunta «¿alguna duda?» —eso
   produce silencio, porque exige nombrar el hueco desde cero— sino que ofrece
   un molde a medio hacer:

       «No me queda claro cuándo se usa ____ en vez de ____.»

   Y el molde llega precargado con el par que ESE curso confunde. Un molde con
   los dos huecos vacíos vuelve a ser una pregunta en blanco.

   ESTA LISTA ES UNA SEMILLA, NO UN DATO CERRADO. Son las confusiones clásicas
   del inglés como lengua extranjera, no las que el profesor ve en SUS cursos —
   eso lo sabe él y nadie más. Está aquí para que la herramienta funcione desde
   el primer día y para que revisarla sea tachar y corregir en vez de escribir
   de cero. Mismo criterio que `usos-tiempos.md`.

   UN PAR SOLO SE OFRECE SI EL CURSO VIO LOS DOS TIEMPOS. Confundir el Presente
   Perfecto con el Pasado Simple es imposible en Básico I, donde el primero no
   se ha enseñado; ofrecerlo ahí sería inventarle una duda al alumno. Es el
   mismo filtro que ya aplican el dado y el semáforo.

   Este archivo es PURO: `tools/check-confusiones.mjs`.
   ========================================================================== */
import { tiemposHasta } from './tiempos.js';
import { NIVELES } from './data/curriculum.generated.js';

/**
 * Cada par, con el porqué en una línea. El `porque` no se proyecta: es para el
 * profesor, que a veces necesita acordarse de por qué ese par y no otro.
 *
 * El orden importa dentro del par: primero el que el alumno usa DE MÁS, después
 * el que debería estar usando. «Cuándo se usa el Presente Perfecto en vez del
 * Pasado Simple» es la pregunta que se hacen; al revés suena a examen.
 */
export const PARES = [
  /* La de Básico I, y la única que ese curso puede tener: sin ella la
     herramienta no existiría en el primer curso, que es donde más falta hace
     preguntar qué no se entendió. «I am work» y «She is have» son EL error del
     nivel, y salen de que en español el verbo be no se dice. */
  { a: 'to-be-pres', b: 'simple-present',
    porque: 'Cuándo va «be» y cuándo va un verbo normal. «I am work» sale de que en español ese «soy» no está, así que no hay nada que le suene mal.' },
  { a: 'present-perfect', b: 'simple-past',
    porque: 'La madre de todas. En español el pretérito perfecto cubre los dos usos, así que la frontera del inglés no existe en la cabeza del alumno.' },
  { a: 'simple-present', b: 'present-continuous',
    porque: 'Rutina contra ahora mismo. En español el presente simple hace las dos cosas («trabajo» sirve para las dos), y por eso «I work now» sale solo.' },
  { a: 'future-going-to', b: 'simple-future',
    porque: 'Plan contra decisión del momento. Los dos se traducen igual y el alumno elige al azar.' },
  { a: 'simple-past', b: 'past-continuous',
    porque: 'Lo que pasó contra lo que estaba pasando. El mismo problema que el par del presente, un tiempo más atrás.' },
  { a: 'past-perfect', b: 'simple-past',
    porque: 'Cuál de dos cosas pasadas pasó ANTES. Se entiende el concepto y aun así no se usa: el pasado simple parece suficiente.' },
  { a: 'used-to', b: 'simple-past',
    porque: 'Costumbre que ya no está, contra un hecho puntual. «Solía» casi no se dice en chileno, así que no hay a qué agarrarse.' },
];

/**
 * Los pares que ese curso puede confundir de verdad: los dos tiempos vistos.
 * Devuelve los pares con los NOMBRES ya resueltos en los dos idiomas, para que
 * la pantalla no tenga que volver al currículo.
 */
export const paresDe = (nivel) => {
  const vistos = new Map(tiemposHasta(nivel).map(t => [t.id, t]));
  return PARES
    .filter(p => vistos.has(p.a) && vistos.has(p.b))
    .map((p, orden) => {
      const a = vistos.get(p.a), b = vistos.get(p.b);
      return {
        id: `${p.a}|${p.b}`,
        porque: p.porque,
        a, b,
        /* CUÁNDO SE VUELVE POSIBLE este par: el curso del más tardío de los dos.
           No sirve el orden en que están escritos arriba —ese es el orden en
           que se me ocurrieron— y con él, a un Elemental II se le ofrecía por
           defecto la confusión de presente simple contra continuo, de dos
           cursos atrás, en vez del presente perfecto que acaba de ver. */
        desde: Math.max(NIVELES.indexOf(a.level), NIVELES.indexOf(b.level)),
        orden,
      };
    })
    .sort((x, y) => (x.desde - y.desde) || (x.orden - y.orden));
};

/**
 * El par que se ofrece por defecto: el que se vuelve posible MÁS TARDE, o sea
 * el que involucra lo más recién enseñado. Es la duda que el curso tiene
 * delante hoy, no la de hace tres meses.
 */
export const parPorDefecto = (nivel) => {
  const ps = paresDe(nivel);
  return ps.length ? ps[ps.length - 1] : null;
};
