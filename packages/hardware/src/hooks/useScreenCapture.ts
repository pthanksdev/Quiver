import { useState, useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useScreenCapture ─────────────────────────────────────────────────────────
/** Capture the screen or a window stream. */
export function useScreenCapture(): {
  start: () => Promise<void>;
  stop: () => void;
  stream: MediaStream | null;
  supported: boolean;
} {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const supported = isClient && !!navigator.mediaDevices?.getDisplayMedia;
  const start = useCallback(async () => {
    const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
    setStream(s);
    s.getTracks()[0]?.addEventListener('ended', () => setStream(null));
  }, []);
  const stop = useCallback(() => { stream?.getTracks().forEach(t => t.stop()); setStream(null); }, [stream]);
  return { start, stop, stream, supported };
}
