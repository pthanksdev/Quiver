import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── Security helpers ────────────────────────────────────────────────────────




// ─── useStorageQuota ─────────────────────────────────────────────────────────
export interface StorageQuotaInfo { usage: number; quota: number; percent: number }
/**
 * Track current storage usage vs. quota using the StorageManager API.
 */
export function useStorageQuota(): StorageQuotaInfo | null {
  const [info, setInfo] = useState<StorageQuotaInfo | null>(null);
  useEffect(() => {
    if (!isClient || !navigator.storage?.estimate) return;
    void navigator.storage.estimate().then(({ usage = 0, quota = 0 }) => {
      setInfo({ usage, quota, percent: quota > 0 ? (usage / quota) * 100 : 0 });
    });
  }, []);
  return info;
}
