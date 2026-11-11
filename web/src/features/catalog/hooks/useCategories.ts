import { queryKeys, type Category } from '@namu/shared';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { api } from '@/lib/api';

const categoriesQuery = queryOptions({
  queryKey: queryKeys.categories(),
  queryFn: ({ signal }) => api.getCategories(signal),
  staleTime: Infinity,
});

function toNameBySlug(categories: Category[]): Map<string, string> {
  return new Map(categories.map(({ slug, name }) => [slug, name]));
}

export function useCategories() {
  return useQuery(categoriesQuery);
}

export function useCategoryName() {
  const { data: nameBySlug } = useQuery({ ...categoriesQuery, select: toNameBySlug });

  return useCallback((slug: string) => nameBySlug?.get(slug) ?? slug, [nameBySlug]);
}
