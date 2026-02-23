import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { 
  Brain, 
  MessageCircle, 
  Target, 
  Zap, 
  Heart,
  Compass,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const improvementIcons = [Brain, MessageCircle, Target, Zap, Heart, Compass];

const content = {
  pt: {
    title: "Como o Identity revela caminhos práticos",
    subtitle: "O Identity não entrega apenas leituras — ele revela caminhos práticos de crescimento pessoal.",
    description: "Cada dimensão destaca pontos fortes e mostra onde você pode evoluir, sempre com clareza e objetividade.",
    improvementsTitle: "Você descobre:",
    improvements: [
      "Quais padrões emocionais sabotam o seu dia a dia",
      "Onde sua comunicação trava e como melhorar",
      "Como tomar decisões com mais segurança",
      "Em que áreas sua energia está dispersa",
      "Como desenvolver maturidade emocional",
      "Qual direção seguir para ter mais clareza, equilíbrio e propósito"
    ],
    closing: "Tudo isso com orientação da IA e um mapa da identidade que traduz sua arquitetura comportamental, seus talentos e seus desafios — para você usar na vida real.",
    cta: "Começar Agora",
  },
  'pt-pt': {
    title: "Como o Identity revela caminhos práticos",
    subtitle: "O Identity não entrega apenas leituras — revela caminhos práticos de crescimento pessoal.",
    description: "Cada dimensão destaca pontos fortes e mostra onde pode evoluir, sempre com clareza e objetividade.",
    improvementsTitle: "Descobre:",
    improvements: [
      "Que padrões emocionais sabotam o seu dia a dia",
      "Onde a sua comunicação bloqueia e como melhorar",
      "Como tomar decisões com mais segurança",
      "Em que áreas a sua energia está dispersa",
      "Como desenvolver maturidade emocional",
      "Que direção seguir para ter mais clareza, equilíbrio e propósito"
    ],
    closing: "Tudo isto com orientação da IA e um mapa único que traduz a sua personalidade, os seus talentos e os seus desafios — para usar na vida real.",
    cta: "Começar Agora",
  },
  en: {
    title: "How Identity Reveals Practical Paths",
    subtitle: "Identity doesn't just deliver readings — it reveals practical paths for personal growth.",
    description: "Each dimension highlights your strengths and shows where you can evolve, always with clarity and objectivity.",
    improvementsTitle: "You discover:",
    improvements: [
      "Which emotional patterns are sabotaging your daily life",
      "Where your communication breaks down and how to improve",
      "How to make decisions with more confidence",
      "In which areas your energy is scattered",
      "How to develop emotional maturity",
      "What direction to follow for more clarity, balance and purpose"
    ],
    closing: "All of this with AI guidance and a unique map that translates your personality, talents and challenges — for you to use in real life.",
    cta: "Start Now",
  },
};

export const WhyItMattersSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const t = content[lang];

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
                {t.improvements.map((item, index) => {
                  const Icon = improvementIcons[index % improvementIcons.length];
                  return (
                    <li 
                      key={index}
                      className={cn(
                        "flex items-start gap-3 transition-all duration-500",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      )}
                      style={{ transitionDelay: `${150 + index * 50}ms` }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-bruma-deep/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-ink-blue" />
                      </div>
                      <span className="text-foreground leading-relaxed">✔ {item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {/* Closing statement */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-muted-foreground italic leading-relaxed">
                {t.closing}
              </p>
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
                  {lang === 'en' ? '7 Dimensions' : '7 Dimensões'}
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