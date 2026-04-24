import { useState, useCallback } from 'react';


// ─── useCheckboxGroup ─────────────────────────────────────────────────────────
/** Multi-select checkbox state management. */
export function useCheckboxGroup<T>(options: T[]): {
  checked: Set<T>; toggle: (item: T) => void; checkAll: () => void; uncheckAll: () => void;
  isChecked: (item: T) => boolean; isAllChecked: boolean; isIndeterminate: boolean;
} {
  const [checked, setChecked] = useState<Set<T>>(new Set());
  const toggle = useCallback((item: T) => setChecked(prev => { const n = new Set(prev); n.has(item) ? n.delete(item) : n.add(item); return n; }), []);
  const checkAll = useCallback(() => setChecked(new Set(options)), [options]);
  const uncheckAll = useCallback(() => setChecked(new Set()), []);
  const isChecked = useCallback((item: T) => checked.has(item), [checked]);
  return { checked, toggle, checkAll, uncheckAll, isChecked, isAllChecked: checked.size === options.length, isIndeterminate: checked.size > 0 && checked.size < options.length };
}
