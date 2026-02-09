import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-gold/10 via-background to-accent/10">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-nello-gold/80 mb-1">
              Primeira Edição
            </span>
            <h3 className="text-sm font-semibold text-foreground">Condição de Estreia</h3>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para revelar sua <span className="text-gold">Essência</span>?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Descubra quem você realmente é e comunique isso com verdade e propósito.
          </p>

          <div className="text-center mb-4">
            <span className="text-3xl md:text-4xl font-bold text-foreground">R$ 648,50</span>
            <p className="text-xs text-muted-foreground mt-1">ou 12x de R$ 64,85</p>
          </div>
          
          <p className="text-xs text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            Condição válida apenas nesta fase inicial. Depois, o valor retorna para R$ 1.297.
          </p>

          <div className="flex flex-col items-center gap-3">
            <Button 
              size="lg" 
              className="bg-nello-gold hover:bg-nello-gold-deep text-white font-semibold text-lg px-8 py-6 rounded-full shadow-lg group"
              onClick={() => navigate("/auth")}
            >
              Acessar meus Códigos
              <Sparkles className="w-5 h-5 ml-2 text-white/90 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
            </Button>
            <p className="text-xs text-muted-foreground/60">
              Código da Essência + Ativação incluída
            </p>
          </div>

          <p className="text-[10px] text-muted-foreground/50 mt-8 max-w-sm mx-auto leading-relaxed">
            O Identity Nello One é uma ferramenta de autoconhecimento e desenvolvimento pessoal. Não substitui diagnóstico psicológico ou acompanhamento terapêutico.
          </p>
        </div>
      </div>
    </section>
  );
};
