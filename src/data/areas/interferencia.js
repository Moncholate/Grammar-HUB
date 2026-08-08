/* ============================================================================
   Área 2 · Español vs inglés                          ids 200-299 · 63 ítems
   ----------------------------------------------------------------------------
   Los errores más sistemáticos de un hispanohablante aprendiendo inglés. Fuente
   base de toda el área: Swan, M. & Smith, B. (2001), "Learner English: A
   Teacher's Guide to Interference and Other Problems" (2ª ed.), Cambridge
   University Press, capítulo "Spanish speakers".

   REGLAS DE ROTACIÓN (acordadas con el docente, se aplican en dailyPhrase.js):
   · NUNCA en el tramo de entrada. "Si nos centramos en errores, pierde su
     sentido el mensaje del día."
   · Máximo 1 de cada 3, y nunca dos seguidas.
   · Nunca adyacente a un ítem de ética de IA: "este error cometes" seguido de
     "no copies" se lee como sospecha, no como enseñanza.

   FORMATO ❌/✅ — el par va en `mal` y `bien`. La tarjeta muestra SIEMPRE el ✅
   grande y primero, el ❌ chico y debajo. Nunca el error solo: el alumno se
   lleva la forma que vio con más peso visual.

   CUATRO CORRECCIONES DE CONTENIDO respecto del documento original:
   · E2 (id 240) afirmaba que el presente continuo NO se usa para el futuro.
     Es falso —"I'm meeting Ana tomorrow" es correcto y el propio temario lo
     enseña en AEF 3 unidad 1B— y además contradecía su propio ejemplo, que es
     un error de presente SIMPLE. Reescrito con el ejemplo intacto.
   · E8 (id 246) decía "'To be' + edad no existe en inglés: se usa 'to be'".
     Se mordía la cola. Es 'tener' + edad lo que no existe.
   · H2 (id 271) marcaba con ❌ "To study English is important", que es
     gramatical, solo menos natural. Un ❌ ahí enseña algo falso.
   · F3 (id 252) usaba ❌ "the English", que es válido (= los ingleses). Se
     cambia por el ejemplo del idioma.

   NIVELES: se gatean solo las estructuras que el alumno todavía no ha visto
   (present perfect, for/since, going to, condicionales, preguntas indirectas).
   Las correcciones sobre lo básico van sin filtro a propósito: los errores de
   transferencia persisten hasta niveles avanzados, y ocultarlas sería asumir
   que lo básico ya está resuelto.
   ========================================================================== */
const SWAN = 'Swan & Smith (2001), Learner English, cap. “Spanish speakers”, Cambridge University Press';

export default [
  /* ── A · Sujeto y pronombres ───────────────────────────────────────── */
  { id: 200, tramo: 2, tag: 'transfer_sujeto', estructura: 'subject_pronouns',
    es: 'En español puedes decir “Llueve”. En inglés SIEMPRE necesitas un sujeto. El inglés no deja huecos.',
    mal: 'Is raining.', bien: 'It is raining.', source: SWAN },

  { id: 201, tramo: 2, tag: 'transfer_sujeto', estructura: 'dummy_it',
    es: 'Ese “it” que parece no significar nada es obligatorio. Cuida el clima, la hora y las distancias.',
    mal: "Is 5 o'clock.", bien: "It's 5 o'clock.", source: SWAN },

  { id: 202, tramo: 2, tag: 'transfer_sujeto', estructura: 'there_is_are',
    es: '“There is / There are” es el equivalente de “hay”. Ojo: “It has” NO significa “hay”.',
    mal: 'It has many students.', bien: 'There are many students.', source: SWAN },

  { id: 203, tramo: 2, tag: 'transfer_sujeto', estructura: 'subject_pronouns',
    es: 'En inglés el sujeto no se repite ni se omite: una sola vez, siempre presente.',
    mal: 'My sister she works here.', bien: 'My sister works here.', source: SWAN },

  { id: 204, tramo: 3, tag: 'transfer_dato', estructura: 'pronouns',
    es: 'Los pronombres están entre los errores más frecuentes de los hispanohablantes. Vale la pena revisarlos siempre.',
    source: 'Gonzalez-Torres et al. (2025), International Journal of Learning, Teaching and Educational Research: estudio con 180 estudiantes ecuatorianos' },

  /* ── B · Orden de palabras ─────────────────────────────────────────── */
  { id: 210, tramo: 2, tag: 'transfer_orden', estructura: 'adjective_order',
    es: 'En inglés el adjetivo va ANTES del sustantivo. Siempre. “Un auto rojo” se da vuelta.',
    mal: 'a car red', bien: 'a red car', source: SWAN },

  { id: 211, tramo: 2, tag: 'transfer_orden', estructura: 'adjectives',
    es: 'Los adjetivos en inglés no llevan plural: “reds cars” no existe.',
    mal: 'two reds cars', bien: 'two red cars', source: SWAN },

  { id: 212, tramo: 2, tag: 'transfer_orden', estructura: 'word_order',
    es: 'El orden básico del inglés es rígido: Sujeto + Verbo + Objeto. El español permite mover cosas; el inglés no.',
    mal: 'Likes my mother the coffee.', bien: 'My mother likes coffee.', source: SWAN },

  { id: 213, tramo: 2, tag: 'transfer_orden', estructura: 'adverb_placement',
    es: 'No metas nada entre el verbo y su objeto directo. Ni siquiera un adverbio.',
    mal: 'I speak well English.', bien: 'I speak English well.', source: SWAN },

  { id: 214, tramo: 2, tag: 'transfer_orden', estructura: 'adverb_frequency',
    es: 'Los adverbios de frecuencia van antes del verbo principal, pero después de “be”.',
    bien: 'I always study.  ·  I am always tired.', source: SWAN },

  /* ── C · Auxiliares y preguntas ────────────────────────────────────── */
  { id: 220, tramo: 2, tag: 'transfer_auxiliar', estructura: 'questions_do',
    es: 'En español preguntas con el tono de voz. En inglés necesitas un auxiliar: do, does, did.',
    mal: 'You like coffee?', bien: 'Do you like coffee?', source: SWAN },

  { id: 221, tramo: 2, tag: 'transfer_auxiliar', estructura: 'questions_do',
    es: 'Si ya usaste “does” o “did”, el verbo principal va en forma base. El auxiliar se lleva la marca.',
    mal: 'Did you went?', bien: 'Did you go?', source: SWAN },

  { id: 222, tramo: 2, tag: 'transfer_auxiliar', estructura: 'questions_be',
    es: 'Con el verbo “be” NO se usa “do”. Se invierte y listo.',
    mal: 'Do you are ready?', bien: 'Are you ready?', source: SWAN },

  { id: 223, tramo: 2, tag: 'transfer_auxiliar', estructura: 'wh_questions',
    es: 'En preguntas con palabra interrogativa, el auxiliar va después.',
    mal: 'Where you live?', bien: 'Where do you live?', source: SWAN },

  { id: 224, tramo: 2, tag: 'transfer_auxiliar', estructura: 'indirect_questions', nivel: 'intermedio1',
    es: 'En preguntas indirectas NO se invierte. Vuelve al orden normal.',
    mal: "I don't know where is he.", bien: "I don't know where he is.", source: SWAN },

  { id: 225, tramo: 2, tag: 'transfer_auxiliar', estructura: 'short_answers',
    es: 'Las respuestas cortas usan el auxiliar, no el verbo completo.',
    mal: 'Yes, I like.', bien: 'Yes, I do.', source: SWAN },

  /* ── D · Negación ──────────────────────────────────────────────────── */
  { id: 230, tramo: 2, tag: 'transfer_negacion', estructura: 'negation',
    es: 'En español la doble negación es correcta (“no sé nada”). En inglés estándar, una sola negación por frase.',
    mal: "I don't know nothing.", bien: "I don't know anything.", source: SWAN },

  { id: 231, tramo: 2, tag: 'transfer_negacion', estructura: 'negation',
    es: 'Para negar en presente y pasado necesitas “don’t / doesn’t / didn’t”. El “no” suelto no funciona.',
    mal: 'I no understand.', bien: "I don't understand.", source: SWAN },

  { id: 232, tramo: 2, tag: 'transfer_negacion', estructura: 'negation',
    es: 'Con “never” no agregues otra negación: ya es negativo por sí solo.',
    mal: "I don't never go.", bien: 'I never go.', source: SWAN },

  /* ── E · Tiempos verbales ──────────────────────────────────────────── */
  { id: 240, tramo: 2, tag: 'transfer_verbo', estructura: 'future_forms', nivel: 'elemental2',
    es: 'En español el presente sirve para hablar del futuro (“Mañana estudio”). En inglés no: usa “going to” o el presente continuo.',
    mal: 'I study tomorrow.', bien: "I'm going to study tomorrow.", source: SWAN },

  { id: 241, tramo: 2, tag: 'transfer_verbo', estructura: 'present_simple',
    es: 'La -s de tercera persona singular es pequeña pero obligatoria. He works, she lives, it rains.',
    mal: 'He work here.', bien: 'He works here.', source: SWAN },

  { id: 242, tramo: 2, tag: 'transfer_verbo', estructura: 'stative_verbs', nivel: 'basico2',
    es: 'Verbos de estado (know, like, want, need) no van en continuo, aunque en español suene natural.',
    mal: 'I am knowing him.', bien: 'I know him.', source: SWAN },

  { id: 243, tramo: 2, tag: 'transfer_verbo', estructura: 'present_perfect', nivel: 'elemental2',
    es: 'El present perfect inglés NO equivale al pretérito perfecto español. Si dices CUÁNDO pasó, usa past simple.',
    mal: 'I have seen her yesterday.', bien: 'I saw her yesterday.', source: SWAN },

  { id: 244, tramo: 2, tag: 'transfer_verbo', estructura: 'present_perfect', nivel: 'elemental2',
    es: 'Para algo que empezó en el pasado y sigue hoy, el inglés usa present perfect, no presente.',
    mal: 'I live here since 2020.', bien: 'I have lived here since 2020.', source: SWAN },

  { id: 245, tramo: 2, tag: 'transfer_verbo', estructura: 'for_since', nivel: 'intermedio2',
    es: '“For” mide duración; “since” marca el punto de partida.',
    mal: 'since three years', bien: 'for three years  ·  since 2020', source: SWAN },

  { id: 246, tramo: 2, tag: 'transfer_verbo', estructura: 'be_expressions',
    es: '“Tener” + edad no existe en inglés. La edad va con “to be”.',
    mal: 'I have 20 years.', bien: 'I am 20 years old.', source: SWAN },

  { id: 247, tramo: 2, tag: 'transfer_verbo', estructura: 'be_expressions',
    es: 'Frío, calor, hambre, sueño, razón: en inglés todos van con “to be”, no con “to have”.',
    mal: 'I have cold.', bien: 'I am cold.', source: SWAN },

  { id: 248, tramo: 2, tag: 'transfer_verbo', estructura: 'modals', nivel: 'basico2',
    es: 'Los modales (can, must, should) no llevan “to” después ni -s en tercera persona.',
    mal: 'She cans to swim.', bien: 'She can swim.', source: SWAN },

  { id: 249, tramo: 3, tag: 'transfer_verbo', estructura: 'conditionals', nivel: 'intermedio2',
    es: 'Después de “if” en condicionales de tipo 1, usa presente, no futuro.',
    mal: 'If it will rain, I’ll stay.', bien: 'If it rains, I’ll stay.', source: SWAN },

  { id: 250, tramo: 3, tag: 'transfer_verbo', estructura: 'past_simple', nivel: 'basico2',
    es: 'El inglés usa el pasado simple mucho más que el español. Ante la duda en una narración, usa past simple.',
    source: SWAN },

  /* ── F · Artículos y determinantes ─────────────────────────────────── */
  { id: 251, tramo: 2, tag: 'transfer_articulo', estructura: 'articles',
    es: 'Para hablar en general, el inglés NO usa artículo. “Me gusta la música” pierde el “la”.',
    mal: 'I like the music.', bien: 'I like music.', source: SWAN },

  { id: 252, tramo: 2, tag: 'transfer_articulo', estructura: 'articles',
    es: 'Los sustantivos contables en singular siempre necesitan artículo: “a”, “an” o “the”.',
    mal: 'I am teacher.', bien: 'I am a teacher.', source: SWAN },

  { id: 253, tramo: 2, tag: 'transfer_articulo', estructura: 'articles',
    es: 'Idiomas, países y días de la semana van sin “the”.',
    mal: 'I speak the English.', bien: 'I speak English.', source: SWAN },

  { id: 254, tramo: 3, tag: 'transfer_dato', estructura: 'articles',
    es: 'Los errores de artículos y determinantes son los más frecuentes en la escritura de adultos hispanohablantes. Revísalos antes de entregar.',
    source: 'Estudio de corpus de escritura EFL adulta (Universidad Nebrija); confirmado en Gonzalez-Torres et al. (2025), IJLTER' },

  { id: 255, tramo: 2, tag: 'transfer_concordancia', estructura: 'agreement',
    es: '“People” es plural en inglés.',
    mal: 'People is nice.', bien: 'People are nice.', source: SWAN },

  { id: 256, tramo: 2, tag: 'transfer_concordancia', estructura: 'countable_uncountable',
    es: 'Information, advice, furniture y homework son incontables en inglés: no llevan -s ni “a”.',
    mal: 'many informations', bien: 'a lot of information', source: SWAN },

  { id: 257, tramo: 2, tag: 'transfer_posesivo', estructura: 'possessive_s',
    es: 'El posesivo con ’s va al revés del español: “la casa de Ana” se da vuelta.',
    mal: 'the house of Ana', bien: "Ana's house", source: SWAN },

  { id: 258, tramo: 2, tag: 'transfer_posesivo', estructura: 'possessive_adjectives',
    es: 'El posesivo en inglés concuerda con el DUEÑO, no con el objeto poseído.',
    mal: 'Maria and his brother', bien: 'Maria and her brother', source: SWAN },

  /* ── G · Preposiciones ─────────────────────────────────────────────── */
  { id: 260, tramo: 2, tag: 'transfer_preposicion', estructura: 'prepositions',
    es: 'Las preposiciones no se traducen: se aprenden pegadas al verbo.',
    mal: 'depend of', bien: 'depend on', source: SWAN },

  { id: 261, tramo: 2, tag: 'transfer_preposicion', estructura: 'prepositions',
    es: '“Listen” siempre lleva “to” cuando hay objeto.',
    mal: 'I listen music.', bien: 'I listen to music.', source: SWAN },

  { id: 262, tramo: 2, tag: 'transfer_preposicion', estructura: 'prepositions',
    es: 'Casarse es “married TO”, no “married with”. Y enamorarse es “in love WITH”.',
    mal: 'married with', bien: 'married to', source: SWAN },

  { id: 263, tramo: 2, tag: 'transfer_preposicion', estructura: 'prepositions',
    es: '“Think about” es reflexionar; “think of” es tener en mente. Ninguno es “think in”.',
    mal: 'think in', bien: 'think about  ·  think of', source: SWAN },

  { id: 264, tramo: 2, tag: 'transfer_preposicion', estructura: 'prepositions_time',
    es: 'Tiempo: AT para horas, ON para días, IN para meses y años.',
    bien: 'at 5  ·  on Monday  ·  in July', source: SWAN },

  { id: 265, tramo: 2, tag: 'transfer_preposicion', estructura: 'prepositions',
    es: '“Wait FOR”, “look FOR”, “ask FOR”: tres verbos que en español no llevan preposición y en inglés sí.',
    mal: "I'm waiting the bus.", bien: "I'm waiting for the bus.", source: SWAN },

  { id: 266, tramo: 2, tag: 'transfer_preposicion', estructura: 'prepositions',
    es: 'Al revés: “phone”, “answer” y “enter” NO llevan preposición en inglés.',
    mal: 'enter to the room', bien: 'enter the room', source: SWAN },

  { id: 267, tramo: 3, tag: 'transfer_dato', estructura: 'prepositions',
    es: 'Las preposiciones están entre los errores gramaticales más persistentes de los hispanohablantes, incluso en niveles avanzados.',
    source: 'Gonzalez-Torres et al. (2025), IJLTER' },

  /* ── H · Gerundios e infinitivos ───────────────────────────────────── */
  { id: 270, tramo: 2, tag: 'transfer_gerundio', estructura: 'gerund_infinitive',
    es: 'Después de preposición, el verbo va en -ing. Siempre.',
    mal: 'good at speak', bien: 'good at speaking', source: SWAN },

  { id: 271, tramo: 2, tag: 'transfer_gerundio', estructura: 'gerund_infinitive',
    es: 'Cuando el verbo es sujeto de la frase, el gerundio suena mucho más natural que el infinitivo. Las dos formas son correctas, pero una se usa y la otra no.',
    bien: 'Studying English is important.', source: SWAN },

  { id: 272, tramo: 2, tag: 'transfer_gerundio', estructura: 'gerund_infinitive',
    es: 'Enjoy, avoid, finish y practice piden -ing. Want, need y decide piden “to”. Apréndelos en pares.',
    mal: 'I enjoy to read.', bien: 'I enjoy reading.', source: SWAN },

  /* ── I · Falsos amigos ─────────────────────────────────────────────── */
  { id: 280, tramo: 2, tag: 'falso_amigo', estructura: 'false_friends',
    es: '“Actually” NO es “actualmente”. Significa “en realidad”. Para “actualmente” usa “currently”.',
    source: SWAN + ', sección false friends' },

  { id: 281, tramo: 2, tag: 'falso_amigo', estructura: 'false_friends',
    es: '“Embarrassed” es avergonzado, NO embarazada. Embarazada es “pregnant”. Este error cuesta caro.',
    source: SWAN },

  { id: 282, tramo: 2, tag: 'falso_amigo', estructura: 'false_friends',
    es: '“Assist” significa ayudar, no asistir a un lugar. Para asistir usa “attend”.',
    source: SWAN },

  { id: 283, tramo: 2, tag: 'falso_amigo', estructura: 'false_friends',
    es: '“Carpet” es alfombra, no carpeta. Carpeta es “folder”.',
    source: SWAN },

  { id: 284, tramo: 2, tag: 'falso_amigo', estructura: 'false_friends',
    es: '“Realize” es darse cuenta, no realizar. Realizar es “carry out” o “do”.',
    source: SWAN },

  { id: 285, tramo: 2, tag: 'falso_amigo', estructura: 'false_friends',
    es: '“Sensible” significa sensato. Sensible en español es “sensitive”.',
    source: SWAN },

  { id: 286, tramo: 2, tag: 'falso_amigo', estructura: 'false_friends',
    es: '“Library” es biblioteca. Librería es “bookshop” o “bookstore”.',
    source: SWAN },

  { id: 287, tramo: 2, tag: 'falso_amigo', estructura: 'false_friends',
    es: '“Support” es apoyar o soportar peso, pero no “aguantar” algo molesto. Para eso usa “put up with”.',
    source: SWAN },

  /* ── J · Metamensajes: bajan la culpa y abren la serie ─────────────── */
  { id: 290, tramo: 2, tag: 'transfer_meta',
    es: 'Muchos de tus errores en inglés no son descuido: son tu español trabajando de fondo. Reconocerlos es el primer paso.',
    source: 'Swan & Smith (2001), introducción; concepto de interferencia (Lado, 1957)' },

  { id: 291, tramo: 2, tag: 'transfer_meta',
    es: 'Tu español no es un obstáculo: es un mapa. Saber dónde las lenguas NO coinciden acelera el aprendizaje.',
    source: 'Análisis contrastivo (Lado, 1957); Swan & Smith (2001)' },

  { id: 292, tramo: 2, tag: 'transfer_meta',
    es: 'Los errores de transferencia disminuyen a medida que sube tu nivel. Si aún los cometes, vas en camino, no atrasado.',
    source: 'Gonzalez-Torres et al. (2025), IJLTER: hallazgo con 180 aprendices hispanohablantes' },

  { id: 293, tramo: 2, tag: 'transfer_meta',
    es: 'Un error que no notas se fosiliza: se queda contigo para siempre. Por eso conviene atacarlos temprano.',
    source: 'Selinker (1972), “Interlanguage”, IRAL 10(3): concepto de fosilización' },

  { id: 294, tramo: 2, tag: 'transfer_meta',
    es: 'Si traduces palabra por palabra desde el español, la gramática se rompe. Piensa en bloques, no en palabras.',
    source: 'Swan & Smith (2001); Wray (2002), Formulaic Language and the Lexicon' },

  { id: 295, tramo: 3, tag: 'transfer_meta',
    es: 'Las tareas más difíciles generan más errores. Es normal: escribir un texto argumentativo cuesta más que narrar.',
    source: 'Gonzalez-Torres et al. (2025), IJLTER' },
];
