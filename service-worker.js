const CACHE_NAME = "field-cache-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                const savedResponse = response.clone();

                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, savedResponse);
                });

                return response;
            })
            .catch(function () {
                return caches.match(event.request);
            })
    );
});