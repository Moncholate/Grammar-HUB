/* ============================================================================
   CONTRASTE DE LO QUE SE VE · Grammar HUB
   Uso:  npm run check-contraste
   ----------------------------------------------------------------------------
   El motor vive en design-tokens y llega generado: mide cada elemento con texto
   propio contra el fondo que REALMENTE tiene, componiendo translúcidos y
   subiendo por el árbol hasta el primer opaco (o hasta un degradado, cuyas
   paradas mide todas y se queda con la peor). Es el punto ciego que dejan
   `check-contraste-tw` (solo mide pares dentro de un mismo className) y
   `check-dark` (solo comprueba cobertura de fondos). Su cabecera cuenta el
   porqué largo y los fallos reales que encontró en las otras dos apps.

   Esta era la única de las tres sin guion: tenía el motor y nadie le había
   escrito cómo conducirla. Llega la última a propósito —es la app con menos
   superficie de color— pero es la PRIMERA que abre el alumno, así que un fallo
   aquí es el primero que ve.

   Aquí va lo único que es de esta app: cómo llegar a lo que vale la pena
   auditar, y qué fallos se decidieron dejar.

   Necesita Playwright, y a propósito NO está en package.json — el despliegue
   corre `npm ci` y se bajaría los navegadores en cada build:

       npm i -D playwright && npx playwright install chromium
   ============================================================================ */
import { correr } from './contraste-render.generated.mjs';

/* El aviso de la frase del día es un `role="dialog"` con velo a pantalla
   completa: mientras está abierto, cualquier clic en la página de debajo lo
   intercepta el velo. Se cierra por su botón y no con Escape para pasar por el
   mismo camino que usa una persona. */
const cerrarFrase = async (page) => {
  const dialogo = page.locator('[role="dialog"]');
  if (!(await dialogo.count()) || !(await dialogo.first().isVisible())) return;
  await dialogo.locator('button').last().click();
  await page.waitForTimeout(350);
};

/* La sección del profesor: entrar si no se está ya dentro, y cambiar de
   herramienta. Las cuatro se montan siempre y se ocultan con CSS, así que hay
   que ir a la pestaña ANTES de medir: lo oculto no se mide, y una sonda que
   mide una pantalla vacía da un verde que no significa nada. */
const entrarDocente = async (page) => {
  await cerrarFrase(page);
  const puerta = page.locator('button:has-text("Herramientas de clase"), button:has-text("Classroom tools")').first();
  if (await puerta.count()) { await puerta.click(); await page.waitForTimeout(400); }
};

const pestana = async (page, es, en) => {
  for (const rotulo of [es, en]) {
    const b = page.getByRole('button', { name: rotulo, exact: true });
    if (await b.count()) { await b.first().click(); await page.waitForTimeout(300); return; }
  }
};

correr({
  nombre: 'GRAMMAR HUB',
  puerto: 5171,

  /* El hub no tiene pestañas: es una sola página con estados que se despliegan.
     Dos cosas antes de medir nada:

     1. CERRAR el aviso de la frase del día, que se abre solo al cargar y tapa
        la página entera con un velo. Se audita aparte, en su pantalla.
     2. ELEGIR NIVEL, porque sin nivel las tarjetas de las tres apps no están
        activas y se quedan en su estado de aviso — auditar la carga limpia
        mediría media pantalla apagada. */
  conducir: async (page) => {
    await cerrarFrase(page);
    const nivel = page.locator('button[aria-pressed]').first();
    if (await nivel.count()) { await nivel.click(); await page.waitForTimeout(400); }
  },

  /* Los cuatro estados que de verdad pintan algo distinto. `ir` tiene que ser
     IDEMPOTENTE: se ejecuta una vez por tema, y en el segundo pase la página
     llega con lo que dejó el primero. Por eso los desplegables se comprueban
     con `aria-expanded` antes de tocarlos, en vez de alternarlos a ciegas —
     hacerlo a ciegas los CERRARÍA en modo oscuro y el segundo pase mediría una
     pantalla vacía dando un verde que no significa nada. */
  pantallas: [
    {
      nombre: 'Inicio',
      ir: async (page) => {
        /* Las herramientas de clase REEMPLAZAN la vista del hub, así que en el
           segundo pase la página llega dentro del panel. Volver primero, o
           «Inicio» mediría el panel y daría un verde que no significa nada. */
        const volver = page.getByRole('button', { name: 'Hub', exact: true });
        if (await volver.count()) { await volver.first().click(); await page.waitForTimeout(350); }
        await cerrarFrase(page);
        const logros = page.locator('button[aria-controls="gh-insignias"]').first();
        if (await logros.count() && await logros.getAttribute('aria-expanded') === 'true') {
          await logros.click();
          await page.waitForTimeout(300);
        }
      },
    },
    {
      /* Es lo primero que ve el alumno cada día, antes que nada del hub. */
      nombre: 'Frase del día',
      ir: async (page) => {
        const abrir = page.locator('button[aria-haspopup="dialog"]').first();
        if (await abrir.count() && await abrir.getAttribute('aria-expanded') !== 'true') {
          await abrir.click();
          await page.waitForTimeout(400);
        }
      },
    },
    {
      nombre: 'Logros',
      ir: async (page) => {
        await cerrarFrase(page);
        const logros = page.locator('button[aria-controls="gh-insignias"]').first();
        if (await logros.count() && await logros.getAttribute('aria-expanded') !== 'true') {
          await logros.click();
          await page.waitForTimeout(400);
        }
      },
    },
    {
      /* La analogía del LEGO, y DESTAPADA. Tapada solo se ve el botón; el texto
         que explica la analogía —que es lo que hay que medir— no existe en el
         DOM hasta que se destapa. Lo mismo que pasaba con el panel de resultado
         de Grammaster. */
      nombre: 'Analogía (destapada)',
      ir: async (page) => {
        await cerrarFrase(page);
        const abrir = page.locator('button:has-text("ladrillos"), button:has-text("bricks")').first();
        if (await abrir.count()) { await abrir.click(); await page.waitForTimeout(400); }
        const destapar = page.locator('section button[type="button"]').first();
        if (await destapar.count()) { await destapar.click(); await page.waitForTimeout(400); }
      },
    },
    {
      /* Las herramientas del profesor: la única pantalla que no es para el
         alumno, y la única con tipografía gigante (el resultado del dado se lee
         proyectado). Va LA ÚLTIMA porque reemplaza la vista del hub — «Inicio»
         sabe volver—, y se TIRA una vez: sin tirar, la caja solo tiene el «Toca
         Lanzar» y no se mediría ni el número, ni el sujeto, ni los chips del
         historial. */
      nombre: 'Herramientas · dado',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Dado', 'Dice');
        for (const dado of ['Sujeto', 'Subject', 'Forma', 'Form']) {
          const b = page.getByRole('button', { name: dado, exact: true });
          if (await b.count() && await b.first().getAttribute('aria-pressed') === 'false') await b.first().click();
        }
        const lanzar = page.locator('button:visible:has-text("Lanzar"), button:visible:has-text("Roll")').first();
        if (await lanzar.count()) {
          await lanzar.click(); await page.waitForTimeout(700);
          await lanzar.click(); await page.waitForTimeout(700);   // dos, para que haya historial
        }
      },
    },
    {
      /* La ruleta con su lista puesta y una tirada hecha: sin girar, el cartel
         del resultado solo tiene el «Toca Girar» y no se mediría lo que se lee. */
      nombre: 'Herramientas · ruleta',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Ruleta', 'Wheel');
        const caja = page.locator('textarea:visible').first();
        if (await caja.count()) {
          await caja.fill(['work', 'study', 'travel', 'What did you do yesterday?', 'eat'].join('\n'));
          const usar = page.locator('button:visible:has-text("Usar esta lista"), button:visible:has-text("Use this list")').first();
          if (await usar.count()) { await usar.click(); await page.waitForTimeout(400); }
        }
        const girar = page.locator('button:visible:has-text("Girar"), button:visible:has-text("Spin")').first();
        if (await girar.count()) { await girar.click(); await page.waitForTimeout(3400); }
      },
    },
    {
      /* Los grupos: sin lista pegada solo se ve el cuadro de texto, así que las
         fichas, el contador y las tarjetas del reparto no existirían en el DOM.
         Con `if` porque en el segundo pase ya está todo cargado — el arnés no
         recarga entre temas. */
      nombre: 'Herramientas · grupos',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Grupos', 'Groups');
        const caja = page.locator('textarea:visible').first();
        if (await caja.count()) {
          await caja.fill(['Ana Pérez', 'Luis Soto', 'María López', 'Diego Rojas', 'Camila Díaz', 'Tomás Vera'].join('\n'));
          const usar = page.locator('button:visible:has-text("Usar esta lista"), button:visible:has-text("Use this list")').first();
          if (await usar.count()) { await usar.click(); await page.waitForTimeout(400); }
        }
        const ausente = page.locator('button[aria-pressed="true"]:visible:has-text("Luis Soto")').first();
        if (await ausente.count()) { await ausente.click(); await page.waitForTimeout(200); }
        const repartir = page.locator('button:visible:has-text("Repartir"), button:visible:has-text("Split")').first();
        if (await repartir.count()) { await repartir.click(); await page.waitForTimeout(500); }
      },
    },
    {
      /* El temporizador se mide EN ROJO: los últimos diez segundos son un estado
         propio y es el que se ve desde el fondo de la sala. Se pone un minuto y
         se deja correr no: se ajusta a mano bajando el preset más corto y
         arrancando, que tardaría 50 s. En vez de eso se mide el estado normal y
         el de fin, que es a donde llega solo al reiniciar a cero. */
      nombre: 'Herramientas · temporizador',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Temporizador', 'Timer');
      },
    },
  ],

  cambiarTema: async (page) => {
    await page.locator('button:has-text("Oscuro")').first().click();
    await page.waitForTimeout(600);
  },

  /* Un fallo que se decide no arreglar se anota aquí con su motivo, y entonces
     deja de contar. Mismo criterio que en las otras dos: exige una decisión
     humana UNA vez y la deja escrita. */
  revisados: [],
});
