import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, FolderOpen, Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBibliotecaAccess } from '../contexts/BibliotecaAccessContext';

export function BibliotecaLayout() {
  const location = useLocation();
  const { isOwner } = useBibliotecaAccess();

  const nav = [
    { to: '/biblioteca', label: 'Pastas', icon: FolderOpen, exact: true },
    { to: '/biblioteca/busca', label: 'Buscar', icon: Search, exact: false },
    ...(isOwner ? [{ to: '/biblioteca/acesso', label: 'Acesso', icon: Users, exact: false }] : []),
  ];

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-amber-50/30 pb-20">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center gap-2 px-3">
          <BookOpen className="h-5 w-5 text-amber-700" />
          <span className="font-serif text-base font-semibold text-amber-900">
            Biblioteca ECC
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-3 py-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-stretch justify-around">
          {nav.map((item) => {
            const active = isActive(item.to, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium',
                  active ? 'text-amber-700' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
