import { ReactNode, useState, type ElementType } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  Briefcase,
  ClipboardList,
  Target,
  MessageCircle,
  Scale,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { AdminAppSwitcher } from '@/components/admin/AdminAppSwitcher';
import { CompanySwitcher } from './CompanySwitcher';
import { cn } from '@/lib/utils';
import { NelloGlobalFooter } from '@/components/global/NelloGlobalFooter';
import { PRODUCT_IDENTITY } from '../config/featureFlags';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BusinessLayoutProps {
  children: ReactNode;
}

interface NavSection {
  label: string;
  items: { href: string; label: string; icon: ElementType }[];
}

const adminNavSections: NavSection[] = [
  {
    label: 'Estratégia',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/team-comparison', label: 'Cruzamento da Equipe', icon: Scale },
    ],
  },
  {
    label: 'Pessoas',
    items: [
      { href: '/team', label: 'Equipe', icon: Users },
    ],
  },
  {
    label: 'Recrutamento',
    items: [
      { href: '/jobs', label: 'Vagas', icon: ClipboardList },
      { href: '/candidates', label: 'Candidatos', icon: Briefcase },
    ],
  },
  {
    label: 'Comunicação',
    items: [
      { href: '/whatsapp', label: 'WhatsApp', icon: MessageCircle },
    ],
  },
];

const adminNavItems = adminNavSections.flatMap(s => s.items);

const bottomNavItems = [
  { href: '/settings', label: 'Configurações', icon: Settings },
];

const collaboratorNavItems = [
  { href: '/my-space', label: 'Meu espaço', icon: Sparkles },
  { href: '/cliente', label: 'Meu Identity', icon: ExternalLink },
];

export function BusinessLayout({ children }: BusinessLayoutProps) {
  const { signOut } = useAuth();
  const { company, isCompanyAdmin, switchCompany } = useBusinessAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections = isCompanyAdmin ? adminNavSections : [{ label: '', items: collaboratorNavItems }];
  const navItems = isCompanyAdmin ? adminNavItems : collaboratorNavItems;
  const bottomItems = bottomNavItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const NavItem = ({ item, onClick }: { item: typeof adminNavItems[0]; onClick?: () => void }) => {
    const isActive = location.pathname === item.href;
    const content = (
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          collapsed && "justify-center px-2",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <item.icon className="w-4 h-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur md:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <span className="text-base font-semibold">{PRODUCT_IDENTITY.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <CompanySwitcher 
                currentCompanyId={company?.id || null} 
                onCompanyChange={switchCompany} 
              />
              <AdminAppSwitcher />
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 top-14 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
              <nav className="bg-card border-r w-64 h-full p-4 space-y-3 shadow-lg" onClick={(e) => e.stopPropagation()}>
                {navSections.map((section, idx) => (
                  <div key={section.label || idx}>
                    {idx > 0 && <div className="h-px bg-border" />}
                    {section.label && (
                      <p className="px-3 pt-1 pb-0.5 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">{section.label}</p>
                    )}
                    <div className="space-y-0.5">
                      {section.items.map((item) => (
                        <NavItem key={item.href} item={item} onClick={() => setMobileMenuOpen(false)} />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="h-px bg-border" />
                {bottomItems.map((item) => (
                  <NavItem key={item.href} item={item} onClick={() => setMobileMenuOpen(false)} />
                ))}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </nav>
            </div>
          )}
        </header>

        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <aside className={cn(
            "hidden md:flex flex-col border-r bg-card/50 sticky top-0 h-screen transition-all duration-200",
            collapsed ? "w-16" : "w-56"
          )}>
            {/* Logo + Company Switcher */}
            <div className="p-4 border-b space-y-2">
              <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                {!collapsed && (
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-foreground block truncate">{PRODUCT_IDENTITY.name}</span>
                    {company && (
                      <span className="text-xs text-muted-foreground block truncate">{company.name}</span>
                    )}
                  </div>
                )}
              </Link>
              {!collapsed && (
                <CompanySwitcher 
                  currentCompanyId={company?.id || null} 
                  onCompanyChange={switchCompany} 
                />
              )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
              {navSections.map((section, idx) => (
                <div key={section.label || idx}>
                  {idx > 0 && <div className="h-px bg-border" />}
                  {section.label && !collapsed && (
                    <p className="px-3 pt-1 pb-0.5 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">{section.label}</p>
                  )}
                  {collapsed && idx > 0 && <div className="h-px bg-border mx-1" />}
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <NavItem key={item.href} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t space-y-1">
              {bottomItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}

              <button
                onClick={handleSignOut}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full",
                  collapsed && "justify-center px-2"
                )}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Sair</span>}
              </button>

              {/* Collapse Toggle */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted w-full",
                  collapsed && "justify-center px-2"
                )}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {!collapsed && <span>Recolher</span>}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
              {children}
            </main>
            <NelloGlobalFooter currentApp="business" variant="light" />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
