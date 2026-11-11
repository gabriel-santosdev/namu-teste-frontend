import type { Content } from '@namu/shared';
import { useCategoryName } from '../hooks/useCategories';
import { ContentCard } from './ContentCard';
import { ContentGrid } from './ContentGrid';

interface ContentListProps {
  contents: Content[];
}

export function ContentList({ contents }: ContentListProps) {
  const getCategoryName = useCategoryName();

  return (
    <ContentGrid>
      {contents.map((content) => (
        <li key={content.id}>
          <ContentCard content={content} categoryName={getCategoryName(content.category)} />
        </li>
      ))}
    </ContentGrid>
  );
}
