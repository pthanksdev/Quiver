import { useState, useEffect } from 'react';


// ─── usePointer ───────────────────────────────────────────────────────────────
/** Unified mouse/touch/pen pointer tracking. */
export function usePointer(): { x: number; y: number; pressure: number; pointerType: string } {
  const [pointer, setPointer] = useState({ x: 0, y: 0, pressure: 0, pointerType: '' });
  useEffect(() => {
    const handler = (e: PointerEvent) => setPointer({ x: e.clientX, y: e.clientY, pressure: e.pressure, pointerType: e.pointerType });
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, []);
  return pointer;
}
