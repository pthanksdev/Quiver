import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useDeviceMotion ──────────────────────────────────────────────────────────
/** Accelerometer and rotation rate readings. */
export function useDeviceMotion(): { acceleration: DeviceMotionEventAcceleration | null; rotationRate: DeviceMotionEventRotationRate | null; supported: boolean } {
  const [motion, setMotion] = useState<{ acceleration: DeviceMotionEventAcceleration | null; rotationRate: DeviceMotionEventRotationRate | null }>({ acceleration: null, rotationRate: null });
  const supported = isClient && 'DeviceMotionEvent' in window;
  useEffect(() => {
    if (!supported) return;
    const handler = (e: DeviceMotionEvent) => setMotion({ acceleration: e.acceleration, rotationRate: e.rotationRate });
    window.addEventListener('devicemotion', handler);
    return () => window.removeEventListener('devicemotion', handler);
  }, [supported]);
  return { ...motion, supported };
}
