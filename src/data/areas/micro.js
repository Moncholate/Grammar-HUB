/* ============================================================================
   Área 6 · Rutinas cortas (microaprendizaje)          ids 600-640 · 41 ítems
   ----------------------------------------------------------------------------
   Escrita para el alumno que trabaja y estudia de noche: no le pide estudiar
   más, le muestra cómo usar los huecos que ya tiene. Es la que mejor calza con
   el formato de la app — el bloque B son acciones de menos de cinco minutos que
   se ejecutan sin salir de la pantalla.

   `tramo`  1 entrada · 2 método · 3 fondo.
   El bloque B y el F van completos al tramo 1: son positivos, accionables y no
   le dicen a nadie que lo está haciendo mal. Los ítems marcados tramo 3 no son
   peores: repiten un principio que ya tiene su podio (espaciamiento,
   recuperación, mentalidad), así que salen recién cuando el banco da la vuelta.

   Se RECHAZÓ la frecuencia diaria que sugiere el documento original para el
   bloque B: si el micro-reto sale todos los días, es el banco entero y lo demás
   no existe. Va con el peso más alto del tramo 1, pero una frase al día sigue
   siendo una.
   ========================================================================== */
export default [
  /* ── A · Por qué lo corto funciona ─────────────────────────────────── */
  { id: 601, tramo: 3, tag: 'micro_evidencia',
    es: 'Sesiones cortas y frecuentes le ganan a las largas y esporádicas. No es pereza: es cómo funciona la memoria.',
    source: 'Cepeda, Pashler et al. (2006), meta-análisis del efecto de espaciamiento' },

  { id: 602, tramo: 2, tag: 'micro_evidencia',
    es: 'Tu memoria de trabajo tiene un límite. Una estructura por sesión entra; cinco se pelean entre ellas.',
    source: 'Sweller, teoría de la carga cognitiva' },

  { id: 603, tramo: 2, tag: 'micro_evidencia',
    es: 'Estudiar en trozos pequeños reduce la carga mental y hace que el contenido complejo se vuelva manejable.',
    source: 'Revisión sistemática sobre microaprendizaje y resultados de aprendizaje (2024), Heliyon',
    status: 'debate',
    note: '“Microlearning” es una etiqueta con mucha literatura débil: revisiones sin grupo control y artículos de proveedores de plataformas. El principio de fondo (carga cognitiva) sí es sólido.' },

  { id: 604, tramo: 3, tag: 'micro_evidencia',
    es: 'Cada sesión corta es una oportunidad de recordar. Y recordar es lo que fija, no releer.',
    source: 'Roediger & Karpicke (2006), Psychological Science' },

  { id: 605, tramo: 1, tag: 'micro_meta',
    es: 'Diez minutos diarios son 60 horas al año. Nadie tiene 60 horas libres de golpe; todos tenemos diez minutos.',
    source: 'Aritmética simple + efecto de espaciamiento (Cepeda et al., 2006)' },

  { id: 606, tramo: 3, tag: 'micro_evidencia',
    es: 'Estudiar seguido te da más noches de consolidación. Ahí está la ventaja real de la constancia.',
    source: 'Kim & Nam (2020), SSLA 42(5) + efecto de espaciamiento' },

  { id: 607, tramo: 2, tag: 'micro_evidencia',
    es: 'Evaluaciones móviles cortas mejoraron el rendimiento y la motivación de estudiantes en un estudio con diseño experimental.',
    source: 'Nikou & Economides (2018), Journal of Computer Assisted Learning 34(3), 269-278' },

  /* ── B · Micro-rutinas de 5 minutos o menos ────────────────────────── */
  { id: 610, tramo: 1, tag: 'micro_rutina',
    es: 'Micro-rutina de 3 minutos: elige una estructura y escribe tres frases tuyas con ella. Listo.',
    source: 'Efecto de generación (Slamecka & Graf, 1978); Swain (1985)' },

  { id: 611, tramo: 1, tag: 'micro_rutina',
    es: 'Micro-rutina de 2 minutos: tapa la regla de ayer e intenta decirla de memoria. Después revisa.',
    source: 'Karpicke & Roediger (2008), Science' },

  { id: 612, tramo: 1, tag: 'micro_rutina',
    es: 'Micro-rutina de 5 minutos: toma una frase que dijiste mal en clase y escríbela bien tres veces distintas.',
    source: 'Basado en Schmidt (1990), noticing, y en retroalimentación correctiva' },

  { id: 613, tramo: 1, tag: 'micro_rutina', estructura: 'questions_do', nivel: 'basico1',
    es: 'Micro-rutina de 1 minuto: convierte una frase afirmativa en pregunta y en negativa. Do, does, did.',
    source: 'Práctica focalizada en estructuras de alta interferencia (Swan & Smith, 2001)' },

  { id: 614, tramo: 1, tag: 'micro_rutina', estructura: 'present_continuous', nivel: 'basico2',
    es: 'Micro-rutina de 4 minutos: describe lo que estás haciendo AHORA en present continuous. Cinco frases.',
    source: 'Output Hypothesis (Swain, 1985)' },

  { id: 615, tramo: 1, tag: 'micro_rutina', estructura: 'past_simple', nivel: 'basico2',
    es: 'Micro-rutina de 3 minutos: cuenta qué hiciste ayer en past simple. En voz alta, sin escribir.',
    source: 'Output Hypothesis (Swain, 1985)' },

  { id: 616, tramo: 1, tag: 'micro_rutina',
    es: 'Micro-rutina de 2 minutos: busca en tu chat una frase en español y tradúcela mentalmente. Solo una.',
    source: 'Práctica de recuperación aplicada' },

  { id: 617, tramo: 1, tag: 'micro_rutina', estructura: 'future_forms', nivel: 'elemental2',
    es: 'Micro-rutina de 5 minutos: escribe qué vas a hacer mañana usando “going to”. Cinco planes reales.',
    source: 'Producción con contenido personal (Swain, 1985)' },

  { id: 618, tramo: 1, tag: 'micro_rutina', estructura: 'verb_tenses',
    es: 'Micro-rutina de 3 minutos: elige un verbo y arma una frase en cada tiempo que conozcas.',
    source: 'Práctica de recuperación + interleaving (Rohrer & Taylor, 2007)' },

  { id: 619, tramo: 1, tag: 'micro_rutina',
    es: 'Micro-rutina de 2 minutos: revisa la última frase que escribiste en inglés y busca UN error. Solo uno.',
    source: 'Schmidt (1990), Noticing Hypothesis' },

  /* ── C · Inglés dentro de la rutina que ya tienes ───────────────────── */
  { id: 620, tramo: 2, tag: 'micro_entorno',
    es: 'Cambia el idioma de tu teléfono a inglés. Cero minutos extra de estudio, exposición todo el día.',
    source: 'Principio de input incidental (Krashen, 1985)' },

  { id: 621, tramo: 2, tag: 'micro_entorno',
    es: 'El transporte es tu sala de clases más subestimada. Un podcast corto en inglés por viaje.',
    source: 'Basado en input comprensible y en la lógica del aprendizaje móvil' },

  { id: 622, tramo: 2, tag: 'micro_entorno',
    es: 'Mientras esperas: una frase. En la fila, en el paradero, entre clases. Ahí está tu tiempo escondido.',
    source: 'Efecto de espaciamiento aplicado a micromomentos' },

  { id: 623, tramo: 2, tag: 'micro_entorno',
    es: 'Pega la estructura de la semana donde la veas sin buscarla: el espejo, el casillero, el fondo de pantalla.',
    source: 'Señales contextuales y repetición espaciada pasiva' },

  { id: 624, tramo: 1, tag: 'micro_entorno',
    es: 'Narra tu día en inglés mientras te trasladas. Nadie te escucha y estás practicando producción.',
    source: 'Swain (1985), Output Hypothesis' },

  { id: 625, tramo: 2, tag: 'micro_entorno',
    es: 'Si trabajas con clientes o sistemas en inglés, eso cuenta como práctica. Ponle atención consciente.',
    source: 'Schmidt (1990) — el input solo enseña si se nota' },

  { id: 626, tramo: 2, tag: 'micro_entorno',
    es: 'Escucha inglés mientras caminas. Hay evidencia de que el movimiento durante el aprendizaje ayuda.',
    source: 'Schmidt-Kassow et al. (2013), PLOS ONE' },

  /* ── D · Arrancar y sostener el hábito ─────────────────────────────── */
  { id: 630, tramo: 1, tag: 'micro_habito',
    es: 'Define cuándo y dónde, no solo qué. “Estudiaré inglés” falla; “a las 8, en el metro” funciona.',
    source: 'Gollwitzer (1999), intenciones de implementación, American Psychologist 54(7)' },

  { id: 631, tramo: 2, tag: 'micro_habito',
    es: 'Pega la nueva rutina a una que ya tienes: después del café, después de guardar el uniforme.',
    source: 'Literatura sobre formación de hábitos y anclaje a señales existentes' },

  { id: 632, tramo: 2, tag: 'micro_habito',
    es: 'Un hábito toma en promedio unos dos meses en automatizarse. Si aún te cuesta a la semana tres, vas normal.',
    source: 'Lally et al. (2010), European Journal of Social Psychology — mediana de 66 días',
    status: 'debate',
    note: 'Es una mediana con un rango enorme entre participantes: de 18 a más de 250 días. No es “en 66 días tendrás el hábito”.' },

  { id: 633, tramo: 2, tag: 'micro_habito',
    es: 'Empieza con una meta ridículamente chica: una frase al día. Es más fácil crecer que retomar.',
    source: 'Literatura sobre formación de hábitos y autoeficacia (Bandura, 1997)' },

  { id: 634, tramo: 2, tag: 'micro_habito',
    es: 'Si fallaste un día, no rompiste nada. Lo que rompe el hábito es fallar dos veces seguidas.',
    source: 'Lally et al. (2010) — un lapso aislado no afectó la formación del hábito' },

  { id: 635, tramo: 2, tag: 'micro_habito',
    es: 'Marca los días que practicaste. Ver la racha hace más por tu constancia que cualquier promesa.',
    source: 'Basado en Zimmerman (2002), automonitoreo' },

  { id: 636, tramo: 2, tag: 'micro_habito',
    es: 'Decide la estructura de la semana el domingo. Decidir cansa; decidir una vez cansa menos.',
    source: 'Basado en Gollwitzer (1999) y en carga cognitiva' },

  /* ── E · Qué NO hacer ───────────────────────────────────────────────── */
  { id: 640, tramo: 2, tag: 'micro_error',
    es: 'No intentes estudiar toda la gramática del semestre en un fin de semana. Tu cerebro descarta lo que no alcanza a procesar.',
    source: 'Carga cognitiva (Sweller); efecto de espaciamiento' },

  { id: 641, tramo: 2, tag: 'micro_error',
    es: 'Cinco minutos de práctica real valen más que treinta con el video de fondo mientras haces otra cosa.',
    source: 'Literatura sobre atención dividida y aprendizaje' },

  { id: 642, tramo: 2, tag: 'micro_error',
    es: 'Una app que solo te hace tocar la respuesta correcta no te hace producir. Escribe y habla también.',
    source: 'Swain (1985), Output Hypothesis' },

  { id: 643, tramo: 2, tag: 'micro_error',
    es: 'No cambies de estructura cada día sin repasar la anterior. Sin repaso, la sesión corta no sirve.',
    source: 'Efecto de espaciamiento (Cepeda et al., 2006)' },

  { id: 644, tramo: 2, tag: 'micro_error',
    es: 'Esperar “tener tiempo” es la forma más común de nunca empezar. El tiempo no llega: se recorta.',
    source: 'Mensaje pedagógico basado en Gollwitzer (1999)' },

  /* ── F · Para quien tiene poco tiempo ──────────────────────────────── */
  { id: 650, tramo: 1, tag: 'micro_meta',
    es: 'No necesitas una hora libre. Necesitas cinco minutos y saber exactamente qué vas a hacer con ellos.',
    source: 'Gollwitzer (1999) + carga cognitiva' },

  { id: 651, tramo: 1, tag: 'micro_meta',
    es: 'Estudiar y trabajar no te hace mal estudiante. Te obliga a ser más estratégico, no más esforzado.',
    source: 'Mensaje pedagógico; conecta con Zimmerman (2002), autorregulación' },

  { id: 652, tramo: 1, tag: 'micro_meta',
    es: 'Una estructura por semana son 40 estructuras al año. Eso es un nivel completo.',
    source: 'Aritmética + progresión curricular del MCER' },

  { id: 653, tramo: 3, tag: 'micro_meta',
    es: 'Avanzar poco es avanzar. Detenerse a esperar el momento perfecto, no.',
    source: 'Mensaje pedagógico basado en Dweck (2006)' },

  { id: 654, tramo: 3, tag: 'micro_meta',
    es: 'El mejor plan de estudio no es el más completo: es el que realmente vas a cumplir esta semana.',
    source: 'Zimmerman (2002), fijación realista de metas' },
];
