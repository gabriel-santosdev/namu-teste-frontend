import { Route, Routes } from 'react-router';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <main className="mx-auto max-w-5xl p-6">
            <h1 className="text-2xl font-semibold text-brand-700">Namu</h1>
          </main>
        }
      />
    </Routes>
  );
}
