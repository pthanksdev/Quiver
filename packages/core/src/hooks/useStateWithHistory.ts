import { useState, useCallback, useRef } from 'react';

// ─── useStateWithHistory ─────────────────────────────────────────────────────
/**
 * Time-travel through state. Returns current value and the full history array.
 */
export function useStateWithHistory<T>(initial: T): {
  value: T;
  setValue: (v: T) => void;
  history: T[];
  pointer: number;
  back: () => void;
  forward: () => void;
} {
  const [history, setHistory] = useState<T[]>([initial]);
  const [pointer, setPointer] = useState(0);
  const pointerRef = useRef(pointer);
  pointerRef.current = pointer;
  const value = history[pointer] as T;

  const setValue = useCallback((v: T) => {
    const p = pointerRef.current;
    setHistory((h: T[]) => [...h.slice(0, p + 1), v]);
    setPointer((prev: number) => prev + 1);
  }, []);

  const back = useCallback(() => setPointer((p: number) => Math.max(0, p - 1)), []);
  const forward = useCallback(() => setPointer((p: number) => Math.min(history.length - 1, p + 1)), [history.length]);
  return { value, setValue, history, pointer, back, forward };
}
