import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useLongTask ──────────────────────────────────────────────────────────────
/** Detect blocking long tasks via PerformanceObserver. */
export function useLongTask(): { longTaskCount: number; lastDuration: number | null } {
  const [count, setCount] = useState(0);
  const [lastDuration, setLastDuration] = useState<number | null>(null);
  useEffect(() => {
    if (!isClient || !('PerformanceObserver' in window)) return;
    let po: PerformanceObserver;
    try {
      po = new PerformanceObserver(list => {
        list.getEntries().forEach(e => { setCount(c => c + 1); setLastDuration(e.duration); });
      });
      po.observe({ type: 'longtask', buffered: true });
    } catch { /* not supported */ }
    return (): void => po?.disconnect();
  }, []);
  return { longTaskCount: count, lastDuration };
}
