import { useEffect, useCallback, useRef } from 'react';


// ─── useARIALive ──────────────────────────────────────────────────────────────
/** Fine-grained control of aria-live regions. Returns a ref to attach to the live region. */
export function useARIALive(politeness: 'off' | 'polite' | 'assertive' = 'polite'): {
  ref: React.RefObject<HTMLElement>;
  update: (text: string) => void;
} {
  const ref = useRef<HTMLElement>(null);
  const update = useCallback((text: string) => {
    if (!ref.current) return;
    ref.current.textContent = '';
    requestAnimationFrame(() => { if (ref.current) ref.current.textContent = text; });
  }, []);
  useEffect(() => { if (ref.current) ref.current.setAttribute('aria-live', politeness); }, [politeness]);
  return { ref, update };
}
