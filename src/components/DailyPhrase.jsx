import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
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

   Sin color por categoría a propósito: en esta suite el color ya significa
   otra cosa (familias de tiempos, tipos de palabra). La categoría se distingue
   por icono + nombre, que es además el canal que pide el DUA. */

const storage = () => { try { return window.localStorage; } catch (e) { return null; } };

/* Cuerpo compartido por la línea desplegada y el aviso. */
const PhraseBody = ({ p, t, big }) => (
  <>
    <blockquote className={`${big ? 'text-lg sm:text-xl' : 'text-[15px] sm:text-base'} leading-snug text-slate-800 font-medium`}>
      {p.es}
    </blockquote>

    {p.en && (
      <p
        lang="en"
        className="mt-2.5 text-[13px] leading-snug text-slate-500 italic"
        style={{ fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif" }}
      >
        <span className="not-italic font-semibold text-slate-400 mr-1">{t.phraseOriginal}:</span>
        “{p.en}”
      </p>
    )}

    <p className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] leading-snug text-slate-500">
      <span className="font-semibold text-slate-400">{t.phraseSource}: </span>
      <cite className="not-italic">{p.source}</cite>
    </p>

    {p.note && (
      <p className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[11px] leading-snug text-amber-900">
        <span aria-hidden="true">⚠️</span> {p.note}
      </p>
    )}
  </>
);

const DailyPhrase = ({ lang, onOpenChange }) => {
  const t = translations[lang];

  // Una sola vez por montaje: pickToday escribe en localStorage al cambiar el día.
  const today = useMemo(() => pickToday(storage()), []);
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
  const cat = CATEGORIES[p.cat];

  const eyebrow = (
    <>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.phraseTitle}</span>
      <span className="text-slate-400" aria-hidden="true">·</span>
      <span className="text-[11px] font-semibold text-slate-500">
        <span aria-hidden="true">{cat.icon}</span> {cat[lang]}
      </span>
    </>
  );

  return (
    <>
      {/* Línea plegada: queda en la home todo el día */}
      <button
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="w-full max-w-2xl mb-5 flex items-center gap-2 flex-wrap bg-white rounded-xl border border-slate-200 px-3.5 py-2.5 text-left shadow-sm hover:border-slate-300 transition-colors touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {eyebrow}
        <span className="ml-auto text-slate-400 text-xs font-bold" aria-hidden="true">›</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/50 gh-fade"
          onClick={close}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gh-phrase-title"
            onClick={(e) => e.stopPropagation()}
            className="gh-sheet w-full sm:max-w-lg max-h-[88vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl px-5 pt-4 pb-5 sm:p-6 shadow-2xl"
          >
            {/* Agarradera: en celular esto se abre desde abajo y conviene que se lea como tal */}
            <div className="sm:hidden mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" aria-hidden="true" />

            <div id="gh-phrase-title" className="flex items-baseline gap-2 flex-wrap mb-3">
              {eyebrow}
            </div>

            <PhraseBody p={p} t={t} big />

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
