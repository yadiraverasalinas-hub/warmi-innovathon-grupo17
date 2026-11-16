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
    title: 'Conoce el temporizador',
    description: 'El temporizador de cocina avisa solo mientras la app sigue abierta. Al activar el modo apoyo, «Iniciar» consulta la ubicación que tú autorizas y prepara un aviso; al vencer, tú decides si compartirlo. Nunca envía mensajes por su cuenta.',
    action: 'tutorial-continue',
    target: 'timer-panel'
  },
  {
    title: 'Explora la calculadora',
    description: 'Abre la calculadora de porciones y costos desde la receta.',
    action: 'open-portion-calculator',
    recipeId: true,
    target: 'portion-calculator'
  },
  {
    title: 'Opciones de seguridad',
    description: 'Desde el inicio, cinco toques seguidos al título abren la configuración para gestionar el PIN y los contactos. La configuración es opcional.',
    action: 'tutorial-continue',
    target: null
  },
  {
    title: 'Activa el modo apoyo',
    description: 'Escribe tu PIN en «Porciones deseadas» y toca «Ajustar cantidades». No lo compartas con nadie.',
    action: 'pin-unlocked',
    target: 'portion-input',
    requiresSupport: true
  },
  {
    title: 'Conoce Tiendas',
    description: 'Abre Tiendas para ver establecimientos y direcciones de ejemplo, no verificados ni confirmados como lugares seguros. No son recomendaciones para acudir.',
    action: 'navigate',
    tab: 'shop',
    target: 'shops-tab',
    requiresSupport: true
  },
  {
    title: 'Puntos de demostración',
    description: 'Los establecimientos y direcciones son ejemplos no verificados; no son lugares seguros confirmados ni recomendaciones para acudir. Durante la práctica no se consulta ubicación; en el uso normal solo se hace si tú la solicitas.',
    action: 'tutorial-continue',
    target: 'shops-warning',
    requiresSupport: true
  },
  {
    title: 'Conoce Bienestar',
    description: 'Abre Bienestar para encontrar recursos de orientación y teléfonos útiles.',
    action: 'navigate',
    tab: 'well',
    target: 'wellbeing-tab',
    requiresSupport: true
  },
  {
    title: 'Recursos de Bienestar',
    description: 'La sección reúne artículos, teléfonos útiles y una cocinera con respuestas predefinidas. No reemplaza la atención profesional.',
    action: 'tutorial-continue',
    target: 'wellbeing-title',
    requiresSupport: true
  },
  {
    title: 'Salida rápida',
    description: '«Salir» en la barra superior cierra el modo apoyo y vuelve al recetario. También puedes salir desde el control de esta práctica.',
    action: 'tutorial-continue',
    target: 'quick-exit',
    requiresSupport: true
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
    target: 'share-recipe',
    requiresSupport: true,
    requiresContacts: true
  },
  {
    title: 'Revisa y elige destinatario',
    description: 'Selecciona a la persona acordada para completar la práctica. No se abrirá WhatsApp ni se enviará ningún mensaje.',
    action: 'recipient-selected',
    target: 'share-recipient',
    requiresSupport: true,
    requiresContacts: true
  },
  {
    title: 'Terminaste la práctica',
    description: 'Pulsa «Terminar» o «Salir» para volver al recetario.',
    target: null,
    placement: 'top'
  }
];

const basicTutorialSteps = [
  {
    title: 'Explora las secciones',
    description: 'Usa la navegación inferior para recorrer Inicio, Buscar y Favoritas.',
    action: 'navigate',
    tab: 'search',
    target: 'search-tab'
  },
  {
    title: 'Vuelve al inicio',
    description: 'Desde Inicio puedes explorar el recetario libremente.',
    action: 'navigate',
    tab: 'home',
    target: 'home-tab'
  },
  {
    title: 'Abre una receta',
    description: 'Elige cualquier receta del recetario para ver sus detalles.',
    action: 'open-recipe',
    target: 'any-recipe'
  },
  tutorialSteps[2],
  {
    ...tutorialSteps[3],
    recipeId: false,
    target: 'any-calculator'
  },
  {
    title: 'Abre Preferencias',
    description: 'Aquí puedes cambiar las preferencias y volver a consultar el tutorial.',
    action: 'open-settings',
    target: 'settings-button'
  },
  {
    title: 'Opciones de seguridad',
    description: 'Desde el inicio, cinco toques seguidos al título abren la configuración. Crear un PIN o agregar contactos es opcional.',
    action: 'tutorial-continue',
    target: null
  },
  tutorialSteps[tutorialSteps.length - 1]
];

function getUnconfiguredRecipeTutorialSteps(includeContacts) {
  const steps = [...basicTutorialSteps.slice(0, 5), tutorialSteps[4], ...tutorialSteps.slice(5, 11)];
  if (includeContacts) {
    steps.push(
      {
        title: 'Vuelve al inicio',
        description: 'Abre Inicio para elegir una receta y practicar el compartir.',
        action: 'navigate',
        tab: 'home',
        target: 'home-tab'
      },
      {
        title: 'Abre una receta',
        description: 'Elige una receta para revisar sus opciones.',
        action: 'open-recipe',
        target: 'any-recipe'
      },
      { ...tutorialSteps[13], recipeId: false, target: 'any-share' },
      tutorialSteps[14]
    );
  }
  steps.push(tutorialSteps[tutorialSteps.length - 1]);
  return steps;
}

export function getTutorialSteps(state) {
  if (!state.profile?.trustedRecipeId) {
    if (!state.hasSupportPin) return basicTutorialSteps;
    return getUnconfiguredRecipeTutorialSteps(state.profile?.contacts?.length > 0);
  }
  return tutorialSteps.filter((step) => (
    (!step.requiresSupport || state.hasSupportPin)
    && (!step.requiresContacts || state.profile.contacts.length > 0)
  ));
}

export function getTutorialTargetSelector(state) {
  const step = getTutorialSteps(state)[state.tutorialStep];
  if (!step?.target) return null;

  if (step.target === 'search-tab') return '[data-action="navigate"][data-tab="search"]';
  if (step.target === 'home-tab') return '[data-action="navigate"][data-tab="home"]';
  if (step.target === 'any-recipe') return '[data-action="open-recipe"]';
  if (step.target === 'any-calculator') return '[data-action="open-portion-calculator"]';
  if (step.target === 'any-share') return '[data-action="open-share"]';
  if (step.target === 'settings-button') return '[data-action="open-settings"]';
  if (step.target === 'quick-exit') return '[data-action="quick-exit"]';
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
  if (step.target === 'timer-panel') return '.timer-panel';
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
  const step = getTutorialSteps(state)[state.tutorialStep];
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
