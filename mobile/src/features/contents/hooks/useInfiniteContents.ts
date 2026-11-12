import {
  CONTENTS_PAGE_SIZE,
  queryKeys,
  type Content,
  type ContentsQuery,
  type Paginated,
} from '@namu/shared';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { api } from '../../../lib/api';

const BASE_QUERY: ContentsQuery = { limit: CONTENTS_PAGE_SIZE };
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

export function useInfiniteContents() {
  return useInfiniteQuery({
    queryKey: [...queryKeys.contents(BASE_QUERY), 'infinite'],
    queryFn: ({ pageParam, signal }) =>
      api.getContents({ ...BASE_QUERY, page: pageParam }, signal),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    select: toContentsFeed,
  });
}
