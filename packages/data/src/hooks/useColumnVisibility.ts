import { useState, useCallback } from 'react';

// ─── useColumnVisibility ──────────────────────────────────────────────────────
/** Show/hide columns with persistence to localStorage. */
export function useColumnVisibility<T extends string>(columns: T[], storageKey?: string): {
  visible: Set<T>; toggle: (col: T) => void; showAll: () => void; hideAll: () => void; isVisible: (col: T) => boolean;
} {
  const load = (): Set<T> => {
    if (!storageKey) return new Set(columns);
    try { const raw = localStorage.getItem(storageKey); return raw ? new Set(JSON.parse(raw) as T[]) : new Set(columns); }
    catch { return new Set(columns); }
  };
  const [visible, setVisible] = useState<Set<T>>(load);
  const persist = (next: Set<T>) => { if (storageKey) localStorage.setItem(storageKey, JSON.stringify([...next])); };
  const toggle = useCallback((col: T) => setVisible(prev => { const n = new Set(prev); n.has(col) ? n.delete(col) : n.add(col); persist(n); return n; }), []);
  const showAll = useCallback(() => { const n = new Set(columns); persist(n); setVisible(n); }, [columns]);
  const hideAll = useCallback(() => { const n = new Set<T>(); persist(n); setVisible(n); }, []);
  const isVisible = useCallback((col: T) => visible.has(col), [visible]);
  return { visible, toggle, showAll, hideAll, isVisible };
}
