const CACHE_NAME = 'calculadora-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devolverlo
        if (response) {
          return response;
        }
        // Si no, pedirlo por red
        return fetch(event.request).then(fetchResponse => {
          // Opcional: cachear la respuesta para futuras veces
          return caches.open(CACHE_NAME).then(cache => {
            // Verificar que la petición sea válida para cache
            // (por ejemplo no cachear peticiones a APIs dinámicas o recursos externos no estáticos, si lo deseas)
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // Opcional: fallback si algo falla (offline sin recurso)
        // podrías devolver una página offline, o un mensaje, etc.
      })
  );
});
