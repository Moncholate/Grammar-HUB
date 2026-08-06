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
  const cerrar = () => {
    setAbierta(false);
    try { window.localStorage.setItem(VISTA, '1'); } catch (e) {}
  };

  if (!abierta) {
    return (
      <button
        onClick={() => setAbierta(true)}
        className="mb-5 text-xs font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2 decoration-slate-300"
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
        {[
          { src: 'dino-grande.svg', alto: '100%',  titulo: t.whyBricksL1Title, texto: t.whyBricksL1, alt: t.whyBricksL1Alt },
          { src: 'dino-chico.svg',  alto: '42.2%', titulo: t.whyBricksL2Title, texto: t.whyBricksL2, alt: t.whyBricksL2Alt },
        ].map(({ src, alto, titulo, texto, alt }) => (
          <figure key={src} className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex flex-col">
            {/* Los dos van a la MISMA ESCALA — mismo tamaño de ladrillo, que es
                lo que vende que salen del mismo juego de piezas. Si cada uno se
                ajusta a su caja, el T-rex —que es ancho— se encoge y termina
                VIÉNDOSE más chico que el pequeño: el mensaje al revés.
                El 42,2% es el cociente real de los dos lienzos; si se
                regeneran las figuras hay que recalcularlo. */}
            <div className="h-32 sm:h-36 flex items-end justify-center mb-2">
              <img src={src} alt={alt} style={{ height: alto }} className="w-auto" />
            </div>
            <figcaption>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">{titulo}</p>
              <p className="text-xs text-slate-600 mt-0.5">{texto}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="text-sm text-slate-700 border-l-2 border-slate-300 pl-3">{t.whyBricksPunch}</p>

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
