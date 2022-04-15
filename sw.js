var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = [
    '/',
    '/index.html',
    'jquery.min.js',
    'style.css',
    'main.js',
    'fallback.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    )
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            console.log("activate");
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName != CACHE_NAME;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            )
        })

    );
});

self.addEventListener('fetch', function(event) {
    // event.respondWith(
    //     caches.match(event.request)
    //     .then(function(response) {
    // console.log("fetch");
    //         if (response) {
    //             return response;
    //         }

    //         return fetch(event.request);
    //     })

    // );

    var request = event.request;
    var url = new URL(request.url);

    console.log("url.origin", url.origin);
    console.log("location.origin", location.origin);
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request).then(function(response) {
                return response || fetch(request);
            })
        )
    } else {
        event.respondWith(
            caches.open('products-cache').then(function(cache) {
                return fetch(request).then(function(liveResponse) {
                    cache.put(request, liveResponse.clone());
                    return liveResponse;
                })
            }).catch(function() {
                return caches.match(request).then(function(response) {
                    return response || caches.match('/fallback.json');
                })
            })
        )
    }
});