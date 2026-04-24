
// ─── Security helpers ────────────────────────────────────────────────────────


// ─── useSuspenseQuery ────────────────────────────────────────────────────────
const cache = new Map<string, { status: 'pending' | 'success' | 'error'; value?: unknown; error?: unknown; promise?: Promise<unknown> }>();
/**
 * React Suspense-compatible data fetcher. Wraps a promise to integrate with `<Suspense>`.
 * @param key - Unique cache key
 * @param fn - Async factory function
 */
export function useSuspenseQuery<T>(key: string, fn: () => Promise<T>): T {
  if (!cache.has(key)) {
    const entry = { status: 'pending' as const };
    const entry2 = { ...entry, promise: fn().then(v => { Object.assign(entry2, { status: 'success', value: v }); }).catch((e: unknown) => { Object.assign(entry2, { status: 'error', error: e }); }) };
    cache.set(key, entry2);
  }
  const cached = cache.get(key)!;
  if (cached.status === 'pending') throw cached.promise;
  if (cached.status === 'error') throw cached.error;
  return cached.value as T;
}
