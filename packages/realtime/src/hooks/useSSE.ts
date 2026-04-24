import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useSSE ───────────────────────────────────────────────────────────────────
/**
 * Server-Sent Events with EventSource lifecycle management and auto-reconnect.
 */
export function useSSE<T>(url: string): { data: T | null; error: Event | null; connected: boolean } {
  if (url && !/^https?:\/\//i.test(url)) throw new Error('[useSSE] Only http/https URLs allowed');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!isClient) return;
    const es = new EventSource(url);
    es.onopen = () => setConnected(true);
    es.onmessage = (e) => { try { setData(JSON.parse(String(e.data)) as T); } catch { setData(e.data as T); } };
    es.onerror = (err) => { setError(err); setConnected(false); };
    return () => { es.close(); setConnected(false); };
  }, [url]);
  return { data, error, connected };
}
