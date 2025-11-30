import { Crown, Users, Heart, Brain, Flame, Star, Compass, Lock, Check } from "lucide-react";

const tests = [
  {
    number: 1,
    name: "Arquétipos",
    icon: Crown,
    description: "Descubra os padrões simbólicos que guiam sua personalidade.",
    isFree: true,
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    number: 2,
    name: "DISC",
    icon: Users,
    description: "Entenda seu estilo de comportamento e comunicação.",
    isFree: false,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    number: 3,
    name: "Temperamentos",
    icon: Flame,
    description: "Conheça sua base temperamental e como ela influencia suas reações.",
    isFree: false,
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    number: 4,
    name: "Linguagens do Amor",
    icon: Heart,
    description: "Descubra como você expressa e recebe amor.",
    isFree: false,
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    number: 5,
    name: "Inteligências Múltiplas",
    icon: Brain,
    description: "Identifique seus talentos e formas únicas de aprender.",
    isFree: false,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    number: 6,
    name: "Eneagrama",
    icon: Star,
    description: "Explore suas motivações profundas e padrões emocionais.",
    isFree: false,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    number: 7,
    name: "MBTI",
    icon: Compass,
    description: "Entenda como você percebe o mundo e toma decisões.",
    isFree: false,
    color: "bg-cyan-500/10 text-cyan-600",
  },
];

export const JourneySection = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-medium text-sm tracking-wide uppercase mb-4">
              A Jornada Completa
            </span>
            <h2 className="font-display text-display-md md:text-display-lg text-foreground mb-6">
              7 dimensões para revelar
              <span className="block">sua essência</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada teste ilumina uma faceta diferente de quem você é. Juntos, 
              eles compõem o retrato completo da sua personalidade.
            </p>
          </div>

          {/* Journey timeline */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            <div className="space-y-6 md:space-y-0">
              {tests.map((test, index) => (
                <div 
                  key={test.name}
                  className={`relative md:grid md:grid-cols-2 md:gap-8 ${
                    index % 2 === 0 ? "" : "md:direction-rtl"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-background rounded-full border-2 border-border items-center justify-center z-10">
                    <span className="font-display text-lg text-foreground">{test.number}</span>
                  </div>

                  {/* Card */}
                  <div 
                    className={`${
                      index % 2 === 0 ? "md:pr-16" : "md:pl-16 md:col-start-2"
                    }`}
                  >
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-medium transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${test.color} flex items-center justify-center flex-shrink-0`}>
                          <test.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="md:hidden text-sm text-muted-foreground">#{test.number}</span>
                            <h3 className="font-display text-xl text-foreground">{test.name}</h3>
                            {test.isFree ? (
                              <span className="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
                                Grátis
                              </span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{test.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  {index % 2 === 0 && <div className="hidden md:block" />}
                </div>
              ))}
            </div>
          </div>

          {/* Journey result preview */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 text-accent">
              <Check className="w-5 h-5" />
              <span className="font-medium">Ao final: seu Mapa da Essência completo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
