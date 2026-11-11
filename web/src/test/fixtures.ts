import type { Category, Content, ContentDetail, Paginated } from '@namu/shared';

export const categories: Category[] = [
  { slug: 'meditacao', name: 'Meditação' },
  { slug: 'yoga', name: 'Yoga' },
];

export function buildContent(overrides: Partial<Content> = {}): Content {
  return {
    id: 1,
    title: 'Meditação para iniciantes',
    description: 'Uma introdução leve à prática da meditação.',
    category: 'meditacao',
    type: 'audio',
    durationSeconds: 600,
    instructor: 'Ana Souza',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    publishedAt: '2024-03-15T00:00:00.000Z',
    ...overrides,
  };
}

export function buildContentDetail(overrides: Partial<ContentDetail> = {}): ContentDetail {
  return { ...buildContent(), isFavorite: false, ...overrides };
}

export function paginate(data: Content[], overrides: Partial<Paginated<Content>> = {}) {
  return { data, page: 1, limit: 10, total: data.length, totalPages: 1, ...overrides };
}
