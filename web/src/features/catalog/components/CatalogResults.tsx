import { CONTENTS_PAGE_SIZE, getErrorMessage, isClientError } from '@namu/shared';
import SearchOffRounded from '@mui/icons-material/SearchOffRounded';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import type { ChangeEvent } from 'react';
import { ErrorState } from '@/components/ErrorState';
import { FeedbackState } from '@/components/FeedbackState';
import { scrollToTop } from '@/lib/scroll';
import type { CatalogFilters } from '../hooks/useCatalogFilters';
import { useContents } from '../hooks/useContents';
import { ContentList } from './ContentList';
import { ContentListSkeleton } from './ContentListSkeleton';
import { ResultsHeader } from './ResultsHeader';

interface CatalogResultsProps {
  filters: CatalogFilters;
  hasActiveFilters: boolean;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function CatalogResults({
  filters,
  hasActiveFilters,
  onPageChange,
  onClearFilters,
}: CatalogResultsProps) {
  const { data, isPending, isError, error, refetch, isFetching } = useContents({
    search: filters.search,
    category: filters.category,
    page: filters.page,
    limit: CONTENTS_PAGE_SIZE,
  });

  const canReset = hasActiveFilters || filters.page > 1;
  const clearFiltersButton = (
    <Button variant="outlined" onClick={onClearFilters}>
      Ver todos os conteúdos
    </Button>
  );

  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
    scrollToTop();
  };

  const renderContent = () => {
    if (isPending) return <ContentListSkeleton />;

    if (isError) {
      const isPermanent = isClientError(error);
      return (
        <ErrorState
          title="Não foi possível carregar os conteúdos"
          message={getErrorMessage(error)}
          onRetry={isPermanent ? undefined : () => refetch()}
          isRetrying={isFetching}
          extraActions={isPermanent && canReset ? clearFiltersButton : undefined}
        />
      );
    }

    if (data.data.length === 0) {
      return (
        <FeedbackState
          icon={SearchOffRounded}
          title="Nenhum conteúdo encontrado"
          description={
            hasActiveFilters
              ? 'Tente buscar por outro título ou escolher outra categoria.'
              : 'Ainda não há conteúdos disponíveis por aqui.'
          }
          actions={canReset ? clearFiltersButton : undefined}
        />
      );
    }

    return (
      <>
        <ContentList contents={data.data} />
        {data.totalPages > 1 && (
          <Pagination
            className="mt-4 self-center"
            count={data.totalPages}
            page={filters.page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <ResultsHeader filters={filters} total={data?.total} isLoading={isPending} />
      {renderContent()}
    </div>
  );
}
