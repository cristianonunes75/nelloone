import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";
import { Menu, X, Sparkles, Map, DollarSign, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Miguel", href: "#jornada", icon: Sparkles },
  { label: "Jornada", href: "#testes", icon: Map },
  { label: "Preços", href: "#precos", icon: DollarSign },
];

export const NavSection = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
        isScrolled 
          ? "bg-background/90 backdrop-blur-xl border-b border-border/30 shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="container px-6">
        <nav className="flex items-center justify-between h-16 md:h-18">
          <LogoText className="text-xl md:text-2xl" variant="solid" />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/auth")}
              className="text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              Entrar
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate("/auth")}
              className="rounded-full px-5 bg-gold hover:bg-gold-dark text-primary-foreground press-effect"
            >
              Começar Grátis
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary/50 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden bg-background border-b border-border overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="flex items-center gap-3 w-full text-left py-3 px-4 text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
            >
              <link.icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-border space-y-2">
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-border"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Entrar
            </Button>
            <Button 
              className="w-full rounded-xl bg-gold hover:bg-gold-dark text-primary-foreground press-effect"
              onClick={() => navigate("/auth")}
            >
              Começar Grátis
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
