import { useEffect, useRef } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useEventListener ─────────────────────────────────────────────────────────
/** Type-safe addEventListener abstraction with automatic cleanup. */
export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  target: EventTarget | null = isClient ? window : null
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  useEffect(() => {
    if (!target) return;
    const listener = (e: Event) => handlerRef.current(e as WindowEventMap[K]);
    target.addEventListener(event, listener);
    return () => target.removeEventListener(event, listener);
  }, [event, target]);
}
