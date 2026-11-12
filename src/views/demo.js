const demoSteps = [
  'La persona abre Favoritas, entra a su receta de confianza y elige una persona configurada. La acción requiere que ella la inicie.',
  'WhatsApp se abre con un mensaje preparado. La persona revisa el destinatario y el contenido y decide si lo envía.',
  'La persona de confianza puede responder o contactar servicios locales si así lo acordaron. La aplicación no contacta a emergencias ni monitorea a nadie.'
];

export function renderDemo(state) {
  const step = Math.max(0, Math.min(demoSteps.length - 1, state.demoStep));
  return `<section aria-labelledby="demo-title">
    <h2 id="demo-title">Demostración del flujo</h2>
    <p class="note">Simulación; no representa un envío ni una ubicación real.</p>
    <div class="demo-message"><p><strong>Vista de mensaje</strong></p><div class="bubble">Te comparto una receta. (contenido de ejemplo)</div></div>
    <div class="panel" style="margin-top:12px">${demoSteps[step]}</div>
    <p class="note">Paso ${step + 1} de ${demoSteps.length}</p>
    <div class="action-row">
      <button class="button secondary" type="button" data-action="demo-previous" ${step === 0 ? 'disabled' : ''}>Anterior</button>
      <button class="button" type="button" data-action="demo-next" ${step === demoSteps.length - 1 ? 'disabled' : ''}>Siguiente</button>
      <a class="button secondary" href="#" data-action="leave-demo">Volver</a>
    </div>
  </section>`;
}
