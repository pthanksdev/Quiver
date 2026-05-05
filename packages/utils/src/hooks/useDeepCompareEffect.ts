import { useEffect, useRef, type DependencyList, type EffectCallback } from 'react';

// ─── useDeepCompare ──────────────────────────────────────────────────────────
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (typeof a === 'object') {
    const ka = Object.keys(a);
    const kb = Object.keys(b as object);
    if (ka.length !== kb.length) return false;
    return ka.every(k => deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }
  return false;
}

/**
 * Like useEffect but with deep equality check on dependencies.
 */
export function useDeepCompareEffect(effect: EffectCallback, deps: DependencyList): void {
  const prevDeps = useRef<DependencyList>([]);
  if (!deepEqual(prevDeps.current, deps)) prevDeps.current = deps;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, prevDeps.current);
}
