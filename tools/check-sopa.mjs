/* La sopa de letras, comprobada.
   ----------------------------------------------------------------------------
   Una sopa mal armada NO da error: da una cuadrícula perfecta con una palabra
   que no está, o con un hueco en blanco, o —la peor— con las palabras tan
   evidentes que el ejercicio no existe. Las tres se descubren en la sala.

   LAS CUATRO QUE IMPORTAN:

     1. QUE LA PALABRA ESTÉ DONDE DICE. Se lee la cuadrícula letra a letra desde
        las coordenadas y en la dirección declaradas. Si no se lee, el alumno
        busca algo que no está y la culpa se la lleva él.
     2. QUE LA DIFICULTAD SIGNIFIQUE ALGO. En «fácil» no puede colarse una
        diagonal ni una palabra al revés: un curso que apenas reconoce la palabra
        escrita del derecho no puede toparse con «ELPPA».
     3. QUE NO QUEDEN HUECOS. Una casilla vacía en una sopa es un agujero: se ve
        a un metro y señala dónde NO hay palabra.
     4. QUE EL RELLENO NO DELATE. Si se rellena con el alfabeto uniforme, las K y
        las W del relleno dibujan el negativo de las palabras y la sopa se
        resuelve mirando la textura, sin leer una letra.

   Correr:  node tools/check-sopa.mjs        (desde Grammar HUB/) */
import { generar, ladoPara, NIVELES, DIRECCIONES, casillasDe, MAX_LADO } from '../src/sopa.js';
import { parsearPalabras } from '../src/palabras.js';

let problemas = 0;
const fallo = (m) => { console.log('   ✗ ' + m); problemas++; };
const ok = (m) => console.log('   ✓ ' + m);

const azarFijo = (semilla) => () => {
  semilla = (semilla * 1664525 + 1013904223) % 4294967296;
  return semilla / 4294967296;
};

const LISTAS = {
  fruta: ['apple', 'orange', 'lemon', 'melon', 'grape', 'banana', 'peach', 'plum', 'cherry', 'mango'],
  verbos: ['work', 'study', 'travel', 'listen', 'write', 'read', 'speak', 'watch', 'play', 'cook', 'clean', 'drive'],
  cortas: ['at', 'in', 'on', 'to', 'up', 'of', 'by', 'we'],
  larga: ['refrigerator', 'extraordinary', 'sun', 'moon'],
};
const entradas = (l) => parsearPalabras(l.join('\n')).lista;
const sopas = (lista, dif = 'media', veces = 60) =>
  Array.from({ length: veces }, (_, s) => generar({ palabras: entradas(lista), dificultad: dif, azar: azarFijo(s + 1) }));

/** Lee la palabra desde sus coordenadas, como la leería un alumno. */
const leer = (sopa, p) => casillasDe(p).map(({ fila, col }) => sopa.celdas[fila]?.[col]).join('');

console.log('\nCADA PALABRA ESTÁ DONDE DICE QUE ESTÁ');
{
  let malas = 0, leidas = 0;
  for (const [nombre, lista] of Object.entries(LISTAS)) {
    for (const dif of Object.keys(NIVELES)) {
      for (const sopa of sopas(lista, dif, 25)) {
        for (const p of sopa.colocadas) {
          leidas++;
          if (leer(sopa, p) !== p.palabra) {
            fallo(`«${nombre}»/${dif}: ${p.palabra} no se lee en (${p.fila},${p.col}) hacia ${p.dir} — sale «${leer(sopa, p)}»`);
            malas++; break;
          }
        }
        if (malas) break;
      }
      if (malas) break;
    }
    if (malas) break;
  }
  if (!malas) ok(`${leidas} palabras leídas desde sus coordenadas en 300 sopas, todas correctas`);
}

console.log('\nnada se sale de la cuadrícula');
{
  let malas = 0;
  for (const lista of Object.values(LISTAS)) {
    for (const dif of Object.keys(NIVELES)) {
      for (const sopa of sopas(lista, dif, 20)) {
        for (const p of sopa.colocadas) {
          const fuera = casillasDe(p).some(({ fila, col }) => fila < 0 || col < 0 || fila >= sopa.lado || col >= sopa.lado);
          if (fuera) { fallo(`${p.palabra} se sale de la cuadrícula`); malas++; break; }
        }
        if (malas) break;
      }
    }
  }
  if (!malas) ok('ninguna palabra asoma por fuera de la cuadrícula');
}

console.log('\nLA DIFICULTAD SIGNIFICA ALGO');
{
  const usadas = (dif) => new Set(sopas(LISTAS.verbos, dif, 60).flatMap(s => s.colocadas.map(p => p.dir)));

  const facil = usadas('facil');
  const permitidasFacil = new Set(NIVELES.facil);
  const coladas = [...facil].filter(d => !permitidasFacil.has(d));
  if (coladas.length) fallo(`en «fácil» se colaron ${coladas.join(', ')}: un curso básico no puede toparse con «ELPPA»`);
  else ok('en «fácil» solo → y ↓: se lee como se lee');

  const media = usadas('media');
  const alReves = [...media].filter(d => ['O', 'N', 'NO', 'SO'].includes(d));
  if (alReves.length) fallo(`en «media» hay palabras al revés (${alReves.join(', ')})`);
  else ok('en «media» entran las diagonales hacia abajo, pero nada al revés');
  if (media.has('SE') || media.has('NE')) ok('y las diagonales aparecen de verdad, no solo en la lista de permitidas');
  else fallo('en «media» nunca sale una diagonal: la dificultad no cambia nada');

  const dificil = usadas('dificil');
  if ([...dificil].some(d => ['O', 'N', 'NO', 'SO'].includes(d))) ok('en «difícil» sí salen al revés: ya no se reconoce, se reconstruye');
  else fallo('en «difícil» nunca sale una palabra al revés');

  if (dificil.size > media.size && media.size > facil.size) ok('cada nivel usa más direcciones que el anterior');
  else fallo(`las direcciones por nivel no crecen: ${facil.size} / ${media.size} / ${dificil.size}`);
}

console.log('\nno quedan huecos');
{
  let malas = 0;
  for (const lista of Object.values(LISTAS)) {
    for (const sopa of sopas(lista, 'media', 20)) {
      if (!sopa.lado) continue;
      const hueco = sopa.celdas.some(f => f.some(c => !c || !/^[A-Z]$/.test(c)));
      if (hueco) { fallo('hay una casilla vacía o con algo que no es una letra'); malas++; break; }
      if (sopa.celdas.length !== sopa.lado || sopa.celdas.some(f => f.length !== sopa.lado)) {
        fallo('la cuadrícula no es cuadrada'); malas++; break;
      }
    }
    if (malas) break;
  }
  if (!malas) ok('todas las casillas llevan una letra, y la cuadrícula es cuadrada');
}

console.log('\nEL RELLENO NO DELATA');
{
  /* Con relleno uniforme del alfabeto, las letras que el vocabulario no usa
     —K, W, X, Z— aparecerían por todas partes y dibujarían el negativo de las
     palabras. Se comprueba que las letras de la sopa salgan del vocabulario. */
  let malas = 0;
  for (const [nombre, lista] of Object.entries(LISTAS)) {
    for (const sopa of sopas(lista, 'media', 20)) {
      if (!sopa.colocadas.length) continue;
      const delVocabulario = new Set(sopa.colocadas.flatMap(p => p.palabra.split('')));
      const enLaSopa = new Set(sopa.celdas.flat());
      const intrusas = [...enLaSopa].filter(l => !delVocabulario.has(l));
      if (intrusas.length) {
        fallo(`«${nombre}»: la sopa trae ${intrusas.join(', ')}, que no están en ninguna palabra — el relleno delata`);
        malas++; break;
      }
    }
    if (malas) break;
  }
  if (!malas) ok('cada letra de la sopa sale del vocabulario puesto: no hay textura que leer');

  /* Y que el relleno no sea una sola letra repetida, que sería lo contrario. */
  const s = generar({ palabras: entradas(LISTAS.verbos), dificultad: 'media', azar: azarFijo(3) });
  const distintas = new Set(s.celdas.flat()).size;
  if (distintas >= 8) ok(`${distintas} letras distintas en la cuadrícula: variada de verdad`);
  else fallo(`solo ${distintas} letras distintas: la sopa se ve como un patrón`);
}

console.log('\nse coloca lo que se puede, y lo que no se dice');
{
  for (const lista of Object.values(LISTAS)) {
    const s = generar({ palabras: entradas(lista), dificultad: 'media', azar: azarFijo(9) });
    if (s.colocadas.length + s.fuera.length !== entradas(lista).length) {
      fallo('colocadas + fuera no suman las que se pidieron: alguna se perdió por el camino');
    }
  }
  if (!problemas) ok('ninguna palabra desaparece sin explicación');

  const tasas = Object.values(LISTAS).map(l => {
    const s = generar({ palabras: entradas(l), dificultad: 'media', azar: azarFijo(11) });
    return s.colocadas.length / entradas(l).length;
  });
  if (Math.min(...tasas) === 1) ok('con las cuatro listas de prueba entran TODAS las palabras');
  else fallo(`alguna lista pierde palabras: tasas ${tasas.map(t => Math.round(t * 100) + '%').join(', ')}`);

  /* Una palabra más larga que la cuadrícula no cabe por definición, y tiene que
     salir nombrada en vez de desaparecer. */
  const larga = generar({ palabras: entradas(['sun', 'moon', 'x'.repeat(30)]), azar: azarFijo(2) });
  if (larga.fuera.some(p => p.motivo === 'larga')) ok('una palabra más larga que la cuadrícula se descarta CON MOTIVO');
  else fallo('una palabra de 30 letras no se reportó como demasiado larga');
}

console.log('\nel tamaño se ajusta a la lista');
{
  const casos = [
    [LISTAS.cortas, 'ocho palabras de dos letras'],
    [LISTAS.verbos, 'doce verbos'],
    [LISTAS.larga, 'una de trece letras'],
  ];
  for (const [lista, que] of casos) {
    const l = ladoPara(entradas(lista));
    const masLarga = Math.max(...entradas(lista).map(p => p.palabra.length));
    if (l < masLarga) fallo(`${que}: lado ${l} y la palabra más larga mide ${masLarga}`);
    else if (l > MAX_LADO) fallo(`${que}: lado ${l}, no cabe en una hoja`);
    else ok(`${que} → cuadrícula de ${l}×${l}`);
  }
  if (ladoPara([]) === 0) ok('sin palabras, sin cuadrícula');
  else fallo('una lista vacía dio una cuadrícula');
}

console.log('\n«otra vez» da otra sopa');
{
  const l = entradas(LISTAS.verbos);
  const firma = (s) => s.celdas.map(f => f.join('')).join('|');
  const distintas = new Set(Array.from({ length: 10 }, (_, i) =>
    firma(generar({ palabras: l, dificultad: 'media', azar: azarFijo(i + 1) }))));
  if (distintas.size === 10) ok('diez tiradas, diez sopas distintas');
  else fallo(`diez tiradas dieron ${distintas.size} distintas`);

  const a = firma(generar({ palabras: l, azar: azarFijo(4) }));
  const b = firma(generar({ palabras: l, azar: azarFijo(4) }));
  if (a === b) ok('con la misma semilla, la misma sopa: reproducible y por eso probable');
  else fallo('el mismo azar dio dos sopas');
}

console.log('\nlos bordes no revientan');
{
  const casos = [
    [{}, 'sin nada'],
    [{ palabras: [] }, 'sin palabras'],
    [{ palabras: entradas(['solo']) }, 'una sola palabra'],
    [{ palabras: entradas(LISTAS.verbos), dificultad: 'inventada' }, 'una dificultad que no existe'],
  ];
  for (const [args, que] of casos) {
    try {
      const s = generar({ ...args, azar: azarFijo(6) });
      const sano = Number.isInteger(s.lado) && Array.isArray(s.celdas) && Array.isArray(s.colocadas) && Array.isArray(s.fuera);
      if (sano) ok(`${que} → ${s.lado}×${s.lado}, ${s.colocadas.length} colocadas`);
      else fallo(`${que} devolvió algo raro`);
    } catch (e) { fallo(`${que} lanzó ${e.message}`); }
  }
  const rara = generar({ palabras: entradas(LISTAS.verbos), dificultad: 'inventada', azar: azarFijo(6) });
  if (rara.colocadas.every(p => NIVELES.media.includes(p.dir))) ok('una dificultad desconocida cae en «media», no en el caos');
  else fallo('una dificultad desconocida usó direcciones de más');
}

console.log(problemas ? `\n✗ ${problemas} problema(s)` : '\nSOPA DE LETRAS OK');
process.exit(problemas ? 1 : 0);
