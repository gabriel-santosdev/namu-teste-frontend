import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

const PAGE_PARAM = 'page';
const FIRST_PAGE = 1;

function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= FIRST_PAGE ? page : FIRST_PAGE;
}

export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get(PAGE_PARAM));

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        if (nextPage <= FIRST_PAGE) params.delete(PAGE_PARAM);
        else params.set(PAGE_PARAM, String(nextPage));
        return params;
      });
    },
    [setSearchParams],
  );

  return [page, setPage] as const;
}
