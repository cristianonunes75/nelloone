import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-foreground" />
      <div className="absolute inset-0 gradient-glow opacity-30" />
      
      <div className="container px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-display-md md:text-display-lg text-primary-foreground mb-6">
            Sua essência está esperando
            <span className="block">para ser revelada.</span>
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto">
            Comece agora com o teste gratuito de Arquétipos e dê o primeiro 
            passo na sua jornada de autodescoberta.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="group h-14 px-8 text-base rounded-full shadow-large"
            onClick={() => navigate("/auth")}
          >
            Começar Teste de Arquétipos (Grátis)
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
