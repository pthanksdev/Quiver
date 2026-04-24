

// ─── useColorContrast ─────────────────────────────────────────────────────────
/**
 * Check WCAG contrast ratio between two hex colors.
 * Returns the ratio and whether it passes AA/AAA.
 */
export function useColorContrast(colorA: string, colorB: string): { ratio: number; passesAA: boolean; passesAAA: boolean } {
  const luminance = (hex: string) => {
    const rgb = hex.replace('#', '').match(/.{2}/g)!.map(h => parseInt(h, 16) / 255)
      .map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * (rgb[0] ?? 0) + 0.7152 * (rgb[1] ?? 0) + 0.0722 * (rgb[2] ?? 0);
  };
  const L1 = luminance(colorA); const L2 = luminance(colorB);
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  return { ratio, passesAA: ratio >= 4.5, passesAAA: ratio >= 7 };
}
