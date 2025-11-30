const CACHE_NAME = 'l200-manual-v1';
const urlsToCache = [
    './',
    './index-landing.html',
    './manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching app shell');
            return cache.addAll(urlsToCache);
        }).catch(err => console.log('[SW] Install error:', err))
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if available
            if (response) {
                // Update cache in background
                fetch(event.request).then((freshResponse) => {
                    if (freshResponse && freshResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, freshResponse);
                        });
                    }
                }).catch(() => {
                    // Network request failed, use cache
                });
                return response;
            }

            // Try network request
            return fetch(event.request).then((response) => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200) {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                // Cache successful responses
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Network failed and not in cache
                console.log('[SW] Fetch failed for:', event.request.url);
                
                // Return offline page if available
                if (event.request.destination === 'document') {
                    return caches.match('./index-landing.html');
                }
            });
        })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
