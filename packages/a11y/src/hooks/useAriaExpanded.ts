import { useState, useCallback } from 'react';


// ─── useAriaExpanded ──────────────────────────────────────────────────────────
/** Manage aria-expanded toggle state for accordions, dropdowns, etc. */
export function useAriaExpanded(initial = false): {
  expanded: boolean;
  toggle: () => void;
  buttonProps: { 'aria-expanded': boolean; onClick: () => void };
} {
  const [expanded, setExpanded] = useState(initial);
  const toggle = useCallback(() => setExpanded(e => !e), []);
  return { expanded, toggle, buttonProps: { 'aria-expanded': expanded, onClick: toggle } };
}
