import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useNetworkInfo ───────────────────────────────────────────────────────────
export interface NetworkInfo { type: string; effectiveType: string; downlink: number; rtt: number; online: boolean }
/** Connection type, effective bandwidth, and RTT. */
export function useNetworkInfo(): NetworkInfo {
  const getInfo = (): NetworkInfo => {
    const conn = (navigator as Navigator & { connection?: { type?: string; effectiveType?: string; downlink?: number; rtt?: number } }).connection;
    return { type: conn?.type ?? 'unknown', effectiveType: conn?.effectiveType ?? 'unknown', downlink: conn?.downlink ?? 0, rtt: conn?.rtt ?? 0, online: navigator.onLine };
  };
  const [info, setInfo] = useState<NetworkInfo>(isClient ? getInfo() : { type: 'unknown', effectiveType: 'unknown', downlink: 0, rtt: 0, online: true });
  useEffect(() => {
    if (!isClient) return;
    const update = () => setInfo(getInfo());
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  return info;
}
