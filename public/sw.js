self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('I am also alive!');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'retry-post') {
    console.log('Sync event: retry-post triggered');
    event.waitUntil(sendQueuedPosts());
  }
});