/* ============================================================================
   Área 7 · Evaluaciones (MCER)                        ids 700-749 · 38 ítems
   ----------------------------------------------------------------------------
   Comparte categoría con el área 11 (Tu evaluación): las dos hablan de cómo se
   mide al alumno. La diferencia es la fuente — el área 11 sale de las rúbricas
   REALES del curso; esta sale del MCER, o sea del estándar internacional.

   ONCE ÍTEMS CORTADOS O SUSTITUIDOS. El motivo es el mismo en todos: las
   rúbricas de este curso CUENTAN errores y el MCER PONDERA comprensión, así que
   varios ítems describían un estándar que no es el que se le aplica al alumno.
   Ver banco-rubricas-duoc.md para el detalle y los números.

   · A1, A3, A4 — describen que en A2/B1/B2 se esperan errores. En la rúbrica del
     curso, un error básico sistemático repetido 8 veces = 0 puntos, y el 100%
     de gramática del oral de intermedio alto exige CERO errores.
   · A6 — cita "repertorio" como la palabra clave de las rúbricas. Esa palabra
     no aparece en ninguna rúbrica del curso.
   · A7 — "la rúbrica mide rango Y precisión". No hay criterio de rango
     gramatical: se mide extensión, vocabulario aprendido y conteo de errores.
   · E1 — "no todos los errores pesan igual". La rúbrica no pondera: 8 deslices
     menores valen lo mismo que 8 errores graves. Este ítem le enseñaba al
     alumno a ignorar errores que sí le cuestan puntos.
   · A8, D2, E2, E4 — sustituidos por sus versiones corregidas en el área 11
     (ids 1140, 1120, 1108 y 1109).
   · F5 — "trasnochar antes de la prueba": duplica el C3 del área de sueño, que
     ya se cortó por hablarle a un alumno que no elige su horario.

   El bloque B va al TRAMO DE ENTRADA a propósito: reencuadra el error como
   señal de avance ANTES de que aparezca el primer ítem que corrige uno.
   ========================================================================== */
export default [
  /* ── B · El dato que cambia la conversación · tramo de entrada ─────── */
  { id: 710, tramo: 1, tag: 'eval_dato',
    es: 'Dato contraintuitivo: la precisión NO sube de forma lineal. Los errores aumentan alrededor de B1, cuando empiezas a usar el idioma con más libertad.',
    source: 'Consejo de Europa, MCER, cap. 5 — análisis de las escalas ilustrativas' },

  { id: 711, tramo: 1, tag: 'eval_dato',
    es: 'Si cometes más errores que el semestre pasado, puede que estés arriesgando más. Eso es progreso, no retroceso.',
    source: 'MCER, cap. 5 — la imprecisión aumenta cuando el aprendiz empieza a producir de forma más independiente y creativa' },

  { id: 712, tramo: 1, tag: 'eval_riesgo',
    es: 'El estudiante que solo dice frases que ya domina no comete errores. Tampoco avanza.',
    source: 'Basado en MCER cap. 5 y en Swain (1985), Output Hypothesis' },

  { id: 713, tramo: 2, tag: 'eval_riesgo',
    es: 'Hay dos formas de sacar pocos errores: dominar mucho o arriesgar poco.',
    source: 'MCER — evaluación de la competencia gramatical' },

  /* ── A · Lo que sí se sostiene del MCER ────────────────────────────── */
  { id: 700, tramo: 2, tag: 'eval_rubrica',
    es: 'En B1 se espera precisión razonable en contextos familiares, con control generalmente bueno, aunque se note la influencia del español.',
    source: 'Consejo de Europa, MCER — descriptor de precisión gramatical B1' },

  { id: 701, tramo: 1, tag: 'eval_rubrica',
    es: 'Nadie te pide hablar como nativo. Te piden control razonable de lo que ya viste en el curso.',
    source: 'MCER — escalas de precisión gramatical A2-B2' },

  { id: 702, tramo: 2, tag: 'eval_preparacion',
    es: 'Si tienes 5 minutos para estudiar antes de la prueba, repasa la estructura que más vas a usar, no la más difícil.',
    source: 'Basado en principios de práctica focalizada' },

  { id: 703, tramo: 2, tag: 'eval_prioridad', estructura: 'verb_tenses',
    es: 'Confundir el tiempo verbal cambia CUÁNDO pasó todo. Ese error sí altera el mensaje, aunque en la rúbrica cuente igual que cualquier otro.',
    source: 'MCER — criterio de errores que afectan la comprensión' },

  /* ── C · Escritura: revisar antes de entregar ──────────────────────── */
  { id: 720, tramo: 2, tag: 'eval_escritura',
    es: 'Antes de entregar, lee tu texto buscando SOLO un tipo de error. Después otro. Buscar todo a la vez no funciona.',
    source: 'Literatura sobre autoedición y carga cognitiva en escritura L2' },

  { id: 721, tramo: 2, tag: 'eval_escritura', estructura: 'subject_pronouns',
    es: 'Chequeo 1: ¿todas tus oraciones tienen sujeto? Es el error de transferencia más común y el más fácil de cazar.',
    source: 'Swan & Smith (2001), cap. Spanish speakers' },

  { id: 722, tramo: 2, tag: 'eval_escritura', estructura: 'present_simple',
    es: 'Chequeo 2: busca los verbos en tercera persona singular. ¿Tienen su -s?',
    source: 'Swan & Smith (2001)' },

  { id: 723, tramo: 2, tag: 'eval_escritura', estructura: 'articles',
    es: 'Chequeo 3: revisa artículos. Es la categoría con más errores en escritura de adultos hispanohablantes.',
    source: 'Gonzalez-Torres et al. (2025), IJLTER; estudios de corpus de escritura EFL adulta' },

  { id: 724, tramo: 2, tag: 'eval_escritura', estructura: 'prepositions',
    es: 'Chequeo 4: las preposiciones. Si dudas de una, cámbiala por una estructura que sí domines.',
    source: 'Gonzalez-Torres et al. (2025) — preposiciones entre los errores más persistentes' },

  { id: 725, tramo: 2, tag: 'eval_escritura', estructura: 'verb_tenses',
    es: 'Chequeo 5: ¿mezclaste tiempos verbales sin razón? Elige uno de base y sé consistente.',
    source: 'Criterios de coherencia gramatical en evaluación de escritura' },

  { id: 726, tramo: 2, tag: 'eval_escritura',
    es: 'Lee tu texto en voz baja. El oído detecta errores que el ojo ya se saltó tres veces.',
    source: 'Estrategia de autoedición ampliamente documentada en didáctica de la escritura' },

  { id: 727, tramo: 2, tag: 'eval_escritura',
    es: 'Lee tu texto de la última oración a la primera. Rompe el automatismo y aparecen los errores.',
    source: 'Estrategia de corrección de pruebas (proofreading)' },

  { id: 728, tramo: 2, tag: 'eval_escritura',
    es: 'Reserva 3 minutos del tiempo total para revisar. No son minutos perdidos: son los más rentables de la prueba.',
    source: 'Buenas prácticas de gestión del tiempo en evaluación escrita' },

  { id: 729, tramo: 2, tag: 'eval_escritura',
    es: 'Si una oración te quedó enredada, no la parches: pártela en dos cortas. Dos frases simples correctas valen más que una compleja rota.',
    source: 'Basado en criterios de precisión del MCER' },

  { id: 730, tramo: 1, tag: 'eval_escritura',
    es: 'Conoce tu error personal. Si siempre fallas en el mismo punto, ese es tu primer chequeo, no el genérico.',
    source: 'Zimmerman (2002), automonitoreo; análisis de errores' },

  /* ── D · Oral: gramática bajo presión ──────────────────────────────── */
  { id: 731, tramo: 2, tag: 'eval_oral',
    es: 'En la prueba oral no se espera perfección gramatical. Se espera que se entienda lo que quieres decir.',
    source: 'MCER — descriptores de precisión gramatical B1-B2' },

  { id: 732, tramo: 2, tag: 'eval_oral',
    es: 'Prepara de antemano tres estructuras que domines bien y úsalas. Un repertorio pequeño y seguro sostiene toda la prueba.',
    source: 'MCER — descriptor B1 sobre repertorio de rutinas y patrones frecuentes' },

  { id: 733, tramo: 2, tag: 'eval_oral',
    es: 'Si no te sale la estructura compleja, dilo simple. Comunicar con frases básicas correctas es mejor que trabarse.',
    source: 'MCER — el criterio es que el error no impida la comprensión' },

  { id: 734, tramo: 2, tag: 'eval_oral',
    es: 'Practica tu presentación en voz alta, no mentalmente. Hablar y pensar no usan los mismos recursos.',
    source: 'Swain (1985), Output Hypothesis' },

  { id: 735, tramo: 2, tag: 'eval_oral',
    es: 'Ensaya las preguntas que te podrían hacer y responde en voz alta. La fluidez gramatical viene del ensayo, no del talento.',
    source: 'Práctica deliberada (Ericsson, Krampe & Tesch-Römer, 1993)' },

  { id: 736, tramo: 2, tag: 'eval_oral', estructura: 'connectors',
    es: 'Usa conectores simples y correctos —and, but, because, so— antes que conectores elegantes mal usados.',
    source: 'MCER — criterio de control sobre el repertorio del propio nivel' },

  { id: 737, tramo: 2, tag: 'eval_oral',
    es: 'Habla más lento de lo que crees necesario. Con más tiempo, tu gramática mejora sola.',
    source: 'Literatura sobre presión temporal y precisión en producción oral L2' },

  { id: 738, tramo: 2, tag: 'eval_oral',
    es: 'En el oral se nota si memorizaste. Prepara estructuras, no párrafos completos.',
    source: 'Criterios de autenticidad en evaluación oral' },

  { id: 739, tramo: 1, tag: 'eval_oral',
    es: 'Si te preguntan algo que no entendiste, pide que repitan. Pedir aclaración es competencia evaluable, no debilidad.',
    source: 'MCER — estrategias de compensación e interacción' },

  /* ── E · Priorizar ─────────────────────────────────────────────────── */
  { id: 740, tramo: 2, tag: 'eval_prioridad',
    es: 'Ataca primero el error que se repite. Los aislados son más difíciles de predecir y salen más caros de perseguir.',
    source: 'MCER — distinción entre errores sistemáticos y deslices no sistemáticos' },

  /* ── F · Preparación y ansiedad ────────────────────────────────────── */
  { id: 741, tramo: 1, tag: 'eval_preparacion',
    es: 'Practicar recordando la regla rinde más que releerla. Hazte preguntas, no resúmenes.',
    source: 'Roediger & Karpicke (2006), Psychological Science' },

  { id: 742, tramo: 2, tag: 'eval_preparacion',
    es: 'Estudia con ejercicios del mismo formato de la prueba. La memoria funciona mejor en el contexto donde entrenó.',
    source: 'Principio de especificidad de la codificación (Tulving & Thomson, 1973)' },

  { id: 743, tramo: 3, tag: 'eval_ansiedad',
    es: 'Los nervios ante una prueba de idioma son un fenómeno documentado, no una falla tuya.',
    source: 'Horwitz, Horwitz & Cope (1986), Foreign Language Classroom Anxiety Scale' },

  { id: 744, tramo: 1, tag: 'eval_ansiedad',
    es: 'La ansiedad ocupa parte de tu memoria de trabajo: la misma que necesitas para la gramática. Bajarla es estrategia, no autoayuda.',
    source: 'Horwitz et al. (1986); Krashen (1985), filtro afectivo' },

  { id: 745, tramo: 2, tag: 'eval_ansiedad',
    es: 'Empieza por lo que sabes hacer. Resolver algo bien al principio baja la ansiedad para el resto.',
    source: 'Bandura (1997), autoeficacia; estrategias de gestión de evaluación' },

  { id: 746, tramo: 3, tag: 'eval_preparacion',
    es: 'Distribuye tu preparación en varios días. Una noche de estudio no alcanza a consolidar reglas nuevas.',
    source: 'Cepeda et al. (2006), efecto de espaciamiento' },

  /* ── G · Después de la prueba ──────────────────────────────────────── */
  { id: 750, tramo: 2, tag: 'eval_despues',
    es: 'Revisa la prueba corregida aunque duela. Ahí está tu lista de estudio para la próxima, ya hecha.',
    source: 'Zimmerman (2002), fase de autorreflexión' },

  { id: 751, tramo: 2, tag: 'eval_despues',
    es: 'Anota tus tres errores más repetidos. Si vuelven a aparecer en la siguiente prueba, ya sabes qué practicar.',
    source: 'Análisis de errores + Zimmerman (2002)' },

  { id: 752, tramo: 2, tag: 'eval_despues',
    es: 'Un error que corriges tras la retroalimentación deja de ser error y pasa a ser aprendizaje. Uno ignorado se fosiliza.',
    source: 'Selinker (1972), fosilización; Kang & Han (2015), meta-análisis sobre retroalimentación correctiva' },

  { id: 753, tramo: 1, tag: 'eval_meta',
    es: 'La nota mide una prueba, un día. Tu inglés es lo que puedes hacer con él, y eso se construye entre pruebas.',
    source: 'Mensaje pedagógico' },
];
