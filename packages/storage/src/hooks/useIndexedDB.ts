import { useState, useEffect, useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── Security helpers ────────────────────────────────────────────────────────




// ─── useIndexedDB ────────────────────────────────────────────────────────────
export interface UseIndexedDBReturn<T> {
  value: T | null;
  set: (v: T) => Promise<void>;
  remove: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}
/**
 * Reactive async key-value store backed by IndexedDB. SSR-safe.
 */
export function useIndexedDB<T>(dbName: string, storeName: string, key: string): UseIndexedDBReturn<T> {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(storeName))
          req.result.createObjectStore(storeName);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }, [dbName, storeName]);

  useEffect(() => {
    if (!isClient) { setLoading(false); return; }
    openDB().then(db => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => { setValue(req.result as T ?? null); setLoading(false); };
      req.onerror = () => { setError(req.error); setLoading(false); };
    }).catch(e => { setError(e as Error); setLoading(false); });
  }, [key, openDB, storeName]);

  const set = useCallback(async (v: T) => {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).put(v, key);
      req.onsuccess = () => { setValue(v); resolve(); };
      req.onerror = () => reject(req.error);
    });
  }, [key, openDB, storeName]);

  const remove = useCallback(async () => {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).delete(key);
      req.onsuccess = () => { setValue(null); resolve(); };
      req.onerror = () => reject(req.error);
    });
  }, [key, openDB, storeName]);

  return { value, set, remove, loading, error };
}
