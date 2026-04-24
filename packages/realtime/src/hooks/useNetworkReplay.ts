import { useState, useEffect, useCallback, useRef } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useNetworkReplay ─────────────────────────────────────────────────────────
/**
 * Queue failed mutations and replay them when the connection is restored.
 */
export function useNetworkReplay<T>(onReplay: (items: T[]) => Promise<void>): {
  queue: T[];
  enqueue: (item: T) => void;
  isOnline: boolean;
} {
  const [queue, setQueue] = useState<T[]>([]);
  const [isOnline, setIsOnline] = useState(isClient ? navigator.onLine : true);
  const replayRef = useRef(onReplay);
  replayRef.current = onReplay;

  useEffect(() => {
    if (!isClient) return;
    const online = () => { setIsOnline(true); };
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, []);

  useEffect(() => {
    if (isOnline && queue.length > 0) {
      replayRef.current(queue).then(() => setQueue([])).catch(() => {});
    }
  }, [isOnline, queue]);

  const enqueue = useCallback((item: T) => {
    if (isOnline) { replayRef.current([item]).catch(() => setQueue(q => [...q, item])); }
    else setQueue(q => [...q, item]);
  }, [isOnline]);

  return { queue, enqueue, isOnline };
}
