import { queryKeys, type Category } from '@namu/shared';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { api } from '@/lib/api';

function toNameBySlug(categories: Category[]): Map<string, string> {
  return new Map(categories.map(({ slug, name }) => [slug, name]));
}

export function useCategoryName() {
  const { data: nameBySlug } = useQuery({
    queryKey: queryKeys.categories(),
    queryFn: ({ signal }) => api.getCategories(signal),
    staleTime: Infinity,
    select: toNameBySlug,
  });

  return useCallback((slug: string) => nameBySlug?.get(slug) ?? slug, [nameBySlug]);
}
