# Grammar Hub · Modelo gramatical compartido

Fuente única de **significado** para las tres apps del hub. No unifica los
motores de análisis (son distintos a propósito) — define **las categorías
gramaticales y sus relaciones**, para que "la misma palabra se entienda igual"
en todas, aunque cada app la muestre con distinta granularidad.

- `grammar-model.json` — la taxonomía canónica (capas, categorías, relaciones, mapeo por app).

> Es el tercer recurso compartido del hub, con el mismo patrón que los otros:
> **tokens** (color, `Apps/design-tokens/`) · **currículo** (niveles CEFR,
> `curriculum.json`) · **modelo gramatical** (categorías, este archivo).

---

## Por qué un modelo y no un motor

Las tres apps hacen trabajos distintos sobre stacks distintos:

| App | Motor | Qué hace |
|---|---|---|
| Desgramatizador | compromise.js (NLP) + reglas | analiza texto arbitrario (POS + estructura) |
| Question Lab | reglas escritas a mano (vanilla, sin dependencias) | analiza preguntas |
| Grammaster | generación + conjugación | construye oraciones |

Unificar el motor sería caro e impráctico (y a Question Lab le cambiaría la
naturaleza). Lo que sí se comparte —y previene los problemas de identificación—
es el **vocabulario y las reglas**: qué es un auxiliar, si un modal cuenta como
auxiliar, cuándo "be" es verbo principal, etc.

---

## Las tres capas

El modelo tiene tres capas de granularidad decreciente en finura:

1. **`pos`** — clase de palabra (la más fina): noun, verb, auxiliary, modal, wh,
   pronoun, adjective, adverb, preposition, conjunction, determiner, number.
   La usa Desgramatizador en modo POS.
2. **`structure`** — rol funcional / casilla en la cláusula: WH, S, AUX, V, O, C, A.
   La usan Desgramatizador (modo estructura) y Grammaster (coloreado de la oración).
3. **`question`** — piezas de una pregunta y su respuesta: wh-word, auxiliary,
   semi-aux, subject, verb, complement, new-info. La usa Question Lab.

Cada categoría lleva un `colorRole` que apunta al rol de color en
`Apps/design-tokens` — así **taxonomía y color quedan amarrados**: todo lo que
es "auxiliar" en cualquier capa usa el mismo token (rose), etc.

---

## Las relaciones (lo que evita las discrepancias)

Las reglas transversales que todas las apps respetan:

- **verb-system** — verbo + auxiliar + semi-aux son un solo "sistema verbal", en
  la misma familia de color (los rojos).
- **modal-is-functional-aux** — un modal es su propia clase en POS (MOD), pero
  funcionalmente ocupa la casilla del auxiliar → en estructura y pregunta se
  muestra como AUX. Se enseña como "los modales son auxiliares estructurales".
- **copula** — be / have / do son auxiliares **solo si les sigue un verbo
  principal**; solos (cópula "be", posesivo "have") **son** el verbo principal (V).
- **semi-aux** — "going to", "used to", "have to" se pegan al sistema auxiliar,
  no al verbo principal.
- **subject-question** — cuando la wh-word ES el sujeto ("Who painted…?") no hay
  auxiliar y el verbo va conjugado.

---

## Estado y cómo usarlo

Hoy es una **referencia** (fuente de significado): las apps ya conforman a este
modelo por convención, pero todavía no lo consumen programáticamente. Sirve para:

- Decidir en un solo lugar cosas como "can es MOD en POS pero AUX en estructura".
- Onboarding: entender de un vistazo cómo se relacionan las tres apps.
- Base para, a futuro, validar automáticamente que los `colorRole` existan en
  `tokens.json`, o generar leyendas/definiciones desde acá.

Para cambiar el modelo: editar `grammar-model.json`, y propagar la decisión a la
app o apps afectadas.
