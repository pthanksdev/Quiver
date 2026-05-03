import { useState, useEffect, useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── Security helpers ────────────────────────────────────────────────────────
const ALLOWED_KEY_RE = /^[a-zA-Z0-9_-]+$/;
const STORAGE_MAX_BYTES = 5 * 1024 * 1024;

function validateKey(key: string, hook: string): void {
  if (!key || typeof key !== 'string') throw new TypeError(`[${hook}] key must be a non-empty string`);
  if (!ALLOWED_KEY_RE.test(key)) throw new Error(`[${hook}] Invalid storage key. Only [a-zA-Z0-9_-] (1-128 chars) allowed.`);
}

function safeSerialize<T>(value: T, hook: string): string {
  try {
    const serialized = JSON.stringify(value);
    if (new Blob([serialized]).size > STORAGE_MAX_BYTES) {
      throw new Error(`[${hook}] Value exceeds maximum storage size of 5MB`);
    }
    return serialized;
  } catch (err) {
    throw new Error(`[${hook}] Failed to serialize value: ${String(err)}`);
  }
}

function safeDeserialize<T>(raw: string | null, fallback: T, hook: string): T {
  if (raw === null) return fallback;
  try { return JSON.parse(raw) as T; }
  catch { console.error(`[${hook}] Failed to parse stored value, returning fallback.`); return fallback; }
}

// ─── useLocalStorage ─────────────────────────────────────────────────────────
/**
 * Reactive state synced with localStorage. SSR-safe.
 * @param key - Storage key (alphanumeric/_/- only)
 * @param initialValue - Fallback when key not found
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  validateKey(key, 'useLocalStorage');
  const [stored, setStored] = useState<T>(() => {
    if (!isClient) return initialValue;
    return safeDeserialize(localStorage.getItem(key), initialValue, 'useLocalStorage');
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStored(prev => {
      const next = value instanceof Function ? value(prev) : value;
      if (isClient) {
        try { localStorage.setItem(key, safeSerialize(next, 'useLocalStorage')); }
        catch (e) { console.error('[useLocalStorage] Write failed:', e); }
      }
      return next;
    });
  }, [key]);

  const remove = useCallback(() => {
    if (isClient) localStorage.removeItem(key);
    setStored(initialValue);
  }, [key, initialValue]);

  // Cross-tab sync
  useEffect(() => {
    if (!isClient) return;
    const handler = (e: StorageEvent) => {
      if (e.key === key) setStored(safeDeserialize(e.newValue, initialValue, 'useLocalStorage'));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, initialValue]);

  return [stored, setValue, remove];
}
