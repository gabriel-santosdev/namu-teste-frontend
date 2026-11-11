import type { Content } from '@namu/shared';
import { useCategoryName } from '../hooks/useCategoryName';
import { ContentCard } from './ContentCard';

interface ContentListProps {
  contents: Content[];
}

export function ContentList({ contents }: ContentListProps) {
  const getCategoryName = useCategoryName();

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => (
        <li key={content.id}>
          <ContentCard content={content} categoryName={getCategoryName(content.category)} />
        </li>
      ))}
    </ul>
  );
}
