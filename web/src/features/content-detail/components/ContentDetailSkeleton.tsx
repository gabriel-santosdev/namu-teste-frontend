import Skeleton from '@mui/material/Skeleton';

const METADATA_ITEMS = 4;

export function ContentDetailSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Carregando conteúdo…</span>
      <div aria-hidden className="grid gap-8 md:grid-cols-2 md:items-start lg:gap-12">
        <Skeleton
          variant="rectangular"
          animation="wave"
          className="aspect-video w-full"
          sx={{ height: 'auto', borderRadius: 4 }}
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton animation="wave" width="25%" />
            <Skeleton animation="wave" width="90%" height={44} />
          </div>
          <Skeleton
            variant="rounded"
            animation="wave"
            width={160}
            height={42}
            sx={{ borderRadius: 999 }}
          />
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            {Array.from({ length: METADATA_ITEMS }, (_, index) => (
              <Skeleton key={index} variant="rounded" animation="wave" height={64} />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton animation="wave" width="40%" height={32} />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" width="80%" />
          </div>
        </div>
      </div>
    </div>
  );
}
