var cacheName = 'curcon-stattic-v3';
var filesToCache = [
  './',
   './manifest.json',
  './index.html',
  './scripts/app.js',
  './styles/inline.css',
  './favicon.ico'
];


self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    }),
  );
});


self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request)),
  );
});
