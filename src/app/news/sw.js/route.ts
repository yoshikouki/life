/**
 * Service Worker for /news PWA push notifications
 * Returns JavaScript content as a route handler
 */
export function GET() {
  const serviceWorkerCode = `
// Service Worker for /news push notifications

self.addEventListener("install", (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    // Fallback for plain text
    data = {
      title: "News Update",
      body: event.data.text(),
    };
  }

  const title = data.title || "News Update";
  const options = {
    body: data.body || "",
    icon: data.icon || "/icon-192x192.webp",
    badge: data.badge || "/icon-192x192.webp",
    tag: data.tag || "news-notification",
    data: {
      url: data.url || "/news",
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/news";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      // If no existing window, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
`.trim();

  return new Response(serviceWorkerCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Service-Worker-Allowed": "/news",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
