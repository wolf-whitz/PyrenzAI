/**
 * Service Worker, What is it?
 * @ServiceWorker is a script that the browser runs in the background, separate from a web page, opening the door to features that don't need a web page or user interaction.
 * For example, it enables the creation of push notifications and background syncs.
 * It also allows you to intercept network requests and cache resources, enabling offline functionality and many more features.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
*/

const CACHE_NAME = 'cache-v1';
const OFFLINE_URL = '/Html/Offline.html';
const NOSCRIPT_URL = '/Html/Noscript.html';

const urlsToCache = [OFFLINE_URL, NOSCRIPT_URL];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
