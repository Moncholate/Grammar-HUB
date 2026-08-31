/* Los errores que se creían correctos, comprobados.
   ----------------------------------------------------------------------------
   Esto se PROYECTA como ejemplo de lo que está mal, así que un descuido aquí no
   es un bug: es enseñar una forma incorrecta como si fuera la correcta, o al
   revés. Y no hay forma de que salte solo — la pantalla se ve perfecta.

   Lo que se comprueba:

     1. Que cada tiempo del currículo tenga el suyo. Si falta uno, ese día la
        herramienta no se puede usar con lo que se acaba de enseñar, que es
        justo cuando se usaría.
     2. Que «mal» y «bien» sean DISTINTAS y estén las dos. Un par idéntico deja
        una pantalla que dice «antes pensaba X, ahora pienso X».
     3. Que a un curso solo se le ofrezca lo que ya vio, y que el que sale por
        defecto sea el del contenido reciente.
     4. Que el porqué exista y no se quede corto: es lo único que el profesor
        tiene para decidir si ese error le sirve, y lo que NO se proyecta.

   Correr:  node tools/check-errores.mjs        (desde Grammar HUB/) */
import { ERRORES, erroresDe, errorPorDefecto } from '../src/errores.js';
import { tiemposHasta } from '../src/tiempos.js';
import { NIVELES } from '../src/data/curriculum.generated.js';

let problemas = 0;
const fallo = (m) => { console.log('   ✗ ' + m); problemas++; };
const ok = (m) => console.log('   ✓ ' + m);

console.log('\nningún tiempo del currículo se queda sin su error');
{
  const todos = tiemposHasta(null);
  const conError = new Set(ERRORES.map(e => e.tiempo));
  const faltan = todos.filter(t => !conError.has(t.id));
  if (faltan.length) fallo(`sin error: ${faltan.map(t => t.id).join(', ')} — la herramienta no se podría usar el día que se enseñan`);
  else ok(`los ${todos.length} tiempos tienen el suyo`);

  const sobran = ERRORES.filter(e => !todos.some(t => t.id === e.tiempo));
  if (sobran.length) fallo(`apuntan a tiempos que no existen: ${sobran.map(e => e.tiempo).join(', ')}`);
  else ok('ninguno apunta a un tiempo inexistente');

  const ids = ERRORES.map(e => e.tiempo);
  if (new Set(ids).size === ids.length) ok('uno por tiempo, ninguno repetido');
  else fallo('hay dos errores para el mismo tiempo');
}

console.log('\nel par dice dos cosas distintas');
{
  const iguales = ERRORES.filter(e => e.mal.trim() === e.bien.trim());
  if (iguales.length) fallo(`«antes pensaba X, ahora pienso X»: ${iguales.map(e => e.tiempo).join(', ')}`);
  else ok('en los doce, la mala y la buena son distintas');

  const vacios = ERRORES.filter(e => !e.mal?.trim() || !e.bien?.trim());
  if (vacios.length) fallo(`hay pares con un lado vacío: ${vacios.map(e => e.tiempo).join(', ')}`);
  else ok('ninguno tiene un lado en blanco');

  /* Las dos son oraciones que se proyectan: puntuadas y con mayúscula, porque
     lo que se enseña como forma correcta tiene que estar entero. */
  const mal = ERRORES.filter(e => ![e.mal, e.bien].every(x => /^[A-Z]/.test(x) && /[.?!]$/.test(x)));
  if (mal.length) fallo(`sin mayúscula o sin punto final: ${mal.map(e => e.tiempo).join(', ')}`);
  else ok('las veinticuatro frases están puntuadas: se proyectan como modelo');
}

console.log('\nel porqué existe, y es del profesor');
{
  const cortos = ERRORES.filter(e => !e.porque || e.porque.length < 40);
  if (cortos.length) fallo(`el porqué se queda corto en: ${cortos.map(e => e.tiempo).join(', ')}`);
  else ok('los doce explican por qué, con espacio suficiente para poder discutirlo');
}

console.log('\na un curso solo se le ofrece lo que ya vio');
{
  let mal = 0;
  for (const nivel of NIVELES) {
    const vistos = new Set(tiemposHasta(nivel).map(t => t.id));
    const fuera = erroresDe(nivel).filter(e => !vistos.has(e.id));
    if (fuera.length) { fallo(`${nivel} recibe ${fuera.map(e => e.id).join(', ')}`); mal++; }
  }
  if (!mal) ok('los siete cursos, ninguno con un tiempo que no han visto');

  const vacios = NIVELES.filter(n => erroresDe(n).length === 0);
  if (vacios.length) fallo(`sin ningún error: ${vacios.join(', ')}`);
  else ok('ningún curso se queda sin herramienta, Básico I incluido');

  const b1 = erroresDe('basico1').map(e => e.id);
  if (b1.includes('present-perfect')) fallo('a Básico I se le ofrece el presente perfecto');
  else ok(`Básico I recibe solo los suyos (${b1.join(', ')})`);
}

console.log('\nel que sale por defecto es el del contenido reciente');
{
  let mal = 0;
  for (const nivel of NIVELES) {
    const es = erroresDe(nivel);
    if (!es.length) continue;
    const d = errorPorDefecto(nivel);
    if (d.desde !== Math.max(...es.map(e => e.desde))) {
      fallo(`${nivel}: por defecto ${d.id}, habiendo uno más reciente`);
      mal++;
    }
  }
  if (!mal) ok('en los siete, abre con lo último que el curso vio');

  const e2 = errorPorDefecto('elemental2');
  if (['present-perfect', 'future-going-to'].includes(e2.id)) ok(`Elemental II abre con ${e2.id}, que es de su propio curso`);
  else fallo(`Elemental II abre con ${e2.id}`);
}

console.log('\nlos bordes');
{
  if (erroresDe(null).length === ERRORES.length) ok('sin curso elegido salen todos');
  else fallo('sin curso no salieron todos');
  if (erroresDe('curso-inventado').length === ERRORES.length) ok('un nivel desconocido se trata como «sin curso»');
  else fallo('un nivel desconocido dio otra cosa');
  const e = erroresDe('intermedio2')[0];
  if (e.tiempo?.es && e.tiempo?.en) ok('el tiempo viene con sus nombres, listo para pintar');
  else fallo('un error llegó sin el nombre del tiempo');
}

console.log(problemas ? `\n✗ ${problemas} problema(s)` : '\nERRORES OK');
process.exit(problemas ? 1 : 0);
