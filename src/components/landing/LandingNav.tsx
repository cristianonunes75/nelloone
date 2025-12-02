import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";
import { useNavigate } from "react-router-dom";
import { Home, LogIn } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { LanguageToggle } from "@/components/LanguageToggle";

export const LandingNav = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, userRole } = useAuth();

  const isAdmin = userRole === "admin";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleHomeClick = () => {
    navigate(getHomePath());
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={handleHomeClick}
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
              onClick={handleHomeClick}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            
            {/* Admin only buttons - hidden for regular users */}
            {isAdmin && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="hidden md:inline-flex text-xs"
                >
                  Admin
                </Button>
              </>
            )}
            
            <LanguageToggle variant="minimal" />
            
            <Button
              variant="default"
              size="default"
              onClick={() => navigate(getAuthPath())}
              className="gap-2 bg-ink hover:bg-ink/90"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.landing.nav.login}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
