import { useState, useEffect, useCallback } from 'react';
import { useBroadcastChannel } from './useBroadcastChannel';


// ─── usePresence ──────────────────────────────────────────────────────────────
/**
 * Multi-user presence (online/offline/custom status) over BroadcastChannel.
 * In production, replace the channel backend with your real-time server.
 */
export function usePresence<T extends { id: string }>(channelName: string, self: T): {
  peers: T[];
  setSelf: (data: T) => void;
} {
  const [peers, setPeers] = useState<T[]>([]);
  const { lastMessage, postMessage } = useBroadcastChannel<{ type: 'join' | 'leave' | 'update'; user: T }>(channelName);

  useEffect(() => { postMessage({ type: 'join', user: self }); }, []);
  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type === 'join' || lastMessage.type === 'update') {
      setPeers(prev => {
        const filtered = prev.filter(p => p.id !== lastMessage.user.id);
        return [...filtered, lastMessage.user];
      });
    } else if (lastMessage.type === 'leave') {
      setPeers(prev => prev.filter(p => p.id !== lastMessage.user.id));
    }
  }, [lastMessage]);

  const setSelf = useCallback((data: T) => postMessage({ type: 'update', user: data }), [postMessage]);
  return { peers, setSelf };
}
