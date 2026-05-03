import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useMediaQuery ─────────────────────────────────────────────────────────────
/** Reactive matchMedia — e.g. dark mode, breakpoints. SSR-safe. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => isClient ? window.matchMedia(query).matches : false);
  useEffect(() => {
    if (!isClient) return;
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}
