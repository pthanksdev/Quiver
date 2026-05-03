import { useEffect, useRef } from 'react';


// ─── useOnClickOutside ─────────────────────────────────────────────────────────
/** Detect clicks outside a target element. */
export function useOnClickOutside<T extends HTMLElement>(handler: (e: MouseEvent | TouchEvent) => void): React.RefObject<T> {
  const ref = useRef<T>(null);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handlerRef.current(e);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => { document.removeEventListener('mousedown', listener); document.removeEventListener('touchstart', listener); };
  }, []);
  return ref;
}
