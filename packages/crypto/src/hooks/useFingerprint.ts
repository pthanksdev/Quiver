import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useFingerprint ───────────────────────────────────────────────────────────
/**
 * Generate a lightweight, privacy-safe browser fingerprint for fraud detection.
 * Uses only browser capability signals — no PII collected.
 */
export function useFingerprint(): string | null {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  useEffect(() => {
    if (!isClient) return;
    const signals = [
      navigator.language,
      `${screen.width}x${screen.height}`,
      String(navigator.hardwareConcurrency),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      String((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 'unknown'),
      navigator.platform,
    ].join('|');
    void crypto.subtle.digest('SHA-256', new TextEncoder().encode(signals)).then(buf => {
      setFingerprint(Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));
    });
  }, []);
  return fingerprint;
}
