import { recipes } from '../data/recipes.js';
import { safePoints } from '../data/safePoints.js';
import { renderModal } from '../components/modal.js';
import { renderIcon } from '../components/icons.js';
import { checkinMessageText, contactMessageText, contactMessageURL, whatsappURL } from '../services/sharing.js';
import { costPerServing, formatSoles, sumCosts } from '../utils/costs.js';
import { escapeHTML } from '../utils/security.js';

function renderContactLink(contact, href) {
  return `<a class="share-recipient" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">
    <span class="share-recipient-icon">${renderIcon('message')}</span>
    <span class="share-recipient-copy"><strong>${escapeHTML(contact.name)}</strong><small>WhatsApp</small></span>
    ${renderIcon('arrowRight')}
  </a>`;
}

function renderRecipeModal(state, title, content) {
  return renderModal(title, content, 'Cerrar', !state.tutorialActive);
}

function renderCalculator(recipe, state, portionResults) {
  const ingredients = portionResults ? portionResults.ingredients : recipe.ingredients;
  const servings = portionResults ? portionResults.servings : recipe.servings;
  const values = state.costs?.recipeId === recipe.id ? state.costs.values : [];
  const total = sumCosts(ingredients.map((_, index) => values[index] ?? ''));

  return renderRecipeModal(state, 'Calculadora de porciones y costos', `<p>La receta rinde ${recipe.servings} porciones. Indica cuántas necesitas para ajustar las cantidades.</p>
    <form class="portion-form" data-form="portion-calculator" data-recipe-id="${escapeHTML(recipe.id)}">
      <label for="portion-count">Porciones deseadas</label>
      <input class="field" id="portion-count" name="servings" type="text" inputmode="numeric" pattern="[0-9]{1,6}" maxlength="6" value="${escapeHTML(state.portionInput || String(recipe.servings))}" required>
      <button class="button full" type="submit">Ajustar cantidades</button>
    </form>
    <h3 class="section-title">Costo de la compra</h3>
    <p class="note">Escribe cuánto cuesta cada ingrediente (en soles) para calcular el total aproximado. Los precios no se guardan.</p>
    <ul class="cost-list">${ingredients.map((item, index) => `<li>
      <label for="cost-${index}">${escapeHTML(item)}</label>
      <span class="cost-field"><span aria-hidden="true">S/</span><input class="field" id="cost-${index}" data-cost-input="${index}" type="text" inputmode="decimal" maxlength="8" placeholder="0.00" autocomplete="off" value="${escapeHTML(values[index] ?? '')}"></span>
    </li>`).join('')}</ul>
    <div class="cost-summary" role="status" aria-live="polite" data-servings="${servings}">
      <p>Total aproximado: <strong data-cost-total>${formatSoles(total)}</strong></p>
      <p>Por porción (${servings}): <strong data-cost-per>${formatSoles(costPerServing(total, servings))}</strong></p>
    </div>`);
}

function renderTimerPanel(recipe, state) {
  if (!state.supportUnlocked) {
    return `<section class="timer-panel" aria-label="Temporizador de cocina">
      <form class="timer-form" data-form="checkin-timer" data-recipe-id="${escapeHTML(recipe.id)}">
        <label for="timer-minutes">Temporizador de cocina (minutos)</label>
        <div class="timer-controls"><input class="field" id="timer-minutes" name="minutes" type="number" min="1" max="180" value="30" required>
          <button class="button secondary" type="submit">Iniciar</button></div>
      </form>
      <p class="note">El aviso aparece solo mientras el recetario permanece abierto.</p>
    </section>`;
  }
  return `<section class="timer-panel" aria-label="Temporizador de cocina">
    <form class="timer-form" data-form="arrival-timer" data-recipe-id="${escapeHTML(recipe.id)}">
      <label for="timer-minutes">Temporizador de cocina (minutos)</label>
      <div class="timer-controls"><input class="field" id="timer-minutes" name="minutes" type="number" min="1" max="180" value="30" required>
        <button class="button secondary" type="submit">Iniciar</button></div>
      <label for="timer-destination">Voy rumbo a (opcional)</label>
      <select class="field" id="timer-destination" name="destination">
        <option value="">Sin destino</option>
        ${safePoints.map((point, index) => `<option value="${index}">${escapeHTML(point.name)} (ejemplo)</option>`).join('')}
      </select>
    </form>
    <p class="note">Al iniciar se consulta tu ubicación y se conserva solo en esta sesión; al vencer se intenta actualizar. Si el tiempo vence, podrás enviar el aviso con un toque; la app no envía nada sola. Si se oculta la app, el aviso puede no aparecer.</p>
  </section>`;
}

export function renderRecipeDetail(state) {
  const recipe = recipes.find((item) => item.id === state.recipeId);
  if (!recipe) return '<p class="empty-state">No encontramos esa receta. <button class="button secondary" type="button" data-action="back">Volver</button></p>';

  // Sin PIN (modo apoyo apagado) la ficha es la de un recetario común: sin pistas de la
  // receta de confianza, sin contactos guardados y sin ubicación (RF-14, RF-25).
  const unlocked = Boolean(state.supportUnlocked);
  const isTrustedRecipe = unlocked && state.profile.trustedRecipeId === recipe.id;
  const contacts = unlocked ? state.profile.contacts : [];
  let modal = '';
  const shareDraft = state.shareDraft?.recipeId === recipe.id ? state.shareDraft : null;
  const portionResults = state.portionResults?.recipeId === recipe.id ? state.portionResults : null;
  if (state.modal === 'portion-calculator') {
    modal = renderCalculator(recipe, state, portionResults);
  }
  if (shareDraft?.mode === 'checkin') {
    const message = checkinMessageText(recipe, state.checkin?.location, state.checkin?.destination);
    modal = renderRecipeModal(state, 'Compartir receta', `<div class="share-recipe-summary">
        <img src="${escapeHTML(recipe.image)}" alt="">
        <span><strong>${escapeHTML(recipe.name)}</strong><small>${escapeHTML(recipe.time)} · ${recipe.servings} porciones</small></span>
      </div>
      <p class="note">Revisa el mensaje y elige a quién compartirlo. WhatsApp no lo enviará hasta que lo confirmes allí.</p>
      <div class="share-message-card"><p class="share-message-label">${renderIcon('message')} Mensaje</p><p class="share-preview">${escapeHTML(message)}</p></div>
      ${state.profile.contacts.length
        ? `<h3 class="share-section-title">Enviar por WhatsApp a</h3><div class="share-recipient-list">${state.profile.contacts.map((contact) => renderContactLink(contact, whatsappURL(contact, message))).join('')}</div>`
        : ''}`);
  } else if (shareDraft?.mode === 'location' && shareDraft.url && unlocked) {
    modal = renderRecipeModal(state, 'Revisa el mensaje', `<p class="note">Comprueba el destinatario y el enlace de ubicación antes de abrir WhatsApp.</p>
      <div class="share-recipient-note">${renderIcon('message')}<span>WhatsApp para <strong>${escapeHTML(shareDraft.contactName)}</strong></span></div>
      <div class="share-message-card"><p class="share-message-label">Mensaje</p><p class="share-preview">${escapeHTML(shareDraft.message)}</p></div>
      <a class="button full share-open-button" href="${escapeHTML(shareDraft.url)}" target="_blank" rel="noopener noreferrer">${renderIcon('message')} Abrir WhatsApp</a>`);
  } else if (shareDraft?.mode === 'location' && unlocked) {
    modal = renderRecipeModal(state, 'Compartir con ubicación', `<p class="note">Elige el destinatario. Solo entonces se solicitará tu ubicación actual; podrás revisar el mensaje antes de abrir WhatsApp.</p>
      <div class="share-recipient-list">${contacts.map((contact, index) => `<button class="share-recipient" type="button" data-action="share-location-to-contact" data-contact-index="${index}">
        <span class="share-recipient-icon">${renderIcon('message')}</span>
        <span class="share-recipient-copy"><strong>${escapeHTML(contact.name)}</strong><small>Continuar para añadir ubicación</small></span>
        ${renderIcon('arrowRight')}
      </button>`).join('')}</div>`);
  } else if (shareDraft?.mode === 'recipe') {
    const message = contactMessageText(recipe, isTrustedRecipe);
    modal = renderRecipeModal(state, 'Compartir receta', `<div class="share-recipe-summary">
        <img src="${escapeHTML(recipe.image)}" alt="">
        <span><strong>${escapeHTML(recipe.name)}</strong><small>${escapeHTML(recipe.time)} · ${recipe.servings} porciones</small></span>
      </div>
      <p class="note">${unlocked ? 'Revisa el mensaje y elige a quién compartirlo. WhatsApp no lo enviará hasta que lo confirmes allí.' : 'Elige cómo compartir la receta desde tu dispositivo.'}</p>
      <div class="share-message-card"><p class="share-message-label">${renderIcon('message')} Mensaje</p><p class="share-preview">${escapeHTML(message)}</p></div>
      ${unlocked && contacts.length
        ? `<h3 class="share-section-title">Enviar por WhatsApp a</h3><div class="share-recipient-list">${contacts.map((contact) => renderContactLink(contact, contactMessageURL(contact, recipe, isTrustedRecipe))).join('')}</div>`
        : ''}
      <button class="button secondary full share-open-button" type="button" data-action="share-native" data-id="${escapeHTML(recipe.id)}">${renderIcon('share')} Más opciones para compartir</button>
      ${unlocked && contacts.length ? `<button class="button secondary full share-open-button" type="button" data-action="prepare-location-share" data-id="${escapeHTML(recipe.id)}">${renderIcon('pin')} Incluir mi ubicación actual</button>` : ''}`);
  }

  return `<section class="recipe-detail">
    <button class="chip" type="button" data-action="back">← Volver a recetas</button>
    <img class="recipe-detail-image" src="${escapeHTML(recipe.image)}" alt="${escapeHTML(recipe.name)}">
    <h2>${escapeHTML(recipe.name)}</h2>
    <p class="recipe-meta">${renderIcon('clock')}<span>${escapeHTML(recipe.time)} · ${recipe.servings} porciones · ${escapeHTML(recipe.difficulty)}</span></p>
    ${renderTimerPanel(recipe, state)}
    ${isTrustedRecipe ? '<p class="banner">Esta es tu receta de confianza elegida durante la configuración.</p>' : ''}
    <h3 class="section-title">Ingredientes</h3><ul>${recipe.ingredients.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
    <h3 class="section-title">Preparación</h3><ol>${recipe.steps.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ol>
    <div class="action-row">
      <button class="button secondary" type="button" data-action="open-portion-calculator" data-id="${escapeHTML(recipe.id)}">Calculadora de porciones y costos</button>
      <button class="button secondary" type="button" data-action="toggle-favorite" data-id="${escapeHTML(recipe.id)}" aria-pressed="${state.favorites.includes(recipe.id)}">${state.favorites.includes(recipe.id) ? '♥ En favoritas' : '♡ Agregar a favoritas'}</button>
      <button class="button" type="button" data-action="open-share" data-id="${escapeHTML(recipe.id)}">${renderIcon('share')} Compartir receta</button>
    </div>
  </section>${modal}`;
}
