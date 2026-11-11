import { shouldRetryRequest } from '@namu/shared';
import { QueryClient } from '@tanstack/react-query';

const ONE_MINUTE = 60_000;

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_MINUTE,
        retry: shouldRetryRequest,
        refetchOnWindowFocus: false,
      },
    },
  });
}
