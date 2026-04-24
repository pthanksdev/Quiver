import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useIdleDetection ─────────────────────────────────────────────────────────
/** Detect user idle state via IdleDetector API (Chrome 94+). */
export function useIdleDetection(thresholdMs = 60_000): { idle: boolean; supported: boolean } {
  const [idle, setIdle] = useState(false);
  const supported = isClient && 'IdleDetector' in window;
  useEffect(() => {
    if (!supported) return;
    let detector: { addEventListener: (e: string, cb: () => void) => void; start: (opts: { threshold: number }) => Promise<void> };
    const run = async (): Promise<void> => {
      interface WindowWithIdleDetector extends Window {
        IdleDetector?: new () => { addEventListener: (e: string, cb: () => void) => void; start: (opts: { threshold: number }) => Promise<void> };
      }
      const windowObj = window as unknown as WindowWithIdleDetector;
      if (windowObj.IdleDetector) {
        detector = new windowObj.IdleDetector();
        detector.addEventListener('change', () => setIdle(true));
        await detector.start({ threshold: thresholdMs });
      }
    };
    void run();
  }, [supported, thresholdMs]);
  return { idle, supported };
}

// Re-type LayoutShift for TypeScript
declare global { interface LayoutShift extends PerformanceEntry { value: number } }
