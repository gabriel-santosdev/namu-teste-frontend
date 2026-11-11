import { formatContentType, formatDuration, type Content, type ContentType } from '@namu/shared';
import ArticleRounded from '@mui/icons-material/ArticleRounded';
import HeadphonesRounded from '@mui/icons-material/HeadphonesRounded';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import type { SvgIconComponent } from '@mui/icons-material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

const CONTENT_TYPE_ICONS: Record<ContentType, SvgIconComponent> = {
  audio: HeadphonesRounded,
  video: PlayCircleRounded,
  article: ArticleRounded,
};

interface ContentCardProps {
  content: Content;
  categoryName: string;
}

export const ContentCard = memo(function ContentCard({ content, categoryName }: ContentCardProps) {
  const TypeIcon = CONTENT_TYPE_ICONS[content.type];

  return (
    <Card className="flex h-full flex-col">
      <CardMedia
        component="img"
        image={content.thumbnailUrl}
        alt=""
        width={640}
        height={360}
        loading="lazy"
        className="aspect-video object-cover"
        sx={{ bgcolor: 'grey.200' }}
      />
      <CardContent className="flex flex-1 flex-col gap-1">
        <Typography variant="overline" component="p" color="primary" sx={{ lineHeight: 1.6 }}>
          {categoryName}
        </Typography>
        <Typography
          variant="subtitle1"
          component="h2"
          title={content.title}
          className="line-clamp-2"
          sx={{ fontWeight: 600, lineHeight: 1.35 }}
        >
          {content.title}
        </Typography>
        <dl className="mt-auto flex flex-wrap gap-2 pt-3">
          <div>
            <dt className="sr-only">Tipo</dt>
            <dd>
              <Chip size="small" icon={<TypeIcon />} label={formatContentType(content.type)} />
            </dd>
          </div>
          <div>
            <dt className="sr-only">Duração</dt>
            <dd>
              <Chip
                size="small"
                variant="outlined"
                icon={<ScheduleRounded />}
                label={formatDuration(content.durationSeconds)}
              />
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
});
