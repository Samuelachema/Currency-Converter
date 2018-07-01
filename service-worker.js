var cacheName = 'curcon-stattic-v3';
var filesToCache = [
  './',
   './manifest.json',
  './index.html',
  './scripts/app.js',
  './styles/inline.css',
  './favicon.ico',
  'https://free.currencyconverterapi.com/api/v5/currencies'
];


self.addEventListener('install', e=>{
    console.log('[ServiceWorker] Install');
    e.waitUntil(caches.open(cacheName).then(cache=>{
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(filesToCache);
    }
    ), );
}
);


self.addEventListener('activate', e=>{
    console.log('[ServiceWorker] Activate');
    e.waitUntil(caches.keys().then(keyList=>Promise.all(keyList.map(key=>{
        if (key !== cacheName) {
            return caches.delete(key);
        }
    }
    ), ), ), );
}
);

self.addEventListener('fetch', function(event){    
    console.log('[Service Worker] Fetch', event.request.url);
    var requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/'));
            return;

        }
    }
    event.respondWith(
        caches.match(event.request).then(function(response) {
          if (response) return response;
          return fetch(event.request);        
        })        
      );
 });

