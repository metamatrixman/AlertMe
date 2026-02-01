# Persistent Storage Architecture Diagram

## Complete Flow During PWA Installation & App Startup

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER INSTALLS PWA                                │
└─────────────────────────────────────────────────────────────────────────┘
                                  ↓
                    ┌─────────────────────────────┐
                    │  Service Worker Install     │
                    │  (/public/sw.js)            │
                    └─────────────────────────────┘
                                  ↓
                ┌─────────────────────────────────────┐
                │ initializeIndexedDB()                │
                │ - Opens "ecobank_db" (v1)           │
                │ - Creates "app_data" object store   │
                └─────────────────────────────────────┘
                                  ↓
                ┌─────────────────────────────────────┐
                │ cacheStorageConfig()                │
                │ - Caches config in service worker   │
                │ - Available at /storage-config.json │
                └─────────────────────────────────────┘
                                  ↓
              ┌──────────────────────────────────────┐
              │   PWA INSTALLED & READY              │
              │   IndexedDB initialized              │
              │   Storage location discoverable      │
              └──────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     USER OPENS APP (Next.js Load)                       │
└─────────────────────────────────────────────────────────────────────────┘
                                  ↓
                    ┌─────────────────────────────┐
                    │  Root Layout Renders        │
                    │  (/app/layout.tsx)          │
                    └─────────────────────────────┘
                                  ↓
                ┌─────────────────────────────────────┐
                │  <StorageInitializer /> Mounts      │
                │  (calls useStorageInit hook)        │
                └─────────────────────────────────────┘
                                  ↓
            ┌─────────────────────────────────────────┐
            │  StorageManager.initializeStorage()     │
            │  (/lib/storage-manager.ts)              │
            └─────────────────────────────────────────┘
                                  ↓
            ┌─────────────────────────────────────────┐
            │  1. getStorageConfig()                  │
            │     Fetch /storage-config.json          │
            │     ↓ Success: {dbName, objectStore...} │
            └─────────────────────────────────────────┘
                                  ↓
            ┌─────────────────────────────────────────┐
            │  2. initIndexedDB()                     │
            │     Connect to "ecobank_db"             │
            │     ✓ Connection established            │
            └─────────────────────────────────────────┘
                                  ↓
            ┌─────────────────────────────────────────┐
            │  3. requestPersistentStorage()          │
            │     Request user permission             │
            │     ✓ User grants (or declines)         │
            └─────────────────────────────────────────┘
                                  ↓
            ┌─────────────────────────────────────────┐
            │  4. getStorageSize()                    │
            │     Calculate quota usage               │
            │     Log to console                      │
            └─────────────────────────────────────────┘
                                  ↓
              ┌──────────────────────────────────────┐
              │   ✅ STORAGE READY FOR USE            │
              │                                      │
              │   Console shows:                     │
              │   [Storage] Initialization complete  │
              │   - Persistent: true                 │
              │   - Used: 0.05% of 50MB              │
              │   - Location: IndexedDB + localStorage
              └──────────────────────────────────────┘
```

## Storage Access Pattern

```
┌──────────────────────────────────────────┐
│  StorageManager.save(key, data)          │
└──────────────────────────────────────────┘
                    ↓
         ┌─────────────────────────┐
         │ Update Memory Cache     │  ← Fastest
         │ (immediate)             │
         └─────────────────────────┘
                    ↓
         ┌─────────────────────────┐
         │ Try localStorage        │
         │ (5-10MB, fast)          │
         └─────────────────────────┘
                    ↓
              Try IndexedDB
              (50MB+, reliable)
                    ↓
         ┌─────────────────────────┐
         │ ✓ Data Persisted        │
         │ (available offline)     │
         └─────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────────────┐
│  StorageManager.load(key, defaultValue)  │
└──────────────────────────────────────────┘
                    ↓
         ┌─────────────────────────┐
         │ Check Memory Cache      │  ← Fastest
         └─────────────────────────┘
                    ↓ Not found
         ┌─────────────────────────┐
         │ Check localStorage      │  ← Fast
         │ Parse JSON              │
         └─────────────────────────┘
                    ↓ Not found
         ┌─────────────────────────┐
         │ Query IndexedDB         │  ← Reliable
         │ Parse from store        │
         └─────────────────────────┘
                    ↓ Not found
         ┌─────────────────────────┐
         │ Return defaultValue     │
         └─────────────────────────┘
```

## Storage Tier Summary

```
┌────────────────────────────────────────────────────────────┐
│  Storage Tier Analysis                                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. IN-MEMORY CACHE                                        │
│     ├─ Capacity: Limited by RAM                            │
│     ├─ Speed: Instant (< 1ms)                              │
│     ├─ Persistence: Session only                           │
│     ├─ Use: Hot user data, active session                  │
│     └─ Storage: Map<string, any>                           │
│                                                            │
│  2. LOCALSTORAGE                                           │
│     ├─ Capacity: 5-10MB                                    │
│     ├─ Speed: Fast (< 10ms)                                │
│     ├─ Persistence: ✓ Survives reload/restart              │
│     ├─ Use: Small JSON, settings, tokens                   │
│     └─ Fallback: When IndexedDB quota exceeded             │
│                                                            │
│  3. INDEXEDDB                                              │
│     ├─ Database: "ecobank_db" (v1)                         │
│     ├─ Capacity: 50MB+ (browser dependent)                 │
│     ├─ Speed: Medium (10-100ms)                            │
│     ├─ Persistence: ✓ Survives all restarts                │
│     ├─ Use: Large datasets, user profiles, transactions    │
│     ├─ Object Store: "app_data" (keyPath: "key")           │
│     └─ Async: Promise-based API                            │
│                                                            │
│  4. PERSISTENT STORAGE API (Optional)                      │
│     ├─ Status: Requested on app init                       │
│     ├─ Effect: Prevents browser auto-clearing               │
│     ├─ Permission: User-granted                            │
│     └─ Status: Logged to console                           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## File Organization

```
/workspaces/AlertMe/
│
├── public/
│   └── sw.js .......................... Service Worker
│       ├── Initializes IndexedDB
│       ├── Creates schema
│       └── Caches /storage-config.json
│
├── lib/
│   └── storage-manager.ts ............. Main Storage Manager
│       ├── Discovery methods
│       ├── Save/load/remove
│       └── Quota info
│
├── hooks/
│   └── use-storage-init.ts ............ Storage Init Hook
│       └── Calls StorageManager.initializeStorage()
│
├── components/
│   └── storage-initializer.tsx ........ NEW - Initializer
│       └── Mounts hook on app load
│
├── app/
│   └── layout.tsx ..................... Root Layout
│       └── Integrates <StorageInitializer />
│
├── STORAGE_DISCOVERY_GUIDE.js ......... Documentation
├── PERSISTENT_STORAGE_SETUP.md ........ Implementation Guide
└── STORAGE_IMPLEMENTATION_SUMMARY.js .. Summary
```

## Console Output Timeline

```
PHASE 1: Service Worker Installation
────────────────────────────────────
[Ecobank Express] Setting up IndexedDB schema
[Ecobank Express] Created object store: app_data
[Ecobank Express] IndexedDB initialized successfully
[Ecobank Express] Storage config cached

PHASE 2: App Startup
────────────────────
[Storage] Storage config loaded from service worker: {
  timestamp: ...,
  storageVersion: 1,
  dbName: "ecobank_db",
  objectStore: "app_data",
  status: "initialized"
}
[Storage] IndexedDB connection established
[Storage] Initialization complete:
  - Persistent: true
  - Used: 0.05% of 50MB
  - Storage location: IndexedDB (ecobank_db) + localStorage + in-memory cache
```

## Usage Example in Components

```typescript
// In any component:
import { StorageManager } from "@/lib/storage-manager"

// Save user profile
await StorageManager.save("user-profile", {
  id: 123,
  name: "John Doe",
  phone: "+234..."
})

// Load user profile (checks cache first)
const profile = await StorageManager.load("user-profile", null)
if (profile) {
  console.log("User loaded from storage:", profile)
}

// Check if storage is ready
if (StorageManager.isStorageReady()) {
  console.log("Storage initialized and ready")
}

// Get storage quota info
const { used, quota } = await StorageManager.getStorageSize()
console.log(`Using ${(used/quota*100).toFixed(2)}% of available storage`)
```

## Key Advantages

✅ **Zero Configuration** - Works automatically  
✅ **Discovery Mechanism** - App knows storage location  
✅ **Multi-tier Fallback** - Graceful degradation  
✅ **Large Capacity** - 50MB+ via IndexedDB  
✅ **Offline Ready** - Data persists without network  
✅ **Performance** - In-memory cache prevents redundant queries  
✅ **Diagnostics** - Detailed console logging  
✅ **User Transparent** - Automatic persistent storage request  
