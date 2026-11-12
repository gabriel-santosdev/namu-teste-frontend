import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FAVORITE_MUTATION_KEY,
  applyFavoriteChange,
  revertFavoriteChange,
  setFavorite,
  syncFavoriteQueries,
  type FavoriteChangeContext,
} from '../favoriteCache';

interface ToggleFavoriteVariables {
  shouldFavorite: boolean;
}

export function useToggleFavorite(contentId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    ToggleFavoriteVariables,
    FavoriteChangeContext
  >({
    mutationKey: [...FAVORITE_MUTATION_KEY, contentId],
    scope: { id: `favorite-${contentId}` },
    mutationFn: ({ shouldFavorite }) =>
      setFavorite({ contentId, shouldFavorite }),
    onMutate: ({ shouldFavorite }) =>
      applyFavoriteChange(queryClient, { contentId, shouldFavorite }),
    onError: (_error, { shouldFavorite }, context) => {
      revertFavoriteChange(queryClient, { contentId, shouldFavorite }, context);
    },
    onSettled: () => syncFavoriteQueries(queryClient, contentId),
  });
}
