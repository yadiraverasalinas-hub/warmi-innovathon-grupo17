import { renderOnboarding } from './onboarding.js';
import { recipes } from '../data/recipes.js';
import { renderIcon } from '../components/icons.js';
import { escapeHTML } from '../utils/security.js';

function localPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('51') ? digits.slice(2) : digits;
}

export function renderSetup(state) {
  if (!state.onboardingCompleted && state.onboardingStep < 3) {
    return renderOnboarding(state);
  }

  const step = state.setupStep;
  let content = '';

  if (step === 1) {
    content = `<h2>Tu recetario</h2>
      <div class="setup-tips" aria-label="Información importante">
        <p class="setup-tip"><span class="setup-tip-icon">${renderIcon('pot')}</span><strong>Tu receta es una señal secreta.</strong></p>
        <p class="setup-tip"><span class="setup-tip-icon">${renderIcon('users')}</span><span><strong>Compártela con alguien de confianza y sabrá que necesitas ayuda.</strong> Acuerden antes qué significa.</span></p>
        <p class="setup-tip"><span class="setup-tip-icon">${renderIcon('eyeOff')}</span><span><strong>No llama a emergencias ni te vigila.</strong> Tú decides cada envío.</span></p>
      </div>
      <details class="setup-more"><summary>Saber más</summary><p>La app no envía mensajes en segundo plano. Tu ubicación solo se añade si eliges esa opción; podrás revisar el mensaje antes de abrir WhatsApp y decidir si lo envías.</p></details>
      <p>Si quieres, elige una receta de confianza:</p>
      ${recipes.map((recipe) => `<button class="setup-choice ${state.setupRecipeId === recipe.id ? 'selected' : ''}" type="button" data-action="select-trusted-recipe" data-id="${escapeHTML(recipe.id)}">
        <img src="${escapeHTML(recipe.image)}" alt="" loading="lazy" decoding="async"><span>${escapeHTML(recipe.name)}</span><span aria-hidden="true">${state.setupRecipeId === recipe.id ? '♥' : '♡'}</span>
      </button>`).join('')}`;
  } else if (step === 2) {
    content = `<h2>Personas de confianza (opcional)</h2><p>Si decides agregarlas, registra 2 personas con quienes hayas acordado qué significa la receta. Los datos se guardan solo en este dispositivo; nada se envía sin que lo revises y confirmes.</p>
      ${state.setupContacts.map((contact, index) => `<div class="contact-fields">
        <label for="contact-name-${index}">Nombre o apodo ${index + 1}</label>
        <input class="field" id="contact-name-${index}" data-contact-name="${index}" maxlength="80" value="${escapeHTML(contact.name)}" autocomplete="off">
        <label for="contact-phone-${index}">Número de celular</label>
        <div class="phone-field"><span aria-hidden="true">+51</span><input class="field" id="contact-phone-${index}" data-contact-phone="${index}" type="tel" inputmode="numeric" pattern="[0-9]{9}" maxlength="14" placeholder="999 999 999" aria-label="Número de celular, prefijo +51, 9 dígitos" value="${escapeHTML(localPhone(contact.phone))}" autocomplete="tel-national"></div>
        ${index >= 2 ? `<button class="button secondary remove-contact" type="button" data-action="remove-setup-contact" data-index="${index}" aria-label="Quitar persona ${index + 1}">Quitar</button>` : ''}
      </div>`).join('')}
      ${state.setupContacts.length < 3 ? '<button class="button secondary" type="button" data-action="add-setup-contact">+ Agregar otra</button>' : ''}
      <p class="error-text" role="alert">${escapeHTML(state.setupError)}</p>`;
  } else if (step === 3) {
    content = `<h2>Privacidad y permisos</h2><p>No necesitas habilitar permisos para empezar. La ubicación solo se consulta cuando eliges una acción que la requiere y el navegador te lo solicita.</p>
      <p class="note">Puedes revisar estas opciones y aprender más desde la aplicación. Nada se envía en segundo plano.</p>`;
  } else if (step === 4) {
    content = `<h2>PIN de apoyo (opcional)</h2>
      <p>Si creas un PIN de 6 dígitos, podrás usarlo en la calculadora de una receta para activar las funciones de apoyo.${state.hasSupportPin ? ' Déjalo en blanco para conservar tu PIN actual.' : ''}</p>
      <label class="setup-pin-field" for="setup-pin">PIN de 6 dígitos
        <input class="field" id="setup-pin" data-setup-pin type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="new-password" value="${escapeHTML(state.setupPin)}">
      </label>
      <label class="setup-pin-field" for="setup-pin-confirm">Repite el PIN
        <input class="field" id="setup-pin-confirm" data-setup-pin-confirm type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="new-password" value="${escapeHTML(state.setupPinConfirm)}">
      </label>
      <p class="note">No uses un PIN de otra cuenta. Si lo olvidas, el prototipo no puede recuperarlo. Se guarda una verificación derivada con sal; esto no protege contra alguien con acceso técnico al dispositivo.</p>
      <p class="error-text" role="alert">${escapeHTML(state.setupError)}</p>`;
  } else {
    content = `<h2>¡Listo!</h2><p>${state.setupRecipeId ? 'La receta que elegiste estará en Favoritas.' : 'Ya puedes explorar el recetario.'} ${state.setupPin || state.hasSupportPin ? 'El modo apoyo estará disponible con tu PIN.' : 'Puedes configurar un PIN más adelante desde la configuración.'}</p>
      <p>Puedes explorar libremente y volver a consultar el tutorial desde Preferencias.</p>
      <button class="button secondary" type="button" data-action="setup-tutorial">Guardar y practicar el tutorial</button>`;
  }
  content = content.replace('<h2>', '<h2 id="setup-heading">');

  return `<section class="setup" aria-labelledby="setup-heading">
    <div class="setup-toolbar"><button class="button quick-exit" type="button" data-action="quick-exit"><span aria-hidden="true">↗</span> Salir rápido</button></div>
    ${step > 0 ? `<div class="progress" role="progressbar" aria-label="Progreso de configuración" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${step}"><span style="width:${step * 20}%"></span></div>` : ''}
    ${content}
    ${step > 0 ? `<div class="action-row">
      ${step > 1 ? '<button class="button secondary" type="button" data-action="setup-back">Atrás</button>' : ''}
      ${step === 5 ? '<button class="button" type="button" data-action="setup-next">Ir a mis recetas</button>' : '<button class="button" type="button" data-action="setup-next">Continuar</button>'}
      ${[1, 2, 4].includes(step) ? '<button class="button secondary" type="button" data-action="setup-skip-field">Omitir</button>' : ''}
    </div>` : ''}
  </section>`;
}
