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
como chips junto al campo Complemento. Los **(nuevo)** habría que agregarlos, y
llevan anotado el curso en que se enseñan — dato del profesor, 28-ago-2026.

---

## Un uso llega DESPUÉS que su tiempo, y no es la excepción

Confirmado con los cursos que dio el profesor (28-ago-2026). El Presente
Perfecto se enseña entero en **Elem. II**, pero sus usos entran en tres momentos
distintos:

| Curso | Uso | Marcadores |
|---|---|---|
| Elem. II | experiencia de vida · resultado presente | ever, never |
| Inter. I | ya / todavía no | already, yet |
| Inter. II | empezó y sigue | for, since |

O sea que **dos de sus cuatro usos llegan uno y dos cursos más tarde que el
tiempo**. Con un solo caso era una curiosidad; con tres momentos en el mismo
tiempo es la regla, y tiene una consecuencia de diseño:

**cada uso lleva su propio curso, no el de su tiempo.** Si no, la tabla le
muestra a un alumno de Elem. II un uso con *since* que no verá hasta dos cursos
después. Está anotado en cada uso: **(uso de Inter. I)**, **(uso de Inter. II)**.

Lo mismo vale para los chips de marcador que ya salen junto al campo
Complemento: hoy un alumno de Elem. II que elige Presente Perfecto ve
`since 2020` y `for 2 years`. Cuando los marcadores lleven curso, esos chips
tienen que filtrarse igual.

---

## Presente Simple · Bás. I, 5A

- [ ] **Rutinas y hábitos** — *She works on Mondays.* (generable) — `every day`, `on Mondays`, `every week`, `in the morning`
- [ ] **Hechos y verdades generales** — *Water boils at 100 °C.* — sin marcador
- [ ] **Estados permanentes** — *He lives in Santiago.* (generable) — sin marcador
- [ ] **Horarios y programación** — *The train leaves at seven.* — sin marcador

## Presente Continuo · Bás. II, 9A

- [ ] **Acción en curso ahora mismo** — *She is working now.* (generable) — `now`, `right now`, `at the moment`
- [ ] **Periodo temporal alrededor de ahora** (no exactamente en este segundo) — *He is studying a lot these days.* (generable) — `these days`, `this week`, `currently`
- [x] **Plan futuro ya acordado** — *I am meeting Ana tomorrow.* (generable) — `tomorrow`, `tonight`, `next week`
      · **Confirmado por el profesor: intercambiable con «be going to».** Los dos
        dicen lo mismo para un plan. La app ya no avisa de incoherencia cuando
        el Presente Continuo lleva un marcador de futuro (antes sí, y contradecía
        la clase).

## Pasado Simple · Bás. II, 11A

- [ ] **Acción terminada en un momento pasado concreto** — *She worked here last year.* (generable) — `yesterday`, `last week`, `two days ago`
- [ ] **Serie de acciones pasadas (relato)** — *I woke up, had breakfast and left.* — then, after that **(nuevo, uso de Inter. I: el tiempo es de Bás. II pero sus conectores llegan en Inter. I)**
- [ ] **Estados o situaciones pasadas ya cerradas** — *He lived in Peru for two years.* (generable) — `in the past`, `back then`

## Futuro con *going to* · Elem. II, 10B

- [ ] **Planes e intenciones decididas de antes** — *They are going to travel next month.* (generable) — `next month`, `tonight`, `this weekend`
      · Mismo contenido que el Presente Continuo de arriba: **se enseñan como
        intercambiables**. Si este uso se queda, conviene que la tabla lo diga en
        los dos sitios.
- [ ] **Predicción con evidencia a la vista** — *Look at those clouds — it's going to rain.* — sin marcador

## Presente Perfecto · Elem. II, 12A

- [ ] **Experiencia de vida, sin decir cuándo** — *I have been to Peru.* (generable) — ever **(nuevo · Elem. II)**, never **(nuevo · Elem. II)**
      · *never* se ve antes, en Bás. I, pero como ADVERBIO DE FRECUENCIA. Como
        marcador de experiencia («I have never been to Peru») entra en Elem. II,
        con el tiempo. La misma palabra en dos papeles y dos cursos: si los
        marcadores llevan curso, tiene que ser por papel y no por palabra.
- [ ] **Acción pasada con resultado en el presente** — *She has lost her keys.* (generable) — sin marcador
- [ ] **Empezó en el pasado y sigue hasta ahora** — *We have lived here for ten years.* (generable) — `for 2 years`, `since 2020`, `since Monday`
      · **(uso de Inter. II)** — *for* y *since* se enseñan ahí, dos cursos después
        del tiempo.
- [ ] **Ya está hecho, o todavía no** — *She has already finished.* / *They haven't arrived yet.* (generable) — already **(nuevo · Inter. I)**, yet **(nuevo · Inter. I)**
      · **(uso de Inter. I)** — el tiempo es de Elem. II y estos
        marcadores llegan un curso después.
      · Reescrito: la primera versión decía «pasado muy reciente» y se apoyaba en
        *just*, que **el profesor no ve en ningún curso**. Sin *just*, lo que
        enseña el par *already/yet* no es la cercanía sino si la acción está
        completada o pendiente.

## Pasado Continuo · Inter. I, 2B

- [ ] **Acción en progreso en un momento del pasado** — *At 8 pm she was working.* (generable) — `at 8 pm`, `at that moment`, `all morning`
- [ ] **Acción larga interrumpida por una corta** — *I was cooking when he arrived.* — `when I arrived`, when **(nuevo · Inter. I)**
- [ ] **Dos acciones pasadas a la vez** — *She was reading while he was cooking.* — `while she slept`, while **(nuevo · Inter. I)**

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

## Los cursos de los marcadores nuevos (dato del profesor)

| Marcador | Curso |
|---|---|
| ever, never | Elem. II (*never* se ve antes en Bás. I, pero como adverbio de frecuencia) |
| already, yet | Inter. I |
| when, while | Inter. I |
| for, since | Inter. II |
| ~~just~~ | **no está en el temario** — no se agrega |
| then, after that | Inter. I — los conectores en general se ven en ese nivel, y estos dos en profundidad (dato del profesor, 1-sep-2026) |

## Notas para después de la revisión

1. Los marcadores **(nuevo)** no están hoy en las listas de la app. Si el uso que
   los trae se queda, se agregan con su curso, para que no aparezcan antes de
   tiempo.
2. Los usos que hablan de **dos cláusulas** (*when*, *while*) llevan ejemplo fijo:
   el motor construye una oración, no dos. Si más adelante interesa, la
   condicional ya demuestra que se puede hacer con dos.
3. Un uso puede llevar más de un ejemplo. Con uno basta para la tabla; el
   segundo serviría para la práctica.
