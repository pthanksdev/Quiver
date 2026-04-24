import { useState } from 'react';

// ─── useVirtualList ───────────────────────────────────────────────────────────
/** Virtualized row rendering — only renders visible rows. */
export function useVirtualList<T>(items: T[], containerHeight: number, itemHeight: number): {
  visibleItems: { item: T; index: number; offsetTop: number }[];
  totalHeight: number;
  containerProps: { style: React.CSSProperties; onScroll: (e: React.UIEvent<HTMLDivElement>) => void };
} {
  const [scrollTop, setScrollTop] = useState(0);
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 3);
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + 3);
  const visibleItems = items.slice(startIndex, endIndex).map((item, i) => ({
    item, index: startIndex + i, offsetTop: (startIndex + i) * itemHeight,
  }));
  const containerProps = {
    style: { height: containerHeight, overflowY: 'auto' as const, position: 'relative' as const },
    onScroll: (e: React.UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop),
  };
  return { visibleItems, totalHeight, containerProps };
}
