import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

/* ICONO DE LÍNEA, NO EMOJI. Era ☀️/🌙 y en la barra del iframe quedó siendo el
   único emoji al lado de la marca de la app: un dibujo con color y volumen,
   hecho por el sistema operativo, junto a controles que ya no lo son. Con
   lucide comparte grosor, caja y `currentColor` con el resto de la suite —los
   mismos iconos que las tres barras de navegación— y además se tiñe con el
   botón en vez de quedarse de su color de emoji pase lo que pase. */
const THEME_ICON = { light: Sun, dark: Moon };
const THEME_NAME = { es: { light: 'Claro', dark: 'Oscuro' }, en: { light: 'Light', dark: 'Dark' } };

/* El toggle de tema, exportado aparte: además de la cabecera del Hub lo usa la
   barra del iframe. Dentro de una app embebida el tema se maneja desde ahí, no
   desde la cabecera de la app — en celular esa cabecera queda cargada de
   información y el botón compite con el título. */
export function ThemeToggle({ lang = 'es', compacto = false }) {
  // Arranca en auto (sigue al SO). El toggle es binario y ofrece el modo destino.
  const [eff, setEff] = useState(() => (typeof window !== 'undefined' && window.ghTheme ? window.ghTheme.effective() : 'light'));
  useEffect(() => {
    if (!window.ghTheme) return;
    const sync = () => setEff(window.ghTheme.effective());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);
    const onStorage = (e) => { if (e.key === 'gh_theme') sync(); };
    window.addEventListener('storage', onStorage);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', sync) : mq.removeListener(sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  const target = eff === 'dark' ? 'light' : 'dark';   // el modo al que puedes cambiar
  const etiqueta = `${lang === 'es' ? 'Cambiar a modo' : 'Switch to'} ${THEME_NAME[lang][target].toLowerCase()}`;
  return (
    <button
      onClick={() => { if (window.ghTheme) setEff(window.ghTheme.toggle()); }}
      className={`flex items-center gap-1.5 rounded-lg font-bold bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all ${
        compacto ? 'px-2.5 py-1.5 text-sm' : 'px-2.5 py-1 text-sm'}`}
      title={etiqueta}
      aria-label={etiqueta}
    >
      {(() => { const Icono = THEME_ICON[target]; return <Icono className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />; })()}
      {/* EL RÓTULO SE VA EN TELÉFONO, como ya hacían las otras tres apps. Este
          era el único que lo llevaba a cualquier ancho, y desde que la barra
          del iframe junta el «← Hub», la marca de la app y el tema en una sola
          fila, era lo que más sitio le quitaba al nombre —que es lo que se
          trunca cuando falta espacio—.
          El icono se queda porque él solo ya dice a qué modo se va: sol para
          claro, luna para oscuro. Y el `title` y el `aria-label` siguen
          diciendo la acción entera, así que no se pierde para quien navega con
          lector de pantalla ni para quien pasa el ratón. */}
      <span className="hidden sm:inline">{THEME_NAME[lang][target]}</span>
    </button>
  );
}

const HeaderNav = ({ lang, setLang }) => {
  return (
    /* MISMA CABECERA QUE LAS OTRAS TRES: marca a la izquierda, controles a la
       derecha, a todo el ancho con `px-4 py-3`. Antes iba centrada, con el logo
       a 64px, el título a 2xl y los controles anclados en las esquinas con
       rótulos «TEMA» e «IDIOMA» que ninguna otra app lleva. El hub es lo primero
       que el alumno abre y desde donde salta a las apps: que la barra dé un
       brinco en cada salto era justo lo que se venía arreglando en las demás.
       `min-w-0` + `truncate` para que la marca ceda antes de que los controles
       se salgan de la pantalla, como en Grammaster y Desgramatizador. */
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 px-4 py-3 flex items-center justify-between gap-3">

      {/* Marca */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
          alt="Grammar HUB"
          className="w-10 h-10 rounded-[22%] shadow-sm shrink-0"
        />
        <div className="min-w-0">
          <p className="font-bold text-slate-800 text-lg sm:text-xl leading-tight truncate">Grammar HUB</p>
          <p className="text-xs text-muted truncate">
            {lang === 'es' ? 'Tu laboratorio de inglés' : 'Your English laboratory'}
          </p>
        </div>
      </div>

      {/* Controles: idioma y tema, en el mismo orden que en las apps */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5">
          <button
            onClick={() => setLang('es')}
            aria-pressed={lang === 'es'}
            className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${lang === 'es' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
            title="Español"
          >ES</button>
          <button
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
            className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
            title="English"
          >EN</button>
        </div>
        <ThemeToggle lang={lang} />
      </div>

    </header>
  );
};

export default HeaderNav;
