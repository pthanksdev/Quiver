import { useState, useCallback, useRef } from 'react';


// ─── useRateLimit ─────────────────────────────────────────────────────────────
/**
 * Client-side rate limiter. Returns a wrapped callback that rejects if called
 * more than `limit` times per `windowMs` using performance.now() — immune to Date manipulation.
 */
export function useRateLimit<T extends unknown[]>(
  callback: (...args: T) => void,
  limit: number,
  windowMs: number
): { limited: (...args: T) => void; isBlocked: boolean } {
  const times = useRef<number[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);

  const limited = useCallback((...args: T) => {
    const now = performance.now();
    times.current = times.current.filter(t => now - t < windowMs);
    if (times.current.length >= limit) { setIsBlocked(true); return; }
    times.current.push(now);
    setIsBlocked(false);
    callback(...args);
  }, [callback, limit, windowMs]);

  return { limited, isBlocked };
}
