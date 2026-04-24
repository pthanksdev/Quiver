import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useForcedColors ──────────────────────────────────────────────────────────
/** Detect forced-colors mode (Windows High Contrast). */
export function useForcedColors(): boolean {
  const [forced, setForced] = useState(() =>
    isClient ? window.matchMedia('(forced-colors: active)').matches : false
  );
  useEffect(() => {
    if (!isClient) return;
    const mq = window.matchMedia('(forced-colors: active)');
    const handler = (e: MediaQueryListEvent) => setForced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return forced;
}
