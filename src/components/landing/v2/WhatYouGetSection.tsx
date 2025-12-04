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
      subtitle: "Tudo o que você recebe no NELLO ONE:",
      items: [
        { title: "7 testes profissionais", description: "Avaliações validadas cientificamente" },
        { title: "Mapa completo de identidade", description: "Visão integrada de quem você é" },
        { title: "Insights personalizados via IA", description: "Miguel analisa seus padrões" },
        { title: "Recomendações práticas", description: "Ações concretas para evoluir" },
        { title: "Evolução contínua", description: "Seu perfil cresce com você" },
        { title: "Acesso vitalício", description: "Resultados sempre disponíveis" }
      ]
    },
    'pt-pt': {
      title: "Por dentro do que recebe",
      subtitle: "Tudo o que recebe no NELLO ONE:",
      items: [
        { title: "7 testes profissionais", description: "Avaliações validadas cientificamente" },
        { title: "Mapa completo de identidade", description: "Visão integrada de quem é" },
        { title: "Insights personalizados via IA", description: "Miguel analisa os seus padrões" },
        { title: "Recomendações práticas", description: "Ações concretas para evoluir" },
        { title: "Evolução contínua", description: "O seu perfil cresce consigo" },
        { title: "Acesso vitalício", description: "Resultados sempre disponíveis" }
      ]
    },
    en: {
      title: "Inside what you receive",
      subtitle: "Everything you get with NELLO ONE:",
      items: [
        { title: "7 professional tests", description: "Scientifically validated assessments" },
        { title: "Complete identity map", description: "Integrated view of who you are" },
        { title: "AI-powered insights", description: "Miguel analyzes your patterns" },
        { title: "Practical recommendations", description: "Concrete actions for growth" },
        { title: "Continuous evolution", description: "Your profile grows with you" },
        { title: "Lifetime access", description: "Results always available" }
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
