import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Compass, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import miguelImage from "@/assets/miguel-presence.jpg";

export const MiguelSection = () => {
  const navigate = useNavigate();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { t, language } = useLanguage();

  const traits = language === 'en' ? [
    { icon: Heart, title: "Welcoming", description: "Miguel receives you without judgment, with genuine empathy." },
    { icon: Compass, title: "Wise Guide", description: "Guides your journey with depth and clarity." },
    { icon: Lightbulb, title: "Revealer", description: "Helps you see patterns you hadn't noticed before." },
  ] : [
    { icon: Heart, title: "Acolhedor", description: "Miguel recebe você sem julgamentos, com empatia genuína." },
    { icon: Compass, title: "Guia Sábio", description: "Conduz sua jornada com profundidade e clareza." },
    { icon: Lightbulb, title: "Revelador", description: "Ajuda você a enxergar padrões que ainda não havia percebido." },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 gradient-soul">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div ref={headerRef} className="text-center mb-10 md:mb-16">
            <span 
              className={cn(
                "inline-block text-ink-blue font-medium text-xs md:text-sm tracking-wide uppercase mb-3 md:mb-4 transition-all duration-700",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {t.landing.miguel.subtitle}
            </span>
            <h2 
              className={cn(
                "font-display text-2xl sm:text-display-sm md:text-display-md lg:text-display-lg text-foreground mb-4 md:mb-6 transition-all duration-700 delay-100",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {t.landing.miguel.title}
            </h2>
            <p 
              className={cn(
                "text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 transition-all duration-700 delay-200",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {t.landing.miguel.description}
            </p>
          </div>

          {/* Miguel visual + traits - Stack on mobile */}
          <div ref={contentRef} className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Visual representation - Centered avatar on mobile */}
            <div 
              className={cn(
                "relative transition-all duration-700 w-full",
                contentVisible ? "opacity-100 translate-x-0" : "opacity-0 md:-translate-x-8"
              )}
            >
              <div className="aspect-square max-w-[280px] md:max-w-md mx-auto relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-bruma-blue/30 to-ink-blue/20 rounded-full blur-3xl subtle-pulse" />
                
                {/* Miguel image */}
                <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-large border border-border/30">
                  <img 
                    src={miguelImage} 
                    alt="Miguel - Your guide in NELLO ONE"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/40 to-transparent" />
                </div>

                {/* Floating icon - Smaller on mobile */}
                <div className={cn(
                  "absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 bg-card rounded-xl md:rounded-2xl shadow-large flex items-center justify-center border border-border/30 transition-all duration-500 delay-300",
                  contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-bruma-blue/30 flex items-center justify-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-ink-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C12 2 8 6 8 10c0 2.21 1.79 4 4 4s4-1.79 4-4c0-4-4-8-4-8z" />
                      <path d="M12 14v8" />
                      <path d="M9 18h6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Traits list */}
            <div 
              className={cn(
                "space-y-4 md:space-y-6 transition-all duration-700 delay-200 w-full",
                contentVisible ? "opacity-100 translate-x-0" : "opacity-0 md:translate-x-8"
              )}
            >
              <div className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border/30 shadow-soft hover:shadow-medium transition-shadow duration-300">
                <p className="font-premium text-foreground leading-relaxed text-base md:text-xl">
                  {language === 'en' 
                    ? '"I am Miguel, your guide in NELLO ONE. My mission is to help you understand who you are, with clarity, depth and lightness."'
                    : '"Eu sou o Miguel, seu guia no NELLO ONE. Minha missão é ajudar você a entender quem você é, com clareza, profundidade e leveza."'}
                </p>
              </div>

              <div className="grid gap-3 md:gap-4">
                {traits.map((trait, index) => (
                  <div 
                    key={trait.title}
                    className={cn(
                      "flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-500 cursor-default",
                      contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    )}
                    style={contentVisible ? getStaggerDelay(index + 2, 0.1) : {}}
                  >
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-ink-blue/10 flex items-center justify-center flex-shrink-0">
                      <trait.icon className="w-4 h-4 md:w-5 md:h-5 text-ink-blue" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm md:text-base mb-0.5 md:mb-1">{trait.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{trait.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline"
                size="lg" 
                className="group w-full md:w-auto h-11 md:h-12 px-6 text-sm md:text-base rounded-full border-ink-blue/30 text-foreground hover:bg-ink-blue/5 hover:border-ink-blue/50 press-effect"
                onClick={() => navigate("/auth")}
              >
                {t.landing.miguel.cta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
