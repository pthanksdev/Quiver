import { useState, useEffect } from 'react';

// ─── useTypewriter ───────────────────────────────────────────────────────────
/**
 * Animated character-by-character text reveal.
 * @param text - Full text to type out
 * @param speedMs - Delay per character in ms (default: 50)
 */
export function useTypewriter(text: string, speedMs = 50): string {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);
  return displayed;
}
