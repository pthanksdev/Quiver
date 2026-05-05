import { useRef, type RefObject } from 'react';

// ─── useLatest ───────────────────────────────────────────────────────────────
/**
 * Returns a ref that always contains the latest value. Avoids stale closure bugs.
 */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
}
