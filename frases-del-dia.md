# Frase del día — notas de origen y criterio

El banco vive en `src/data/phrases.js` (105 ítems) y la selección en
`src/dailyPhrase.js`. Este documento guarda lo que **no** cabe en el código:
de dónde salió, qué se puede afirmar y qué no.

## Qué es

No es una sección de frases motivacionales. Cada ítem es un dato o un hallazgo
con **fuente citable**, y la fuente se muestra siempre junto al texto. Ese es el
punto: que el estudiante vea que lo que se le dice tiene respaldo.

Origen: compilación bilingüe encargada por el docente (Víctor Morales), en 8
categorías + un bloque de refuerzo diario, con verificación de atribución.

**Solo entran fuentes públicas y citables.** Hubo un área con los criterios de
evaluación de una institución concreta y se retiró: eran instrumentos de esa
institución, no material de este proyecto. Un banco que le habla al alumno de
cómo lo evalúan tiene que apoyarse en algo que él pueda ir a leer.

## Dónde se muestra

Dos sitios, a propósito:

- **Un aviso que salta solo la primera visita del día** (hoja desde abajo en
  celular, modal centrado en PC). Es el momento de leerla: el alumno recién
  llegó y todavía no iba a ninguna parte.
- **Una línea plegada que queda en la home todo el día** y la vuelve a abrir.
  Lo que se muestra en un aviso se cierra por reflejo; sin la línea, quien lo
  cerró sin leer perdía la frase hasta el día siguiente. Además deja la frase
  disponible para comentarla en clase.

El aviso **no** se puede volver bloqueante ni retrasar su cierre: con
estudiantes eso se paga caro. El botón dice "Entendido" en vez de ser solo una
X porque una X invita a descartar y un botón con texto invita a terminar de
leer. Mientras el aviso está abierto, el de instalar la app (`InstallPrompt`,
panel fijo abajo) espera su turno vía la prop `paused` — dos paneles
superpuestos en la misma carga se cierran sin leer ninguno.

## Cómo rota

- Una frase por **día calendario local** (no UTC — en Chile `toISOString()`
  cambiaría de día a las 20:00 o 21:00).
- Un día sin abrir la app **no consume frase**: se avanza en una baraja
  guardada, no se calcula por fecha. El estudiante que entra solo los lunes ve
  la 1, la 2, la 3… y no se salta contenido.
- Sin repeticiones hasta agotar el banco: 103 días ≈ dos semestres.
- La baraja se mezcla **dentro de tramos de prioridad**, no entera, siguiendo la
  progresión que recomienda el propio banco:
  1. Bajar el filtro afectivo (nervios, mentalidad de crecimiento, constancia).
  2. Técnica de estudio (ciencia del aprendizaje, tips prácticos).
  3. Fundamento y sentido (SLA, estrategias, bilingüismo, empleabilidad, citas).

Estado en `localStorage` bajo `gh_daily_phrase`: `{ day, id, queue, seen }`.
`seen` es lo que evita que el aviso vuelva a saltar el mismo día.

## Qué se puede afirmar y qué no

Esto es lo que justifica los campos `status` y `note` de cada ítem. **No
quitarlos** sin releer esta sección.

### Sólido (afirmar con confianza)

- **Efecto de espaciamiento** y **práctica de recuperación**: evidencia
  experimental amplia y replicada.
- **Umbrales de cobertura léxica** de Paul Nation.
- **Horas de estudio del FSI**.
- **Datos de Chile**: EF EPI 2025 (517 pts, puesto 54 de 123, 9º regional);
  British Council 2015 (82% estudiaría inglés por empleabilidad; 48% de los
  empleadores lo considera esencial).

### En debate académico (`status: 'debate'` → se muestra con ⚠️)

- **"Ventaja ejecutiva" del bilingüismo**: en crisis de replicación. Paap et al.
  (2015, *Cortex*) hallaron que **más del 80% de los tests posteriores a 2011 dan
  resultados nulos**. Por eso el banco **no** afirma que el bilingüismo mejore la
  inteligencia o el control ejecutivo.
- **Retraso de la demencia (ítems 36, 37, 38)**: viene de estudios
  **retrospectivos** con posibles factores de confusión (inmigración, educación).
  Es una asociación observada, no causalidad. Bialystok misma advirtió que sus
  datos se refieren a bilingüismo **de por vida**: aprender inglés de adulto no
  previene el Alzheimer.
- **Foreign Language Effect (Keysar)**: replicado, pero su tamaño depende de la
  similitud entre lenguas y del dominio. Es una curiosidad respaldada, no una ley.
- **Período crítico**: hay consenso en que empezar temprano ayuda al *acento*,
  no en que exista una barrera absoluta. "Ya es tarde para mí" es falso y
  desmotivador — de ahí los ítems 8, 9 y 10.
- **Citas sin fuente primaria (82, 88, 89, 91)**: Mandela, Fellini, proverbio
  checo. Atribuciones muy difundidas pero sin respaldo escrito confirmado.

### Apócrifo (`status: 'apocrifa'` → **fuera de la rotación**)

- **81 — Carlomagno, "una segunda alma"**: no existe ninguna fuente primaria.
- **92 — Da Vinci, "aprender nunca agota la mente"**: atribución dudosa.

Quedan en el banco (con su advertencia) por si se quieren usar en clase como
proverbio, pero no se muestran en la app: una cita sin respaldo es justo la
frase motivacional tradicional que esta sección busca evitar. Para incluirlas,
poner `INCLUIR_APOCRIFAS = true` en `src/dailyPhrase.js`.

### Citas con respaldo documental sólido

Wittgenstein (83), Flora Lewis (84), Goethe (85), Frank Smith (86),
Rita Mae Brown (87 y 90).

## Si se agregan ítems

- `id` correlativo y **estable**: la baraja guardada en `localStorage` recuerda
  ids, no posiciones. Reordenar el array es inofensivo; reciclar un id, no.
- Máximo ~300 caracteres en `es` (cabe en pantalla de celular).
- `source` obligatorio. Si no hay fuente, el ítem no entra.
- Si la afirmación está discutida, `status: 'debate'` + `note` con el porqué.
