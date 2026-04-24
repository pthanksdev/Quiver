import { useState, useEffect, useRef } from 'react';

// ─── useRenderTime ────────────────────────────────────────────────────────────
/** Measure time between renders in milliseconds. */
export function useRenderTime(): number {
  const lastRender = useRef(performance.now());
  const [delta, setDelta] = useState(0);
  useEffect(() => {
    const now = performance.now();
    setDelta(now - lastRender.current);
    lastRender.current = now;
  }, []);
  return delta;
}
