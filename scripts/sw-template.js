/* 构建时写入版本与文件列表。只缓存游戏资源，不缓存存档、API或外站。 */
const VERSION='__VERSION__';
const CACHE='unnamed-game-shell-'+VERSION;
const FILES=__PRECACHE__;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('unnamed-game-shell-')&&key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()]));});
self.addEventListener('message',event=>{if(event.data?.type==='APPLY_SAVED_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
if(request.mode==='navigate'){event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok&&response.headers.get('content-type')?.includes('text/html'))return response;}catch{}const cached=await caches.open(CACHE).then(c=>c.match('/index.html'));return cached||new Response('请先联网打开游戏一次，再离线使用。',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});})());return;}
if(!FILES.includes(url.pathname))return;
event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(url.pathname))||fetch(request)));});
