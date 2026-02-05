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
    "Relatórios Premium em PDF de cada mapa",
    "Código da Essência incluído",
    "Acesso ao Nello (guia da jornada)",
    "Acesso vitalício aos resultados",
    "Suporte via WhatsApp do criador",
  ];

  return (
    <section id="precos" className="py-16 md:py-24 lg:py-32 bg-accent/5">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <span className="inline-block text-ink-blue font-medium text-xs md:text-sm tracking-wide uppercase mb-3 md:mb-4">
              Acesso Completo
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">
              Jornada Identity Completa
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
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-ink-blue" strokeWidth={1.5} />
                <span className="text-sm font-medium text-ink-blue">Acesso Completo</span>
              </div>
              
              {/* Price */}
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground line-through mb-1">
                  De R$ 597
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-sm text-muted-foreground">por apenas</span>
                  <span className="font-display text-5xl md:text-6xl text-foreground">
                    R$ 297
                  </span>
                </div>
                <p className="text-sm text-ink-blue mt-2 font-medium">
                  Pagamento único • Acesso vitalício
                </p>
              </div>
              
              {/* Benefits */}
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
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
                  Acessar meu Código da Essência
                  <Sparkles className="ml-2 w-5 h-5 text-white/90 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </Button>
                <p className="text-xs text-muted-foreground/70">
                  Acesso vitalício à sua jornada de identidade.
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
