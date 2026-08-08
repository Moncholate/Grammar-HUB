/* ============================================================================
   Área 11 · Tu evaluación                            ids 1100-1128 · 28 ítems
   ----------------------------------------------------------------------------
   Derivada de las RÚBRICAS REALES de writing y speaking del curso. Es la única
   área que habla de la evaluación del alumno y no de un estándar internacional.
   Documentación completa, con las tablas y la aritmética: banco-rubricas-duoc.md

   REGLA QUE GOBIERNA EL ÁREA — la rúbrica sirve para revelar lo que el alumno
   subestima, nunca para contradecir una buena práctica. Estas rúbricas tienen
   partes mal diseñadas (penalizan las autocorrecciones; piden cero errores en
   el oral de intermedio alto) y un docente con criterio no las aplica a
   rajatabla. Donde chocan, gana la pedagogía y el ítem no se escribe.

   CADUCAN. A diferencia de Krashen o Bjork, cada número aquí está atado a un
   documento que la institución puede cambiar. Si cambian los umbrales de
   palabras o los tramos de error, recalcular 1101, 1105, 1109 y 1113.
   ========================================================================== */
export default [
  /* ── A · Cómo se reparten los puntos ───────────────────────────────── */
  { id: 1100, tramo: 2, tag: 'rubrica_pesos',
    es: 'Tu prueba escrita reparte 12 puntos: 4 por extensión y coherencia, 3 por vocabulario, 3 por gramática y 2 por ortografía. La gramática es un cuarto de la nota, no toda.',
    source: 'Rúbrica de writing del curso' },

  { id: 1101, tramo: 2, tag: 'rubrica_extension',
    es: 'Escribir suficiente vale más que escribir perfecto. En básico, 40 palabras con 3 errores dan 6,4 puntos; 25 palabras impecables dan 5,4.',
    source: 'Rúbrica de writing, nivel básico (extensión 4,0 + gramática 2,4 = 6,4 · extensión 2,4 + gramática 3,0 = 5,4)' },

  { id: 1102, tramo: 2, tag: 'rubrica_extension',
    es: 'La extensión es el único criterio que puedes asegurar antes de entrar a la prueba: ya sabes cuántas palabras te piden. Practica llegar a esa cifra.',
    source: 'Rúbrica de writing, umbrales del 100%: básico 40 · elemental 60 · intermedio 80 · intermedio alto 100' },

  { id: 1103, tramo: 2, tag: 'rubrica_extension',
    es: 'Llegar al número de palabras no es rellenar. Repetir la misma idea con otras palabras no suma extensión: suma incoherencia, que se evalúa en el mismo criterio.',
    source: 'Rúbrica de writing, el criterio es “coherencia y extensión”, las dos cosas juntas' },

  /* ── B · El conteo de errores ──────────────────────────────────────── */
  { id: 1105, tramo: 2, tag: 'rubrica_conteo',
    es: 'Empieza por los errores fáciles. En tu rúbrica cada error suma al conteo, así que el descuido más tonto te cuesta lo mismo que el más difícil de arreglar.',
    source: 'Rúbrica de writing y speaking, criterio de gramática por número de casos' },

  { id: 1106, tramo: 2, tag: 'rubrica_conteo',
    es: 'Corregir UN error puede valer hasta 0,9 puntos. Pasar de 6 errores a 5 te sube de 0,9 a 1,8 en gramática. Un error, casi un punto.',
    source: 'Rúbrica de writing, tramos de gramática (6-7 errores = 30%, 4-5 = 60%)' },

  { id: 1107, tramo: 2, tag: 'rubrica_conteo',
    es: 'Gramática y ortografía suman 5 de los 12 puntos, y las dos se califican contando. El 42% de tu nota es literalmente cuántos errores se te pasaron.',
    source: 'Rúbrica de writing (gramática 3 pts + ortografía 2 pts)' },

  { id: 1108, tramo: 2, tag: 'rubrica_conteo',
    es: 'Un error sistemático te cuesta más que uno aislado, pero no porque pese más: porque aparece muchas veces y cada aparición se cuenta por separado.',
    source: 'Rúbrica de writing, criterio de gramática por número de casos' },

  { id: 1109, tramo: 2, tag: 'rubrica_prioridad', estructura: 'present_simple', nivel: 'basico1',
    es: 'Olvidar la -s de tercera persona es el error más barato de eliminar que tienes. Con una rúbrica que cuenta, los errores fáciles son el mejor negocio.',
    source: 'Rúbrica de writing (conteo) + Swan & Smith (2001) sobre la -s como error de transferencia frecuente' },

  /* ── C · Los tres minutos de revisión ──────────────────────────────── */
  { id: 1110, tramo: 2, tag: 'rubrica_revision',
    es: 'Tres minutos de revisión pueden valer un punto entero: dos faltas de ortografía y un error de gramática menos suman 1,0 en tu rúbrica.',
    source: 'Rúbrica de writing (ortografía de 5 a 3 errores = +0,4 · gramática de 4 a 3 = +0,6)' },

  { id: 1111, tramo: 2, tag: 'rubrica_ortografia',
    es: 'La ortografía es un criterio propio de 2 puntos, no un detalle. Con 3 faltas ya bajaste del 100%. Revísala aparte de la gramática, en otra pasada.',
    source: 'Rúbrica de writing, máximo 2 errores ortográficos para el 100%' },

  { id: 1112, tramo: 2, tag: 'rubrica_revision',
    es: 'Revisa buscando un solo tipo de error por pasada. Tu rúbrica separa gramática de ortografía; revísalas separadas tú también.',
    source: 'Rúbrica de writing (criterios independientes) + literatura sobre autoedición y carga cognitiva' },

  /* ── D · El vocabulario es una lista, no una impresión ─────────────── */
  { id: 1113, tramo: 2, tag: 'rubrica_vocabulario', estructura: 'vocabulary',
    es: 'El vocabulario no se evalúa “a ojo”: se cuentan las palabras de la unidad que usaste bien. En básico son 6 para el 100%.',
    source: 'Rúbrica de writing y speaking, criterio de vocabulario' },

  { id: 1114, tramo: 2, tag: 'rubrica_vocabulario', estructura: 'vocabulary',
    es: 'Pasar de 4 a 6 palabras de la unidad sube 1,2 puntos sin escribir mejor inglés. Es el único criterio que puedes subir eligiendo qué palabras usar.',
    source: 'Rúbrica de writing, criterio de vocabulario, nivel básico (1,8 → 3,0)' },

  { id: 1115, tramo: 2, tag: 'rubrica_vocabulario', estructura: 'vocabulary',
    es: 'Antes de la prueba, anota 8 palabras de la unidad y úsalas. El criterio dice “vocabulario aprendido”: se refiere al del curso, no a cualquiera que sepas.',
    source: 'Rúbrica de writing y speaking, redacción del criterio de vocabulario' },

  { id: 1116, tramo: 3, tag: 'rubrica_vocabulario', estructura: 'vocabulary', nivel: 'avanzado',
    es: 'En intermedio alto la vara del vocabulario sube a 10 palabras para el 100%. Es el único criterio que cambia de exigencia entre niveles en el escrito.',
    source: 'Rúbrica de writing, criterio de vocabulario, nivel intermedio alto' },

  /* ── E · Oral ───────────────────────────────────────────────────────── */
  { id: 1120, tramo: 1, tag: 'rubrica_oral',
    es: 'Si te equivocas hablando, corrígete y sigue. Darte cuenta del error mientras hablas es control del idioma, no debilidad: es la señal de que te estás escuchando.',
    source: 'MCER, monitorear y reparar es parte de la competencia estratégica' },

  { id: 1121, tramo: 2, tag: 'rubrica_oral',
    es: 'Si en la prueba no te sale la estructura compleja, dila simple y sigue adelante. Trabarte cuesta más que simplificar. Guárdate el riesgo para practicar, no para el examen.',
    source: 'MCER, estrategias de compensación; rúbrica de speaking (coherencia y fluidez, 4 puntos)' },

  { id: 1122, tramo: 2, tag: 'rubrica_oral',
    es: 'Coherencia y fluidez valen 4 puntos en el oral; la gramática, 3. Trabarte buscando la forma perfecta te cuesta más que decirlo con un error.',
    source: 'Rúbrica de speaking, distribución de puntajes' },

  { id: 1123, tramo: 1, tag: 'rubrica_oral',
    es: 'En el oral no se espera que hables perfecto. Ni los hablantes nativos hablan sin repetirse, corregirse ni empezar de nuevo. Se espera que se entienda lo que dices.',
    source: 'MCER, descriptores de precisión gramatical; literatura sobre disfluencias y auto-reparación en habla espontánea nativa' },

  /* ── F · Responder lo que se pregunta ──────────────────────────────── */
  { id: 1130, tramo: 1, tag: 'rubrica_coherencia', estructura: 'wh_questions', nivel: 'basico1',
    es: 'Antes de responder, subraya la palabra con que empieza la pregunta. What, when, where, how much, how old: cada una pide un dato distinto y solo ese.',
    en: 'How old are you? → una edad.   What time is it? → una hora.',
    source: 'Rúbrica de writing y speaking, criterio de coherencia con el estímulo' },

  { id: 1131, tramo: 1, tag: 'rubrica_coherencia',
    es: 'Cuenta cuántas cosas te pide el enunciado antes de escribir. Si son tres, tu texto necesita tres respuestas. Es el error más caro de la prueba y el más fácil de evitar.',
    source: 'Rúbrica de writing, “presentando todas las ideas requeridas” es parte del criterio de 4 puntos' },

  { id: 1132, tramo: 1, tag: 'rubrica_coherencia', estructura: 'questions_do', nivel: 'basico1',
    es: 'Fíjate si la pregunta es abierta o cerrada. Si dice “and explain why” o “give details”, un “Yes, I do” no alcanza: pierdes en coherencia, no en gramática.',
    source: 'Rúbrica de writing y speaking, cobertura de los temas requeridos' },

  { id: 1133, tramo: 1, tag: 'rubrica_coherencia',
    es: 'Responder muy bien una pregunta que no te hicieron vale cero. La coherencia con el enunciado pesa 4 de 12 puntos, más que la gramática.',
    source: 'Rúbrica de writing y speaking, distribución de puntajes' },

  { id: 1134, tramo: 1, tag: 'rubrica_coherencia',
    es: 'Al terminar, vuelve al enunciado y marca cada cosa que pedía. Lo que quede sin marcar son los puntos que ibas a perder sin darte cuenta.',
    source: 'Rúbrica de writing (cobertura de los temas requeridos) + Zimmerman (2002), automonitoreo' },

  { id: 1135, tramo: 1, tag: 'rubrica_coherencia', estructura: 'wh_questions', nivel: 'basico1',
    es: 'Si dudas de qué te están preguntando, la pregunta misma te lo dice. Desarma el enunciado antes de contestarlo: primero entiéndelo, después responde.',
    source: 'Rúbrica de writing y speaking, criterio de coherencia' },

  /* ── G · Cierre ─────────────────────────────────────────────────────── */
  { id: 1140, tramo: 2, tag: 'rubrica_meta',
    es: 'Lee tu rúbrica antes de estudiar, no después de la nota. La tuya trae números exactos: cuántas palabras, cuántos errores y cuánto vale cada tramo.',
    source: 'Rúbricas del curso' },

  { id: 1141, tramo: 2, tag: 'rubrica_meta',
    es: 'Saber cómo te evalúan no es hacer trampa: es dejar de adivinar. La rúbrica es pública justamente para eso.',
    source: 'Buenas prácticas de evaluación transparente' },
];
