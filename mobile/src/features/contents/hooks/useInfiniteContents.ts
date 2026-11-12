import {
  CONTENTS_PAGE_SIZE,
  queryKeys,
  type Content,
  type ContentsQuery,
  type Paginated,
} from '@namu/shared';
import {
  keepPreviousData,
  useInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import { api } from '../../../lib/api';

const FIRST_PAGE = 1;

export interface ContentsFeed {
  items: Content[];
  total: number;
}

function toContentsFeed(data: InfiniteData<Paginated<Content>>): ContentsFeed {
  const seenIds = new Set<number>();
  const items = data.pages
    .flatMap(page => page.data)
    .filter(content => {
      if (seenIds.has(content.id)) return false;
      seenIds.add(content.id);
      return true;
    });
  const total = data.pages[data.pages.length - 1]?.total ?? items.length;
  return { items, total };
}

export function useInfiniteContents(search = '') {
  const baseQuery: ContentsQuery = {
    limit: CONTENTS_PAGE_SIZE,
    ...(search ? { search } : {}),
  };

  return useInfiniteQuery({
    queryKey: [...queryKeys.contents(baseQuery), 'infinite'],
    queryFn: ({ pageParam, signal }) =>
      api.getContents({ ...baseQuery, page: pageParam }, signal),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    select: toContentsFeed,
    placeholderData: keepPreviousData,
  });
}
