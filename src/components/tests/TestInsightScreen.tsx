import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Eye, ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TestInsightScreenProps {
  testName: string;
  testType: string;
  insightText: string;
  mirrorPhrase: string;
  partialIndicator?: {
    label: string;
    value: number;
    maxValue: number;
  };
  completedTests: number;
  totalTests: number;
  onContinueJourney: () => void;
  onViewDetails: () => void;
  lang?: 'pt' | 'pt-pt' | 'en';
}

// Provisional insights based on test type - these are curiosity-building, not revealing
const getProvisionalInsight = (testType: string, lang: 'pt' | 'pt-pt' | 'en' = 'pt'): string => {
  const insights: Record<string, Record<string, string>> = {
    temperamentos: {
      pt: "Até aqui, aparece um padrão claro de como você processa emoções e reage ao ambiente. Isso impacta suas decisões mais do que você imagina.",
      'pt-pt': "Até aqui, aparece um padrão claro de como processa emoções e reage ao ambiente. Isso impacta as suas decisões mais do que imagina.",
      en: "So far, a clear pattern emerges in how you process emotions and react to your environment. This impacts your decisions more than you realize."
    },
    arquetipos_proposito: {
      pt: "Suas respostas revelam um arquétipo dominante que molda sua visão de mundo e seus talentos naturais. O próximo teste aprofundará isso.",
      'pt-pt': "As suas respostas revelam um arquétipo dominante que molda a sua visão de mundo e os seus talentos naturais.",
      en: "Your answers reveal a dominant archetype that shapes your worldview and natural talents."
    },
    disc: {
      pt: "Um perfil comportamental está emergindo. Ele explica como você age sob pressão e interage com outros.",
      'pt-pt': "Um perfil comportamental está a emergir. Explica como age sob pressão e interage com outros.",
      en: "A behavioral profile is emerging. It explains how you act under pressure and interact with others."
    },
    eneagrama: {
      pt: "Padrões profundos de motivação aparecem. Eles conectam seus medos centrais às suas forças maiores.",
      'pt-pt': "Padrões profundos de motivação aparecem. Conectam os seus medos centrais às suas forças maiores.",
      en: "Deep motivation patterns appear. They connect your core fears to your greatest strengths."
    },
    inteligencias_multiplas: {
      pt: "Suas inteligências predominantes começam a aparecer. Elas indicam como você aprende e resolve problemas de forma natural.",
      'pt-pt': "As suas inteligências predominantes começam a aparecer. Indicam como aprende e resolve problemas de forma natural.",
      en: "Your predominant intelligences are starting to appear. They indicate how you naturally learn and solve problems."
    },
    linguagens_amor: {
      pt: "Seu estilo de conexão afetiva está se revelando. Isso muda como você dá e recebe amor.",
      'pt-pt': "O seu estilo de conexão afetiva está a revelar-se. Isso muda como dá e recebe amor.",
      en: "Your affective connection style is revealing itself. This changes how you give and receive love."
    },
    mbti: {
      pt: "Uma configuração de personalidade única está tomando forma. Ela integra como você pensa, sente e decide.",
      'pt-pt': "Uma configuração de personalidade única está a tomar forma. Integra como pensa, sente e decide.",
      en: "A unique personality configuration is taking shape. It integrates how you think, feel, and decide."
    }
  };

  return insights[testType]?.[lang] || insights[testType]?.pt || 
    (lang === 'en' 
      ? "A clear pattern is emerging that explains aspects of who you are."
      : "Um padrão claro está emergindo que explica aspectos de quem você é.");
};

// Mirror phrases that create emotional connection
const getMirrorPhrase = (testType: string, lang: 'pt' | 'pt-pt' | 'en' = 'pt'): string => {
  const mirrors: Record<string, Record<string, string>> = {
    temperamentos: {
      pt: "Você age de forma diferente do que imagina sobre si mesmo.",
      'pt-pt': "Age de forma diferente do que imagina sobre si mesmo.",
      en: "You act differently than you imagine about yourself."
    },
    arquetipos_proposito: {
      pt: "Existe uma missão natural que você ainda não nomeou.",
      'pt-pt': "Existe uma missão natural que ainda não nomeou.",
      en: "There's a natural mission you haven't named yet."
    },
    disc: {
      pt: "Seu jeito de liderar e seguir tem um padrão específico.",
      'pt-pt': "O seu jeito de liderar e seguir tem um padrão específico.",
      en: "Your way of leading and following has a specific pattern."
    },
    eneagrama: {
      pt: "Por trás das suas forças, existe um medo que as alimenta.",
      'pt-pt': "Por trás das suas forças, existe um medo que as alimenta.",
      en: "Behind your strengths, there's a fear that fuels them."
    },
    inteligencias_multiplas: {
      pt: "Você aprende de um jeito que poucos ao seu redor entendem.",
      'pt-pt': "Aprende de um jeito que poucos ao seu redor entendem.",
      en: "You learn in a way that few around you understand."
    },
    linguagens_amor: {
      pt: "O amor que você busca não é o mesmo que você dá.",
      'pt-pt': "O amor que procura não é o mesmo que dá.",
      en: "The love you seek is not the same as the love you give."
    },
    mbti: {
      pt: "Sua mente organiza o mundo de uma forma singular.",
      'pt-pt': "A sua mente organiza o mundo de uma forma singular.",
      en: "Your mind organizes the world in a unique way."
    }
  };

  return mirrors[testType]?.[lang] || mirrors[testType]?.pt ||
    (lang === 'en' ? "There's something about you waiting to be seen." : "Há algo sobre você esperando ser visto.");
};

export function TestInsightScreen({
  testName,
  testType,
  insightText,
  mirrorPhrase,
  partialIndicator,
  completedTests,
  totalTests,
  onContinueJourney,
  onViewDetails,
  lang = 'pt'
}: TestInsightScreenProps) {
  const progressPercent = (completedTests / totalTests) * 100;

  // Use provided texts or generate from test type
  const displayInsight = insightText || getProvisionalInsight(testType, lang);
  const displayMirror = mirrorPhrase || getMirrorPhrase(testType, lang);

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      provisional: {
        pt: "Insight Provisório",
        'pt-pt': "Insight Provisório",
        en: "Provisional Insight"
      },
      continueJourney: {
        pt: "Continuar minha jornada",
        'pt-pt': "Continuar a minha jornada",
        en: "Continue my journey"
      },
      viewDetails: {
        pt: "Ver detalhes deste teste",
        'pt-pt': "Ver detalhes deste teste",
        en: "View test details"
      },
      detailsNote: {
        pt: "Este relatório mostra detalhes específicos deste teste. O sentido completo aparece quando todas as camadas são integradas no final.",
        'pt-pt': "Este relatório mostra detalhes específicos deste teste. O sentido completo aparece quando todas as camadas são integradas no final.",
        en: "This report shows specific details of this test. The complete meaning appears when all layers are integrated at the end."
      },
      progress: {
        pt: `${completedTests} de ${totalTests} testes concluídos`,
        'pt-pt': `${completedTests} de ${totalTests} testes concluídos`,
        en: `${completedTests} of ${totalTests} tests completed`
      }
    };
    return texts[key]?.[lang] || texts[key]?.pt || key;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="border-primary/20 shadow-xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            {/* Header badge */}
            <div className="flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">{getText('provisional')}</span>
              </motion.div>
            </div>

            {/* Test name */}
            <h2 className="text-center text-lg font-medium text-muted-foreground">
              {testName}
            </h2>

            {/* Insight text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-5 bg-muted/30 rounded-xl border border-border/50"
            >
              <p className="text-base text-foreground leading-relaxed text-center">
                "{displayInsight}"
              </p>
            </motion.div>

            {/* Mirror phrase */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-primary font-medium italic"
            >
              {displayMirror}
            </motion.p>

            {/* Partial visual indicator */}
            {partialIndicator && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{partialIndicator.label}</span>
                  <span className="font-medium">{Math.round((partialIndicator.value / partialIndicator.maxValue) * 100)}%</span>
                </div>
                <Progress value={(partialIndicator.value / partialIndicator.maxValue) * 100} className="h-2" />
              </motion.div>
            )}

            {/* Journey progress */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{getText('progress')}</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>

            {/* Primary CTA */}
            <Button 
              onClick={onContinueJourney}
              size="lg"
              className="w-full gap-2 group"
            >
              {getText('continueJourney')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Secondary CTA - View details */}
            <div className="space-y-2">
              <button
                onClick={onViewDetails}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{getText('viewDetails')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <p className="text-xs text-center text-muted-foreground/70 px-4">
                {getText('detailsNote')}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Export helper functions for use in other components
export { getProvisionalInsight, getMirrorPhrase };
