/* ============================================================================
   Área 8 · Inglés con IA                              ids 800-849 · 43 ítems
   ----------------------------------------------------------------------------
   No se trata de prohibir la IA sino de mover al alumno desde "que me lo
   escriba" hacia "que me lo explique". La evidencia respalda las dos cosas a la
   vez: la IA MEJORA el texto entregado y EMPEORA lo que el alumno retiene si
   reemplaza el esfuerzo. Toda el área se apoya en esa distinción.

   El bloque B (prompts) va completo al tramo de entrada: es lo único del banco
   que el alumno puede usar esa misma noche y que cambia un comportamiento que
   ya tiene. Los prompts van en inglés a propósito — escribirle a la IA en
   inglés ya es práctica — y son copiables desde la tarjeta.
   La ética (bloque E) va al fondo y con cupo: en exceso genera rechazo, no
   aprendizaje.

   CORTADOS respecto del documento original:
   · A3 (Kosmyna et al., MIT, "Your Brain on ChatGPT") — preprint de muestra
     chica y "menor conectividad cerebral" es justo la lectura sensacionalista
     que los propios autores desmintieron. Es el ítem con más probabilidad de
     que se lo citen de vuelta mal al docente, y no aporta nada que A1 y A2 no
     digan mejor.
   · A8 (ChatGPT vs buscadores) — sin autores Y duplica el mensaje de A2.
   · D6 ("el texto de la IA es más largo y correcto, POR ESO se detecta") — la
     detección de texto de IA no es confiable. El riesgo no es solo con el
     alumno: refuerza en el docente la idea de que se detecta a ojo.

   SIN CIFRAS, a propósito: A1 y A7 llegaron con datos precisos pero SIN AUTORES,
   así que no se pueden comprobar. Se enuncia la dirección del hallazgo, que sí
   es consistente con Bjork y con el efecto de generación, y la advertencia va
   visible. Si aparecen las referencias, se reponen los números.
   ========================================================================== */
export default [
  /* ── A · Por qué copiar te perjudica ───────────────────────────────── */
  { id: 800, tramo: 2, tag: 'ia_evidencia', status: 'debate',
    note: 'La referencia de este estudio llegó sin autores, así que no se pudo verificar. Por eso se enuncia la dirección del hallazgo y no las cifras exactas.',
    es: 'En un ensayo controlado, quienes estudiaron con IA sin restricciones recordaban MENOS 45 días después que quienes estudiaron sin ella.',
    source: 'Ensayo controlado aleatorizado sobre retención de conocimiento y uso de ChatGPT (2025), Computers in Human Behavior: Artificial Humans' },

  { id: 801, tramo: 3, tag: 'ia_evidencia',
    es: 'La IA baja el esfuerzo mental. El problema es que ese esfuerzo era justamente lo que fijaba el aprendizaje.',
    source: 'Principio de dificultades deseables (Bjork, 1994)' },

  { id: 802, tramo: 2, tag: 'ia_advertencia',
    es: 'Un texto perfecto que no escribiste no te enseñó nada. El profesor evalúa el texto; el examen oral te evalúa a ti.',
    source: 'Mensaje pedagógico basado en la evidencia de retención' },

  { id: 803, tramo: 3, tag: 'ia_evidencia',
    es: 'Producir tú la frase —aunque salga imperfecta— fija más que leer la versión correcta. Es el efecto de generación.',
    source: 'Slamecka & Graf (1978), efecto de generación' },

  { id: 804, tramo: 1, tag: 'ia_evidencia',
    es: 'Cuando la IA arma la oración por ti, te salta el paso donde “notas” la estructura. Y sin notar, no hay adquisición.',
    source: 'Schmidt (1990), Noticing Hypothesis, Applied Linguistics 11(2)' },

  { id: 805, tramo: 2, tag: 'ia_evidencia', status: 'debate',
    note: 'La referencia llegó sin autores y no se pudo verificar. El fenómeno que describe (sentirse seguro ≠ saber) sí está bien documentado en otras líneas de investigación.',
    es: 'Estudiar con IA da más confianza pero no siempre más aprendizaje. Sentirse seguro y saber no son lo mismo.',
    source: 'Meta-análisis de instrucción de inglés con ChatGPT (2026), Education Sciences — “brecha afectivo-cognitiva”' },

  /* ── B · Cómo usar la IA para ENTENDER gramática ───────────────────── */
  { id: 810, tramo: 1, tag: 'ia_prompt',
    es: 'Cambia “escríbeme el párrafo” por “revisa mi párrafo y explícame por qué está mal”. Un cambio de prompt, otro aprendizaje.',
    prompt: "Here's my paragraph. Don't rewrite it. Tell me which grammar rules I broke and why.",
    source: 'Aplicación del principio de retroalimentación correctiva (Kang & Han, 2015, meta-análisis de 21 estudios)' },

  { id: 811, tramo: 1, tag: 'ia_prompt', estructura: 'present_perfect', nivel: 'elemental2',
    es: 'Pídele la regla, no la respuesta. Entender por qué se usa una estructura vale más que ver la frase ya corregida.',
    prompt: "Explain the rule for present perfect vs past simple. Don't correct my sentence yet.",
    source: 'Basado en Bjork (1994), dificultades deseables' },

  { id: 812, tramo: 1, tag: 'ia_prompt',
    es: 'Pídele ejercicios, no soluciones. Que te dé diez frases para completar y las respuestas al final, no al lado.',
    prompt: 'Create 10 gap-fill sentences with prepositions. Put the answers at the bottom.',
    source: 'Práctica de recuperación (Roediger & Karpicke, 2006)' },

  { id: 813, tramo: 1, tag: 'ia_prompt',
    es: 'Usa la IA como interlocutor, no como escritor: conversa en inglés y pídele que corrija al final, no durante.',
    prompt: "Let's chat in English. Correct my grammar only at the end of the conversation.",
    source: 'Basado en Swain (1985), Output Hypothesis, y MacIntyre et al. (1998), WTC' },

  { id: 814, tramo: 1, tag: 'ia_prompt',
    es: 'Pídele que te pregunte a ti. Un buen tutor interroga; un mal tutor solo entrega.',
    prompt: 'Quiz me on this grammar topic. Ask one question at a time and wait for my answer.',
    source: 'Práctica de recuperación (Karpicke & Roediger, 2008, Science)' },

  { id: 815, tramo: 1, tag: 'ia_metodo',
    es: 'Escribe tú primero, después compara. Nunca al revés. El orden lo cambia todo.',
    prompt: "Here's my version. Here's what I was trying to say. What's the difference?",
    source: 'Efecto de generación (Slamecka & Graf, 1978)' },

  { id: 816, tramo: 1, tag: 'ia_prompt',
    es: 'Pídele la misma idea en tres estructuras distintas. Amplías tu repertorio sin copiar nada.',
    prompt: 'Show me 3 different grammatical ways to express this idea, and explain the nuance.',
    source: 'Basado en Schmidt (1990), noticing' },

  { id: 817, tramo: 1, tag: 'ia_prompt',
    es: 'Pregúntale por qué TU versión suena rara. Esa explicación vale más que la corrección.',
    prompt: 'Why does my sentence sound unnatural to a native speaker?',
    source: 'Basado en Schmidt (1990) y en retroalimentación correctiva' },

  { id: 818, tramo: 1, tag: 'ia_prompt', estructura: 'for_since', nivel: 'intermedio2',
    es: 'Pídele ejemplos de TU error típico, no de gramática en general. La IA sirve cuando le das contexto tuyo.',
    prompt: "I always confuse 'for' and 'since'. Give me 8 examples and 5 sentences to complete.",
    source: 'Basado en la lógica de retroalimentación focalizada' },

  { id: 819, tramo: 1, tag: 'ia_prompt', estructura: 'present_perfect', nivel: 'elemental2',
    es: 'Pídele que compare el inglés con el español. Ataca de frente lo que tu idioma te hace arrastrar.',
    prompt: 'How is the English present perfect different from the Spanish pretérito perfecto?',
    source: 'Análisis contrastivo; Swan & Smith (2001)' },

  /* ── C · Post-editing: el uso legítimo del traductor ───────────────── */
  { id: 820, tramo: 2, tag: 'ia_traductor',
    es: 'Traducir y pegar no enseña. Traducir, comparar con tu versión y entender la diferencia, sí.',
    source: 'Chon et al. (2021) sobre estrategias de post-edición en aprendices de L2' },

  { id: 821, tramo: 2, tag: 'ia_metodo',
    es: 'Escribe tú, después traduce lo mismo, después compara los dos. Las diferencias son tu lista de estudio.',
    source: 'Basado en investigación sobre traducción automática como retroalimentación en escritura L2' },

  { id: 822, tramo: 2, tag: 'ia_advertencia',
    es: 'El traductor produce textos con menos errores que los tuyos. Ese es justamente el riesgo: te acostumbras a no tenerlos.',
    source: 'Estudios comparativos de escritura L2 con y sin traducción automática (Stapleton & Kin, 2019; Tsai, 2019)' },

  { id: 823, tramo: 2, tag: 'ia_metodo',
    es: 'Saber corregir lo que la IA te entrega es una habilidad real y evaluable. Saber pegarlo no lo es.',
    source: 'Chon et al. (2021) — la post-edición como nueva competencia escrita' },

  { id: 824, tramo: 2, tag: 'ia_advertencia',
    es: 'Tu capacidad de post-editar depende de tu nivel real de inglés. Sin base, no puedes ni detectar los errores de la IA.',
    source: 'Chon et al. (2021) — el nivel de L2 determina la calidad de la post-edición' },

  { id: 825, tramo: 2, tag: 'ia_traductor',
    es: 'Usa el traductor para palabras y frases sueltas mientras escribes. Para el texto completo, escribe tú.',
    source: 'Síntesis de investigación sobre uso de traducción automática en escritura L2' },

  { id: 826, tramo: 2, tag: 'ia_metodo',
    es: 'Traduce del inglés al español para verificar si dice lo que querías. Es un chequeo, no un atajo.',
    source: 'Estrategia de back-translation en escritura L2' },

  /* ── D · Los límites de la IA ──────────────────────────────────────── */
  { id: 830, tramo: 3, tag: 'ia_limite',
    es: 'La IA no sabe tu nivel. Te puede entregar una estructura de C1 en una tarea de A2, y ahí se nota.',
    source: 'Observación pedagógica respaldada por literatura sobre adecuación de nivel en producción asistida' },

  { id: 831, tramo: 3, tag: 'ia_limite',
    es: 'La IA no conoce tu patrón de errores. Tu profesor sí. Por eso su corrección vale más.',
    source: 'Kang & Han (2015), meta-análisis sobre retroalimentación correctiva del docente y precisión gramatical' },

  { id: 832, tramo: 3, tag: 'ia_limite',
    es: 'La IA se equivoca con seguridad. Suena convincente incluso cuando la regla que te explica es falsa.',
    source: 'Literatura sobre alucinaciones en modelos de lenguaje y su impacto en resultados de aprendizaje' },

  { id: 833, tramo: 3, tag: 'ia_limite',
    es: 'Si no puedes evaluar la respuesta, no puedes usar la herramienta. Ese es el límite real.',
    source: 'Basado en Chon et al. (2021) sobre competencia de post-edición' },

  { id: 834, tramo: 3, tag: 'ia_limite',
    es: 'La IA te da una versión pulida. Tu profesor quiere ver la tuya, con errores incluidos, porque de ahí sale la clase siguiente.',
    source: 'Mensaje pedagógico' },

  { id: 835, tramo: 3, tag: 'ia_advertencia',
    es: 'La IA no te va a acompañar a la prueba oral. Ahí queda solo lo que interiorizaste.',
    source: 'Mensaje pedagógico' },

  /* ── E · Integridad académica (fondo, y con cupo) ──────────────────── */
  { id: 840, tramo: 3, tag: 'ia_etica',
    es: 'No se trata de si te pillan. Se trata de que en dos años vas a necesitar ese inglés en una entrevista de trabajo.',
    source: 'Mensaje pedagógico; conecta con datos de empleabilidad (British Council, 2015)' },

  { id: 841, tramo: 3, tag: 'ia_etica',
    es: 'Usar IA no es hacer trampa. Entregar como tuyo lo que no escribiste, sí. La diferencia está en el proceso.',
    source: 'Marco general de integridad académica en contextos de IA generativa' },

  { id: 842, tramo: 3, tag: 'ia_etica',
    es: 'Si usaste IA, declara cómo. La transparencia protege tu nota y tu credibilidad.',
    source: 'Buenas prácticas de declaración de uso de IA en educación superior' },

  { id: 843, tramo: 3, tag: 'ia_etica',
    es: 'Pregunta a tu profesor qué uso de IA está permitido en cada tarea. No todas las tareas tienen la misma regla.',
    source: 'Recomendación práctica' },

  { id: 844, tramo: 3, tag: 'ia_etica',
    es: 'Una nota que no refleja lo que sabes es una deuda: la pagas en el siguiente nivel.',
    source: 'Mensaje pedagógico' },

  /* ── F · Autochequeo ───────────────────────────────────────────────── */
  { id: 850, tramo: 1, tag: 'ia_autochequeo',
    es: 'Pregúntate: si borro la IA ahora mismo, ¿puedo rehacer esto solo? Si la respuesta es no, no aprendiste.',
    source: 'Basado en Zimmerman (2002), autorregulación del aprendizaje' },

  { id: 851, tramo: 1, tag: 'ia_metodo',
    es: 'Antes de abrir la IA, intenta 5 minutos por tu cuenta. Ese intento fallido prepara el cerebro para aprender la respuesta.',
    source: 'Kornell, Hays & Bjork (2009), efecto del intento previo fallido sobre el aprendizaje posterior' },

  { id: 852, tramo: 2, tag: 'ia_autochequeo',
    es: 'Después de usar la IA, escribe con tus palabras la regla que aprendiste. Si no puedes, vuelve a preguntar.',
    source: 'Basado en el efecto de generación y en la autoexplicación (Chi et al., 1994)' },

  { id: 853, tramo: 2, tag: 'ia_metodo',
    es: 'Guarda las correcciones que te hace la IA en una lista. Si un error se repite, ahí está tu tarea real.',
    source: 'Basado en Zimmerman (2002), monitoreo, y en análisis de errores' },

  { id: 854, tramo: 2, tag: 'ia_metodo',
    es: 'Usa la IA al final del proceso, no al principio. Primero piensas tú, después consultas.',
    source: 'Basado en dificultades deseables (Bjork, 1994)' },

  { id: 855, tramo: 2, tag: 'ia_autochequeo',
    es: 'Buena señal: usaste la IA y ahora entiendes algo que antes no. Mala señal: usaste la IA y entregaste algo que no entiendes.',
    source: 'Mensaje pedagógico que sintetiza la evidencia de retención' },

  { id: 856, tramo: 2, tag: 'ia_metafora',
    es: 'La IA es como una calculadora: útil cuando ya sabes sumar, dañina cuando la usas para no aprender nunca.',
    source: 'Analogía basada en Risko & Gilbert (2016), “cognitive offloading”' },

  { id: 857, tramo: 2, tag: 'ia_autochequeo',
    es: 'El objetivo no es escribir bien en inglés. Es SABER inglés. La IA cumple lo primero y no lo segundo.',
    source: 'Síntesis del área' },

  { id: 858, tramo: 2, tag: 'ia_metodo',
    es: 'Si la IA te ahorra tiempo, invierte ese tiempo en practicar más. Si te ahorra el aprendizaje, algo salió mal.',
    source: 'Basado en la brecha afectivo-cognitiva descrita en la literatura sobre IA y aprendizaje de idiomas' },
];
