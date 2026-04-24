import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useNetworkQuality ────────────────────────────────────────────────────────
/** Classify connection as '4g' / '3g' / '2g' / 'slow-2g'. */
export function useNetworkQuality(): string {
  const getQuality = (): string =>
    (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType ?? 'unknown';
  const [quality, setQuality] = useState(isClient ? getQuality() : 'unknown');
  useEffect(() => {
    if (!isClient) return;
    const conn = (navigator as Navigator & { connection?: EventTarget & { effectiveType?: string } }).connection;
    if (!conn) return;
    const handler = (): void => setQuality(getQuality());
    conn.addEventListener('change', handler);
    return (): void => conn.removeEventListener('change', handler);
  }, []);
  return quality;
}
