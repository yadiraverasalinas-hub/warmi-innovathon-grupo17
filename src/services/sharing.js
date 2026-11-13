import { mapsLink } from './geolocation.js';

export function contactMessageText(recipe, trusted, location = null) {
  const message = trusted
    ? `Te paso la receta de mi ${recipe.name.toLowerCase()}. Luego me cuentas cómo te quedó.`
    : `Te comparto esta receta: ${recipe.name}.`;
  return location ? `${message}\n${mapsLink(location)}` : message;
}

export async function shareRecipe(recipe, text = contactMessageText(recipe, false)) {
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
  const message = contactMessageText(recipe, trusted, location);
  const digits = contact.phone.replace(/\D/g, '');
  const phone = digits.length === 9 ? `51${digits}` : digits;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
