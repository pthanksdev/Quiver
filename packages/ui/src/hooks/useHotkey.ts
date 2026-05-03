import { useEffect, useRef } from 'react';


// ─── useHotkey ────────────────────────────────────────────────────────────────
/** Complex key chords: e.g. 'ctrl+shift+k'. */
export function useHotkey(combo: string, handler: () => void): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  useEffect(() => {
    const parts = combo.toLowerCase().split('+').map(s => s.trim());
    const key = parts.find(p => !['ctrl', 'shift', 'alt', 'meta'].includes(p)) ?? '';
    const listener = (e: KeyboardEvent) => {
      const ctrl = parts.includes('ctrl') ? e.ctrlKey || e.metaKey : true;
      const shift = parts.includes('shift') ? e.shiftKey : true;
      const alt = parts.includes('alt') ? e.altKey : true;
      if (e.key.toLowerCase() === key && ctrl && shift && alt) { e.preventDefault(); handlerRef.current(); }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [combo]);
}
