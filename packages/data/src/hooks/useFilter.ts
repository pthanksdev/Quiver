import { useState, useCallback, useMemo } from 'react';

// ─── useFilter ────────────────────────────────────────────────────────────────
/** Multi-field filter predicate builder. */
export function useFilter<T extends Record<string, unknown>>(data: T[]): {
  filters: Partial<Record<keyof T, unknown>>;
  filtered: T[];
  setFilter: (key: keyof T, value: unknown) => void;
  clearFilter: (key: keyof T) => void;
  clearAll: () => void;
} {
  const [filters, setFilters] = useState<Partial<Record<keyof T, unknown>>>({});
  const setFilter = useCallback((key: keyof T, value: unknown) => setFilters(f => ({ ...f, [key]: value })), []);
  const clearFilter = useCallback((key: keyof T) => setFilters(f => { const n = { ...f }; delete n[key]; return n; }), []);
  const clearAll = useCallback(() => setFilters({}), []);
  const filtered = useMemo(() =>
    data.filter(item => Object.entries(filters).every(([k, v]) => v === undefined || v === '' || String(item[k]).toLowerCase().includes(String(v).toLowerCase()))),
    [data, filters]
  );
  return { filters, filtered, setFilter, clearFilter, clearAll };
}
