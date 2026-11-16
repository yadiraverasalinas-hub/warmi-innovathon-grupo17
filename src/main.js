import './assets/styles/main.css';
import './assets/styles/components.css';
import './assets/styles/responsive.css';
import { recipes } from './data/recipes.js';
import { appState, resetTransientState } from './state/appState.js';
import { loadSettings, markSetupCompleted, markOnboardingCompleted, saveFavorites, saveProfile, savePreferences, saveSupportPin, verifySupportPin, clearAppData } from './services/storage.js';
import { getCurrentLocation } from './services/geolocation.js';
import { safePoints } from './data/safePoints.js';
import { costPerServing, formatSoles, sanitizeCostInput, sumCosts } from './utils/costs.js';
import { contactMessageText, contactMessageURL, shareRecipe } from './services/sharing.js';
import { renderMap, destroyMap } from './services/map.js';
import { renderNavigation } from './components/navigation.js';
import { renderModal } from './components/modal.js';
import { renderIcon } from './components/icons.js';
import { showToast } from './components/toast.js';
import { renderHome } from './views/home.js';
import { renderSearch, renderSearchResults } from './views/search.js';
import { renderFavorites } from './views/favorites.js';
import { renderRecipeDetail } from './views/recipeDetail.js';
import { renderSafePoints } from './views/safePoints.js';
import { renderWellbeing } from './views/wellbeing.js';
import { renderSetup } from './views/setup.js';
import { renderTutorialOverlay } from './views/demo.js';
import { advanceTutorial, getTutorialTargetSelector, previousTutorialStep, snapshotTutorialView } from './state/tutorial.js';
import { escapeHTML } from './utils/security.js';
import { validateContacts } from './utils/validation.js';

const root = document.querySelector('#root');
const titles = {
  home: ['Recetario Casero', '¿Qué cocinamos hoy?'],
  search: ['Buscar', 'Recetas e ingredientes'],
  fav: ['Favoritas', 'Tus recetas guardadas'],
  shop: ['Tiendas', 'Datos ilustrativos, no verificados'],
  well: ['Bienestar y apoyo', 'Orientación y recursos']
};

let deferredInstallPrompt = null;
let initialSetupRequired = false;
let lastSensitiveActivity = Date.now();
let setupTapCount = 0;
let setupTapTimeout = null;

try {
  const settings = loadSettings();
  appState.favorites = settings.favorites;
  appState.profile = settings.profile;
  appState.hasSupportPin = settings.hasSupportPin;
  appState.preferences = settings.preferences;
  appState.onboardingCompleted = settings.onboardingCompleted
    || settings.setupCompleted
    || settings.hasPriorUse;
  initialSetupRequired = !settings.setupCompleted && !settings.hasPriorUse;
  if (settings.hasPriorUse && !settings.setupCompleted) markSetupCompleted();
} catch (error) {
  console.error(error);
  appState.storageError = error.message;
}

function renderSettings() {
  const isDark = appState.preferences.theme === 'dark';
  const content = `<div class="settings-actions">
    <div class="settings-fields">
      <label for="setting-name">Tu nombre
        <input id="setting-name" data-preference="name" maxlength="40" value="${escapeHTML(appState.preferences.name)}" autocomplete="given-name">
      </label>
      <label for="setting-font-size">Tamaño de letra
        <select id="setting-font-size" data-preference="fontSize">
          <option value="small" ${appState.preferences.fontSize === 'small' ? 'selected' : ''}>Pequeña</option>
          <option value="normal" ${appState.preferences.fontSize === 'normal' ? 'selected' : ''}>Normal</option>
          <option value="large" ${appState.preferences.fontSize === 'large' ? 'selected' : ''}>Grande</option>
        </select>
      </label>
      <label for="setting-recipe-layout">Cómo ver las recetas
        <select id="setting-recipe-layout" data-preference="recipeLayout">
          <option value="grid" ${appState.preferences.recipeLayout === 'grid' ? 'selected' : ''}>En cuadros</option>
          <option value="list" ${appState.preferences.recipeLayout === 'list' ? 'selected' : ''}>En lista</option>
        </select>
      </label>
    </div>
    <button class="button secondary" type="button" data-action="clear-favorites">Limpiar favoritas</button>
    <button class="button secondary" type="button" data-action="restart-tutorial">Ver tutorial</button>
    <button class="button secondary theme-toggle" type="button" data-action="toggle-theme" aria-label="${isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}">${renderIcon(isDark ? 'sun' : 'moon')}</button>
    ${deferredInstallPrompt ? '<button class="button secondary" type="button" data-action="install-app">Instalar aplicación</button>' : '<p class="note">Para instalar: usa la opción del navegador “Añadir a pantalla de inicio”, si está disponible.</p>'}
  </div>`;
  return renderModal('Preferencias', content);
}

function applyPreferences() {
  document.documentElement.dataset.theme = appState.preferences.theme;
  document.documentElement.dataset.fontSize = appState.preferences.fontSize;
}

function updateTutorialSpotlight() {
  const selector = getTutorialTargetSelector(appState);
  const targets = selector ? [...root.querySelectorAll(selector)] : [];
  const card = root.querySelector('.tutorial-card');
  const fullScrim = root.querySelector('.tutorial-scrim-full');
  const [topScrim, bottomScrim, leftScrim, rightScrim] = [
    '.tutorial-scrim-top',
    '.tutorial-scrim-bottom',
    '.tutorial-scrim-left',
    '.tutorial-scrim-right'
  ].map((className) => root.querySelector(className));
  if (!card) return;
  card.classList.remove('tutorial-card-top', 'tutorial-card-bottom');
  if (!targets.length) {
    fullScrim.hidden = false;
    [topScrim, bottomScrim, leftScrim, rightScrim].forEach((scrim) => { scrim.hidden = true; });
    card.classList.add(card.dataset.placement === 'top' ? 'tutorial-card-top' : 'tutorial-card-bottom');
    return;
  }

  targets.forEach((target) => target.classList.add('tutorial-highlight'));
  fullScrim.hidden = true;
  const getBounds = () => {
    const rects = targets.map((target) => target.getBoundingClientRect());
    return {
      left: Math.min(...rects.map((rect) => rect.left)),
      top: Math.min(...rects.map((rect) => rect.top)),
      right: Math.max(...rects.map((rect) => rect.right)),
      bottom: Math.max(...rects.map((rect) => rect.bottom))
    };
  };
  const bounds = getBounds();

  const padding = 10;
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight;
  const left = Math.max(0, bounds.left - padding);
  const top = Math.max(0, bounds.top - padding);
  const right = Math.min(viewportWidth, bounds.right + padding);
  const bottom = Math.min(viewportHeight, bounds.bottom + padding);
  const positionScrim = (scrim, x, y, width, height) => {
    scrim.hidden = width <= 0 || height <= 0;
    scrim.style.left = `${x}px`;
    scrim.style.top = `${y}px`;
    scrim.style.width = `${width}px`;
    scrim.style.height = `${height}px`;
  };
  positionScrim(topScrim, 0, 0, viewportWidth, top);
  positionScrim(bottomScrim, 0, bottom, viewportWidth, viewportHeight - bottom);
  positionScrim(leftScrim, 0, top, left, bottom - top);
  positionScrim(rightScrim, right, top, viewportWidth - right, bottom - top);

  const centerY = (bounds.top + bounds.bottom) / 2;
  card.classList.add(centerY > viewportHeight * 0.55 ? 'tutorial-card-top' : 'tutorial-card-bottom');
}

function positionTutorialSpotlight() {
  const selector = getTutorialTargetSelector(appState);
  const targets = selector ? [...root.querySelectorAll(selector)] : [];
  if (!targets.length) {
    updateTutorialSpotlight();
    return;
  }

  const rects = targets.map((target) => target.getBoundingClientRect());
  const top = Math.min(...rects.map((rect) => rect.top));
  const bottom = Math.max(...rects.map((rect) => rect.bottom));
  if (top < 0 || bottom > window.innerHeight) {
    const target = top < 0 ? targets[0] : targets[targets.length - 1];
    target.scrollIntoView({
      block: 'center',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }
  targets.forEach((target) => target.classList.add('tutorial-highlight'));
  targets[0].focus?.({ preventScroll: true });
  updateTutorialSpotlight();
}

let tutorialSpotlightFrame = 0;
function scheduleTutorialSpotlightUpdate() {
  if (!appState.tutorialActive || tutorialSpotlightFrame) return;
  tutorialSpotlightFrame = window.requestAnimationFrame(() => {
    tutorialSpotlightFrame = 0;
    updateTutorialSpotlight();
  });
}

window.addEventListener('scroll', scheduleTutorialSpotlightUpdate, true);
window.addEventListener('resize', () => {
  if (appState.tutorialActive) positionTutorialSpotlight();
});
root.addEventListener('load', () => {
  if (appState.tutorialActive) window.requestAnimationFrame(positionTutorialSpotlight);
}, true);
root.addEventListener('error', () => {
  if (appState.tutorialActive) window.requestAnimationFrame(positionTutorialSpotlight);
}, true);

function renderApp() {
  root.classList.toggle('tutorial-active', appState.tutorialActive);
  root.classList.toggle(
    'onboarding-active',
    appState.mode === 'setup' && !appState.onboardingCompleted && appState.onboardingStep < 3
  );
  if (appState.mode === 'setup') {
    root.innerHTML = renderSetup(appState);
    destroyMap();
    return;
  }

  const unlocked = appState.supportUnlocked;
  if (!unlocked && (appState.tab === 'shop' || appState.tab === 'well')) appState.tab = 'home';

  let title = appState.recipeId
    ? ['Receta', '']
    : (titles[appState.tab] ?? titles.home);
  if (!appState.recipeId && appState.tab === 'home' && appState.supportUnlocked) {
    title = ['Recetario Secreto', title[1]];
  } else if (!appState.recipeId && appState.tab === 'home' && appState.preferences.name) {
    title = [`Hola, ${appState.preferences.name}`, title[1]];
  }
  const content = appState.recipeId
    ? renderRecipeDetail(appState)
    : ({
      home: () => renderHome(appState),
      search: () => renderSearch(appState),
      fav: () => renderFavorites(appState),
      shop: () => renderSafePoints(appState),
      well: () => renderWellbeing(appState)
    }[appState.tab] ?? (() => renderHome(appState)))();
  let modal = appState.modal === 'settings' ? renderSettings() : '';
  if (appState.modal === 'timer-reminder') {
    modal = renderModal('¿Ya está lista?', `<p>El temporizador terminó.</p>
      <button class="button full" type="button" data-action="timer-done">Ya está lista</button>
      <button class="button secondary full share-open-button" type="button" data-action="timer-share">Compartir receta</button>`);
  }

  const header = appState.tab === 'well'
    ? '<header class="wellbeing-backbar"><button class="button quick-exit" type="button" data-action="quick-exit"><span aria-hidden="true">↗</span> Salir rápido</button></header>'
    : `<header class="topbar"><div><h1${appState.tab === 'home' && !appState.recipeId ? ' data-action="secret-setup"' : ''}>${escapeHTML(title[0])}</h1>${title[1] ? `<p>${escapeHTML(title[1])}</p>` : ''}</div>
      <div class="topbar-actions">${unlocked ? '<button class="button quick-exit compact" type="button" data-action="quick-exit"><span aria-hidden="true">↗</span> Salir</button>' : ''}
        <button class="icon-button" type="button" data-action="open-settings" aria-label="Preferencias">⚙</button></div>
    </header>`;
  const timerBar = appState.timerDeadline
    ? `<div class="timer-bar"><span>⏱ Temporizador <strong class="timer-countdown" role="timer">${formatCountdown()}</strong></span><button class="button secondary" type="button" data-action="timer-stop">Detener</button></div>`
    : '';

  const tutorial = appState.tutorialActive ? renderTutorialOverlay(appState) : '';
  root.innerHTML = `${header}${timerBar}${content}${renderNavigation(appState.tab, unlocked)}${modal}${tutorial}`;

  if (appState.tutorialActive) {
    positionTutorialSpotlight();
  }

  if (appState.tab === 'shop' && !appState.recipeId) {
    try {
      renderMap(document.querySelector('#shops-map'), appState.location, (index) => {
        appState.selectedPoint = index;
        renderApp();
      });
    } catch (error) {
      console.error(error);
      const mapElement = document.querySelector('#shops-map');
      if (mapElement) mapElement.textContent = 'No se pudo mostrar el mapa. La lista ilustrativa sigue disponible.';
      showToast('No se pudo cargar el mapa.');
    }
  } else {
    destroyMap();
  }
}

function navigateToApp({ startTutorial = false } = {}) {
  initialSetupRequired = false;
  appState.mode = 'app';
  appState.supportUnlocked = false;
  appState.modal = null;
  appState.shareDraft = null;
  appState.setupStep = 0;
  appState.tutorialActive = startTutorial;
  appState.tutorialStep = 0;
  appState.tutorialHistory = [];
  appState.setupRecipeId = null;
  appState.setupContacts = [{ name: '', phone: '' }, { name: '', phone: '' }];
  appState.setupError = '';
  appState.setupPin = '';
  appState.setupPinConfirm = '';
  history.replaceState(null, '', `${location.pathname}${location.search}`);
  renderApp();
}

function formatCountdown() {
  const seconds = Math.max(0, Math.ceil((appState.timerDeadline - Date.now()) / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function vibrateOnce() {
  if (typeof navigator.vibrate !== 'function') return;
  if (!navigator.vibrate(200)) {
    console.info('El navegador o dispositivo no permitió la vibración; se mostrará el aviso visual.');
  }
}

// Hay un aviso por tiempo de llegada esperando a la usuaria (RF-27, RF-28).
function reminderPending() {
  return Boolean(appState.checkin)
    && (appState.modal === 'timer-reminder' || appState.shareDraft?.mode === 'checkin');
}

function returnToRecipes(options = {}) {
  const keepReminder = Boolean(options.keepReminder)
    && appState.modal === 'timer-reminder'
    && Boolean(appState.checkin);
  try {
    markSetupCompleted();
  } catch (error) {
    console.error(error);
    if (!document.hidden) showToast(error.message);
  }
  initialSetupRequired = false;
  appState.mode = 'app';
  appState.tab = 'home';
  appState.recipeId = null;
  appState.category = 'Todas';
  appState.query = '';
  appState.selectedPoint = null;
  appState.modal = keepReminder ? 'timer-reminder' : null;
  appState.chat = [];
  appState.supportUnlocked = false;
  appState.location = null;
  appState.shareDraft = null;
  appState.setupStep = 0;
  appState.tutorialActive = false;
  appState.tutorialStep = 0;
  appState.tutorialHistory = [];
  appState.setupRecipeId = null;
  appState.setupContacts = [{ name: '', phone: '' }, { name: '', phone: '' }];
  appState.setupError = '';
  appState.setupPin = '';
  appState.setupPinConfirm = '';
  appState.portionInput = '';
  appState.portionResults = null;
  appState.costs = { recipeId: null, values: [] };
  // Un temporizador en marcha sobrevive al cierre del modo apoyo (RF-28); si no hay
  // temporizador ni aviso pendiente, se descartan la ubicación y el destino.
  if (!appState.timerDeadline && !keepReminder) appState.checkin = null;
  history.replaceState(null, '', `${location.pathname}${location.search}`);
  renderApp();
  if (!document.hidden) window.scrollTo(0, 0);
}

function isAtRecipeHome() {
  return appState.mode === 'app'
    && appState.tab === 'home'
    && !appState.recipeId
    && !appState.modal
    && !appState.shareDraft
    && !appState.supportUnlocked
    && !appState.tutorialActive;
}

function handleVisibilityChange() {
  if (document.hidden) {
    if (!isAtRecipeHome()) returnToRecipes({ keepReminder: true });
  } else if (appState.modal === 'timer-reminder' && !appState.checkin) {
    returnToRecipes();
  }
}

function startSetup() {
  appState.setupStep = 1;
  appState.tutorialActive = false;
  appState.tutorialStep = 0;
  appState.tutorialHistory = [];
  appState.setupRecipeId = appState.profile.trustedRecipeId;
  const contactCount = Math.max(2, Math.min(3, appState.profile.contacts.length));
  appState.setupContacts = [...appState.profile.contacts, ...Array.from(
    { length: Math.max(0, contactCount - appState.profile.contacts.length) },
    () => ({ name: '', phone: '' })
  )].slice(0, contactCount);
  appState.setupError = '';
  appState.setupPin = '';
  appState.setupPinConfirm = '';
}

async function completeSetup(startTutorial = false) {
  try {
    appState.profile = {
      trustedRecipeId: appState.setupRecipeId,
      contacts: appState.setupContacts.filter((contact) => contact.name.trim() && contact.phone.trim())
    };
    saveProfile(appState.profile);
    if (appState.setupPin) {
      await saveSupportPin(appState.setupPin);
      appState.hasSupportPin = true;
    }
    const favorites = [...new Set([appState.profile.trustedRecipeId, ...appState.favorites].filter(Boolean))];
    saveFavorites(favorites);
    markSetupCompleted();
    appState.favorites = favorites;
    appState.tab = 'home';
    navigateToApp({ startTutorial });
    if (startTutorial) lastSensitiveActivity = Date.now();
  } catch (error) {
    console.error(error);
    showToast(error.message);
  }
}

function route() {
  const hash = location.hash;
  if (initialSetupRequired) {
    if (appState.mode !== 'setup') {
      startSetup();
      if (!appState.onboardingCompleted) appState.setupStep = 0;
    }
    appState.mode = 'setup';
  } else {
    appState.mode = 'app';
    if (hash === '#setup' || hash === '#demo') {
      history.replaceState(null, '', `${location.pathname}${location.search}`);
    }
  }
  appState.modal = null;
  appState.location = null;
  renderApp();
}

function toggleFavorite(id) {
  if (!recipes.some((recipe) => recipe.id === id)) return;
  const favorites = appState.favorites.includes(id)
    ? appState.favorites.filter((favorite) => favorite !== id)
    : [...appState.favorites, id];
  try {
    saveFavorites(favorites);
    appState.favorites = favorites;
    renderApp();
  } catch (error) {
    console.error(error);
    showToast(error.message);
  }
}

async function prepareLocationShare(contactIndex) {
  if (!appState.supportUnlocked || appState.tutorialActive) return;
  const recipe = recipes.find((item) => item.id === appState.shareDraft?.recipeId);
  const contact = appState.profile.contacts[contactIndex];
  if (!recipe || !contact) {
    appState.shareDraft = null;
    showToast('No se encontró la receta o el contacto.');
    renderApp();
    return;
  }

  showToast('Solicitando tu ubicación actual…');
  try {
    const location = await getCurrentLocation();
    const trusted = appState.profile.trustedRecipeId === recipe.id;
    const message = contactMessageText(recipe, trusted, location);
    appState.shareDraft = {
      recipeId: recipe.id,
      mode: 'location',
      contactName: contact.name,
      message,
      url: contactMessageURL(contact, recipe, trusted, location)
    };
  } catch (error) {
    showToast(error.message);
    appState.shareDraft = null;
  }
  renderApp();
}

function answerAssistant(text) {
  const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let answer;
  if (/miedo|golpe|pega|grita|amenaz|controla|celular|no puedo salir|violen|maltrat|dano|asust|triste|sola/.test(normalized)) {
    answer = 'Gracias por contármelo. Lo que sientes importa y no estás sola. Si hay peligro inmediato, llama al 105 si puedes hacerlo con seguridad. La Línea 100 es gratuita y atiende las 24 horas. Este asistente usa respuestas predefinidas y no es un servicio profesional.';
  } else if (/arroz/.test(normalized)) {
    answer = 'Para un arroz suelto, enjuágalo bien y usa 2 tazas de agua por taza de arroz.';
  } else if (/cebolla/.test(normalized)) {
    answer = 'Si la cebolla te hace llorar, enfríala 15 minutos antes de cortarla.';
  } else if (/sal/.test(normalized)) {
    answer = 'Si te pasaste de sal, agrega una papa cruda en cuartos y retírala al final.';
  } else {
    answer = 'Cuéntame qué estás preparando y te doy un consejo de cocina.';
  }
  appState.chat.push({ from: 'user', text }, { from: 'assistant', text: answer });
}

async function handleClick(event) {
  const tutorialSnapshot = appState.tutorialActive ? snapshotTutorialView(appState) : null;
  const clickedLink = event.target.closest('a[href]');
  if (appState.tutorialActive && clickedLink) {
    event.preventDefault();
    if (clickedLink.matches('a.share-recipient[href^="https://wa.me/"]')
      && advanceTutorial(appState, 'recipient-selected', {}, tutorialSnapshot)) {
      renderApp();
    }
    return;
  }

  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  if (action === 'stop-propagation') {
    event.stopPropagation();
    return;
  }
  if (target.tagName !== 'A' || target.getAttribute('href') === '#') event.preventDefault();

  switch (action) {
    case 'navigate':
      if ((target.dataset.tab === 'shop' || target.dataset.tab === 'well') && !appState.supportUnlocked) break;
      if (appState.tab === 'shop' && target.dataset.tab !== 'shop') appState.location = null;
      appState.tab = target.dataset.tab;
      appState.recipeId = null;
      appState.selectedPoint = null;
      appState.modal = null;
      appState.shareDraft = null;
      if (appState.tab !== 'well') appState.chat = [];
      advanceTutorial(appState, 'navigate', { tab: target.dataset.tab }, tutorialSnapshot);
      window.scrollTo(0, 0);
      renderApp();
      break;
    case 'open-recipe':
      appState.recipeId = target.dataset.id;
      appState.shareDraft = null;
      advanceTutorial(appState, 'open-recipe', { id: target.dataset.id }, tutorialSnapshot);
      window.scrollTo(0, 0);
      renderApp();
      break;
    case 'back':
      appState.recipeId = null;
      appState.shareDraft = null;
      renderApp();
      break;
    case 'category':
      appState.category = target.dataset.category;
      renderApp();
      break;
    case 'secret-setup':
      if (appState.mode !== 'app' || appState.tab !== 'home' || appState.recipeId || initialSetupRequired) break;
      setupTapCount += 1;
      window.clearTimeout(setupTapTimeout);
      if (setupTapCount >= 5) {
        setupTapCount = 0;
        startSetup();
        appState.mode = 'setup';
        appState.modal = null;
        lastSensitiveActivity = Date.now();
        renderApp();
        window.scrollTo(0, 0);
      } else {
        setupTapTimeout = window.setTimeout(() => { setupTapCount = 0; }, 3000);
      }
      break;
    case 'toggle-favorite':
      if (appState.tutorialActive && target.dataset.id === appState.profile.trustedRecipeId) {
        showToast('La receta elegida debe permanecer en Favoritas durante la práctica.');
        break;
      }
      toggleFavorite(target.dataset.id);
      break;
    case 'open-settings':
      appState.modal = 'settings';
      advanceTutorial(appState, 'open-settings', {}, tutorialSnapshot);
      lastSensitiveActivity = Date.now();
      renderApp();
      break;
    case 'edit-setup':
      if (!appState.supportUnlocked || appState.tab !== 'well') break;
      startSetup();
      appState.mode = 'setup';
      renderApp();
      window.scrollTo(0, 0);
      break;
    case 'restart-tutorial':
      if (appState.modal !== 'settings') break;
      appState.modal = null;
      appState.tutorialActive = true;
      appState.tutorialStep = 0;
      appState.tutorialHistory = [];
      lastSensitiveActivity = Date.now();
      renderApp();
      break;

    // Onboarding actions
    case 'onboarding-next': {
      if (appState.onboardingStep < 2) {
        appState.onboardingStep += 1;
        renderApp();
      } else {
        try {
          markOnboardingCompleted();
        } catch (error) {
          console.error(error);
          showToast(error.message);
          break;
        }
        appState.onboardingCompleted = true;
        appState.onboardingStep = 0;
        startSetup();
        appState.mode = 'setup';
        renderApp();
      }
      break;
    }
    case 'onboarding-back': {
      if (appState.onboardingStep > 0) {
        appState.onboardingStep -= 1;
      }
      renderApp();
      break;
    }
    case 'onboarding-skip': {
      try {
        markOnboardingCompleted();
        markSetupCompleted();
        appState.onboardingCompleted = true;
        appState.onboardingStep = 0;
        navigateToApp();
      } catch (error) {
        console.error(error);
        showToast(error.message);
      }
      break;
    }
    case 'open-portion-calculator':
      if (!recipes.some((recipe) => recipe.id === target.dataset.id)) break;
      appState.recipeId = target.dataset.id;
      appState.portionInput = String(recipes.find((recipe) => recipe.id === target.dataset.id).servings);
      appState.portionResults = null;
      if (appState.costs.recipeId !== target.dataset.id) appState.costs = { recipeId: target.dataset.id, values: [] };
      appState.modal = 'portion-calculator';
      advanceTutorial(appState, 'open-portion-calculator', { id: target.dataset.id }, tutorialSnapshot);
      renderApp();
      document.querySelector('#portion-count')?.focus();
      break;
    case 'timer-done':
      appState.modal = null;
      appState.timerDeadline = null;
      appState.timerRecipeId = null;
      appState.checkin = null;
      renderApp();
      break;
    case 'timer-stop':
      appState.timerDeadline = null;
      appState.timerRecipeId = null;
      appState.checkin = null;
      renderApp();
      break;
    case 'timer-share': {
      // Con un aviso por tiempo de llegada armado (RF-27) se comparte la receta de
      // confianza con la última ubicación; si no, es un compartir de receta común.
      const armed = Boolean(appState.checkin);
      const trustedId = appState.profile.trustedRecipeId;
      const recipeId = armed && recipes.some((recipe) => recipe.id === trustedId)
        ? trustedId
        : appState.timerRecipeId;
      if (!recipes.some((recipe) => recipe.id === recipeId)) break;
      appState.recipeId = recipeId;
      appState.shareDraft = { recipeId, mode: armed ? 'checkin' : 'recipe' };
      appState.modal = null;
      appState.timerRecipeId = null;
      renderApp();
      break;
    }
    case 'close-modal':
      if (appState.tutorialActive && previousTutorialStep(appState)) {
        renderApp();
        break;
      }
      appState.modal = null;
      appState.shareDraft = null;
      if (!appState.timerDeadline) appState.checkin = null;
      renderApp();
      break;
    case 'clear-app-data':
      if (!window.confirm('¿Borrar favoritas, contactos y preferencias guardados por esta aplicación en este dispositivo?')) break;
      try {
        clearAppData();
        markSetupCompleted();
        appState.favorites = [];
        appState.profile = { trustedRecipeId: null, contacts: [] };
        appState.hasSupportPin = false;
        appState.preferences = { theme: 'light', fontSize: 'normal', recipeLayout: 'grid', name: '' };
        applyPreferences();
        resetTransientState();
        appState.mode = 'app';
        initialSetupRequired = false;
        history.replaceState(null, '', `${location.pathname}${location.search}`);
        showToast('Se borraron las favoritas, contactos y preferencias de esta aplicación.');
        renderApp();
      } catch (error) {
        console.error(error);
        showToast(error.message);
      }
      break;
    case 'clear-favorites':
      if (!window.confirm('¿Quitar todas las recetas de Favoritas? Las demás preferencias se conservarán.')) break;
      try {
        saveFavorites([]);
        appState.favorites = [];
        renderApp();
        showToast('Se limpiaron tus recetas favoritas.');
      } catch (error) {
        console.error(error);
        showToast(error.message);
      }
      break;
    case 'toggle-theme': {
      const nextTheme = appState.preferences.theme === 'dark' ? 'light' : 'dark';
      try {
        const preferences = { ...appState.preferences, theme: nextTheme };
        savePreferences(preferences);
        appState.preferences = preferences;
        applyPreferences();
        renderApp();
      } catch (error) {
        console.error(error);
        showToast(error.message);
      }
      break;
    }
    case 'open-share':
      if (!recipes.some((recipe) => recipe.id === target.dataset.id)) break;
      appState.shareDraft = { recipeId: target.dataset.id, mode: 'recipe' };
      advanceTutorial(appState, 'open-share', { id: target.dataset.id }, tutorialSnapshot);
      renderApp();
      break;
    case 'share-native': {
      if (appState.tutorialActive) {
        showToast('Durante el tutorial no se abre la hoja para compartir.');
        break;
      }
      const recipe = recipes.find((item) => item.id === target.dataset.id);
      if (!recipe) break;
      const trusted = appState.supportUnlocked && appState.profile.trustedRecipeId === recipe.id;
      try {
        await shareRecipe(recipe, contactMessageText(recipe, trusted));
        showToast(navigator.share ? 'Se abrió el menú para compartir.' : 'Texto copiado.');
      } catch (error) {
        if (error.name === 'AbortError') {
          showToast('No se compartió la receta.');
        } else {
          console.error(error);
          showToast(error.message || 'No se pudo compartir la receta.');
        }
      }
      break;
    }
    case 'prepare-location-share':
      if (appState.tutorialActive) {
        showToast('La práctica no consulta ni comparte tu ubicación.');
        break;
      }
      if (!appState.supportUnlocked) break;
      appState.shareDraft = { recipeId: target.dataset.id, mode: 'location' };
      renderApp();
      break;
    case 'share-location-to-contact':
      if (appState.tutorialActive) {
        showToast('La práctica no consulta ni comparte tu ubicación.');
        break;
      }
      if (!appState.supportUnlocked) break;
      await prepareLocationShare(Number(target.dataset.contactIndex));
      break;
    case 'request-location':
      if (appState.tutorialActive) {
        showToast('La práctica no consulta tu ubicación.');
        break;
      }
      if (!appState.supportUnlocked) break;
      try {
        appState.location = await getCurrentLocation();
        showToast('Ubicación actualizada solo en este dispositivo.');
      } catch (error) {
        showToast(error.message);
      }
      renderApp();
      break;
    case 'select-point':
      appState.selectedPoint = Number(target.dataset.index);
      renderApp();
      break;
    case 'close-point':
      appState.selectedPoint = null;
      renderApp();
      break;
    case 'select-trusted-recipe':
      appState.setupRecipeId = target.dataset.id;
      renderApp();
      break;
    case 'add-setup-contact':
      if (appState.setupContacts.length < 3) {
        appState.setupContacts.push({ name: '', phone: '' });
        renderApp();
      }
      break;
    case 'remove-setup-contact': {
      const index = Number(target.dataset.index);
      if (index >= 2 && index < appState.setupContacts.length) {
        appState.setupContacts.splice(index, 1);
        renderApp();
      }
      break;
    }
    case 'setup-back':
      appState.setupStep = Math.max(0, appState.setupStep - 1);
      appState.setupError = '';
      renderApp();
      break;
    case 'setup-tutorial':
      if (appState.mode !== 'setup' || appState.setupStep !== 5) break;
      await completeSetup(true);
      break;
    case 'tutorial-previous':
      if (!appState.tutorialActive) break;
      if (previousTutorialStep(appState)) renderApp();
      break;
    case 'tutorial-continue':
      if (appState.tutorialActive
        && advanceTutorial(appState, 'tutorial-continue', {}, tutorialSnapshot)) {
        renderApp();
      }
      break;
    case 'tutorial-exit':
    case 'tutorial-finish':
      if (!appState.tutorialActive) break;
      returnToRecipes();
      break;
    case 'setup-next':
      if (appState.setupStep === 2) {
        const hasEnteredContact = appState.setupContacts.some(
          (contact) => contact.name.trim() || contact.phone.trim()
        );
        if (hasEnteredContact) {
          const result = validateContacts(appState.setupContacts);
          if (!result.valid) {
            appState.setupError = result.message;
            renderApp();
            break;
          }
          appState.setupContacts = result.contacts;
        } else {
          appState.setupContacts = [];
        }
        appState.setupError = '';
      }
      if (appState.setupStep === 4) {
        if (!appState.setupPin && !appState.setupPinConfirm) {
          appState.setupStep += 1;
          renderApp();
          break;
        }
        if (!/^\d{6}$/.test(appState.setupPin) || appState.setupPin !== appState.setupPinConfirm) {
          appState.setupError = 'Escribe el mismo PIN de 6 dígitos en ambos campos.';
          renderApp();
          break;
        }
        appState.setupError = '';
      }
      if (appState.setupStep < 5) {
        appState.setupStep += 1;
        renderApp();
        break;
      }
      await completeSetup();
      break;
    case 'setup-skip-field':
      if (appState.mode !== 'setup') break;
      if (appState.setupStep === 1) {
        appState.setupRecipeId = appState.profile.trustedRecipeId;
        appState.setupStep = 2;
      } else if (appState.setupStep === 2) {
        appState.setupContacts = [...appState.profile.contacts];
        appState.setupStep = 3;
      } else if (appState.setupStep === 4) {
        appState.setupPin = '';
        appState.setupPinConfirm = '';
        appState.setupError = '';
        appState.setupStep = 5;
      } else {
        break;
      }
      renderApp();
      break;
    case 'quick-exit':
      returnToRecipes();
      break;
    case 'install-app':
      if (!deferredInstallPrompt) break;
      await deferredInstallPrompt.prompt();
      deferredInstallPrompt = null;
      renderApp();
      break;
    default:
      break;
  }
}

root.addEventListener('click', (event) => {
  handleClick(event).catch((error) => {
    console.error(error);
    showToast('Ocurrió un error. Inténtalo nuevamente.');
  });
});

root.addEventListener('input', (event) => {
  const target = event.target;
  if (target.matches('[data-input="search"]')) {
    appState.query = target.value;
    const results = document.querySelector('#search-results');
    if (results) results.innerHTML = renderSearchResults(appState);
  }
  if (target.matches('[data-cost-input]')) {
    const recipeId = appState.recipeId;
    const clean = sanitizeCostInput(target.value);
    target.value = clean;
    if (appState.costs.recipeId !== recipeId) appState.costs = { recipeId, values: [] };
    appState.costs.values[Number(target.dataset.costInput)] = clean;
    updateCostSummary();
  }
  if (target.matches('[data-contact-name]')) {
    appState.setupContacts[Number(target.dataset.contactName)].name = target.value;
  }
  if (target.matches('[data-contact-phone]')) {
    let digits = target.value.replace(/\D/g, '');
    if (digits.length > 9 && digits.startsWith('51')) digits = digits.slice(2);
    target.value = digits.slice(0, 9);
    appState.setupContacts[Number(target.dataset.contactPhone)].phone = target.value;
  }
  if (target.matches('[data-setup-pin]')) {
    target.value = target.value.replace(/\D/g, '').slice(0, 6);
    appState.setupPin = target.value;
  }
  if (target.matches('[data-setup-pin-confirm]')) {
    target.value = target.value.replace(/\D/g, '').slice(0, 6);
    appState.setupPinConfirm = target.value;
  }
  if (target.matches('[data-preference="name"]')) {
    appState.preferences.name = target.value.trim().slice(0, 40);
    const title = document.querySelector('.topbar h1');
    if (title) title.textContent = appState.supportUnlocked
      ? 'Recetario Secreto'
      : appState.preferences.name ? `Hola, ${appState.preferences.name}` : 'Recetario Casero';
  }
});

root.addEventListener('change', (event) => {
  const target = event.target;
  if (!target.matches('[data-preference]')) return;

  const key = target.dataset.preference;
  const value = key === 'name'
    ? target.value.trim().slice(0, 40)
    : target.value;
  if (key === 'fontSize' && !['small', 'normal', 'large'].includes(value)) return;
  if (key === 'recipeLayout' && !['grid', 'list'].includes(value)) return;
  if (key !== 'name' && key !== 'fontSize' && key !== 'recipeLayout') return;

  try {
    const preferences = { ...appState.preferences, [key]: value };
    savePreferences(preferences);
    appState.preferences = preferences;
    applyPreferences();
    if (key === 'recipeLayout') {
      document.querySelectorAll('.recipe-grid').forEach((grid) => {
        grid.classList.toggle('list-layout', value === 'list');
      });
    }
  } catch (error) {
    console.error(error);
    showToast(error.message);
  }
});

root.addEventListener('submit', async (event) => {
  if (event.target.matches('[data-form="portion-calculator"]')) {
    event.preventDefault();
    const tutorialSnapshot = appState.tutorialActive ? snapshotTutorialView(appState) : null;
    const form = event.target;
    const input = form.elements.servings;
    const raw = input.value.trim();
    appState.portionInput = raw;
    if (!/^\d{1,6}$/.test(raw)) {
      showToast('Escribe una cantidad de porciones válida.');
      return;
    }
    const recipe = recipes.find((item) => item.id === form.dataset.recipeId);
    if (!recipe) return;
    if (/^\d{6}$/.test(raw)) {
      try {
        const valid = await verifySupportPin(raw);
        if (valid) {
          // Modo apoyo (RF-25): el mismo recetario, con las funciones de ayuda habilitadas.
          appState.tab = 'home';
          appState.recipeId = null;
          appState.modal = null;
          appState.shareDraft = null;
          appState.chat = [];
          appState.portionInput = '';
          appState.portionResults = null;
          appState.costs = { recipeId: null, values: [] };
          appState.supportUnlocked = true;
          advanceTutorial(appState, 'pin-unlocked', {}, tutorialSnapshot);
          lastSensitiveActivity = Date.now();
          renderApp();
          showToast('Receta especial lista.');
          window.scrollTo(0, 0);
          return;
        }
      } catch (error) {
        console.error(error);
        showToast(error.message);
        return;
      }
    }
    showPortionResults(recipe, raw);
    return;
  }
  if (event.target.matches('[data-form="checkin-timer"]')) {
    event.preventDefault();
    const minutes = Number(event.target.elements.minutes.value);
    const recipeId = event.target.dataset.recipeId;
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
      showToast('Elige un tiempo entre 1 y 180 minutos.');
      return;
    }
    appState.timerDeadline = Date.now() + minutes * 60 * 1000;
    appState.timerRecipeId = recipeId;
    appState.checkin = null;
    renderApp();
    showToast('Temporizador iniciado.');
  }
  if (event.target.matches('[data-form="arrival-timer"]')) {
    event.preventDefault();
    if (appState.tutorialActive) {
      showToast('El tutorial no consulta ni comparte tu ubicación.');
      return;
    }
    if (!appState.supportUnlocked) return;
    const form = event.target;
    const minutes = Number(form.elements.minutes.value);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
      showToast('Elige un tiempo entre 1 y 180 minutos.');
      return;
    }
    const destinationIndex = form.elements.destination.value;
    const destination = destinationIndex === '' ? '' : (safePoints[Number(destinationIndex)]?.name ?? '');
    // La usuaria acaba de pulsar «Iniciar»: es la acción explícita que autoriza la consulta.
    showToast('Solicitando tu ubicación actual…');
    let location = null;
    try {
      location = { ...(await getCurrentLocation()), at: Date.now() };
    } catch (error) {
      showToast(`${error.message} Se continuará sin ubicación.`);
    }
    appState.timerDeadline = Date.now() + minutes * 60 * 1000;
    appState.timerRecipeId = form.dataset.recipeId;
    appState.checkin = { destination, location };
    lastSensitiveActivity = Date.now();
    renderApp();
  }
  if (event.target.matches('[data-form="chat"]')) {
    event.preventDefault();
    const input = event.target.elements.message;
    const message = input.value.trim();
    if (!message) return;
    answerAssistant(message.slice(0, 500));
    renderApp();
    document.querySelector('#chat-input')?.focus();
    const messages = document.querySelector('#chat-messages');
    if (messages) messages.scrollTop = messages.scrollHeight;
  }
});

root.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && appState.tutorialActive && appState.modal) {
    if (previousTutorialStep(appState)) renderApp();
    return;
  }
  if (event.key === 'Escape' && (appState.modal || appState.shareDraft)) {
    appState.modal = null;
    appState.shareDraft = null;
    renderApp();
  }
});

function scaledIngredient(ingredient, multiplier) {
  const match = ingredient.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return ingredient;
  const amount = Number(match[1].replace(',', '.')) * multiplier;
  const formatted = Number.isInteger(amount) ? String(amount) : String(Number(amount.toFixed(2)));
  const suffix = amount === 1
    ? match[2].replace(/^(\s+)([a-záéíóúüñ]+)s(?=\s|$)/i, '$1$2')
    : match[2];
  return `${formatted}${suffix}`;
}

function showPortionResults(recipe, raw) {
  const servings = Number(raw);
  if (!Number.isInteger(servings) || servings < 1 || servings > 999999) {
    showToast('Escribe una cantidad de porciones válida.');
    return;
  }
  appState.portionResults = {
    recipeId: recipe.id,
    servings,
    ingredients: recipe.ingredients.map((ingredient) => scaledIngredient(ingredient, servings / recipe.servings))
  };
  renderApp();
}

function updateCostSummary() {
  const summary = document.querySelector('.cost-summary');
  if (!summary) return;
  const values = [...document.querySelectorAll('[data-cost-input]')].map((input) => input.value);
  const total = sumCosts(values);
  const servings = Number(summary.dataset.servings) || 1;
  summary.querySelector('[data-cost-total]').textContent = formatSoles(total);
  summary.querySelector('[data-cost-per]').textContent = formatSoles(costPerServing(total, servings));
}

// Al vencer el temporizador se intenta actualizar la ubicación. La usuaria la autorizó al
// iniciarlo (RF-27); si falla, se usa la última ubicación conservada en memoria.
function refreshCheckinLocation() {
  getCurrentLocation()
    .then((location) => {
      if (!appState.checkin) return;
      appState.checkin.location = { ...location, at: Date.now() };
      if (appState.shareDraft?.mode === 'checkin') renderApp();
    })
    .catch(() => {});
}

function isSensitiveScreen() {
  return appState.mode === 'setup'
    || appState.tutorialActive
    || (appState.mode === 'app' && (appState.supportUnlocked || appState.modal === 'settings'));
}

function recordSensitiveActivity() {
  if (isSensitiveScreen()) lastSensitiveActivity = Date.now();
}

function closeInactiveScreen() {
  returnToRecipes();
}

root.addEventListener('pointerdown', recordSensitiveActivity);
root.addEventListener('input', recordSensitiveActivity);
root.addEventListener('keydown', recordSensitiveActivity);
root.addEventListener('change', recordSensitiveActivity);

window.addEventListener('hashchange', route);
document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('pagehide', () => {
  if (!isAtRecipeHome()) returnToRecipes({ keepReminder: true });
});
window.addEventListener('pageshow', handleVisibilityChange);
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (appState.modal === 'settings') renderApp();
});

applyPreferences();
route();
setInterval(() => {
  // Cierre por inactividad (RF-20), salvo que haya un aviso de llegada esperando (RF-28).
  if (isSensitiveScreen() && !reminderPending() && Date.now() - lastSensitiveActivity >= 60000) {
    closeInactiveScreen();
  }
  if (!appState.timerDeadline) return;
  if (appState.timerDeadline <= Date.now()) {
    appState.timerDeadline = null;
    appState.modal = 'timer-reminder';
    vibrateOnce();
    if (appState.checkin) refreshCheckinLocation();
    renderApp();
    return;
  }
  const countdown = formatCountdown();
  document.querySelectorAll('.timer-countdown').forEach((element) => { element.textContent = countdown; });
}, 1000);
if (appState.storageError) showToast(appState.storageError);

if (!import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch((error) => {
    console.error('No se pudo registrar el service worker.', error);
    showToast('La aplicación funciona, pero no se pudo activar el modo sin conexión.');
  });
}
