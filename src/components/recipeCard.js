import { escapeHTML } from '../utils/security.js';

export function renderRecipeCard(recipe, favorites) {
  const favorite = favorites.includes(recipe.id);
  return `<article class="recipe-card">
    <button class="recipe-open" type="button" data-action="open-recipe" data-id="${escapeHTML(recipe.id)}" aria-label="Ver ${escapeHTML(recipe.name)}">
      <img src="${escapeHTML(recipe.image)}" alt="" loading="lazy">
      <span class="recipe-card-copy"><strong>${escapeHTML(recipe.name)}</strong><small>${escapeHTML(recipe.time)} · ${recipe.servings} porciones</small></span>
    </button>
    <button class="favorite-button" type="button" data-action="toggle-favorite" data-id="${escapeHTML(recipe.id)}" aria-label="${favorite ? 'Quitar de' : 'Agregar a'} favoritas" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
  </article>`;
}
