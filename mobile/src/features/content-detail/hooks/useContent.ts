import { queryKeys } from '@namu/shared';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export function useContent(id: number) {
  return useQuery({
    queryKey: queryKeys.content(id),
    queryFn: ({ signal }) => api.getContent(id, signal),
  });
}
