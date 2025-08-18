// 缓存名称，每次修改缓存内容时需要更新版本号
const CACHE_NAME = 'codexwalker-cache-v1';

// 需要缓存的资源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/game.html',
  '/about.html',
  '/ending_credits.html',
  '/style.css',
  '/css/game-ui.css',
  '/manifest.json',
  '/js/AssetLoader.js',
  '/js/GameController.js',
  '/js/GameStateManager.js',
  '/js/MusicManager.js',
  '/js/RouteManager.js',
  '/js/SceneDataManager.js',
  '/js/ScenePlayer.js',
  '/js/TransitionManager.js',
  '/js/UIManager.js',
  '/data/act1.json',
  '/data/act2.json',
  '/data/act3.json',
  '/data/act4.json',
  '/data/codex.json'
  // 注意：视频文件通常较大，不建议全部缓存
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求并从缓存中提供资源
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到了匹配的资源，则返回缓存的版本
        if (response) {
          return response;
        }
        
        // 否则，从网络获取资源
        return fetch(event.request).then(
          response => {
            // 检查是否收到了有效的响应
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应，因为响应是流，只能使用一次
            const responseToCache = response.clone();

            // 对于视频文件，我们不缓存
            if (!event.request.url.endsWith('.mp4')) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          }
        );
      })
  );
});