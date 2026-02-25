import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Menu, X, LogIn, User, ChevronDown, FileText, HelpCircle, Map, BarChart3, Settings, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { UpdateAppButton } from "@/components/landing/UpdateAppButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavSection = () => {
  const navigate = useNavigate();
  const { user, userRole, signOut, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = userRole === "admin";
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    // Add language prefix based on current language
    let localizedPath = path;
    if (language === 'en') localizedPath = `/en${path}`;
    else if (language === 'pt-pt') localizedPath = `/pt-pt${path}`;
    navigate(localizedPath);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    if (language === 'en') navigate('/en');
    else if (language === 'pt-pt') navigate('/pt-pt');
    else navigate('/');
  };

  const getHomePath = () => {
    if (language === 'en') return '/en';
    if (language === 'pt-pt') return '/pt-pt';
    return '/';
  };

  const getAuthPath = () => {
    if (language === 'en') return '/en/auth';
    if (language === 'pt-pt') return '/pt-pt/auth';
    return '/auth';
  };

  // No public links for non-logged users — landing is single-focus on Leitura Inicial
  const publicLinks: { label: string; action: () => void; icon: typeof FileText }[] = [];

  // Links for logged users - Results scrolls to results section
  const authLinks = [
    { label: t.landing.nav.tests, action: () => handleNavigation("/cliente"), icon: FileText },
    { label: language === 'en' ? 'My Journey' : 'Minha Jornada', action: () => handleNavigation("/cliente"), icon: Map },
    { label: language === 'en' ? 'Results' : 'Resultados', action: () => handleNavigation("/cliente#resultados"), icon: BarChart3 },
  ];

  const navLinks = isLoggedIn ? authLinks : publicLinks;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="container px-4 sm:px-6">
        <nav className="flex items-center justify-between h-14 md:h-16">
          {/* Logo - NELLO Identity (same pattern as Life, Business, Flow) */}
          <button onClick={() => navigate(getHomePath())} className="focus:outline-none flex items-center gap-1">
            <span className={cn(
              "font-serif tracking-wide text-lg md:text-xl font-bold transition-colors",
              isScrolled ? "text-ink-deep" : "text-foreground"
            )}>NELLO</span>
            <span className={cn(
              "font-serif text-lg md:text-xl font-light tracking-wide transition-colors",
              isScrolled ? "text-ink-deep" : "text-foreground"
            )}>IDENTITY</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-px bg-ink scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            ))}
          </div>

          {/* Desktop CTA / Profile */}
          <div className="hidden md:flex items-center gap-3">
            <UpdateAppButton variant="gold" size="sm" />
            <LanguageToggle variant="minimal" />
            
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isLoggedIn ? (
              /* logged-in dropdown unchanged */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  >
                    <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-ink" strokeWidth={1.5} />
                    </div>
                    <ChevronDown className="w-3 h-3" strokeWidth={1.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleNavigation("/me")}>
                    <User className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    {language === 'en' ? 'My Profile' : 'Meu Perfil'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/cliente")}>
                    <Map className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    {language === 'en' ? 'My Journey' : 'Minha Jornada'}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        {language === 'en' ? 'Admin Panel' : 'Painel Admin'}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    {language === 'en' ? 'Sign Out' : 'Sair'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(getAuthPath() + '?redirect=/dashboard')}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <LogIn className="w-4 h-4" strokeWidth={1.5} />
                  {language === 'en' ? 'Sign In' : 'Entrar'}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    const leituraPath = language === 'en' ? '/en/initial-reading' : language === 'pt-pt' ? '/pt-pt/leitura-inicial' : '/leitura-inicial';
                    navigate(leituraPath);
                  }}
                  className="rounded-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold text-sm"
                >
                  {language === 'en' ? 'Start my Reading' : 'Fazer minha Leitura Inicial'}
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <UpdateAppButton variant="gold" size="sm" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-secondary/50 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden bg-background border-b border-border overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="flex items-center gap-3 w-full text-left py-3 px-4 text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
            >
              <link.icon className="w-4 h-4 text-ink" strokeWidth={1.5} />
              {link.label}
            </button>
          ))}

          {/* Language toggle mobile */}
          <div className="py-3 px-4 flex items-center gap-3">
            <LanguageToggle />
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            {isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl"
                  onClick={() => handleNavigation("/me")}
                >
                  <User className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  {language === 'en' ? 'My Profile' : 'Meu Perfil'}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl"
                  onClick={() => handleNavigation("/cliente")}
                >
                  <Map className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  {language === 'en' ? 'My Journey' : 'Minha Jornada'}
                </Button>
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-xl"
                    onClick={() => navigate("/admin")}
                  >
                    <Shield className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    {language === 'en' ? 'Admin Panel' : 'Painel Admin'}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  {language === 'en' ? 'Sign Out' : 'Sair'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  className="w-full rounded-xl gap-2"
                  onClick={() => {
                    navigate(getAuthPath() + '?redirect=/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="w-4 h-4" strokeWidth={1.5} />
                  {language === 'en' ? 'I have an account' : 'Já tenho conta'}
                </Button>
                <Button 
                  className="w-full rounded-xl bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold"
                  onClick={() => {
                    const leituraPath = language === 'en' ? '/en/initial-reading' : language === 'pt-pt' ? '/pt-pt/leitura-inicial' : '/leitura-inicial';
                    handleNavigation(leituraPath.replace(/^\/(en|pt-pt)\//, '/'));
                  }}
                >
                  {language === 'en' ? 'Start my Reading' : 'Fazer minha Leitura Inicial'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
