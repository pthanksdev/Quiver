import { useEffect, useRef } from 'react';

// ─── useIdleCallback ─────────────────────────────────────────────────────────
/**
 * Schedule work during browser idle time via requestIdleCallback.
 * Falls back to immediate execution if API is unavailable.
 */
export function useIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): void {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('requestIdleCallback' in window)) {
      cbRef.current({ didTimeout: true, timeRemaining: () => 0 });
      return;
    }
    const id = requestIdleCallback((deadline) => cbRef.current(deadline), options);
    return () => cancelIdleCallback(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
