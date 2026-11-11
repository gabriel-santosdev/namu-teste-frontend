import axios, { AxiosError, type AxiosInstance } from 'axios';
import {
  ApiError,
  GENERIC_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
} from './errors';

const DEFAULT_TIMEOUT_MS = 15_000;
const TIMEOUT_CODES = new Set([AxiosError.ECONNABORTED, AxiosError.ETIMEDOUT]);

export interface HttpClientOptions {
  baseUrl: string;
  timeoutMs?: number;
}

function extractServerMessage(data: unknown): string | undefined {
  if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
    return data.error;
  }
  return undefined;
}

function toApiError(error: AxiosError): ApiError {
  if (error.response) {
    const message = extractServerMessage(error.response.data) ?? GENERIC_ERROR_MESSAGE;
    return new ApiError(message, error.response.status);
  }
  if (error.code && TIMEOUT_CODES.has(error.code)) {
    return new ApiError(TIMEOUT_ERROR_MESSAGE, 0);
  }
  return new ApiError(NETWORK_ERROR_MESSAGE, 0);
}

export function createHttpClient({
  baseUrl,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: HttpClientOptions): AxiosInstance {
  const http = axios.create({
    baseURL: baseUrl,
    timeout: timeoutMs,
    headers: { Accept: 'application/json' },
  });

  http.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isCancel(error) || !axios.isAxiosError(error)) return Promise.reject(error);
      return Promise.reject(toApiError(error));
    },
  );

  return http;
}
