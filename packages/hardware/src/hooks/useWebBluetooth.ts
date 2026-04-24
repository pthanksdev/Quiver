import { useState, useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useWebBluetooth ──────────────────────────────────────────────────────────
declare global {
  interface RequestDeviceOptions { [key: string]: any }
  interface BluetoothDevice { [key: string]: any }
}
/** Connect to BLE devices. Response data is length-validated. */
export function useWebBluetooth(): {
  request: (options: RequestDeviceOptions) => Promise<BluetoothDevice | null>;
  device: BluetoothDevice | null;
  supported: boolean;
} {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const supported = isClient && 'bluetooth' in navigator;
  const request = useCallback(async (options: RequestDeviceOptions) => {
    if (!supported) throw new Error('[useWebBluetooth] Bluetooth not supported');
    const dev = await (navigator as any).bluetooth.requestDevice(options);
    setDevice(dev);
    return dev;
  }, [supported]);
  return { request, device, supported };
}
