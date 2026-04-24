import { useState, useEffect, useRef } from 'react';

// ─── Security helpers ────────────────────────────────────────────────────────


// ─── useInfiniteScroll ───────────────────────────────────────────────────────
/**
 * Paginated data triggered by observing a sentinel element at the bottom of a list.
 * @param fetchPage - Async function receiving page number, returns items array
 */
export function useInfiniteScroll<T>(fetchPage: (page: number) => Promise<T[]>): {
  items: T[];
  sentinelRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  hasMore: boolean;
  error: Error | null;
} {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fnRef = useRef(fetchPage);
  fnRef.current = fetchPage;

  useEffect(() => {
    if (!hasMore) return;
    setLoading(true);
    fnRef.current(page)
      .then(newItems => {
        setItems(prev => [...prev, ...newItems]);
        if (newItems.length === 0) setHasMore(false);
      })
      .catch(e => setError(e as Error))
      .finally(() => setLoading(false));
  }, [page, hasMore]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && !loading) setPage(p => p + 1);
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  return { items, sentinelRef, loading, hasMore, error };
}
