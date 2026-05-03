import { useState, useEffect, useCallback, useRef } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useWebSocket ─────────────────────────────────────────────────────────────
export type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed';
export interface UseWebSocketReturn<T> {
  lastMessage: T | null;
  status: WebSocketStatus;
  send: (data: T) => void;
  disconnect: () => void;
}
/**
 * Full WebSocket lifecycle with auto-reconnect on close.
 * URL must be ws:// or wss:// only.
 */
export function useWebSocket<T>(url: string, reconnectIntervalMs = 3000): UseWebSocketReturn<T> {
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>(isClient ? 'connecting' : 'closed');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout>>();

  // Ensure hooks run unconditionally by moving url validation to connect()
  

  const connect = useCallback(() => {
    if (!isClient) return;
    if (!/^wss?:\/\//i.test(url)) throw new Error('[useWebSocket] Only ws:// or wss:// URLs are allowed');
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => setStatus('open');
    ws.onmessage = (e) => {
      try { setLastMessage(JSON.parse(String(e.data)) as T); }
      catch { setLastMessage(e.data as T); }
    };
    ws.onclose = () => {
      setStatus('closed');
      reconnectRef.current = setTimeout(connect, reconnectIntervalMs);
    };
    ws.onerror = () => ws.close();
  }, [url, reconnectIntervalMs]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const send = useCallback((data: T) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify(data));
  }, []);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectRef.current);
    wsRef.current?.close();
    setStatus('closed');
  }, []);

  return { lastMessage, status, send, disconnect };
}
