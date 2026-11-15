import { escapeHTML } from '../utils/security.js';

const baseItems = [
  ['home', '⌂', 'Inicio'],
  ['search', '⌕', 'Buscar'],
  ['fav', '♡', 'Favoritas']
];

// Solo en modo apoyo (RF-25): Tiendas y Bienestar.
const supportItems = [
  ['shop', '⌖', 'Tiendas'],
  ['well', '☺', 'Bienestar']
];

export function renderNavigation(activeTab, supportUnlocked = false) {
  const items = supportUnlocked ? [...baseItems, ...supportItems] : baseItems;
  return `<nav class="bottom-nav" aria-label="Navegación principal">${items.map(([id, icon, label]) => `
    <button type="button" data-action="navigate" data-tab="${id}" class="${activeTab === id ? 'active' : ''}" ${activeTab === id ? 'aria-current="page"' : ''}>
      <span aria-hidden="true">${icon}</span>${escapeHTML(label)}
    </button>`).join('')}
  </nav>`;
}
