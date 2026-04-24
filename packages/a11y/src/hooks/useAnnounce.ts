import { useEffect, useCallback, useRef } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useAnnounce ──────────────────────────────────────────────────────────────
/**
 * Programmatically announce messages to screen readers via aria-live.
 */
export function useAnnounce(): { announce: (message: string, politeness?: 'polite' | 'assertive') => void } {
  const regionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isClient) return;
    const div = document.createElement('div');
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('aria-atomic', 'true');
    Object.assign(div.style, { position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' });
    document.body.appendChild(div);
    regionRef.current = div;
    return () => { document.body.removeChild(div); };
  }, []);
  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (!regionRef.current) return;
    regionRef.current.setAttribute('aria-live', politeness);
    regionRef.current.textContent = '';
    requestAnimationFrame(() => { if (regionRef.current) regionRef.current.textContent = message; });
  }, []);
  return { announce };
}
