import { useState, useEffect, useCallback } from 'react';

// ─── useTimeAgo ──────────────────────────────────────────────────────────────
/**
 * Live "X minutes ago" relative time string, updates every minute.
 */
export function useTimeAgo(date: Date | string | number): string {
  const getLabel = useCallback(() => {
    const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (secs < 60) return 'just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
  }, [date]);
  const [label, setLabel] = useState(getLabel);
  useEffect(() => {
    const id = setInterval(() => setLabel(getLabel()), 60_000);
    return () => clearInterval(id);
  }, [date, getLabel]);
  return label;
}
