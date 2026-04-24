import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Security helpers ────────────────────────────────────────────────────────


// ─── useAsync ────────────────────────────────────────────────────────────────
export interface UseAsyncReturn<T> {
  execute: (...args: unknown[]) => Promise<void>;
  data: T | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}
/**
 * Run any async function with automatic status tracking.
 */
export function useAsync<T>(fn: (...args: unknown[]) => Promise<T>): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  useEffect(() => () => { isMounted.current = false; }, []);

  const execute = useCallback(async (...args: unknown[]) => {
    setLoading(true); setError(null);
    try {
      const result = await fn(...args);
      if (isMounted.current) setData(result);
    } catch (e) {
      if (isMounted.current) setError(e as Error);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [fn]);

  const reset = useCallback(() => { setData(null); setError(null); setLoading(false); }, []);
  return { execute, data, loading, error, reset };
}
