import { useState, useEffect, useRef } from 'react';


// ─── useParallax ──────────────────────────────────────────────────────────────
/** Scroll-based parallax offset. Returns translateY offset value in px. */
export function useParallax(speed = 0.5): { ref: React.RefObject<HTMLElement>; offsetY: number } {
  const ref = useRef<HTMLElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setOffsetY((window.scrollY - rect.top) * speed);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [speed]);
  return { ref, offsetY };
}
