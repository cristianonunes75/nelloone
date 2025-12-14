import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export const ValidationFooter = () => {
  const { t } = useLanguage();
  const landing = t.landing;

  return (
    <footer className="py-12 px-6 bg-muted/50 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-foreground font-medium">
              {landing.footer.brand}
            </p>
            <p className="text-muted-foreground text-sm">
              {landing.footer.tagline}
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              {landing.footer.links.privacy}
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              {landing.footer.links.terms}
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-xs">
            {landing.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};