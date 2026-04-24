import { useState, useEffect } from 'react';

// ─── useMounted ─────────────────────────────────────────────────────────────
/**
 * Returns true when the component is mounted.
 * @example const mounted = useMounted();
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  return mounted;
}
