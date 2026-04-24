import { useCallback } from 'react';

// ─── useCSVExport ─────────────────────────────────────────────────────────────
/** Convert dataset to downloadable CSV file. */
export function useCSVExport<T extends Record<string, unknown>>(data: T[], filename = 'export.csv'): { download: () => void } {
  const download = useCallback(() => {
    const keys = Object.keys(data[0] ?? {});
    const csv = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [data, filename]);
  return { download };
}
