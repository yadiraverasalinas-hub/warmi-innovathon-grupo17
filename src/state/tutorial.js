const viewKeys = [
  'tab',
  'recipeId',
  'modal',
  'shareDraft',
  'supportUnlocked',
  'portionInput',
  'portionResults'
];

export const tutorialSteps = [
  {
    title: 'Encuentra tu receta especial',
    description: 'Abre Favoritas. Allí guardamos la receta que elegiste al configurar la aplicación.',
    action: 'navigate',
    tab: 'fav',
    target: 'favorites-tab'
  },
  {
    title: 'Abre la receta',
    description: 'Toca la receta que elegiste para ver sus detalles.',
    action: 'open-recipe',
    recipeId: true,
    target: 'trusted-recipe'
  },
  {
    title: 'Explora la calculadora',
    description: 'Abre la calculadora de porciones y costos desde la receta.',
    action: 'open-portion-calculator',
    recipeId: true,
    target: 'portion-calculator'
  },
  {
    title: 'Activa el modo apoyo',
    description: 'Escribe tu PIN en «Porciones deseadas» y toca «Ajustar cantidades». No lo compartas con nadie.',
    action: 'pin-unlocked',
    target: 'portion-input'
  },
  {
    title: 'Conoce Tiendas',
    description: 'Abre Tiendas para ver establecimientos y direcciones de ejemplo, no verificados ni confirmados como lugares seguros. No son recomendaciones para acudir.',
    action: 'navigate',
    tab: 'shop',
    target: 'shops-tab'
  },
  {
    title: 'Puntos de demostración',
    description: 'Los establecimientos y direcciones son ejemplos no verificados; no son lugares seguros confirmados ni recomendaciones para acudir. Durante la práctica no se consulta ubicación; en el uso normal solo se hace si tú la solicitas.',
    action: 'tutorial-continue',
    target: 'shops-warning'
  },
  {
    title: 'Conoce Bienestar',
    description: 'Abre Bienestar para encontrar recursos de orientación y teléfonos útiles.',
    action: 'navigate',
    tab: 'well',
    target: 'wellbeing-tab'
  },
  {
    title: 'Recursos de Bienestar',
    description: 'La sección reúne artículos, teléfonos útiles y una cocinera con respuestas predefinidas. No reemplaza la atención profesional.',
    action: 'tutorial-continue',
    target: 'wellbeing-title'
  },
  {
    title: 'Vuelve a Favoritas',
    description: 'Abre Favoritas para volver a la receta elegida.',
    action: 'navigate',
    tab: 'fav',
    target: 'favorites-tab'
  },
  {
    title: 'Abre la receta especial',
    description: 'Toca la receta que elegiste durante la configuración.',
    action: 'open-recipe',
    recipeId: true,
    target: 'trusted-recipe'
  },
  {
    title: 'Prepara el mensaje',
    description: 'Toca «Compartir receta» para revisar el mensaje antes de elegir a quién enviarlo.',
    action: 'open-share',
    recipeId: true,
    target: 'share-recipe'
  },
  {
    title: 'Revisa y elige destinatario',
    description: 'Selecciona a la persona acordada para completar la práctica. No se abrirá WhatsApp ni se enviará ningún mensaje.',
    action: 'recipient-selected',
    target: 'share-recipient'
  },
  {
    title: 'Terminaste la práctica',
    description: 'Pulsa «Terminar» o «Salir» para volver al recetario.',
    target: null,
    placement: 'top'
  }
];

export function getTutorialTargetSelector(state) {
  const step = tutorialSteps[state.tutorialStep];
  if (!step?.target) return null;

  if (step.target === 'favorites-tab') {
    return '[data-action="navigate"][data-tab="fav"]';
  }
  if (step.target === 'shops-tab') {
    return '[data-action="navigate"][data-tab="shop"]';
  }
  if (step.target === 'wellbeing-tab') {
    return '[data-action="navigate"][data-tab="well"]';
  }
  if (step.target === 'shops-warning') {
    return '[aria-labelledby="shops-title"] .banner';
  }
  if (step.target === 'wellbeing-title') return '#wellbeing-title';
  if (step.target === 'portion-input') {
    return '#portion-count, [data-form="portion-calculator"] button[type="submit"]';
  }
  if (step.target === 'share-recipient') return 'a.share-recipient[href^="https://wa.me/"]';

  const recipeId = state.profile?.trustedRecipeId;
  if (typeof recipeId !== 'string' || !/^[a-z0-9-]+$/.test(recipeId)) return null;
  if (step.target === 'trusted-recipe') {
    return `[data-action="open-recipe"][data-id="${recipeId}"]`;
  }
  if (step.target === 'portion-calculator') {
    return `[data-action="open-portion-calculator"][data-id="${recipeId}"]`;
  }
  if (step.target === 'share-recipe') {
    return `[data-action="open-share"][data-id="${recipeId}"]`;
  }
  return null;
}

export function snapshotTutorialView(state) {
  return Object.fromEntries(viewKeys.map((key) => [
    key,
    key === 'shareDraft' && state[key] ? { ...state[key] } : state[key]
  ]));
}

export function advanceTutorial(state, action, details = {}, snapshot = snapshotTutorialView(state)) {
  const step = tutorialSteps[state.tutorialStep];
  if (!state.tutorialActive || !step || step.action !== action) return false;
  if (step.tab && details.tab !== step.tab) return false;
  if (step.recipeId && details.id !== state.profile?.trustedRecipeId) return false;
  if (action === 'pin-unlocked' && !state.supportUnlocked) return false;
  if (action === 'recipient-selected' && state.shareDraft?.mode !== 'recipe') return false;

  state.tutorialHistory.push(snapshot);
  state.tutorialStep += 1;
  return true;
}

export function previousTutorialStep(state) {
  if (!state.tutorialActive || state.tutorialStep === 0 || !state.tutorialHistory.length) return false;
  Object.assign(state, state.tutorialHistory.pop());
  state.tutorialStep -= 1;
  return true;
}
