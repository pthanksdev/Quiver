import { useState, useCallback } from 'react';

// ─── Security helpers ────────────────────────────────────────────────────────


// ─── useOptimisticUpdate ─────────────────────────────────────────────────────
/**
 * Apply a UI update optimistically before server confirmation. Rolls back on error.
 */
export function useOptimisticUpdate<T>(
  committedValue: T,
  mutate: (optimistic: T) => Promise<T>
): { value: T; update: (next: T) => Promise<void>; isPending: boolean; error: Error | null } {
  const [optimistic, setOptimistic] = useState<T>(committedValue);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (next: T) => {
    setOptimistic(next); setIsPending(true); setError(null);
    try { const confirmed = await mutate(next); setOptimistic(confirmed); }
    catch (e) { setOptimistic(committedValue); setError(e as Error); }
    finally { setIsPending(false); }
  }, [committedValue, mutate]);

  return { value: optimistic, update, isPending, error };
}
