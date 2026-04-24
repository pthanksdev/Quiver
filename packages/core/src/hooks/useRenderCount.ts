import { useRef } from 'react';

// ─── useRenderCount ──────────────────────────────────────────────────────────
/**
 * Returns the number of times this component has rendered.
 */
export function useRenderCount(): number {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}
