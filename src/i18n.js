export const translations = {
  es: {
    subtitle: 'Tu laboratorio de inglés',
    hero: '¿Qué quieres practicar?',
    heroSub: 'Elige tu nivel y luego una app para empezar',
    open: 'Abrir',
    back: 'Volver',
    /* Nombra el destino a proposito: dentro de la app hay sus propios «atras»
       y un «Volver» generico se llevaba los clics dirigidos a ellos. */
    backToHub: 'Hub',
    levelLabel: 'Nivel',
    step1: 'Elige tu nivel',
    step2: 'Elige tu app',
    needLevel: 'Primero elige tu nivel aquí arriba 👆',
    phraseTitle: 'Frase del día',
    phraseSource: 'Fuente',
    phraseOriginal: 'Original',
    phraseClose: 'Entendido',
    phraseCopy: 'Copiar',
    phraseCopied: 'Copiado',
    grammaster: { tagline: 'Arma oraciones, pieza por pieza.' },
    desgramatizador: { tagline: 'Desarma oraciones y descubre cómo funcionan.' },
    questionlab: { tagline: 'Arma preguntas y respóndelas como ping pong.' },
  },
  en: {
    subtitle: 'Your English laboratory',
    hero: 'What do you want to practice?',
    heroSub: 'Choose your level and then an app to get started',
    open: 'Open',
    back: 'Back',
    backToHub: 'Hub',
    levelLabel: 'Level',
    step1: 'Choose your level',
    step2: 'Choose your app',
    needLevel: 'First choose your level up here 👆',
    phraseTitle: 'Phrase of the day',
    phraseSource: 'Source',
    phraseOriginal: 'Original',
    phraseClose: 'Got it',
    phraseCopy: 'Copy',
    phraseCopied: 'Copied',
    grammaster: { tagline: 'Build sentences, piece by piece.' },
    desgramatizador: { tagline: 'Break down sentences and discover how they work.' },
    questionlab: { tagline: 'Build questions and answer them like ping-pong.' },
  },
};

export const LEVELS = [
  { id: 'basico1',     es: 'Básico I',        en: 'Basic I' },
  { id: 'basico2',     es: 'Básico II',       en: 'Basic II' },
  { id: 'elemental1',  es: 'Elemental I',     en: 'Elementary I' },
  { id: 'elemental2',  es: 'Elemental II',    en: 'Elementary II' },
  { id: 'intermedio1', es: 'Intermedio I',    en: 'Intermediate I' },
  { id: 'intermedio2', es: 'Intermedio II',   en: 'Intermediate II' },
  { id: 'avanzado',    es: 'Intermedio Alto', en: 'Upper-Interm.' },
];

// Los 7 niveles agrupados en sus 3 etapas, para el selector del Hub.
// `short` es lo que va en el botón (la etiqueta de la etapa ya dice el resto);
// los ids son los mismos de LEVELS — las apps los reciben igual que siempre.
export const STAGES = [
  { id: 'basico',     es: 'Básico',     en: 'Basic',
    levels: [ { id: 'basico1', short: 'I' }, { id: 'basico2', short: 'II' } ] },
  { id: 'elemental',  es: 'Elemental',  en: 'Elementary',
    levels: [ { id: 'elemental1', short: 'I' }, { id: 'elemental2', short: 'II' } ] },
  { id: 'intermedio', es: 'Intermedio', en: 'Intermediate',
    levels: [ { id: 'intermedio1', short: 'I' }, { id: 'intermedio2', short: 'II' },
              { id: 'avanzado', short: { es: 'Alto', en: 'Upper' } } ] },
];
