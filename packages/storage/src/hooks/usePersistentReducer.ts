import { useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';


// ─── Security helpers ────────────────────────────────────────────────────────
const ALLOWED_KEY_RE = /^[a-zA-Z0-9_-]+$/;
const STORAGE_MAX_BYTES = 5 * 1024 * 1024;

function validateKey(key: string, hook: string): void {
  if (!key || typeof key !== 'string') throw new TypeError(`[${hook}] key must be a non-empty string`);
  if (!ALLOWED_KEY_RE.test(key)) throw new Error(`[${hook}] Invalid storage key. Only [a-zA-Z0-9_-] (1-128 chars) allowed.`);
}



// ─── usePersistentReducer ────────────────────────────────────────────────────
/**
 * useReducer with automatic localStorage persistence.
 * State is loaded from localStorage on mount and persisted after every dispatch.
 */
export function usePersistentReducer<S, A>(
  key: string,
  reducer: (state: S, action: A) => S,
  initialState: S
): [S, (action: A) => void] {
  validateKey(key, 'usePersistentReducer');
  const [state, setState] = useLocalStorage<S>(key, initialState);
  const reducerRef = useRef(reducer);
  reducerRef.current = reducer;
  const dispatch = useCallback((action: A) => {
    setState(prev => reducerRef.current(prev, action));
  }, [setState]);
  return [state, dispatch];
}
