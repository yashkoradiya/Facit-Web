self.addEventListener("install", event => {
  // Make sure we always use the latest version of the sw
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  // Make sure client calling .register() is connected to sw
  clients.claim();
});

self.addEventListener("message", ({ data, source: { id } }) => {
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      if (client.id !== id) client.postMessage(data);
    });
  });
});
