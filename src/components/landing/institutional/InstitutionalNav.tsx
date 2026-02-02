import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";
import { Menu, X, LogIn, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ecosystemModules = [
  { id: 'identity', name: 'Identity', tagline: 'Autoconhecimento', url: 'https://identity.nello.one' },
  { id: 'life', name: 'Life', tagline: 'Fé e Rotina', url: 'https://life.nello.one' },
  { id: 'flow', name: 'Flow', tagline: 'Foco e Execução', url: 'https://flow.nello.one' },
  { id: 'business', name: 'Hiring', tagline: 'Contratação Assertiva', url: 'https://business.nello.one' },
];

export const InstitutionalNav = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleLogin = () => {
    window.location.href = 'https://identity.nello.one/auth';
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="container px-4 sm:px-6 lg:px-12">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="focus:outline-none">
            <LogoText className="text-lg md:text-xl" variant={isScrolled ? "dark" : "default"} />
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {/* Ecosystem Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 group">
                  Ecossistema
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-background/95 backdrop-blur-xl">
                {ecosystemModules.map((module) => (
                  <DropdownMenuItem key={module.id} asChild>
                    <a 
                      href={module.url}
                      className="flex flex-col items-start py-3 cursor-pointer"
                    >
                      <span className="font-medium text-foreground">{module.name}</span>
                      <span className="text-xs text-muted-foreground">{module.tagline}</span>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => scrollToSection("#nello-ia")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 py-2"
            >
              Nello IA
            </button>

            <button
              onClick={() => scrollToSection("#investidor")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 py-2"
            >
              Investidores
            </button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogin}
                className="text-sm text-foreground hover:text-nello-gold hover:bg-nello-gold/5 gap-2"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
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
          {/* Ecosystem Links */}
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-2">
            Ecossistema
          </p>
          {ecosystemModules.map((module) => (
            <a
              key={module.id}
              href={module.url}
              className="flex flex-col w-full text-left py-3 px-4 text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
            >
              <span className="font-medium">{module.name}</span>
              <span className="text-xs text-muted-foreground">{module.tagline}</span>
            </a>
          ))}

          <div className="h-px bg-border my-2" />

          <button
            onClick={() => scrollToSection("#nello-ia")}
            className="flex w-full text-left py-3 px-4 text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
          >
            Nello IA
          </button>

          <button
            onClick={() => scrollToSection("#investidor")}
            className="flex w-full text-left py-3 px-4 text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
          >
            Investidores
          </button>

          <div className="pt-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-border"
              onClick={handleLogin}
            >
              <LogIn className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Entrar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
