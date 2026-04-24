import { useEffect, useCallback, useRef } from 'react';

// ─── useIsMounted ────────────────────────────────────────────────────────────
/**
 * Returns a ref-based guard. Call isMounted() inside async callbacks
 * to safely skip setState after unmount.
 */
export function useIsMounted(): () => boolean {
  const ref = useRef(false);
  useEffect(() => { ref.current = true; return () => { ref.current = false; }; }, []);
  return useCallback(() => ref.current, []);
}
