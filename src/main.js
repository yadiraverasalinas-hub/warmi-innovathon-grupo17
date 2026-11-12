import './assets/styles/main.css';
import './assets/styles/components.css';
import './assets/styles/responsive.css';
import { recipes } from './data/recipes.js';
import { appState, resetTransientState } from './state/appState.js';
import { loadSettings, markSetupCompleted, saveFavorites, saveProfile, clearAppData } from './services/storage.js';
import { getCurrentLocation } from './services/geolocation.js';
import { contactMessageURL, shareRecipe } from './services/sharing.js';
import { renderMap, destroyMap } from './services/map.js';
import { renderNavigation } from './components/navigation.js';
import { renderModal } from './components/modal.js';
import { showToast } from './components/toast.js';
import { renderHome } from './views/home.js';
import { renderSearch, renderSearchResults } from './views/search.js';
import { renderFavorites } from './views/favorites.js';
import { renderRecipeDetail } from './views/recipeDetail.js';
import { renderSafePoints } from './views/safePoints.js';
import { renderWellbeing } from './views/wellbeing.js';
import { renderSetup } from './views/setup.js';
import { renderDemo } from './views/demo.js';
import { escapeHTML } from './utils/security.js';
import { validateContacts } from './utils/validation.js';

const root = document.querySelector('#root');
const titles = {
  home: ['Recetario Casero', '¿Qué cocinamos hoy?'],
  search: ['Buscar', 'Recetas e ingredientes'],
  fav: ['Favoritas', 'Tus recetas guardadas'],
  shop: ['Tiendas', 'Datos ilustrativos, no verificados'],
  well: ['Bienestar', 'Orientación y recursos']
};

let deferredInstallPrompt = null;
let initialSetupRequired = false;
let returnToSetupAfterDemo = false;
let secretTitleTapCount = 0;
let lastSecretTitleTap = 0;

try {
  const settings = loadSettings();
  appState.favorites = settings.favorites;
  appState.profile = settings.profile;
  const returningUser = settings.setupCompleted || settings.hasPriorUse || Boolean(navigator.serviceWorker?.controller);
  initialSetupRequired = !returningUser;
  if (returningUser && !settings.setupCompleted) markSetupCompleted();
  if (!returningUser) markSetupCompleted();
} catch (error) {
  console.error(error);
  appState.storageError = error.message;
}

function renderSettings() {
  const content = `<div class="settings-actions">
    ${deferredInstallPrompt ? '<button class="button secondary" type="button" data-action="install-app">Instalar aplicación</button>' : '<p class="note">Para instalar: usa la opción del navegador “Añadir a pantalla de inicio”, si está disponible.</p>'}
    <button class="button secondary" type="button" data-action="toggle-theme">Cambiar tema</button>
  </div>`;
  return renderModal('Preferencias', content);
}

function renderApp() {
  if (appState.mode === 'setup') {
    root.innerHTML = renderSetup(appState);
    destroyMap();
    return;
  }

  if (appState.mode === 'demo') {
    root.innerHTML = renderDemo(appState);
    destroyMap();
    return;
  }

  const title = appState.recipeId
    ? ['Receta', '']
    : (titles[appState.tab] ?? titles.home);
  const content = appState.recipeId
    ? renderRecipeDetail(appState)
    : ({
      home: () => renderHome(appState),
      search: () => renderSearch(appState),
      fav: () => renderFavorites(appState),
      shop: () => renderSafePoints(appState),
      well: () => renderWellbeing(appState)
    }[appState.tab] ?? (() => renderHome(appState)))();
  const modal = appState.modal === 'settings' ? renderSettings() : '';

  root.innerHTML = `<header class="topbar"><div><h1 ${!appState.recipeId && appState.tab === 'home' ? 'data-secret-title' : ''}>${escapeHTML(title[0])}</h1>${title[1] ? `<p>${escapeHTML(title[1])}</p>` : ''}</div>
      <button class="icon-button" type="button" data-action="open-settings" aria-label="Preferencias">⚙</button>
    </header>${content}${renderNavigation(appState.tab)}${modal}`;

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

function navigateToApp() {
  initialSetupRequired = false;
  appState.mode = 'app';
  appState.modal = null;
  appState.shareDraft = null;
  appState.setupStep = 0;
  appState.setupRecipeId = null;
  appState.setupContacts = [{ name: '', phone: '' }, { name: '', phone: '' }, { name: '', phone: '' }];
  appState.setupError = '';
  appState.setupFromSecret = false;
  history.replaceState(null, '', `${location.pathname}${location.search}`);
  renderApp();
}

function startSetup() {
  appState.setupStep = 0;
  appState.setupRecipeId = appState.profile.trustedRecipeId;
  appState.setupContacts = [...appState.profile.contacts, ...Array.from(
    { length: Math.max(0, 3 - appState.profile.contacts.length) },
    () => ({ name: '', phone: '' })
  )].slice(0, 3);
  appState.setupError = '';
}

function route() {
  const hash = location.hash;
  if (hash === '#setup') {
    if (appState.mode !== 'setup') {
      startSetup();
      appState.setupFromSecret = true;
    }
    appState.mode = 'setup';
  } else if (hash === '#demo') {
    returnToSetupAfterDemo = appState.mode === 'setup';
    appState.mode = 'demo';
    appState.demoStep = 0;
  } else if (initialSetupRequired) {
    if (appState.mode !== 'setup') startSetup();
    appState.mode = 'setup';
  } else {
    appState.mode = 'app';
  }
  appState.modal = null;
  appState.location = null;
  renderApp();
}

function openHiddenSetup() {
  secretTitleTapCount = 0;
  startSetup();
  appState.setupFromSecret = true;
  appState.mode = 'setup';
  try {
    markSetupCompleted();
  } catch (error) {
    console.error(error);
    showToast(error.message);
  }
  history.replaceState(null, '', `${location.pathname}${location.search}#setup`);
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
    const message = trusted
      ? `Te paso la receta de mi ${recipe.name.toLowerCase()}, ven a probarla.\nhttps://maps.google.com/?q=${location.latitude},${location.longitude}`
      : `Te comparto esta receta: ${recipe.name}.\nhttps://maps.google.com/?q=${location.latitude},${location.longitude}`;
    appState.shareDraft = {
      recipeId: recipe.id,
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
      if (appState.tab === 'shop' && target.dataset.tab !== 'shop') appState.location = null;
      appState.tab = target.dataset.tab;
      appState.recipeId = null;
      appState.selectedPoint = null;
      appState.modal = null;
      appState.shareDraft = null;
      if (appState.tab !== 'well') appState.chat = [];
      renderApp();
      window.scrollTo(0, 0);
      break;
    case 'open-recipe':
      appState.recipeId = target.dataset.id;
      appState.shareDraft = null;
      renderApp();
      window.scrollTo(0, 0);
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
    case 'toggle-favorite':
      toggleFavorite(target.dataset.id);
      break;
    case 'open-settings':
      appState.modal = 'settings';
      renderApp();
      break;
    case 'close-modal':
      appState.modal = null;
      appState.shareDraft = null;
      renderApp();
      break;
    case 'clear-app-data':
      if (!window.confirm('¿Borrar favoritas, contactos y preferencias guardados por esta aplicación en este dispositivo?')) break;
      try {
        clearAppData();
        markSetupCompleted();
        appState.favorites = [];
        appState.profile = { trustedRecipeId: null, contacts: [] };
        delete document.documentElement.dataset.theme;
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
    case 'toggle-theme': {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nextTheme;
      try {
        localStorage.setItem('camuflaje.theme', nextTheme);
      } catch (error) {
        console.error(error);
        showToast('No se pudo guardar la preferencia del tema.');
      }
      break;
    }
    case 'share-recipe': {
      const recipe = recipes.find((item) => item.id === target.dataset.id);
      if (!recipe) break;
      try {
        await shareRecipe(recipe);
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
      appState.shareDraft = { recipeId: target.dataset.id };
      renderApp();
      break;
    case 'share-location-to-contact':
      await prepareLocationShare(Number(target.dataset.contactIndex));
      break;
    case 'request-location':
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
    case 'setup-back':
      appState.setupStep = Math.max(0, appState.setupStep - 1);
      appState.setupError = '';
      renderApp();
      break;
    case 'setup-next':
      if (appState.setupStep === 0 && !recipes.some((recipe) => recipe.id === appState.setupRecipeId)) {
        showToast('Elige una receta para continuar.');
        break;
      }
      if (appState.setupStep === 1) {
        const result = validateContacts(appState.setupContacts);
        if (!result.valid) {
          appState.setupError = result.message;
          renderApp();
          break;
        }
        appState.setupContacts = result.contacts;
        appState.setupError = '';
      }
      if (appState.setupStep < 3) {
        appState.setupStep += 1;
        renderApp();
        break;
      }
      try {
        appState.profile = {
          trustedRecipeId: appState.setupRecipeId,
          contacts: appState.setupContacts.filter((contact) => contact.name.trim() && contact.phone.trim())
        };
        saveProfile(appState.profile);
        const favorites = [...new Set([appState.profile.trustedRecipeId, ...appState.favorites].filter(Boolean))];
        saveFavorites(favorites);
        markSetupCompleted();
        appState.favorites = favorites;
        appState.tab = 'home';
        navigateToApp();
      } catch (error) {
        console.error(error);
        showToast(error.message);
      }
      break;
    case 'quick-exit':
      try {
        markSetupCompleted();
      } catch (error) {
        console.error(error);
        showToast(error.message);
      }
      navigateToApp();
      break;
    case 'leave-demo':
      if (returnToSetupAfterDemo) {
        returnToSetupAfterDemo = false;
        history.replaceState(null, '', `${location.pathname}${location.search}#setup`);
        appState.mode = 'setup';
        renderApp();
        break;
      }
      navigateToApp();
      break;
    case 'demo-previous':
      appState.demoStep = Math.max(0, appState.demoStep - 1);
      renderApp();
      break;
    case 'demo-next':
      appState.demoStep = Math.min(2, appState.demoStep + 1);
      renderApp();
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
  const title = event.target.closest('[data-secret-title]');
  if (!title) {
    secretTitleTapCount = 0;
    return;
  }
  const now = Date.now();
  if (now - lastSecretTitleTap > 2500) secretTitleTapCount = 0;
  lastSecretTitleTap = now;
  secretTitleTapCount += 1;
  if (secretTitleTapCount === 5) openHiddenSetup();
});

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
  if (target.matches('[data-contact-name]')) {
    appState.setupContacts[Number(target.dataset.contactName)].name = target.value;
  }
  if (target.matches('[data-contact-phone]')) {
    appState.setupContacts[Number(target.dataset.contactPhone)].phone = target.value;
  }
});

root.addEventListener('submit', (event) => {
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
  if (event.key === 'Escape' && (appState.modal || appState.shareDraft)) {
    appState.modal = null;
    appState.shareDraft = null;
    renderApp();
  }
});

window.addEventListener('hashchange', route);
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (appState.modal === 'settings') renderApp();
});

try {
  const savedTheme = localStorage.getItem('camuflaje.theme');
  if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;
} catch (error) {
  console.error(error);
  showToast('No se pudo leer la preferencia del tema.');
}

route();
if (appState.storageError) showToast(appState.storageError);

if (!import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch((error) => {
    console.error('No se pudo registrar el service worker.', error);
    showToast('La aplicación funciona, pero no se pudo activar el modo sin conexión.');
  });
}
