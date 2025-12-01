import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { t, language } = useLanguage();

  return (
    <section className="relative min-h-[85vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden pt-16 md:pt-0">
      {/* Background gradient - NELLO ONE style */}
      <div className="absolute inset-0 gradient-nello" />
      
      {/* Subtle glow - smaller on mobile */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] md:w-[500px] md:h-[500px] gradient-glow opacity-40 subtle-pulse" />
      
      {/* Portal/Circle decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-bruma-deep/20 rounded-full opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] border border-bruma-deep/15 rounded-full opacity-20" />
      
      <div ref={ref} className="container relative z-10 px-4 md:px-6 py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Brand name */}
          <div 
            className={cn(
              "mb-6 md:mb-8 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <span className="font-display text-sm md:text-base tracking-[0.3em] uppercase text-ink-light">
              {t.landing.hero.title}
            </span>
          </div>

          {/* Main headline - Responsive typography */}
          <h1 
            className={cn(
              "font-display text-[1.75rem] leading-tight sm:text-display-md md:text-display-lg lg:text-display-xl text-foreground mb-4 md:mb-6 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {language === 'en' ? (
              <>
                The path begins
                <span className="block text-ink-blue">within.</span>
              </>
            ) : (
              <>
                O caminho começa
                <span className="block text-ink-blue">dentro.</span>
              </>
            )}
          </h1>

          {/* Subheadline - Responsive */}
          <p 
            className={cn(
              "font-premium text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {t.landing.hero.description}
          </p>
          
          <p 
            className={cn(
              "text-sm md:text-base text-muted-foreground/80 max-w-xl mx-auto mb-8 md:mb-12 leading-relaxed px-2 transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {language === 'en' ? 'Clarity. Identity. Direction.' : 'Clareza. Identidade. Propósito.'}
          </p>

          {/* CTA - Full width on mobile */}
          <div 
            className={cn(
              "flex flex-col items-center justify-center gap-4 px-4 md:px-0 transition-all duration-700 delay-400",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <Button 
              size="lg" 
              className="group w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base rounded-full bg-ink-blue hover:bg-ink-deep text-primary-foreground shadow-medium hover:shadow-large hover-lift press-effect"
              onClick={() => navigate(language === 'en' ? "/en/auth" : "/auth")}
            >
              {t.landing.hero.cta_primary}
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Trust indicator */}
          <p 
            className={cn(
              "mt-8 md:mt-10 text-xs md:text-sm text-muted-foreground transition-all duration-700 delay-500",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {language === 'en' 
              ? 'Over 2,000 people have started their journey' 
              : 'Mais de 2.000 pessoas já iniciaram sua jornada'}
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
