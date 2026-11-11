import { queryKeys, type ContentsQuery } from '@namu/shared';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useContents(query: ContentsQuery) {
  return useQuery({
    queryKey: queryKeys.contents(query),
    queryFn: ({ signal }) => api.getContents(query, signal),
    placeholderData: keepPreviousData,
  });
}
