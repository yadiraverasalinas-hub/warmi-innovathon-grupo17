import { mapsLink } from './geolocation.js';

export async function shareRecipe(recipe) {
  const text = `Mira esta receta: ${recipe.name}`;
  if (navigator.share) {
    await navigator.share({ title: recipe.name, text });
    return;
  }
  if (!navigator.clipboard?.writeText) {
    throw new Error('Este navegador no permite compartir ni copiar el mensaje.');
  }
  await navigator.clipboard.writeText(text);
}

export function contactMessageURL(contact, recipe, trusted, location = null) {
  const message = trusted
    ? `Te paso la receta de mi ${recipe.name.toLowerCase()}, ven a probarla.`
    : `Te comparto esta receta: ${recipe.name}.`;
  const withLocation = location ? `${message}\n${mapsLink(location)}` : message;
  const digits = contact.phone.replace(/\D/g, '');
  const phone = digits.length === 9 ? `51${digits}` : digits;
  return `https://wa.me/${phone}?text=${encodeURIComponent(withLocation)}`;
}
