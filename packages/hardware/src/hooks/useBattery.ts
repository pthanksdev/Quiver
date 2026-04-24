import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useBattery ───────────────────────────────────────────────────────────────
export interface BatteryInfo { level: number; charging: boolean; chargingTime: number; dischargingTime: number }
/** Battery level, charging state, and estimated times. */
export function useBattery(): BatteryInfo | null {
  const [info, setInfo] = useState<BatteryInfo | null>(null);
  useEffect(() => {
    if (!isClient || !('getBattery' in navigator)) return;
    (navigator as any).getBattery().then((battery: any) => {
      const update = () => setInfo({ level: battery.level, charging: battery.charging, chargingTime: battery.chargingTime, dischargingTime: battery.dischargingTime });
      update();
      battery.addEventListener('chargingchange', update);
      battery.addEventListener('levelchange', update);
    });
  }, []);
  return info;
}
