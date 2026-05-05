import { useState, useEffect, useRef } from 'react';


// ─── useSticky ────────────────────────────────────────────────────────────────
/** Detect when an element enters its sticky position. */
export function useSticky(): { ref: React.RefObject<HTMLElement>; isSticky: boolean } {
  const ref = useRef<HTMLElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky((e?.intersectionRatio ?? 1) < 1),
      { threshold: [1], rootMargin: '-1px 0px 0px 0px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isSticky };
}
