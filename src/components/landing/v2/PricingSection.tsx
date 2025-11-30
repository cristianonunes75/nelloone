import { Button } from "@/components/ui/button";
import { Crown, Users, Heart, Brain, Flame, Star, Compass, ArrowRight, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tests = [
  { name: "Arquétipos", icon: Crown, price: 0, questions: 36, color: "bg-violet-500/10 text-violet-600" },
  { name: "DISC", icon: Users, price: 97, questions: 28, color: "bg-blue-500/10 text-blue-600" },
  { name: "Temperamentos", icon: Flame, price: 117, questions: 32, color: "bg-orange-500/10 text-orange-600" },
  { name: "Linguagens do Amor", icon: Heart, price: 127, questions: 30, color: "bg-rose-500/10 text-rose-600" },
  { name: "Inteligências", icon: Brain, price: 147, questions: 40, color: "bg-emerald-500/10 text-emerald-600" },
  { name: "Eneagrama", icon: Star, price: 177, questions: 45, color: "bg-amber-500/10 text-amber-600" },
  { name: "MBTI", icon: Compass, price: 197, questions: 60, color: "bg-cyan-500/10 text-cyan-600" },
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

  return (
    <section id="precos" className="py-24 md:py-32">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-medium text-sm tracking-wide uppercase mb-4">
              Investimento
            </span>
            <h2 className="font-display text-display-md md:text-display-lg text-foreground mb-6">
              Escolha seu caminho
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comece gratuitamente com o teste de Arquétipos ou desbloqueie 
              a jornada completa.
            </p>
          </div>

          {/* Bundle highlight */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-gold/20 rounded-3xl blur-xl" />
            <div className="relative bg-card rounded-3xl border-2 border-accent/30 p-8 md:p-12 shadow-glow">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-accent">Jornada Completa</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-display text-display-sm text-foreground mb-4">
                    Essentia Completo
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Todos os 7 testes + Mapa da Essência gerado por IA. 
                    A experiência completa de autoconhecimento.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {bundleFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-accent" />
                        <span className="text-foreground">{feature}</span>
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
                      <span className="font-display text-5xl text-foreground">R$ 597</span>
                    </div>
                    <p className="text-sm text-accent mt-1">
                      Economize R$ {totalIndividual - 597}
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    className="group h-14 px-8 text-base rounded-full w-full md:w-auto"
                    onClick={() => navigate("/auth")}
                  >
                    Começar Jornada Completa
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Individual tests */}
          <div>
            <h3 className="font-display text-xl text-foreground text-center mb-8">
              Ou adquira testes individualmente
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tests.map((test) => (
                <div 
                  key={test.name}
                  className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft hover:shadow-medium transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl ${test.color} flex items-center justify-center mb-4`}>
                    <test.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">{test.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{test.questions} perguntas</p>
                  <div className="flex items-baseline gap-1">
                    {test.price === 0 ? (
                      <span className="font-display text-xl text-accent">Grátis</span>
                    ) : (
                      <>
                        <span className="text-sm text-muted-foreground">R$</span>
                        <span className="font-display text-xl text-foreground">{test.price}</span>
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
