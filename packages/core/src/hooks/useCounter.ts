import { useState, useCallback } from 'react';

// ─── useCounter ──────────────────────────────────────────────────────────────
export interface UseCounterOptions { min?: number; max?: number; step?: number }
export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (n: number) => void;
}
/**
 * Numeric counter state with increment, decrement, reset, and clamp.
 */
export function useCounter(initial = 0, options: UseCounterOptions = {}): UseCounterReturn {
  const { min = -Infinity, max = Infinity, step = 1 } = options;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const [count, setCount] = useState(() => clamp(initial));
  const increment = useCallback(() => setCount((c: number) => clamp(c + step)), [max, min, step]); // eslint-disable-line react-hooks/exhaustive-deps
  const decrement = useCallback(() => setCount((c: number) => clamp(c - step)), [max, min, step]); // eslint-disable-line react-hooks/exhaustive-deps
  const reset = useCallback(() => setCount(clamp(initial)), [initial]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = useCallback((n: number) => setCount(clamp(n)), [min, max]); // eslint-disable-line react-hooks/exhaustive-deps
  return { count, increment, decrement, reset, set };
}
