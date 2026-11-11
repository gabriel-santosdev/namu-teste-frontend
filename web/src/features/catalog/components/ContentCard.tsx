import { formatContentType, formatDuration, type Content, type ContentType } from '@namu/shared';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
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
import { memo } from 'react';
import { Link } from 'react-router';
import { contentDetailPath } from '@/app/paths';
import { ContentThumbnail } from '@/components/ContentThumbnail';

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
  const TypeIcon = CONTENT_TYPE_ICONS[content.type];

  return (
    <Card className="group relative flex h-full animate-fade-in-up flex-col transition duration-200 hover:shadow-lg active:scale-[0.99] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-(--mui-palette-primary-main)">
      <div className="relative aspect-video overflow-hidden bg-stone-200">
        <ContentThumbnail
          src={content.thumbnailUrl}
          loading="lazy"
          className="group-hover:scale-105"
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
          <Link
            to={contentDetailPath(content.id)}
            className="decoration-2 underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:text-(--mui-palette-primary-dark) group-hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {content.title}
            <span className="sr-only">, ver detalhes</span>
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" className="line-clamp-2">
          {content.description}
        </Typography>
        <span
          aria-hidden
          className="mt-auto flex items-center gap-1 border-t border-black/10 pt-3 text-sm font-semibold text-(--mui-palette-primary-main) group-hover:text-(--mui-palette-primary-dark) group-has-[a:focus-visible]:text-(--mui-palette-primary-dark)"
        >
          Ver detalhes
          <ArrowForwardRounded
            fontSize="small"
            className="transition-transform duration-200 group-hover:translate-x-1 group-has-[a:focus-visible]:translate-x-1"
          />
        </span>
      </CardContent>
    </Card>
  );
});
