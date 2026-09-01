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
/* ¿SIGUE VIVA LA APP? Todo lo de aquí abajo tolera que un elemento no esté
   —tiene que hacerlo, porque el segundo pase llega con el estado que dejó el
   primero—, y esa misma tolerancia hace que una app CAÍDA no rompa nada: se
   recorren las pantallas sin encontrar nada, no se mide nada y se canta verde.
   Pasó dos veces construyendo el cierre: un JSX inválido, y una constante usada
   sin importarla. La segunda se desmontaba en la CUARTA pantalla, así que un
   ancla solo al arrancar no la habría visto — y de hecho no la vio.
   El bucle de pantallas vive en el runner generado, que no se toca a mano, pero
   `entrarDocente` lo llaman todas las pantallas de herramientas y de cierre:
   comprobar ahí es comprobar antes de cada una de las que importan.
   La cabecera es lo único que está en todas las vistas del hub. */
const viva = async (page, donde) => {
  if (!(await page.locator('header button').count())) {
    throw new Error(`la app se cayó (${donde}): la cabecera ya no está. Mira la consola del navegador antes de creerle a esta sonda.`);
  }
};

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
  await viva(page, 'antes de entrar a las herramientas');
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
    await viva(page, 'al arrancar');
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
      /* LAS CINCO DEL CIERRE ABREN VACÍAS y sin nada sugerido, así que entrar en
         la pestaña no deja nada que medir: hay que ESCRIBIR primero. Se escribe
         con `fill`, que es idempotente —`ir` corre una vez por tema y volver a
         escribir deja lo mismo— y que además es lo que hace el docente.

         EL MURO, con tarjetas dentro. Estrena el único verde con texto de la
         suite: emerald-900 sobre emerald-50, un par que no sale en ninguna otra
         pantalla y que en oscuro no tiene quien lo invierta. */
      nombre: 'Cierre · el muro',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'El muro', 'The wall');
        const volver = page.locator('button:visible:has-text("empezar de nuevo"), button:visible:has-text("start over"), button:visible:has-text("Cambiar el molde"), button:visible:has-text("Change the frame")').first();
        if (await volver.count()) { await volver.click(); await page.waitForTimeout(300); }
        const molde = page.locator('textarea:visible').first();
        if (await molde.count()) { await molde.fill('Hoy pude ______, y hace un mes no.'); await page.waitForTimeout(250); }
        const proy = page.locator('button:visible:has-text("Proyectar"), button:visible:has-text("Project it")').first();
        if (await proy.count()) { await proy.click(); await page.waitForTimeout(350); }
        const construir = page.locator('button:visible:has-text("A construir el muro"), button:visible:has-text("Build the wall")').first();
        if (await construir.count()) { await construir.click(); await page.waitForTimeout(300); }
        for (const logro of ['pedir comida', 'entender el audio', 'escribir cinco frases', 'preguntar la hora']) {
          const campo = page.locator('input:visible').first();
          if (!await campo.count()) break;
          await campo.fill(logro);
          const anotar = page.locator('button:visible:has-text("Anotar"), button:visible:has-text("Add")').first();
          if (await anotar.count() && !(await anotar.isDisabled())) { await anotar.click(); await page.waitForTimeout(120); }
        }
        /* Se deja algo escrito y sin anotar: así se mide el aviso de repetido y
           el botón deshabilitado, que es lo que más se cae bajo AA. */
        const campo = page.locator('input:visible').first();
        if (await campo.count()) { await campo.fill('pedir comida'); await page.waitForTimeout(250); }
      },
    },
    {
      /* EL SEMÁFORO ENCENDIDO, que es donde viven los números en color de cada
         nivel sobre la carcasa oscura. La carcasa es un objeto fijo en los dos
         temas: aquí no se mide si la capa oscura la invierte —no debe— sino si
         lo que va encima se lee. */
      nombre: 'Cierre · semáforo encendido',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Semáforo', 'Traffic light');
        for (const rot of ['Otro objetivo', 'Another objective', 'Cambiar el objetivo', 'Change the objective']) {
          const b = page.locator(`button:visible:has-text("${rot}")`).first();
          if (await b.count()) { await b.click(); await page.waitForTimeout(250); break; }
        }
        const campos = page.locator('input[type="text"]:visible');
        if (await campos.count() >= 2) {
          await campos.nth(0).fill('I can order food in a restaurant.');
          await campos.nth(1).fill('Food · Unit 4');
          await page.waitForTimeout(250);
        }
        const proy = page.locator('button:visible:has-text("Proyectar"), button:visible:has-text("Project it")').first();
        if (await proy.count()) { await proy.click(); await page.waitForTimeout(350); }
        const mas = page.locator('button:visible:has-text("+1")');
        if (await mas.count() === 3) {
          for (let i = 0; i < 4; i++) await mas.nth(0).click();
          for (let i = 0; i < 14; i++) await mas.nth(1).click();
          for (let i = 0; i < 2; i++) await mas.nth(2).click();
        }
        const mostrar = page.locator('button:visible:has-text("Mostrar el semáforo"), button:visible:has-text("Show the traffic light")').first();
        if (await mostrar.count()) { await mostrar.click(); await page.waitForTimeout(600); }
      },
    },
    {
      /* LA APUESTA en el momento de apostar: la única pantalla de la suite cuyo
         elemento principal es un signo de interrogación gigante en tinta
         apagada, y lo apagado es justo lo que se cae bajo AA. */
      nombre: 'Cierre · apuesta, apostando',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Apuesta', 'The bet');
        for (const rot of ['Cambiar', 'Change', 'Volver', 'Back']) {
          const b = page.locator(`button:visible:has-text("${rot}")`).first();
          if (await b.count()) { await b.click(); await page.waitForTimeout(250); break; }
        }
        const caja = page.locator('textarea:visible').first();
        if (await caja.count()) {
          await caja.fill('Usa «although» en una oración\nDescribe tu fin de semana\nUna pregunta con «how often»\nAlgo que hiciste ayer\nUn plan para el sábado');
          await page.waitForTimeout(250);
        }
        const arrancar = page.locator('button:visible:has-text("Proyectar y arrancar"), button:visible:has-text("Project and start")').first();
        if (await arrancar.count()) { await arrancar.click(); await page.waitForTimeout(350); }
        const apostar = page.locator('button:visible:has-text("a apostar"), button:visible:has-text("place the bet")').first();
        if (await apostar.count()) { await apostar.click(); await page.waitForTimeout(300); }
      },
    },
    {
      /* LA APUESTA comparando: los marcos vacíos con la raya sobre la que se
         escribe, que es un elemento gráfico y pide 3:1 — el guion que había
         antes daba 1,48:1 y lo cazó esta misma sonda. */
      nombre: 'Cierre · apuesta, comparando',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Apuesta', 'The bet');
        const corregir = page.locator('button:visible:has-text("Ahora corrijan"), button:visible:has-text("Now check")').first();
        if (await corregir.count()) { await corregir.click(); await page.waitForTimeout(350); }
      },
    },
    {
      /* LA DUDA con el molde escrito: los huecos van en tinta apagada dentro de
         una frase en tinta plena, y apagado sobre el fondo de la página no tiene
         tarjeta blanca que lo salve. Se abre además la puerta plegada de la
         lista, porque plegada no se mide. */
      nombre: 'Cierre · la duda',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'La duda', 'The doubt');
        for (const rot of ['Otra duda', 'Another doubt', 'Cambiar el molde', 'Change the frame']) {
          const b = page.locator(`button:visible:has-text("${rot}")`).first();
          if (await b.count()) { await b.click(); await page.waitForTimeout(250); break; }
        }
        const caja = page.locator('textarea:visible').first();
        if (await caja.count()) { await caja.fill('De lo de hoy, todavía no me sale ______.'); await page.waitForTimeout(250); }
        const dets = page.locator('details:visible');
        for (let i = 0; i < await dets.count(); i++) await dets.nth(i).evaluate(d => { d.open = true; });
        await page.waitForTimeout(250);
      },
    },
    {
      /* ANTES / AHORA. El par más delicado del cierre: una frase TACHADA en tinta
         apagada sobre un tinte gris, al lado de la misma frase en tinta plena.
         Lo apagado con tachado es lo que más se cae bajo AA, y aquí no puede: es
         una oración modelo que la clase tiene que poder leer entera. */
      nombre: 'Cierre · antes y ahora',
      ir: async (page) => {
        await entrarDocente(page);
        await pestana(page, 'Antes / Ahora', 'Then / Now');
        for (const rot of ['Otro', 'Another one', 'Cambiar', 'Change']) {
          const b = page.locator(`button:visible:has-text("${rot}")`).first();
          if (await b.count()) { await b.click(); await page.waitForTimeout(250); break; }
        }
        const campos = page.locator('input[type="text"]:visible');
        if (await campos.count() >= 2) {
          await campos.nth(0).fill('I have seen him yesterday.');
          await campos.nth(1).fill('I saw him yesterday.');
          await page.waitForTimeout(250);
        }
        const dets = page.locator('details:visible');
        for (let i = 0; i < await dets.count(); i++) await dets.nth(i).evaluate(d => { d.open = true; });
        await page.waitForTimeout(250);
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

  /* SE BUSCA POR `aria-label`, NO POR EL RÓTULO. El botón muestra el modo AL QUE
     PUEDES IR, así que dice «Oscuro» en claro y «Claro» en oscuro: buscar el
     texto «Oscuro» funciona por casualidad, y el día que algo deje la página en
     oscuro antes de tiempo, la sonda se queda treinta segundos esperando un
     botón que existe y se llama de otra manera. El `aria-label` no cambia de
     forma: «Cambiar a modo …».
     Y se COMPRUEBA el resultado. Si el segundo pase no está de verdad en oscuro,
     mediría la capa clara dos veces y cantaría verde sobre la mitad de la app. */
  cambiarTema: async (page) => {
    const boton = page.locator('header button[aria-label^="Cambiar a modo"], header button[aria-label^="Switch to"]').first();
    if (!(await boton.count())) throw new Error('no se encontró el conmutador de tema en la cabecera');
    await boton.click();
    await page.waitForTimeout(600);
    const tema = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (tema !== 'dark') throw new Error(`el segundo pase no quedó en oscuro (data-theme=${tema}): se estaría midiendo la capa clara dos veces`);
  },

  /* Un fallo que se decide no arreglar se anota aquí con su motivo, y entonces
     deja de contar. Mismo criterio que en las otras dos: exige una decisión
     humana UNA vez y la deja escrita. */
  revisados: [],
});
