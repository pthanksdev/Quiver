

// ─── useCharacterCount ────────────────────────────────────────────────────────
/** Live character/word count with limit validation. */
export function useCharacterCount(value: string, limit?: number): {
  chars: number; words: number; bytesUTF8: number;
  remaining: number | null; isOverLimit: boolean;
} {
  const chars = value.length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const bytesUTF8 = new TextEncoder().encode(value).length;
  const remaining = limit !== undefined ? limit - chars : null;
  return { chars, words, bytesUTF8, remaining, isOverLimit: limit !== undefined && chars > limit };
}
