import { useEffect, useRef } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useCSPViolation ──────────────────────────────────────────────────────────
/**
 * Listen for Content Security Policy violation events.
 */
export function useCSPViolation(onViolation: (e: SecurityPolicyViolationEvent) => void): void {
  const cbRef = useRef(onViolation);
  cbRef.current = onViolation;
  useEffect(() => {
    if (!isClient) return;
    const handler = (e: SecurityPolicyViolationEvent) => cbRef.current(e);
    document.addEventListener('securitypolicyviolation', handler);
    return () => document.removeEventListener('securitypolicyviolation', handler);
  }, []);
}
