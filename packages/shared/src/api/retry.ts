import { isClientError } from './errors';

export const MAX_RETRIES = 2;

export function shouldRetryRequest(failureCount: number, error: unknown): boolean {
  if (isClientError(error)) return false;
  return failureCount < MAX_RETRIES;
}
