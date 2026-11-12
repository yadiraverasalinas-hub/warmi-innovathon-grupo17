import { recipes } from '../data/recipes.js';
import { recipeGridClass, renderRecipeCard } from '../components/recipeCard.js';

export function renderFavorites(state) {
  const favorites = recipes.filter((recipe) => state.favorites.includes(recipe.id));
  return favorites.length
    ? `<section aria-label="Tus recetas favoritas"><div class="${recipeGridClass(state)}">${favorites.map((recipe) => renderRecipeCard(recipe, state.favorites)).join('')}</div></section>`
    : '<p class="empty-state">Aún no tienes recetas favoritas. Toca el corazón en cualquier receta para guardarla aquí.</p>';
}
