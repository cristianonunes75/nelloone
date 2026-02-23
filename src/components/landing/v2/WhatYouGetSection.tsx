import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { 
  ClipboardList, Map, Brain, Target, TrendingUp, Infinity 
} from "lucide-react";

const itemIcons = [ClipboardList, Map, Brain, Target, TrendingUp, Infinity];

export const WhatYouGetSection = () => {
  const { t, language } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const content = {
    pt: {
      title: "Por dentro do que você recebe",
      subtitle: "Tudo o que está incluído na sua jornada Identity:",
      items: [
        { title: "7 dimensões integradas", description: "Leitura completa da identidade humana" },
        { title: "Mapa da identidade", description: "Visão integrada de quem você é" },
        { title: "Síntese personalizada via IA", description: "Leitura guiada dos seus padrões" },
        { title: "Orientações práticas", description: "Direções concretas para aplicar na vida" },
        { title: "Evolução contínua", description: "Sua leitura cresce com você" },
        { title: "Acesso contínuo", description: "Suas leituras sempre disponíveis" }
      ]
    },
    'pt-pt': {
      title: "Por dentro do que recebe",
      subtitle: "Tudo o que está incluído na sua jornada Identity:",
      items: [
        { title: "7 dimensões integradas", description: "Leitura completa da identidade humana" },
        { title: "Mapa da identidade", description: "Visão integrada de quem é" },
        { title: "Síntese personalizada via IA", description: "Leitura guiada dos seus padrões" },
        { title: "Orientações práticas", description: "Direções concretas para evoluir" },
        { title: "Evolução contínua", description: "A sua leitura cresce consigo" },
        { title: "Acesso contínuo", description: "Leituras sempre disponíveis" }
      ]
    },
    en: {
      title: "Inside what you receive",
      subtitle: "Everything included in your Identity journey:",
      items: [
        { title: "7 integrated dimensions", description: "Complete reading of human identity" },
        { title: "Identity map", description: "Integrated view of who you are" },
        { title: "AI-powered synthesis", description: "Guided reading of your patterns" },
        { title: "Practical guidance", description: "Concrete directions for growth" },
        { title: "Continuous evolution", description: "Your reading grows with you" },
        { title: "Ongoing access", description: "Readings always available" }
      ]
    }
  };

  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const data = content[lang];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/30 relative overflow-hidden">
      <div ref={ref} className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <h2 className={cn(
              "font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-4 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              {data.title}
            </h2>
            <p className={cn(
              "text-muted-foreground text-lg transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              {data.subtitle}
            </p>
          </div>

          {/* 6 cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {data.items.map((item, index) => {
              const IconComponent = itemIcons[index % itemIcons.length];
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center text-center p-6 md:p-8 bg-background rounded-2xl border border-border/30 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1",
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
                  )}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ink-blue/20 to-ink-blue/5 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-ink-blue" strokeWidth={1.5} />
                  </div>
                  <span className="text-foreground font-medium text-sm md:text-base mb-1">
                    {item.title}
                  </span>
                  <span className="text-muted-foreground text-xs md:text-sm">
                    {item.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
