import { useState, useEffect, useCallback, useRef } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useBroadcastChannel ──────────────────────────────────────────────────────
/**
 * Cross-tab messaging via BroadcastChannel API.
 */
export function useBroadcastChannel<T>(channelName: string): {
  lastMessage: T | null;
  postMessage: (data: T) => void;
} {
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (!isClient || !('BroadcastChannel' in window)) return;
    const ch = new BroadcastChannel(channelName);
    channelRef.current = ch;
    ch.onmessage = (e: MessageEvent<T>) => setLastMessage(e.data);
    return () => ch.close();
  }, [channelName]);
  const postMessage = useCallback((data: T) => channelRef.current?.postMessage(data), []);
  return { lastMessage, postMessage };
}
