import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Shield, Brain, Users, Award } from "lucide-react";

const icons = [Shield, Brain, Users, Award];

export const SocialProofSection = () => {
  const { t, language } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  const content = {
    pt: {
      title: "Baseado em Ciência Real",
      items: [
        "Baseado em metodologias reconhecidas",
        "IA treinada em psicologia aplicada ao comportamento",
        "Mais de 2.000 análises no beta",
        "Usado por líderes, pais, jovens e profissionais"
      ]
    },
    'pt-pt': {
      title: "Baseado em Ciência Real",
      items: [
        "Baseado em metodologias reconhecidas",
        "IA treinada em psicologia aplicada ao comportamento",
        "Mais de 2.000 análises no beta",
        "Usado por líderes, pais, jovens e profissionais"
      ]
    },
    en: {
      title: "Based on Real Science",
      items: [
        "Based on recognized methodologies",
        "AI trained in applied behavioral psychology",
        "Over 2,000 analyses in beta",
        "Used by leaders, parents, youth and professionals"
      ]
    }
  };

  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const data = content[lang];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/30 relative overflow-hidden">
      <div ref={ref} className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 
            className={cn(
              "font-display text-2xl sm:text-3xl md:text-4xl text-center text-foreground mb-12 md:mb-16 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {data.title}
          </h2>

          {/* 4 horizontal cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.items.map((item, index) => {
              const IconComponent = icons[index % icons.length];
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center text-center p-5 md:p-6 bg-background rounded-xl border border-border/30 shadow-sm transition-all duration-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                  )}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-ink-blue/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5 text-ink-blue" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm md:text-base text-foreground/80 leading-snug">
                    {item}
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
