import type { ReactNode } from 'react';

interface ContentGridProps {
  children: ReactNode;
}

export function ContentGrid({ children }: ContentGridProps) {
  return <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>;
}
