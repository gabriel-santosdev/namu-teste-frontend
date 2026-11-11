import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { ContentGrid } from './ContentGrid';

const SKELETON_CARDS = 6;

function ContentCardSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton variant="rectangular" animation="wave" className="aspect-video w-full" />
      <CardContent className="flex flex-col gap-1.5 p-5">
        <Skeleton animation="wave" width="30%" />
        <Skeleton animation="wave" width="85%" height={28} />
        <Skeleton animation="wave" width="100%" />
        <Skeleton animation="wave" width="70%" />
      </CardContent>
    </Card>
  );
}

export function ContentListSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Carregando conteúdos…</span>
      <div aria-hidden>
        <ContentGrid>
          {Array.from({ length: SKELETON_CARDS }, (_, index) => (
            <li key={index}>
              <ContentCardSkeleton />
            </li>
          ))}
        </ContentGrid>
      </div>
    </div>
  );
}
