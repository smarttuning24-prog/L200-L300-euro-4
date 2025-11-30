const CACHE_NAME = 'l200-manual-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/js/app.js',
  '/js/pwa-setup.js',
  '/mmc-manuals.ru/manuals/l200_v/online/Service_Manual_v2/2020/M1/css/common.css',
  '/mmc-manuals.ru/manuals/l200_v/online/Service_Manual_v2/2020/M1/css/print.css'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All resources cached');
      })
      .catch((error) => {
        console.error('Cache error:', error);
      })
  );
  
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch Service Worker
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle GET requests only
  if (request.method !== 'GET') {
    return;
  }
  
  // Strategy: Cache first, fallback to network
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          // Return cached response
          return response;
        }
        
        // Try to fetch from network
        return fetch(request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the new response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              })
              .catch((error) => {
                console.warn('Failed to cache response:', error);
              });
            
            return response;
          })
          .catch((error) => {
            console.warn('Fetch failed:', error);
            
            // Return offline page if available
            return caches.match('/offline.html').catch(() => {
              return new Response('Offline - Document not cached', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    caches.open(CACHE_NAME)
      .then((cache) => {
        cache.addAll(urls);
      });
  }
});

// Background sync for offline features
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-documents') {
    event.waitUntil(syncDocuments());
  }
});

async function syncDocuments() {
  try {
    // Sync logic here
    console.log('Syncing documents...');
  } catch (error) {
    console.error('Sync error:', error);
  }
}
