import { precacheAndRoute } from 'workbox-precaching';
import { useStore } from 'vuex';

// プレースホルダーを追加
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  console.log('Service worker installed');
  self.skipWaiting(); // インストール後すぐにアクティブにする
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim()); // クライアントの制御をすぐに始める
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
});

// Push イベントをリスンする
self.addEventListener('push', event => {
  console.log('Push received:', event);
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Default title';
  const options = {
    body: data.body || 'Default body',
    icon: data.icon || 'favicon.ico',
    badge: data.badge || 'favicon.ico',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('Notification click: ', event.notification.tag);
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(windowClients => {
      const targetUrl = event.notification.data.url;
      const gameId = event.notification.data.game_id;
      const store = useStore();

      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          if(gameId !== null){
            store.dispatch('buildersTacticsStore/setCurrentGameId', gameId);
          }
          return client.focus();
        }
      }
      
      if (self.clients.openWindow) {
        if(gameId !== null){
          store.dispatch('buildersTacticsStore/setCurrentGameId', gameId);
        }
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

