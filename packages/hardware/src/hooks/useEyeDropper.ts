import { useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useEyeDropper ────────────────────────────────────────────────────────────
/** Pick a color from anywhere on the screen via EyeDropper API. */
export function useEyeDropper(): { pick: () => Promise<string | null>; supported: boolean } {
  const supported = isClient && 'EyeDropper' in window;
  const pick = useCallback(async (): Promise<string | null> => {
    if (!supported) return null;
    const dropper = new (window as any).EyeDropper();
    const { sRGBHex } = await dropper.open();
    return sRGBHex;
  }, [supported]);
  return { pick, supported };
}
