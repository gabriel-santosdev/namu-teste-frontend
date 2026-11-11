import { isApiError, queryKeys, type ContentDetail } from '@namu/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface ToggleFavoriteVariables {
  shouldFavorite: boolean;
}

interface ToggleFavoriteContext {
  previous?: ContentDetail;
}

function isAlreadyInDesiredState(error: unknown, shouldFavorite: boolean): boolean {
  if (!isApiError(error)) return false;
  return shouldFavorite ? error.status === 409 : error.isNotFound;
}

async function setFavorite(contentId: number, shouldFavorite: boolean): Promise<void> {
  try {
    if (shouldFavorite) await api.addFavorite(contentId);
    else await api.removeFavorite(contentId);
  } catch (error) {
    if (!isAlreadyInDesiredState(error, shouldFavorite)) throw error;
  }
}

export function useToggleFavorite(contentId: number) {
  const queryClient = useQueryClient();
  const contentKey = queryKeys.content(contentId);
  const mutationKey = ['favorite', contentId];

  return useMutation<void, Error, ToggleFavoriteVariables, ToggleFavoriteContext>({
    mutationKey,
    scope: { id: `favorite-${contentId}` },
    mutationFn: ({ shouldFavorite }) => setFavorite(contentId, shouldFavorite),
    onMutate: async ({ shouldFavorite }) => {
      await queryClient.cancelQueries({ queryKey: contentKey });
      const previous = queryClient.getQueryData<ContentDetail>(contentKey);
      queryClient.setQueryData<ContentDetail>(
        contentKey,
        (current) => current && { ...current, isFavorite: shouldFavorite },
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(contentKey, context.previous);
    },
    onSettled: async () => {
      if (queryClient.isMutating({ mutationKey }) > 1) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: contentKey }),
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites() }),
      ]);
    },
  });
}
