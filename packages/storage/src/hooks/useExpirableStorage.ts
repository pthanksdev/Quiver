import { useState, useCallback } from 'react';

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

// ─── useExpirableStorage ─────────────────────────────────────────────────────
interface ExpiryEnvelope<T> { value: T; expiresAt: number }
/**
 * localStorage with TTL expiration. Returns null if key is expired.
 * @param key - Storage key
 * @param ttlMs - Time to live in milliseconds
 */
export function useExpirableStorage<T>(key: string, ttlMs: number): [T | null, (v: T) => void] {
  validateKey(key, 'useExpirableStorage');
  const [value, setValue] = useState<T | null>(() => {
    if (!isClient) return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const envelope = safeDeserialize<ExpiryEnvelope<T> | null>(raw, null, 'useExpirableStorage');
    if (!envelope || Date.now() > envelope.expiresAt) { localStorage.removeItem(key); return null; }
    return envelope.value;
  });
  const store = useCallback((v: T) => {
    const envelope: ExpiryEnvelope<T> = { value: v, expiresAt: Date.now() + ttlMs };
    if (isClient) localStorage.setItem(key, safeSerialize(envelope, 'useExpirableStorage'));
    setValue(v);
  }, [key, ttlMs]);
  return [value ?? null, store];
}
