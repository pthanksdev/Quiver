

// ─── useFormDiff ─────────────────────────────────────────────────────────────
/** Track which fields changed from their initial values. */
export function useFormDiff<T extends Record<string, unknown>>(current: T, initial: T): {
  changedFields: (keyof T)[]; hasChanges: boolean;
} {
  const changedFields = (Object.keys(current) as (keyof T)[]).filter(k => JSON.stringify(current[k]) !== JSON.stringify(initial[k]));
  return { changedFields, hasChanges: changedFields.length > 0 };
}
