import type { ContentType } from './types';

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  audio: 'Áudio',
  video: 'Vídeo',
  article: 'Artigo',
};

export function formatContentType(type: ContentType): string {
  return CONTENT_TYPE_LABELS[type];
}

export function formatDuration(totalSeconds: number): string {
  const totalMinutes = Math.max(1, Math.round(totalSeconds / SECONDS_PER_MINUTE));
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;

  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}
