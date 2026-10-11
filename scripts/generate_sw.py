# scripts/generate_sw.py
# Generates offline PWA service worker sw.js for Badeelk

SW_CONTENT = """// sw.js - Service Worker for Badeelk Offline PWA
const CACHE_NAME = "badeelk-static-v1";
const STATIC_ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "manifest.json",
  "js/app.js",
  "js/i18n.js",
  "js/arabicNormalize.js",
  "js/fuzzySearch.js",
  "js/dataLoader.js",
  "js/searchEngine.js",
  "js/searchWorker.js",
  "js/dataset.js",
  "data/prefix_index.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && !key.startsWith("badeelak-chunks")) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          event.request.url.includes("/data/chunks/")
        ) {
          const responseToCache = networkResponse.clone();
          caches.open("badeelak-chunks-v1").then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
"""

with open("../sw.js", "w", encoding="utf-8") as f:
    f.write(SW_CONTENT)

print("Generated ../sw.js successfully!")
