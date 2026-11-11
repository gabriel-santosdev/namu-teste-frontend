import type {
  Category,
  Content,
  ContentDetail,
  ContentsQuery,
  ListResponse,
  Paginated,
} from '../types';
import {
  ApiError,
  GENERIC_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
} from './errors';

const DEFAULT_TIMEOUT_MS = 15_000;

export interface ApiClientOptions {
  baseUrl: string;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export type ApiClient = ReturnType<typeof createApiClient>;

type QueryParams = Record<string, string | number | undefined>;

function buildQuery(params: QueryParams): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number] => entry[1] !== undefined && entry[1] !== '',
  );
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

function extractErrorMessage(payload: unknown): string {
  if (
    payload &&
    typeof payload === 'object' &&
    'error' in payload &&
    typeof payload.error === 'string'
  ) {
    return payload.error;
  }
  return GENERIC_ERROR_MESSAGE;
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export function createApiClient({
  baseUrl,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetchFn,
}: ApiClientOptions) {
  const root = baseUrl.replace(/\/+$/, '');

  async function request<T>(
    path: string,
    { method = 'GET', body, signal }: RequestOptions = {},
  ): Promise<T> {
    const doFetch = fetchFn ?? fetch;
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    const onExternalAbort = () => controller.abort();
    signal?.addEventListener('abort', onExternalAbort);

    let response: Response;
    try {
      response = await doFetch(`${root}${path}`, {
        method,
        headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (error) {
      if (signal?.aborted) throw error;
      throw new ApiError(timedOut ? TIMEOUT_ERROR_MESSAGE : NETWORK_ERROR_MESSAGE, 0);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onExternalAbort);
    }

    if (response.status === 204) return undefined as T;

    const payload = await parseJson(response);
    if (!response.ok) throw new ApiError(extractErrorMessage(payload), response.status);

    return payload as T;
  }

  return {
    getCategories: (signal?: AbortSignal) =>
      request<ListResponse<Category>>('/categories', { signal }).then((r) => r.data),

    getContents: ({ search, category, page, limit }: ContentsQuery = {}, signal?: AbortSignal) =>
      request<Paginated<Content>>(
        '/contents' + buildQuery({ search: search?.trim(), category, page, limit }),
        { signal },
      ),

    getContent: (id: number, signal?: AbortSignal) =>
      request<ContentDetail>(`/contents/${id}`, { signal }),

    getFavorites: (signal?: AbortSignal) =>
      request<ListResponse<Content>>('/favorites', { signal }).then((r) => r.data),

    addFavorite: (contentId: number) =>
      request<Content>('/favorites', { method: 'POST', body: { contentId } }),

    removeFavorite: (contentId: number) =>
      request<void>(`/favorites/${contentId}`, { method: 'DELETE' }),
  };
}
