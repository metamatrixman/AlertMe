"use client"

import { useEffect } from "react"
import { StorageManager } from "@/lib/storage-manager"

/**
 * Hook to initialize IndexedDB and request persistent storage
 * Should be called in the root layout or page component
 */
export function useStorageInit() {
  useEffect(() => {
    const initStorage = async () => {
      try {
        // Initialize IndexedDB
        await StorageManager.initIndexedDB()

        // Request persistent storage quota
        const isPersistent = await StorageManager.requestPersistentStorage()

        // Get storage stats
        const stats = await StorageManager.getStorageSize()
        const percentUsed = ((stats.used / stats.quota) * 100).toFixed(2)

        console.log(`[v0] Storage initialized: ${percentUsed}% of ${(stats.quota / 1024 / 1024).toFixed(2)}MB used`)
        if (isPersistent) {
          console.log("[v0] Persistent storage granted")
        }
      } catch (error) {
        console.warn("[v0] Storage initialization warning:", error)
      }
    }

    initStorage()
  }, [])
}
