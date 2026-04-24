import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useLeaderElection ────────────────────────────────────────────────────────
/**
 * Elect one tab as "leader" among many using BroadcastChannel + heartbeat.
 */
export function useLeaderElection(channelName: string): { isLeader: boolean } {
  const [isLeader, setIsLeader] = useState(false);
  useEffect(() => {
    if (!isClient || !('BroadcastChannel' in window)) { setIsLeader(true); return; }
    const id = Math.random().toString(36);
    const ch = new BroadcastChannel(channelName);
    let leader = false;
    const heartbeat = setInterval(() => { if (leader) ch.postMessage({ type: 'heartbeat', id }); }, 500);
    ch.onmessage = (e: MessageEvent<{ type: string; id: string }>) => {
      if (e.data.type === 'heartbeat' && e.data.id !== id && leader) { leader = false; setIsLeader(false); }
    };
    setTimeout(() => { leader = true; setIsLeader(true); ch.postMessage({ type: 'heartbeat', id }); }, 200);
    return () => { clearInterval(heartbeat); ch.close(); };
  }, [channelName]);
  return { isLeader };
}
