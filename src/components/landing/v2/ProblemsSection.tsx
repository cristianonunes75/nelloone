import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { 
  AlertCircle,
  Brain,
  Target,
  MessageCircle,
  Focus,
  RotateCcw,
  Sparkles,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

const problemIcons = [
  AlertCircle,
  Brain,
  Target,
  MessageCircle,
  Focus,
  RotateCcw,
  Sparkles,
  TrendingUp
];

const content = {
  pt: {
    title: "Problemas que o NELLO ONE resolve",
    subtitle: "Autoconhecimento transforma, mas pode ser confuso quando você não sabe por onde começar.",
    description: "O NELLO ONE traz clareza, estrutura e direção resolvendo os problemas que a maioria das pessoas enfrenta nessa jornada.",
    problemsTitle: "O NELLO ONE ajuda você a superar:",
    problems: [
      "Sensação de estar perdido, sem direção ou propósito",
      "Padrões emocionais que se repetem e você não sabe explicar",
      "Dificuldade de tomar decisões ou manter consistência",
      "Problemas de comunicação em relacionamentos ou no trabalho",
      "Falta de foco, disciplina ou clareza mental",
      "Repetição dos mesmos erros sem entender a raiz",
      "Saber seus talentos, mas não saber como usá-los",
      "Começar mudanças e travar no meio do caminho"
    ],
    closing: "Com o NELLO ONE, você entende quem você é, por que age como age e como transformar o que não te serve mais."
  },
  'pt-pt': {
    title: "Problemas que o NELLO ONE resolve",
    subtitle: "O autoconhecimento transforma, mas pode ser confuso quando não sabe por onde começar.",
    description: "O NELLO ONE traz clareza, estrutura e direção ao resolver os problemas que a maioria das pessoas enfrenta nesta jornada.",
    problemsTitle: "O NELLO ONE ajuda-o a superar:",
    problems: [
      "Sensação de estar perdido, sem direção ou propósito",
      "Padrões emocionais que se repetem e não sabe explicar",
      "Dificuldade em tomar decisões ou manter consistência",
      "Problemas de comunicação nas relações ou no trabalho",
      "Falta de foco, disciplina ou clareza mental",
      "Repetição dos mesmos erros sem entender a raiz",
      "Saber os seus talentos, mas não saber como usá-los",
      "Começar mudanças e bloquear a meio do caminho"
    ],
    closing: "Com o NELLO ONE, entende quem é, por que age como age e como transformar o que já não o serve."
  },
  en: {
    title: "Problems NELLO ONE Solves",
    subtitle: "Self-knowledge is powerful, but it's confusing when you don't know where to start.",
    description: "NELLO ONE brings clarity, structure and direction by solving the problems that most people face when trying to understand themselves.",
    problemsTitle: "NELLO ONE helps you overcome:",
    problems: [
      "Feeling lost about your direction, purpose or identity",
      "Struggling with emotional patterns you can't explain",
      "Difficulty making decisions or staying consistent",
      "Communication issues in relationships and work",
      "Lack of focus, discipline or clarity",
      "Repeating the same mistakes without understanding why",
      "Knowing your strengths but not knowing how to use them",
      "Starting a transformation journey but getting stuck along the way"
    ],
    closing: "With NELLO ONE, you finally understand who you are, why you act the way you do and how to change what no longer helps you."
  }
};

export const ProblemsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { language } = useLanguage();
  
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const t = content[lang];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-destructive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-bruma-deep/5 rounded-full blur-3xl" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div 
            className={cn(
              "text-center mb-12 md:mb-16 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
              {t.title}
            </h2>
            <p className="text-lg md:text-xl text-ink-blue font-medium mb-3">
              {t.subtitle}
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>

          {/* Problems Grid */}
          <div 
            className={cn(
              "mb-12 transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-6 text-center">
              {t.problemsTitle}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {t.problems.map((problem, index) => {
                const Icon = problemIcons[index % problemIcons.length];
                return (
                  <div
                    key={index}
                    className={cn(
                      "group flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-border/50 hover:border-ink-blue/30 hover:shadow-sm transition-all duration-500",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    )}
                    style={{ transitionDelay: `${200 + index * 80}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 group-hover:bg-ink-blue/10 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-destructive/70 group-hover:text-ink-blue transition-colors duration-300" />
                    </div>
                    <p className="text-foreground/90 text-sm md:text-base leading-relaxed pt-2">
                      {problem}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Closing Statement */}
          <div 
            className={cn(
              "text-center transition-all duration-700 delay-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <div className="inline-flex items-start gap-3 bg-gradient-to-r from-ink-blue/10 via-bruma-deep/10 to-ice-lavender/20 rounded-2xl p-6 md:p-8 border border-ink-blue/10">
              <CheckCircle2 className="w-6 h-6 text-ink-blue flex-shrink-0 mt-0.5" />
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