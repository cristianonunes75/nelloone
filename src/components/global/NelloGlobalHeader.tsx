import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, Settings, LogOut, Compass, Users, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { getNelloAppUrl, NelloApp, useSubdomain } from "@/hooks/useSubdomain";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NelloGlobalHeaderProps {
  variant?: 'light' | 'dark';
}

// Modules visible to all users (add more as they become ready)
const PUBLIC_MODULES = ['identity'];

// Module definitions with URLs and labels
const NELLO_MODULES: Array<{
  id: NelloApp | 'praxis';
  name: string;
  tagline: { en: string; pt: string };
  url: string;
}> = [
  { 
    id: 'identity', 
    name: 'Identity', 
    tagline: { en: 'Where it all begins', pt: 'Onde tudo começa' },
    url: 'https://identity.nello.one'
  },
  { 
    id: 'life', 
    name: 'Life', 
    tagline: { en: 'Faith and habits', pt: 'Fé e hábitos' },
    url: 'https://life.nello.one'
  },
  { 
    id: 'flow', 
    name: 'Flow', 
    tagline: { en: 'Ideas and action', pt: 'Ideias e ação' },
    url: 'https://flow.nello.one'
  },
  { 
    id: 'business', 
    name: 'Business', 
    tagline: { en: 'Culture and management', pt: 'Cultura e gestão' },
    url: 'https://business.nello.one'
  },
  { 
    id: 'praxis', 
    name: 'Praxis', 
    tagline: { en: 'For professionals', pt: 'Área do profissional' },
    url: 'https://business.nello.one/praxis'
  },
];

/**
 * Global Header for the entire Nello ecosystem
 * Provides unified navigation across all 5 modules
 */
export const NelloGlobalHeader = ({ variant = 'light' }: NelloGlobalHeaderProps) => {
  const { language } = useLanguage();
  const { user, profile, signOut, userRoles } = useAuth();
  const { app: currentApp } = useSubdomain();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = variant === 'dark';

  // Filter modules based on user role
  const isAdmin = userRoles.includes('admin');
  const visibleModules = isAdmin 
    ? NELLO_MODULES 
    : NELLO_MODULES.filter(m => PUBLIC_MODULES.includes(m.id));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get user initials for avatar
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Handle navigation - smart redirect logic
  const handleModuleClick = (module: typeof NELLO_MODULES[0]) => {
    // Check if we're in a Lovable preview environment
    const isPreview = window.location.hostname.includes('lovable') || 
                      window.location.hostname === 'localhost';
    
    if (isPreview) {
      // In preview, use query params
      const params = new URLSearchParams(location.search);
      const targetApp = module.id === 'praxis' ? 'business' : module.id;
      params.set('app', targetApp);
      const path = module.id === 'praxis' ? '/praxis' : '/';
      navigate({ pathname: path, search: params.toString() });
    } else {
      // In production, redirect to subdomain
      window.location.href = module.url;
    }
    setMobileMenuOpen(false);
  };

  // Handle journey button click
  const handleJourneyClick = () => {
    if (!user) {
      // Redirect to login with return URL
      navigate('/autenticacao?redirect=/cliente');
    } else {
      navigate('/cliente');
    }
    setMobileMenuOpen(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Check if module is active
  const isModuleActive = (moduleId: string) => {
    if (moduleId === 'praxis') {
      return location.pathname.includes('/praxis');
    }
    return currentApp === moduleId && !location.pathname.includes('/praxis');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? isDark 
            ? "bg-nello-graphite/95 backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : isDark
            ? "bg-transparent"
            : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Left: Logo/Brand */}
          <a 
            href="https://identity.nello.one"
            className="flex items-center gap-1.5 group"
          >
            <span className={cn(
              "font-serif text-xl font-bold tracking-tight transition-colors",
              isDark ? "text-white" : "text-ink-deep"
            )}>
              NELLO
            </span>
            <span className={cn(
              "font-serif text-xl font-light tracking-tight transition-colors",
              isDark ? "text-nello-gold" : "text-nello-gold-deep"
            )}>
              IDENTITY
            </span>
          </a>

          {/* Center: Module Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {visibleModules.map((module) => {
              const isActive = isModuleActive(module.id);
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all rounded-lg group",
                    isActive 
                      ? isDark 
                        ? "text-nello-gold" 
                        : "text-nello-gold-deep"
                      : isDark
                        ? "text-white/70 hover:text-white"
                        : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {module.name}
                  {/* Active indicator - golden underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-nello-gold rounded-full" />
                  )}
                  {/* Hover tooltip */}
                  <span className={cn(
                    "absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap",
                    isDark 
                      ? "bg-white/10 text-white/80" 
                      : "bg-ink-deep text-white"
                  )}>
                    {module.tagline[language as 'en' | 'pt'] || module.tagline.pt}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Journey Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleJourneyClick}
              className={cn(
                "hidden sm:flex items-center gap-2 font-medium",
                isDark 
                  ? "border-nello-gold/50 text-nello-gold hover:bg-nello-gold/10 hover:border-nello-gold"
                  : "border-nello-gold/60 text-nello-gold-deep hover:bg-nello-gold/10 hover:border-nello-gold"
              )}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden md:inline">
                {language === 'en' ? 'My Journey' : 'Minha Jornada'}
              </span>
            </Button>

            {/* User Menu or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "rounded-full w-9 h-9",
                      isDark ? "hover:bg-white/10" : "hover:bg-muted"
                    )}
                  >
                    <Avatar className="w-8 h-8 border-2 border-nello-gold/30">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-nello-gold/10 text-nello-gold-deep text-xs font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium truncate">{profile?.full_name || user.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/cliente/perfil')}>
                    <User className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'My Profile' : 'Meu Perfil'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/cliente')}>
                    <Compass className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'My Journey' : 'Minha Jornada'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => profile?.journey_status === 'completed' && navigate('/cliente/cruzamentos')}
                    className={cn(
                      profile?.journey_status !== 'completed' && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Code Crossings' : 'Cruzamentos'}
                    {profile?.journey_status !== 'completed' && (
                      <Lock className="w-3 h-3 ml-auto text-muted-foreground" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/cliente/configuracoes')}>
                    <Settings className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Settings' : 'Configurações'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Sign Out' : 'Sair'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate('/autenticacao')}
                className={cn(
                  "hidden sm:flex",
                  isDark 
                    ? "bg-nello-gold hover:bg-nello-gold-deep text-ink-deep"
                    : "bg-nello-gold hover:bg-nello-gold-deep text-white"
                )}
              >
                {language === 'en' ? 'Sign In' : 'Entrar'}
              </Button>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "lg:hidden",
                    isDark ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"
                  )}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-lg font-bold text-ink-deep">NELLO</span>
                      <span className="font-serif text-lg font-light text-nello-gold-deep">ONE</span>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="w-5 h-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 overflow-auto p-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                        {language === 'en' ? 'Ecosystem' : 'Ecossistema'}
                      </p>
                      {visibleModules.map((module) => {
                        const isActive = isModuleActive(module.id);
                        return (
                          <button
                            key={module.id}
                            onClick={() => handleModuleClick(module)}
                            className={cn(
                              "flex items-center justify-between w-full px-3 py-3 rounded-lg transition-colors text-left",
                              isActive 
                                ? "bg-nello-gold/10 text-nello-gold-deep border-l-2 border-nello-gold"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            <div>
                              <span className="font-medium">{module.name}</span>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {module.tagline[language as 'en' | 'pt'] || module.tagline.pt}
                              </p>
                            </div>
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-nello-gold" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 pt-6 border-t space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                        {language === 'en' ? 'Quick Actions' : 'Ações Rápidas'}
                      </p>
                      <button
                        onClick={handleJourneyClick}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors hover:bg-muted text-left"
                      >
                        <Compass className="w-5 h-5 text-nello-gold" />
                        <span className="font-medium">
                          {language === 'en' ? 'My Journey' : 'Minha Jornada'}
                        </span>
                      </button>
                      <button
                        onClick={() => { 
                          if (profile?.journey_status === 'completed') {
                            navigate('/cliente/cruzamentos'); 
                            setMobileMenuOpen(false); 
                          }
                        }}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors text-left",
                          profile?.journey_status === 'completed' 
                            ? "hover:bg-muted" 
                            : "opacity-60 cursor-not-allowed"
                        )}
                      >
                        <Users className="w-5 h-5 text-accent" />
                        <span className="font-medium">
                          {language === 'en' ? 'Code Crossings' : 'Cruzamentos'}
                        </span>
                        {profile?.journey_status !== 'completed' && (
                          <Lock className="w-4 h-4 ml-auto text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="border-t p-4">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-nello-gold/30">
                            <AvatarImage src={profile?.avatar_url || undefined} />
                            <AvatarFallback className="bg-nello-gold/10 text-nello-gold-deep text-sm font-medium">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{profile?.full_name || user.email}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => { navigate('/cliente/perfil'); setMobileMenuOpen(false); }}
                          >
                            <User className="w-4 h-4 mr-1" />
                            {language === 'en' ? 'Profile' : 'Perfil'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={handleSignOut}
                            className="text-destructive"
                          >
                            <LogOut className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-nello-gold hover:bg-nello-gold-deep text-white"
                        onClick={() => { navigate('/autenticacao'); setMobileMenuOpen(false); }}
                      >
                        {language === 'en' ? 'Sign In' : 'Entrar'}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
