# Banco "Frase del día" — Área 11: Tu rúbrica, con números

**20 ítems** derivados de las rúbricas reales de writing y speaking del curso.
Campos `estructura`, `nivel` y `tag` para uso programático.

**Por qué existe esta área.** El Área 7 describe el MCER, que **pondera
comprensión**. Las rúbricas de este curso **cuentan errores**. No es un matiz: a
los 4 errores ya bajas a 60% en gramática aunque todo se entienda perfecto. Seis
ítems del Área 7 no solo son imprecisos, le enseñan al alumno a puntuar peor (ver
"Correcciones al Área 7" al final).

Estos son los únicos ítems del banco entero que hablan de **la evaluación real
del alumno** y no de un estándar internacional. Fuente: sus propias rúbricas, que
además es la fuente más verificable de todas — el alumno la tiene en la mano.

## La regla que gobierna esta área

> **La rúbrica sirve para revelar lo que el alumno subestima, nunca para
> contradecir una buena práctica.**

Estas rúbricas tienen partes mal diseñadas, y el docente lo sabe. Dos ejemplos
que él mismo levantó:

- **Las autocorrecciones cuentan como interrupciones** en el criterio de fluidez.
  Corregirse es monitoreo — la señal de que el hablante está controlando su
  producción — y penalizarlo es al revés de lo que se quiere enseñar.
- **El 100% de gramática y pronunciación en el oral de intermedio alto exige cero
  errores.** Eso no lo cumple un hablante nativo: la conversación espontánea está
  llena de reparaciones y falsos arranques.

Un docente con criterio no aplica eso a rajatabla. Así que **donde la rúbrica y
la pedagogía chocan, gana la pedagogía y el ítem no se escribe.** Lo que sí se
usa de la rúbrica es lo que el alumno de verdad ignora y le cuesta puntos con
razón: que la extensión pesa más que la gramática, que la ortografía es un
criterio propio, y que el vocabulario de la unidad se cuenta.

---

## Las rúbricas, en limpio

**Writing — 12 puntos**

| Criterio | 100% | 80% | 60% | 30% | 0% |
|---|---|---|---|---|---|
| Coherencia y extensión | **4** | 3,2 | 2,4 | 1,2 | 0 |
| Vocabulario | **3** | 2,4 | 1,8 | 0,9 | 0 |
| Gramática | **3** | 2,4 | 1,8 | 0,9 | 0 |
| Ortografía | **2** | 1,6 | 1,2 | 0,6 | 0 |

- **Extensión** (palabras, umbral del 100%): básico 40 · elemental 60 ·
  intermedio 80 · intermedio alto 100
- **Vocabulario** (palabras del vocabulario aprendido, umbral del 100%):
  básico/elemental/intermedio 6 · intermedio alto 10
- **Gramática** (errores): 0-1 / 2-3 / 4-5 / 6-7 / 8+
- **Ortografía** (errores): 0-2 / 3-4 / 5-6 / 7-8 / 9+

**Speaking — 12 puntos**

| Criterio | 100% | 80% | 60% | 30% | 0% |
|---|---|---|---|---|---|
| Coherencia y fluidez | **4** | 3,2 | 2,4 | 1,2 | 0 |
| Vocabulario | **3** | 2,4 | 1,8 | 0,9 | 0 |
| Gramática | **3** | 2,4 | 1,8 | 0,9 | 0 |
| Pronunciación | **2** | 1,6 | 1,2 | 0,6 | 0 |

- **Fluidez** (interrupciones **o autocorrecciones**): básico-intermedio
  ≤3 / ≤4 / ≤5 / 6-7 / 8+ · intermedio alto ≤2 / ≤3 / ≤4 / 5-6 / 7+
- **Gramática**: básico-intermedio 0-1 / 2-3 / 4-5 / 6-7 / 8+ ·
  **intermedio alto 0 / 1-2 / 3-4 / 5-6 / 7+**
- **Pronunciación**: básico-intermedio 0-2 / 3-4 / 5-6 / 7-8 / 9+ ·
  **intermedio alto 0 / 1-2 / 3-4 / 5-6 / 7+**

**Mapeo con los niveles de la app:** `basico1`/`basico2` → básico ·
`elemental1`/`elemental2` → elemental · `intermedio1`/`intermedio2` → intermedio ·
`avanzado` → intermedio alto.

---

## BLOQUE A — Cómo se reparten los puntos

**R1.** ES: "Tu prueba escrita reparte 12 puntos: 4 por extensión y coherencia, 3 por vocabulario, 3 por gramática y 2 por ortografía. La gramática es un cuarto de la nota, no toda."
*Fuente:* Rúbrica de writing del curso.
`estructura: general` | `nivel: básico` | `tag: rubrica_pesos`

**R2.** ES: "Escribir suficiente vale más que escribir perfecto. En básico, 40 palabras con 3 errores dan 6,4 puntos; 25 palabras impecables dan 5,4."
Cálculo: 40 palabras = extensión 4,0 + 3 errores = gramática 2,4 → **6,4** · 25 palabras = extensión 2,4 + 0 errores = gramática 3,0 → **5,4**
*Fuente:* Rúbrica de writing, nivel básico.
`estructura: general` | `nivel: básico` | `tag: rubrica_extension`

**R3.** ES: "La extensión es el único criterio que puedes asegurar antes de entrar a la prueba: ya sabes cuántas palabras te piden. Practica llegar a esa cifra."
Umbrales del 100%: básico 40 · elemental 60 · intermedio 80 · intermedio alto 100
*Fuente:* Rúbrica de writing, criterio de coherencia y extensión.
`estructura: general` | `nivel: básico` | `tag: rubrica_extension`

**R4.** ES: "Llegar al número de palabras no es rellenar. Repetir la misma idea con otras palabras no suma extensión: suma incoherencia, que se evalúa en el mismo criterio."
*Fuente:* Rúbrica de writing — el criterio es "coherencia y extensión", las dos cosas juntas.
`estructura: general` | `nivel: intermedio` | `tag: rubrica_extension`

---

## BLOQUE B — El conteo de errores

**R5.** ES: "Empieza por los errores fáciles. En tu rúbrica cada error suma al conteo, así que el descuido más tonto te cuesta lo mismo que el más difícil de arreglar."
*Fuente:* Rúbrica de writing y speaking, criterio de gramática por número de casos.
`estructura: general` | `nivel: básico` | `tag: rubrica_conteo`

**R6.** ES: "Corregir UN error puede valer hasta 0,9 puntos. Pasar de 6 errores a 5 te sube de 0,9 a 1,8 en gramática. Un error, casi un punto."
*Fuente:* Rúbrica de writing, tramos del criterio de gramática (6-7 errores = 30%, 4-5 = 60%).
`estructura: general` | `nivel: básico` | `tag: rubrica_conteo`

**R7.** ES: "Gramática y ortografía suman 5 de los 12 puntos, y las dos se califican contando. El 42% de tu nota es literalmente cuántos errores se te pasaron."
*Fuente:* Rúbrica de writing (gramática 3 pts + ortografía 2 pts).
`estructura: general` | `nivel: intermedio` | `tag: rubrica_conteo`

**R8.** ES: "Un error sistemático te cuesta más que uno aislado, pero no porque pese más: porque aparece muchas veces y cada aparición se cuenta por separado."
*Fuente:* Rúbrica de writing, criterio de gramática por número de casos.
`estructura: general` | `nivel: intermedio` | `tag: rubrica_conteo`

**R9.** ES: "Olvidar la -s de tercera persona es el error más barato de eliminar que tienes. Con una rúbrica que cuenta, los errores fáciles son el mejor negocio."
*Fuente:* Rúbrica de writing (conteo) + Swan & Smith (2001) sobre la -s como error de transferencia frecuente.
`estructura: present_simple` | `nivel: básico` | `tag: rubrica_prioridad`

---

## BLOQUE C — Los tres minutos de revisión

**R10.** ES: "Tres minutos de revisión pueden valer un punto entero: dos faltas de ortografía y un error de gramática menos suman 1,0 en tu rúbrica."
Cálculo: ortografía de 5 a 3 errores = 1,2 → 1,6 (**+0,4**) · gramática de 4 a 3 = 1,8 → 2,4 (**+0,6**)
*Fuente:* Rúbrica de writing, tramos de ortografía y gramática.
`estructura: general` | `nivel: básico` | `tag: rubrica_revision`

**R11.** ES: "La ortografía es un criterio propio de 2 puntos, no un detalle. Con 3 faltas ya bajaste del 100%. Revísala aparte de la gramática, en otra pasada."
*Fuente:* Rúbrica de writing, criterio de ortografía (máximo 2 errores para el 100%).
`estructura: general` | `nivel: básico` | `tag: rubrica_ortografia`

**R12.** ES: "Revisa buscando un solo tipo de error por pasada. Tu rúbrica separa gramática de ortografía; revísalas separadas tú también."
*Fuente:* Rúbrica de writing (criterios independientes) + literatura sobre autoedición y carga cognitiva.
`estructura: general` | `nivel: intermedio` | `tag: rubrica_revision`

---

## BLOQUE D — El vocabulario es una lista, no una impresión

**R13.** ES: "El vocabulario no se evalúa 'a ojo': se cuentan las palabras de la unidad que usaste bien. En básico son 6 para el 100%."
*Fuente:* Rúbrica de writing y speaking, criterio de vocabulario.
`estructura: vocabulary` | `nivel: básico` | `tag: rubrica_vocabulario`

**R14.** ES: "Pasar de 4 a 6 palabras de la unidad sube 1,2 puntos sin escribir mejor inglés. Es el único criterio que puedes subir eligiendo qué palabras usar."
Cálculo: vocabulario de 4 palabras = 1,8 → 6 palabras = 3,0
*Fuente:* Rúbrica de writing, criterio de vocabulario, nivel básico.
`estructura: vocabulary` | `nivel: básico` | `tag: rubrica_vocabulario`

**R15.** ES: "Antes de la prueba, anota 8 palabras de la unidad y úsalas. El criterio dice 'vocabulario aprendido': se refiere al del curso, no a cualquiera que sepas."
*Fuente:* Rúbrica de writing y speaking, redacción del criterio de vocabulario.
`estructura: vocabulary` | `nivel: básico` | `tag: rubrica_vocabulario`

**R16.** ES: "En intermedio alto la vara del vocabulario sube a 10 palabras para el 100%. Es el único criterio que cambia de exigencia entre niveles en el escrito."
*Fuente:* Rúbrica de writing, criterio de vocabulario, nivel intermedio alto.
`estructura: vocabulary` | `nivel: avanzado` | `tag: rubrica_vocabulario`

---

## BLOQUE E — Oral

**R17.** ES: "Si te equivocas hablando, corrígete y sigue. Darte cuenta del error mientras hablas es control del idioma, no debilidad: es la señal de que te estás escuchando."
*Fuente:* MCER — la capacidad de monitorear y reparar es parte de la competencia estratégica. (Reemplaza al D2 del Área 7, y **contradice a propósito** el criterio de fluidez de la rúbrica: ver "La regla que gobierna esta área".)
`estructura: general` | `nivel: básico` | `tag: rubrica_oral`

**R18.** ES: "Si en la prueba no te sale la estructura compleja, dila simple y sigue adelante. Trabarte cuesta más que simplificar. Guárdate el riesgo para practicar, no para el examen."
*Fuente:* MCER — estrategias de compensación; rúbrica de speaking (coherencia y fluidez, 4 puntos).
`estructura: general` | `nivel: básico` | `tag: rubrica_oral`

**R19.** ES: "Coherencia y fluidez valen 4 puntos en el oral; la gramática, 3. Trabarte buscando la forma perfecta te cuesta más que decirlo con un error."
*Fuente:* Rúbrica de speaking, distribución de puntajes.
`estructura: general` | `nivel: básico` | `tag: rubrica_oral`

**R20.** ES: "En el oral no se espera que hables perfecto. Ni los hablantes nativos hablan sin repetirse, corregirse ni empezar de nuevo. Se espera que se entienda lo que dices."
*Fuente:* MCER — descriptores de precisión gramatical; literatura sobre disfluencias y auto-reparación en habla espontánea nativa.
`estructura: general` | `nivel: básico` | `tag: rubrica_oral`

---

## BLOQUE F — Responder lo que se pregunta

*El criterio de más peso (4 de 12 puntos) incluye "todas las ideas requeridas y
de forma coherente con el estímulo". Según el docente, ahí se pierde puntaje por
dos fallos concretos: responder cerrado una pregunta abierta, y contestar otra
pregunta (preguntan la hora, el alumno habla de su edad). No es un problema de
inglés: es de lectura del enunciado, y es la forma más cara y más evitable de
perder puntos.*

**R23.** ES: "Antes de responder, subraya la palabra con que empieza la pregunta. What, when, where, how much, how old: cada una pide un dato distinto y solo ese."
Ejemplo: *How old are you?* pide una edad · *What time is it?* pide una hora
*Fuente:* Rúbrica de writing y speaking, criterio de coherencia con el estímulo.
`estructura: wh_questions` | `nivel: básico` | `tag: rubrica_coherencia`

**R24.** ES: "Cuenta cuántas cosas te pide el enunciado antes de escribir. Si son tres, tu texto necesita tres respuestas. Es el error más caro de la prueba y el más fácil de evitar."
*Fuente:* Rúbrica de writing — "presentando todas las ideas requeridas" es parte del criterio de 4 puntos.
`estructura: general` | `nivel: básico` | `tag: rubrica_coherencia`

**R25.** ES: "Fíjate si la pregunta es abierta o cerrada. Si dice 'and explain why' o 'give details', un 'Yes, I do' no alcanza: pierdes en coherencia, no en gramática."
*Fuente:* Rúbrica de writing y speaking — cobertura de los temas requeridos.
`estructura: questions_do` | `nivel: básico` | `tag: rubrica_coherencia`

**R26.** ES: "Responder muy bien una pregunta que no te hicieron vale cero. La coherencia con el enunciado pesa 4 de 12 puntos, más que la gramática."
*Fuente:* Rúbrica de writing y speaking, distribución de puntajes.
`estructura: general` | `nivel: básico` | `tag: rubrica_coherencia`

**R27.** ES: "Al terminar, vuelve al enunciado y marca cada cosa que pedía. Lo que quede sin marcar son los puntos que ibas a perder sin darte cuenta."
*Fuente:* Rúbrica de writing (cobertura de los temas requeridos) + Zimmerman (2002), automonitoreo.
`estructura: general` | `nivel: básico` | `tag: rubrica_coherencia`

**R28.** ES: "Si dudas de qué te están preguntando, la pregunta misma te lo dice. Desarma el enunciado antes de contestarlo: primero entiéndelo, después responde."
*Fuente:* Rúbrica de writing y speaking, criterio de coherencia. Enlaza con Question Lab.
`estructura: wh_questions` | `nivel: básico` | `tag: rubrica_coherencia`

> **Nota:** la versión oral de este consejo **ya existe** — es el **D10 del Área
> 7** ("si te preguntan algo que no entendiste, pide que repitan"). No lo repito
> aquí; sube de prioridad, porque ahora sabemos que ese es el fallo que más
> puntos cuesta.

---

## Correcciones al Área 7

Estos cambios **no son opcionales**: tal como están, los ítems contradicen la
rúbrica con la que se evalúa al alumno.

### Salen (6)

| Ítem | Por qué |
|---|---|
| **A1** *"en A2 se esperan errores básicos sistemáticos, está previsto en el estándar"* | Un error básico sistemático repetido 8 veces = **0 puntos** en gramática. |
| **A3** *"ocurren errores pero queda claro lo que quieres decir. Ese es el estándar real"* | No es el estándar real de este curso. |
| **A4** *"en B2 se esperan deslices, no ausencia de errores"* | En speaking intermedio alto, el 100% exige **cero** errores. |
| **A6** *"'repertorio' es la palabra clave de las rúbricas"* | La palabra no aparece en ninguna de las rúbricas del curso. |
| **A7** *"la rúbrica mide rango Y precisión"* | **No hay criterio de rango gramatical.** Mide extensión, vocabulario aprendido, errores de gramática y errores de ortografía. |
| **E1** *"no todos los errores pesan igual"* | La rúbrica no pondera: 8 deslices menores valen lo mismo que 8 errores graves. Este ítem enseña a ignorar errores que sí cuestan puntos. |

### Se reescriben (4)

| Ítem | Cómo queda |
|---|---|
| **A5** | Quitar "repertorio": *"Nadie te pide hablar como nativo. Te piden control razonable de lo que ya viste en el curso."* |
| **E2** | Sustituido por **R8** — mismo mensaje, mecanismo correcto. |
| **E3** | Suavizar: quitar la implicación de que "pesa más". El error de tiempo verbal altera el sentido, pero en la rúbrica cuenta igual que cualquier otro. |
| **E4** | Sustituido por **R9** — se da vuelta para que abra con el argumento de rentabilidad, no con la minimización del error. |

### Se ajustan (1, fuera de los 13)

| Ítem | Ajuste |
|---|---|
| **B4** | Cortar la segunda frase (*"las rúbricas distinguen entre las dos"*): esta rúbrica **premia jugar seguro** — menos errores, más puntos, sin castigo por simplicidad. La primera frase se queda: la distinción entre dominar y no arriesgar sigue siendo cierta y útil. |

### Dos correcciones mías que quedaron sin efecto

En una primera pasada propuse ajustar **D1** (*"en el oral no se espera
perfección gramatical"*) con un filtro por nivel, y sustituir **D2**
(*"autocorregirse suma"*) porque la rúbrica cuenta las autocorrecciones en
fluidez. **Las dos quedan revertidas**: eran correcciones que seguían la rúbrica
en vez del criterio pedagógico, exactamente lo que la regla de esta área prohíbe.

- **D1 se queda como está**, sin filtro. Que el 100% de intermedio alto pida cero
  errores es un problema de la rúbrica, no una meta que valga la pena transmitir.
  **R20** lo dice explícito: ni los nativos hablan sin corregirse.
- **D2 se queda**, reforzado en **R17** con el argumento correcto: auto-repararse
  es competencia estratégica, no un desliz que se descuenta.

### Se quedan y suben de prioridad (3)

**A2**, **E5**, y sobre todo **A8** (*"lee la rúbrica antes de estudiar"*): esta
rúbrica trae números exactos, así que el consejo es literalmente ejecutable.
Reformulado como **R21** más abajo.

---

## Dos ítems de cierre

**R21.** ES: "Lee tu rúbrica antes de estudiar, no después de la nota. La tuya trae números exactos: cuántas palabras, cuántos errores y cuánto vale cada tramo."
*Fuente:* Rúbricas del curso (sustituye al A8 del Área 7).
`estructura: general` | `nivel: básico` | `tag: rubrica_meta`

**R22.** ES: "Saber cómo te evalúan no es hacer trampa: es dejar de adivinar. La rúbrica es pública justamente para eso."
*Fuente:* Buenas prácticas de evaluación transparente.
`estructura: general` | `nivel: básico` | `tag: rubrica_meta`

---

## Notas de implementación

**Sobre optimizar la nota.** Varios ítems enseñan a leer la rúbrica como un
sistema de puntos, y eso roza el "sacar más nota" en vez de "aprender inglés". El
criterio al escribirlos fue: **la rúbrica es un contrato público, y enseñar a
leerla es enseñar autorregulación** (Zimmerman), no hacer trampa — R22 dice
exactamente eso. El único ítem que se pasaba de ese borde era el **R4** original
("no escribas el doble"), que desincentivaba producir más lengua, o sea justo lo
que hace aprender (Swain). Reescrito: ahora habla de no rellenar, que es un
problema real de coherencia y no una estrategia de puntaje.

**Los ítems del BLOQUE F son los de mayor retorno del área.** Atacan un fallo que
no es de inglés sino de lectura del enunciado, en el criterio que más pesa. Un
alumno que responde sobre su edad cuando le preguntaron la hora puede tener la
gramática impecable y perder igual los 4 puntos más caros.

Y hay una coincidencia que vale la pena mirar: ese fallo es de **comprensión de
la palabra interrogativa**, y en la suite existe una app dedicada exactamente a
eso. Si algún día Question Lab suma una actividad de "¿qué te está preguntando
esta pregunta?", el R28 es su puerta de entrada natural.

**Las cifras están comprobadas.** Cada número de R1, R2, R6, R7, R10, R11, R14 y
R19 se verificó calculándolo contra las tablas de arriba, no a ojo. Si cambian
las rúbricas, hay que rehacer esa comprobación (ver punto siguiente).

**Estos ítems caducan cuando cambien las rúbricas.** A diferencia de Krashen o
Bjork, aquí cada número está atado a un documento que la institución puede
modificar. Marcarlos con `caduca: rubrica` y revisarlos cada vez que cambie la
pauta. Si cambian los umbrales de palabras o los tramos de error, hay que
recalcular **R2, R6, R10, R14** y las tablas de arriba.

**Dónde van en la baraja.** No en el tramo de entrada — hablan de evaluación, y
el arranque es para bajar la ansiedad. Desde el día ~20, con la misma regla que
el Área 7: **nunca dos ítems de exigencia seguidos.** Y valen doble en las dos
semanas previas a una evaluación, si algún día la app llega a saber cuándo son.

**Lo que sigue sin cubrirse.** La rúbrica de writing incluye *coherencia* dentro
del criterio de extensión ("todas las ideas requeridas y de forma coherente con
el estímulo"), y la de speaking incluye *realizar todas las tareas*. No hay ni un
ítem en las 8 áreas sobre **responder todo lo que pide el estímulo**, que es una
forma silenciosa de perder los 4 puntos más caros de la prueba.
