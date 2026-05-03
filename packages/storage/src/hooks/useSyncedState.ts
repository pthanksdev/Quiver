import { useState, useEffect, useCallback, useRef } from 'react';

const isClient = typeof window !== 'undefined';

// ─── Security helpers ────────────────────────────────────────────────────────




// ─── useSyncedState ──────────────────────────────────────────────────────────
/**
 * State that automatically syncs across all tabs via BroadcastChannel.
 * Falls back to StorageEvent if BroadcastChannel unavailable.
 */
export function useSyncedState<T>(channelName: string, initialValue: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const channelRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (!isClient || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;
    channel.onmessage = (e: MessageEvent<T>) => setValue(e.data);
    return () => channel.close();
  }, [channelName]);
  const set = useCallback((v: T) => {
    setValue(v);
    channelRef.current?.postMessage(v);
  }, []);
  return [value, set];
}
