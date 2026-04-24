import { useState, useCallback, useRef } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useWakeLock ──────────────────────────────────────────────────────────────
/** Prevent screen from sleeping. */
export function useWakeLock(): { request: () => Promise<void>; release: () => Promise<void>; active: boolean; supported: boolean } {
  const [active, setActive] = useState(false);
  const lock = useRef<WakeLockSentinel | null>(null);
  const supported = isClient && 'wakeLock' in navigator;
  const request = useCallback(async () => {
    if (!supported) return;
    lock.current = await navigator.wakeLock.request('screen');
    setActive(true);
    lock.current.onrelease = () => setActive(false);
  }, [supported]);
  const release = useCallback(async () => { await lock.current?.release(); setActive(false); }, []);
  return { request, release, active, supported };
}
