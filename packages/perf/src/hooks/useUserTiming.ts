import { useCallback } from 'react';

// ─── useUserTiming ────────────────────────────────────────────────────────────
/** Wrap code in performance.mark / performance.measure pairs. */
export function useUserTiming(): {
  mark: (name: string) => void;
  measure: (name: string, start: string, end: string) => PerformanceMeasure | null;
} {
  const mark = useCallback((name: string) => performance.mark(name), []);
  const measure = useCallback((name: string, start: string, end: string): PerformanceMeasure | null => {
    try { return performance.measure(name, start, end); }
    catch { return null; }
  }, []);
  return { mark, measure };
}
