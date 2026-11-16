import { escapeHTML } from '../utils/security.js';
import { getTutorialSteps } from '../state/tutorial.js';

export function renderTutorialOverlay(state) {
  const steps = getTutorialSteps(state);
  const step = steps[state.tutorialStep];
  if (!step) return '';

  const lastStep = state.tutorialStep === steps.length - 1;
  return `<div class="tutorial-overlay" aria-label="Tutorial interactivo">
    <div class="tutorial-scrim tutorial-scrim-full" aria-hidden="true"></div>
    <div class="tutorial-scrim tutorial-scrim-top" aria-hidden="true"></div>
    <div class="tutorial-scrim tutorial-scrim-bottom" aria-hidden="true"></div>
    <div class="tutorial-scrim tutorial-scrim-left" aria-hidden="true"></div>
    <div class="tutorial-scrim tutorial-scrim-right" aria-hidden="true"></div>
    <section class="tutorial-card" data-placement="${step.placement ?? 'bottom'}" role="region" aria-live="polite" aria-labelledby="tutorial-title">
      <p class="tutorial-progress">${state.tutorialStep + 1} de ${steps.length}</p>
      <h2 id="tutorial-title">${escapeHTML(step.title)}</h2>
      <p class="tutorial-description">${escapeHTML(step.description)}</p>
      ${lastStep ? '<p class="tutorial-complete-note">La práctica terminó sin enviar mensajes.</p>' : ''}
      <div class="tutorial-controls">
        <button class="button secondary" type="button" data-action="tutorial-exit">Salir</button>
        <button class="button secondary" type="button" data-action="tutorial-previous" ${state.tutorialStep === 0 ? 'disabled' : ''}>Anterior</button>
        ${lastStep
          ? '<button class="button" type="button" data-action="tutorial-finish">Terminar</button>'
          : step.action === 'tutorial-continue'
            ? '<button class="button" type="button" data-action="tutorial-continue">Continuar</button>'
            : '<p class="tutorial-hint">Realiza la acción resaltada para continuar.</p>'}
      </div>
    </section>
  </div>`;
}
