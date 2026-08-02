/* ============================================================================
   Área 10 · Historia del inglés                      ids 1000-1049 · 39 ítems
   ----------------------------------------------------------------------------
   Las reglas del inglés le parecen arbitrarias al alumno porque nadie le cuenta
   de dónde salieron. Esta área las convierte en historias: no enseña a usar la
   estructura, enseña por qué la estructura es así.

   FUNCIÓN EN LA BARAJA: es el bloque de descanso. Se intercala después de una
   racha exigente (interferencia, evaluaciones) para que la app respire y no
   parezca que siempre está pidiendo algo. Frecuencia baja, uno cada 7-10 días.

   El bloque A (Lieberman et al., Nature) es el respaldo más sólido de TODO el
   banco: cifras exactas, verificables, y con beneficio pedagógico directo —
   le explica al alumno por qué vale la pena memorizar justamente esos verbos.

   CORTADOS respecto del documento original:
   · G3 (el inglés se simplificó por contacto con el nórdico) — la causa está en
     debate entre historiadores de la lengua y no hay consenso. Es el único ítem
     del área que hacía una afirmación causal discutida.
   · A5 (la fórmula de la vida media) — demasiado técnico.
   · A9 ("la frecuencia protege a los verbos igual que a ti el repaso") — la
     analogía es forzada y además es un ítem de espaciamiento disfrazado, que ya
     tiene su podio.
   · E1 — se solapa con E2, que dice lo mismo mejor.
   · C4 y C5 van FUNDIDOS en uno (1020). C4 solo ("las reglas las inventaron
     unos señores del siglo XVIII") es el riesgoso; C5 solo es una advertencia
     sin gancho. Juntos son un pensamiento completo, y así se elimina una regla
     de adyacencia en vez de agregarla.
   ========================================================================== */
export default [
  /* ── A · Los verbos irregulares tienen historia ────────────────────── */
  { id: 1000, tramo: 1, tag: 'curiosidad_verbos', estructura: 'irregular_verbs',
    es: 'Menos del 3% de los verbos ingleses son irregulares. El problema es que ese 3% incluye los 10 más usados: be, have, do, go, say, can, will, see, take, get.',
    source: 'Lieberman, Michel, Jackson, Tang & Nowak (2007), Nature 449(7163), 713-716' },

  { id: 1001, tramo: 2, tag: 'curiosidad_verbos', estructura: 'past_simple', nivel: 'basico2',
    es: 'Los verbos irregulares son restos de reglas de conjugación que el inglés abandonó. Antes había siete formas de conjugar; sobrevivió una: -ed.',
    source: 'Lieberman et al. (2007), Nature' },

  { id: 1002, tramo: 2, tag: 'curiosidad_verbos', estructura: 'irregular_verbs',
    es: 'Hace 1.200 años el inglés tenía 177 verbos irregulares. Hoy quedan 98. Se están extinguiendo de a poco.',
    source: 'Lieberman et al. (2007), Nature — seguimiento de 177 verbos del inglés antiguo' },

  { id: 1003, tramo: 2, tag: 'curiosidad_verbos', estructura: 'irregular_verbs',
    es: 'Help, walk, work y reach eran irregulares. Se volvieron regulares con el tiempo. Los que te cuestan hoy son los sobrevivientes.',
    source: 'Lieberman et al. (2007), Nature' },

  { id: 1004, tramo: 2, tag: 'curiosidad_verbos', estructura: 'verb_be', nivel: 'basico1',
    es: '“Be” tiene una vida media estimada de 38.800 años como verbo irregular. No lo vas a esquivar: apréndetelo.',
    source: 'Lieberman et al. (2007), Nature; cálculos difundidos por Harvard Gazette' },

  { id: 1005, tramo: 2, tag: 'curiosidad_verbos', estructura: 'irregular_verbs',
    es: 'El próximo verbo en volverse regular sería “wed”. Los investigadores bromearon: los casados del futuro tendrán que conformarse con “wedded”.',
    source: 'Lieberman et al. (2007), Nature' },

  { id: 1006, tramo: 1, tag: 'curiosidad_verbos', estructura: 'irregular_verbs',
    es: 'Todos los verbos nuevos que entran al inglés son regulares. “Google” nació con “googled”. La irregularidad ya no se produce.',
    source: 'Lieberman et al. (2007), Nature' },

  /* ── B · Por qué el inglés perdió casi toda su gramática visible ───── */
  { id: 1010, tramo: 2, tag: 'curiosidad_historia',
    es: 'El inglés antiguo conjugaba y declinaba como el alemán. Perdió casi todas esas terminaciones. Por eso hoy te cuesta menos que otros idiomas.',
    source: 'Baugh & Cable, A History of the English Language; Crystal, The Cambridge Encyclopedia of the English Language' },

  { id: 1011, tramo: 2, tag: 'curiosidad_historia',
    es: 'El inglés antiguo tenía género gramatical: las palabras eran masculinas, femeninas o neutras, como en español. Lo perdió por completo.',
    source: 'Baugh & Cable; Crystal' },

  { id: 1012, tramo: 1, tag: 'curiosidad_historia',
    es: 'Buena noticia histórica: el inglés es el único idioma germánico grande que se deshizo del género gramatical. Una cosa menos que memorizar.',
    source: 'Crystal, The Cambridge Encyclopedia of the English Language' },

  { id: 1013, tramo: 2, tag: 'curiosidad_historia', estructura: 'word_order',
    es: 'Cuando un idioma pierde las terminaciones, necesita otra forma de marcar quién hace qué. El inglés eligió el orden fijo de palabras.',
    source: 'Baugh & Cable; literatura sobre tipología y pérdida de flexión' },

  { id: 1014, tramo: 2, explica: 212, tag: 'curiosidad_contraste', estructura: 'word_order',
    es: 'Por eso el orden Sujeto-Verbo-Objeto es tan rígido en inglés y tan flexible en español: el español todavía conserva las marcas que el inglés perdió.',
    source: 'Análisis contrastivo; Swan & Smith (2001)' },

  { id: 1015, tramo: 2, explica: 241, tag: 'curiosidad_historia', estructura: 'present_simple', nivel: 'basico1',
    es: 'La -s de tercera persona es el último resto de un sistema de terminaciones que tenía una para cada persona. Sobrevivió solo ella.',
    source: 'Baugh & Cable; Crystal' },

  { id: 1016, tramo: 2, tag: 'curiosidad_historia', estructura: 'present_simple', nivel: 'basico1',
    es: 'Antes se decía “he goeth”. La forma -eth del sur perdió contra la -s del norte. Tu -s ganó una guerra dialectal.',
    source: 'Historia de la morfología verbal inglesa (Baugh & Cable; Crystal)' },

  { id: 1017, tramo: 1, tag: 'curiosidad_contraste', estructura: 'vocabulary',
    es: 'El inglés es un idioma germánico, pero más de la mitad de su vocabulario viene del latín y el francés. Por eso reconoces tantas palabras.',
    source: 'Crystal, The Cambridge Encyclopedia of the English Language' },

  /* ── C · Reglas que en realidad fueron inventadas ──────────────────── */
  { id: 1020, tramo: 3, tag: 'curiosidad_regla',
    es: 'Algunas “reglas” del inglés no describen cómo se habla: describen cómo unos señores del siglo XVIII creyeron que debía hablarse. Saber de dónde vienen ayuda a no idealizarlas — pero la norma existe y se evalúa igual.',
    source: 'Crystal, sobre la tradición prescriptivista; distinción descriptivo/prescriptivo en lingüística' },

  /* Sube del tramo 3 al 2 para poder encadenarse al 230. Acompañado de su
     corrección es MÁS seguro que suelto: "la doble negación era correcta"
     aterriza mucho mejor tres días después de "en inglés estándar va una sola". */
  { id: 1021, tramo: 2, explica: 230, tag: 'curiosidad_regla', estructura: 'negation', nivel: 'basico1',
    es: 'La doble negación era correcta en inglés antiguo y medieval. Chaucer la usaba. Se volvió “error” recién en el siglo XVIII.',
    source: 'Baugh & Cable; historia del prescriptivismo inglés' },

  { id: 1022, tramo: 3, tag: 'curiosidad_regla', estructura: 'infinitives',
    es: 'La prohibición de dividir el infinitivo (“to boldly go”) la inventaron gramáticos que querían que el inglés se pareciera al latín.',
    source: 'Historia del prescriptivismo gramatical inglés (Crystal; Baugh & Cable)' },

  { id: 1023, tramo: 3, tag: 'curiosidad_regla', estructura: 'prepositions',
    es: 'La regla de no terminar una frase con preposición también viene del latín. En inglés real, “the person I talked to” es lo natural.',
    source: 'Crystal; historia del prescriptivismo' },

  /* ── D · El misterio del “do” ──────────────────────────────────────── */
  { id: 1030, tramo: 2, explica: 220, tag: 'curiosidad_auxiliar', estructura: 'questions_do', nivel: 'basico1',
    es: 'El “do” de las preguntas no existía en inglés antiguo. Se decía “Know you not?” — como en español, solo invirtiendo.',
    source: 'Historia del do-support (Baugh & Cable; Denison, English Historical Syntax)' },

  { id: 1031, tramo: 2, tag: 'curiosidad_auxiliar', estructura: 'questions_do', nivel: 'basico1',
    es: 'Shakespeare todavía escribía preguntas sin “do”. El auxiliar se volvió obligatorio recién en los últimos siglos.',
    source: 'Denison, English Historical Syntax; Baugh & Cable' },

  { id: 1032, tramo: 1, tag: 'curiosidad_auxiliar', estructura: 'questions_do', nivel: 'basico1',
    es: 'El inglés es raro entre los idiomas del mundo por exigir un auxiliar para preguntar y negar. No eres tú: es el idioma.',
    source: 'Tipología del do-support; Denison' },

  { id: 1033, tramo: 2, tag: 'curiosidad_auxiliar', estructura: 'future_forms', nivel: 'elemental2',
    es: 'El inglés no tiene tiempo futuro real. “Will” es un verbo modal que originalmente significaba “querer”.',
    source: 'Baugh & Cable; historia de los modales ingleses' },

  { id: 1034, tramo: 3, tag: 'curiosidad_auxiliar', estructura: 'modals', nivel: 'basico2',
    es: '“Shall” y “will” eran verbos con significado propio: deber y querer. Con los siglos se vaciaron y quedaron como marcas de futuro.',
    source: 'Historia de la gramaticalización de los modales ingleses' },

  { id: 1035, tramo: 2, explica: 243, tag: 'curiosidad_auxiliar', estructura: 'present_perfect', nivel: 'elemental2',
    es: '“Have” pasó de significar “poseer” a ser el auxiliar del present perfect. “I have eaten” era literalmente “tengo comido”.',
    source: 'Historia del perfecto en lenguas germánicas y románicas' },

  { id: 1036, tramo: 2, tag: 'curiosidad_contraste', estructura: 'present_perfect', nivel: 'elemental2',
    es: 'El español hizo el mismo camino con “haber”. Por eso “he comido” y “I have eaten” se parecen: son parientes estructurales.',
    source: 'Gramaticalización paralela del perfecto en inglés y español' },

  /* ── E · Pronombres con historia ───────────────────────────────────── */
  { id: 1040, tramo: 2, tag: 'curiosidad_pronombre', estructura: 'pronouns',
    es: 'Cuando dices “you” a tu profesor y a tu amigo, estás usando la forma que antes era solo de respeto. El inglés eliminó el tuteo, no el usted.',
    source: 'Crystal; historia de los pronombres ingleses' },

  { id: 1041, tramo: 1, tag: 'curiosidad_pronombre', estructura: 'pronouns',
    es: 'El inglés no tiene un “ustedes” oficial. Por eso inventó soluciones regionales como “you guys” o “y’all”.',
    source: 'Crystal; dialectología del inglés' },

  { id: 1042, tramo: 3, tag: 'curiosidad_pronombre', estructura: 'pronouns',
    es: '“They” se usa en singular para una persona de género no especificado desde hace siglos, mucho antes del debate actual.',
    source: 'Documentación histórica del singular “they” (Oxford English Dictionary; Crystal)' },

  { id: 1043, tramo: 2, explica: 200, tag: 'curiosidad_contraste', estructura: 'subject_pronouns', nivel: 'basico1',
    es: 'El inglés obliga a poner el sujeto porque perdió las terminaciones que lo indicaban. El español no lo necesita porque las conserva.',
    source: 'Tipología pro-drop; Swan & Smith (2001)' },

  /* ── F · Espejos con el español ────────────────────────────────────── */
  { id: 1044, tramo: 1, tag: 'curiosidad_contraste', estructura: 'adjective_order', nivel: 'basico1',
    es: 'El adjetivo va antes en inglés y después en español. No es capricho: son dos soluciones distintas al mismo problema.',
    source: 'Tipología del orden de constituyentes' },

  { id: 1045, tramo: 2, explica: 211, tag: 'curiosidad_contraste', estructura: 'adjectives', nivel: 'basico1',
    es: 'En inglés los adjetivos no cambian: “red car”, “red cars”. Es una de las pocas veces que el inglés te hace la vida más fácil.',
    source: 'Swan & Smith (2001)' },

  { id: 1046, tramo: 3, tag: 'curiosidad_contraste', estructura: 'conditionals',
    es: 'El inglés no tiene subjuntivo vivo como el español. Lo que queda son restos: “If I were you”.',
    source: 'Crystal; gramática histórica del subjuntivo inglés' },

  { id: 1047, tramo: 2, explica: 264, tag: 'curiosidad_contraste', estructura: 'prepositions',
    es: 'El inglés distingue “in”, “on” y “at” donde el español usa “en” para todo. No hay traducción posible: hay que aprenderlas de a una.',
    source: 'Swan & Smith (2001)' },

  { id: 1048, tramo: 2, tag: 'curiosidad_contraste', estructura: 'vocabulary',
    es: 'Muchas palabras difíciles del inglés académico vienen del latín. Si es larga y culta, probablemente la reconoces desde el español.',
    source: 'Crystal, sobre el componente latino-romance del léxico inglés' },

  { id: 1049, tramo: 1, tag: 'curiosidad_contraste', estructura: 'vocabulary',
    es: 'El inglés tomó del español palabras como “patio”, “plaza”, “cargo”, “ranch” y “tornado”. El intercambio va en las dos direcciones.',
    source: 'Crystal; historia de los préstamos léxicos' },

  /* ── G · Metamensajes ──────────────────────────────────────────────── */
  { id: 1060, tramo: 1, tag: 'curiosidad_meta',
    es: 'Ninguna regla del inglés nació para molestarte. Todas son el resultado de siglos de gente hablando y simplificando.',
    source: 'Síntesis del área' },

  { id: 1061, tramo: 3, tag: 'curiosidad_meta',
    es: 'Los idiomas cambian. Lo que hoy es “error” puede ser la norma en cien años, y al revés.',
    source: 'Lieberman et al. (2007); historia del prescriptivismo' },

  { id: 1062, tramo: 2, tag: 'curiosidad_meta',
    es: 'Entender de dónde viene una regla no reemplaza practicarla. Pero hace que se te quede mejor.',
    source: 'Basado en el efecto de elaboración en memoria' },
];
