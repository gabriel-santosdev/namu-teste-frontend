import type { ContentsQuery } from './types';

export const CONTENTS_PAGE_SIZE = 10;

export const queryKeys = {
  categories: () => ['categories'] as const,
  contents: (query: ContentsQuery) => ['contents', query] as const,
  content: (id: number) => ['content', id] as const,
  favorites: () => ['favorites'] as const,
};
