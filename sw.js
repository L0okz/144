/* OX PS4 offline cache. Keep this list in sync with the static project files. */
"use strict";

var CACHE_NAME = "ox-ps4-offline-v1";
var ASSETS = [
  "./",
  "./index.html",
  "./jb.html",
  "./style.css",
  "./launch.js",
  "./jb.js",
  "./core.js",
  "./mem.js",
  "./int64.js",
  "./ps4_offsets.js",
  "./afterglow.js",
  "./meme.png",
  "./goldhen.bin",
  "./hen.bin",
  "./patchset.bin"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key.indexOf("ox-ps4-offline-") === 0 && key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;

  var url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        if (response && response.ok && response.type === "basic") {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, copy);
          });
        }
        return response;
      }).catch(function () {
        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }
        return new Response("Offline: this resource is not cached.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      });
    })
  );
});
