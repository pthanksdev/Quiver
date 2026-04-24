import { useState, useCallback } from 'react';

// ─── usePagination ────────────────────────────────────────────────────────────
export interface UsePaginationReturn {
  page: number; pageSize: number; totalPages: number;
  nextPage: () => void; prevPage: () => void; goToPage: (n: number) => void; setPageSize: (n: number) => void;
  range: [number, number]; // [start, end] (0-indexed)
}
/** Page index, page size, total pages. */
export function usePagination(totalItems: number, initialPageSize = 10): UsePaginationReturn {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const goToPage = useCallback((n: number) => setPage(Math.min(Math.max(1, n), totalPages)), [totalPages]);
  const range: [number, number] = [(page - 1) * pageSize, Math.min(page * pageSize, totalItems)];
  return { page, pageSize, totalPages, nextPage: () => goToPage(page + 1), prevPage: () => goToPage(page - 1), goToPage, setPageSize, range };
}
