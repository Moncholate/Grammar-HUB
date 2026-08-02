/* ============================================================================
   Banco de "Frase del día" · Grammar Hub
   ----------------------------------------------------------------------------
   105 ítems sobre adquisición del inglés, cada uno con su fuente citable.
   La idea NO es la frase motivacional suelta: es un dato o un hallazgo con
   respaldo, y por eso la fuente se muestra SIEMPRE junto al texto.

   Forma de cada ítem:
     id      número estable (no reordenar: la cola guardada en localStorage
             recuerda ids, no posiciones)
     cat     categoría (ver CATEGORIES)
     tag     etiqueta fina del banco original, útil para filtrar
     es      texto en español (< 300 caracteres, cabe en pantalla)
     en      original en inglés, solo cuando la cita nació en ese idioma
     source  fuente citable
     status  'ok'       → respaldo sólido, se puede afirmar
             'debate'   → real pero discutido o sin fuente primaria; se muestra
                          con la advertencia en `note`
             'apocrifa' → sin ninguna fuente primaria; NO entra en la rotación
                          (ver INCLUIR_APOCRIFAS en dailyPhrase.js)
     note    advertencia que se imprime bajo la fuente cuando status ≠ 'ok'
     tramo   1 entrada · 2 método · 3 fondo — define cuándo entra en la baraja
     area    de qué banco viene (1 = original, 6 = rutinas cortas, 11 = rúbricas)
     estructura / nivel   opcionales: si el ítem nombra una estructura concreta,
             `nivel` es el curso MÍNIMO en que se enseña (según syllabus-aef.md)
             y el ítem no se muestra a alguien por debajo de ese nivel
   ========================================================================== */
import AREA_INTERFERENCIA from './areas/interferencia.js';
import AREA_MICRO from './areas/micro.js';
import AREA_EVALUACION from './areas/evaluacion.js';
import AREA_IA from './areas/ia.js';
import AREA_HISTORIA from './areas/historia.js';

/* La categoría se imprime al pie, encabezando la fuente: es contexto de la
   fuente, no un rótulo de la tarjeta. Por eso los nombres son cortos y dicen de
   qué TIPO de respaldo se trata.

   Sin emoji a propósito. Los tenía y se fueron por dos razones: los justifiqué
   como canal no cromático para el DUA, pero aquí no hay nada codificado por
   color que reforzar; y una tarjeta cuyo argumento es "esto tiene respaldo"
   pierde al abrir con un dibujito. Los emoji se quedan en las insignias, que
   son juego. */
export const CATEGORIES = {
  sla:          { es: 'Adquisición del idioma',     en: 'Language acquisition' },
  estrategias:  { es: 'Estrategias de aprendizaje', en: 'Learning strategies' },
  ciencia:      { es: 'Ciencia del aprendizaje',    en: 'Science of learning' },
  bilinguismo:  { es: 'Bilingüismo',                en: 'Bilingualism' },
  ansiedad:     { es: 'Nervios y bienestar',        en: 'Anxiety and well-being' },
  empleabilidad:{ es: 'Inglés y trabajo',           en: 'English and work' },
  tips:         { es: 'Técnicas de estudio',        en: 'Study techniques' },
  cita:         { es: 'Cita',                       en: 'Quote' },
  /* Ni "Ánimo" ni "Para seguir". "Ánimo" en Chile se entiende como estado de
     ánimo (cómo te sientes), no como aliento. "Para seguir" era la única de las
     nueve que no es un sustantivo y desentonaba en la lista.
     "Perspectiva" nombra lo que estas frases hacen —dar vuelta algo que el
     alumno vive como fracaso— sin animarlo desde arriba. */
  refuerzo:     { es: 'Perspectiva',                en: 'Perspective' },
  interferencia:{ es: 'Español vs inglés',          en: 'Spanish vs English' },
  micro:        { es: 'Rutinas cortas',             en: 'Short routines' },
  ia:           { es: 'Inglés con IA',              en: 'English with AI' },
  historia:     { es: 'Historia del inglés',        en: 'History of English' },
  evaluacion:   { es: 'Tu evaluación',              en: 'Your assessment' },
};

/* Advertencias que se repiten, en un solo lugar. */
const N_RETRO = 'Estudio retrospectivo: es una asociación observada, no una relación causal probada. No significa que aprender inglés de adulto prevenga el Alzheimer.';
const N_SIN_FUENTE = 'Atribución muy difundida, pero sin fuente escrita primaria confirmada.';

const ORIGINAL = [
  /* ── Cómo se adquiere un idioma (SLA) ───────────────────────────────── */
  { id: 1, cat: 'sla', tag: 'sla_input',
    es: 'Aprendemos un idioma cuando entendemos mensajes un poquito por encima de nuestro nivel actual (lo que Krashen llama i+1).',
    source: 'Krashen, The Input Hypothesis (1985)' },

  { id: 2, cat: 'sla', tag: 'sla_input',
    es: 'El input comprensible es el combustible del aprendizaje: exponte a inglés que entiendas casi todo, no a lo imposible.',
    source: 'Krashen, Principles and Practice in SLA (1982)' },

  { id: 3, cat: 'sla', tag: 'sla_filtro',
    es: 'El estrés y la ansiedad levantan un “filtro afectivo” que bloquea el idioma. En un ambiente relajado aprendes más.',
    en: 'Anxiety, low self-esteem… will keep linguistic input out.',
    source: 'Krashen, Affective Filter Hypothesis (1985)' },

  { id: 4, cat: 'sla', tag: 'sla_output',
    es: 'Producir el idioma —hablar y escribir— te obliga a notar lo que aún no sabes decir.',
    source: 'Swain, “Communicative Competence: Some Roles of Comprehensible Input and Comprehensible Output” (1985), en Gass & Madden, pp. 235-253' },

  { id: 5, cat: 'sla', tag: 'sla_output',
    es: 'Al hablar pones a prueba tus hipótesis sobre cómo funciona el idioma y recibes retroalimentación.',
    source: 'Swain (1985)' },

  { id: 6, cat: 'sla', tag: 'sla_noticing',
    es: 'No basta con entender: debes “notar” conscientemente las formas del idioma para aprenderlas.',
    en: 'Noticing is the necessary and sufficient condition for converting input to intake.',
    source: 'Schmidt, “The Role of Consciousness in Second Language Learning”, Applied Linguistics 11(2), 1990, pp. 129-158' },

  { id: 7, cat: 'sla', tag: 'sla_interaccion',
    es: 'Conversar y negociar el significado (pedir que repitan, aclarar) acelera el aprendizaje.',
    source: 'Long, Interaction Hypothesis (1996)' },

  { id: 8, cat: 'sla', tag: 'sla_edad',
    es: 'Los adultos SÍ aprenden idiomas muy bien: la edad no es una barrera absoluta.',
    source: 'Birdsong (2007); reanálisis estadístico en Vanhove (2013), PLOS ONE' },

  { id: 9, cat: 'sla', tag: 'sla_edad',
    es: 'El acento nativo es lo más sensible a la edad; la gramática y el vocabulario se aprenden bien de adulto.',
    source: 'Scovel (1988); Hakuta, Bialystok & Wiley (2003)' },

  { id: 10, cat: 'sla', tag: 'sla_edad',
    es: 'Estudiar de adulto tiene ventajas: piensas estratégicamente y aprovechas todo lo que ya sabes.',
    source: 'Literatura SLA sobre aprendices adultos (síntesis)' },

  { id: 11, cat: 'sla', tag: 'sla_adquisicion',
    es: 'Adquirir y aprender son distintos: “adquirir” es usar el idioma de forma natural; “aprender” es estudiar sus reglas. Necesitas ambos.',
    source: 'Krashen, Acquisition-Learning Hypothesis (1982)' },

  { id: 12, cat: 'sla', tag: 'sla_orden',
    es: 'Las reglas gramaticales se adquieren en un orden natural, que no siempre coincide con el orden del curso. Paciencia si algo “no te entra” aún.',
    source: 'Krashen, Natural Order Hypothesis (1982)' },

  /* ── Estrategias y metacognición ─────────────────────────────────────── */
  { id: 13, cat: 'estrategias', tag: 'meta_autorregulacion',
    es: 'Planifica, monitorea y evalúa: esos son los tres pasos de la autorregulación.',
    en: 'The forethought phase… the performance phase… and self-reflection… occur after each learning effort.',
    source: 'Zimmerman (2002), “Becoming a Self-Regulated Learner”, Theory Into Practice 41(2), 64-70' },

  { id: 14, cat: 'estrategias', tag: 'meta_ciclo',
    es: 'El aprendizaje autorregulado es un ciclo: pensar antes, actuar durante y reflexionar después. Y vuelve a empezar.',
    source: 'Zimmerman (2002)' },

  { id: 15, cat: 'estrategias', tag: 'meta_oxford',
    es: 'Existen seis familias de estrategias: memoria, cognitivas, de compensación, metacognitivas, afectivas y sociales.',
    en: 'There are six groups of strategies, three of which are direct and three of which are indirect.',
    source: 'Oxford (1990), Language Learning Strategies: What Every Teacher Should Know, Heinle & Heinle, p. 9' },

  { id: 16, cat: 'estrategias', tag: 'meta_oxford',
    es: 'Adivinar con inteligencia cuando no sabes una palabra es una estrategia válida, no hacer trampa (estrategia de compensación).',
    source: 'Oxford (1990)' },

  { id: 17, cat: 'estrategias', tag: 'meta_omalley',
    es: 'Combinar estrategias metacognitivas y cognitivas funciona mejor que usar una sola.',
    source: "O'Malley & Chamot (1990), Learning Strategies in Second Language Acquisition, Cambridge University Press" },

  { id: 18, cat: 'estrategias', tag: 'meta_afectiva',
    es: 'Baja tu ansiedad, anímate a ti mismo y coopera con otros: las estrategias afectivas y sociales también enseñan.',
    source: "Oxford (1990); O'Malley & Chamot (1990)" },

  { id: 19, cat: 'estrategias', tag: 'meta_mindset',
    es: 'Tu capacidad para los idiomas no es fija: crece con esfuerzo y práctica (mentalidad de crecimiento).',
    source: 'Dweck (2006), Mindset: The New Psychology of Success' },

  { id: 20, cat: 'estrategias', tag: 'meta_mindset',
    es: 'Cambia “no sé inglés” por “todavía no sé inglés”. Esa palabra —“todavía”— lo cambia todo.',
    source: 'Basado en Dweck (2006)' },

  { id: 21, cat: 'estrategias', tag: 'meta_autoeficacia',
    es: 'Creer que eres capaz determina cuánto esfuerzo pones y cuánto persistes ante las dificultades.',
    en: 'Expectations of personal efficacy determine… how much effort will be expended, and how long it will be sustained in the face of obstacles.',
    source: 'Bandura (1977), “Self-efficacy: Toward a unifying theory of behavioral change”, Psychological Review 84(2), 191-215' },

  { id: 22, cat: 'estrategias', tag: 'meta_autoeficacia',
    es: 'La autoeficacia se construye con pequeños logros. Cada meta cumplida refuerza tu confianza para la siguiente.',
    source: 'Bandura (1997), Self-Efficacy: The Exercise of Control, W. H. Freeman' },

  { id: 23, cat: 'estrategias', tag: 'meta_metas',
    es: 'Fija metas concretas y revisa tu avance: los buenos aprendices dirigen su propio proceso.',
    source: 'Zimmerman (2002)' },

  { id: 24, cat: 'estrategias', tag: 'meta_reflexion',
    es: 'Antes de estudiar, pregúntate: ¿qué quiero lograr hoy? Después: ¿lo logré? Esa reflexión es media batalla ganada.',
    source: 'Zimmerman (2002)' },

  /* ── Ciencia del aprendizaje ─────────────────────────────────────────── */
  { id: 25, cat: 'ciencia', tag: 'ca_espaciada',
    es: 'Repartir el estudio en varios días (práctica espaciada) hace que recuerdes mucho más que estudiar todo de una vez.',
    source: 'Cepeda, Pashler et al. (2006), meta-análisis del efecto de espaciamiento' },

  { id: 26, cat: 'ciencia', tag: 'ca_espaciada',
    es: 'Mejor 30 minutos al día durante 10 días que 5 horas la noche anterior.',
    source: 'Basado en el efecto de espaciamiento (Cepeda et al., 2006)' },

  { id: 27, cat: 'ciencia', tag: 'ca_recuperacion',
    es: 'Recordar activamente (autoevaluarte) fija más el conocimiento que releer. Es el “efecto de prueba”.',
    source: 'Roediger & Karpicke (2006), Psychological Science' },

  { id: 28, cat: 'ciencia', tag: 'ca_recuperacion',
    es: 'Tápate la respuesta e intenta recuperarla de memoria: así se aprende de verdad, aunque cueste más.',
    source: 'Karpicke & Roediger (2008), Science' },

  { id: 29, cat: 'ciencia', tag: 'ca_interleaving',
    es: 'Mezclar temas y tipos de ejercicios (interleaving) enseña más que repetir el mismo bloque una y otra vez.',
    source: 'Rohrer & Taylor (2007)' },

  { id: 30, cat: 'ciencia', tag: 'ca_olvido',
    es: 'Olvidamos rápido lo nuevo (la “curva del olvido” de Ebbinghaus). Repasar en el momento justo frena ese olvido.',
    source: 'Ebbinghaus (1885), Über das Gedächtnis' },

  { id: 31, cat: 'ciencia', tag: 'ca_deliberada',
    es: 'La práctica deliberada —enfocada en tus puntos débiles y con retroalimentación— es la que produce mejoras reales.',
    source: 'Ericsson, Krampe & Tesch-Römer (1993), Psychological Review' },

  { id: 32, cat: 'ciencia', tag: 'ca_generacion',
    es: 'Generar tú la respuesta (en vez de solo leerla) mejora la memoria: es el “efecto de generación”.',
    source: 'Slamecka & Graf (1978)' },

  { id: 33, cat: 'ciencia', tag: 'ca_apps',
    es: 'Las apps de repetición espaciada te muestran cada palabra justo antes de que la olvides. Aprovéchalas.',
    source: 'Basado en el spacing effect (Cepeda et al., 2006)' },

  { id: 34, cat: 'ciencia', tag: 'ca_error',
    es: 'Equivocarte al intentar recordar y luego corregir fortalece la memoria más que no fallar nunca (“dificultades deseables”).',
    source: "Bjork (1994), 'desirable difficulties'" },

  { id: 35, cat: 'ciencia', tag: 'ca_espaciada',
    es: 'El repaso funciona mejor cuando hay espacio entre el estudio y el repaso: deja pasar un día o dos.',
    source: 'Karpicke & Roediger (2007)' },

  /* ── Bilingüismo ─────────────────────────────────────────────────────── */
  { id: 36, cat: 'bilinguismo', tag: 'bi_demencia', status: 'debate', note: N_RETRO,
    es: 'Un estudio pionero con 184 pacientes halló que los bilingües mostraron síntomas de demencia 4 años más tarde que los monolingües (71,4 vs 75,4 años).',
    en: 'The bilinguals showed symptoms of dementia 4 years later than monolinguals, all other measures being equivalent.',
    source: 'Bialystok, Craik & Freedman (2007), Neuropsychologia 45(2), 459-464' },

  { id: 37, cat: 'bilinguismo', tag: 'bi_demencia', status: 'debate', note: N_RETRO,
    es: 'En un estudio posterior con 211 pacientes de Alzheimer, los bilingües reportaron el primer síntoma en promedio 5,1 años más tarde.',
    source: 'Craik, Bialystok & Freedman (2010), Neurology 75(19), 1726-1729' },

  { id: 38, cat: 'bilinguismo', tag: 'bi_reserva', status: 'debate',
    note: 'Los datos se refieren a bilingüismo de por vida y provienen de estudios retrospectivos. La “ventaja ejecutiva” del bilingüismo está en crisis de replicación (Paap et al., 2015, Cortex).',
    es: 'El bilingüismo no previene la demencia, pero puede aportar “reserva cognitiva” que retrasa los síntomas.',
    source: 'Bialystok et al. (2007)' },

  { id: 39, cat: 'bilinguismo', tag: 'bi_decisiones',
    es: 'Pensar en un idioma extranjero puede hacerte tomar decisiones más racionales y menos sesgadas.',
    en: 'Using a foreign language reduces decision-making biases.',
    source: 'Keysar, Hayakawa & An (2012), Psychological Science 23(6), 661-668' },

  { id: 40, cat: 'bilinguismo', tag: 'bi_decisiones',
    es: 'En un idioma extranjero somos menos aversos a las pérdidas: hay más distancia emocional al decidir.',
    source: 'Keysar et al. (2012)' },

  { id: 41, cat: 'bilinguismo', tag: 'bi_emocion',
    es: 'Decidir en tu segunda lengua reduce la reacción emocional automática y el sesgo que la acompaña.',
    source: 'Keysar et al. (2012); revisión en Hadjichristidis, Geipel & Keysar (2019)' },

  { id: 42, cat: 'bilinguismo', tag: 'bi_cultura',
    es: 'Dominar dos idiomas te da acceso a dos mundos culturales completos, no solo a más palabras.',
    source: 'Síntesis basada en la investigación sobre bilingüismo' },

  /* ── Nervios y bienestar ─────────────────────────────────────────────── */
  { id: 43, cat: 'ansiedad', tag: 'ans_flcas',
    es: 'La ansiedad ante el idioma es real y tiene tres caras: miedo a comunicar, a los exámenes y a que te juzguen.',
    source: 'Horwitz, Horwitz & Cope (1986), Foreign Language Classroom Anxiety Scale (FLCAS)' },

  { id: 44, cat: 'ansiedad', tag: 'ans_normal',
    es: 'Sentir nervios al hablar inglés es totalmente normal: le pasa a la mayoría de los estudiantes, no eres tú.',
    source: 'Basado en Horwitz et al. (1986)' },

  { id: 45, cat: 'ansiedad', tag: 'ans_disfrute',
    es: 'El disfrute y la ansiedad son como el pie derecho y el izquierdo del aprendiz: conviven, pero el disfrute te hace avanzar.',
    source: 'Dewaele & MacIntyre (2016), “The right and left feet of the language learner”, en Positive Psychology in SLA' },

  { id: 46, cat: 'ansiedad', tag: 'ans_disfrute',
    es: 'Disfrutar el aprendizaje amplía tu mente y mejora tu rendimiento en el idioma.',
    source: 'Dewaele & MacIntyre (2014), Studies in Second Language Learning and Teaching 4(2), 237-274' },

  { id: 47, cat: 'ansiedad', tag: 'ans_error',
    es: 'Los errores no son fracasos: son datos que te muestran exactamente qué ajustar.',
    source: 'Basado en Swain (noticing) y en psicología positiva del aprendizaje' },

  { id: 48, cat: 'ansiedad', tag: 'ans_ambiguedad',
    es: 'Tolerar la ambigüedad —seguir aunque no entiendas cada palabra— es una habilidad clave para avanzar.',
    source: 'Literatura sobre tolerancia a la ambigüedad en SLA' },

  { id: 49, cat: 'ansiedad', tag: 'ans_wtc',
    es: 'La meta final es la disposición a comunicar: atreverte a hablar cuando surge la oportunidad.',
    en: 'A readiness to enter into discourse at a particular time… using a L2.',
    source: 'MacIntyre, Clément, Dörnyei & Noels (1998), The Modern Language Journal 82(4), p. 547' },

  { id: 50, cat: 'ansiedad', tag: 'ans_wtc',
    es: 'Menos ansiedad y más disfrute aumentan tus ganas de hablar en inglés.',
    source: 'Dewaele & Dewaele (2018)' },

  { id: 51, cat: 'ansiedad', tag: 'ans_filtro',
    es: 'Krashen lo dijo fuerte: para que la adquisición funcione de verdad, la ansiedad debería tender a cero.',
    en: 'For language acquisition to really succeed, anxiety should be zero.',
    source: 'Krashen, atribuido en contexto del Affective Filter Hypothesis' },

  { id: 52, cat: 'ansiedad', tag: 'ans_wtc',
    es: 'Habla aunque cometas errores. La comunicación imperfecta sigue siendo comunicación.',
    source: 'Basado en MacIntyre et al. (1998), Willingness to Communicate' },

  /* ── Inglés y trabajo ────────────────────────────────────────────────── */
  { id: 53, cat: 'empleabilidad', tag: 'emp_chile',
    es: 'En Chile, el 82% de quienes no estudian inglés dicen que lo harían para mejorar sus oportunidades laborales: la razón número uno.',
    en: 'The vast majority (82%) said they would do it to improve their employment prospects.',
    source: 'British Council (2015), English in Chile' },

  { id: 54, cat: 'empleabilidad', tag: 'emp_chile',
    es: 'El 48% de los empleadores chilenos considera el inglés una habilidad esencial en general; para cargos gerenciales, casi todos lo exigen.',
    en: '48 per cent feel that it is an essential skill in general.',
    source: 'British Council (2015), English in Chile' },

  { id: 55, cat: 'empleabilidad', tag: 'emp_epi',
    es: 'En el EF EPI 2025, Chile obtuvo 517 puntos: competencia “moderada”, puesto 54 de 123 países y 9º en Latinoamérica.',
    source: 'EF English Proficiency Index 2025 (ef.com/epi)' },

  { id: 56, cat: 'empleabilidad', tag: 'emp_epi',
    es: 'Argentina lidera Latinoamérica en dominio del inglés con 575 puntos (2025); Chile aún tiene camino por recorrer.',
    source: 'EF EPI 2025' },

  { id: 57, cat: 'empleabilidad', tag: 'emp_epi',
    es: 'Chile es más fuerte leyendo inglés (535 pts) que hablándolo (439 pts). Practicar la producción oral es donde más se gana.',
    source: 'EF EPI 2025, sub-puntajes de Chile (Reading 535 / Listening 499 / Writing 466 / Speaking 439)' },

  { id: 58, cat: 'empleabilidad', tag: 'emp_prima',
    es: 'Usar un segundo idioma en el trabajo se asocia a salarios más altos en la mayoría de países de Europa Occidental.',
    source: 'Williams (2006), análisis del European Community Household Panel' },

  { id: 59, cat: 'empleabilidad', tag: 'emp_chile',
    es: 'El programa estatal “Inglés Abre Puertas” (MINEDUC, desde 2003) busca que los estudiantes chilenos egresen con nivel B1.',
    source: 'Ministerio de Educación de Chile; British Council (2015)' },

  { id: 60, cat: 'empleabilidad', tag: 'emp_global',
    es: 'El inglés es la “puerta más ancha” del mercado laboral: más ofertas, más trabajo remoto y más negocios internacionales.',
    source: 'Análisis de mercado laboral (síntesis)' },

  { id: 61, cat: 'empleabilidad', tag: 'emp_capital',
    es: 'Tus idiomas son capital humano: como una certificación técnica, valen aún más combinados con tu especialidad.',
    source: 'Analogía basada en literatura de economía laboral (p. ej., estudios RAND / British Council)' },

  { id: 62, cat: 'empleabilidad', tag: 'emp_global',
    es: 'En economías emergentes —incluida Latinoamérica— mejorar el inglés suele dar el mayor salto de ingresos en tecnología, servicios y trabajo remoto.',
    source: 'Síntesis de estudios sobre retornos del inglés en economías emergentes' },

  /* ── Técnica práctica ────────────────────────────────────────────────── */
  { id: 63, cat: 'tips', tag: 'tip_shadowing',
    es: 'Shadowing: escucha una frase e imítala en voz alta de inmediato, copiando el ritmo y la entonación.',
    source: 'Kadota (2007), Science of Shadowing and Reading Aloud' },

  { id: 64, cat: 'tips', tag: 'tip_lectura',
    es: 'Lee mucho material fácil y agradable (graded readers): aprendes vocabulario casi sin darte cuenta.',
    source: 'Nation & Waring; Mason & Krashen (1997)' },

  { id: 65, cat: 'tips', tag: 'tip_series',
    es: 'Ve series con subtítulos en inglés: combinas escucha, lectura y contexto en una sola actividad.',
    source: 'Basado en el principio de input comprensible (Krashen)' },

  { id: 66, cat: 'tips', tag: 'tip_journaling',
    es: 'Lleva un diario en inglés: escribir unas líneas al día activa la producción y consolida vocabulario.',
    source: 'Basado en la Output Hypothesis (Swain, 1985)' },

  { id: 67, cat: 'tips', tag: 'tip_hablarsolo',
    es: 'Habla solo en inglés: narra en voz alta lo que haces para practicar sin miedo al juicio de nadie.',
    source: 'Práctica de output (Swain)' },

  { id: 68, cat: 'tips', tag: 'tip_apps',
    es: 'Usa apps de repetición espaciada para memorizar vocabulario de forma eficiente y sin cargar la memoria de golpe.',
    source: 'Basado en el spacing effect' },

  { id: 69, cat: 'tips', tag: 'tip_chunks',
    es: 'Aprende “chunks” y colocaciones (grupos de palabras), no palabras sueltas: di “make a decision”, no solo “decision”.',
    source: 'Wray (2002), Formulaic Language and the Lexicon; Nation' },

  { id: 70, cat: 'tips', tag: 'tip_vocabulario',
    es: 'Con las 2.000-3.000 familias de palabras más frecuentes cubres cerca del 95% de un texto típico en inglés.',
    source: 'Nation (2006), “How Large a Vocabulary Is Needed for Reading and Listening?”' },

  { id: 71, cat: 'tips', tag: 'tip_vocabulario',
    es: 'Conocer solo las 1.000 palabras más frecuentes ya te da alrededor del 75% del inglés escrito.',
    source: 'Nation (webinar sobre frecuencia léxica); Nation & Waring (1997)' },

  { id: 72, cat: 'tips', tag: 'tip_vocabulario',
    es: 'Para leer con fluidez sin trabarte necesitas unas 8.000-9.000 familias de palabras (98% de cobertura).',
    source: 'Nation (2006)' },

  { id: 73, cat: 'tips', tag: 'tip_horas',
    es: 'El FSI estima ~600-750 horas de clase para que un angloparlante alcance nivel profesional en español; el inglés para hispanohablantes es de dificultad comparable (Categoría I).',
    source: 'U.S. Foreign Service Institute (español = Categoría I, 24-30 semanas / 600-750 horas para nivel Speaking-3/Reading-3, ≈ B2/C1)' },

  { id: 74, cat: 'tips', tag: 'tip_constancia',
    es: 'La constancia gana: poco y a menudo supera a las maratones de estudio de último minuto.',
    source: 'Basado en el efecto de espaciamiento' },

  { id: 75, cat: 'tips', tag: 'tip_frecuencia',
    es: 'Solo 10 palabras forman el 25% del inglés escrito; las 100 más frecuentes, el 50%. Domínalas primero.',
    source: 'Nation (webinar sobre frecuencia léxica)' },

  { id: 76, cat: 'tips', tag: 'tip_lectura',
    es: 'Lee para gozar: elige textos donde entiendas casi todo y avanza rápido. Si sufres, baja de nivel.',
    source: 'Nation & Waring; Day & Bamford (extensive reading)' },

  { id: 77, cat: 'tips', tag: 'tip_lectura',
    es: 'Cuando una palabra reaparece en contextos distintos, tu cerebro la aprende mejor. Por eso leer harto funciona.',
    source: 'Nation, “Principles guiding vocabulary learning through extensive reading”' },

  { id: 78, cat: 'tips', tag: 'tip_constancia',
    es: '15 minutos diarios de inglés, todos los días, rinden más que 2 horas una vez por semana.',
    source: 'Basado en el spacing effect' },

  { id: 79, cat: 'tips', tag: 'tip_input',
    es: 'Escucha material un poco por encima de tu nivel pero que aún entiendas: ahí ocurre el crecimiento (i+1).',
    source: 'Krashen, Input Hypothesis (1985)' },

  { id: 80, cat: 'tips', tag: 'tip_shadowing',
    es: 'Repite en voz alta lo que lees: sumar la voz “resalta” las palabras y aumenta tu conciencia del ritmo del inglés.',
    source: 'Kadota (2007); Nakanishi & Ueda (2011)' },

  /* ── Citas ───────────────────────────────────────────────────────────── */
  { id: 81, cat: 'cita', tag: 'cita_apocrifa', status: 'apocrifa',
    note: 'No existe ninguna fuente primaria: circula sin respaldo documental. Trátese como proverbio.',
    es: 'Tener otro idioma es poseer una segunda alma.',
    en: 'To have another language is to possess a second soul.',
    source: 'Atribuida a Carlomagno (Charlemagne)' },

  { id: 82, cat: 'cita', tag: 'cita_mandela', status: 'debate',
    note: 'Atribución ampliamente aceptada y coherente con su biografía, pero sin fuente escrita primaria confirmada.',
    es: 'Si le hablas a alguien en un idioma que entiende, le llegas a la cabeza. Si le hablas en su propio idioma, le llegas al corazón.',
    en: 'If you talk to a man in a language he understands, that goes to his head. If you talk to him in his own language, that goes to his heart.',
    source: 'Nelson Mandela' },

  { id: 83, cat: 'cita', tag: 'cita_wittgenstein',
    es: 'Los límites de mi lenguaje son los límites de mi mundo.',
    en: 'The limits of my language mean the limits of my world.',
    source: 'Ludwig Wittgenstein, Tractatus Logico-Philosophicus (1922), proposición 5.6 — fuente primaria verificada' },

  { id: 84, cat: 'cita', tag: 'cita_lewis',
    es: 'Aprender otro idioma no es solo aprender palabras distintas para las mismas cosas, sino otra forma de pensar.',
    en: 'Learning another language is not only learning different words for the same things, but learning another way to think about things.',
    source: 'Flora Lewis (periodista de The New York Times)' },

  { id: 85, cat: 'cita', tag: 'cita_goethe',
    es: 'Quien no conoce lenguas extranjeras nada sabe de la suya propia.',
    en: 'Those who know nothing of foreign languages know nothing of their own.',
    source: 'Johann Wolfgang von Goethe, Maximen und Reflexionen' },

  { id: 86, cat: 'cita', tag: 'cita_smith',
    es: 'Un idioma te sitúa en un pasillo de por vida. Dos idiomas abren cada puerta del camino.',
    en: 'One language sets you in a corridor for life. Two languages open every door along the way.',
    source: 'Frank Smith, The Book of Learning and Forgetting' },

  { id: 87, cat: 'cita', tag: 'cita_brown',
    es: 'El lenguaje es el mapa de una cultura: te dice de dónde viene su gente y hacia dónde va.',
    en: 'Language is the road map of a culture. It tells you where its people come from and where they are going.',
    source: "Rita Mae Brown, Starting from Scratch: A Different Kind of Writers' Manual (1988), p. 47" },

  { id: 88, cat: 'cita', tag: 'cita_fellini', status: 'debate',
    note: 'Muy citada, pero sin fuente primaria localizada.',
    es: 'Un idioma diferente es una visión diferente de la vida.',
    en: 'A different language is a different vision of life.',
    source: 'Atribuida a Federico Fellini' },

  { id: 89, cat: 'cita', tag: 'cita_proverbio', status: 'debate',
    note: 'Es un proverbio, no una cita de autor confirmado.',
    es: 'Cuantos más idiomas sabes, más veces eres humano.',
    source: 'Proverbio checo (a veces se asocia a T. G. Masaryk)' },

  { id: 90, cat: 'cita', tag: 'cita_brown',
    es: 'El lenguaje ejerce un poder oculto, como la luna sobre las mareas.',
    en: 'Language exerts hidden power, like the moon on the tides.',
    source: 'Rita Mae Brown, Starting from Scratch (1988), p. 58' },

  { id: 91, cat: 'cita', tag: 'cita_mandela', status: 'debate', note: N_SIN_FUENTE,
    es: 'La educación es el arma más poderosa para cambiar el mundo.',
    en: 'Education is the most powerful weapon which you can use to change the world.',
    source: 'Nelson Mandela' },

  { id: 92, cat: 'cita', tag: 'cita_apocrifa', status: 'apocrifa',
    note: 'Atribución dudosa: no hay fuente primaria. Úsese como aforismo anónimo si se incluye.',
    es: 'Aprender nunca agota la mente.',
    source: 'Atribuida a Leonardo da Vinci' },

  /* ── Perspectiva (refuerzo diario, nivel básico) ─────────────────────── */
  { id: 93, cat: 'refuerzo', tag: 'refuerzo_mindset',
    es: 'Hoy sabes más inglés que ayer. Eso ya es avanzar.',
    source: 'Mensaje basado en Dweck (2006), mentalidad de crecimiento' },

  { id: 94, cat: 'refuerzo', tag: 'refuerzo_wtc',
    es: 'No tienes que ser perfecto para comunicarte. Tienes que atreverte.',
    source: 'Basado en MacIntyre et al. (1998), Willingness to Communicate' },

  { id: 95, cat: 'refuerzo', tag: 'refuerzo_meta',
    es: 'Cinco palabras nuevas al día son 1.825 al año. Los pequeños pasos suman.',
    source: 'Basado en Nation (metas léxicas) y en el spacing effect' },

  { id: 96, cat: 'refuerzo', tag: 'refuerzo_input',
    es: 'El silencio también enseña: escuchar mucho antes de hablar es parte del proceso.',
    source: 'Basado en Krashen (input) y el “periodo silencioso”' },

  { id: 97, cat: 'refuerzo', tag: 'refuerzo_mindset',
    es: 'Comparar tu inglés con el de otros no ayuda. Compáralo con el tuyo de hace un mes.',
    source: 'Basado en Zimmerman (autorreflexión) y Dweck' },

  { id: 98, cat: 'refuerzo', tag: 'refuerzo_animo',
    es: 'Todo hablante fluido fue alguna vez principiante nervioso. Tú vas en camino.',
    source: 'Mensaje motivacional (síntesis)' },

  { id: 99, cat: 'refuerzo', tag: 'refuerzo_constancia',
    es: 'Aprender inglés es un maratón, no una carrera de 100 metros. Dosifica y disfruta.',
    source: 'Basado en FSI (horas de estudio) y en el spacing effect' },

  { id: 100, cat: 'refuerzo', tag: 'refuerzo_constancia',
    es: 'El mejor momento para practicar inglés es hoy, aunque sean 10 minutos.',
    source: 'Basado en el efecto de espaciamiento' },

  { id: 101, cat: 'refuerzo', tag: 'refuerzo_animo',
    es: 'Entender una serie sin subtítulos por primera vez se siente increíble. Ese día llegará.',
    source: 'Mensaje basado en el input comprensible' },

  { id: 102, cat: 'refuerzo', tag: 'refuerzo_acento',
    es: 'Tu acento cuenta tu historia. La meta es que te entiendan, no borrar de dónde vienes.',
    source: 'Basado en la investigación sobre inteligibilidad (Derwing & Munro)' },

  { id: 103, cat: 'refuerzo', tag: 'refuerzo_recuperacion',
    es: 'Anota las palabras que te cuestan y repásalas mañana. Mañana serán un poco tuyas.',
    source: 'Basado en la práctica de recuperación espaciada' },

  { id: 104, cat: 'refuerzo', tag: 'refuerzo_empleo',
    es: 'Hablar inglés te abre puertas de estudio, trabajo y amistades por todo el mundo.',
    source: 'British Council (2015); EF EPI 2025' },

  { id: 105, cat: 'refuerzo', tag: 'refuerzo_empleo',
    es: 'No aprendes inglés para el examen. Lo aprendes para tu futuro.',
    source: 'Mensaje alineado con datos de empleabilidad (British Council, 2015)' },
];

/* ============================================================================
   Áreas de expansión
   ----------------------------------------------------------------------------
   Cada área vive en su archivo y declara su `tramo` por ítem. Aquí se les
   estampa `area` y `cat`, para que los archivos de área queden limpios.
   Rangos de id: 1-105 original · 6xx área 6 · 11xx área 11. Los ids son
   ESTABLES: la baraja guardada en localStorage recuerda ids, no posiciones.
   ========================================================================== */

/* El banco original no trae `tramo` por ítem (son 105), así que se deriva de la
   categoría. 1 = entrada (bajar la guardia y dar algo que hacer hoy),
   2 = método, 3 = fondo. */
const TRAMO_POR_CAT = {
  ansiedad: 1, refuerzo: 1,
  ciencia: 2, tips: 2,
  sla: 3, estrategias: 3, bilinguismo: 3, empleabilidad: 3, cita: 3,
};

/* Deduplicación · podios.
   El banco completo repite unos pocos principios muchas veces (18 ítems dicen
   "poco y seguido le gana a mucho de una vez"). La regla acordada: cada
   principio entra al tramo de entrada con SUS TRES MEJORES versiones, y gana la
   aplicada sobre la abstracta. Los demás bajan al fondo — no se borran: los ve
   quien sigue usando la app pasado el semestre, y ahí repetir ya no cansa.

   Aquí van solo los ítems del banco ORIGINAL afectados. Los podios que dependen
   de áreas todavía no transcritas se completarán al integrarlas. */
const TRAMO_POR_ID = {
  // espaciamiento — podio: 6-A5 (605) · orig 26 · 6-B2 (611)
  26: 1,   25: 3, 33: 3, 35: 3, 68: 3, 74: 3, 78: 3, 99: 3, 100: 3,
  // mentalidad de crecimiento — podio: orig 20 · 6-F2 (651) · orig 97
  20: 1, 97: 1,   19: 3, 93: 3,
  // output / producir — podio: 6-B6 (615) · orig 4 · 6-C5 (624)
  4: 1,    5: 3, 66: 3, 67: 3,
  // nervios — podio: orig 44 · orig 43 · (7-F4, pendiente)
  3: 3, 51: 3,
  // recuperación — podio: 6-B2 (611) · (7-F1 y 5-F2, pendientes)
  27: 3, 28: 3, 103: 3,
  // generación — podio: 6-B1 (610) · (8-B6, pendiente)
  32: 3,
  // dificultades deseables — podio: orig 34 · (8-F2, pendiente)
  34: 1,
  // autorregulación — podio: 6-D1 (630) · orig 24 · (7-C11, pendiente)
  24: 1,
};

const conArea = (items, area, cat) =>
  items.map(p => ({ area, cat, ...p }));

export const PHRASES = [
  ...ORIGINAL.map(p => ({
    area: 1,
    tramo: TRAMO_POR_ID[p.id] || TRAMO_POR_CAT[p.cat] || 2,
    ...p,
  })),
  ...conArea(AREA_INTERFERENCIA, 2, 'interferencia'),
  ...conArea(AREA_MICRO, 6, 'micro'),
  ...conArea(AREA_IA, 8, 'ia'),
  ...conArea(AREA_HISTORIA, 10, 'historia'),
  ...conArea(AREA_EVALUACION, 11, 'evaluacion'),
];
