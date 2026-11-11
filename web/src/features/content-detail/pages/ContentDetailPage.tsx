import { getErrorMessage, isClientError } from '@namu/shared';
import SearchOffRounded from '@mui/icons-material/SearchOffRounded';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { paths } from '@/app/paths';
import { BackButton } from '@/components/BackButton';
import { ErrorState } from '@/components/ErrorState';
import { FeedbackState } from '@/components/FeedbackState';
import { ContentDetailSkeleton } from '../components/ContentDetailSkeleton';
import { ContentDetailView } from '../components/ContentDetailView';
import { useContent } from '../hooks/useContent';
import { useContentId } from '../hooks/useContentId';

const catalogButton = (
  <Button component={Link} to={paths.catalog} variant="outlined">
    Ver todos os conteúdos
  </Button>
);

function ContentNotFound() {
  return (
    <FeedbackState
      icon={SearchOffRounded}
      title="Conteúdo não encontrado"
      description="O conteúdo que você procura não existe ou foi removido."
      actions={catalogButton}
    />
  );
}

interface ContentDetailContainerProps {
  id: number;
}

function ContentDetailContainer({ id }: ContentDetailContainerProps) {
  const { data, isPending, isError, error, refetch, isFetching } = useContent(id);

  if (isPending) return <ContentDetailSkeleton />;

  if (isError) {
    if (isClientError(error)) return <ContentNotFound />;
    return (
      <ErrorState
        title="Não foi possível carregar o conteúdo"
        message={getErrorMessage(error)}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        extraActions={catalogButton}
      />
    );
  }

  return <ContentDetailView content={data} />;
}

export function ContentDetailPage() {
  const id = useContentId();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  return (
    <div className="flex flex-col gap-4">
      <BackButton fallbackTo={paths.catalog} label="Voltar para conteúdos" />
      {id === null ? <ContentNotFound /> : <ContentDetailContainer id={id} />}
    </div>
  );
}
