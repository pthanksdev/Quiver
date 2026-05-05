import { useRef } from 'react';

// ─── useConstant ─────────────────────────────────────────────────────────────
/**
 * Initialize a value once and never recompute it.
 */
export function useConstant<T>(init: () => T): T {
  const ref = useRef<{ value: T } | undefined>(undefined);
  if (!ref.current) ref.current = { value: init() };
  return ref.current.value;
}
