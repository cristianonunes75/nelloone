import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-gold/10 via-background to-accent/10">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Comece sua Jornada</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para revelar sua <span className="text-gold">Essência</span>?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Combine autoconhecimento profundo com fotografia de alta qualidade. 
            Descubra quem você realmente é e comunique isso com verdade e propósito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gold hover:bg-gold-dark text-foreground font-semibold text-lg px-8 py-6"
              onClick={() => {
                const pricingSection = document.getElementById('planos');
                pricingSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Ver Planos e Comprar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10 font-semibold text-lg px-8 py-6"
              onClick={() => navigate("/auth")}
            >
              Entrar na Plataforma
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8 italic">
            ✝️ Atendimento exclusivo em Brasília-DF • Valores cristãos • Excelência garantida
          </p>
        </div>
      </div>
    </section>
  );
};
