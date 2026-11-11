import { CONTENTS_PAGE_SIZE, getErrorMessage } from '@namu/shared';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import type { ChangeEvent } from 'react';
import { ContentList } from '../components/ContentList';
import { useContents } from '../hooks/useContents';
import { usePageParam } from '../hooks/usePageParam';

function CatalogResults() {
  const [page, setPage] = usePageParam();
  const { data, isPending, isError, error, isPlaceholderData } = useContents({
    page,
    limit: CONTENTS_PAGE_SIZE,
  });

  const handlePageChange = (_event: ChangeEvent<unknown>, nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  if (isPending) return <Typography color="text.secondary">Carregando conteúdos…</Typography>;
  if (isError) return <Typography role="alert">{getErrorMessage(error)}</Typography>;

  return (
    <div
      aria-busy={isPlaceholderData}
      className={`flex flex-col gap-10 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}
    >
      <ContentList contents={data.data} />
      {data.totalPages > 1 && (
        <Pagination
          className="self-center"
          count={data.totalPages}
          page={page}
          onChange={handlePageChange}
          disabled={isPlaceholderData}
          color="primary"
          shape="rounded"
        />
      )}
    </div>
  );
}

export function CatalogPage() {
  return (
    <section aria-labelledby="catalog-title" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Typography id="catalog-title" variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Conteúdos
        </Typography>
        <Typography color="text.secondary">
          Meditações, yoga, nutrição e muito mais para o seu bem-estar.
        </Typography>
      </div>
      <CatalogResults />
    </section>
  );
}
