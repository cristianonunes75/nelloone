import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export const CTASection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-foreground" />
      <div className="absolute inset-0 gradient-glow opacity-30" />
      
      <div ref={ref} className="container px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className={cn(
              "font-display text-display-md md:text-display-lg text-primary-foreground mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Sua essência está esperando
            <span className="block">para ser revelada.</span>
          </h2>
          <p 
            className={cn(
              "text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto transition-all duration-700 delay-150",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Comece agora com o teste gratuito de Arquétipos e dê o primeiro 
            passo na sua jornada de autodescoberta.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className={cn(
              "group h-14 px-8 text-base rounded-full shadow-large hover-lift press-effect transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            onClick={() => navigate("/auth")}
          >
            Começar Teste de Arquétipos (Grátis)
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};
