/* ============================================================================
   Área 5 · Sueño y memoria                            ids 500-549 · 33 ítems
   ----------------------------------------------------------------------------
   La gramática no se aprende solo en clase: buena parte del trabajo ocurre
   después, mientras el cerebro consolida las reglas. Sobre todo durmiendo.

   ESCRITA AL REVÉS PARA EL VESPERTINO. El documento original le hablaba a
   alguien que ELIGE cuánto duerme. El alumno de este curso no elige: sale del
   trabajo a las 21:00. Así que el área se dio vuelta — no es higiene del sueño,
   es "tu horario nocturno juega a tu favor":
   · El ítem 507 (estudiar de noche y dormir después aprovecha la ventana de
     consolidación) sube a CABEZA de área. Nadie le ha dicho nunca a un
     vespertino que su horario tiene una ventaja medida.
   · El ítem estrella pasa a ser el 513: repasar 5 minutos antes de dormir.
     Cinco minutos, en la cama, con el teléfono en la mano — la única franja
     que este alumno tiene garantizada todos los días.

   EL MATIZ QUE HACE HONESTA AL ÁREA (bloque B): el sueño consolidó la gramática
   SOLO en quienes se habían dado cuenta conscientemente de la regla antes de
   acostarse. Dormir no reemplaza el estudio, lo amplifica. Un banco que dijera
   "duerme y aprenderás" distorsionaría el hallazgo y además regalaría una
   excusa. El mensaje es secuencial: notar → dormir → repasar.

   CORTADOS (9) — todos por el mismo motivo, hablarle a quien no elige:
   · C2 "dormir poco reduce tu capacidad de fijar": dato cierto, cero acción,
     puro reproche.
   · C3 "trasnochar antes de la prueba es doblemente malo": trasnocha porque es
     su única ventana. (Su gemelo, el F5 del área 7, también sale.)
   · F4 "estudia cuando estés más despierto": su único horario es cuando está
     más cansado. Este ítem le dice que estudia mal por trabajar.
   · D1-D5 (ejercicio): "pedalea mientras estudias vocabulario" a alguien que
     llega a las 21:00. Además D1 cita a Winter A TRAVÉS de Liu —cita de segunda
     mano— y con una cifra. Y D5 duplica el 626 del área de rutinas cortas.
   · E4 "hacer ejercicio antes de estudiar mejora el ánimo": mismo problema.

   NO se incluye ningún ítem sobre reactivación durante el sueño (poner audios
   en inglés mientras duermes): es investigación real pero preliminar, y no hay
   base para convertirla en consejo.
   ========================================================================== */
export default [
  /* ── El horario nocturno como ventaja ──────────────────────────────── */
  { id: 507, tramo: 1, tag: 'sueno_habito',
    es: 'Si estudias de noche y te vas a dormir después, estás usando el mejor horario posible: tu cerebro consolida justo lo que viste antes de dormir.',
    source: 'Kim & Nam (2020), “Sleep-dependent consolidation of second language grammar knowledge”, Studies in Second Language Acquisition 42(5), 1107-1120 — diseños mañana/noche' },

  { id: 513, tramo: 1, tag: 'sueno_habito',
    es: 'Repasar 5 minutos justo antes de dormir es de los usos más eficientes de tu tiempo.',
    source: 'Kim & Nam (2020), SSLA 42(5); Dumay & Gaskell (2007), Psychological Science' },

  /* ── A · El sueño consolida la gramática ───────────────────────────── */
  { id: 500, tramo: 2, tag: 'sueno_consolidacion',
    es: 'Mientras duermes, tu cerebro sigue trabajando en las reglas gramaticales que viste durante el día. La clase no termina cuando cierras el cuaderno.',
    source: 'Kim & Nam (2020), SSLA 42(5), 1107-1120' },

  { id: 501, tramo: 2, tag: 'sueno_evidencia',
    es: 'En un estudio con 100 participantes que aprendieron dos reglas del alemán, dormir mejoró la capacidad de aplicar la regla a casos nuevos.',
    source: 'Kim & Nam (2020), SSLA 42(5)' },

  { id: 502, tramo: 2, tag: 'sueno_consolidacion',
    es: 'Dormir ayuda especialmente a GENERALIZAR: pasar de “me sé el ejemplo” a “sé usar la regla en frases nuevas”.',
    source: 'Kim & Nam (2020); revisión en Brain and Language sobre sueño y aprendizaje de lenguas' },

  { id: 503, tramo: 2, tag: 'sueno_consolidacion', estructura: 'vocabulary',
    es: 'Las palabras nuevas se integran a tu vocabulario mental durante la noche, no en el momento en que las lees.',
    source: 'Dumay & Gaskell (2007), Psychological Science — consolidación léxica dependiente del sueño' },

  { id: 504, tramo: 2, tag: 'sueno_consolidacion',
    es: 'Aprender una regla y dormir sobre ella funciona mejor que aprenderla y seguir de largo hasta la noche siguiente.',
    source: 'Investigación sobre consolidación offline en aprendizaje de morfología de lenguas artificiales',
    status: 'debate',
    note: 'La consolidación específica de reglas gramaticales de L2 se ha estudiado sobre todo con lenguas artificiales en laboratorio, con reglas simples y sesiones únicas. Los efectos existen pero son modestos y condicionales.' },

  { id: 505, tramo: 2, tag: 'sueno_evidencia',
    es: 'En un experimento clásico, el 59% de quienes durmieron descubrieron el patrón oculto de una tarea, frente al 23% de quienes no durmieron.',
    source: 'Wagner, Gais, Haider, Verleger & Born (2004), Nature — sueño e insight sobre estructuras abstractas' },

  { id: 506, tramo: 2, tag: 'sueno_consolidacion',
    es: 'Detectar patrones es exactamente lo que haces al aprender gramática. Y dormir te hace mejor detectando patrones.',
    source: 'Wagner et al. (2004), Nature; St. Clair & Monaghan sobre abstracción lingüística durante el sueño' },

  /* ── B · La condición clave: notar antes de dormir ─────────────────── */
  { id: 510, tramo: 2, tag: 'sueno_condicion',
    es: 'Dormir consolidó la gramática solo en quienes se habían dado cuenta conscientemente de la regla antes de acostarse. Primero notas, después duermes.',
    source: 'Kim & Nam (2020), SSLA 42(5) — hallazgo principal del estudio' },

  { id: 511, tramo: 1, tag: 'sueno_condicion',
    es: 'El sueño no aprende por ti. Amplifica lo que alcanzaste a entender despierto.',
    source: 'Kim & Nam (2020), SSLA 42(5)' },

  { id: 512, tramo: 1, tag: 'sueno_habito',
    es: 'Antes de dormir, pregúntate: ¿cuál era la regla de hoy? Si puedes decirla en voz alta, tu cerebro tiene con qué trabajar.',
    source: 'Aplicación de Kim & Nam (2020) y de Schmidt (1990), Noticing Hypothesis' },

  { id: 514, tramo: 2, tag: 'sueno_condicion',
    es: 'Si terminaste la clase sin entender la regla, no esperes que la noche la resuelva. Pregunta antes de irte.',
    source: 'Kim & Nam (2020) — sin conciencia previa de la regla, no hubo consolidación' },

  /* ── C · Horarios, siestas y ritmo ─────────────────────────────────── */
  { id: 520, tramo: 2, tag: 'sueno_siesta',
    es: 'Una siesta corta después de estudiar también consolida. No hace falta esperar a la noche: sirve el trayecto de vuelta.',
    source: 'Investigación sobre siestas y consolidación de memoria (Mednick et al.)' },

  { id: 521, tramo: 2, tag: 'sueno_consolidacion',
    es: 'La consolidación toma tiempo: algunas reglas se estabilizan recién tras dos noches, no una.',
    source: 'Estudios sobre el timing de la consolidación en aprendizaje de flexiones morfológicas (12 h vs 36 h)' },

  { id: 522, tramo: 2, tag: 'habito_rutina',
    es: 'Estudia inglés a la misma hora todos los días. La rutina le ahorra al cerebro la decisión de empezar.',
    source: 'Literatura sobre formación de hábitos y señales contextuales' },

  { id: 523, tramo: 1, tag: 'habito_espaciado',
    es: 'Deja pasar una noche entre que aprendes una estructura y que la practicas. Ese intervalo es parte del método.',
    source: 'Efecto de espaciamiento (Cepeda et al., 2006) + consolidación offline' },

  /* ── D · Movimiento (solo lo que no pide tiempo extra) ─────────────── */
  { id: 530, tramo: 2, tag: 'cuerpo_ejercicio',
    es: 'Repasa las estructuras de la semana caminando y diciéndolas en voz alta. Cuerpo en movimiento, regla en la boca.',
    source: 'Schmidt-Kassow et al. (2013), PLOS ONE + práctica de recuperación' },

  /* ── E · Estrés, ánimo y atención ──────────────────────────────────── */
  { id: 540, tramo: 3, tag: 'mente_estres',
    es: 'El estrés alto compite por los mismos recursos que necesitas para procesar gramática. Estudiar angustiado rinde menos.',
    source: 'Krashen, Affective Filter Hypothesis (1985); literatura sobre estrés y memoria de trabajo' },

  { id: 541, tramo: 1, tag: 'mente_atencion',
    es: 'Estudiar 20 minutos tranquilo rinde más que 2 horas con la cabeza en otra parte.',
    source: 'Literatura sobre atención, carga cognitiva y aprendizaje' },

  { id: 542, tramo: 2, tag: 'mente_atencion',
    es: 'El teléfono al lado te roba atención aunque no lo mires. Déjalo lejos mientras practicas estructuras nuevas.',
    source: 'Investigación sobre presencia del smartphone y capacidad cognitiva disponible' },

  { id: 543, tramo: 1, tag: 'mente_pausa',
    es: 'Una regla no entra a la fuerza. Si llevas 40 minutos trabados, para y vuelve mañana: la noche ayuda.',
    source: 'Kim & Nam (2020); Wagner et al. (2004)' },

  /* ── F · Rutinas de estudio gramatical ─────────────────────────────── */
  { id: 550, tramo: 3, tag: 'habito_dosis',
    es: 'Una estructura por semana, revisada tres veces, vale más que cinco estructuras vistas una vez.',
    source: 'Efecto de espaciamiento (Cepeda et al., 2006); práctica de recuperación (Roediger & Karpicke, 2006)' },

  { id: 551, tramo: 1, tag: 'habito_repaso',
    es: 'Empieza cada sesión repasando la regla de la sesión anterior. Tres minutos que evitan olvidar todo.',
    source: 'Karpicke & Roediger (2008), Science' },

  { id: 552, tramo: 3, tag: 'habito_produccion',
    es: 'Cierra cada sesión escribiendo una frase propia con la estructura del día. Tuya, no del libro.',
    source: 'Efecto de generación (Slamecka & Graf, 1978); Swain (1985)' },

  { id: 553, tramo: 3, tag: 'habito_espaciado',
    es: 'Sesiones cortas y frecuentes le dan a tu cerebro más noches de consolidación. Ahí está la ventaja real de estudiar seguido.',
    source: 'Efecto de espaciamiento + consolidación dependiente del sueño' },

  { id: 554, tramo: 2, tag: 'habito_repaso',
    es: 'Anota la regla del día en una sola línea antes de cerrar el cuaderno. Ese resumen es tu material de consolidación.',
    source: 'Aplicación de Kim & Nam (2020) + autoexplicación (Chi et al., 1994)' },

  { id: 555, tramo: 3, tag: 'habito_espaciado',
    es: 'Volver a escuchar en inglés lo mismo varias veces en días distintos consolida mejor que escucharlo diez veces hoy.',
    source: 'Efecto de espaciamiento (Cepeda et al., 2006)' },

  { id: 556, tramo: 3, tag: 'habito_interleaving',
    es: 'No estudies todo en bloque: alterna estructuras distintas dentro de la misma sesión.',
    source: 'Rohrer & Taylor (2007), interleaving' },

  /* ── G · Metamensajes ──────────────────────────────────────────────── */
  { id: 560, tramo: 2, tag: 'cerebro_meta',
    es: 'Aprender gramática no es solo estudiar: es estudiar, dormir, repasar y volver. El ciclo completo.',
    source: 'Síntesis del área' },

  { id: 561, tramo: 1, tag: 'cerebro_meta',
    es: 'Si una estructura te sale hoy y mañana no, no la olvidaste: no alcanzó a consolidarse. Repasa y vuelve.',
    source: 'Literatura sobre consolidación offline y estabilización de memoria' },

  { id: 562, tramo: 3, tag: 'cerebro_meta',
    es: 'Tu cerebro necesita tiempo, no solo esfuerzo. Por eso la constancia le gana al maratón de última hora.',
    source: 'Consolidación dependiente del sueño + efecto de espaciamiento' },

  { id: 563, tramo: 2, tag: 'cerebro_meta',
    es: 'Dormir bien, moverte y estudiar seguido no son consejos de bienestar: son parte del método para aprender inglés.',
    source: 'Síntesis del área' },
];
