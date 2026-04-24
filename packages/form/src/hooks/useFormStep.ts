import { useState } from 'react';


// ─── useFormStep ──────────────────────────────────────────────────────────────
/** Multi-step wizard form state. */
export function useFormStep(totalSteps: number): {
  step: number; isFirst: boolean; isLast: boolean;
  next: () => void; back: () => void; goTo: (n: number) => void;
} {
  const [step, setStep] = useState(1);
  return {
    step, isFirst: step === 1, isLast: step === totalSteps,
    next: () => setStep(s => Math.min(s + 1, totalSteps)),
    back: () => setStep(s => Math.max(s - 1, 1)),
    goTo: (n: number) => setStep(Math.min(Math.max(1, n), totalSteps)),
  };
}
