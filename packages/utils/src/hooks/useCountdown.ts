import { useState, useEffect, useCallback } from 'react';

// ─── useCountdown ────────────────────────────────────────────────────────────
/**
 * Countdown timer to a target date.
 */
export function useCountdown(targetDate: Date): {
  days: number; hours: number; minutes: number; seconds: number; isFinished: boolean;
} {
  const getRemaining = useCallback(() => Math.max(0, targetDate.getTime() - Date.now()), [targetDate]);
  const [remaining, setRemaining] = useState(getRemaining);
  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, [getRemaining]);
  const s = Math.floor(remaining / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    isFinished: remaining === 0,
  };
}
