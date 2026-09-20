const CACHE = 'strike-terminal-v2';
const SHELL = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => { self.clients.claim(); });

// App shell loads from cache instantly; live data (backend calls) always goes to the network.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('/api/')) return; // never cache live trading data
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
