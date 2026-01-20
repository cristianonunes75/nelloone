import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Pause, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface TestCompletionCardProps {
  testName?: string;
  completedTests: number;
  totalTests: number;
  nextTestName?: string;
  isLastTest?: boolean;
  onContinue: () => void;
  onPause?: () => void;
  lang?: 'pt' | 'pt-pt' | 'en';
}

export function TestCompletionCard({
  testName,
  completedTests,
  totalTests,
  nextTestName,
  isLastTest = false,
  onContinue,
  onPause,
  lang = 'pt'
}: TestCompletionCardProps) {
  const progressPercent = (completedTests / totalTests) * 100;

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      completedBadge: {
        pt: 'Teste concluído',
        'pt-pt': 'Teste concluído',
        en: 'Test completed'
      },
      oneOfSeven: {
        pt: `Esse é um dos ${totalTests} mapas do seu perfil. Quando quiser, siga para o próximo.`,
        'pt-pt': `Este é um dos ${totalTests} mapas do seu perfil. Quando quiser, siga para o próximo.`,
        en: `This is one of ${totalTests} maps of your profile. Continue when ready.`
      },
      remaining: {
        pt: `Faltam ${totalTests - completedTests} testes para completar o Código da Essência`,
        'pt-pt': `Faltam ${totalTests - completedTests} testes para completar o Código da Essência`,
        en: `${totalTests - completedTests} tests remaining for the Essence Code`
      },
      allComplete: {
        pt: 'Você completou todos os testes! Seu Código da Essência está pronto.',
        'pt-pt': 'Completou todos os testes! O seu Código da Essência está pronto.',
        en: 'You completed all tests! Your Essence Code is ready.'
      },
      continueBtn: {
        pt: 'Continuar quando quiser',
        'pt-pt': 'Continuar quando quiser',
        en: 'Continue when ready'
      },
      pauseBtn: {
        pt: 'Pausar por agora',
        'pt-pt': 'Pausar por agora',
        en: 'Pause for now'
      },
      progressSaved: {
        pt: 'Você pode parar agora. Seu progresso está salvo.',
        'pt-pt': 'Pode parar agora. O seu progresso está guardado.',
        en: 'You can stop now. Your progress is saved.'
      },
      viewEssence: {
        pt: 'Ver Código da Essência',
        'pt-pt': 'Ver Código da Essência',
        en: 'View Essence Code'
      }
    };
    return texts[key]?.[lang] || texts[key]?.pt || key;
  };

  return (
    <Card className="mt-8 bg-gradient-to-br from-primary/5 via-card to-accent/5 border-primary/20 overflow-hidden">
      <CardContent className="p-6 space-y-5">
        {/* Success badge */}
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <CheckCircle className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="text-sm font-medium text-primary">{getText('completedBadge')}</span>
          {testName && (
            <span className="text-sm text-muted-foreground">• {testName}</span>
          )}
        </div>

        {/* Message */}
        <p className="text-base text-foreground/90 leading-relaxed">
          {isLastTest ? getText('allComplete') : getText('oneOfSeven')}
        </p>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {isLastTest ? (
                <span className="flex items-center gap-1.5 text-primary">
                  <Sparkles className="h-4 w-4" />
                  Jornada completa!
                </span>
              ) : (
                getText('remaining')
              )}
            </span>
            <span className="font-medium">{completedTests}/{totalTests}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            onClick={onContinue}
            size="lg"
            className="flex-1 group"
          >
            {isLastTest ? getText('viewEssence') : getText('continueBtn')}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          {!isLastTest && onPause && (
            <Button 
              onClick={onPause}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <Pause className="mr-2 h-4 w-4" />
              {getText('pauseBtn')}
            </Button>
          )}
        </div>

        {/* Safety message */}
        {!isLastTest && (
          <p className="text-xs text-center text-muted-foreground pt-1">
            {getText('progressSaved')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
