export type ContentType = 'audio' | 'video' | 'article';

export interface Category {
  slug: string;
  name: string;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  category: string;
  type: ContentType;
  durationSeconds: number;
  instructor: string;
  thumbnailUrl: string | null;
  publishedAt: string;
}

export interface ContentDetail extends Content {
  isFavorite: boolean;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListResponse<T> {
  data: T[];
}

export interface ContentsQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}
