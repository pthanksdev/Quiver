import { useState, useEffect, useRef } from 'react';

// ─── useFPS ───────────────────────────────────────────────────────────────────
/** Compute frames-per-second using requestAnimationFrame. */
export function useFPS(): number {
  const [fps, setFps] = useState(0);
  const lastTime = useRef(performance.now());
  const frameCount = useRef(0);
  useEffect(() => {
    let rafId: number;
    const tick = (): void => {
      frameCount.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        setFps(Math.round(frameCount.current * 1000 / (now - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return (): void => cancelAnimationFrame(rafId);
  }, []);
  return fps;
}
