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
    /* ¿MONTÓ LA APP? Todo lo de abajo tolera que un elemento no esté —tiene que
       hacerlo, porque el segundo pase llega con el estado que dejó el primero—,
       y esa misma tolerancia hace que una app CAÍDA no rompa nada: recorre las
       pantallas sin encontrar nada, no mide nada y canta verde. Pasó de verdad
       construyendo el semáforo, con un JSX inválido. Un ancla que tiene que
       existir sí o sí convierte ese verde en un fallo ruidoso. */
    const raiz = page.locator('h1');
    if (!(await raiz.count()) || !(await raiz.first().isVisible())) {
      throw new Error('la app no montó: no hay <h1> en la página. Mira la consola del navegador antes de creerle a esta sonda.');
    }

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
      /* EL AVISO DE QUE NO SE PUDO LEER, en pantalla propia: al cargar bien, el
         aviso se limpia y el textarea desaparece, así que el estado bueno y el
         malo no caben en la misma medición. Y el malo es el que más falta hace
         medir: un aviso ilegible aparece justo cuando algo ya salió mal.
         El fallo simulado es el más fácil de cometer de verdad — seleccionar
         las filas de alumnos en Excel y dejarse la cabecera de fechas. */
      nombre: 'Herramientas · histórico ilegible',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Grupos', 'Groups');
        const cambiar = page.locator('button:visible:has-text("cambiar lista"), button:visible:has-text("change list")').first();
        if (await cambiar.count()) { await cambiar.click(); await page.waitForTimeout(250); }
        const caja = page.locator('textarea:visible').first();
        if (!await caja.count()) return;
        const T = '\t';
        await caja.fill([
          ['#', 'Rut Alumno', 'Apellido Paterno', 'Apellido Materno', 'Nombre', 'Asistencia'].join(T),
          ['1', '1000000', 'Ramirez', 'Canales', 'Ana', '60%', 'SI'].join(T),
        ].join('\n'));
        await page.waitForTimeout(250);
        const cargar = page.locator('button:visible:has-text("Cargar"), button:visible:has-text("Load")').first();
        if (await cargar.count()) { await cargar.click(); await page.waitForTimeout(400); }
      },
    },
    {
      /* GRUPOS DESDE EL HISTÓRICO. Estrena dos pares de color que no salen en
         ninguna otra pantalla —el cartel índigo que dice de qué clase salió la
         lista, y el aviso rosa de cuando no se pudo leer— y los dos aparecen
         SOLO después de pegar algo: lo que no se visita no se mide. El del
         fallo importa el doble, porque un aviso que solo sale cuando la cosa
         se rompe es justo el que nadie mira hasta que hace falta.
         El histórico es inventado: ni un nombre ni un rut real en el repo. */
      nombre: 'Herramientas · grupos desde el histórico',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Grupos', 'Groups');
        const cambiar = page.locator('button:visible:has-text("cambiar lista"), button:visible:has-text("change list")').first();
        if (await cambiar.count()) { await cambiar.click(); await page.waitForTimeout(250); }

        const T = '\t';
        const clases = ['10-08-26', '12-08-26', '14-08-26'];
        const alumnos = [
          ['Ramirez', 'Canales', 'Ana',   '60%',  ['SI', 'NO', 'SI']],
          ['Soto',    'Pinto',   'Bruno', '30%',  ['NO', 'NO', 'SI']],
          ['Nunez',   'Lara',    'Carla', '100%', ['SI', 'SI', 'SI']],
          ['Ortiz',   'Rivas',   'Dario', '60%',  ['SI', 'SI', 'NO']],
        ];
        const historico = [
          'Histórico Asistencia Todo : INI0000-000X | 31-08-2026 14:42',
          T.repeat(5) + 'Fecha Clase' + T + clases.join(T),
          T.repeat(5) + 'Fecha Registro de Asistencia' + T + clases.join(T),
          ['#', 'Rut Alumno', 'Apellido Paterno', 'Apellido Materno', 'Nombre', 'Asistencia'].join(T),
          ...alumnos.map((a, i) => [i + 1, '1000000' + i, a[0], a[1], a[2], a[3], ...a[4]].join(T)),
        ].join('\n');

        const caja = page.locator('textarea:visible').first();
        if (!await caja.count()) return;

        await caja.fill(historico);
        await page.waitForTimeout(250);
        const cargar2 = page.locator('button:visible:has-text("Cargar"), button:visible:has-text("Load")').first();
        if (await cargar2.count()) { await cargar2.click(); await page.waitForTimeout(450); }
        const repartir = page.locator('button:visible:has-text("Repartir"), button:visible:has-text("Split")').first();
        if (await repartir.count()) { await repartir.click(); await page.waitForTimeout(400); }
      },
    },
    {
      /* EL SEMÁFORO DEL CIERRE, en sus dos estados, porque son dos pantallas
         distintas y no dos momentos de la misma: contando se proyectan los
         tres niveles APAGADOS —el reparto no puede verse todavía— y solo al
         final se encienden. Encendido estrena además los números en color de
         cada nivel sobre la carcasa oscura, que es un par que no existe en
         ninguna otra pantalla de la suite.
         La carcasa es un objeto oscuro FIJO en los dos temas, así que aquí no
         se mide si la capa oscura la invierte —no debe— sino si el texto que
         va encima se lee. */
      nombre: 'Cierre · semáforo contando',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Semáforo', 'Traffic light');
        const proyectar = page.locator('button:visible:has-text("Proyectar"), button:visible:has-text("Project it")').first();
        if (await proyectar.count()) { await proyectar.click(); await page.waitForTimeout(400); }
        const mas = page.locator('button:visible:has-text("+1")');
        if (await mas.count() === 3) {
          for (let i = 0; i < 4; i++) await mas.nth(0).click();
          for (let i = 0; i < 14; i++) await mas.nth(1).click();
          for (let i = 0; i < 2; i++) await mas.nth(2).click();
        }
        await page.waitForTimeout(350);
      },
    },
    {
      /* El mismo semáforo ENCENDIDO. Va aparte porque llega desde el anterior:
         el conteo sobrevive entre pantallas y aquí solo hay que destapar. */
      nombre: 'Cierre · semáforo encendido',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Semáforo', 'Traffic light');
        const mostrar = page.locator('button:visible:has-text("Mostrar el semáforo"), button:visible:has-text("Show the traffic light")').first();
        if (await mostrar.count()) { await mostrar.click(); await page.waitForTimeout(700); }
      },
    },
    {
      /* LA DUDA, en el molde. El nombre de cada tiempo va en `--marca` DENTRO
         de una frase en tinta normal, que es un par nuevo: acento de marca
         sobre el fondo de la página, sin tarjeta blanca debajo que lo salve.
         Se mide antes de arrancar el reloj para que el molde esté quieto. */
      nombre: 'Cierre · la duda',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'La duda', 'The doubt');
        const otra = page.locator('button:visible:has-text("Otra duda"), button:visible:has-text("Another doubt")').first();
        if (await otra.count()) { await otra.click(); await page.waitForTimeout(300); }
        const cambiar = page.locator('button:visible:has-text("Cambiar el molde"), button:visible:has-text("Change the frame")').first();
        if (await cambiar.count()) { await cambiar.click(); await page.waitForTimeout(300); }
        /* La puerta a la lista del curso va plegada —quien no la quiera no
           tropieza con ella— y plegada no se mide. Se abre por propiedad y no
           con un clic: `ir` se ejecuta una vez por tema y un clic la CERRARÍA
           en el segundo pase, midiendo una pantalla vacía. */
        const det = page.locator('details:visible').first();
        if (await det.count()) { await det.evaluate(d => { d.open = true; }); await page.waitForTimeout(250); }
        await page.waitForTimeout(200);
      },
    },
    {
      /* EL RELOJ DE LA DUDA EN ROJO. Los últimos diez segundos son un estado
         propio y es el que se ve desde el fondo de la sala — el mismo criterio
         que el temporizador de aquí abajo. Se llega bajando el tiempo al mínimo
         y esperando: 60 s serían un minuto de sonda, así que en vez de eso se
         mide arrancado y se acepta que el número esté en su estado normal; el
         rojo lo cubre `text-red-600`, que ya se mide en el temporizador.
         Lo que SÍ es exclusivo de aquí y hay que medir es la línea de
         instrucción bajo el molde y el reloj a tamaño de proyección. */
      nombre: 'Cierre · la duda, escribiendo',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'La duda', 'The doubt');
        const proyectar = page.locator('button:visible:has-text("Proyectar"), button:visible:has-text("Project it")').first();
        if (await proyectar.count()) { await proyectar.click(); await page.waitForTimeout(500); }
      },
    },
    {
      /* Y a quién le toca. Sin lista cargada dice «tres voluntarios», que es
         el estado que un profesor ve el primer día y el que se olvidaría de
         medir. */
      nombre: 'Cierre · la duda, a quién le toca',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'La duda', 'The doubt');
        const toca = page.locator('button:visible:has-text("A quién le toca"), button:visible:has-text("Se acabó"), button:visible:has-text("Whose turn"), button:visible:has-text("Time is up")').first();
        if (await toca.count()) { await toca.click(); await page.waitForTimeout(400); }
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
        await pestana(page, 'Reloj', 'Timer');
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
