import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { 
  Heart, 
  Lightbulb, 
  MessageCircle, 
  Users, 
  Target, 
  Eye, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const improvements = {
  pt: [
    { icon: Heart, text: "padrões emocionais" },
    { icon: Lightbulb, text: "clareza interna" },
    { icon: MessageCircle, text: "comunicação" },
    { icon: Users, text: "relacionamentos" },
    { icon: Target, text: "tomada de decisão" },
    { icon: Eye, text: "consciência de forças e pontos cegos" },
    { icon: Sparkles, text: "ações práticas do dia a dia" },
  ],
  en: [
    { icon: Heart, text: "emotional patterns" },
    { icon: Lightbulb, text: "inner clarity" },
    { icon: MessageCircle, text: "communication" },
    { icon: Users, text: "relationships" },
    { icon: Target, text: "decision-making" },
    { icon: Eye, text: "strengths and blind spots awareness" },
    { icon: Sparkles, text: "practical next steps" },
  ],
};

const content = {
  pt: {
    title: "Por que fazer seus testes no Nello One?",
    subtitle: "Você só muda aquilo que consegue enxergar.",
    description: "Cada teste revela exatamente o que está impedindo você de avançar — e como destravar.",
    improvementsTitle: "Você melhora:",
    cta: "Começar Agora",
  },
  en: {
    title: "Why take your tests at Nello One?",
    subtitle: "You can only change what you can see.",
    description: "Each test reveals exactly what is holding you back — and how to unlock it.",
    improvementsTitle: "You improve:",
    cta: "Start Now",
  },
};

export const WhyItMattersSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const lang = language === 'en' ? 'en' : 'pt';
  const t = content[lang];
  const items = improvements[lang];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-bruma/30 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-bruma-deep/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-ice-lavender/10 rounded-full blur-3xl" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Content */}
          <div 
            className={cn(
              "space-y-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}
          >
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-tight">
              {t.title}
            </h2>
            
            <div className="space-y-2">
              <p className="text-lg md:text-xl font-medium text-ink-blue">
                {t.subtitle}
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {t.description}
              </p>
            </div>
            
            <div className="pt-4">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
                {t.improvementsTitle}
              </p>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li 
                    key={index}
                    className={cn(
                      "flex items-center gap-3 transition-all duration-500",
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    )}
                    style={{ transitionDelay: `${150 + index * 50}ms` }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-bruma-deep/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-ink-blue" />
                    </div>
                    <span className="text-foreground font-medium">✔ {item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="outline"
                className="group rounded-full px-6 border-ink-blue/30 hover:bg-ink-blue/5"
                onClick={() => navigate(lang === 'en' ? '/en/auth' : '/auth')}
              >
                {t.cta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
          
          {/* Right Column - Illustration */}
          <div 
            className={cn(
              "relative transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-bruma-deep/20 via-ice-lavender/20 to-bruma/30 rounded-3xl blur-xl" />
              
              {/* Main card */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-bruma-deep/10 shadow-xl">
                {/* Journey visualization */}
                <div className="space-y-6">
                  {/* Start point */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-muted-foreground/20 to-ink-blue/40" />
                  </div>
                  
                  {/* Progress steps */}
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-4 pl-6">
                      <div 
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                          step <= 2 ? "bg-ink-blue/20" : "bg-muted"
                        )}
                        style={{ transitionDelay: `${300 + step * 100}ms` }}
                      >
                        <Sparkles className={cn(
                          "w-5 h-5",
                          step <= 2 ? "text-ink-blue" : "text-muted-foreground/40"
                        )} />
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-ink-blue/20 to-transparent" />
                    </div>
                  ))}
                  
                  {/* End point - Essence Map */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ink-blue to-ink-deep flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">
                        {lang === 'en' ? 'Your Map' : 'Seu Mapa'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lang === 'en' ? 'Complete clarity' : 'Clareza completa'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full px-4 py-2 shadow-lg border border-bruma-deep/10">
                <span className="text-sm font-medium text-ink-blue">
                  {lang === 'en' ? '7 Tests' : '7 Testes'}
                </span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full px-4 py-2 shadow-lg border border-bruma-deep/10">
                <span className="text-sm font-medium text-ink-blue">
                  {lang === 'en' ? 'AI Guided' : 'Guiado por IA'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
