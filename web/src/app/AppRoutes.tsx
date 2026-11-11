import { Route, Routes } from 'react-router';
import { CatalogPage } from '@/features/catalog/pages/CatalogPage';
import { AppLayout } from './AppLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<CatalogPage />} />
      </Route>
    </Routes>
  );
}
