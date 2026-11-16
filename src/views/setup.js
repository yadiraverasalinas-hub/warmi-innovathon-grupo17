import { recipes } from '../data/recipes.js';
import { renderIcon } from '../components/icons.js';
import { escapeHTML } from '../utils/security.js';

function localPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('51') ? digits.slice(2) : digits;
}

export function renderSetup(state) {
  const step = state.setupStep;
  let content = '';

  if (step === 0) {
    content = `<h2>Bienvenida a Recetario Casero</h2>
      <div class="setup-tips" aria-label="Información importante">
        <p class="setup-tip"><span class="setup-tip-icon">${renderIcon('pot')}</span><strong>Tu receta es una señal secreta.</strong></p>
        <p class="setup-tip"><span class="setup-tip-icon">${renderIcon('users')}</span><span><strong>Compártela con alguien de confianza y sabrá que necesitas ayuda.</strong> Acuerden antes qué significa.</span></p>
        <p class="setup-tip"><span class="setup-tip-icon">${renderIcon('eyeOff')}</span><span><strong>No llama a emergencias ni te vigila.</strong> Tú decides cada envío.</span></p>
      </div>
      <details class="setup-more"><summary>Saber más</summary><p>La app no envía mensajes en segundo plano. Tu ubicación solo se añade si eliges esa opción; podrás revisar el mensaje antes de abrir WhatsApp y decidir si lo envías.</p></details>
      <p>Elige tu receta de confianza:</p>
      ${recipes.map((recipe) => `<button class="setup-choice ${state.setupRecipeId === recipe.id ? 'selected' : ''}" type="button" data-action="select-trusted-recipe" data-id="${escapeHTML(recipe.id)}">
        <img src="${escapeHTML(recipe.image)}" alt="" loading="lazy" decoding="async"><span>${escapeHTML(recipe.name)}</span><span aria-hidden="true">${state.setupRecipeId === recipe.id ? '♥' : '♡'}</span>
      </button>`).join('')}`;
  } else if (step === 1) {
    content = `<h2>¿Con quién compartirías tus recetas?</h2><p>Agrega al menos 2 personas de confianza que reconocerán la señal. Estos datos se guardan solo en este dispositivo y se usan para preparar el mensaje; nada se envía sin que lo revises y confirmes.</p>
      ${state.setupContacts.map((contact, index) => `<div class="contact-fields">
        <label for="contact-name-${index}">Nombre o apodo ${index + 1}</label>
        <input class="field" id="contact-name-${index}" data-contact-name="${index}" maxlength="80" value="${escapeHTML(contact.name)}" autocomplete="off">
        <label for="contact-phone-${index}">Número de celular</label>
        <div class="phone-field"><span aria-hidden="true">+51</span><input class="field" id="contact-phone-${index}" data-contact-phone="${index}" type="tel" inputmode="numeric" pattern="[0-9]{9}" maxlength="14" placeholder="999 999 999" aria-label="Número de celular, prefijo +51, 9 dígitos" value="${escapeHTML(localPhone(contact.phone))}" autocomplete="tel-national"></div>
        ${index >= 2 ? `<button class="button secondary remove-contact" type="button" data-action="remove-setup-contact" data-index="${index}" aria-label="Quitar persona ${index + 1}">Quitar</button>` : ''}
      </div>`).join('')}
      ${state.setupContacts.length < 3 ? '<button class="button secondary" type="button" data-action="add-setup-contact">+ Agregar otra</button>' : ''}
      <p class="error-text" role="alert">${escapeHTML(state.setupError)}</p>`;
  } else if (step === 2) {
    content = `<h2>Ubicación</h2><p>No se necesita habilitar ubicación para usar la aplicación. Solo se consulta cuando eliges una acción que la requiere.</p>
      <p class="note">Si decides compartir una ubicación, el navegador te pedirá permiso y podrás revisar el enlace antes de abrir WhatsApp.</p>`;
  } else if (step === 3) {
    content = `<h2>Crea un PIN</h2>
      <p>Lo escribirás en la calculadora de una receta para activar las funciones de apoyo. Sin el PIN, la aplicación se ve y funciona solo como recetario.</p>
      <label class="setup-pin-field" for="setup-pin">PIN de 6 dígitos
        <input class="field" id="setup-pin" data-setup-pin type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="new-password" value="${escapeHTML(state.setupPin)}">
      </label>
      <label class="setup-pin-field" for="setup-pin-confirm">Repite el PIN
        <input class="field" id="setup-pin-confirm" data-setup-pin-confirm type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="new-password" value="${escapeHTML(state.setupPinConfirm)}">
      </label>
      <p class="note">No uses un PIN de otra cuenta. Si lo olvidas, el prototipo no puede recuperarlo. Se guarda una verificación derivada con sal; esto no protege contra alguien con acceso técnico al dispositivo.</p>
      <p class="error-text" role="alert">${escapeHTML(state.setupError)}</p>`;
  } else {
    content = `<h2>¡Listo!</h2><p>Al terminar, encontrarás la receta que elegiste en Favoritas. Para activar el modo apoyo, abre esa receta y escribe tu PIN en la calculadora.</p>
      <p>Al iniciar el tutorial se guardará esta configuración en el dispositivo. Podrás salir cuando quieras; el tutorial no enviará mensajes.</p>
      <button class="button secondary" type="button" data-action="setup-tutorial">Guardar y practicar el tutorial</button>`;
  }

  return `<section class="setup" aria-labelledby="setup-heading">
    <div class="setup-toolbar"><button class="button quick-exit" type="button" data-action="quick-exit"><span aria-hidden="true">↗</span> Salir rápido</button></div>
    <div class="progress" role="progressbar" aria-label="Progreso de configuración" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${step + 1}"><span style="width:${(step + 1) * 20}%"></span></div>
    ${content}
    <div class="action-row">
      ${step > 0 && step < 4 ? '<button class="button secondary" type="button" data-action="setup-back">Atrás</button>' : ''}
      <button class="button" type="button" data-action="setup-next">${step === 4 ? 'Ir a mis recetas' : 'Continuar'}</button>
    </div>
  </section>`;
}
