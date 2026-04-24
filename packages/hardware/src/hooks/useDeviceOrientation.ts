import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useDeviceOrientation ─────────────────────────────────────────────────────
/** Gyroscope pitch/roll/yaw. */
export function useDeviceOrientation(): { alpha: number | null; beta: number | null; gamma: number | null; supported: boolean } {
  const [ori, setOri] = useState({ alpha: null as number|null, beta: null as number|null, gamma: null as number|null });
  const supported = isClient && 'DeviceOrientationEvent' in window;
  useEffect(() => {
    if (!supported) return;
    const handler = (e: DeviceOrientationEvent) => setOri({ alpha: e.alpha, beta: e.beta, gamma: e.gamma });
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [supported]);
  return { ...ori, supported };
}
