import { Lock, Check } from "lucide-react";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

// Ícones ultrafinos customizados
const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
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
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

const WavesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M4 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M4 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </svg>
);

const HeartLayersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
    <path d="M12 17l-.9-.82C7.57 13.25 5 11.02 5 8.5 5 6.57 6.57 5 8.5 5c1.08 0 2.11.5 2.78 1.29L12 7l.72-.71C13.39 5.5 14.42 5 15.5 5 17.43 5 19 6.57 19 8.5c0 2.52-2.57 4.75-6.1 7.68L12 17z" opacity="0.5" />
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
    <circle cx="12" cy="12" r="9" />
    {[...Array(9)].map((_, i) => {
      const angle = ((i * 40 - 90) * Math.PI) / 180;
      const x = 12 + 7 * Math.cos(angle);
      const y = 12 + 7 * Math.sin(angle);
      return <circle key={i} cx={x} cy={y} r="1.5" fill="currentColor" />;
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
  {
    number: 1,
    name: "Arquétipos",
    icon: SunIcon,
    description: "Descubra os padrões simbólicos que guiam sua personalidade.",
    isFree: true,
  },
  {
    number: 2,
    name: "DISC",
    icon: QuadrantsIcon,
    description: "Entenda seu estilo de comportamento e comunicação.",
    isFree: false,
  },
  {
    number: 3,
    name: "Temperamentos",
    icon: WavesIcon,
    description: "Conheça sua base temperamental e como ela influencia suas reações.",
    isFree: false,
  },
  {
    number: 4,
    name: "Linguagens do Amor",
    icon: HeartLayersIcon,
    description: "Descubra como você expressa e recebe amor.",
    isFree: false,
  },
  {
    number: 5,
    name: "Inteligências Múltiplas",
    icon: BrainIcon,
    description: "Identifique seus talentos e formas únicas de aprender.",
    isFree: false,
  },
  {
    number: 6,
    name: "Eneagrama",
    icon: EnneagramIcon,
    description: "Explore suas motivações profundas e padrões emocionais.",
    isFree: false,
  },
  {
    number: 7,
    name: "MBTI",
    icon: DiamondIcon,
    description: "Entenda como você percebe o mundo e toma decisões.",
    isFree: false,
  },
];

export const JourneySection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation({ rootMargin: "0px 0px -100px 0px" });

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-bruma-light/50">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div ref={headerRef} className="text-center mb-10 md:mb-16">
            <span 
              className={cn(
                "inline-block text-ink-blue font-medium text-xs md:text-sm tracking-wide uppercase mb-3 md:mb-4 transition-all duration-500",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Os 7 Testes Profissionais
            </span>
            <h2 
              className={cn(
                "font-display text-2xl sm:text-display-sm md:text-display-md lg:text-display-lg text-foreground mb-4 md:mb-6 transition-all duration-500 delay-100",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Testes reconhecidos,
              <span className="block">linguagem acessível</span>
            </h2>
            <p 
              className={cn(
                "text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 transition-all duration-500 delay-200",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Cada teste ilumina uma faceta diferente de quem você é. Juntos, 
              eles compõem o retrato completo da sua personalidade.
            </p>
          </div>

          {/* Journey timeline - Vertical cards on mobile */}
          <div ref={timelineRef} className="relative">
            {/* Connection line - Desktop only */}
            <div 
              className={cn(
                "hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 origin-top transition-transform duration-1000",
                timelineVisible ? "scale-y-100" : "scale-y-0"
              )}
            />

            {/* Mobile: Simple vertical stack */}
            <div className="space-y-3 md:space-y-4 lg:space-y-0">
              {tests.map((test, index) => (
                <div 
                  key={test.name}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-8 ${
                    index % 2 === 0 ? "" : "lg:direction-rtl"
                  }`}
                >
                  {/* Timeline dot - Desktop only */}
                  <div 
                    className={cn(
                      "hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-background rounded-full border border-border items-center justify-center z-10 transition-all duration-500",
                      timelineVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    )}
                    style={timelineVisible ? { transitionDelay: `${index * 0.1}s` } : {}}
                  >
                    <span className="font-display text-sm text-foreground">{test.number}</span>
                  </div>

                  {/* Card */}
                  <div 
                    className={cn(
                      index % 2 === 0 ? "lg:pr-16" : "lg:pl-16 lg:col-start-2",
                      "transition-all duration-500",
                      timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    )}
                    style={timelineVisible ? { transitionDelay: `${index * 0.1 + 0.2}s` } : {}}
                  >
                    <div className="group bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border/50 shadow-soft hover:shadow-medium hover:border-border transition-all duration-300">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-ink-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-ink-blue/15 transition-colors duration-300">
                          <test.icon className="w-5 h-5 md:w-6 md:h-6 text-ink-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 md:mb-2 flex-wrap">
                            <span className="lg:hidden text-xs md:text-sm text-muted-foreground">#{test.number}</span>
                            <h3 className="font-display text-base md:text-lg text-foreground">{test.name}</h3>
                            {test.isFree ? (
                              <span className="px-2 py-0.5 text-[10px] md:text-xs font-medium bg-ink-blue/10 text-ink-blue rounded-full">
                                Grátis
                              </span>
                            ) : (
                              <Lock className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground" strokeWidth={1.5} />
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 md:line-clamp-none">{test.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout - Desktop only */}
                  {index % 2 === 0 && <div className="hidden lg:block" />}
                </div>
              ))}
            </div>
          </div>

          {/* Journey result preview */}
          <div 
            className={cn(
              "mt-10 md:mt-16 text-center transition-all duration-500 delay-700",
              timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-ink-blue/10 text-ink-blue hover:bg-ink-blue/15 transition-colors duration-300">
              <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
              <span className="font-medium text-sm md:text-base">Ao final: seu Mapa NELLO ONE completo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
