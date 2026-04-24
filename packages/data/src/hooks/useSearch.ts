import { useState, useCallback, useMemo } from 'react';

// ─── useSearch ────────────────────────────────────────────────────────────────
/** Search with fuzzy match and highlight ranges. */
export function useSearch<T extends Record<string, unknown>>(data: T[], searchKeys: (keyof T)[]): {
  query: string; setQuery: (q: string) => void; results: T[];
  getHighlightRanges: (text: string) => [number, number][];
} {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(item => searchKeys.some(k => String(item[k] ?? '').toLowerCase().includes(q)));
  }, [data, query, searchKeys]);
  const getHighlightRanges = useCallback((text: string): [number, number][] => {
    if (!query) return [];
    const ranges: [number, number][] = [];
    const lower = text.toLowerCase(); const q = query.toLowerCase();
    let idx = lower.indexOf(q);
    while (idx !== -1) { ranges.push([idx, idx + q.length]); idx = lower.indexOf(q, idx + 1); }
    return ranges;
  }, [query]);
  return { query, setQuery, results, getHighlightRanges };
}
