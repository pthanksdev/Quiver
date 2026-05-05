import { useState, useEffect } from 'react';


// ─── useTextSelection ─────────────────────────────────────────────────────────
/** Track the currently selected text string. */
export function useTextSelection(): string {
  const [selected, setSelected] = useState('');
  useEffect(() => {
    const handler = () => setSelected(window.getSelection()?.toString() ?? '');
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);
  return selected;
}
