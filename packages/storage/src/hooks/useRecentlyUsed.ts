import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';


// ─── Security helpers ────────────────────────────────────────────────────────
const ALLOWED_KEY_RE = /^[a-zA-Z0-9_-]+$/;
const STORAGE_MAX_BYTES = 5 * 1024 * 1024;

function validateKey(key: string, hook: string): void {
  if (!key || typeof key !== 'string') throw new TypeError(`[${hook}] key must be a non-empty string`);
  if (!ALLOWED_KEY_RE.test(key)) throw new Error(`[${hook}] Invalid storage key. Only [a-zA-Z0-9_-] (1-128 chars) allowed.`);
}



// ─── useRecentlyUsed ─────────────────────────────────────────────────────────
/**
 * Maintain a Most-Recently-Used list persisted to localStorage.
 * @param key - Storage key
 * @param maxSize - Maximum list size (default: 10)
 */
export function useRecentlyUsed<T>(key: string, maxSize = 10): [T[], (item: T) => void, () => void] {
  validateKey(key, 'useRecentlyUsed');
  const [items, setItems] = useLocalStorage<T[]>(key, []);
  const add = useCallback((item: T) => {
    setItems(prev => {
      const filtered = (prev ?? []).filter(i => JSON.stringify(i) !== JSON.stringify(item));
      return [item, ...filtered].slice(0, maxSize);
    });
  }, [setItems, maxSize]);
  const clear = useCallback(() => setItems([]), [setItems]);
  return [items ?? [], add, clear];
}
