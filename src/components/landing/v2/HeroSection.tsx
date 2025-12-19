import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { t, language } = useLanguage();

  const getAuthPath = () => {
    if (language === 'en') return "/en/auth";
    if (language === 'pt-pt') return "/pt-pt/auth";
    return "/auth";
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Warm gradient background */}
      <div className="absolute inset-0 gradient-warm" />
      
      {/* Subtle golden glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-nello-gold/5 rounded-full blur-3xl subtle-pulse" />
      
      {/* Light decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] border border-nello-gold/10 rounded-full opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] border border-nello-gold/8 rounded-full opacity-20" />
      
      <div ref={ref} className="container relative z-10 px-4 md:px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small decorative icon */}
          <div 
            className={cn(
              "mb-6 md:mb-8 flex justify-center transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <Sparkles className="w-6 h-6 text-nello-gold" strokeWidth={1.5} />
          </div>

          {/* Main headline - Serif editorial */}
          <h1 
            className={cn(
              "font-heading text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[4.5rem] text-foreground mb-6 md:mb-8 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <span className="block">{t.landing.hero.subtitle.split('.')[0]}.</span>
            <span className="block text-nello-gold">{t.landing.hero.subtitle.split('.')[1]?.trim()}.</span>
          </h1>

          {/* Subheadline */}
          <p 
            className={cn(
              "font-body text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-5 md:mb-6 leading-relaxed transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {t.landing.hero.description}
          </p>
          
          {/* Tagline */}
          <p 
            className={cn(
              "text-sm md:text-base text-muted-foreground/70 max-w-xl mx-auto mb-10 md:mb-12 transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {t.landing.hero.tagline}
          </p>

          {/* CTA Button - Golden warm */}
          <div 
            className={cn(
              "flex flex-col items-center justify-center gap-4 px-4 md:px-0 transition-all duration-700 delay-400",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <Button 
              size="lg" 
              className="group w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 text-base md:text-lg rounded-full bg-nello-gold hover:bg-nello-gold-deep text-white shadow-lg hover:shadow-gold hover-lift press-effect font-sans-ui font-medium"
              onClick={() => navigate(getAuthPath())}
            >
              {t.landing.hero.cta_primary}
              <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Social proof */}
          <p 
            className={cn(
              "mt-10 md:mt-12 text-xs md:text-sm text-muted-foreground/80 font-body transition-all duration-700 delay-500",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            ✓ {(t.landing.hero as any).social_proof || (language === 'en' 
              ? 'Over 2,000 people have started their journey' 
              : language === 'pt-pt'
              ? 'Mais de 2.000 pessoas já iniciaram a sua jornada'
              : 'Mais de 2.000 pessoas já iniciaram sua jornada')}
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
