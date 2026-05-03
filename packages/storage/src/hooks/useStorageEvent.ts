import { useEffect, useRef } from 'react';

const isClient = typeof window !== 'undefined';

// ─── Security helpers ────────────────────────────────────────────────────────




// ─── useStorageEvent ─────────────────────────────────────────────────────────
/**
 * Listen for cross-tab storage changes. Calls callback when another tab updates a key.
 */
export function useStorageEvent(key: string, callback: (newValue: string | null) => void): void {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => {
    if (!isClient) return;
    const handler = (e: StorageEvent) => {
      if (e.key === key) cbRef.current(e.newValue);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);
}
