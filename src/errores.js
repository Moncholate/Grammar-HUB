/* ============================================================================
   EL ERROR QUE SE CREÍA CORRECTO
   ----------------------------------------------------------------------------
   Para «Antes / Ahora» del cierre. La rutina pide una creencia que CAMBIÓ:

       Antes pensaba que ____ estaba bien · Ahora pienso ____ porque ____

   Y por eso hace falta un error concreto y creíble. No cualquiera: uno que al
   alumno le haya PARECIDO BIEN, porque si nunca lo creyó, no hay nada que
   voltear. Los que están aquí son de dos clases y las dos importan:

     · LOS DE INTERFERENCIA. «Lo he visto ayer» es español impecable, así que
       «I have seen him yesterday» suena bien y no hay forma de que le chirríe.
       Son los mejores para esta rutina: la creencia existe de verdad.
     · LOS DE LA MARCA QUE SE MUDA. «She doesn't works», «She didn't went»,
       «She will works». Es el mismo patrón en diez tiempos —la marca no
       desaparece, se muda al auxiliar— y es el error más repetido de la clase,
       dicho así en el código de Grammaster.

   ESTA LISTA ES UNA SEMILLA, NO UN DATO CERRADO, igual que los pares de
   `confusiones.js`. Son los errores clásicos del inglés como lengua extranjera
   con hablantes de español, no los que el profesor ve en SUS cursos. Está para
   que la herramienta funcione desde el primer día y para que revisarla sea
   corregir en vez de escribir de cero.

   EL PORQUÉ NO SE PROYECTA. Es lo que tiene que producir el alumno: si sale en
   pantalla, la rutina se convierte en copiar. Está aquí para el profesor, que
   lo ve al elegir el tiempo.

   Un error solo se ofrece si el curso vio ese tiempo. Es el mismo filtro del
   dado, el semáforo y las confusiones.

   Este archivo es PURO: `tools/check-errores.mjs`.
   ========================================================================== */
import { tiemposHasta } from './tiempos.js';
import { NIVELES } from './data/curriculum.generated.js';

/** Uno por tiempo: la frase que parece bien, la que va, y por qué. */
export const ERRORES = [
  { tiempo: 'to-be-pres',
    mal: 'I am work every day.',
    bien: 'I work every day.',
    porque: 'El be no acompaña a otro verbo. En español ese «soy» no está, así que no hay nada que suene mal: hay que aprenderlo, no oírlo.' },

  { tiempo: 'simple-present',
    mal: "She doesn't works here.",
    bien: "She doesn't work here.",
    porque: 'La marca no desaparece: se muda al auxiliar. Si está «does», el verbo vuelve a su forma base. Es el error más repetido de la clase.' },

  { tiempo: 'present-continuous',
    mal: 'She is work now.',
    bien: 'She is working now.',
    porque: 'El continuo son DOS piezas, be + -ing. Con una sola está a medias, y el «is» suelto engaña porque parece que ya conjuga.' },

  { tiempo: 'to-be-past',
    mal: 'She was worked yesterday.',
    bien: 'She worked yesterday.',
    porque: 'Otra vez el be de más: «worked» ya es pasado y no necesita un «was» delante que lo empuje.' },

  { tiempo: 'simple-past',
    mal: "She didn't went home.",
    bien: "She didn't go home.",
    porque: 'El mismo patrón que en presente, un tiempo más atrás: con «did» el verbo vuelve a su base. La marca la lleva el auxiliar.' },

  { tiempo: 'future-going-to',
    mal: 'She going to work tomorrow.',
    bien: 'She is going to work tomorrow.',
    porque: '«going to» necesita el be delante. Sin él la oración se queda sin verbo conjugado, que en español no pasa nunca.' },

  { tiempo: 'present-perfect',
    mal: 'I have seen him yesterday.',
    bien: 'I saw him yesterday.',
    porque: '«Lo he visto ayer» es español impecable y por eso suena bien. En inglés el presente perfecto no admite un tiempo terminado: con «yesterday» va el pasado simple.' },

  { tiempo: 'past-continuous',
    mal: 'She was work when I called.',
    bien: 'She was working when I called.',
    porque: 'Igual que el presente continuo: be + -ing, las dos piezas. Cambia el be, no la regla.' },

  { tiempo: 'simple-future',
    mal: 'She will works tomorrow.',
    bien: 'She will work tomorrow.',
    porque: 'Después de un modal el verbo va en base, siempre. «will works» no existe, y la -s se cuela porque el sujeto la pide en presente.' },

  { tiempo: 'past-perfect',
    mal: 'She had went before I arrived.',
    bien: 'She had gone before I arrived.',
    porque: 'Después de «had» va el participio, no el pasado. «went» y «gone» se aprenden juntos y por eso se cambian.' },

  { tiempo: 'used-to',
    mal: 'She used to worked here.',
    bien: 'She used to work here.',
    porque: '«used to» ya lleva el pasado puesto; el verbo que sigue va en base. Marcar el pasado dos veces es el mismo error de siempre con otra cara.' },

  { tiempo: 'present-perfect-continuous',
    mal: 'She has been work since 2020.',
    bien: 'She has been working since 2020.',
    porque: 'Son TRES piezas: has + been + -ing. Falta la última, y es la que dice que la acción sigue.' },
];

/**
 * Los errores que ese curso puede reconocer como propios, ordenados por cuándo
 * se enseña su tiempo: el último es el del contenido más reciente.
 */
export const erroresDe = (nivel) => {
  const vistos = new Map(tiemposHasta(nivel).map(t => [t.id, t]));
  return ERRORES
    .filter(e => vistos.has(e.tiempo))
    .map(e => {
      const t = vistos.get(e.tiempo);
      return { id: e.tiempo, mal: e.mal, bien: e.bien, porque: e.porque, tiempo: t,
               desde: NIVELES.indexOf(t.level) };
    })
    .sort((a, b) => a.desde - b.desde);
};

/** El del contenido recién visto, que es la creencia que tienen delante hoy. */
export const errorPorDefecto = (nivel) => {
  const es = erroresDe(nivel);
  return es.length ? es[es.length - 1] : null;
};
