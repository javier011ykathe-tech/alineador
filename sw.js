// Alineador de antenas - guarda la app en el teléfono para que abra rápido y sin señal.
// Para publicar una versión nueva, cambia el número de VERSION.
const VERSION='alineador-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin!==location.origin)return; // mapas y elevación van directo a internet
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>{
    const red=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(ch=>ch.put(r,cp))}return res}).catch(()=>c);
    return c||red;
  }));
});
