import { escapeHTML } from '../utils/security.js';

export function renderModal(title, content, label = 'Cerrar') {
  return `<div class="overlay" data-action="close-modal">
    <section class="modal" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}" data-action="stop-propagation">
      <button class="modal-close" type="button" data-action="close-modal" aria-label="${escapeHTML(label)}">×</button>
      <h2>${escapeHTML(title)}</h2>
      ${content}
    </section>
  </div>`;
}
