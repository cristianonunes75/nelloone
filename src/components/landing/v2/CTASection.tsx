import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const CTASection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();
  const { t, language } = useLanguage();

  const getAuthPath = () => {
    if (language === 'en') return "/en/auth";
    if (language === 'pt-pt') return "/pt-pt/auth";
    return "/auth";
  };

  return (
    <section className="py-20 md:py-28 lg:py-32 relative overflow-hidden bg-ink-deep">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-blue/30 to-transparent" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main CTA Title */}
          <h2 className={cn(
            "font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-5 md:mb-6 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}>
            {t.landing.cta.title}
          </h2>

          {/* Microcopy */}
          <p className={cn(
            "text-base md:text-lg text-white/70 mb-10 md:mb-12 max-w-xl mx-auto transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}>
            {t.landing.cta.subtitle}
          </p>

          {/* CTA Button - White on dark */}
          <Button 
            size="lg" 
            className={cn(
              "group w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 text-base md:text-lg rounded-full bg-white hover:bg-white/90 text-ink-deep shadow-large hover-lift press-effect transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            onClick={() => navigate(getAuthPath())}
          >
            {t.landing.cta.button}
            <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};
