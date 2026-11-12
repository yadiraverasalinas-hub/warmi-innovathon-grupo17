import { recipes } from '../data/recipes.js';
import { recipeGridClass, renderRecipeCard } from '../components/recipeCard.js';
import { escapeHTML, normalizeText } from '../utils/security.js';

export function renderSearch(state) {
  return `<section aria-labelledby="search-title">
    <h2 id="search-title" class="section-title">Busca una receta o ingrediente</h2>
    <label class="sr-only" for="recipe-search">Buscar</label>
    <input class="search-input" id="recipe-search" type="search" data-input="search" placeholder="Ej.: arroz, pollo..." value="${escapeHTML(state.query)}" autocomplete="off">
    <div id="search-results" class="${recipeGridClass(state)}" aria-live="polite">${renderSearchResults(state)}</div>
  </section>`;
}

export function renderSearchResults(state) {
  const query = normalizeText(state.query.trim());
  const matches = query
    ? recipes.filter((recipe) => normalizeText(`${recipe.name} ${recipe.ingredients.join(' ')}`).includes(query))
    : recipes;

  return matches.length
    ? matches.map((recipe) => renderRecipeCard(recipe, state.favorites)).join('')
    : '<p class="empty-state">No encontramos recetas con eso. Prueba con otro ingrediente.</p>';
}
