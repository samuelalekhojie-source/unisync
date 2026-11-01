/* UniSync service worker: keeps the app shell on the phone so it opens instantly, even with a bad or no network.
   Data never goes through here: sign-in, messages and attendance talk to Supabase directly (a different address). */
const VERSION = '224a525e53';
const CACHE = 'unisync-' + VERSION;
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))) });
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting() });
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('unisync-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;     // Supabase and anything else: straight to the network
  if (req.mode === 'navigate') return e.respondWith(openApp(e, req));
  e.respondWith(staleWhileRevalidate(e, req));
});

/* opening the app: the newest version if the network answers within 4 seconds, otherwise the saved copy */
async function openApp(e, req) {
  const cache = await caches.open(CACHE);
  const fresh = fetch(req).then(r => { if (r && r.ok) cache.put('./index.html', r.clone()); return r });
  e.waitUntil(fresh.catch(() => { }));
  try { return await Promise.race([fresh, new Promise((_, no) => setTimeout(no, 4000))]) }
  catch (err) { return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error() }
}
async function staleWhileRevalidate(e, req) {
  const cache = await caches.open(CACHE), hit = await cache.match(req);
  const net = fetch(req).then(r => { if (r && r.ok) cache.put(req, r.clone()); return r }).catch(() => hit);
  if (hit) { e.waitUntil(net); return hit }
  return net;
}
