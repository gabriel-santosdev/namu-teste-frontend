import {
  isApiError,
  queryKeys,
  type Content,
  type ContentDetail,
} from '@namu/shared';
import type { QueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export const FAVORITE_MUTATION_KEY = ['favorite'] as const;

export interface FavoriteChange {
  contentId: number;
  shouldFavorite: boolean;
}

interface RemovedFavorite {
  content: Content;
  index: number;
}

export interface FavoriteChangeContext {
  removedFavorite?: RemovedFavorite;
}

function isAlreadyInDesiredState(
  error: unknown,
  shouldFavorite: boolean,
): boolean {
  if (!isApiError(error)) return false;
  return shouldFavorite ? error.status === 409 : error.isNotFound;
}

export async function setFavorite({
  contentId,
  shouldFavorite,
}: FavoriteChange): Promise<void> {
  try {
    if (shouldFavorite) await api.addFavorite(contentId);
    else await api.removeFavorite(contentId);
  } catch (error) {
    if (!isAlreadyInDesiredState(error, shouldFavorite)) throw error;
  }
}

function setContentFavorite(
  queryClient: QueryClient,
  contentId: number,
  isFavorite: boolean,
) {
  queryClient.setQueryData<ContentDetail>(
    queryKeys.content(contentId),
    current => current && { ...current, isFavorite },
  );
}

function removeFromFavorites(
  queryClient: QueryClient,
  contentId: number,
): RemovedFavorite | undefined {
  const favorites = queryClient.getQueryData<Content[]>(queryKeys.favorites());
  const index = favorites?.findIndex(({ id }) => id === contentId) ?? -1;
  if (!favorites || index < 0) return undefined;

  queryClient.setQueryData<Content[]>(
    queryKeys.favorites(),
    favorites.filter(({ id }) => id !== contentId),
  );
  return { content: favorites[index], index };
}

function restoreFavorite(
  queryClient: QueryClient,
  { content, index }: RemovedFavorite,
) {
  queryClient.setQueryData<Content[]>(queryKeys.favorites(), current => {
    if (!current || current.some(({ id }) => id === content.id)) return current;
    return [...current.slice(0, index), content, ...current.slice(index)];
  });
}

export async function applyFavoriteChange(
  queryClient: QueryClient,
  { contentId, shouldFavorite }: FavoriteChange,
): Promise<FavoriteChangeContext> {
  await Promise.all([
    queryClient.cancelQueries({ queryKey: queryKeys.content(contentId) }),
    queryClient.cancelQueries({ queryKey: queryKeys.favorites() }),
  ]);
  setContentFavorite(queryClient, contentId, shouldFavorite);
  return {
    removedFavorite: shouldFavorite
      ? undefined
      : removeFromFavorites(queryClient, contentId),
  };
}

export function revertFavoriteChange(
  queryClient: QueryClient,
  { contentId, shouldFavorite }: FavoriteChange,
  context?: FavoriteChangeContext,
) {
  setContentFavorite(queryClient, contentId, !shouldFavorite);
  if (context?.removedFavorite) {
    restoreFavorite(queryClient, context.removedFavorite);
  }
}

export async function syncFavoriteQueries(
  queryClient: QueryClient,
  contentId: number,
) {
  if (queryClient.isMutating({ mutationKey: FAVORITE_MUTATION_KEY }) > 1) {
    return;
  }
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.content(contentId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.favorites() }),
  ]);
}
