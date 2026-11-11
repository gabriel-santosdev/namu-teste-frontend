import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import { alpha } from '@mui/material/styles';
import { useCategories } from '../hooks/useCategories';

const ALL_CATEGORIES = { slug: '', name: 'Todas' };
const SKELETON_CHIPS = 5;

interface CategoryFilterProps {
  selected: string;
  onSelect: (slug: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { data: categories, isPending, isError } = useCategories();

  if (isError) return null;

  return (
    <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
      {isPending
        ? Array.from({ length: SKELETON_CHIPS }, (_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={96}
              height={38}
              sx={{ borderRadius: 999 }}
            />
          ))
        : [ALL_CATEGORIES, ...categories].map(({ slug, name }) => {
            const isSelected = slug === selected;
            return (
              <Chip
                key={slug || 'all'}
                component="button"
                label={name}
                clickable
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                aria-pressed={isSelected}
                onClick={() => onSelect(slug)}
                sx={{
                  height: 38,
                  px: 1,
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  ...(isSelected
                    ? {
                        boxShadow: ({ palette }) =>
                          `0 2px 8px ${alpha(palette.primary.main, 0.25)}`,
                      }
                    : {
                        bgcolor: 'background.paper',
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                      }),
                }}
              />
            );
          })}
    </div>
  );
}
