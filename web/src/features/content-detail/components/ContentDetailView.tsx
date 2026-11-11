import type { ContentDetail } from '@namu/shared';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useCategoryName } from '@/features/catalog/hooks/useCategories';
import { ContentMetadata } from './ContentMetadata';
import { FavoriteButton } from './FavoriteButton';

const DESCRIPTION_TITLE_ID = 'content-description-title';

interface ContentDetailViewProps {
  content: ContentDetail;
}

export function ContentDetailView({ content }: ContentDetailViewProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const getCategoryName = useCategoryName();

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [content.id]);

  return (
    <article className="grid animate-fade-in-up gap-8 md:grid-cols-2 md:items-start lg:gap-12">
      <title>{`${content.title} · Namu`}</title>
      <div className="aspect-video overflow-hidden rounded-2xl bg-stone-200 shadow-sm">
        <img
          src={content.thumbnailUrl}
          alt=""
          width={640}
          height={360}
          onLoad={() => setIsImageLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <Typography
            variant="overline"
            component="p"
            color="primary"
            sx={{ fontWeight: 700, letterSpacing: 0.8, lineHeight: 1.5 }}
          >
            {getCategoryName(content.category)}
          </Typography>
          <Typography
            ref={headingRef}
            tabIndex={-1}
            variant="h4"
            component="h1"
            className="outline-none"
            sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.125rem' } }}
          >
            {content.title}
          </Typography>
        </header>
        <FavoriteButton contentId={content.id} isFavorite={content.isFavorite} />
        <ContentMetadata content={content} />
        <section aria-labelledby={DESCRIPTION_TITLE_ID} className="flex flex-col gap-2">
          <Typography
            id={DESCRIPTION_TITLE_ID}
            variant="h6"
            component="h2"
            sx={{ fontWeight: 700 }}
          >
            Sobre este conteúdo
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {content.description}
          </Typography>
        </section>
      </div>
    </article>
  );
}
