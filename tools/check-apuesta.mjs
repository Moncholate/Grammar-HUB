/* Las consignas de la apuesta, comprobadas.
   ----------------------------------------------------------------------------
   Un set malo no da error: da cinco consignas creíbles que no miden nada. Y la
   apuesta es la herramienta que más depende de que el set esté bien repartido,
   porque lo que enseña es la DISTANCIA entre lo que el alumno cree y lo que
   tiene — con cinco consignas del mismo tiempo, acierta o falla en bloque y esa
   distancia no dice nada.

   Las tres formas de que salga mal, y las tres se ven solo mirando muchos sets:

     1. Repetir un tiempo teniendo otros sin salir.
     2. Sacar las cinco en afirmativa. Un set fácil hace creer que se sabe, que
        es justo lo contrario de para qué existe esto.
     3. No incluir ninguna tercera persona del singular. Ahí vive la mitad de la
        dificultad —la -s, el does, el is— y sin ninguna el set esquiva lo que
        más se falla.

   Se prueban con MUCHAS barajadas y azar reproducible: un fallo de reparto que
   aparece una vez de cada veinte no se caza mirando un set.

   Correr:  node tools/check-apuesta.mjs        (desde Grammar HUB/) */
import { sacarConsignas, SUJETOS, TERCERA } from '../src/apuesta.js';

let problemas = 0;
const fallo = (m) => { console.log('   ✗ ' + m); problemas++; };
const ok = (m) => console.log('   ✓ ' + m);

/* Azar reproducible, como en check-grupos: sin esto un fallo aparecería una vez
   de cada tantas ejecuciones y nadie sabría por qué. */
const azarFijo = (semilla) => () => {
  semilla = (semilla * 1664525 + 1013904223) % 4294967296;
  return semilla / 4294967296;
};

const FORMAS = ['affirmative', 'negative', 'interrogative'];
const tiemposDe = (n) => Array.from({ length: n }, (_, i) => ({ id: `t${i}`, es: `Tiempo ${i}`, en: `Tense ${i}` }));

/** Todos los sets de una configuración, con muchas semillas. */
const sets = (nTiempos, cuantas, veces = 200) =>
  Array.from({ length: veces }, (_, s) =>
    sacarConsignas({ tiempos: tiemposDe(nTiempos), formas: FORMAS, cuantas, azar: azarFijo(s + 1) }));

console.log('\nsale lo que se pide');
{
  for (const [nt, c] of [[1, 3], [3, 5], [6, 5], [12, 3]]) {
    const malos = sets(nt, c, 50).filter(x => x.length !== c);
    if (malos.length) fallo(`${nt} tiempos, ${c} consignas → salieron ${malos[0].length}`);
  }
  if (!problemas) ok('el número pedido sale siempre, con uno o con doce tiempos');

  const uno = sacarConsignas({ tiempos: tiemposDe(3), formas: FORMAS, cuantas: 5, azar: azarFijo(1) })[0];
  if (uno.tiempo?.id && uno.sujeto && uno.forma) ok('cada consigna trae tiempo, sujeto y forma');
  else fallo(`una consigna salió como ${JSON.stringify(uno)}`);
  if (uno.tiempo.es && uno.tiempo.en) ok('el tiempo viene entero, no solo su id');
  else fallo('el tiempo llegó sin nombres');
}

console.log('\nlos tiempos van por rondas: ninguno repite mientras quede otro');
{
  let mal = 0;
  for (const [nt, c] of [[3, 5], [5, 5], [6, 5], [2, 3], [4, 3]]) {
    for (const set of sets(nt, c)) {
      const cuenta = {};
      set.forEach(x => { cuenta[x.tiempo.id] = (cuenta[x.tiempo.id] || 0) + 1; });
      /* Con `c` consignas y `nt` tiempos, ninguno puede salir más de ceil(c/nt). */
      const tope = Math.ceil(c / nt);
      const pasado = Object.entries(cuenta).find(([, k]) => k > tope);
      if (pasado) { fallo(`${nt} tiempos, ${c} consignas: ${pasado[0]} salió ${pasado[1]} veces (tope ${tope})`); mal++; break; }
    }
  }
  if (!mal) ok('en 1000 sets, ningún tiempo se repite teniendo otro sin salir');

  /* El caso concreto: tres tiempos y cinco consignas tienen que dar 3 + 2. */
  const repartos = new Set(sets(3, 5).map(set => {
    const c = {};
    set.forEach(x => { c[x.tiempo.id] = (c[x.tiempo.id] || 0) + 1; });
    return Object.values(c).sort((a, b) => b - a).join('+');
  }));
  if (repartos.size === 1 && repartos.has('2+2+1')) ok('tres tiempos y cinco consignas → siempre 2+2+1, nunca 5 del mismo');
  else fallo(`tres tiempos dieron repartos ${[...repartos].join(', ')}`);
}

console.log('\nlas tres formas aparecen: un set todo en afirmativa hace creer que se sabe');
{
  const sinLasTres = sets(5, 5).filter(set => new Set(set.map(x => x.forma)).size < 3);
  if (sinLasTres.length) fallo(`${sinLasTres.length} sets de 200 no traen las tres formas`);
  else ok('con cinco consignas, las tres formas salen siempre');

  const soloUna = sets(5, 5).filter(set => new Set(set.map(x => x.forma)).size === 1);
  if (soloUna.length) fallo('hay sets con una sola forma');
  else ok('ningún set sale entero en afirmativa');

  const tres = sets(5, 3).filter(set => new Set(set.map(x => x.forma)).size < 3);
  if (tres.length) fallo(`${tres.length} sets de tres consignas no traen las tres formas`);
  else ok('con tres consignas también salen las tres: es el mínimo que las cabe');
}

console.log('\nsiempre hay una tercera persona del singular');
{
  const sin = sets(5, 5).filter(set => !set.some(x => TERCERA.includes(x.sujeto)));
  if (sin.length) fallo(`${sin.length} sets de 200 esquivan la -s, el does y el is`);
  else ok('en 200 sets de cinco, ninguno se queda sin he/she/it');

  const sin3 = sets(5, 3).filter(set => !set.some(x => TERCERA.includes(x.sujeto)));
  if (sin3.length) fallo(`${sin3.length} sets de tres se quedan sin tercera persona`);
  else ok('y con tres consignas tampoco');

  /* Que la regla no aplaste la variedad: si SIEMPRE saliera la misma tercera
     persona, o si el set fuera siempre tercera persona, estaríamos arreglando
     un problema creando otro. */
  const terceras = new Set(sets(5, 5).flatMap(set => set.map(x => x.sujeto)).filter(s => TERCERA.includes(s)));
  if (terceras.size === 3) ok('salen las tres (he, she, it), no siempre la misma');
  else fallo(`solo aparecen ${[...terceras].join(', ')}`);

  const todos = new Set(sets(5, 5).flatMap(set => set.map(x => x.sujeto)));
  if (todos.size === SUJETOS.length) ok('y los siete sujetos siguen saliendo: la regla no aplasta la variedad');
  else fallo(`solo salieron ${todos.size} de ${SUJETOS.length} sujetos`);
}

console.log('\nningún sujeto dos veces seguidas');
{
  const pegados = sets(5, 5).filter(set => set.some((x, i) => i > 0 && set[i - 1].sujeto === x.sujeto));
  if (pegados.length) fallo(`${pegados.length} sets traen el mismo sujeto pegado`);
  else ok('en 200 sets, ninguno repite sujeto en consignas contiguas');

  const p3 = sets(5, 3).filter(set => set.some((x, i) => i > 0 && set[i - 1].sujeto === x.sujeto));
  if (p3.length) fallo(`${p3.length} sets de tres traen el sujeto pegado — ¿lo rompió forzar la tercera persona?`);
  else ok('tampoco al forzar la tercera persona, que es donde podría colarse');
}

console.log('\nlos bordes no revientan');
{
  const casos = [
    [{}, 'sin nada'],
    [{ tiempos: [], formas: FORMAS }, 'sin tiempos'],
    [{ tiempos: tiemposDe(3), formas: [] }, 'sin formas'],
    [{ tiempos: tiemposDe(3), formas: FORMAS, cuantas: 0 }, 'cero consignas'],
    [{ tiempos: tiemposDe(3), formas: FORMAS, cuantas: -4 }, 'consignas negativas'],
    [{ tiempos: tiemposDe(3), formas: FORMAS, cuantas: 999 }, 'consignas de más'],
  ];
  for (const [args, que] of casos) {
    try {
      const r = sacarConsignas({ ...args, azar: azarFijo(7) });
      if (!Array.isArray(r)) fallo(`${que} no devolvió un array`);
      else if (r.length > 10) fallo(`${que} devolvió ${r.length}: sin tope`);
      else ok(`${que} → ${r.length} consignas, sin reventar`);
    } catch (e) { fallo(`${que} lanzó ${e.message}`); }
  }

  /* Un solo tiempo es un curso de primera semana: tiene que funcionar igual,
     repitiéndolo, porque no hay otra cosa que sacar. */
  const solo = sacarConsignas({ tiempos: tiemposDe(1), formas: FORMAS, cuantas: 5, azar: azarFijo(3) });
  if (solo.length === 5 && new Set(solo.map(x => x.forma)).size === 3) {
    ok('con un solo tiempo visto, se repite el tiempo pero las formas siguen variando');
  } else fallo('un solo tiempo dio un set degenerado');
}

console.log(problemas ? `\n✗ ${problemas} problema(s)` : '\nAPUESTA OK');
process.exit(problemas ? 1 : 0);
