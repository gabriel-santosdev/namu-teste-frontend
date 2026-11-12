import { queryKeys } from '@namu/shared';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export function useFavorites() {
  return useQuery({
    queryKey: queryKeys.favorites(),
    queryFn: ({ signal }) => api.getFavorites(signal),
  });
}
