import { useEffect, useRef } from 'react';


// ─── useMutationObserver ──────────────────────────────────────────────────────
/** Watch DOM subtree mutations on a target element. */
export function useMutationObserver(
  callback: MutationCallback,
  options: MutationObserverInit
): React.RefObject<HTMLElement> {
  const ref = useRef<HTMLElement>(null);
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => {
    if (!ref.current) return;
    const observer = new MutationObserver((...args) => cbRef.current(...args));
    observer.observe(ref.current, options);
    return () => observer.disconnect();
  }, [options]);
  return ref;
}
