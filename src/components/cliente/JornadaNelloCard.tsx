import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Lock, 
  ShoppingCart,
  ArrowRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { JourneyTestsStatus, JourneyTestSlug, JOURNEY_TEST_SLUGS } from "@/utils/journey";

interface JornadaNelloCardProps {
  status: string;
  totalTests: number;
  completedTests: number;
  testsStatus: Record<string, string>;
  hasCodigoEssencia: boolean;
  userName?: string;
  onContinueJourney?: () => void;
  onViewCodigo?: () => void;
  onPurchaseCodigo?: () => void;
}

const TRANSLATIONS = {
  pt: {
    title: "Sua Jornada NELLO ONE",
    notStarted: {
      title: "Sua Jornada ainda não começou",
      description: "Inicie pelo primeiro teste e eu vou caminhar com você.",
      cta: "Começar Jornada",
    },
    inProgress: {
      title: "Jornada em Progresso",
      description: "Continue sua jornada de autoconhecimento.",
      progress: "testes completos",
      remaining: "Faltam",
      tests: "testes",
      cta: "Continuar Jornada",
    },
    completed: {
      withoutCode: {
        title: "🎉 Parabéns! Jornada Completa!",
        description: "Você concluiu os sete testes da Jornada NELLO ONE.",
        unlock: "Agora pode desbloquear o Código da Essência, o relatório mais profundo que o NELLO ONE pode gerar sobre você.",
        cta: "Conhecer o Código da Essência",
      },
      withCode: {
        title: "✨ Código da Essência Liberado",
        description: "Seu código interior está pronto para ser revelado.",
        cta: "Ver meu Código da Essência",
      },
    },
    tests: {
      arquetipos_proposito: "Arquétipos com Propósito",
      inteligencias_multiplas: "Inteligências Múltiplas",
      estilos_conexao: "Estilos de Conexão Afetiva",
      nello16: "Nello 16 Personality",
      disc: "DISC",
      eneagrama: "Eneagrama",
      temperamentos: "Temperamentos",
    },
  },
  'pt-pt': {
    title: "A Tua Jornada NELLO ONE",
    notStarted: {
      title: "A tua Jornada ainda não começou",
      description: "Começa pelo primeiro teste e eu vou caminhar contigo.",
      cta: "Começar Jornada",
    },
    inProgress: {
      title: "Jornada em Progresso",
      description: "Continua a tua jornada de autoconhecimento.",
      progress: "testes completos",
      remaining: "Faltam",
      tests: "testes",
      cta: "Continuar Jornada",
    },
    completed: {
      withoutCode: {
        title: "🎉 Parabéns! Jornada Completa!",
        description: "Concluíste os sete testes da Jornada NELLO ONE.",
        unlock: "Agora podes desbloquear o Código da Essência, o relatório mais profundo que o NELLO ONE pode gerar sobre ti.",
        cta: "Conhecer o Código da Essência",
      },
      withCode: {
        title: "✨ Código da Essência Liberado",
        description: "O teu código interior está pronto para ser revelado.",
        cta: "Ver o meu Código da Essência",
      },
    },
    tests: {
      arquetipos_proposito: "Arquétipos com Propósito",
      inteligencias_multiplas: "Inteligências Múltiplas",
      estilos_conexao: "Estilos de Conexão Afetiva",
      nello16: "Nello 16 Personality",
      disc: "DISC",
      eneagrama: "Eneagrama",
      temperamentos: "Temperamentos",
    },
  },
  en: {
    title: "Your NELLO ONE Journey",
    notStarted: {
      title: "Your Journey hasn't started yet",
      description: "Start with the first test and I'll walk with you.",
      cta: "Start Journey",
    },
    inProgress: {
      title: "Journey in Progress",
      description: "Continue your self-knowledge journey.",
      progress: "tests completed",
      remaining: "Remaining",
      tests: "tests",
      cta: "Continue Journey",
    },
    completed: {
      withoutCode: {
        title: "🎉 Congratulations! Journey Complete!",
        description: "You've completed the seven tests of the NELLO ONE Journey.",
        unlock: "Now you can unlock the Essence Code, the deepest report that NELLO ONE can generate about you.",
        cta: "Discover the Essence Code",
      },
      withCode: {
        title: "✨ Essence Code Unlocked",
        description: "Your inner code is ready to be revealed.",
        cta: "View my Essence Code",
      },
    },
    tests: {
      arquetipos_proposito: "Archetypes with Purpose",
      inteligencias_multiplas: "Multiple Intelligences",
      estilos_conexao: "Affection Connection Styles",
      nello16: "Nello 16 Personality",
      disc: "DISC",
      eneagrama: "Enneagram",
      temperamentos: "Temperaments",
    },
  },
};

export function JornadaNelloCard({
  status,
  totalTests,
  completedTests,
  testsStatus,
  hasCodigoEssencia,
  userName = "Viajante",
  onContinueJourney,
  onViewCodigo,
  onPurchaseCodigo,
}: JornadaNelloCardProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const t = TRANSLATIONS[lang];
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';

  const progressPercentage = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
  const remainingTests = totalTests - completedTests;

  const handleNavigateToJourney = () => {
    if (onContinueJourney) {
      onContinueJourney();
    } else {
      navigate(`${basePath}/cliente`);
    }
  };

  const handleNavigateToCodigo = () => {
    if (hasCodigoEssencia) {
      if (onViewCodigo) {
        onViewCodigo();
      } else {
        navigate(`${basePath}/cliente/codigo-essencia`);
      }
    } else {
      if (onPurchaseCodigo) {
        onPurchaseCodigo();
      } else {
        // Navigate to sales page
        if (language === 'en') {
          navigate('/en/essence-code-premium');
        } else if (language === 'pt-pt') {
          navigate('/pt-pt/codigo-da-essencia');
        } else {
          navigate('/codigo-da-essencia');
        }
      }
    }
  };

  // Not started state
  if (status === 'not_started') {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <Map className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{t.notStarted.title}</h3>
            <p className="text-sm text-muted-foreground">{t.notStarted.description}</p>
          </div>
        </div>
        <Button onClick={handleNavigateToJourney} className="w-full">
          {t.notStarted.cta}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // In progress state
  if (status === 'in_progress') {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Map className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{t.inProgress.title}</h3>
            <p className="text-sm text-muted-foreground">{t.inProgress.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {completedTests}/{totalTests} {t.inProgress.progress}
            </span>
            <span className="text-sm text-muted-foreground">
              {t.inProgress.remaining} {remainingTests} {t.inProgress.tests}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Tests status list */}
        <div className="space-y-2 mb-4">
          {JOURNEY_TEST_SLUGS.map((slug) => {
            const testStatus = testsStatus[slug] || 'not_started';
            const testName = t.tests[slug as keyof typeof t.tests];
            
            return (
              <div 
                key={slug}
                className={cn(
                  "flex items-center gap-2 text-sm py-1",
                  testStatus === 'completed' && "text-emerald-600 dark:text-emerald-400",
                  testStatus === 'in_progress' && "text-amber-600 dark:text-amber-400",
                  testStatus === 'not_started' && "text-muted-foreground"
                )}
              >
                {testStatus === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : testStatus === 'in_progress' ? (
                  <Circle className="w-4 h-4 fill-current" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span>{testName}</span>
              </div>
            );
          })}
        </div>

        <Button onClick={handleNavigateToJourney} className="w-full">
          {t.inProgress.cta}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Completed state
  if (status === 'completed') {
    if (hasCodigoEssencia) {
      // Completed with Código da Essência unlocked
      return (
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t.completed.withCode.title}</h3>
              <p className="text-sm text-muted-foreground">{t.completed.withCode.description}</p>
            </div>
          </div>

          {/* All tests completed badge */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-emerald-700 dark:text-emerald-400">
              {lang === 'en' ? 'All 7 tests completed!' : 'Todos os 7 testes concluídos!'}
            </span>
          </div>

          <Button onClick={handleNavigateToCodigo} className="w-full gap-2">
            <Sparkles className="w-4 h-4" />
            {t.completed.withCode.cta}
          </Button>
        </div>
      );
    }

    // Completed without Código da Essência
    return (
      <div className="bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-orange-400/20 border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold">{t.completed.withoutCode.title}</h3>
            <p className="text-sm text-muted-foreground">{t.completed.withoutCode.description}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {t.completed.withoutCode.unlock}
        </p>

        <Button onClick={handleNavigateToCodigo} className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
          <ShoppingCart className="w-4 h-4" />
          {t.completed.withoutCode.cta}
        </Button>
      </div>
    );
  }

  return null;
}
