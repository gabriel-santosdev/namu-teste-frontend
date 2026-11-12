import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FAVORITE_MUTATION_KEY,
  applyFavoriteChange,
  revertFavoriteChange,
  setFavorite,
  syncFavoriteQueries,
  type FavoriteChangeContext,
} from '../favoriteCache';

interface UseRemoveFavoriteOptions {
  onError?: (error: Error, contentId: number) => void;
}

export function useRemoveFavorite({ onError }: UseRemoveFavoriteOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number, FavoriteChangeContext>({
    mutationKey: FAVORITE_MUTATION_KEY,
    mutationFn: contentId => setFavorite({ contentId, shouldFavorite: false }),
    onMutate: contentId =>
      applyFavoriteChange(queryClient, { contentId, shouldFavorite: false }),
    onError: (error, contentId, context) => {
      revertFavoriteChange(
        queryClient,
        { contentId, shouldFavorite: false },
        context,
      );
      onError?.(error, contentId);
    },
    onSettled: (_data, _error, contentId) =>
      syncFavoriteQueries(queryClient, contentId),
  });
}
