import { useState, useCallback, useRef } from 'react';

// ─── useUndoable ─────────────────────────────────────────────────────────────
export interface UseUndoableReturn<T> {
  state: T;
  set: (value: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: T[];
}
/**
 * Full undo/redo history for any state value.
 * @param initial - Initial state value.
 * @param maxHistory - Maximum history size (default: 100)
 */
export function useUndoable<T>(initial: T, maxHistory = 100): UseUndoableReturn<T> {
  const [history, setHistory] = useState<T[]>([initial]);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;
  const state = history[index] as T;

  const set = useCallback((value: T) => {
    const currentIndex = indexRef.current;
    setHistory((h: T[]) => {
      const newHistory = [...h.slice(0, currentIndex + 1), value].slice(-maxHistory);
      return newHistory;
    });
    setIndex((i: number) => Math.min(i + 1, maxHistory - 1));
  }, [maxHistory]);

  const undo = useCallback(() => setIndex((i: number) => Math.max(0, i - 1)), []);
  const redo = useCallback(() => setIndex((i: number) => Math.min(history.length - 1, i + 1)), [history.length]);
  return { state, set, undo, redo, canUndo: index > 0, canRedo: index < history.length - 1, history };
}
