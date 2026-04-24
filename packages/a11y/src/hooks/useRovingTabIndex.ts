import { useState, useCallback } from 'react';


// ─── useRovingTabIndex ────────────────────────────────────────────────────────
/**
 * Arrow-key navigation within a group of items (toolbars, listboxes).
 */
export function useRovingTabIndex(count: number): {
  activeIndex: number;
  getItemProps: (index: number) => { tabIndex: number; onKeyDown: (e: React.KeyboardEvent) => void };
} {
  const [activeIndex, setActiveIndex] = useState(0);
  const getItemProps = useCallback((index: number) => ({
    tabIndex: index === activeIndex ? 0 : -1,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => (i + 1) % count); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => (i - 1 + count) % count); }
      if (e.key === 'Home') { e.preventDefault(); setActiveIndex(0); }
      if (e.key === 'End') { e.preventDefault(); setActiveIndex(count - 1); }
    },
  }), [activeIndex, count]);
  return { activeIndex, getItemProps };
}
