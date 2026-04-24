import { useEffect, useRef } from 'react';

// ─── Security helpers ────────────────────────────────────────────────────────


// ─── useAbortController ───────────────────────────────────────────────────────
/**
 * Provides an AbortController that is aborted on component unmount.
 */
export function useAbortController(): AbortController {
  const controllerRef = useRef<AbortController>(new AbortController());
  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    return () => controller.abort();
  }, []);
  return controllerRef.current;
}
