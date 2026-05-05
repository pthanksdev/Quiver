import { useState, useCallback, useRef } from 'react';

// ─── useStopwatch ────────────────────────────────────────────────────────────
export interface UseStopwatchReturn {
  elapsedMs: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}
/**
 * Precise start/stop/reset stopwatch using performance.now().
 */
export function useStopwatch(): UseStopwatchReturn {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTime = useRef<number>(0);
  const rafId = useRef<number>(0);
  const elapsedRef = useRef(0);
  elapsedRef.current = elapsedMs;

  const tick = useCallback(() => {
    setElapsedMs(performance.now() - startTime.current);
    rafId.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    startTime.current = performance.now() - elapsedRef.current;
    setIsRunning(true);
    rafId.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    setIsRunning(false);
    setElapsedMs(0);
  }, []);

  return { elapsedMs, isRunning, start, stop, reset };
}
