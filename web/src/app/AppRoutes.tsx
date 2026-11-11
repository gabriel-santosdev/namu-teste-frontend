import { Route, Routes } from 'react-router';
import { CatalogPage } from '@/features/catalog/pages/CatalogPage';
import { ContentDetailPage } from '@/features/content-detail/pages/ContentDetailPage';
import { AppLayout } from './AppLayout';
import { paths } from './paths';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path={paths.contentDetail} element={<ContentDetailPage />} />
      </Route>
    </Routes>
  );
}
