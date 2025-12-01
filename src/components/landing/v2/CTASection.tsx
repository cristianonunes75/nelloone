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
          <p 
            className={cn(
              "font-premium text-lg md:text-xl lg:text-2xl text-primary-foreground/80 mb-4 md:mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            "{language === 'en' ? 'Your next step begins within.' : 'Seu próximo passo começa dentro.'}"
          </p>
          <h2 
            className={cn(
              "font-display text-2xl sm:text-display-sm md:text-display-md lg:text-display-lg text-primary-foreground mb-4 md:mb-6 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {language === 'en' ? (
              <>
                The path begins
                <span className="block">within.</span>
              </>
            ) : (
              <>
                O caminho começa
                <span className="block">dentro.</span>
              </>
            )}
          </h2>
          <p 
            className={cn(
              "text-sm md:text-base text-primary-foreground/70 mb-8 md:mb-10 max-w-xl mx-auto px-2 transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {language === 'en' 
              ? 'Start now with the free Archetypes test and take the first step in your self-discovery journey.'
              : 'Comece agora com o teste gratuito de Arquétipos e dê o primeiro passo na sua jornada de autodescoberta.'}
          </p>
          <Button 
            size="lg" 
            className={cn(
              "group w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base rounded-full bg-background hover:bg-background/90 text-ink-blue shadow-large hover-lift press-effect transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            onClick={() => navigate(language === 'en' ? "/en/auth" : "/auth")}
          >
            {t.landing.cta.button} {language === 'en' ? '(Free)' : '(Grátis)'}
            <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};
