import { useState, useEffect, useRef } from 'react';


// ─── useIntersectionObserver ───────────────────────────────────────────────────
/** Viewport visibility detection. */
export function useIntersectionObserver(options?: IntersectionObserverInit): {
  ref: React.RefObject<HTMLElement>; isVisible: boolean; entry: IntersectionObserverEntry | null;
} {
  const ref = useRef<HTMLElement>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([e]) => setEntry(e ?? null), options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);
  return { ref, isVisible: entry?.isIntersecting ?? false, entry };
}
