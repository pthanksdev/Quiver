import { useState, useCallback, useMemo } from 'react';

// ─── useRowSelection ──────────────────────────────────────────────────────────
/** Single and multi-row selection with keyboard support. */
export function useRowSelection<T>(items: T[], getKey: (item: T) => string): {
  selectedKeys: Set<string>; isSelected: (item: T) => boolean;
  toggle: (item: T) => void; selectAll: () => void; clearAll: () => void;
  selectedItems: T[];
} {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const toggle = useCallback((item: T) => {
    const key = getKey(item);
    setSelectedKeys(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  }, [getKey]);
  const selectAll = useCallback(() => setSelectedKeys(new Set(items.map(getKey))), [items, getKey]);
  const clearAll = useCallback(() => setSelectedKeys(new Set()), []);
  const isSelected = useCallback((item: T) => selectedKeys.has(getKey(item)), [selectedKeys, getKey]);
  const selectedItems = useMemo(() => items.filter(i => selectedKeys.has(getKey(i))), [items, selectedKeys, getKey]);
  return { selectedKeys, isSelected, toggle, selectAll, clearAll, selectedItems };
}
