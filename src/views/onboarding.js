import welcomeIllustration from '../assets/illustrations/welcome.svg';
import exploreIllustration from '../assets/illustrations/explore.svg';
import personalizeIllustration from '../assets/illustrations/personalize.svg';
import { escapeHTML } from '../utils/security.js';

const onboardingScreens = [
  {
    title: '¡Bienvenida a Recetario Casero!',
    description: 'Un espacio para descubrir recetas, explorar y disfrutar a tu ritmo.',
    illustration: welcomeIllustration,
    nextLabel: 'Comenzar'
  },
  {
    title: 'Explora a tu manera',
    description: 'Encuentra nuevas ideas y descubre todo lo que puedes hacer.',
    illustration: exploreIllustration,
    nextLabel: 'Continuar'
  },
  {
    title: 'Personaliza tu experiencia',
    description: 'Prepara tu espacio a tu ritmo. Tú decides qué opciones configurar.',
    illustration: personalizeIllustration,
    nextLabel: 'Empezar configuración'
  }
];

const brandMark = `<svg class="onboarding-brand-mark" viewBox="0 0 42 42" aria-hidden="true">
  <path d="M7 17c0-7 6-12 14-12s14 5 14 12v13c-4 3-9 4-14 4S11 33 7 30V17Z"/>
  <path d="M7 19 3 14c-2-2 1-5 3-3l5 4M35 19l4-5c2-2-1-5-3-3l-5 4M15 14v5m12-5v5M17 25h8m-7 6h6"/>
</svg>`;

export function renderOnboarding(state) {
  const step = state.onboardingStep;
  const screen = onboardingScreens[step];
  if (!screen) throw new RangeError(`Pantalla de bienvenida inválida: ${step}`);

  const isFirst = step === 0;
  const isLast = step === onboardingScreens.length - 1;
  return `<section class="onboarding" aria-labelledby="onboarding-heading">
    <header class="onboarding-header">
      <div class="onboarding-brand">${brandMark}<span>Recetario Casero</span></div>
      <button class="onboarding-skip" type="button" data-action="onboarding-skip">Omitir</button>
    </header>
    <div class="onboarding-content">
      <img class="onboarding-illustration" src="${escapeHTML(screen.illustration)}" alt="" fetchpriority="high">
      <h1 id="onboarding-heading">${escapeHTML(screen.title)}</h1>
      <p class="onboarding-description">${escapeHTML(screen.description)}</p>
    </div>
    <footer class="onboarding-footer">
      <div class="onboarding-dots" role="group" aria-label="Pantalla ${step + 1} de ${onboardingScreens.length}">
        ${onboardingScreens.map((_, index) => `<span class="onboarding-dot${index === step ? ' active' : ''}"${index === step ? ' aria-current="step"' : ''}></span>`).join('')}
      </div>
      <div class="onboarding-actions">
        ${!isFirst ? '<button class="button secondary" type="button" data-action="onboarding-back">Atrás</button>' : ''}
        <button class="button${isFirst || isLast ? ' onboarding-primary' : ''}" type="button" data-action="onboarding-next">${escapeHTML(screen.nextLabel)}</button>
      </div>
    </footer>
  </section>`;
}
