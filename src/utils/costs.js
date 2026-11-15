// Cálculo de costos de compra (RF-29). Los precios solo viven en memoria.

export function sanitizeCostInput(raw) {
  const cleaned = String(raw ?? '').replace(/[^\d.,]/g, '');
  const firstSeparator = cleaned.search(/[.,]/);
  const normalized = firstSeparator === -1
    ? cleaned
    : cleaned.slice(0, firstSeparator + 1) + cleaned.slice(firstSeparator + 1).replace(/[.,]/g, '');
  return normalized.slice(0, 8);
}

export function parseCost(raw) {
  const value = Number(String(raw ?? '').replace(',', '.'));
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function sumCosts(values) {
  const cents = values.reduce((total, value) => total + Math.round(parseCost(value) * 100), 0);
  return cents / 100;
}

export function costPerServing(total, servings) {
  if (!Number.isFinite(servings) || servings < 1) return 0;
  return Math.round((total / servings) * 100) / 100;
}

export function formatSoles(amount) {
  return `S/ ${amount.toFixed(2)}`;
}
