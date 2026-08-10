const CACHE = "v1";
const ASSETS = [
  "index.html",
  "manifest.json",
  "sw.js",
  "background.png"
];

self.addEventListener("install", e => {
  console.assert(e instanceof ExtendableEvent, "Install event invalid");
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener("activate", e => {
  console.assert(e instanceof ExtendableEvent, "Activate event invalid");
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
  console.assert(e.request instanceof Request, "Fetch request invalid");
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
