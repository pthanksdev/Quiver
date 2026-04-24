import { useState, useCallback } from 'react';


// ─── useMaskedInput ───────────────────────────────────────────────────────────
const MASKS: Record<string, string> = {
  phone: '(###) ###-####',
  date: '##/##/####',
  creditCard: '#### #### #### ####',
};
/**
 * Phone, credit card, date formatting masks.
 * @param mask - Predefined mask name or custom mask string where # = digit
 */
export function useMaskedInput(mask: keyof typeof MASKS  ): {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; raw: string;
} {
  const [value, setValue] = useState('');
  const pattern = MASKS[mask] ?? mask;
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    let out = ''; let di = 0;
    for (let i = 0; i < pattern.length && di < digits.length; i++) {
      out += pattern[i] === '#' ? digits[di++] : pattern[i];
    }
    setValue(out);
  }, [pattern]);
  const raw = value.replace(/\D/g, '');
  return { value, onChange, raw };
}
