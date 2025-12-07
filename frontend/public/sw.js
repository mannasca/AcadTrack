// Service Worker for AcadTrack
// Implements cache-first strategy for static assets and network-first for API calls

const CACHE_NAME = 'acadtrack-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching essential assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls - network first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful API responses
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache if offline
          return caches.match(request).then((response) => {
            return response || new Response('Offline - data unavailable', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
        })
    );
  }
  // Static assets - cache first, fall back to network
  else if (
    url.pathname.match(/\.(js|css|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|gif|webp)$/) ||
    url.pathname.includes('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.ok) {
              const cache = caches.open(CACHE_NAME);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => {
            // Return offline placeholder if available
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
                '<rect fill="#f0f0f0" width="100" height="100"/>' +
                '<text x="50" y="50" text-anchor="middle" dominant-baseline="middle"' +
                'font-family="sans-serif" font-size="12" fill="#999">Offline</text>' +
                '</svg>',
                {
                  headers: { 'Content-Type': 'image/svg+xml' },
                }
              );
            }
            return new Response('Resource unavailable offline', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
    );
  }
  // HTML pages - network first, fall back to cache
  else if (
    request.headers.get('accept').includes('text/html') ||
    url.pathname === '/' ||
    !url.pathname.includes('.')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || caches.match('/index.html');
          });
        })
    );
  }
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
