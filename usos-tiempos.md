# Usos de cada tiempo — borrador para revisar

Propuesta para llenar la columna «uso» de la tabla de tiempos de Grammaster.
Hoy cada tiempo tiene UNA línea (`descEs` en `Grammaster/src/data/grammar.js`),
que es una etiqueta y no un uso. Esto son los usos, para que el profesor deje
los que su curso enseña y borre el resto.

**Cómo revisarlo:** marca la casilla de los que se quedan, tacha o borra los que
no, y corrige el texto donde haga falta. Lo que sobreviva se convierte en datos
y la tabla lo muestra sin tocar la vista.

**Criterio:** solo los usos que el curso enseña, no todos los que existen. Es el
mismo criterio que ya se aplicó con los adverbios: la app no enseña categorías
que el temario no cubre.

**Sobre los ejemplos:** los marcados con «(generable)» los puede construir el
motor de la app con el sujeto y el verbo que el alumno elija. Los demás son
oraciones fijas porque no caben en el molde sujeto-verbo-complemento (dos
cláusulas, sujetos impersonales…).

**Sobre los marcadores:** los que van en `código` ya existen en la app y salen
como chips junto al campo Complemento. Los marcados **(nuevo)** habría que
agregarlos.

---

## Presente Simple · Bás. I, 5A

- [ ] **Rutinas y hábitos** — *She works on Mondays.* (generable) — `every day`, `on Mondays`, `every week`, `in the morning`
- [ ] **Hechos y verdades generales** — *Water boils at 100 °C.* — sin marcador
- [ ] **Estados permanentes** — *He lives in Santiago.* (generable) — sin marcador
- [ ] **Horarios y programación** — *The train leaves at seven.* — sin marcador

## Presente Continuo · Bás. II, 9A

- [ ] **Acción en curso ahora mismo** — *She is working now.* (generable) — `now`, `right now`, `at the moment`
- [ ] **Periodo temporal alrededor de ahora** (no exactamente en este segundo) — *He is studying a lot these days.* (generable) — `these days`, `this week`, `currently`
- [ ] **Plan futuro ya acordado** — *I am meeting Ana tomorrow.* — tomorrow, tonight **(nuevo)**
      · Ojo: choca con *going to* y suele verse más adelante. Marcar solo si el curso lo trata.

## Pasado Simple · Bás. II, 11A

- [ ] **Acción terminada en un momento pasado concreto** — *She worked here last year.* (generable) — `yesterday`, `last week`, `two days ago`
- [ ] **Serie de acciones pasadas (relato)** — *I woke up, had breakfast and left.* — then, after that **(nuevo)**
- [ ] **Estados o situaciones pasadas ya cerradas** — *He lived in Peru for two years.* (generable) — `in the past`, `back then`

## Futuro con *going to* · Elem. II, 10B

- [ ] **Planes e intenciones decididas de antes** — *They are going to travel next month.* (generable) — `next month`, `tonight`, `this weekend`
- [ ] **Predicción con evidencia a la vista** — *Look at those clouds — it's going to rain.* — sin marcador

## Presente Perfecto · Elem. II, 12A

- [ ] **Experiencia de vida, sin decir cuándo** — *I have been to Peru.* (generable) — ever, never **(nuevo)**
- [ ] **Acción pasada con resultado en el presente** — *She has lost her keys.* (generable) — sin marcador
- [ ] **Empezó en el pasado y sigue hasta ahora** — *We have lived here for ten years.* (generable) — `for 2 years`, `since 2020`, `since Monday`
- [ ] **Pasado muy reciente / novedad** — *They have just arrived.* (generable) — just, already, yet **(nuevo)**

## Pasado Continuo · Inter. I, 2B

- [ ] **Acción en progreso en un momento del pasado** — *At 8 pm she was working.* (generable) — `at 8 pm`, `at that moment`, `all morning`
- [ ] **Acción larga interrumpida por una corta** — *I was cooking when he arrived.* — `when I arrived`, when **(nuevo)**
- [ ] **Dos acciones pasadas a la vez** — *She was reading while he was cooking.* — `while she slept`, while **(nuevo)**

## Futuro Simple con *will* · Inter. I, 6A

- [ ] **Predicción o creencia sobre el futuro** — *It will rain tomorrow.* (generable) — `tomorrow`, `next week`, `someday`
- [ ] **Decisión espontánea, en el momento de hablar** — *I'll help you.* (generable) — sin marcador
- [ ] **Promesas y ofrecimientos** — *I will call you later.* (generable) — `soon`, `in a minute`
- [ ] **Hechos futuros seguros** — *She will be 18 next year.* — `next year`

## Pasado Perfecto · Inter. II, 12A

- [ ] **Acción anterior a otra acción pasada** — *When she arrived, they had left.* — `when she arrived`, `before I left`
- [ ] **Ya había ocurrido antes de un momento del pasado** — *By 2010 he had finished his studies.* — `by then`, `already`, `never before`

## *Used to* · Inter. II, 11A

- [ ] **Hábito pasado que ya no existe** — *I used to play football.* (generable) — `as a child`, `when I was young`, `every summer`
- [ ] **Estado pasado que ya no es cierto** — *She used to live in Peru.* (generable) — `years ago`, `in the past`

## Presente Perfecto Continuo · Inter. Alto, 2B

- [ ] **Empezó en el pasado, sigue, y se subraya la DURACIÓN** — *She has been working here for hours.* (generable) — `for hours`, `since this morning`, `all day`
- [ ] **Acción reciente con resultado visible ahora** — *He's tired: he has been running.* — `lately`, `recently`

---

## Notas para después de la revisión

1. Los marcadores **(nuevo)** —*ever, never, just, already, yet, when, while, then*—
   no están hoy en las listas de la app. Si el uso que los trae se queda, se
   agregan junto a los demás.
2. Los usos que hablan de **dos cláusulas** (*when*, *while*) llevan ejemplo fijo:
   el motor construye una oración, no dos. Si más adelante interesa, la
   condicional ya demuestra que se puede hacer con dos.
3. Un uso puede llevar más de un ejemplo. Con uno basta para la tabla; el
   segundo serviría para la práctica.
