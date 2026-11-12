import { recipes } from '../data/recipes.js';
import { escapeHTML } from '../utils/security.js';

export function renderSetup(state) {
  const step = state.setupStep;
  let content = '';

  if (step === 0) {
    content = `<h2>Bienvenida a Recetario Casero</h2><p>Elige una receta de confianza. Si la compartes como señal acordada, habla antes con esa persona sobre lo que significa.</p>
      ${recipes.map((recipe) => `<button class="setup-choice ${state.setupRecipeId === recipe.id ? 'selected' : ''}" type="button" data-action="select-trusted-recipe" data-id="${escapeHTML(recipe.id)}">
        <img src="${escapeHTML(recipe.image)}" alt=""><span>${escapeHTML(recipe.name)}</span><span aria-hidden="true">${state.setupRecipeId === recipe.id ? '♥' : '♡'}</span>
      </button>`).join('')}`;
  } else if (step === 1) {
    content = `<h2>¿Con quién compartirías tus recetas?</h2><p>Agrega al menos 2 personas de confianza. Los datos se guardan solo en este dispositivo.</p>
      ${state.setupContacts.map((contact, index) => `<div class="contact-fields">
        <label for="contact-name-${index}">Nombre o apodo ${index + 1}</label>
        <input class="field" id="contact-name-${index}" data-contact-name="${index}" maxlength="80" value="${escapeHTML(contact.name)}" autocomplete="off">
        <label for="contact-phone-${index}">Número de celular</label>
        <input class="field" id="contact-phone-${index}" data-contact-phone="${index}" type="tel" inputmode="tel" maxlength="24" value="${escapeHTML(contact.phone)}" autocomplete="off">
      </div>`).join('')}
      <p class="error-text" role="alert">${escapeHTML(state.setupError)}</p>`;
  } else if (step === 2) {
    content = `<h2>Ubicación</h2><p>No se necesita habilitar ubicación para usar la aplicación. Solo se consulta cuando eliges una acción que la requiere.</p>
      <p class="note">Si decides compartir una ubicación, el navegador te pedirá permiso y podrás revisar el enlace antes de abrir WhatsApp.</p>`;
  } else {
    content = '<h2>¡Listo!</h2><p>Tu recetario está configurado. No se envían mensajes ni se activa el seguimiento en segundo plano.</p>';
  }

  return `<section class="setup" aria-labelledby="setup-heading">
    <div class="progress" role="progressbar" aria-label="Progreso de configuración" aria-valuemin="1" aria-valuemax="4" aria-valuenow="${step + 1}"><span style="width:${(step + 1) * 25}%"></span></div>
    ${content}
    <div class="action-row">
      ${step > 0 && step < 3 ? '<button class="button secondary" type="button" data-action="setup-back">Atrás</button>' : ''}
      <button class="button" type="button" data-action="setup-next">${step === 3 ? 'Ir a mis recetas' : 'Continuar'}</button>
      ${step < 3 ? '<button class="button secondary" type="button" data-action="skip-setup">Omitir configuración</button>' : ''}
    </div>
  </section>`;
}
