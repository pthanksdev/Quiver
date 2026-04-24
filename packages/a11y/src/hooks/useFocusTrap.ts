import { useEffect, useRef } from 'react';


// ─── useFocusTrap ─────────────────────────────────────────────────────────────
/**
 * Lock keyboard focus within a container element (modals, drawers).
 */
export function useFocusTrap(active = true): React.RefObject<HTMLElement> {
  const containerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const el = containerRef.current;
    const focusable = () => Array.from(el.querySelectorAll<HTMLElement>(
      'button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )).filter(e => !e.hasAttribute('disabled'));

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = focusable();
      if (!list.length) { e.preventDefault(); return; }
      const first = list[0]!;
      const last = list[list.length - 1]!;
      if (e.shiftKey) { if (document.activeElement === first) { last.focus(); e.preventDefault(); } }
      else { if (document.activeElement === last) { first.focus(); e.preventDefault(); } }
    };
    el.addEventListener('keydown', handler);
    focusable()[0]?.focus();
    return () => el.removeEventListener('keydown', handler);
  }, [active]);
  return containerRef;
}
