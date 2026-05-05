import { useState, useEffect } from 'react';

// ─── useDebounce ─────────────────────────────────────────────────────────────
/**
 * Returns a debounced version of the value that only updates after `delay` ms of inactivity.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debouncedValue;
}
