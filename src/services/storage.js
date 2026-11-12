import { validateContact } from '../utils/validation.js';

const KEYS = {
  favorites: 'camuflaje.favorites',
  profile: 'camuflaje.profile',
  theme: 'camuflaje.theme'
};

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    throw new Error(`No se pudieron leer los datos guardados (${key}).`, { cause: error });
  }
}

export function loadSettings() {
  let favorites = readJSON(KEYS.favorites, null);
  let profile = readJSON(KEYS.profile, null);
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
    favorites: Array.isArray(favorites) ? favorites.filter((id) => typeof id === 'string') : [],
    profile: {
      trustedRecipeId: typeof profile?.trustedRecipeId === 'string' ? profile.trustedRecipeId : null,
      contacts: Array.isArray(profile?.contacts)
        ? profile.contacts
          .map((contact) => validateContact(contact ?? {}))
          .filter((result) => result.valid)
          .map((result) => result.contact)
        : []
    }
  };
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
    for (const key of Object.values(KEYS)) localStorage.removeItem(key);
    for (const key of ['fav', 'trust', 'contacts']) localStorage.removeItem(key);
  } catch (error) {
    throw new Error('No se pudieron borrar los datos de esta aplicación.', { cause: error });
  }
}
