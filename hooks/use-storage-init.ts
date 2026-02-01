"use client"

import { useEffect } from "react"
import { StorageManager } from "@/lib/storage-manager"

/**
 * Hook to initialize persistent storage during app startup
 * 
 * This hook:
 * 1. Loads storage configuration from service worker
 * 2. Initializes IndexedDB connection
 * 3. Requests persistent storage permission
 * 4. Logs storage stats and location
 * 
 * Should be called in the root layout component
 */
export function useStorageInit() {
  useEffect(() => {
    StorageManager.initializeStorage()
