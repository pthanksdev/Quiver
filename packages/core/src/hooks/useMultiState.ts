import { useState, useCallback } from 'react';

// ─── useMultiState ───────────────────────────────────────────────────────────
/**
 * Manage multiple fields in one state object with partial update.
 */
export function useMultiState<T extends Record<string, unknown>>(
  initial: T
): [T, (partial: Partial<T>) => void, () => void] {
  const [state, setState] = useState<T>(initial);
  const update = useCallback((partial: Partial<T>) => setState((s: T) => ({ ...s, ...partial })), []);
  const reset = useCallback(() => setState(initial), [initial]);
  return [state, update, reset];
}
