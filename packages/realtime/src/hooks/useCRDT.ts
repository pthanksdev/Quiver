import { useState, useCallback } from 'react';


// ─── useCRDT ──────────────────────────────────────────────────────────────────
/**
 * A Grow-only Set CRDT for conflict-free concurrent editing.
 * Merges states from multiple peers without conflicts.
 */
export function useCRDT<T>(): {
  items: Set<T>;
  add: (item: T) => void;
  merge: (remoteItems: T[]) => void;
  toArray: () => T[];
} {
  const [items, setItems] = useState<Set<T>>(new Set());
  const add = useCallback((item: T) => setItems(prev => new Set([...prev, item])), []);
  const merge = useCallback((remoteItems: T[]) => setItems(prev => new Set([...prev, ...remoteItems])), []);
  const toArray = useCallback(() => [...items], [items]);
  return { items, add, merge, toArray };
}
