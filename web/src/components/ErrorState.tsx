import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';
import { FeedbackState } from './FeedbackState';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  extraActions?: ReactNode;
}

export function ErrorState({
  title = 'Não foi possível carregar',
  message,
  onRetry,
  isRetrying = false,
  extraActions,
}: ErrorStateProps) {
  return (
    <FeedbackState
      role="alert"
      icon={ErrorOutlineRounded}
      title={title}
      description={message}
      actions={
        <>
          {onRetry && (
            <Button
              variant="contained"
              disableElevation
              startIcon={<RefreshRounded />}
              loading={isRetrying}
              loadingPosition="start"
              onClick={onRetry}
            >
              Tentar novamente
            </Button>
          )}
          {extraActions}
        </>
      }
    />
  );
}
