const CACHE_NAME = 'pre-cache';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const reqUrl = new URL(event.request.url);
  const accept = event.request.headers.get('Accept') || '';

  const isHtml = accept.includes('text/html');
  const isCss = event.request.destination === 'style' || reqUrl.pathname.endsWith('.css');
  const isFont = reqUrl.pathname.endsWith('.ttf');

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (isCss || isFont) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchAndCache = fetch(event.request)
          .then((res) => {
            if (res.ok) {
              const resClone = res.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, resClone);
              });
            }
            return res;
          })
          .catch(() => cached);
        return cached || fetchAndCache;
      })
    );
  }
});
