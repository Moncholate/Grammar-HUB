/* ============================================================================
   Área 4 · Variedades del inglés                      ids 400-449 · 36 ítems
   ----------------------------------------------------------------------------
   Muchos alumnos creen que existe una sola forma correcta de decir cada cosa y
   que cualquier desviación es error. Ese supuesto los paraliza. Aquí se muestra
   que el inglés tiene variantes legítimas en competencia (incluso en gramática)
   y que la meta realista no es sonar nativo sino ser claro y consistente.

   ES EL ÁREA CON MÁS RIESGO DE EFECTO CONTRAPRODUCENTE: si el alumno concluye
   "entonces todo vale", en una evaluación le sale caro. Dos salvaguardas:

   1. Los ítems de LÍMITE (410-415, 424, 425) van en el tramo 2 y los de
      VARIACIÓN en el tramo 3, así que el alumno aprende dónde está la frontera
      ANTES de que le relativicen la norma. El orden importa más que la
      proporción.
   2. Regla de adyacencia en dailyPhrase.js: un ítem de variedades nunca cae
      pegado a uno de evaluación. "Ambas son correctas" y "se evalúa precisión"
      en 48 horas se contradicen.

   El bloque G (bajar la presión del nativo) es la excepción: va al tramo de
   entrada. No relativiza ninguna norma, solo saca de encima el peso de "no
   sueno nativo", que es lo que frena a los alumnos para hablar.

   CORTADO: G1 del documento original, duplicado literal del ítem 102 del banco
   original ("Tu acento cuenta tu historia"), misma fuente Derwing & Munro.
   ========================================================================== */
export default [
  /* ── LÍMITES · van primero, tramo 2 ────────────────────────────────── */
  { id: 410, tramo: 2, tag: 'variedad_examen',
    es: 'Que existan variantes no significa que todo valga. En tu prueba se evalúa la norma del curso.',
    source: 'Criterio de evaluación académica' },

  { id: 411, tramo: 2, tag: 'variedad_examen',
    es: 'Regla práctica: elige una variedad y sé consistente. Eso se evalúa bien en cualquier rúbrica.',
    source: 'Criterio de consistencia en evaluación de escritura' },

  { id: 412, tramo: 2, tag: 'variedad_examen',
    es: 'Sigue la variedad de tu material de clase. Si el libro es británico, escribe británico.',
    source: 'Criterio práctico de alineación curricular' },

  { id: 413, tramo: 2, tag: 'variedad_limite',
    es: 'La variación existe en unos pocos puntos concretos. El 95% de la gramática es igual en todas las variedades.',
    source: 'Gramáticas de referencia: la variación británico-estadounidense afecta un conjunto acotado de estructuras' },

  { id: 414, tramo: 2, tag: 'variedad_limite', estructura: 'negation',
    es: '“I don’t know nothing” no es variedad: es un error en la norma que se te evalúa, aunque lo escuches en canciones.',
    mal: "I don't know nothing.", bien: "I don't know anything.",
    source: 'Distinción entre variedad vernácula y norma estándar evaluada' },

  { id: 415, tramo: 2, tag: 'variedad_examen',
    es: 'Si dudas entre dos formas y ambas son correctas en distintas variedades, elige la que aparece en tu libro. Nunca pierdes.',
    source: 'Criterio práctico' },

  { id: 424, tramo: 2, tag: 'variedad_limite', estructura: 'agreement',
    es: 'Ojo: “people” es plural en todas las variedades. Esa no es una diferencia regional, es una regla.',
    source: 'Swan & Smith (2001)' },

  { id: 425, tramo: 2, tag: 'variedad_limite',
    es: 'No todas las diferencias que escuchas son variedad. Algunas son simplemente errores. Aprende a distinguirlas.',
    source: 'Distinción entre variación legítima y error de aprendiz' },

  /* ── G · Bajar la presión del nativo · tramo de entrada ────────────── */
  { id: 440, tramo: 1, tag: 'variedad_meta',
    es: 'Ser inteligible y ser nativo son cosas distintas. La primera se logra; la segunda casi nunca, y no hace falta.',
    source: 'Derwing & Munro, investigación sobre inteligibilidad; Jenkins (2007)' },

  { id: 441, tramo: 1, tag: 'variedad_meta',
    es: 'Nadie te va a pedir en el trabajo que suenes británico. Te van a pedir que resuelvas la conversación.',
    source: 'Criterio de competencia comunicativa en contextos laborales' },

  { id: 442, tramo: 1, tag: 'variedad_meta',
    es: 'Hablar inglés con acento chileno es lo esperable. Millones de personas lo hablan con acento de algún lugar.',
    source: 'Crystal (2003), English as a Global Language; perfil global de hablantes' },

  { id: 443, tramo: 1, tag: 'variedad_meta',
    es: 'El inglés que aprendes es tan legítimo como cualquier otro. Lo que se evalúa es control, no origen.',
    source: 'Kirkpatrick (2007), World Englishes; criterios de evaluación del MCER' },

  { id: 444, tramo: 2, tag: 'variedad_meta',
    es: 'Los estudiantes que aceptan su acento hablan más. Y hablar más es lo que finalmente mejora la gramática.',
    source: 'MacIntyre et al. (1998), Willingness to Communicate; Swain (1985)' },

  /* ── A · El inglés ya no le pertenece a los nativos ────────────────── */
  { id: 400, tramo: 3, tag: 'variedad_elf',
    es: 'Los hablantes no nativos de inglés superan a los nativos. Las estimaciones más citadas hablan de al menos 3 a 1.',
    source: 'Crystal (2003), English as a Global Language; Graddol (1997), The Future of English?, British Council',
    status: 'debate',
    note: 'Las proporciones exactas varían mucho según la fuente y según qué se cuente como “hablante”: Crystal estimó cerca de 3 a 1 y otras estimaciones llegan a 1 a 4. Por eso dice “al menos” y no una cifra cerrada.' },

  { id: 401, tramo: 3, tag: 'variedad_elf',
    es: 'La mayoría de las conversaciones en inglés del mundo ocurren entre dos personas que no lo tienen como lengua materna.',
    source: 'Seidlhofer (2011); Jenkins (2007), sobre el inglés como lengua franca' },

  { id: 402, tramo: 2, tag: 'variedad_elf',
    es: 'Cuando uses inglés en tu trabajo, lo más probable es que sea con alguien que también lo aprendió. Están en la misma.',
    source: 'Literatura sobre English as a Lingua Franca (Seidlhofer; Jenkins)' },

  { id: 403, tramo: 3, tag: 'variedad_elf',
    es: 'El inglés dejó de tener dueño. Ni Reino Unido ni Estados Unidos definen solos hacia dónde va el idioma.',
    source: 'Crystal (2003); Kirkpatrick (2007), World Englishes, Cambridge University Press' },

  { id: 404, tramo: 1, tag: 'variedad_meta',
    es: 'El objetivo no es sonar nativo. Es ser entendido por gente de todo el mundo. Son metas distintas.',
    source: 'Jenkins (2007); criterio de inteligibilidad en ELF' },

  /* ── B · Present perfect: la diferencia más notoria ────────────────── */
  { id: 405, tramo: 3, tag: 'variedad_gramatica', estructura: 'present_perfect', nivel: 'elemental2',
    es: 'Los británicos prefieren present perfect donde muchos estadounidenses usan past simple. Ambas circulan.',
    bien: "I've just eaten.  ·  I just ate.",
    source: 'Swan, Practical English Usage; Quirk et al.' },

  { id: 406, tramo: 3, tag: 'variedad_gramatica', estructura: 'present_perfect', nivel: 'elemental2',
    es: 'Con “already”, “yet” y “just”, el inglés británico tiende al present perfect y el estadounidense acepta el past simple.',
    source: 'Swan, Practical English Usage' },

  { id: 407, tramo: 2, tag: 'variedad_examen', estructura: 'present_perfect', nivel: 'elemental2',
    es: 'Si tu curso trabaja con material británico, sigue la norma británica en las pruebas. La coherencia con el material es lo que se evalúa.',
    source: 'Criterio práctico de evaluación' },

  { id: 408, tramo: 3, tag: 'variedad_gramatica', estructura: 'have_got',
    es: '“Have you got a pen?” es más británico; “Do you have a pen?” es más estadounidense y hoy funciona en todas partes.',
    source: 'Swan, Practical English Usage' },

  { id: 409, tramo: 2, tag: 'variedad_examen', estructura: 'have_got',
    es: 'En duda, “do you have” es la opción más segura: se entiende y se acepta en cualquier variedad.',
    bien: 'Do you have a pen?',
    source: 'Uso general documentado en gramáticas de referencia' },

  /* ── C · Formas que compiten ───────────────────────────────────────── */
  { id: 416, tramo: 3, tag: 'variedad_gramatica', estructura: 'irregular_verbs',
    es: '“Learned” y “learnt” son ambas correctas. La primera domina en EE.UU.; la segunda, en Reino Unido.',
    source: 'Gramáticas de referencia del inglés; variación en verbos irregulares' },

  { id: 417, tramo: 3, tag: 'variedad_gramatica', estructura: 'irregular_verbs',
    es: 'Lo mismo con burned/burnt, dreamed/dreamt, spelled/spelt. No estás eligiendo entre correcto e incorrecto.',
    source: 'Variación documentada en verbos con doble forma de pasado' },

  { id: 418, tramo: 3, tag: 'variedad_gramatica', estructura: 'irregular_verbs',
    es: '“Gotten” es normal en EE.UU. como participio de “get”. En Reino Unido se usa “got”. Ambas existen.',
    source: 'Swan, Practical English Usage' },

  { id: 419, tramo: 2, tag: 'variedad_examen',
    es: 'Si eliges una forma, mantenla en todo el texto. Mezclar británico y estadounidense sí se nota y sí resta.',
    source: 'Criterio de consistencia en evaluación de escritura' },

  { id: 420, tramo: 3, tag: 'variedad_gramatica', estructura: 'prepositions',
    es: '“At the weekend” (británico) y “on the weekend” (estadounidense) son las dos correctas. Las preposiciones también varían.',
    source: 'Swan, Practical English Usage' },

  { id: 421, tramo: 3, tag: 'variedad_gramatica',
    es: 'Fechas: los británicos escriben 5th March, los estadounidenses March 5th. Detalle chico, impresión grande.',
    source: 'Convenciones de escritura británica y estadounidense' },

  /* ── D · Sustantivos colectivos ────────────────────────────────────── */
  { id: 422, tramo: 3, tag: 'variedad_gramatica', estructura: 'agreement',
    es: '“The team is” (EE.UU.) o “the team are” (Reino Unido). Con equipos, gobiernos y bandas, la concordancia varía según la variedad.',
    source: 'Quirk et al., A Comprehensive Grammar of the English Language; Swan' },

  { id: 423, tramo: 3, tag: 'variedad_gramatica', estructura: 'agreement',
    es: 'El inglés británico permite tratar un grupo como conjunto de personas: “the band are recording”. El estadounidense prefiere el singular.',
    source: 'Quirk et al.; Swan' },

  /* ── E · Más allá de UK y EE.UU. (dosis baja: dato cultural) ───────── */
  { id: 430, tramo: 3, tag: 'variedad_mundo',
    es: 'El inglés indio, singapurense, nigeriano y filipino tienen sus propias normas gramaticales establecidas. No son inglés mal hablado.',
    source: 'Kachru, modelo de los tres círculos; Kirkpatrick (2007), World Englishes' },

  { id: 431, tramo: 3, tag: 'variedad_mundo',
    es: 'En inglés irlandés existe “I do be working” para acciones habituales. Es una estructura propia, no un error.',
    source: 'Descripciones dialectales del inglés irlandés (Hiberno-English)' },

  { id: 432, tramo: 3, tag: 'variedad_mundo', estructura: 'pronouns',
    es: 'El sur de EE.UU. tiene “y’all”; algunas zonas usan “you guys”. El inglés inventó varios “ustedes” porque perdió el original.',
    source: 'Dialectología del inglés estadounidense; Crystal' },

  { id: 433, tramo: 3, tag: 'variedad_mundo',
    es: 'Cada variedad del inglés es un sistema con reglas, no una versión defectuosa de otra.',
    source: 'Principio descriptivo básico de la lingüística; Kirkpatrick (2007)' },

  { id: 434, tramo: 2, tag: 'variedad_elf',
    es: 'Vas a escuchar inglés de India, Filipinas y Europa mucho más que de Oxford. Acostumbra el oído a la diversidad.',
    source: 'Perfil demográfico del uso global del inglés (Crystal, 2003; Graddol)' },
];
