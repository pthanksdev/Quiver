import { useEffect, useRef } from 'react';

// ─── useInterval ─────────────────────────────────────────────────────────────
/**
 * Declarative, clearable setInterval. Pass null as delay to pause.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
