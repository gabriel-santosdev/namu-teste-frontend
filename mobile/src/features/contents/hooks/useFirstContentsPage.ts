import {
  CONTENTS_PAGE_SIZE,
  queryKeys,
  type ContentsQuery,
} from '@namu/shared';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

const FIRST_PAGE_QUERY: ContentsQuery = { page: 1, limit: CONTENTS_PAGE_SIZE };

export function useFirstContentsPage() {
  return useQuery({
    queryKey: queryKeys.contents(FIRST_PAGE_QUERY),
    queryFn: ({ signal }) => api.getContents(FIRST_PAGE_QUERY, signal),
  });
}
