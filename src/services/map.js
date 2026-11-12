import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { safePoints } from '../data/safePoints.js';

let map;

export function renderMap(element, location, onSelectPoint) {
  if (!element) return;
  if (map) {
    map.remove();
    map = null;
  }

  map = L.map(element, { scrollWheelZoom: false }).setView([-11.993, -77.008], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  safePoints.forEach((point, index) => {
    L.marker([point.lat, point.lng], {
      icon: L.divIcon({
        className: 'demo-map-marker',
        html: '<span aria-hidden="true">?</span>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      }),
      title: `${point.name} — ejemplo no verificado`
    }).addTo(map).on('click', () => onSelectPoint(index));
  });

  if (location) {
    L.marker([location.latitude, location.longitude], {
      title: 'Tu ubicación actual',
      icon: L.divIcon({
        className: 'current-location-marker',
        html: '<span aria-hidden="true"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      })
    }).addTo(map);
    map.setView([location.latitude, location.longitude], 15);
  }

  requestAnimationFrame(() => map?.invalidateSize());
}

export function destroyMap() {
  if (!map) return;
  map.remove();
  map = null;
}
