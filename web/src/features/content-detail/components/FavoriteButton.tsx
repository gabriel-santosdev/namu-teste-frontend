import { getErrorMessage } from '@namu/shared';
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRounded from '@mui/icons-material/FavoriteRounded';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';
import { useState, type SyntheticEvent } from 'react';
import { useToggleFavorite } from '@/features/favorites/hooks/useToggleFavorite';

const ERROR_AUTO_HIDE_MS = 6000;

interface FavoriteButtonProps {
  contentId: number;
  isFavorite: boolean;
}

function buildErrorMessage(shouldFavorite: boolean, error: unknown): string {
  const action = shouldFavorite
    ? 'Não foi possível favoritar.'
    : 'Não foi possível remover dos favoritos.';
  return `${action} ${getErrorMessage(error)}`;
}

export function FavoriteButton({ contentId, isFavorite }: FavoriteButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const { mutate } = useToggleFavorite(contentId);

  const handleClick = () => {
    const shouldFavorite = !isFavorite;
    setErrorMessage(null);
    setAnnouncement(shouldFavorite ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.');
    mutate(
      { shouldFavorite },
      {
        onError: (error) => {
          setAnnouncement('');
          setErrorMessage(buildErrorMessage(shouldFavorite, error));
        },
      },
    );
  };

  const handleCloseError = (
    _event?: SyntheticEvent | Event | null,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') return;
    setErrorMessage(null);
  };

  return (
    <>
      <Button
        variant={isFavorite ? 'contained' : 'outlined'}
        disableElevation
        size="large"
        startIcon={isFavorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}
        onClick={handleClick}
        sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, borderRadius: 999, px: 3 }}
      >
        {isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
      </Button>
      <span role="status" className="sr-only">
        {announcement}
      </span>
      <Snackbar
        open={errorMessage !== null}
        autoHideDuration={ERROR_AUTO_HIDE_MS}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={handleCloseError} sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
