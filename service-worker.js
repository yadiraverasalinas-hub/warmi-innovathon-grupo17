const CACHE_NAME = 'recetario-casero-v8';
const APP_ROOT = new URL('./', self.location).href;
const MANIFEST_URL = new URL('./manifest.webmanifest', self.location).href;
const STATIC_URLS = [
  MANIFEST_URL,
  ...[
    'icono-app-discreto-192.png',
    'icono-app-discreto-512.png',
    'icono-app-discreto.svg',
    'logo-fusion-512.png',
    'logo-fusion.svg'
  ].map((name) => new URL(`./icons/${name}`, self.location).href),
  ...['aji.jpg', 'arroz.jpg', 'causa.jpg', 'lomo.jpg', 'caldo-gallina.jpg', 'chaufa.jpg', 'ceviche.jpg', 'mazamorra-morada.jpg']
    .map((name) => new URL(`./images/${name}`, self.location).href)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const shellResponse = await fetch(APP_ROOT, { cache: 'no-store' });
      if (!shellResponse.ok) throw new Error('No se pudo precargar la página principal.');
      const html = await shellResponse.clone().text();
      const bundles = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)]
        .map((match) => new URL(match[1], APP_ROOT).href);
      const cache = await caches.open(CACHE_NAME);
      await cache.put(APP_ROOT, shellResponse);
      await cache.addAll([...STATIC_URLS, ...bundles]);
    })()
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith('recetario-casero-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(APP_ROOT, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match(APP_ROOT))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreVary: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
