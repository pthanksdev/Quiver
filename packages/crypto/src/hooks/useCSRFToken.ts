import { useState, useCallback } from 'react';


// ─── useCSRFToken ─────────────────────────────────────────────────────────────
/**
 * Generate and rotate cryptographically secure CSRF tokens.
 * Never stored in localStorage — only in memory.
 */
export function useCSRFToken(): { token: string; rotate: () => void } {
  const generate = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const [token, setToken] = useState(generate);
  const rotate = useCallback(() => setToken(generate()), []);
  return { token, rotate };
}
