/* ============================================================================
   LA LISTA DE PALABRAS DE UNA ACTIVIDAD
   ----------------------------------------------------------------------------
   Lo que el docente pega para armar un crucigrama o una sopa de letras: una
   palabra por línea, con su pista detrás si quiere darla.

   Vive aparte por lo mismo que `lista.js` —el limpiador de nombres que comparten
   los grupos y la ruleta—: dos versiones del mismo lector terminan leyendo
   distinto, y el día que una acepte la tabulación y la otra no, nadie va a
   entender por qué la misma lista funciona en una actividad y en la otra no.

   DOS FORMAS DE LA MISMA PALABRA, y las dos hacen falta:

     · `palabra` es lo que ocupa casillas: solo letras, en mayúsculas, sin tildes
       ni espacios ni guiones. «ice cream» son ocho casillas seguidas, que es
       como se resuelve en cualquier pasatiempo de papel.
     · `original` es como se escribió, con sus tildes y sus espacios. Es lo que se
       enseña al corregir y lo que se lee en la lista de la hoja: nadie quiere
       leer «ICECREAM» en la lista de palabras a buscar.

   Este archivo es PURO: `tools/check-palabras.mjs`.
   ========================================================================== */

/** Lo mínimo que vale la pena buscar o cruzar. */
export const MIN_LARGO = 2;
/** Tope: más no cabe en una hoja ni en una pizarra. */
export const MAX_PALABRAS = 40;

/* Separadores admitidos entre palabra y pista. La tabulación va primero porque
   es lo que llega al pegar desde una planilla; «=» es lo que se escribe a mano;
   « - » con espacios a los lados para no partir «e-mail». */
const SEPARADOR = /\t|\s+=\s*|\s+[–—-]\s+/;

/** Solo letras, y en mayúsculas: una casilla es una letra. */
export const soloLetras = (s) => String(s == null ? '' : s)
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toUpperCase().replace(/[^A-Z]/g, '');

/**
 * De lo pegado a la lista de entradas.
 * Devuelve también lo DESCARTADO y por qué: si el docente pegó doce palabras y
 * salen diez, tiene que saber cuáles se cayeron y por qué motivo.
 */
export const parsearPalabras = (texto) => {
  const vistas = new Set();
  const fuera = [];
  const lista = [];
  for (const linea of String(texto == null ? '' : texto).split(/\r?\n/)) {
    const limpia = linea.replace(/^\s*\d+\s*[.)\-]\s*/, '').trim();
    if (!limpia) continue;
    const corte = limpia.split(SEPARADOR);
    const original = corte[0].trim();
    const pista = corte.slice(1).join(' ').trim();
    const palabra = soloLetras(original);
    if (palabra.length < MIN_LARGO) { fuera.push({ original: limpia, motivo: 'corta' }); continue; }
    if (vistas.has(palabra)) { fuera.push({ original: limpia, motivo: 'repetida' }); continue; }
    vistas.add(palabra);
    if (lista.length >= MAX_PALABRAS) { fuera.push({ original: limpia, motivo: 'sobran' }); continue; }
    lista.push({ palabra, original, pista });
  }
  return { lista, fuera };
};

/** Baraja una copia (Fisher-Yates). `azar` se inyecta para poder probarlo. */
export const barajar = (lista, azar = Math.random) => {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
