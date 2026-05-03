import { useState, useEffect, useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useFullscreen ────────────────────────────────────────────────────────────
/** Toggle and detect browser fullscreen mode. */
export function useFullscreen(): {
  isFullscreen: boolean; request: (el?: HTMLElement) => Promise<void>; exit: () => Promise<void>; supported: boolean;
} {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const supported = isClient && !!document.documentElement.requestFullscreen;
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  const request = useCallback(async (el?: HTMLElement) => {
    await (el ?? document.documentElement).requestFullscreen();
  }, []);
  const exit = useCallback(async () => { if (document.fullscreenElement) await document.exitFullscreen(); }, []);
  return { isFullscreen, request, exit, supported };
}
