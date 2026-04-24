import { useState, useCallback } from 'react';


// ─── useFieldArray ───────────────────────────────────────────────────────────
/**
 * Dynamic list of form fields (add/remove/move operations).
 */
export function useFieldArray<T>(initial: T[]): {
  fields: T[]; append: (item: T) => void; prepend: (item: T) => void;
  remove: (index: number) => void; move: (from: number, to: number) => void;
  update: (index: number, item: T) => void; replace: (items: T[]) => void;
} {
  const [fields, setFields] = useState<T[]>(initial);
  const append = useCallback((item: T) => setFields(f => [...f, item]), []);
  const prepend = useCallback((item: T) => setFields(f => [item, ...f]), []);
  const remove = useCallback((index: number) => setFields(f => f.filter((_, i) => i !== index)), []);
  const move = useCallback((from: number, to: number) => setFields(f => {
    const arr = [...f]; const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item!); return arr;
  }), []);
  const update = useCallback((index: number, item: T) => setFields(f => f.map((x, i) => i === index ? item : x)), []);
  const replace = useCallback((items: T[]) => setFields(items), []);
  return { fields, append, prepend, remove, move, update, replace };
}
