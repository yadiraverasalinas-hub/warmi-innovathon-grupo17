export const safePoints = [
  { name: 'Bodega Doña Rosa', type: 'Bodega', hours: '7:00 a 22:00', distance: '150 m', address: 'San Juan de Lurigancho (dirección de ejemplo)', lat: -11.9918, lng: -77.0096 },
  { name: 'Farmacia Salud y Hogar', type: 'Farmacia', hours: '8:00 a 23:00', distance: '300 m', address: 'San Juan de Lurigancho (dirección de ejemplo)', lat: -11.9936, lng: -77.0081 },
  { name: 'Librería El Estudiante', type: 'Librería', hours: '9:00 a 20:00', distance: '420 m', address: 'San Juan de Lurigancho (dirección de ejemplo)', lat: -11.9902, lng: -77.0069 },
  { name: 'Mercado Central', type: 'Mercado', hours: '6:00 a 18:00', distance: '600 m', address: 'San Juan de Lurigancho (dirección de ejemplo)', lat: -11.9955, lng: -77.0105 },
  { name: 'Minimarket La Esquina', type: 'Bodega', hours: '7:00 a 21:00', distance: '700 m', address: 'San Juan de Lurigancho (dirección de ejemplo)', lat: -11.9948, lng: -77.0052 },
  { name: 'Panadería San José', type: 'Panadería', hours: '6:00 a 14:00', distance: '250 m', address: 'San Juan de Lurigancho (dirección de ejemplo)', lat: -11.9925, lng: -77.0063 }
].map((point) => ({ ...point, verified: false, demo: true }));
