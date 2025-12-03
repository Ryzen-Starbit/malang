const VERSION = "1.0.0";
const CACHE_NAME = `malang-${VERSION}`;
const ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/resrc/images/icons/malang.png",
    "/src/styles/common.css",
    "/src/scripts/load.js",
    "/src/scripts/common.js"
];

// install event — cache core assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// activate event — clear old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
        )
    );
    self.clients.claim();
});

// fetch event — serve cached assets
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
