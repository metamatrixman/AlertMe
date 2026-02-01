"use client"

import { useStorageInit } from "@/hooks/use-storage-init"

/**
 * Storage Initializer Component
 * 
 * Triggers storage initialization on app load.
 * This component ensures:
 * - IndexedDB is initialized during PWA installation
 * - Persistent storage permissions are requested
 * - App knows where to find storage configuration
 * 
 * Returns null as it's purely functional.
 */
export function StorageInitializer() {
  useStorageInit()
  return null
}
