"use client"

/**
 * Enhanced Storage Manager with multiple storage backends
 * Priority: localStorage → IndexedDB → in-memory fallback
 * 
 * Storage Discovery:
 * - App can find storage config at /storage-config.json (cached by service worker)
 * - IndexedDB: ecobank_db (v1) with object store "app_data"
 * - LocalStorage: 5-10MB capacity
 * - Persistent storage: Requested on app initialization
 */

interface EncryptedData {
  encrypted: boolean
  data: string
}

interface StorageConfig {
  timestamp: number
  storageVersion: number
  dbName: string
  objectStore: string
  status: string
}

export class StorageManager {
  private static dbName = "ecobank_db"
  private static dbVersion = 1
  private static objectStoreName = "app_data"
  private static memoryCache: Map<string, any> = new Map()
  private static db: IDBDatabase | null = null
  private static storageConfigured = false

  private static isStorageAvailable(type: "localStorage" | "indexedDB"): boolean {
    if (type === "localStorage") {
      try {
        const test = "__storage_test__"
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        return true
      } catch {
        return false
      }
    }
    return typeof indexedDB !== "undefined"
  }

  static async getStorageConfig(): Promise<StorageConfig | null> {
    try {
      const response = await fetch("/storage-config.json")
      if (response.ok) {
        const config = await response.json()
        console.log("[Storage] Storage config loaded from service worker:", config)
        return config
      }
    } catch (error) {
      console.warn("[Storage] Failed to load storage config:", error)
    }
    return null
  }

  static async initIndexedDB(): Promise<void> {
    if (!this.isStorageAvailable("indexedDB") || this.db) return

    try {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion)

        request.onerror = () => reject(new Error("Failed to open IndexedDB"))
        request.onsuccess = () => {
          this.db = request.result
          console.log("[Storage] IndexedDB connection established")
          this.storageConfigured = true
          resolve()
        }

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result
          if (!db.objectStoreNames.contains(this.objectStoreName)) {
            db.createObjectStore(this.objectStoreName, { keyPath: "key" })
            console.log("[Storage] Created object store:", this.objectStoreName)
          }
        }
      })
    } catch (error) {
      console.warn("[Storage] IndexedDB initialization failed, falling back to localStorage:", error)
    }
  }

  static async initializeStorage(): Promise<void> {
    try {
      // Load storage config from service worker cache
      const config = await this.getStorageConfig()
      if (config) {
        console.log("[Storage] Using configuration from service worker", config)
      }

      // Initialize IndexedDB
      await this.initIndexedDB()

      // Request persistent storage
      const isPersistent = await this.requestPersistentStorage()

      // Get and log storage stats
      const stats = await this.getStorageSize()
      const percentUsed = stats.quota > 0 ? ((stats.used / stats.quota) * 100).toFixed(2) : "N/A"
      const quotaMB = stats.quota > 0 ? (stats.quota / 1024 / 1024).toFixed(2) : "N/A"

      console.log("[Storage] Initialization complete:")
      console.log(`  - Persistent: ${isPersistent}`)
      console.log(`  - Used: ${percentUsed}% of ${quotaMB}MB`)
      console.log(`  - Storage location: IndexedDB (${this.dbName}) + localStorage + in-memory cache`)
    } catch (error) {
      console.error("[Storage] Initialization failed:", error)
    }
  }

  static isStorageReady(): boolean {
    return this.storageConfigured || this.memoryCache.size > 0
  }

  static async save<T>(key: string, data: T, encrypt = false): Promise<void> {
    const serialized = JSON.stringify(data)

    // Store in memory cache
    this.memoryCache.set(key, data)

    // Try localStorage first
    if (this.isStorageAvailable("localStorage")) {
      try {
        localStorage.setItem(key, serialized)
        return
      } catch (error) {
        console.warn("localStorage quota exceeded, trying IndexedDB:", error)
      }
    }

    // Fallback to IndexedDB
    if (this.db) {
      try {
        return new Promise((resolve, reject) => {
          const transaction = this.db!.transaction([this.objectStoreName], "readwrite")
          const store = transaction.objectStore(this.objectStoreName)
          store.put({ key, value: serialized })
          transaction.oncomplete = () => resolve()
          transaction.onerror = () => reject(transaction.error)
        })
      } catch (error) {
        console.warn("IndexedDB save failed:", error)
      }
    }

    // Final fallback: in-memory storage
    console.warn("Using in-memory storage - data will not persist")
  }

  static async load<T>(key: string, defaultValue: T): Promise<T> {
    // Check memory cache first (fastest)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)
    }

    // Try localStorage
    if (this.isStorageAvailable("localStorage")) {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          const parsed = JSON.parse(item)
          this.memoryCache.set(key, parsed)
          return parsed
        }
      } catch (error) {
        console.warn("Failed to load from localStorage:", error)
      }
    }

    // Try IndexedDB
    if (this.db) {
      try {
        return new Promise((resolve, reject) => {
          const transaction = this.db!.transaction([this.objectStoreName], "readonly")
          const store = transaction.objectStore(this.objectStoreName)
          const request = store.get(key)

          request.onsuccess = () => {
            if (request.result) {
              const parsed = JSON.parse(request.result.value)
              this.memoryCache.set(key, parsed)
              resolve(parsed)
            } else {
              resolve(defaultValue)
            }
          }
          request.onerror = () => reject(request.error)
        })
      } catch (error) {
        console.warn("Failed to load from IndexedDB:", error)
      }
    }

    // Return default if all storage methods fail
    return defaultValue
  }

  static async remove(key: string): Promise<void> {
    this.memoryCache.delete(key)

    if (this.isStorageAvailable("localStorage")) {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.warn("Failed to remove from localStorage:", error)
      }
    }

    if (this.db) {
      try {
        return new Promise((resolve, reject) => {
          const transaction = this.db!.transaction([this.objectStoreName], "readwrite")
          const store = transaction.objectStore(this.objectStoreName)
          store.delete(key)
          transaction.oncomplete = () => resolve()
          transaction.onerror = () => reject(transaction.error)
        })
      } catch (error) {
        console.warn("Failed to remove from IndexedDB:", error)
      }
    }
  }

  static async clear(): Promise<void> {
    this.memoryCache.clear()

    if (this.isStorageAvailable("localStorage")) {
      try {
        localStorage.clear()
      } catch (error) {
        console.warn("Failed to clear localStorage:", error)
      }
    }

    if (this.db) {
      try {
        return new Promise((resolve, reject) => {
          const transaction = this.db!.transaction([this.objectStoreName], "readwrite")
          const store = transaction.objectStore(this.objectStoreName)
          store.clear()
          transaction.oncomplete = () => resolve()
          transaction.onerror = () => reject(transaction.error)
        })
      } catch (error) {
        console.warn("Failed to clear IndexedDB:", error)
      }
    }
  }

  static async getStorageSize(): Promise<{ used: number; quota: number }> {
    try {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0,
        }
      }
    } catch (error) {
      console.warn("Failed to get storage estimate:", error)
    }
    return { used: 0, quota: 0 }
  }

  static async requestPersistentStorage(): Promise<boolean> {
    try {
      if ("storage" in navigator && "persist" in navigator.storage) {
        return await navigator.storage.persist()
      }
    } catch (error) {
      console.warn("Failed to request persistent storage:", error)
    }
    return false
  }

  // Synchronous fallback methods for legacy code
  static saveSync<T>(key: string, data: T): void {
    const serialized = JSON.stringify(data)
    this.memoryCache.set(key, data)

    if (this.isStorageAvailable("localStorage")) {
      try {
        localStorage.setItem(key, serialized)
      } catch (error) {
        console.warn("Failed to save to localStorage:", error)
      }
    }
  }

  static loadSync<T>(key: string, defaultValue: T): T {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)
    }

    if (this.isStorageAvailable("localStorage")) {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          const parsed = JSON.parse(item)
          this.memoryCache.set(key, parsed)
          return parsed
        }
      } catch (error) {
        console.warn("Failed to load from localStorage:", error)
      }
    }

    return defaultValue
  }
}
