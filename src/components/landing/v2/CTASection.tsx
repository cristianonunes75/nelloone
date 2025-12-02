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

  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-miguel" />
      <div className="absolute inset-0 gradient-glow opacity-20" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main CTA Title */}
          <h2 
            className={cn(
              "font-display text-2xl sm:text-display-sm md:text-display-md lg:text-display-lg text-primary-foreground mb-4 md:mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {t.landing.cta.title}
          </h2>

          {/* Microcopy */}
          <p 
            className={cn(
              "text-base md:text-lg text-primary-foreground/80 mb-8 md:mb-10 max-w-xl mx-auto transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {t.landing.cta.subtitle}
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className={cn(
              "group w-full sm:w-auto h-14 md:h-16 px-8 md:px-10 text-base md:text-lg rounded-full bg-background hover:bg-background/90 text-ink-blue shadow-large hover-lift press-effect transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            onClick={() => navigate(language === 'en' ? "/en/auth" : "/auth")}
          >
            {t.landing.cta.button}
            <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};
