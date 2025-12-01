import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/essentia-hero.jpg";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="relative min-h-[85vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden pt-16 md:pt-0">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Essentia - Jornada de Autoconhecimento" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>
      
      {/* Subtle glow - smaller on mobile */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] md:w-[500px] md:h-[500px] gradient-glow opacity-50 subtle-pulse" />
      
      <div ref={ref} className="container relative z-10 px-4 md:px-6 py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main headline - Responsive typography */}
          <h1 
            className={cn(
              "font-display text-[1.75rem] leading-tight sm:text-display-md md:text-display-lg lg:text-display-xl text-foreground mb-4 md:mb-6 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            A resposta que você procura
            <span className="block text-gold">está dentro de você.</span>
          </h1>

          {/* Subheadline - Responsive */}
          <p 
            className={cn(
              "font-miguel text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Miguel te ajuda a enxergar.
          </p>
          
          <p 
            className={cn(
              "text-sm md:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto mb-8 md:mb-12 leading-relaxed px-2 transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Uma jornada guiada por inteligência artificial para revelar sua essência 
            através de 7 dimensões do autoconhecimento.
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
              className="group w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base rounded-full bg-gold hover:bg-gold-dark text-primary-foreground shadow-medium hover:shadow-large hover-lift press-effect"
              onClick={() => navigate("/auth")}
            >
              Começar Teste de Arquétipos
              <span className="ml-2 opacity-80">(Grátis)</span>
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
            Mais de 2.000 pessoas já iniciaram sua jornada
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
