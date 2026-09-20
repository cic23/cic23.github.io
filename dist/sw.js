/* CIC service worker: network-first with cache fallback for same-origin GET requests.
   Cross-origin traffic (Apps Script form POSTs, Google Sign-In, Drive uploads/media) is never intercepted. */
const CACHE = 'cic-shell-v1';
const OFFLINE_URL = './offline.html';
const MAX_ENTRIES = 80;
const MAX_IMAGE_BYTES = 1024 * 1024;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([OFFLINE_URL, './assets/icons/icon-192.png'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('cic-shell-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_ENTRIES; i++) await cache.delete(keys[i]);
}

function cacheable(request, response) {
  if (!response || !response.ok || response.type !== 'basic') return false;
  if (request.destination === 'image' || request.destination === 'video' || request.destination === 'audio') {
    const size = Number(response.headers.get('content-length') || 0);
    return size > 0 && size <= MAX_IMAGE_BYTES;
  }
  return true;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === '/sw.js') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (cacheable(request, response)) { cache.put(request, response.clone()).then(() => trim(cache)).catch(() => {}); }
      return response;
    } catch (error) {
      const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
      if (cached) return cached;
      if (request.mode === 'navigate') return (await cache.match('./index.html')) || (await cache.match('./')) || (await cache.match(OFFLINE_URL));
      return Response.error();
    }
  })());
});
