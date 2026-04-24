import { useState, useCallback, useRef, useEffect } from 'react';


// ─── useFormAutosave ──────────────────────────────────────────────────────────
/**
 * Auto-save form values to localStorage after `debounceMs` of inactivity.
 */
export function useFormAutosave<T>(values: T, storageKey: string, debounceMs = 1000): { hasSaved: boolean; restore: () => T | null } {
  const [hasSaved, setHasSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(values));
      setHasSaved(true);
    }, debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [values, storageKey, debounceMs]);
  const restore = useCallback((): T | null => {
    try { const raw = localStorage.getItem(storageKey); return raw ? JSON.parse(raw) as T : null; }
    catch { return null; }
  }, [storageKey]);
  return { hasSaved, restore };
}
