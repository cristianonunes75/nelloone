import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

// Ícones ultrafinos customizados
const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    {[...Array(8)].map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 12 + 6 * Math.cos(angle);
      const y1 = 12 + 6 * Math.sin(angle);
      const x2 = 12 + 8 * Math.cos(angle);
      const y2 = 12 + 8 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
    })}
  </svg>
);

const QuadrantsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

const WavesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M4 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M4 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
  </svg>
);

const BrainIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .14 4.45 2.5 2.5 0 0 0 1.98 3 2.5 2.5 0 0 0 4.82.46" />
    <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1-.14 4.45 2.5 2.5 0 0 1-1.98 3A2.5 2.5 0 0 1 12 19.5" />
    <path d="M12 4.5v15" />
  </svg>
);

const EnneagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    {[...Array(9)].map((_, i) => {
      const angle = ((i * 40 - 90) * Math.PI) / 180;
      const x = 12 + 6 * Math.cos(angle);
      const y = 12 + 6 * Math.sin(angle);
      return <circle key={i} cx={x} cy={y} r="1" fill="currentColor" />;
    })}
  </svg>
);

const DiamondIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 9l10 13 10-13-10-7z" />
    <path d="M12 2v20" />
  </svg>
);

const tests = [
  { name: "Arquétipos", icon: SunIcon, price: 0, questions: 36 },
  { name: "DISC", icon: QuadrantsIcon, price: 97, questions: 28 },
  { name: "Temperamentos", icon: WavesIcon, price: 117, questions: 32 },
  { name: "Linguagens", icon: HeartIcon, price: 127, questions: 30 },
  { name: "Inteligências", icon: BrainIcon, price: 147, questions: 40 },
  { name: "Eneagrama", icon: EnneagramIcon, price: 177, questions: 45 },
  { name: "MBTI", icon: DiamondIcon, price: 197, questions: 60 },
];

const bundleFeatures = [
  "Acesso aos 7 testes completos",
  "Mapa da Essência personalizado",
  "Análise integrada por IA",
  "Export em PDF profissional",
  "Acesso vitalício aos resultados",
];

export const PricingSection = () => {
  const navigate = useNavigate();
  const totalIndividual = tests.reduce((sum, t) => sum + t.price, 0);
  
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: bundleRef, isVisible: bundleVisible } = useScrollAnimation();
  const { ref: testsRef, isVisible: testsVisible } = useScrollAnimation();

  return (
    <section id="precos" className="py-24 md:py-32">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div ref={headerRef} className="text-center mb-16">
            <span 
              className={cn(
                "inline-block text-gold font-medium text-sm tracking-wide uppercase mb-4 transition-all duration-500",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Investimento
            </span>
            <h2 
              className={cn(
                "font-display text-display-md md:text-display-lg text-foreground mb-6 transition-all duration-500 delay-100",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Escolha seu caminho
            </h2>
            <p 
              className={cn(
                "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-200",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Comece gratuitamente com o teste de Arquétipos ou desbloqueie 
              a jornada completa.
            </p>
          </div>

          {/* Bundle highlight */}
          <div 
            ref={bundleRef}
            className={cn(
              "relative mb-16 transition-all duration-700",
              bundleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-soul-amber/10 rounded-3xl blur-xl subtle-pulse" />
            <div className="relative bg-card rounded-3xl border border-gold/20 p-8 md:p-12 shadow-soft hover:shadow-glow hover:border-gold/30 transition-all duration-500">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-gold" strokeWidth={1.5} />
                <span className="text-sm font-medium text-gold">Jornada Completa</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-display text-display-sm text-foreground mb-4">
                    Essentia Completo
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Todos os 7 testes + Mapa da Essência gerado por IA. 
                    A experiência completa de autoconhecimento.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {bundleFeatures.map((feature, index) => (
                      <li 
                        key={feature} 
                        className={cn(
                          "flex items-center gap-3 transition-all duration-300",
                          bundleVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        )}
                        style={bundleVisible ? getStaggerDelay(index, 0.1) : {}}
                      >
                        <Check className="w-4 h-4 text-gold" strokeWidth={1.5} />
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-center md:text-right">
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground line-through mb-1">
                      De R$ {totalIndividual}
                    </p>
                    <div className="flex items-baseline justify-center md:justify-end gap-2">
                      <span className="text-sm text-muted-foreground">Por</span>
                      <span className="font-display text-4xl text-foreground">R$ 597</span>
                    </div>
                    <p className="text-sm text-gold mt-1">
                      Economize R$ {totalIndividual - 597}
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    className="group h-12 px-6 text-base rounded-full w-full md:w-auto bg-gold hover:bg-gold-dark text-primary-foreground hover-lift press-effect"
                    onClick={() => navigate("/auth")}
                  >
                    Começar Jornada Completa
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Individual tests */}
          <div ref={testsRef}>
            <h3 
              className={cn(
                "font-display text-lg text-foreground text-center mb-8 transition-all duration-500",
                testsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Ou adquira testes individualmente
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tests.map((test, index) => (
                <div 
                  key={test.name}
                  className={cn(
                    "bg-card rounded-2xl p-5 border border-border/30 shadow-soft hover:shadow-medium hover:border-border/50 transition-all duration-300 hover-lift cursor-default",
                    testsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}
                  style={testsVisible ? getStaggerDelay(index, 0.08) : {}}
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                    <test.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h4 className="font-medium text-foreground text-sm mb-1">{test.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{test.questions} perguntas</p>
                  <div className="flex items-baseline gap-1">
                    {test.price === 0 ? (
                      <span className="font-display text-lg text-gold">Grátis</span>
                    ) : (
                      <>
                        <span className="text-xs text-muted-foreground">R$</span>
                        <span className="font-display text-lg text-foreground">{test.price}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
