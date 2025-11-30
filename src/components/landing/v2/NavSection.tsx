import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "A Jornada", href: "#jornada" },
  { label: "Testes", href: "#testes" },
  { label: "Preços", href: "#precos" },
];

export const NavSection = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="container px-6">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <LogoText className="text-xl md:text-2xl" variant="solid" />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/auth")}
              className="text-sm"
            >
              Entrar
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate("/auth")}
              className="rounded-full px-5"
            >
              Começar Grátis
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left py-2 text-foreground"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                Entrar
              </Button>
              <Button 
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
