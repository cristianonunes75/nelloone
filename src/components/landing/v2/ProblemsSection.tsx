import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { 
  AlertCircle, Brain, Target, MessageCircle,
  Focus, RotateCcw, Sparkles, TrendingUp, CheckCircle2
} from "lucide-react";

const problemIcons = [AlertCircle, Brain, Target, MessageCircle, Focus, RotateCcw, Sparkles, TrendingUp];

const content = {
  pt: {
    title: "Desafios que o Identity ilumina",
    subtitle: "Autoconhecimento transforma, mas pode ser confuso quando você não sabe por onde começar.",
    problems: [
      "Sensação de estar perdido, sem direção ou propósito",
      "Padrões emocionais que se repetem sem explicação",
      "Dificuldade de tomar decisões",
      "Problemas de comunicação",
      "Falta de foco e clareza mental",
      "Repetição dos mesmos erros",
      "Saber seus talentos, mas não saber como usá-los",
      "Insegurança sobre qual passo dar primeiro"
    ],
    closing: "Com o Identity, você entende quem você é, por que age como age e como transformar o que já não serve mais."
  },
  'pt-pt': {
    title: "Desafios que o Identity ilumina",
    subtitle: "O autoconhecimento transforma, mas pode ser confuso quando não sabe por onde começar.",
    problems: [
      "Sensação de estar perdido, sem direção ou propósito",
      "Padrões emocionais que se repetem sem explicação",
      "Dificuldade em tomar decisões",
      "Problemas de comunicação",
      "Falta de foco e clareza mental",
      "Repetição dos mesmos erros",
      "Saber os seus talentos, mas não saber como usá-los",
      "Insegurança sobre qual passo dar primeiro"
    ],
    closing: "Com o Identity, entende quem é, por que age como age e como transformar o que já não o serve."
  },
  en: {
    title: "Challenges Identity Illuminates",
    subtitle: "Self-knowledge transforms, but it can be confusing when you don't know where to start.",
    problems: [
      "Feeling lost, without direction or purpose",
      "Emotional patterns that repeat without explanation",
      "Difficulty making decisions",
      "Communication problems",
      "Lack of focus and mental clarity",
      "Repeating the same mistakes",
      "Knowing your talents but not how to use them",
      "Uncertainty about which step to take first"
    ],
    closing: "With Identity, you understand who you are, why you act the way you do, and how to transform what no longer serves you."
  }
};

export const ProblemsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { language } = useLanguage();
  
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const t = content[lang];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-destructive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-bruma-deep/5 rounded-full blur-3xl" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={cn(
            "text-center mb-14 md:mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
              {t.title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Problems Grid - 8 cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {t.problems.map((problem, index) => {
              const Icon = problemIcons[index % problemIcons.length];
              return (
                <div
                  key={index}
                  className={cn(
                    "group flex items-start gap-4 p-5 rounded-xl bg-white/60 dark:bg-white/5 border border-border/50 hover:border-ink-blue/30 hover:shadow-md transition-all duration-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}
                  style={{ transitionDelay: `${100 + index * 60}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 group-hover:bg-ink-blue/10 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-destructive/70 group-hover:text-ink-blue transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-foreground/90 text-sm md:text-base leading-relaxed pt-2">
                    {problem}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Closing Statement */}
          <div className={cn(
            "text-center transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}>
            <div className="inline-flex items-start gap-3 bg-gradient-to-r from-ink-blue/10 via-bruma-deep/10 to-lavender/20 rounded-2xl p-6 md:p-8 border border-ink-blue/10">
              <CheckCircle2 className="w-6 h-6 text-ink-blue flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-foreground font-medium text-base md:text-lg leading-relaxed text-left">
                {t.closing}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
