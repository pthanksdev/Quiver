import { useState, useCallback } from 'react';

// ─── useToggle ───────────────────────────────────────────────────────────────
export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}
/**
 * Boolean state with toggle/set helpers.
 * @param initial - Initial boolean value (default: false)
 */
export function useToggle(initial = false): UseToggleReturn {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v: boolean) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse };
}
