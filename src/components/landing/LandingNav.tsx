import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";
import { useNavigate } from "react-router-dom";
import { Home, LogIn } from "lucide-react";

export const LandingNav = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={scrollToTop}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <LogoText 
              variant="default" 
              className="text-2xl md:text-3xl"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="default"
              onClick={scrollToTop}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/influence")}
              className="hidden lg:inline-flex text-xs"
            >
              Influence
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/fotografo")}
              className="hidden md:inline-flex text-xs"
            >
              Fotógrafo
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin")}
              className="hidden md:inline-flex text-xs"
            >
              Admin
            </Button>
            
            <Button
              variant="default"
              size="default"
              onClick={() => navigate("/auth")}
              className="gap-2 bg-gold hover:bg-gold-dark"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
