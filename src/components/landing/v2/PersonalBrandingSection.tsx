import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Compass, Check } from "lucide-react";

export const PersonalBrandingSection = () => {
  const { t, language } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const content = {
    pt: {
      badge: "Direção Real",
      title: "Transforme Autoconhecimento em Direção Real",
      description: "O Mapa NELLO IDENTITY não apenas revela quem você é. Ele também mostra como aplicar seu autoconhecimento na vida prática. Seus resultados podem orientar sua direção pessoal, comunicação, maturidade emocional e tomada de decisões.",
      subtitle: "Use seu Mapa para:",
      items: [
        "Construir sua jornada pessoal",
        "Definir um caminho com intenção",
        "Fortalecer sua segurança emocional",
        "Comunicar-se com autenticidade",
        "Fazer escolhas alinhadas ao que Deus sonhou para você"
      ]
    },
    'pt-pt': {
      badge: "Direção Real",
      title: "Transforme Autoconhecimento em Direção Real",
      description: "O Mapa NELLO IDENTITY não apenas revela quem é. Ele também mostra como aplicar o seu autoconhecimento na vida prática. Os seus resultados podem orientar a sua direção pessoal, comunicação, maturidade emocional e tomada de decisões.",
      subtitle: "Use o seu Mapa para:",
      items: [
        "Construir a sua jornada pessoal",
        "Definir um caminho com intenção",
        "Fortalecer a sua segurança emocional",
        "Comunicar-se com autenticidade",
        "Fazer escolhas alinhadas ao que Deus sonhou para si"
      ]
    },
    en: {
      badge: "Real Direction",
      title: "Transform Self-Knowledge into Real Direction",
      description: "The NELLO IDENTITY Map doesn't just reveal who you are. It also shows you how to apply your self-knowledge in practical life. Your results can guide your personal direction, communication, emotional maturity and decision-making.",
      subtitle: "Use your Map to:",
      items: [
        "Build your personal journey",
        "Define a path with intention",
        "Strengthen your emotional security",
        "Communicate authentically",
        "Make choices aligned with God's dream for you"
      ]
    }
  };

  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const data = content[lang];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-blue/5 via-transparent to-bruma-blue/5" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Content */}
            <div>
              <div 
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 bg-ink-blue/10 rounded-full mb-6 transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
              >
                <Compass className="w-4 h-4 text-ink-blue" strokeWidth={1.5} />
                <span className="text-sm font-medium text-ink-blue">{data.badge}</span>
              </div>

              <h2 
                className={cn(
                  "font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-6 transition-all duration-700 delay-100",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
              >
                {data.title}
              </h2>

              <p 
                className={cn(
                  "text-muted-foreground text-base md:text-lg leading-relaxed transition-all duration-700 delay-200",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
              >
                {data.description}
              </p>
            </div>

            {/* Benefits List */}
            <div 
              className={cn(
                "bg-muted/40 rounded-2xl p-6 md:p-8 border border-border/30 transition-all duration-700 delay-300",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
              )}
            >
              <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wide">
                {data.subtitle}
              </p>
              <div className="space-y-4">
                {data.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-ink-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-foreground text-sm md:text-base leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
