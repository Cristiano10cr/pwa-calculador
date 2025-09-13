const CACHE_NAME = "calculadora-v1";
const URLS_A_CACHE = [
  "/Calculadora-PWA/",
  "/Calculadora-PWA/index.html",
  "/Calculadora-PWA/icon-192.png",
  "/Calculadora-PWA/icon-512.png"
];

// Instalar Service Worker y guardar en caché
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_A_CACHE);
    })
  );
});

// Activar Service Worker y limpiar cachés viejas
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Interceptar peticiones y responder desde caché
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
