import { CONTENTS_PAGE_SIZE, getErrorMessage } from '@namu/shared';
import { Pagination } from '@/components/Pagination';
import { ContentList } from '../components/ContentList';
import { useContents } from '../hooks/useContents';
import { usePageParam } from '../hooks/usePageParam';

function CatalogResults() {
  const [page, setPage] = usePageParam();
  const { data, isPending, isError, error, isPlaceholderData } = useContents({
    page,
    limit: CONTENTS_PAGE_SIZE,
  });

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  if (isPending) return <p className="text-stone-600">Carregando conteúdos…</p>;
  if (isError) return <p role="alert">{getErrorMessage(error)}</p>;

  return (
    <div
      aria-busy={isPlaceholderData}
      className={`flex flex-col gap-8 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}
    >
      <ContentList contents={data.data} />
      <Pagination
        page={page}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
        disabled={isPlaceholderData}
      />
    </div>
  );
}

export function CatalogPage() {
  return (
    <section aria-labelledby="catalog-title" className="flex flex-col gap-6">
      <h1 id="catalog-title" className="text-2xl font-semibold text-stone-900">
        Conteúdos
      </h1>
      <CatalogResults />
    </section>
  );
}
