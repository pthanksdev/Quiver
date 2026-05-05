import { useState, useEffect, useRef } from 'react';

// ─── useThrottle ─────────────────────────────────────────────────────────────
/**
 * Returns a throttled value — only updates at most once per `limit` ms.
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttled, setThrottled] = useState<T>(value);
  const lastRan = useRef(Date.now());
  useEffect(() => {
    const elapsed = Date.now() - lastRan.current;
    if (elapsed >= limit) { setThrottled(value); lastRan.current = Date.now(); }
    else {
      const id = setTimeout(() => { setThrottled(value); lastRan.current = Date.now(); }, limit - elapsed);
      return () => clearTimeout(id);
    }
  }, [value, limit]);
  return throttled;
}
