import { useState, useEffect, useRef } from 'react';


// ─── useContextMenu ───────────────────────────────────────────────────────────
/** Custom right-click context menu state. */
export function useContextMenu(): {
  show: boolean; x: number; y: number;
  ref: React.RefObject<HTMLElement>; close: () => void;
} {
  const [menu, setMenu] = useState({ show: false, x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const open = (e: MouseEvent) => { e.preventDefault(); setMenu({ show: true, x: e.clientX, y: e.clientY }); };
    const close = () => setMenu(m => ({ ...m, show: false }));
    el.addEventListener('contextmenu', open);
    document.addEventListener('click', close);
    return () => { el.removeEventListener('contextmenu', open); document.removeEventListener('click', close); };
  }, []);
  return { ...menu, ref, close: () => setMenu(m => ({ ...m, show: false })) };
}
