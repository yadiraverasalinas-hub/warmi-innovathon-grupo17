import { validateContact } from '../utils/validation.js';

const KEYS = {
  favorites: 'camuflaje.favorites',
  profile: 'camuflaje.profile',
  theme: 'camuflaje.theme',
  preferences: 'camuflaje.preferences',
  setupCompleted: 'camuflaje.setupCompleted'
};

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    throw new Error(`No se pudieron leer los datos guardados (${key}).`, { cause: error });
  }
}

function normalizeRecipeId(id) {
  return id === 'aguadito' ? 'caldo-gallina' : id;
}

export function loadSettings() {
  let favorites = readJSON(KEYS.favorites, null);
  let profile = readJSON(KEYS.profile, null);
  const preferences = readJSON(KEYS.preferences, {});
  const savedTheme = localStorage.getItem(KEYS.theme);
  const setupCompleted = readJSON(KEYS.setupCompleted, false) === true;
  const hasPriorUse = [KEYS.favorites, KEYS.profile, KEYS.theme, KEYS.preferences, 'fav', 'trust', 'contacts']
    .some((key) => localStorage.getItem(key) !== null);
  if (favorites === null) favorites = readJSON('fav', []);
  if (profile === null) {
    const oldContacts = readJSON('contacts', []);
    profile = {
      trustedRecipeId: readJSON('trust', null),
      contacts: Array.isArray(oldContacts)
        ? oldContacts.map((contact) => ({ name: contact?.n ?? '', phone: contact?.p ?? '' }))
        : []
    };
  }
  return {
    favorites: Array.isArray(favorites)
      ? favorites.filter((id) => typeof id === 'string').map(normalizeRecipeId)
      : [],
    setupCompleted,
    hasPriorUse,
    preferences: {
      theme: preferences?.theme === 'dark' || preferences?.theme === 'light'
        ? preferences.theme
        : savedTheme === 'dark' ? 'dark' : 'light',
      fontSize: ['small', 'normal', 'large'].includes(preferences?.fontSize) ? preferences.fontSize : 'normal',
      recipeLayout: preferences?.recipeLayout === 'list' ? 'list' : 'grid',
      name: typeof preferences?.name === 'string' ? preferences.name.trim().slice(0, 40) : ''
    },
    profile: {
      trustedRecipeId: typeof profile?.trustedRecipeId === 'string' ? normalizeRecipeId(profile.trustedRecipeId) : null,
      contacts: Array.isArray(profile?.contacts)
        ? profile.contacts
          .map((contact) => validateContact(contact ?? {}))
          .filter((result) => result.valid)
          .map((result) => result.contact)
        : []
    }
  };
}

export function markSetupCompleted() {
  try {
    localStorage.setItem(KEYS.setupCompleted, 'true');
  } catch (error) {
    throw new Error('No se pudo guardar el estado de configuración en este dispositivo.', { cause: error });
  }
}

export function savePreferences(preferences) {
  try {
    localStorage.setItem(KEYS.preferences, JSON.stringify(preferences));
  } catch (error) {
    throw new Error('No se pudieron guardar las preferencias en este dispositivo.', { cause: error });
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(KEYS.favorites, JSON.stringify(favorites));
  } catch (error) {
    throw new Error('No se pudieron guardar tus favoritas en este dispositivo.', { cause: error });
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  } catch (error) {
    throw new Error('No se pudo guardar la configuración en este dispositivo.', { cause: error });
  }
}

export function clearAppData() {
  try {
    for (const key of [KEYS.favorites, KEYS.profile, KEYS.theme, KEYS.preferences]) localStorage.removeItem(key);
    for (const key of ['fav', 'trust', 'contacts']) localStorage.removeItem(key);
  } catch (error) {
    throw new Error('No se pudieron borrar los datos de esta aplicación.', { cause: error });
  }
}
