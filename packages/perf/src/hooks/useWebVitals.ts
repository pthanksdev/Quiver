import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useWebVitals ───────────────────────────────────────────────────
/**
 * Listen to Web Vitals: LCP, FID, CLS, INP via PerformanceObserver.
 */
export function useWebVitals(): { lcp: number | null; cls: number | null; inp: number | null } {
  const [lcp, setLcp] = useState<number | null>(null);
  const [cls, setCls] = useState<number | null>(null);
  const [inp, setInp] = useState<number | null>(null);
  useEffect(() => {
    if (!isClient || !('PerformanceObserver' in window)) return;
    const observers: PerformanceObserver[] = [];
    const tryObserve = (types: string[], cb: PerformanceObserverCallback): void => {
      try { const po = new PerformanceObserver(cb); po.observe({ type: types[0]!, buffered: true }); observers.push(po); }
      catch { /* type not supported */ }
    };
    tryObserve(['largest-contentful-paint'], (list) => { const e = list.getEntries().pop(); if (e) setLcp(e.startTime); });
    tryObserve(['layout-shift'], (list) => { setCls(prev => (prev ?? 0) + list.getEntries().reduce((sum, e) => sum + ((e as LayoutShift).value ?? 0), 0)); });
    tryObserve(['event'], (list) => { list.getEntries().forEach(e => { if (e.duration > 0) setInp(e.duration); }); });
    return (): void => observers.forEach(o => o.disconnect());
  }, []);
  return { lcp, cls, inp };
}
