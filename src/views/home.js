import { recipes } from '../data/recipes.js';
import { recipeGridClass, renderRecipeCard } from '../components/recipeCard.js';
import { escapeHTML } from '../utils/security.js';

export function renderHome(state) {
  const featured = recipes[0];
  const visibleRecipes = state.category === 'Todas'
    ? recipes
    : recipes.filter((recipe) => recipe.category === state.category);

  return `<section aria-labelledby="home-title">
    <label class="sr-only" for="home-search">Buscar una receta</label>
    <button class="search-input" type="button" data-action="navigate" data-tab="search">¿Qué quieres cocinar hoy? <span aria-hidden="true">⌕</span></button>
    <article class="hero">
      <img src="${escapeHTML(featured.image)}" alt="" fetchpriority="high">
      <div class="hero-copy"><small>Receta del día</small><h2 id="home-title">${escapeHTML(featured.name)}</h2>
        <p>⏱ ${escapeHTML(featured.time)} · ${escapeHTML(featured.difficulty)}</p>
        <button class="button" type="button" data-action="open-recipe" data-id="${escapeHTML(featured.id)}">Ver receta</button>
      </div>
    </article>
    <div class="chip-row" aria-label="Filtrar por categoría">
      ${['Todas', 'Fondo', 'Postres', 'Rápidas'].map((category) => `<button class="chip ${state.category === category ? 'active' : ''}" type="button" data-action="category" data-category="${escapeHTML(category)}" aria-pressed="${state.category === category}">${category === 'Fondo' ? 'Platos de fondo' : escapeHTML(category)}</button>`).join('')}
    </div>
    <h2 class="section-title">Recetas populares</h2>
    <div class="${recipeGridClass(state)}">${visibleRecipes.map((recipe) => renderRecipeCard(recipe, state.favorites)).join('')}</div>
  </section>`;
}
