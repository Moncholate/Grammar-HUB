import { useState } from 'react';
import { translations } from '../i18n';

/* La analogía que explica por qué toda la suite está hecha de bloques.
   Se abre sola la primera vez —para el que llega sin contexto y para el
   profesor que presenta la herramienta— y después queda como una línea que se
   puede volver a abrir cuando haga falta. */
const VISTA = 'gh_analogy_seen';

const BrickAnalogy = ({ lang }) => {
  const t = translations[lang];
  const [abierta, setAbierta] = useState(() => {
    try { return !window.localStorage.getItem(VISTA); } catch (e) { return true; }
  });
  /* La figura chica empieza TAPADA. El contraste es el mensaje, y uno que
     aparece de golpe pega más que uno que ya estaba ahí: el alumno ve el T-Rex,
     se le pregunta qué le sale en inglés, y al tocar se encuentra con ocho
     bloques y un montón de aire alrededor. Ese aire es el chiste.
     NO se recuerda entre aperturas, a propósito: el docente presenta esto en
     clase y necesita poder hacer la revelación cada vez. Cuesta un toque. */
  const [revelado, setRevelado] = useState(false);
  const cerrar = () => {
    setAbierta(false);
    try { window.localStorage.setItem(VISTA, '1'); } catch (e) {}
  };

  if (!abierta) {
    return (
      <button
        onClick={() => { setRevelado(false); setAbierta(true); }}
        className="mb-5 text-xs font-semibold text-muted hover:text-ink underline underline-offset-2 decoration-slate-300"
      >
        {t.whyBricksTitle}
      </button>
    );
  }

  return (
    <section className="w-full max-w-2xl mb-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-2">{t.whyBricksTitle}</h2>
      <p className="text-sm text-slate-700 mb-1.5">
        <b>{t.whyBricksCore}</b>
      </p>
      <p className="text-sm text-slate-600 mb-5">{t.whyBricksBooklet}</p>

      {/* Las dos figuras. En móvil se apilan; el orden importa: primero la que
          el alumno YA sabe armar. */}
      {/* La columna del grande es más ancha porque la figura lo es: con dos
          columnas iguales sobraba aire a los lados y el contraste se diluía. */}
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-4 mb-5">
        <figure className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex flex-col">
          {/* Los dos van a la MISMA ESCALA — mismo tamaño de ladrillo, que es
              lo que vende que salen del mismo juego de piezas. Si cada uno se
              ajusta a su caja, el T-rex —que es ancho— se encoge y termina
              VIÉNDOSE más chico que el pequeño: el mensaje al revés.
              El 42,2% es el cociente real de los dos lienzos; si se
              regeneran las figuras hay que recalcularlo. */}
          <div className="h-32 sm:h-36 flex items-end justify-center mb-2">
            <img src="dino-grande.svg" alt={t.whyBricksL1Alt} style={{ height: '100%' }} className="w-auto" />
          </div>
          <figcaption>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">{t.whyBricksL1Title}</p>
            <p className="text-xs text-slate-600 mt-0.5">{t.whyBricksL1}</p>
          </figcaption>
        </figure>

        {/* La caja de la derecha conserva EL MISMO ALTO tapada que destapada.
            Es lo que hace el chiste: uno mira un hueco del porte del T-Rex,
            espera otro dinosaurio enorme, y al tocar aparecen ocho bloques
            perdidos ahí dentro. Si la caja creciera al revelar, el contraste se
            perdería en la animación de tamaño. */}
        <figure className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex flex-col">
          <div className="h-32 sm:h-36 flex items-end justify-center mb-2">
            {revelado ? (
              <img
                src="dino-chico.svg"
                alt={t.whyBricksL2Alt}
                style={{ height: '42.2%' }}
                className="w-auto dino-pop"
              />
            ) : (
              <button
                type="button"
                onClick={() => setRevelado(true)}
                aria-label={t.whyBricksRevealAria}
                /* El hover se marca SOLO con el borde. Cambiar el fondo es lo
                   que ha roto el contraste en esta suite cada vez que se ha
                   intentado: la capa oscura invierte el fondo y deja la tinta
                   donde estaba. Y las dos clases de borde sí están cubiertas. */
                className="h-full w-full rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-300 transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <span aria-hidden="true" className="text-3xl font-black text-muted">?</span>
                <span className="text-xs text-muted">{t.whyBricksAsk}</span>
                <span className="text-xs font-bold text-indigo-600 underline underline-offset-2">{t.whyBricksReveal}</span>
              </button>
            )}
          </div>
          <figcaption>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">{t.whyBricksL2Title}</p>
            {/* El texto explica el chiste, así que espera al chiste. */}
            {revelado && <p className="text-xs text-slate-600 mt-0.5">{t.whyBricksL2}</p>}
          </figcaption>
        </figure>
      </div>

      {/* El remate también espera: nombra el diente y la figura simple, o sea
          cuenta el final antes de que pase. `aria-live` para que quien no ve la
          figura se entere igual de que apareció algo nuevo. */}
      {revelado && (
        <p aria-live="polite" className="text-sm text-slate-700 border-l-2 border-slate-300 pl-3">{t.whyBricksPunch}</p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={cerrar}
          className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          {t.whyBricksClose}
        </button>
      </div>
    </section>
  );
};

export default BrickAnalogy;
