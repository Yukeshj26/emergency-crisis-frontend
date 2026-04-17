<<<<<<< HEAD
// src/services/offlineQueue.js

import { openDB } from "idb";
import { createIncident } from "./incidentService";

const DB_NAME = "crisis-db";
const STORE_NAME = "incident-queue";
=======
import { openDB } from 'idb';
import { createIncident } from './incidentService';

const DB_NAME    = 'crisis-db';
const STORE_NAME = 'incident-queue';
>>>>>>> a076e50 (initial commit)

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
<<<<<<< HEAD
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
      }
    }
=======
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
>>>>>>> a076e50 (initial commit)
  });
}

export async function addToQueue(data) {
  try {
    const db = await initDB();
<<<<<<< HEAD
    await db.add(STORE_NAME, {
      ...data,
      timestamp: Date.now()
    });
    console.log("[OfflineQueue] Added to queue");
  } catch (err) {
    console.error("[OfflineQueue] Add error:", err);
=======
    await db.add(STORE_NAME, { ...data, timestamp: Date.now() });
    console.log('[OfflineQueue] Added to queue');
  } catch (err) {
    console.error('[OfflineQueue] Add error:', err);
>>>>>>> a076e50 (initial commit)
  }
}

export async function syncQueue(onProgress) {
  try {
<<<<<<< HEAD
    const db = await initDB();
    const allItems = await db.getAll(STORE_NAME);

    if (!allItems.length) {
      return { total: 0, synced: 0 };
    }

    let synced = 0;

    for (let item of allItems) {
      try {
        await createIncident({
          type: item.type,
          location: item.location,
          mode: "offline"
        });

        synced++;

        if (onProgress) {
          onProgress({
            total: allItems.length,
            synced
          });
        }
      } catch (err) {
        console.error("[OfflineQueue] Sync failed for item:", item);
      }
    }

    await db.clear(STORE_NAME);
    console.log("[OfflineQueue] Sync complete");

    return {
      total: allItems.length,
      synced
    };
  } catch (err) {
    console.error("[OfflineQueue] Sync error:", err);
=======
    const db       = await initDB();
    const allItems = await db.getAll(STORE_NAME);
    if (!allItems.length) return { total: 0, synced: 0 };
    let synced = 0;
    for (const item of allItems) {
      try {
        await createIncident({ type: item.type, location: item.location, mode: 'offline' });
        synced++;
        if (onProgress) onProgress({ total: allItems.length, synced });
      } catch {
        console.error('[OfflineQueue] Sync failed for item:', item);
      }
    }
    await db.clear(STORE_NAME);
    console.log('[OfflineQueue] Sync complete');
    return { total: allItems.length, synced };
  } catch (err) {
    console.error('[OfflineQueue] Sync error:', err);
>>>>>>> a076e50 (initial commit)
    return { total: 0, synced: 0 };
  }
}

<<<<<<< HEAD
export function registerNetworkListeners(onStatusChange, onProgress) {
  const handleOnline = async () => {
    onStatusChange({ online: true });
    const result = await syncQueue(onProgress);
    return result;
  };

  const handleOffline = () => {
    onStatusChange({ online: false });
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  onStatusChange({ online: navigator.onLine });

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

export async function getPendingCount() {
  try {
    const db = await initDB();
    const allItems = await db.getAll(STORE_NAME);
    return allItems.length;
  } catch (err) {
    console.error("[OfflineQueue] Count error:", err);
    return 0;
  }
} 
=======
// NOTE: This is async — OfflineBanner calls it but we expose a cached count.
let _cachedCount = 0;

export function getPendingCount() {
  // Fire-and-update pattern so the sync banner shows approximate count
  initDB()
    .then(db => db.getAll(STORE_NAME))
    .then(items => { _cachedCount = items.length; })
    .catch(() => {});
  return _cachedCount;
}

export function registerNetworkListeners(onStatusChange, onProgress) {
  const handleOnline = async () => {
    onStatusChange({ online: true });
    return syncQueue(onProgress);
  };
  const handleOffline = () => onStatusChange({ online: false });
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  onStatusChange({ online: navigator.onLine });
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
>>>>>>> a076e50 (initial commit)
