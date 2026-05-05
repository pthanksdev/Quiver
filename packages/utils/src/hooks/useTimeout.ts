import { useEffect, useCallback, useRef } from 'react';

// ─── useTimeout ──────────────────────────────────────────────────────────────
/**
 * Declarative, clearable setTimeout.
 */
export function useTimeout(callback: () => void, delay: number): { reset: () => void; clear: () => void } {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;
  const idRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clear = useCallback(() => clearTimeout(idRef.current), []);
  const reset = useCallback(() => {
    clear();
    idRef.current = setTimeout(() => savedCallback.current(), delay);
  }, [delay, clear]);
  useEffect(() => { reset(); return clear; }, [reset, clear]);
  return { reset, clear };
}
