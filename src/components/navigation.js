import { escapeHTML } from '../utils/security.js';

const items = [
  ['home', '⌂', 'Inicio'],
  ['search', '⌕', 'Buscar'],
  ['fav', '♡', 'Favoritas']
];

export function renderNavigation(activeTab) {
  return `<nav class="bottom-nav" aria-label="Navegación principal">${items.map(([id, icon, label]) => `
    <button type="button" data-action="navigate" data-tab="${id}" class="${activeTab === id ? 'active' : ''}" ${activeTab === id ? 'aria-current="page"' : ''}>
      <span aria-hidden="true">${icon}</span>${escapeHTML(label)}
    </button>`).join('')}
  </nav>`;
}
