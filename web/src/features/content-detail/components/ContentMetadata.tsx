import {
  formatContentType,
  formatDuration,
  formatPublishedAt,
  type ContentDetail,
} from '@namu/shared';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import CategoryRounded from '@mui/icons-material/CategoryRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import type { SvgIconComponent } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

interface MetadataItem {
  label: string;
  value: string;
  icon: SvgIconComponent;
  dateTime?: string;
}

interface ContentMetadataProps {
  content: ContentDetail;
}

function toMetadataItems(content: ContentDetail): MetadataItem[] {
  return [
    { label: 'Tipo', value: formatContentType(content.type), icon: CategoryRounded },
    { label: 'Duração', value: formatDuration(content.durationSeconds), icon: ScheduleRounded },
    { label: 'Instrutor(a)', value: content.instructor, icon: PersonRounded },
    {
      label: 'Publicado em',
      value: formatPublishedAt(content.publishedAt),
      icon: CalendarMonthRounded,
      dateTime: content.publishedAt,
    },
  ];
}

export function ContentMetadata({ content }: ContentMetadataProps) {
  return (
    <dl className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
      {toMetadataItems(content).map(({ label, value, icon: Icon, dateTime }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3"
        >
          <Icon color="primary" aria-hidden />
          <div className="min-w-0">
            <Typography component="dt" variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography component="dd" variant="body2" sx={{ fontWeight: 600 }}>
              {dateTime ? <time dateTime={dateTime}>{value}</time> : value}
            </Typography>
          </div>
        </div>
      ))}
    </dl>
  );
}
