import type { Category, Content } from '@namu/shared';
import { http, HttpResponse } from 'msw';
import { categories as defaultCategories } from './fixtures';

export const TEST_API_URL = 'http://localhost:3333';

interface MockDatabase {
  categories: Category[];
  contents: Content[];
  favorites: Set<number>;
}

const db: MockDatabase = {
  categories: [],
  contents: [],
  favorites: new Set(),
};

export function resetMockApi() {
  db.categories = [...defaultCategories];
  db.contents = [];
  db.favorites = new Set();
}

export function seedContents(contents: Content[]) {
  db.contents = [...contents];
}

export function seedFavorites(ids: number[]) {
  db.favorites = new Set(ids);
}

export function isFavoriteOnServer(id: number): boolean {
  return db.favorites.has(id);
}

export function apiUrl(path: string): string {
  return `${TEST_API_URL}${path}`;
}

export function errorResponse(status: number, message: string) {
  return HttpResponse.json({ error: message }, { status });
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function findContent(id: number): Content | undefined {
  return db.contents.find((content) => content.id === id);
}

export const handlers = [
  http.get(apiUrl('/categories'), () => HttpResponse.json({ data: db.categories })),

  http.get(apiUrl('/contents'), ({ request }) => {
    const params = new URL(request.url).searchParams;
    const page = Number(params.get('page') ?? 1);
    const limit = Number(params.get('limit') ?? 10);
    const category = params.get('category');
    const search = normalize(params.get('search') ?? '').trim();

    const filtered = db.contents
      .filter((content) => !category || content.category === category)
      .filter((content) => !search || normalize(content.title).includes(search));
    const start = (page - 1) * limit;

    return HttpResponse.json({
      data: filtered.slice(start, start + limit),
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  http.get(apiUrl('/contents/:id'), ({ params }) => {
    const id = Number(params.id);
    const content = findContent(id);
    if (!content) return errorResponse(404, 'Conteúdo não encontrado.');
    return HttpResponse.json({ ...content, isFavorite: db.favorites.has(id) });
  }),

  http.get(apiUrl('/favorites'), () =>
    HttpResponse.json({ data: db.contents.filter(({ id }) => db.favorites.has(id)) }),
  ),

  http.post(apiUrl('/favorites'), async ({ request }) => {
    const { contentId } = (await request.json()) as { contentId: number };
    const content = findContent(contentId);
    if (!content) return errorResponse(404, 'Conteúdo não encontrado.');
    if (db.favorites.has(contentId)) return errorResponse(409, 'Conteúdo já está nos favoritos.');
    db.favorites.add(contentId);
    return HttpResponse.json(content, { status: 201 });
  }),

  http.delete(apiUrl('/favorites/:contentId'), ({ params }) => {
    const id = Number(params.contentId);
    if (!db.favorites.has(id)) return errorResponse(404, 'Conteúdo não está nos favoritos.');
    db.favorites.delete(id);
    return new HttpResponse(null, { status: 204 });
  }),
];
