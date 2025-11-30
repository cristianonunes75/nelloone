import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 gradient-radial" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] gradient-glow opacity-60 subtle-pulse" />
      
      <div ref={ref} className="container relative z-10 px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div 
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-8 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Jornada de Autoconhecimento</span>
          </div>

          {/* Main headline */}
          <h1 
            className={cn(
              "font-display text-display-lg md:text-display-xl text-foreground mb-6 transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Descubra quem você
            <span className="block text-accent">realmente é.</span>
          </h1>

          {/* Subheadline */}
          <p 
            className={cn(
              "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Uma jornada guiada por inteligência artificial para revelar sua essência 
            através de 7 dimensões do autoconhecimento.
          </p>

          {/* CTA */}
          <div 
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <Button 
              size="lg" 
              className="group h-14 px-8 text-base rounded-full shadow-medium hover:shadow-large hover-lift press-effect"
              onClick={() => navigate("/auth")}
            >
              Começar Teste de Arquétipos
              <span className="ml-2 text-primary-foreground/70">(Grátis)</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Trust indicator */}
          <p 
            className={cn(
              "mt-8 text-sm text-muted-foreground transition-all duration-700 delay-500",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            Mais de 2.000 pessoas já iniciaram sua jornada
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
