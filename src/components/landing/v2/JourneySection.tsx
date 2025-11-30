import { Crown, Users, Heart, Brain, Flame, Star, Compass, Lock, Check } from "lucide-react";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const tests = [
  {
    number: 1,
    name: "Arquétipos",
    icon: Crown,
    description: "Descubra os padrões simbólicos que guiam sua personalidade.",
    isFree: true,
    color: "bg-violet-500/10 text-violet-600 group-hover:bg-violet-500/20",
  },
  {
    number: 2,
    name: "DISC",
    icon: Users,
    description: "Entenda seu estilo de comportamento e comunicação.",
    isFree: false,
    color: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20",
  },
  {
    number: 3,
    name: "Temperamentos",
    icon: Flame,
    description: "Conheça sua base temperamental e como ela influencia suas reações.",
    isFree: false,
    color: "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500/20",
  },
  {
    number: 4,
    name: "Linguagens do Amor",
    icon: Heart,
    description: "Descubra como você expressa e recebe amor.",
    isFree: false,
    color: "bg-rose-500/10 text-rose-600 group-hover:bg-rose-500/20",
  },
  {
    number: 5,
    name: "Inteligências Múltiplas",
    icon: Brain,
    description: "Identifique seus talentos e formas únicas de aprender.",
    isFree: false,
    color: "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20",
  },
  {
    number: 6,
    name: "Eneagrama",
    icon: Star,
    description: "Explore suas motivações profundas e padrões emocionais.",
    isFree: false,
    color: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20",
  },
  {
    number: 7,
    name: "MBTI",
    icon: Compass,
    description: "Entenda como você percebe o mundo e toma decisões.",
    isFree: false,
    color: "bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-500/20",
  },
];

export const JourneySection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation({ rootMargin: "0px 0px -100px 0px" });

  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div ref={headerRef} className="text-center mb-16">
            <span 
              className={cn(
                "inline-block text-accent font-medium text-sm tracking-wide uppercase mb-4 transition-all duration-500",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              A Jornada Completa
            </span>
            <h2 
              className={cn(
                "font-display text-display-md md:text-display-lg text-foreground mb-6 transition-all duration-500 delay-100",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              7 dimensões para revelar
              <span className="block">sua essência</span>
            </h2>
            <p 
              className={cn(
                "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-200",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Cada teste ilumina uma faceta diferente de quem você é. Juntos, 
              eles compõem o retrato completo da sua personalidade.
            </p>
          </div>

          {/* Journey timeline */}
          <div ref={timelineRef} className="relative">
            {/* Connection line */}
            <div 
              className={cn(
                "hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 origin-top transition-transform duration-1000",
                timelineVisible ? "scale-y-100" : "scale-y-0"
              )}
            />

            <div className="space-y-6 md:space-y-0">
              {tests.map((test, index) => (
                <div 
                  key={test.name}
                  className={`relative md:grid md:grid-cols-2 md:gap-8 ${
                    index % 2 === 0 ? "" : "md:direction-rtl"
                  }`}
                >
                  {/* Timeline dot */}
                  <div 
                    className={cn(
                      "hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-background rounded-full border-2 border-border items-center justify-center z-10 transition-all duration-500",
                      timelineVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    )}
                    style={timelineVisible ? { transitionDelay: `${index * 0.1}s` } : {}}
                  >
                    <span className="font-display text-lg text-foreground">{test.number}</span>
                  </div>

                  {/* Card */}
                  <div 
                    className={cn(
                      index % 2 === 0 ? "md:pr-16" : "md:pl-16 md:col-start-2",
                      "transition-all duration-500",
                      timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    )}
                    style={timelineVisible ? { transitionDelay: `${index * 0.1 + 0.2}s` } : {}}
                  >
                    <div className="group bg-card rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-medium hover:border-border transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300", test.color)}>
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
          <div 
            className={cn(
              "mt-16 text-center transition-all duration-500 delay-700",
              timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 text-accent hover:bg-accent/15 transition-colors duration-300">
              <Check className="w-5 h-5" />
              <span className="font-medium">Ao final: seu Mapa da Essência completo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
