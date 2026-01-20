const CACHE_VERSION = "v1.1"
const CACHE_NAME = `ecobank-express-${CACHE_VERSION}`

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
  "/icon-maskable-192.svg",
  "/icon-maskable-512.svg",
  "/apple-icon.png"
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log("[Ecobank Express] Cache addAll error:", err)
      })
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Ecobank Express] Removing old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }
        
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone)
        })
        return response
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }
          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }
          return new Response("Offline - content unavailable", { 
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain"
            })
          })
        })
      }),
  )
})

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || "New notification from Ecobank Express",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }
    event.waitUntil(
      self.registration.showNotification(data.title || "Ecobank Express", options)
    )
  }
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow("/")
  )
})

// Background sync for offline transactions (for future use)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-transactions") {
    event.waitUntil(syncTransactions())
  }
})

async function syncTransactions() {
  // Placeholder for syncing offline transactions
  console.log("[Ecobank Express] Syncing offline transactions...")
}
