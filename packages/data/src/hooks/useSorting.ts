import { useState, useCallback, useMemo } from 'react';

// ─── useSorting ───────────────────────────────────────────────────────────────
export type SortDirection = 'asc' | 'desc';
export interface UseSortingReturn<T> {
  sortKey: keyof T | null; direction: SortDirection;
  sorted: T[]; setSort: (key: keyof T) => void; clearSort: () => void;
}
/** Sort state with toggling direction. */
export function useSorting<T extends Record<string, unknown>>(data: T[]): UseSortingReturn<T> {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [direction, setDirection] = useState<SortDirection>('asc');
  const setSort = useCallback((key: keyof T) => {
    setSortKey(prev => { if (prev === key) setDirection(d => d === 'asc' ? 'desc' : 'asc'); else setDirection('asc'); return key; });
  }, []);
  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, direction]);
  const clearSort = useCallback(() => setSortKey(null), []);
  return { sortKey, direction, sorted, setSort, clearSort };
}
