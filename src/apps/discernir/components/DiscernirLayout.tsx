import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Home, 
  Users, 
  FileHeart, 
  LogOut,
  Menu,
  X,
  Church,
  Send
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DiscernirLayoutProps {
  isPriest?: boolean;
}

export function DiscernirLayout({ isPriest = false }: DiscernirLayoutProps) {
  const { user, signOut } = useAuth();
  const { role, couple, priest } = useDiscernirAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const coupleNavItems = [
    { path: '/dashboard', label: 'Início', icon: Home },
    { path: '/consentimento', label: 'Consentimento', icon: Heart },
    { path: '/apoio-escuta', label: 'Apoio de Escuta', icon: FileHeart },
    { path: '/cruzamento', label: 'Proteção do Casal', icon: Users },
  ];

  const priestNavItems = [
    { path: '/padre', label: 'Painel', icon: Home },
    { path: '/padre/casais', label: 'Casais', icon: Users },
    { path: '/padre/convites', label: 'Convites', icon: Send },
  ];

  const navItems = isPriest ? priestNavItems : coupleNavItems;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to={isPriest ? '/padre' : '/dashboard'} className="flex items-center gap-2">
            <Church className="h-6 w-6 text-amber-700" />
            <span className="font-serif text-xl font-semibold text-amber-900">
              DISCERNIR
            </span>
            {isPriest && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Padre
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="ml-4 text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t bg-background p-4 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <Outlet />
      </main>

      {/* Institutional Footer */}
      <footer className="border-t bg-amber-50/50 py-6">
        <div className="container px-4 text-center space-y-3">
          <p className="text-sm text-amber-800/80 italic max-w-2xl mx-auto">
            "Este apoio não descreve a pessoa. Apenas ajuda a escutar melhor o momento."
          </p>
          <div className="text-xs text-amber-700/60 max-w-xl mx-auto space-y-1">
            <p className="font-medium text-amber-800/70">
              DISCERNIR — versão piloto pastoral
            </p>
            <p>
              Arquitetura técnica de autoconhecimento desenvolvida no ecossistema Nello Identity.
            </p>
            <p>
              Uso pastoral com consentimento explícito e revogável, em conformidade com a LGPD.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
