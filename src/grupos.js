/* ============================================================================
   GRUPOS AL AZAR
   ----------------------------------------------------------------------------
   El profesor pega la lista del curso (la que ve en Blackboard Collaborate) y
   la app reparte. Dos modos, porque en clase se piden los dos: «de a cuatro» y
   «cuatro grupos».

   EL PROBLEMA DE VERDAD ERA QUIÉN FALTÓ. Borrar a mano de la lista pegada es
   incómodo y además la rompe: si al rato vuelve a repartir, hay que pegarla
   otra vez. Aquí la lista se pega UNA vez y cada nombre se apaga con un toque;
   apagado sigue estando, pero no entra en el sorteo. Así el caso normal —«hoy
   faltaron tres»— son tres toques y no una edición de texto.

   NO SE GUARDA NADA. Es la regla de las herramientas de clase, dicha por el
   profesor: la lista vive mientras la pestaña esté abierta. Por eso tampoco hay
   «no repetir parejas de la clase pasada»: eso exigiría recordar, y recordar
   nombres de alumnos es justo lo que no se hace.

   Este archivo es PURO —ni React ni DOM— para poder probarlo: `tools/check-grupos.mjs`.
   ========================================================================== */

/* Lo que se limpia de la lista pegada, y solo eso:
     · espacios de sobra y líneas en blanco,
     · la numeración que arrastran algunas listas («1. Ana», «2) Luis»),
     · nombres repetidos.
   NO se tocan las comas: «Morales, Víctor» es un nombre, no dos, y partir por
   comas convertiría media lista en apellidos sueltos. Tampoco se recorta lo que
   va entre paréntesis: no sabemos aún qué añade Blackboard exactamente, y
   quitar a ciegas lo que no se ha visto es inventar una regla. La lista queda a
   la vista en fichas, así que si aparece basura se ve al instante. */
export const parsearNombres = (texto) => {
  const vistos = new Set();
  return String(texto || '')
    .split(/\r?\n/)
    .map(l => l.replace(/^\s*\d+\s*[.)\-]\s*/, '').trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .filter(n => {
      const k = n.toLowerCase();
      if (vistos.has(k)) return false;
      vistos.add(k);
      return true;
    });
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

/**
 * Reparte en grupos.
 *   modo 'porGrupo'  → `n` es cuántos van en cada grupo
 *   modo 'cantidad'  → `n` es cuántos grupos hay
 *
 * En los dos casos el reparto es POR RONDAS, no por trozos seguidos, así que
 * los tamaños nunca se diferencian en más de uno. Eso resuelve solo el caso
 * feo: «de a cuatro» con nueve personas no deja 4+4+1 —alguien trabajando
 * solo— sino 3+3+3.
 */
export const repartir = (nombres, { modo = 'porGrupo', n = 4, azar = Math.random } = {}) => {
  const gente = (nombres || []).filter(Boolean);
  if (!gente.length) return [];
  const tamano = Math.max(1, Math.floor(n) || 1);
  const cuantos = modo === 'cantidad'
    ? Math.min(tamano, gente.length)
    : Math.max(1, Math.ceil(gente.length / tamano));

  const grupos = Array.from({ length: cuantos }, () => []);
  barajar(gente, azar).forEach((nombre, i) => grupos[i % cuantos].push(nombre));
  return grupos;
};
