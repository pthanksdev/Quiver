import { useState, useCallback } from 'react';

// ─── Security helpers ────────────────────────────────────────────────────────


// ─── useSmartRetry ──────────────────────────────────────────────────────────
/**
 * Execute an async fn with exponential backoff + jitter on failure.
 * @param fn - Async function to retry
 * @param maxRetries - Maximum retry attempts (default: 3)
 * @param baseDelayMs - Base delay in ms (default: 500)
 */
export function useSmartRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 500
): { execute: () => Promise<void>; data: T | null; error: Error | null; loading: boolean; attempt: number } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const execute = useCallback(async () => {
    setLoading(true); setError(null);
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await fn();
        setData(result); setAttempt(i);
        break;
      } catch (e) {
        setAttempt(i);
        if (i === maxRetries) { setError(e as Error); break; }
        const jitter = Math.random() * baseDelayMs;
        await new Promise(r => setTimeout(r, baseDelayMs * 2 ** i + jitter));
      }
    }
    setLoading(false);
  }, [fn, maxRetries, baseDelayMs]);

  return { execute, data, error, loading, attempt };
}
