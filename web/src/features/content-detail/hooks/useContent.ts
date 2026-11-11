import { queryKeys } from '@namu/shared';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function contentQuery(id: number) {
  return queryOptions({
    queryKey: queryKeys.content(id),
    queryFn: ({ signal }) => api.getContent(id, signal),
  });
}

export function useContent(id: number) {
  return useQuery(contentQuery(id));
}
