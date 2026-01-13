import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Briefcase,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { AdminAppSwitcher } from '@/components/admin/AdminAppSwitcher';
import { CompanySwitcher } from './CompanySwitcher';
import { cn } from '@/lib/utils';

interface BusinessLayoutProps {
  children: ReactNode;
}

const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/team', label: 'Equipe', icon: Users },
  { href: '/invite', label: 'Convidar', icon: UserPlus },
  { href: '/jobs', label: 'Vagas', icon: ClipboardList },
  { href: '/hiring', label: 'Recrutamento', icon: Briefcase },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

const collaboratorNavItems = [
  { href: '/my-journey', label: 'Minha Jornada', icon: LayoutDashboard },
];

export function BusinessLayout({ children }: BusinessLayoutProps) {
  const { signOut } = useAuth();
  const { company, isCompanyAdmin, switchCompany } = useBusinessAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isCompanyAdmin ? adminNavItems : collaboratorNavItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-foreground">Nello Business</span>
                {company && (
                  <span className="text-sm text-muted-foreground block -mt-1">{company.name}</span>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <CompanySwitcher 
                currentCompanyId={company?.id || null} 
                onCompanyChange={switchCompany} 
              />
              <AdminAppSwitcher />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="hidden sm:flex items-center gap-2 text-muted-foreground"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-card">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Nello One Business © {new Date().getFullYear()}</p>
          <p className="mt-1 text-xs">
            Plataforma de autoconhecimento para equipes
          </p>
        </div>
      </footer>
    </div>
  );
}
