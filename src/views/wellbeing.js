import { emergencyContacts, wellbeingArticles } from '../data/wellbeing.js';
import { escapeHTML } from '../utils/security.js';

export function renderWellbeing(state) {
  const messages = state.chat.length
    ? state.chat.map((message) => `<div class="message ${message.from === 'user' ? 'user' : ''}">${escapeHTML(message.text)}</div>`).join('')
    : '<div class="message">¡Hola! Puedo darte consejos de cocina o escucharte con calma.</div>';

  return `<section class="wellbeing" aria-labelledby="wellbeing-title">
    <h2 id="wellbeing-title" class="section-title">Cocina y bienestar</h2>
    ${wellbeingArticles.map((article) => `<details><summary>${escapeHTML(article.title)}</summary><p>${escapeHTML(article.body)}</p></details>`).join('')}
    <section class="panel">
      <h3>Teléfonos útiles en Perú</h3>
      <div class="emergency-links">${emergencyContacts.map((contact) => `<a class="button ${contact.primary ? '' : 'secondary'}" href="tel:${escapeHTML(contact.number)}">${escapeHTML(contact.label)}</a>`).join('')}</div>
      <p class="note">Si hay peligro inmediato, busca un lugar seguro y contacta a los servicios locales de emergencia si hacerlo es seguro para ti.</p>
    </section>
    <section class="panel" aria-labelledby="assistant-title">
      <h3 id="assistant-title">Pregúntale a la cocinera</h3>
      <p class="note">Asistente con respuestas predefinidas; no es una IA ni un servicio profesional. El chat no se guarda.</p>
      <div class="chat-messages" id="chat-messages" aria-live="polite">${messages}</div>
      <form class="chat-form" data-form="chat">
        <label class="sr-only" for="chat-input">Escribe tu pregunta</label>
        <input class="field" id="chat-input" name="message" maxlength="500" placeholder="Escribe tu pregunta" autocomplete="off" required>
        <button class="button" type="submit">Enviar</button>
      </form>
    </section>
  </section>`;
}
