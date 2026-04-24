import { useFilter } from './useFilter';
import { usePagination } from './usePagination';
import { useRowSelection } from './useRowSelection';
import { useSearch } from './useSearch';
import { useSorting } from './useSorting';

// ─── useTable ─────────────────────────────────────────────────────────────────
/** All-in-one: sort + filter + paginate + row select. */
export function useTable<T extends Record<string, unknown>>(
  data: T[],
  getKey: (item: T) => string,
  searchKeys: (keyof T)[] = [],
  pageSize = 20
): {
  rows: T[];
  pagination: ReturnType<typeof usePagination>;
  sort: ReturnType<typeof useSorting<T>>;
  filter: ReturnType<typeof useFilter<T>>;
  search: ReturnType<typeof useSearch<T>>;
  selection: ReturnType<typeof useRowSelection<T>>;
} {
  const search = useSearch(data, searchKeys);
  const filter = useFilter(search.results);
  const sort = useSorting(filter.filtered);
  const pagination = usePagination(sort.sorted.length, pageSize);
  const rows = sort.sorted.slice(pagination.range[0], pagination.range[1]);
  const selection = useRowSelection(rows, getKey);
  return { rows, pagination, sort, filter, search, selection };
}
