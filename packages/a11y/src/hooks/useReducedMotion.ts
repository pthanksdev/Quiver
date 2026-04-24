import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useReducedMotion ─────────────────────────────────────────────────────────
/** Detect prefers-reduced-motion. Returns true if user prefers reduced motion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    isClient ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  useEffect(() => {
    if (!isClient) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}
