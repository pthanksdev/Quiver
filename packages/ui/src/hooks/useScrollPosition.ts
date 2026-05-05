import { useState, useEffect } from 'react';


// ─── useScrollPosition ────────────────────────────────────────────────────────
/** Track window scroll position. */
export function useScrollPosition(): { x: number; y: number } {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = () => setPos({ x: window.scrollX, y: window.scrollY });
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return pos;
}
