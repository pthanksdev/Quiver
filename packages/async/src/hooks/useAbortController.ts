import { useEffect, useRef } from 'react';

// ─── Security helpers ────────────────────────────────────────────────────────


// ─── useAbortController ───────────────────────────────────────────────────────
export function useAbortController(): AbortController {
  const controllerRef = useRef<AbortController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new AbortController();
  }
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);
  return controllerRef.current;
}
