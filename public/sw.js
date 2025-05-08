/**
 * Service Worker, What is it?
 * @ServiceWorker is a script that the browser runs in the background, separate from a web page, opening the door to features that don't need a web page or user interaction.
 * For example, it enables the creation of push notifications and background syncs.
 * It also allows you to intercept network requests and cache resources, enabling offline functionality and many more features.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 */

/**
 * For now we will have a simple service worker that will log messages to the console when it is installed and activated.
 * In the future we can add more functionality, but this works for now.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
 * If you need more information about service workers, check the link above.
 */

const CACHE_NAME = 'v1';
const urlsToCache = ['/', '/index.html', '/main.js', '/favicon.png'];

/**
 * Cache, What is it?
 * @Cache is a storage mechanism that allows you to store resources (like HTML, CSS, JS, images, etc.) in the browser.
 * This allows you to serve these resources from the cache instead of fetching them from the network, which can improve performance and enable offline functionality.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 */

self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching app shell...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activated.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('🧹 Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});
