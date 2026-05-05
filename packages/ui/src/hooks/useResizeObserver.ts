import { useState, useEffect, useRef } from 'react';


// ─── useResizeObserver ─────────────────────────────────────────────────────────
/** Track element dimension changes. */
export function useResizeObserver(): { ref: React.RefObject<HTMLElement>; width: number; height: number } {
  const ref = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([e]) => {
      if (e) setSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, ...size };
}
