const C="rutina-v3";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","icon.png","manifest.json"])));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
// Pide la versión más nueva a GitHub. Solo guarda respuestas correctas: si GitHub responde con error
// (por ejemplo mientras se cambia un archivo) o no hay internet, usa la última copia buena.
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const fallback=()=>caches.match(e.request).then(r=>r||caches.match("index.html")||caches.match("./"));
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{
    if(!r.ok)return fallback().then(c=>c||r);
    const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;
  }).catch(fallback));
});
