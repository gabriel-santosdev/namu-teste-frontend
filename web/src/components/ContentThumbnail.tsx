import HideImageOutlined from '@mui/icons-material/HideImageOutlined';
import { useState } from 'react';

type ImageStatus = 'loading' | 'loaded' | 'error';

interface ContentThumbnailProps {
  src: string | null;
  loading?: 'lazy' | 'eager';
  className?: string;
}

function Thumbnail({ src, loading, className = '' }: ContentThumbnailProps) {
  const [status, setStatus] = useState<ImageStatus>('loading');

  if (!src || status === 'error') {
    return (
      <div
        aria-hidden
        data-testid="thumbnail-placeholder"
        className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-stone-100 to-stone-200 px-4 text-center text-stone-500"
      >
        <HideImageOutlined sx={{ fontSize: 40, opacity: 0.8 }} />
        <span className="text-sm font-medium">Imagem não disponível</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={640}
      height={360}
      loading={loading}
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      className={`h-full w-full object-cover transition duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
}

export function ContentThumbnail(props: ContentThumbnailProps) {
  return <Thumbnail key={props.src ?? 'placeholder'} {...props} />;
}
