import type { ButtonHTMLAttributes } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

function PageButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="rounded-lg px-4 py-2 text-sm font-medium text-brand-700 ring-1 ring-stone-300 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      {...props}
    />
  );
}

export function Pagination({ page, totalPages, onPageChange, disabled = false }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-4">
      <PageButton onClick={() => onPageChange(page - 1)} disabled={disabled || page <= 1}>
        Anterior
      </PageButton>
      <p className="text-sm text-stone-600" aria-live="polite">
        Página {page} de {totalPages}
      </p>
      <PageButton onClick={() => onPageChange(page + 1)} disabled={disabled || page >= totalPages}>
        Próxima
      </PageButton>
    </nav>
  );
}
