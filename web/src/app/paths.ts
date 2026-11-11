export const paths = {
  catalog: '/',
  contentDetail: '/conteudos/:id',
} as const;

export function contentDetailPath(id: number): string {
  return `/conteudos/${id}`;
}
