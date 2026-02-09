import { Button } from "@/components/ui/button";
import { Check, Sparkles, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export const SimplifiedPricingSection = () => {
  const navigate = useNavigate();
  const { ref: cardRef, isVisible: cardVisible } = useScrollAnimation();

  const benefits = [
    "7 mapas integrados de autoconhecimento",
    "Relatórios premium em PDF (desenvolvimento pessoal, não clínicos)",
    "Código da Essência completo e vitalício",
    "1 Ativação do Código incluída (Relatório de Aplicação Prática)",
    "Decisão guiada para os próximos 7 dias",
    "Acesso contínuo à sua área pessoal e resultados",
  ];

  return (
    <section id="precos" className="py-16 md:py-24 lg:py-32 bg-accent/5">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-nello-gold/80 mb-3 md:mb-4 px-3 py-1">
              Primeira Edição
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-2">
              Condição de Estreia
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Tudo que você precisa para se libertar do que não é você
            </p>
          </div>

          {/* Single pricing card */}
          <div 
            ref={cardRef}
            className={cn(
              "relative transition-all duration-700",
              cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-bruma-blue/20 to-lavender/20 rounded-2xl md:rounded-3xl blur-xl" />
            <div className="relative bg-card rounded-2xl md:rounded-3xl border-2 border-ink-blue/30 p-6 md:p-10 shadow-soft">
              
              {/* Badge */}
              <div className="text-center mb-6">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-nello-gold/80 mb-1">
                  Primeira Edição
                </span>
                <h3 className="font-display text-lg md:text-xl text-foreground font-semibold">
                  Condição de Estreia
                </h3>
              </div>
              
              {/* Price */}
              <div className="text-center mb-6">
                <span className="font-display text-5xl md:text-6xl text-foreground">
                  R$ 648<span className="text-3xl md:text-4xl">,50</span>
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  ou em até 12x de R$ 64,85 no cartão
                </p>
                <p className="text-sm text-ink-blue mt-3 font-medium">
                  Pagamento único • Acesso vitalício
                </p>
              </div>
              
              <p className="text-xs text-muted-foreground text-center mb-6 leading-relaxed">
                Condição válida apenas nesta fase inicial. Depois, o valor retorna para R$ 1.297.
              </p>
              
              {/* Benefits */}
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <li 
                    key={benefit} 
                    className="flex items-center gap-3"
                  >
                    <Check className="w-4 h-4 text-ink-blue flex-shrink-0" strokeWidth={2} />
                    <span className="text-foreground text-sm md:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA */}
              <div className="flex flex-col items-center gap-3">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-base rounded-full bg-nello-gold hover:bg-nello-gold-deep text-white shadow-lg group"
                  onClick={() => navigate("/auth")}
                >
                  Acessar meus Códigos
                  <Sparkles className="ml-2 w-5 h-5 text-white/90 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </Button>
                <p className="text-xs text-muted-foreground/60">
                  Código da Essência + Código do Casal + Ativação incluída
                </p>
              </div>
              
              {/* Trust badge */}
              <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Pagamento seguro via Stripe</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
