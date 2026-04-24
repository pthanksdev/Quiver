import { useState, useEffect } from 'react';

// ─── useMemoryPressure ────────────────────────────────────────────────────────
/** Monitor JS heap usage. Returns values in MB. */
export function useMemoryPressure(): { usedJSHeapSize: number; totalJSHeapSize: number; pressurePercent: number } | null {
  const [mem, setMem] = useState<{ usedJSHeapSize: number; totalJSHeapSize: number; pressurePercent: number } | null>(null);
  useEffect(() => {
    const api = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
    if (!api) return;
    const update = (): void => {
      const used = api.usedJSHeapSize / 1e6;
      const total = api.totalJSHeapSize / 1e6;
      setMem({ usedJSHeapSize: used, totalJSHeapSize: total, pressurePercent: total > 0 ? (used / total) * 100 : 0 });
    };
    update();
    const id = setInterval(update, 2000);
    return (): void => clearInterval(id);
  }, []);
  return mem;
}
