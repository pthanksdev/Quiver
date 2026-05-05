import { useRef } from 'react';

// ─── useRandomId ─────────────────────────────────────────────────────────────
/**
 * Generate a stable, unique ID per component instance. Uses crypto.randomUUID when available.
 */
export function useRandomId(prefix = 'quiver'): string {
  const id = useRef(
    `${prefix}-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 9)}`
  );
  return id.current;
}
