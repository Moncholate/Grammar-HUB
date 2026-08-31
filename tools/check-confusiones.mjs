/* Los pares que se confunden, comprobados.
   ----------------------------------------------------------------------------
   Esto decide qué duda se le PROPONE a un curso, y las dos formas de meter la
   pata no dan error: dan una pantalla creíble con la duda equivocada.

     1. Ofrecer un par que el curso no puede confundir todavía. A un Básico I
        no se le puede proponer «Presente Perfecto en vez de Pasado Simple»:
        no ha visto ninguno de los dos usos, así que no es su duda — es una que
        le estaríamos inventando, y en un cierre eso es peor que no preguntar.
     2. Proponer por defecto la confusión de hace tres meses. Pasaba: el orden
        de la lista es el orden en que se escribieron, no el del currículo, y a
        un Elemental II le salía presente simple contra continuo en vez del
        presente perfecto que acababa de ver.

   Y una tercera que no es de datos sino de alcance: que algún curso se quede
   SIN ningún par. La herramienta dejaría de existir en ese nivel.

   Correr:  node tools/check-confusiones.mjs        (desde Grammar HUB/) */
import { PARES, paresDe, parPorDefecto } from '../src/confusiones.js';
import { tiemposHasta } from '../src/tiempos.js';
import { NIVELES } from '../src/data/curriculum.generated.js';

let problemas = 0;
const fallo = (m) => { console.log('   ✗ ' + m); problemas++; };
const ok = (m) => console.log('   ✓ ' + m);

console.log('\nlos pares apuntan a tiempos que existen');
{
  const todos = new Set(tiemposHasta(null).map(t => t.id));
  const rotos = PARES.filter(p => !todos.has(p.a) || !todos.has(p.b));
  if (rotos.length) fallo(`apuntan a tiempos inexistentes: ${rotos.map(p => `${p.a}|${p.b}`).join(', ')}`);
  else ok(`los ${PARES.length} pares usan ids del currículo`);

  if (PARES.every(p => p.a !== p.b)) ok('ningún par se confunde consigo mismo');
  else fallo('hay un par con el mismo tiempo dos veces');

  const ids = PARES.map(p => `${p.a}|${p.b}`);
  if (new Set(ids).size === ids.length) ok('ninguno repetido');
  else fallo('hay pares duplicados');

  if (PARES.every(p => typeof p.porque === 'string' && p.porque.length > 20)) {
    ok('todos llevan su porqué escrito, que es lo que permite revisarlos');
  } else fallo('algún par no explica por qué está');
}

console.log('\na un curso solo se le ofrece lo que YA VIO');
{
  let mal = 0;
  for (const nivel of NIVELES) {
    const vistos = new Set(tiemposHasta(nivel).map(t => t.id));
    for (const p of paresDe(nivel)) {
      if (!vistos.has(p.a.id) || !vistos.has(p.b.id)) {
        fallo(`${nivel} recibe ${p.a.id}|${p.b.id} y no ha visto los dos`);
        mal++;
      }
    }
  }
  if (!mal) ok('los siete cursos, ningún par con un tiempo que no han visto');

  /* El caso concreto que da nombre a la regla. */
  const b1 = paresDe('basico1').map(p => p.id);
  if (b1.some(id => id.includes('present-perfect'))) fallo('a Básico I se le ofrece el presente perfecto');
  else ok('Básico I no recibe la confusión del presente perfecto');
}

console.log('\nningún curso se queda sin herramienta');
{
  const vacios = NIVELES.filter(n => paresDe(n).length === 0);
  if (vacios.length) fallo(`sin ningún par: ${vacios.join(', ')} — «La duda» no existiría ahí`);
  else ok('los siete cursos tienen al menos un par que proponer');

  if (paresDe('basico1').length >= 1) ok('Básico I incluido, que es donde más falta hace preguntar qué no se entendió');
  else fallo('Básico I se quedó sin pares');
}

console.log('\nel par por defecto es el del contenido RECIÉN visto');
{
  /* La comprobación de verdad: el par por defecto tiene que ser el que se
     vuelve posible más tarde de todos los que ese curso puede confundir. */
  let mal = 0;
  for (const nivel of NIVELES) {
    const ps = paresDe(nivel);
    if (!ps.length) continue;
    const d = parPorDefecto(nivel);
    const masTarde = Math.max(...ps.map(p => p.desde));
    if (d.desde !== masTarde) {
      fallo(`${nivel}: por defecto ${d.id} (desde ${d.desde}) habiendo pares desde ${masTarde}`);
      mal++;
    }
  }
  if (!mal) ok('en los siete, el que sale primero es el más reciente que el curso puede confundir');

  /* El caso que se rompió de verdad y motivó el orden. */
  const e2 = parPorDefecto('elemental2');
  if (e2.a.id === 'present-perfect') ok('Elemental II abre con el presente perfecto, no con el presente continuo de dos cursos atrás');
  else fallo(`Elemental II abre con ${e2.id}`);

  const b1 = parPorDefecto('basico1');
  if (b1 && b1.a.id === 'to-be-pres') ok('Básico I abre con «be» contra verbo normal, que es EL error del nivel');
  else fallo(`Básico I abre con ${b1 && b1.id}`);
}

console.log('\nlos bordes');
{
  const sinCurso = paresDe(null);
  if (sinCurso.length === PARES.length) ok('sin curso elegido salen todos, como en el dado');
  else fallo(`sin curso salieron ${sinCurso.length} de ${PARES.length}`);

  if (paresDe('curso-que-no-existe').length === PARES.length) ok('un nivel desconocido se trata como «sin curso», no revienta');
  else fallo('un nivel desconocido dio otra cosa');

  const p = paresDe('intermedio2')[0];
  if (p.a.es && p.a.en && p.b.es && p.b.en) ok('los nombres vienen resueltos en los dos idiomas');
  else fallo('algún par llegó sin nombres');
}

console.log(problemas ? `\n✗ ${problemas} problema(s)` : '\nCONFUSIONES OK');
process.exit(problemas ? 1 : 0);
