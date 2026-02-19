import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const MobileStickyCtA = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMobile) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-large transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-nello-gold">Flash Sale Fevereiro • 50% OFF</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground line-through">R$ 497</span>
          <span className="text-sm font-bold text-foreground">R$ 248,50</span>
        </div>
      </div>
      <Button
        size="lg"
        className="w-full h-12 text-base rounded-full bg-nello-gold hover:bg-nello-gold-deep text-white shadow-lg group"
        onClick={() => navigate(language === "en" ? "/en/auth" : "/auth")}
      >
        Garantir meu Código com 50% OFF
        </Button>
    </div>
  );
};
