import { recipes } from '../data/recipes.js';
import { renderModal } from '../components/modal.js';
import { renderIcon } from '../components/icons.js';
import { contactMessageText, contactMessageURL } from '../services/sharing.js';
import { escapeHTML } from '../utils/security.js';

function renderContactLink(contact, recipe, trusted, location = null) {
  return `<a class="share-recipient" href="${escapeHTML(contactMessageURL(contact, recipe, trusted, location))}" target="_blank" rel="noopener noreferrer">
    <span class="share-recipient-icon">${renderIcon('message')}</span>
    <span class="share-recipient-copy"><strong>${escapeHTML(contact.name)}</strong><small>WhatsApp</small></span>
    ${renderIcon('arrowRight')}
  </a>`;
}

export function renderRecipeDetail(state) {
  const recipe = recipes.find((item) => item.id === state.recipeId);
  if (!recipe) return '<p class="empty-state">No encontramos esa receta. <button class="button secondary" type="button" data-action="back">Volver</button></p>';

  const isTrustedRecipe = state.profile.trustedRecipeId === recipe.id;
  const contacts = state.profile.contacts;
  let modal = '';
  const shareDraft = state.shareDraft?.recipeId === recipe.id ? state.shareDraft : null;
  if (shareDraft?.mode === 'location' && shareDraft.url) {
    modal = renderModal('Revisa el mensaje', `<p class="note">Comprueba el destinatario y el enlace de ubicación antes de abrir WhatsApp.</p>
      <div class="share-recipient-note">${renderIcon('message')}<span>WhatsApp para <strong>${escapeHTML(shareDraft.contactName)}</strong></span></div>
      <div class="share-message-card"><p class="share-message-label">Mensaje</p><p class="share-preview">${escapeHTML(shareDraft.message)}</p></div>
      <a class="button full share-open-button" href="${escapeHTML(shareDraft.url)}" target="_blank" rel="noopener noreferrer">${renderIcon('message')} Abrir WhatsApp</a>`);
  } else if (shareDraft?.mode === 'location') {
    modal = renderModal('Compartir con ubicación', `<p class="note">Elige el destinatario. Solo entonces se solicitará tu ubicación actual; podrás revisar el mensaje antes de abrir WhatsApp.</p>
      <div class="share-recipient-list">${contacts.map((contact, index) => `<button class="share-recipient" type="button" data-action="share-location-to-contact" data-contact-index="${index}">
        <span class="share-recipient-icon">${renderIcon('message')}</span>
        <span class="share-recipient-copy"><strong>${escapeHTML(contact.name)}</strong><small>Continuar para añadir ubicación</small></span>
        ${renderIcon('arrowRight')}
      </button>`).join('')}</div>`);
  } else if (shareDraft?.mode === 'recipe') {
    const message = contactMessageText(recipe, isTrustedRecipe);
    modal = renderModal('Compartir receta', `<div class="share-recipe-summary">
        <img src="${escapeHTML(recipe.image)}" alt="">
        <span><strong>${escapeHTML(recipe.name)}</strong><small>${escapeHTML(recipe.time)} · ${recipe.servings} porciones</small></span>
      </div>
      <p class="note">Revisa el mensaje y elige a quién compartirlo. WhatsApp no lo enviará hasta que lo confirmes allí.</p>
      <div class="share-message-card"><p class="share-message-label">${renderIcon('message')} Mensaje</p><p class="share-preview">${escapeHTML(message)}</p></div>
      ${contacts.length
        ? `<h3 class="share-section-title">Enviar por WhatsApp a</h3><div class="share-recipient-list">${contacts.map((contact) => renderContactLink(contact, recipe, isTrustedRecipe)).join('')}</div>`
        : '<p class="empty-state">No hay destinatarios guardados. Puedes compartir la receta con otras aplicaciones.</p>'}
      <button class="button secondary full share-open-button" type="button" data-action="share-native" data-id="${escapeHTML(recipe.id)}">${renderIcon('share')} Más opciones para compartir</button>
      ${contacts.length ? `<button class="button secondary full share-open-button" type="button" data-action="prepare-location-share" data-id="${escapeHTML(recipe.id)}">${renderIcon('pin')} Incluir mi ubicación actual</button>` : ''}`);
  }

  return `<section class="recipe-detail">
    <button class="chip" type="button" data-action="back">← Volver a recetas</button>
    <img class="recipe-detail-image" src="${escapeHTML(recipe.image)}" alt="${escapeHTML(recipe.name)}">
    <h2>${escapeHTML(recipe.name)}</h2>
    <p class="recipe-meta">${renderIcon('clock')}<span>${escapeHTML(recipe.time)} · ${recipe.servings} porciones · ${escapeHTML(recipe.difficulty)}</span></p>
    ${isTrustedRecipe ? '<p class="banner">Esta es tu receta de confianza elegida durante la configuración.</p>' : ''}
    <h3 class="section-title">Ingredientes</h3><ul>${recipe.ingredients.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
    <h3 class="section-title">Preparación</h3><ol>${recipe.steps.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ol>
    <div class="action-row">
      <button class="button secondary" type="button" data-action="toggle-favorite" data-id="${escapeHTML(recipe.id)}" aria-pressed="${state.favorites.includes(recipe.id)}">${state.favorites.includes(recipe.id) ? '♥ En favoritas' : '♡ Agregar a favoritas'}</button>
      <button class="button" type="button" data-action="open-share" data-id="${escapeHTML(recipe.id)}">${renderIcon('share')} Compartir receta</button>
    </div>
  </section>${modal}`;
}
