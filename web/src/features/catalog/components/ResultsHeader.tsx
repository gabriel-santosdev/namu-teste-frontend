import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import type { CatalogFilters } from '../hooks/useCatalogFilters';
import { useCategoryName } from '../hooks/useCategories';

interface ResultsHeaderProps {
  filters: CatalogFilters;
  total?: number;
  isLoading: boolean;
}

function formatResultsCount(total: number): string {
  return total === 1 ? '1 conteúdo' : `${total} conteúdos`;
}

function ResultsCount({ total, isLoading }: Pick<ResultsHeaderProps, 'total' | 'isLoading'>) {
  if (isLoading) return <Skeleton width={80} aria-hidden />;
  if (total === undefined) return null;

  return (
    <Typography role="status" variant="body2" color="text.secondary">
      {formatResultsCount(total)}
    </Typography>
  );
}

export function ResultsHeader({ filters, total, isLoading }: ResultsHeaderProps) {
  const getCategoryName = useCategoryName();
  const categoryName = filters.category ? getCategoryName(filters.category) : '';

  const title = filters.search
    ? `Resultados para “${filters.search}”`
    : categoryName || 'Todos os conteúdos';
  const subtitle = filters.search && categoryName ? `em ${categoryName}` : '';

  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-black/10 pb-3">
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
        {title}
        {subtitle && (
          <Typography component="span" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
            {subtitle}
          </Typography>
        )}
      </Typography>
      <ResultsCount total={total} isLoading={isLoading} />
    </div>
  );
}
