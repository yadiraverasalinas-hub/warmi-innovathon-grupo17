import { recipes } from '../data/recipes.js';
import { renderModal } from '../components/modal.js';
import { contactMessageURL } from '../services/sharing.js';
import { escapeHTML } from '../utils/security.js';

export function renderRecipeDetail(state) {
  const recipe = recipes.find((item) => item.id === state.recipeId);
  if (!recipe) return '<p class="empty-state">No encontramos esa receta. <button class="button secondary" type="button" data-action="back">Volver</button></p>';

  const isTrustedRecipe = state.profile.trustedRecipeId === recipe.id;
  const contacts = state.profile.contacts;
  const contactActions = contacts.length
    ? `<h3 class="section-title">Enviar a una persona de confianza</h3>
      <p class="note">Se abrirá WhatsApp con el mensaje preparado. No se envía hasta que tú lo confirmes allí.</p>
      <div class="contact-actions">${contacts.map((contact) => `<a class="contact-link" href="${escapeHTML(contactMessageURL(contact, recipe, isTrustedRecipe))}" target="_blank" rel="noopener noreferrer">
        <span>${escapeHTML(contact.name)}<small>Compartir receta${isTrustedRecipe ? ' de confianza' : ''}</small></span><span aria-hidden="true">↗</span>
      </a>`).join('')}</div>
      <div class="action-row"><button class="button secondary" type="button" data-action="prepare-location-share" data-id="${escapeHTML(recipe.id)}">Preparar mensaje con mi ubicación actual…</button></div>`
    : `<div class="banner">Configura tus contactos de confianza en Ajustes para tenerlos disponibles aquí. No se enviará ningún mensaje sin que lo revises y confirmes.</div>`;

  let modal = '';
  if (state.shareDraft) {
    const draft = state.shareDraft;
    modal = draft.url
      ? renderModal('Revisa el mensaje', `<p>El enlace incluye la ubicación consultada ahora. Comprueba el mensaje y el destinatario antes de enviarlo.</p>
        <p class="share-preview">${escapeHTML(draft.message)}</p>
        <a class="button full" href="${escapeHTML(draft.url)}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp para ${escapeHTML(draft.contactName)}</a>`)
      : renderModal('Elige a quién compartir', `<p>Se consultará tu ubicación actual después de elegir a una persona. Podrás revisar el mensaje antes de abrir WhatsApp.</p>
        <div class="contact-actions">${contacts.map((contact, index) => `<button class="contact-link" type="button" data-action="share-location-to-contact" data-contact-index="${index}">${escapeHTML(contact.name)} <span aria-hidden="true">→</span></button>`).join('')}</div>`);
  }

  return `<section class="recipe-detail">
    <button class="chip" type="button" data-action="back">← Volver a recetas</button>
    <img class="recipe-detail-image" src="${escapeHTML(recipe.image)}" alt="${escapeHTML(recipe.name)}">
    <h2>${escapeHTML(recipe.name)}</h2>
    <p class="note">⏱ ${escapeHTML(recipe.time)} · ${recipe.servings} porciones · ${escapeHTML(recipe.difficulty)}</p>
    ${isTrustedRecipe ? '<p class="banner">Esta es tu receta de confianza elegida durante la configuración.</p>' : ''}
    <h3 class="section-title">Ingredientes</h3><ul>${recipe.ingredients.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
    <h3 class="section-title">Preparación</h3><ol>${recipe.steps.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ol>
    <div class="action-row">
      <button class="button secondary" type="button" data-action="toggle-favorite" data-id="${escapeHTML(recipe.id)}" aria-pressed="${state.favorites.includes(recipe.id)}">${state.favorites.includes(recipe.id) ? '♥ En favoritas' : '♡ Agregar a favoritas'}</button>
      <button class="button" type="button" data-action="share-recipe" data-id="${escapeHTML(recipe.id)}">Compartir receta</button>
    </div>
    ${contactActions}
  </section>${modal}`;
}
