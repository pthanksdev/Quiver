import { useState, useEffect, useRef } from 'react';

// ─── Security helpers ────────────────────────────────────────────────────────


// ─── usePolling ──────────────────────────────────────────────────────────────
/**
 * Re-execute an async function on a fixed interval.
 * @param fn - Async function returning T
 * @param intervalMs - Polling interval in milliseconds
 * @param enabled - Set to false to pause polling
 */
export function usePolling<T>(fn: () => Promise<T>, intervalMs: number, enabled = true): {
  data: T | null; error: Error | null; loading: boolean;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const tick = async () => {
      setLoading(true);
      try { const r = await fnRef.current(); if (!cancelled) setData(r); }
      catch (e) { if (!cancelled) setError(e as Error); }
      finally { if (!cancelled) setLoading(false); }
    };
    void tick();
    const id = setInterval(() => void tick(), intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [intervalMs, enabled]);

  return { data, error, loading };
}
