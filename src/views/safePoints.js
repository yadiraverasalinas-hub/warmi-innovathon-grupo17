import { safePoints } from '../data/safePoints.js';
import { escapeHTML } from '../utils/security.js';

export function renderSafePoints(state) {
  const points = safePoints;
  const selected = state.selectedPoint === null ? null : points[state.selectedPoint];
  const detail = selected ? `<section class="panel" aria-labelledby="point-title">
    <h3 id="point-title">${escapeHTML(selected.name)} <span class="tag">Ejemplo no verificado</span></h3>
    <p class="note">${escapeHTML(selected.type)} · ${escapeHTML(selected.hours)}<br>${escapeHTML(selected.address)}</p>
    <button class="button secondary" type="button" data-action="close-point">Cerrar detalle</button>
  </section>` : '';

  return `<section aria-labelledby="shops-title">
    <h2 id="shops-title" class="section-title">Establecimientos de ejemplo</h2>
    <p class="note">Estos datos son ilustrativos, no están verificados y no representan puntos seguros. No los uses para decidir a dónde acudir.</p>
    <div class="banner"><strong>Importante:</strong> los marcadores y direcciones son datos de demostración. La aplicación no verifica establecimientos ni ofrece protección o monitoreo.</div>
    <button class="button secondary full" type="button" data-action="request-location">Mostrar mi ubicación actual en el mapa</button>
    ${state.location ? '<p class="note" role="status">Ubicación visible solo durante esta sesión. No se comparte automáticamente.</p>' : ''}
    <div id="shops-map" class="tile-map" aria-label="Mapa ilustrativo de establecimientos no verificados"></div>
    ${detail}
    <div class="point-list">${points.map((point, index) => `<button class="point-card" type="button" data-action="select-point" data-index="${index}">
      <strong>${escapeHTML(point.name)} <span class="tag">No verificado</span></strong>
      <small>${escapeHTML(point.type)} · ${escapeHTML(point.distance)} · ${escapeHTML(point.hours)}</small>
    </button>`).join('')}</div>
  </section>`;
}
