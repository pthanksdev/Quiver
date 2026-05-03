import { useCallback, useRef } from 'react';


// ─── useLongPress ─────────────────────────────────────────────────────────────
/** Detect a long press (hold) on any element. */
export function useLongPress(callback: () => void, ms = 500): {
  onMouseDown: () => void; onMouseUp: () => void; onTouchStart: () => void; onTouchEnd: () => void;
} {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const cbRef = useRef(callback);
  cbRef.current = callback;
  const start = useCallback(() => { timerRef.current = setTimeout(() => cbRef.current(), ms); }, [ms]);
  const stop = useCallback(() => clearTimeout(timerRef.current), []);
  return { onMouseDown: start, onMouseUp: stop, onTouchStart: start, onTouchEnd: stop };
}
