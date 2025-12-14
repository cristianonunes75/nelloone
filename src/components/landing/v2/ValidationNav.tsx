import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LogoText } from "@/components/LogoText";

export const ValidationNav = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const landing = t.landing;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <LogoText className="h-6" />
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/auth" 
            className="text-muted-foreground hover:text-foreground transition-colors text-sm hidden sm:block"
          >
            {landing.nav.login}
          </Link>
          <Button 
            onClick={() => navigate("/auth")}
            size="sm"
            className="rounded-full"
          >
            {landing.nav.start}
          </Button>
        </div>
      </div>
    </nav>
  );
};