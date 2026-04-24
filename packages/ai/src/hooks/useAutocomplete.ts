import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}



// ─── useAutocomplete ──────────────────────────────────────────────────────────
/**
 * AI-powered input suggestions with debounced prediction.
 * Pass your own prediction function (can call an API or run on-device).
 */
export function useAutocomplete<T>(
  predict: (query: string) => Promise<T[]>,
  debounceMs = 300
): { query: string; setQuery: (q: string) => void; suggestions: T[]; loading: boolean } {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const predictRef = useRef(predict);
  predictRef.current = predict;

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setSuggestions([]); return; }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      void (async () => {
        try { setSuggestions(await predictRef.current(query)); }
        catch { setSuggestions([]); }
        finally { setLoading(false); }
      })();
    }, debounceMs);
  }, [query, debounceMs]);

  return { query, setQuery, suggestions, loading };
}
