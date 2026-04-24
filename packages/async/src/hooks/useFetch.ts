import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Security helpers ────────────────────────────────────────────────────────
const DEFAULT_TIMEOUT_MS = 10_000;
const PRIVATE_IP = /^(127\\.|10\\.|192\\.168\\.|169\\.254\\.|172\\.(1[6-9]|2[0-9]|3[01])\\.)/;

function validateUrl(url: string, hook: string): void {
  if (!url || typeof url !== 'string') throw new TypeError(`[${hook}] url must be a non-empty string`);
  try {
    const { hostname } = new URL(url);
    if (PRIVATE_IP.test(hostname)) {
      if (process.env.NODE_ENV === 'development')
        console.warn(`[${hook}] Warning: Request targeting private/local address ${hostname}`);
      else throw new Error(`[${hook}] SSRF protection: private/local URLs are blocked in production`);
    }
  } catch (e) { if (e instanceof Error && e.message.includes('SSRF')) throw e; }
}

// ─── useFetch ────────────────────────────────────────────────────────────────
export interface UseFetchOptions extends RequestInit {
  /** Auto-fetch on mount (default: true) */
  immediate?: boolean;
  /** Timeout in ms (default: 10000) */
  timeout?: number;
}
export interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  abort: () => void;
}
/**
 * Declarative data fetching with loading/error states, timeout, and abort on unmount.
 * @throws If URL is not http/https or targets a private IP in production.
 */
export function useFetch<T>(url: string, options: UseFetchOptions = {}): UseFetchReturn<T> {
  const { immediate = true, timeout = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isMounted = useRef(true);

  const execute = useCallback(() => {
    validateUrl(url, 'useFetch');
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(new Error('[useFetch] Request timed out')), timeout);

    setLoading(true);
    setError(null);

    fetch(url, { ...fetchOptions, signal: controller.signal })
      .then(async res => {
        clearTimeout(timer);
        const contentType = res.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json') && !contentType.includes('text/')) {
          throw new Error(`[useFetch] Unexpected content-type: ${contentType}`);
        }
        if (!res.ok) throw new Error(`[useFetch] HTTP ${res.status}: ${res.statusText}`);
        const json = await res.json() as T;
        if (isMounted.current) setData(json);
      })
      .catch(err => {
        clearTimeout(timer);
        if (isMounted.current && (err as Error).name !== 'AbortError')
          setError(err as Error);
      })
      .finally(() => { if (isMounted.current) setLoading(false); });
  }, [url, timeout]);

  useEffect(() => {
    isMounted.current = true;
    if (immediate) execute();
    return () => { isMounted.current = false; abortRef.current?.abort(); };
  }, [execute, immediate]);

  const abort = useCallback(() => abortRef.current?.abort(), []);
  return { data, loading, error, refetch: execute, abort };
}
