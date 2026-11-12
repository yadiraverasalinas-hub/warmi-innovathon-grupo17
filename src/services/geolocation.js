export function getCurrentLocation() {
  if (!('geolocation' in navigator)) {
    return Promise.reject(new Error('Este navegador no permite consultar la ubicación.'));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      (error) => {
        const messages = {
          1: 'No se concedió permiso para consultar la ubicación.',
          2: 'No se pudo determinar tu ubicación.',
          3: 'La consulta de ubicación tardó demasiado.'
        };
        reject(new Error(messages[error.code] ?? 'No se pudo consultar la ubicación.'));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  });
}

export function mapsLink(location) {
  const { latitude, longitude } = location;
  return `https://maps.google.com/?q=${encodeURIComponent(`${latitude},${longitude}`)}`;
}
