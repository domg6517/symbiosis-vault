// Symbiosis Vault Service Worker - Network First Strategy
const CACHE_NAME = 'symbiosis-vault-v1';

// Install: activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate: claim all clients and clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip API calls and auth requests - never cache those
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline fallback: serve from cache
        return caches.match(event.request);
      })
  );
});
