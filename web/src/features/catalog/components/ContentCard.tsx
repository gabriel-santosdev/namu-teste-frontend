import { formatContentType, formatDuration, type Content, type ContentType } from '@namu/shared';
import ArticleRounded from '@mui/icons-material/ArticleRounded';
import HeadphonesRounded from '@mui/icons-material/HeadphonesRounded';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import type { SvgIconComponent } from '@mui/icons-material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import { memo, useState } from 'react';

const CONTENT_TYPE_ICONS: Record<ContentType, SvgIconComponent> = {
  audio: HeadphonesRounded,
  video: PlayCircleRounded,
  article: ArticleRounded,
};

const badgeBaseSx: SxProps<Theme> = {
  height: 26,
  fontWeight: 600,
  fontSize: '0.75rem',
  backdropFilter: 'blur(6px)',
};

const typeBadgeSx: SxProps<Theme> = {
  ...badgeBaseSx,
  bgcolor: ({ palette }) => alpha(palette.common.white, 0.9),
  color: 'text.primary',
  '& .MuiChip-icon': { color: 'primary.main' },
};

const durationBadgeSx: SxProps<Theme> = {
  ...badgeBaseSx,
  bgcolor: ({ palette }) => alpha(palette.common.black, 0.55),
  color: 'common.white',
  '& .MuiChip-icon': { color: 'common.white' },
};

interface ContentCardProps {
  content: Content;
  categoryName: string;
}

export const ContentCard = memo(function ContentCard({ content, categoryName }: ContentCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const TypeIcon = CONTENT_TYPE_ICONS[content.type];

  return (
    <Card className="flex h-full animate-fade-in-up flex-col">
      <div className="relative aspect-video overflow-hidden bg-stone-200">
        <img
          src={content.thumbnailUrl}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <dl className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div>
            <dt className="sr-only">Tipo</dt>
            <dd>
              <Chip
                size="small"
                icon={<TypeIcon />}
                label={formatContentType(content.type)}
                sx={typeBadgeSx}
              />
            </dd>
          </div>
          <div>
            <dt className="sr-only">Duração</dt>
            <dd>
              <Chip
                size="small"
                icon={<ScheduleRounded />}
                label={formatDuration(content.durationSeconds)}
                sx={durationBadgeSx}
              />
            </dd>
          </div>
        </dl>
      </div>
      <CardContent className="flex flex-1 flex-col gap-1.5 p-5">
        <Typography
          variant="caption"
          component="p"
          color="primary"
          sx={{ fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}
        >
          {categoryName}
        </Typography>
        <Typography
          variant="subtitle1"
          component="h3"
          title={content.title}
          className="line-clamp-2"
          sx={{ fontWeight: 700, lineHeight: 1.35 }}
        >
          {content.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="line-clamp-2">
          {content.description}
        </Typography>
      </CardContent>
    </Card>
  );
});
