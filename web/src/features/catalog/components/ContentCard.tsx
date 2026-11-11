import { formatContentType, formatDuration, type Content } from '@namu/shared';
import { memo } from 'react';

interface ContentCardProps {
  content: Content;
  categoryName: string;
}

export const ContentCard = memo(function ContentCard({ content, categoryName }: ContentCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
      <img
        src={content.thumbnailUrl}
        alt=""
        width={640}
        height={360}
        loading="lazy"
        className="aspect-video w-full bg-stone-200 object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
          {categoryName}
        </p>
        <h2 className="text-base font-semibold leading-snug text-stone-900">{content.title}</h2>
        <dl className="mt-auto flex gap-4 pt-2 text-sm text-stone-600">
          <div>
            <dt className="sr-only">Tipo</dt>
            <dd>{formatContentType(content.type)}</dd>
          </div>
          <div>
            <dt className="sr-only">Duração</dt>
            <dd>{formatDuration(content.durationSeconds)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
});
