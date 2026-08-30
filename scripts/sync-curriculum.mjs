/* ============================================================================
   Grammar Hub · sync del currículo
   Lee curriculum.json (fuente única: niveles + unidades de cada curso + la
   unidad en que se enseña cada contenido) y escribe el consumible de cada app.
   Uso:  npm run sync-curriculum   (desde Grammar HUB)

   Por qué generado y no copiado a mano: el nivel de un contenido vivía a la vez
   en Grammaster y en Question Lab, y `would` se quedó un curso y medio tarde en
   las dos porque se corrigió en ninguna. Con un solo archivo, corregir el
   temario es corregir las apps.
   ============================================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));   // Grammar HUB/scripts
const apps = join(here, '..', '..');                    // Apps/
const cur = JSON.parse(readFileSync(join(here, '..', 'curriculum.json'), 'utf8'));

/* ---------- Validación ----------------------------------------------------
   Una unidad mal escrita no rompe nada: simplemente deja el contenido fuera de
   la práctica para siempre, en silencio. Por eso se comprueba aquí, que es el
   único sitio por el que pasa el dato antes de llegar a las tres apps. */
const problemas = [];
const CAMPOS_UNIDAD = ['unit', 'unitBe', 'unitQuestions', 'unitThirdPerson', 'unitIrregulars'];

for (const [nivel, lista] of Object.entries(cur.units)) {
  if (!cur.levels.includes(nivel)) problemas.push(`units: «${nivel}» no es un nivel`);
  if (new Set(lista).size !== lista.length) problemas.push(`units.${nivel}: unidades repetidas`);
}
for (const nivel of cur.levels) {
  if (!cur.units[nivel]) problemas.push(`falta la lista de unidades de «${nivel}»`);
  if (!cur.labels[nivel]) problemas.push(`falta la etiqueta de «${nivel}»`);
}
for (const [id, item] of Object.entries(cur.content)) {
  /* Las claves `$…` son notas para quien lee el JSON, también DENTRO de
     `content`: sin esto la nota se validaba como si fuera un contenido más y el
     sync se caía diciendo «nivel undefined desconocido». */
  if (id.startsWith('$')) continue;
  if (!cur.levels.includes(item.level)) { problemas.push(`${id}: nivel «${item.level}» desconocido`); continue; }
  for (const campo of CAMPOS_UNIDAD) {
    const u = item[campo];
    if (u != null && !(cur.units[item.level] || []).includes(u))
      problemas.push(`${id}.${campo}: «${u}» no existe en ${item.level}`);
  }
  /* El orden entre etapas también importa: si `unitBe` fuera POSTERIOR a `unit`
     la etapa temprana no existiría y el campo mentiría sin fallar. */
  const idx = (u) => (cur.units[item.level] || []).indexOf(u);
  for (const campo of ['unitBe']) {
    if (item[campo] != null && idx(item[campo]) > idx(item.unit))
      problemas.push(`${id}.${campo} va DESPUÉS de unit: la etapa temprana no existiría`);
  }
  for (const campo of ['unitQuestions', 'unitThirdPerson', 'unitIrregulars']) {
    if (item[campo] != null && idx(item[campo]) < idx(item.unit))
      problemas.push(`${id}.${campo} va ANTES de unit: esa etapa nunca se aplicaría`);
  }
}
/* El plazo de la revisión: si faltara o fuera 0, la app pediría revisar la
   unidad en cada carga, que es peor que no pedirla nunca. */
if (!cur.revision || !(cur.revision.dias > 0))
  problemas.push('revision.dias debe ser un número de días mayor que 0');
if (problemas.length) {
  console.error('✗ curriculum.json no cuadra con el temario:');
  for (const p of problemas) console.error('   · ' + p);
  process.exit(1);
}

const BANNER =
  '/* AUTO-GENERATED from Grammar HUB/curriculum.json — do not edit by hand.\n' +
  '   Change curriculum.json and run `npm run sync-curriculum` in Grammar HUB. */\n';

/* Las claves `$…` son notas para quien lee el JSON, no datos: fuera del bundle. */
const limpio = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('$')));
const content = Object.fromEntries(Object.entries(cur.content)
  .filter(([k]) => !k.startsWith('$'))
  .map(([k, v]) => [k, limpio(v)]));

/* Mapa id→nivel, que es lo que consumían las apps antes de que existieran las
   unidades. Se sigue emitiendo derivado para no tener el nivel escrito dos
   veces: cuando eso pasó, las dos copias se desincronizaron. */
const tenses = Object.fromEntries(Object.entries(content).map(([k, v]) => [k, v.level]));

/* ---- Question Lab: script clásico que expone window.GRAMMAR_CEFR ----
   Question Lab es vanilla (no ESM), así que en vez de `export` asignamos a
   window para que su script inline lo lea. */
const qlBody = `${BANNER}window.GRAMMAR_CEFR = ${JSON.stringify(
  { levels: cur.levels, labels: cur.labels, units: cur.units, revision: cur.revision, content, tenses }, null, 2)};\n`;
writeFileSync(join(apps, 'Question Lab', 'cefr.generated.js'), qlBody);
console.log('  ✓ Question Lab/cefr.generated.js');

/* ---- Grammaster: módulo ESM ----
   Traduce los nombres al castellano que ya usa su código, para que conectar el
   generado no obligue a renombrar medio App.jsx. */
const CAMPOS_ES = {
  level: 'cefr', unit: 'unidad', unitBe: 'unidadBe',
  unitQuestions: 'unidadInterrogativa', unitThirdPerson: 'unidadTerceraPersona',
  unitIrregulars: 'unidadIrregulares',
};
const contentEs = Object.fromEntries(Object.entries(content).map(([id, v]) =>
  [id, Object.fromEntries(Object.entries(v).map(([k, val]) => [CAMPOS_ES[k] || k, val]))]));

const gmBody = `${BANNER}
export const NIVELES = ${JSON.stringify(cur.levels)};

export const UNIDADES_POR_CURSO = ${JSON.stringify(cur.units, null, 2)};

/* Cada cuántos días se le vuelve a preguntar al alumno si su curso sigue en esa
   unidad. Ver \`$revision\` en curriculum.json: el plazo es decisión del temario,
   no de cada app. */
export const DIAS_REVISION = ${cur.revision.dias};

/* id → { cefr, unidad, unidadBe, unidadInterrogativa, unidadTerceraPersona,
   unidadIrregulares }. Solo están los campos que ese contenido usa. */
export const CURRICULO = ${JSON.stringify(contentEs, null, 2)};

/* Devuelve los campos de currículo de un id, y AVISA si no existe: un id mal
   escrito daría \`undefined\` y el contenido quedaría disponible desde la clase 1
   sin que nadie se entere. */
export const delCurriculo = (id) => {
  const c = CURRICULO[id];
  if (!c) throw new Error(\`curriculum.json no tiene «\${id}»\`);
  return c;
};
`;
writeFileSync(join(apps, 'Grammaster', 'src', 'data', 'curriculum.generated.js'), gmBody);
console.log('  ✓ Grammaster/src/data/curriculum.generated.js');

/* ---- El propio hub: módulo ESM con lo justo ----
   El hub no consumía currículo hasta que sus herramientas de clase quisieron
   sortear «un tiempo de los que ya viste». Se le da la escala de niveles, sus
   nombres y los contenidos CON ETIQUETA —los tiempos—, que es lo único que
   necesita: aquí no se corrige nada, así que las unidades no hacen falta. */
const tiempos = Object.fromEntries(Object.entries(content).filter(([, v]) => v.label));
const hubBody = `${BANNER}
export const NIVELES = ${JSON.stringify(cur.levels)};

/* El nombre de cada curso, ES/EN. */
export const CURSOS = ${JSON.stringify(cur.labels, null, 2)};

/* Los TIEMPOS con nombre visible y el curso en que se enseñan. Los demás
   contenidos (modales, wh-, categorías) no llevan etiqueta y por eso no están:
   el dado sortea tiempos. */
export const TIEMPOS = ${JSON.stringify(tiempos, null, 2)};
`;
writeFileSync(join(apps, 'Grammar HUB', 'src', 'data', 'curriculum.generated.js'), hubBody);
console.log('  ✓ Grammar HUB/src/data/curriculum.generated.js');

console.log(`Currículo sincronizado — ${cur.levels.length} niveles, ${Object.keys(content).length} contenidos.`);
