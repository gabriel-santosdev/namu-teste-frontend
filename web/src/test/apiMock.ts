import type { ApiClient } from '@namu/shared';

export const api: jest.Mocked<ApiClient> = {
  getCategories: jest.fn(),
  getContents: jest.fn(),
  getContent: jest.fn(),
  getFavorites: jest.fn(),
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
};
