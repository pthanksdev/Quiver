import { useState } from 'react';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}



// ─── useSmartSearch ───────────────────────────────────────────────────────────
/**
 * Fuzzy string search over a local dataset using cosine-like character ngram scoring.
 * Zero external dependencies.
 */
export function useSmartSearch<T extends Record<string, unknown>>(
  dataset: T[],
  keys: (keyof T)[]
): { query: string; setQuery: (q: string) => void; results: T[] } {
  const [query, setQuery] = useState('');
  const score = (str: string, search: string): number => {
    const s = str.toLowerCase(); const q = search.toLowerCase();
    if (s.includes(q)) return 1;
    let match = 0;
    for (let i = 0; i < q.length; i++) if (s.includes(q[i] ?? '')) match++;
    return match / q.length;
  };
  const results = !query.trim() ? dataset : dataset
    .map(item => ({ item, score: Math.max(...keys.map(k => score(String(item[k] ?? ''), query))) }))
    .filter(x => x.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .map(x => x.item);
  return { query, setQuery, results };
}
