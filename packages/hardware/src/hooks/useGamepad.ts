import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useGamepad ───────────────────────────────────────────────────────────────
/** Gamepad API — buttons, axes, rumble. */
export function useGamepad(index = 0): { gamepad: Gamepad | null; supported: boolean } {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);
  const supported = isClient && 'getGamepads' in navigator;
  useEffect(() => {
    if (!supported) return;
    let rafId: number;
    const poll = () => { setGamepad(navigator.getGamepads()[index] ?? null); rafId = requestAnimationFrame(poll); };
    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, [index, supported]);
  return { gamepad, supported };
}
