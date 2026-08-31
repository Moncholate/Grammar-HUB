/* ============================================================================
   LA APUESTA · el sorteo de las consignas
   ----------------------------------------------------------------------------
   Cinco consignas —tiempo, sujeto y forma— para que el curso escriba cinco
   oraciones, y después apueste cuántas cree tener bien antes de corregir.

   ESTO NO ES EL DADO CINCO VECES. Un dado tirado cinco veces puede sacar cinco
   veces el mismo tiempo, o las cinco en afirmativa, y entonces la apuesta deja
   de medir nada: el alumno acierta o falla en bloque y no aprende dónde estaba
   flojo. Un set sirve si REPARTE, y repartir es lo que hace este archivo.

   TRES REGLAS, y las tres salen de lo que se quiere medir:

     · TIEMPOS POR RONDAS. No se repite ninguno hasta que salieron todos. Con
       tres tiempos vistos y cinco consignas, salen 3 + 2 y no 5 del mismo.
     · LAS TRES FORMAS. Igual: barajadas por rondas, así que con cinco consignas
       aparecen las tres seguro. Cinco afirmativas serían un set fácil que hace
       creer que se sabe.
     · AL MENOS UNA TERCERA PERSONA DEL SINGULAR. Es donde vive la mitad de la
       dificultad del inglés —la -s, el does, el is— y un set sin ninguna deja
       fuera justo lo que más se falla. Es la única regla que no es de reparto
       sino de contenido, y por eso está escrita aparte.

   Y ningún sujeto dos veces seguidas: dos «they» pegados se leen como un error
   de la herramienta aunque no lo sean.

   Este archivo es PURO —ni React ni DOM, y ni siquiera importa el currículo o
   las formas: se le pasan— para poder probarlo con listas de mentira:
   `tools/check-apuesta.mjs`.
   ========================================================================== */

/** Los siete, como en el dado. */
export const SUJETOS = ['I', 'you', 'he', 'she', 'it', 'we', 'they'];

/** Donde vive la dificultad: la -s, el does, el is. */
export const TERCERA = ['he', 'she', 'it'];

export const CUANTAS = [3, 5];

/** Baraja una copia (Fisher-Yates). `azar` se inyecta para poder probarlo. */
const barajar = (lista, azar) => {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * `n` elementos de `lista` por rondas: se baraja entera, se reparte, y solo
 * cuando se agotó se vuelve a barajar. Es lo que garantiza que nada se repita
 * mientras quede algo sin salir.
 */
const porRondas = (lista, n, azar) => {
  const out = [];
  while (out.length < n) out.push(...barajar(lista, azar).slice(0, n - out.length));
  return out;
};

/**
 * El set de consignas.
 * `tiempos` y `formas` se pasan desde fuera —el currículo y design-tokens viven
 * en módulos que Node no puede cargar en una sonda— y cada consigna sale con el
 * objeto del tiempo entero, para que la pantalla no tenga que volver a buscarlo.
 */
export const sacarConsignas = ({ tiempos = [], formas = [], cuantas = 5, azar = Math.random } = {}) => {
  if (!tiempos.length || !formas.length) return [];
  const n = Math.max(1, Math.min(10, Math.floor(cuantas) || 5));

  const ts = porRondas(tiempos, n, azar);
  const fs = porRondas(formas, n, azar);

  /* Sujetos al azar, pero nunca el mismo dos veces seguidas. */
  const ss = [];
  for (let i = 0; i < n; i++) {
    const opciones = SUJETOS.filter(s => s !== ss[i - 1]);
    ss.push(opciones[Math.floor(azar() * opciones.length)]);
  }

  /* Y si no salió ninguna tercera persona, se fuerza una. Se elige entre las
     que no chocan con los vecinos, que siempre hay al menos una: TERCERA tiene
     tres y los vecinos son como mucho dos. */
  if (n >= 3 && !ss.some(s => TERCERA.includes(s))) {
    const i = Math.floor(azar() * n);
    const libres = TERCERA.filter(s => s !== ss[i - 1] && s !== ss[i + 1]);
    ss[i] = libres[Math.floor(azar() * libres.length)];
  }

  return ts.map((tiempo, i) => ({ tiempo, sujeto: ss[i], forma: fs[i] }));
};
