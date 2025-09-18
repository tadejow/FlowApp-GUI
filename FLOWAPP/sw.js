
const CACHE_NAME = 'flowapp-dynamic-cache-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './index.js',
    './manifest.json',
    'https://raw.githubusercontent.com/google/generative-ai-docs/main/site/en/gemma/images/gemma_logo.png'
];

// On install, pre-cache the static shell
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting()) // Activate new SW immediately
    );
});

// On activate, clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName.startsWith('flowapp-') && cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Use "Stale-While-Revalidate" strategy for all requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    // If we got a valid response, update the cache
                    if (networkResponse && networkResponse.status === 200) {
                         cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(err => {
                    // fetch failed, probably offline, do nothing.
                    console.warn(`Fetch failed for ${event.request.url}; returning cached response instead.`, err);
                });

                // Return the cached response immediately, and update the cache in the background.
                return cachedResponse || fetchPromise;
            });
        })
    );
});
