import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { CATEGORIES } from '../data/phrases';
import { pickToday, markSeen } from '../dailyPhrase';
import { translations } from '../i18n';

/* Frase del día.
   El banco no son frases motivacionales sueltas, sino datos con respaldo: por
   eso la fuente va SIEMPRE visible junto al texto, y no escondida tras un
   despliegue. Cuando el ítem está en debate académico o carece de fuente
   primaria, la advertencia se imprime igual de visible.

   Se muestra dos veces, a propósito:
   · Un aviso que salta solo la PRIMERA visita del día — es el momento de
     leerla, cuando el alumno recién llega y todavía no iba a ninguna parte.
   · Una línea plegada que queda en la home todo el día. Lo que se muestra en
     un aviso se cierra por reflejo; sin la línea, quien lo cerró sin leer
     perdía la frase hasta mañana.

   Sin color por categoría: en esta suite el color ya significa otra cosa
   (familias de tiempos, tipos de palabra) y no conviene diluirlo.

   La categoría va AL PIE, encabezando la fuente, y no arriba junto al rótulo.
   Arriba chocaba: "Frase del día · Para hoy", "Frase del día · Cita". Eran dos
   etiquetas peleando por decir lo mismo, y renombrarlas solo tapaba un caso a
   la vez. Abajo el problema no puede volver a aparecer, la frase queda como lo
   primero que se lee, y la categoría hace su trabajo real: decir de qué tipo
   de respaldo se trata. */

const storage = () => { try { return window.localStorage; } catch (e) { return null; } };

/* Prompt copiable (área de IA). Sin el botón el alumno tendría que transcribir
   a mano una frase en inglés desde la pantalla, y no lo va a hacer: es lo que
   convierte el bloque de prompts de "buen consejo" a "herramienta". */
const PromptBox = ({ text, t }) => {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(text); } catch (e) { return; }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  };
  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <p
        lang="en"
        className="text-[13px] leading-snug text-slate-700"
        style={{ fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif" }}
      >
        {text}
      </p>
      <button
        onClick={copiar}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-slate-300 transition-colors touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {copiado ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
        {copiado ? t.phraseCopied : t.phraseCopy}
      </button>
      <span role="status" aria-live="polite" className="sr-only">{copiado ? t.phraseCopied : ''}</span>
    </div>
  );
};

/* Par ❌/✅ de los ítems de interferencia.
   El ✅ va primero y con más peso; el ❌ debajo, chico y tachado. Nunca al revés
   y nunca el ❌ solo: el alumno se lleva la forma que vio más grande, así que
   mostrar el error con el mismo peso que la corrección lo refuerza.
   El color no carga solo el significado (DUA): van el símbolo, la etiqueta para
   lector de pantalla y el tachado, además del verde y el rojo. */
const ParEjemplo = ({ p }) => (
  <div className="mt-3 space-y-1.5" lang="en">
    {p.bien && (
      <p className="flex items-start gap-2 text-[15px] font-semibold leading-snug text-emerald-700"
         style={{ fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif" }}>
        <span aria-hidden="true" className="mt-px">✓</span>
        <span><span className="sr-only">Correcto: </span>{p.bien}</span>
      </p>
    )}
    {p.mal && (
      <p className="flex items-start gap-2 text-[13px] leading-snug text-muted"
         style={{ fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif" }}>
        <span aria-hidden="true" className="mt-px text-rose-600">✗</span>
        <span className="line-through decoration-rose-400"><span className="sr-only">Incorrecto: </span>{p.mal}</span>
      </p>
    )}
  </div>
);

/* Cuerpo compartido por la línea desplegada y el aviso. */
const PhraseBody = ({ p, t, lang, big }) => (
  <>
    <blockquote className={`${big ? 'text-lg sm:text-xl' : 'text-[15px] sm:text-base'} leading-snug text-slate-800 font-medium`}>
      {p.es}
    </blockquote>

    {p.prompt && <PromptBox text={p.prompt} t={t} />}
    {(p.bien || p.mal) && <ParEjemplo p={p} />}

    {p.en && (
      <p
        lang="en"
        className="mt-2.5 text-[13px] leading-snug text-muted italic"
        style={{ fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif" }}
      >
        <span className="not-italic font-semibold text-muted mr-1">{t.phraseOriginal}:</span>
        “{p.en}”
      </p>
    )}

    <div className="mt-3 pt-2.5 border-t border-slate-100">
      <p className="text-[11px] font-semibold text-muted leading-snug">
        {CATEGORIES[p.cat][lang]}
      </p>
      <p className="text-[11px] text-muted leading-snug">
        {/* "Fuente" no se imprime: la posición y el separador ya lo dicen, y una
            tercera etiqueta volvería a cargar la tarjeta. Pero sí se anuncia. */}
        <span className="sr-only">{t.phraseSource}: </span>
        <cite className="not-italic">{p.source}</cite>
      </p>
    </div>

    {p.note && (
      <p className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[11px] leading-snug text-amber-900">
        <span aria-hidden="true">⚠️</span> {p.note}
      </p>
    )}
  </>
);

const DailyPhrase = ({ lang, level, onOpenChange }) => {
  const t = translations[lang];

  // Una sola vez por montaje: pickToday escribe en localStorage al cambiar el día.
  // `level` filtra los ítems que nombran una estructura que el alumno aún no ve.
  const today = useMemo(() => pickToday(storage(), { level }), [level]);
  const [open, setOpen] = useState(() => !!today?.phrase && !today.seen);
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback(() => { markSeen(storage()); setOpen(false); }, []);

  // El aviso de instalar es un panel fijo abajo: mientras el modal esté
  // abierto se aparta, para no apilar dos interrupciones en la misma carga.
  useEffect(() => { onOpenChange?.(open); }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      // Cepo de foco simple: con un solo botón, Tab siempre vuelve a él.
      if (e.key === 'Tab' && panelRef.current) { e.preventDefault(); closeRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open, close]);

  if (!today?.phrase) return null;
  const p = today.phrase;

  return (
    <>
      {/* Línea plegada: queda en la home todo el día. Una sola etiqueta —
          la categoría vive abajo, dentro del aviso, junto a la fuente. */}
      <button
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="w-full max-w-2xl mb-5 flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3.5 py-2.5 text-left shadow-sm hover:border-slate-300 transition-colors touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {t.phraseTitle}
        </span>
        <span className="ml-auto text-muted text-xs font-bold" aria-hidden="true">›</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/65 backdrop-blur-sm gh-fade"
          onClick={close}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gh-phrase-title"
            onClick={(e) => e.stopPropagation()}
            /* gh-dialog lleva la superficie y el borde: en modo oscuro un panel
               no se puede separar del fondo por luminancia (el máximo medido es
               1,5:1 y baja junto con el velo), así que el borde no es adorno. */
            className="gh-sheet gh-dialog w-full sm:max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl px-5 pt-4 pb-5 sm:p-6 shadow-2xl"
          >
            {/* Agarradera: en celular esto se abre desde abajo y conviene que se lea como tal */}
            <div className="gh-grabber sm:hidden mx-auto mb-3 h-1 w-10 rounded-full" aria-hidden="true" />

            <p id="gh-phrase-title" className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted">
              {t.phraseTitle}
            </p>

            <PhraseBody p={p} t={t} lang={lang} big />

            {/* Botón con texto y no solo una X: una X invita a descartar,
                un botón con texto invita a terminar de leer. */}
            <button
              ref={closeRef}
              onClick={close}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <X size={15} aria-hidden="true" />
              {t.phraseClose}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyPhrase;
