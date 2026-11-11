import { CatalogHeader } from '../components/CatalogHeader';
import { CatalogResults } from '../components/CatalogResults';
import { CategoryFilter } from '../components/CategoryFilter';
import { SearchField } from '../components/SearchField';
import { useCatalogFilters } from '../hooks/useCatalogFilters';

const TITLE_ID = 'catalog-title';

export function CatalogPage() {
  const { filters, hasActiveFilters, setSearch, setCategory, setPage, clearFilters } =
    useCatalogFilters();

  return (
    <section aria-labelledby={TITLE_ID} className="flex flex-col gap-6">
      <CatalogHeader titleId={TITLE_ID}>
        <SearchField value={filters.search} onSearch={setSearch} />
      </CatalogHeader>
      <CategoryFilter selected={filters.category} onSelect={setCategory} />
      <CatalogResults
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onPageChange={setPage}
        onClearFilters={clearFilters}
      />
    </section>
  );
}
