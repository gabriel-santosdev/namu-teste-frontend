import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import Button from '@mui/material/Button';
import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

const INITIAL_LOCATION_KEY = 'default';

interface BackButtonProps {
  fallbackTo: string;
  label: string;
}

export function BackButton({ fallbackTo, label }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasAppHistory = location.key !== INITIAL_LOCATION_KEY;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!hasAppHistory || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    navigate(-1);
  };

  return (
    <Button
      component={Link}
      to={fallbackTo}
      onClick={handleClick}
      startIcon={<ArrowBackRounded />}
      sx={{ alignSelf: 'flex-start', ml: -1 }}
    >
      {label}
    </Button>
  );
}
