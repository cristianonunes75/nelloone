import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, Users, Package, Receipt, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMiniMercado } from '../contexts/MiniMercadoContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const navItems = [
  { to: '/mini-mercado/balcao', label: 'Balcão', icon: ShoppingCart, gestorOnly: false },
  { to: '/mini-mercado/servos', label: 'Trabalhadores', icon: Users, gestorOnly: false },
  { to: '/mini-mercado/produtos', label: 'Produtos', icon: Package, gestorOnly: true },
  { to: '/mini-mercado/fechamento', label: 'Fechar', icon: Receipt, gestorOnly: true },
];

export function MiniMercadoLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { events, activeEvent, activeEventId, activeRole, setActiveEventId } = useMiniMercado();

  const visibleNav = navItems.filter((i) => !i.gestorOnly || activeRole === 'gestor');

  return (
    <div className="min-h-screen bg-amber-50/30 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center gap-2 px-3">
          <Store className="h-5 w-5 shrink-0 text-amber-700" />
          {events.length > 1 ? (
            <Select
              value={activeEventId ?? undefined}
              onValueChange={(v) => {
                setActiveEventId(v);
                navigate('/mini-mercado/balcao');
              }}
            >
              <SelectTrigger className="h-9 max-w-[70vw] border-amber-200 text-sm font-semibold text-amber-900">
                <SelectValue placeholder="Selecione o retiro" />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.event.id} value={e.event.id}>
                    {e.event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="truncate font-serif text-base font-semibold text-amber-900">
              {activeEvent?.name ?? 'Mini Mercado'}
            </span>
          )}
          <Link
            to="/mini-mercado"
            className="ml-auto flex items-center gap-1 text-xs text-amber-700/80"
          >
            Trocar <ChevronDown className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Conteudo */}
      <main className="mx-auto w-full max-w-3xl px-3 py-4">
        <Outlet />
      </main>

      {/* Bottom nav (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-stretch justify-around">
          {visibleNav.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors',
                  active ? 'text-amber-700' : 'text-muted-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'text-amber-700')} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
