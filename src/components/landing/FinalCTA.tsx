import { Button } from "@/components/ui/button";
import { Sparkles, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-gold/10 via-background to-accent/10">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-full mb-6">
            <Flame className="w-4 h-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">Preço de Lançamento • 50% OFF</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para revelar sua <span className="text-gold">Essência</span>?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Combine autoconhecimento profundo com fotografia de alta qualidade. 
            Descubra quem você realmente é e comunique isso com verdade e propósito.
          </p>

          <div className="flex items-baseline justify-center gap-3 mb-8">
            <span className="text-lg text-muted-foreground line-through">R$ 1.297</span>
            <span className="text-3xl md:text-4xl font-bold text-foreground">R$ 648,50</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button 
              size="lg" 
              className="bg-nello-gold hover:bg-nello-gold-deep text-white font-semibold text-lg px-8 py-6 rounded-full shadow-lg group"
              onClick={() => navigate("/auth")}
            >
              Acessar meu Código + 1 Ativação Incluída
              <Sparkles className="w-5 h-5 ml-2 text-white/90 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
            </Button>
            <p className="text-xs text-muted-foreground/70">
              Cupom de lançamento aplicado automaticamente
            </p>
          </div>

          <p className="text-sm text-muted-foreground mt-8 italic">
            ✝️ Atendimento exclusivo em Brasília-DF • Valores cristãos • Excelência garantida
          </p>
        </div>
      </div>
    </section>
  );
};
