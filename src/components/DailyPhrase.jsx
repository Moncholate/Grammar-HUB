import { useMemo } from 'react';
import { CATEGORIES } from '../data/phrases';
import { pickToday } from '../dailyPhrase';
import { translations } from '../i18n';

/* Frase del día.
   El banco no son frases motivacionales sueltas, sino datos con respaldo: por
   eso la fuente va SIEMPRE visible junto al texto, y no escondida tras un
   despliegue. Cuando el ítem está en debate académico o carece de fuente
   primaria, la advertencia se imprime igual de visible.

   Sin color por categoría a propósito: en esta suite el color ya significa
   otra cosa (familias de tiempos, tipos de palabra). La categoría se distingue
   por icono + nombre, que es además el canal que pide el DUA. */
const DailyPhrase = ({ lang }) => {
  const t = translations[lang];

  // Una sola vez por montaje: pickToday escribe en localStorage al cambiar el día.
  const today = useMemo(() => {
    let storage = null;
    try { storage = window.localStorage; } catch (e) { /* modo privado */ }
    return pickToday(storage);
  }, []);

  if (!today?.phrase) return null;
  const p = today.phrase;
  const cat = CATEGORIES[p.cat];

  return (
    <figure className="w-full max-w-2xl mb-5 bg-white rounded-2xl border border-slate-200 px-4 py-3.5 shadow-sm">
      <div className="flex items-baseline gap-2 flex-wrap mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t.phraseTitle}
        </span>
        <span className="text-slate-400" aria-hidden="true">·</span>
        <span className="text-[11px] font-semibold text-slate-500">
          <span aria-hidden="true">{cat.icon}</span> {cat[lang]}
        </span>
      </div>

      <blockquote className="text-[15px] sm:text-base leading-snug text-slate-800 font-medium">
        {p.es}
      </blockquote>

      {p.en && (
        <p
          lang="en"
          className="mt-2 text-[13px] leading-snug text-slate-500 italic"
          style={{ fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif" }}
        >
          <span className="not-italic font-semibold text-slate-400 mr-1">{t.phraseOriginal}:</span>
          “{p.en}”
        </p>
      )}

      <figcaption className="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] leading-snug text-slate-500">
        <span className="font-semibold text-slate-400">{t.phraseSource}: </span>
        <cite className="not-italic">{p.source}</cite>
      </figcaption>

      {p.note && (
        <p className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[11px] leading-snug text-amber-900">
          <span aria-hidden="true">⚠️</span> {p.note}
        </p>
      )}
    </figure>
  );
};

export default DailyPhrase;
