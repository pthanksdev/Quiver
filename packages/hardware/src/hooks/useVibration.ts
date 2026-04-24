import { useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useVibration ─────────────────────────────────────────────────────────────
/** Trigger haptic feedback patterns via Vibration API. */
export function useVibration(): { vibrate: (pattern: number | number[]) => void; supported: boolean } {
  const supported = isClient && 'vibrate' in navigator;
  const vibrate = useCallback((pattern: number | number[]) => { if (supported) navigator.vibrate(pattern); }, [supported]);
  return { vibrate, supported };
}
