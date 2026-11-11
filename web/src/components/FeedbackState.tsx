import type { SvgIconComponent } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface FeedbackStateProps {
  icon: SvgIconComponent;
  title: string;
  description?: string;
  actions?: ReactNode;
  role?: 'alert' | 'status';
}

export function FeedbackState({
  icon: Icon,
  title,
  description,
  actions,
  role = 'status',
}: FeedbackStateProps) {
  return (
    <div role={role} className="flex flex-col items-center gap-3 rounded-xl px-6 py-16 text-center">
      <Icon color="primary" sx={{ fontSize: 56, opacity: 0.8 }} aria-hidden />
      <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" className="max-w-md">
          {description}
        </Typography>
      )}
      {actions && <div className="mt-2 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
