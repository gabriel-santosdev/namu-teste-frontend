import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

export interface CatalogFilters {
  search: string;
  category: string;
  page: number;
}

interface UpdateOptions {
  replace?: boolean;
}

const PARAMS = {
  search: 'busca',
  category: 'categoria',
  page: 'pagina',
} as const;

const FIRST_PAGE = 1;

function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= FIRST_PAGE ? page : FIRST_PAGE;
}

function readFilters(params: URLSearchParams): CatalogFilters {
  return {
    search: params.get(PARAMS.search) ?? '',
    category: params.get(PARAMS.category) ?? '',
    page: parsePage(params.get(PARAMS.page)),
  };
}

function writeFilters({ search, category, page }: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (search) params.set(PARAMS.search, search);
  if (category) params.set(PARAMS.category, category);
  if (page > FIRST_PAGE) params.set(PARAMS.page, String(page));
  return params;
}

export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const updateFilters = useCallback(
    (changes: Partial<CatalogFilters>, options?: UpdateOptions) => {
      setSearchParams(
        (current) => writeFilters({ ...readFilters(current), page: FIRST_PAGE, ...changes }),
        options,
      );
    },
    [setSearchParams],
  );

  const setSearch = useCallback(
    (search: string) => updateFilters({ search }, { replace: true }),
    [updateFilters],
  );
  const setCategory = useCallback(
    (category: string) => updateFilters({ category }),
    [updateFilters],
  );
  const setPage = useCallback((page: number) => updateFilters({ page }), [updateFilters]);
  const clearFilters = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams]);

  return {
    filters,
    hasActiveFilters: filters.search !== '' || filters.category !== '',
    setSearch,
    setCategory,
    setPage,
    clearFilters,
  };
}
