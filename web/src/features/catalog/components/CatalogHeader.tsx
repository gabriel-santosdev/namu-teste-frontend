import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface CatalogHeaderProps {
  titleId: string;
  children: ReactNode;
}

export function CatalogHeader({ titleId, children }: CatalogHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1">
        <Typography id={titleId} variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Conteúdos
        </Typography>
        <Typography color="text.secondary">
          Meditações, yoga, nutrição e muito mais para o seu bem-estar.
        </Typography>
      </div>
      {children}
    </header>
  );
}
