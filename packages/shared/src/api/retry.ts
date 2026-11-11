import { isApiError } from './errors';

export const MAX_RETRIES = 2;

export function shouldRetryRequest(failureCount: number, error: unknown): boolean {
  if (isApiError(error) && error.status >= 400 && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}
