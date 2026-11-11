import type {
  Category,
  Content,
  ContentDetail,
  ContentsQuery,
  ListResponse,
  Paginated,
} from '../types';
import { createHttpClient, type HttpClientOptions } from './http';

export type ApiClientOptions = HttpClientOptions;

export type ApiClient = ReturnType<typeof createApiClient>;

function toContentsParams({ search, category, page, limit }: ContentsQuery) {
  return {
    search: search?.trim() || undefined,
    category: category || undefined,
    page,
    limit,
  };
}

export function createApiClient(options: ApiClientOptions) {
  const http = createHttpClient(options);

  return {
    getCategories: async (signal?: AbortSignal) => {
      const { data } = await http.get<ListResponse<Category>>('/categories', { signal });
      return data.data;
    },

    getContents: async (query: ContentsQuery = {}, signal?: AbortSignal) => {
      const { data } = await http.get<Paginated<Content>>('/contents', {
        params: toContentsParams(query),
        signal,
      });
      return data;
    },

    getContent: async (id: number, signal?: AbortSignal) => {
      const { data } = await http.get<ContentDetail>(`/contents/${id}`, { signal });
      return data;
    },

    getFavorites: async (signal?: AbortSignal) => {
      const { data } = await http.get<ListResponse<Content>>('/favorites', { signal });
      return data.data;
    },

    addFavorite: async (contentId: number) => {
      const { data } = await http.post<Content>('/favorites', { contentId });
      return data;
    },

    removeFavorite: async (contentId: number) => {
      await http.delete(`/favorites/${contentId}`);
    },
  };
}
