import { useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useShare ─────────────────────────────────────────────────────────────────
/** Native OS share sheet via Web Share API. */
export function useShare(): { share: (data: ShareData) => Promise<void>; supported: boolean } {
  const supported = isClient && 'share' in navigator;
  const share = useCallback(async (data: ShareData) => {
    if (!supported) throw new Error('[useShare] Web Share API not supported');
    // Validate URL if present
    if (data.url && !/^https?:\/\//i.test(data.url)) throw new Error('[useShare] Share URL must be http/https');
    await navigator.share(data);
  }, [supported]);
  return { share, supported };
}
