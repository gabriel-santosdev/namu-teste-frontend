import { Link, Outlet } from 'react-router';
import { paths } from './paths';

export function AppLayout() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">
          <Link to={paths.catalog} className="text-xl font-semibold text-brand-700">
            Namu
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
