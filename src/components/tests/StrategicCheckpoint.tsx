import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, AlertCircle, HelpCircle, CheckCircle } from "lucide-react";

interface StrategicCheckpointProps {
  userName: string;
  affirmations: string[];
  contradiction: string;
  provocativeQuestion: string;
  onViewFullReport: () => void;
  lang?: 'pt' | 'pt-pt' | 'en';
}

// Generate strategic insights based on accumulated test data
export function generateCheckpointContent(
  testResults: Record<string, any>,
  lang: 'pt' | 'pt-pt' | 'en' = 'pt'
): { affirmations: string[]; contradiction: string; provocativeQuestion: string } {
  // This would be populated from actual test results
  // For now, provide example structures
  
  const templates = {
    pt: {
      affirmations: [
        "Você demonstra capacidade de liderança e leitura do ambiente",
        "Suas respostas revelam uma tendência à adaptação constante",
        "Há um padrão claro de busca por profundidade nas relações"
      ],
      contradiction: "Você tende a se anular para evitar conflitos. Isso gera reconhecimento externo e desgaste interno.",
      provocativeQuestion: "Você vive quem você é ou quem esperam que você seja?"
    },
    'pt-pt': {
      affirmations: [
        "Demonstra capacidade de liderança e leitura do ambiente",
        "As suas respostas revelam uma tendência à adaptação constante",
        "Há um padrão claro de busca por profundidade nas relações"
      ],
      contradiction: "Tende a anular-se para evitar conflitos. Isso gera reconhecimento externo e desgaste interno.",
      provocativeQuestion: "Vive quem é ou quem esperam que seja?"
    },
    en: {
      affirmations: [
        "You demonstrate leadership ability and environmental awareness",
        "Your answers reveal a tendency toward constant adaptation",
        "There's a clear pattern of seeking depth in relationships"
      ],
      contradiction: "You tend to diminish yourself to avoid conflicts. This generates external recognition and internal burnout.",
      provocativeQuestion: "Do you live as who you are or who others expect you to be?"
    }
  };

  return templates[lang];
}

export function StrategicCheckpoint({
  userName,
  affirmations,
  contradiction,
  provocativeQuestion,
  onViewFullReport,
  lang = 'pt'
}: StrategicCheckpointProps) {
  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        pt: "O que já podemos afirmar sobre você",
        'pt-pt': "O que já podemos afirmar sobre si",
        en: "What we can already affirm about you"
      },
      subtitle: {
        pt: `${userName}, após analisar suas respostas, padrões claros emergem:`,
        'pt-pt': `${userName}, após analisar as suas respostas, padrões claros emergem:`,
        en: `${userName}, after analyzing your answers, clear patterns emerge:`
      },
      contradictionLabel: {
        pt: "A contradição",
        'pt-pt': "A contradição",
        en: "The contradiction"
      },
      questionLabel: {
        pt: "A pergunta central",
        'pt-pt': "A pergunta central",
        en: "The central question"
      },
      viewReport: {
        pt: "Ver meu retrato completo",
        'pt-pt': "Ver o meu retrato completo",
        en: "View my complete portrait"
      },
      reportNote: {
        pt: "Este relatório não adiciona novos testes. Ele integra, organiza e dá sentido ao que já está em você.",
        'pt-pt': "Este relatório não adiciona novos testes. Integra, organiza e dá sentido ao que já está em si.",
        en: "This report doesn't add new tests. It integrates, organizes, and gives meaning to what's already in you."
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
        className="w-full max-w-2xl"
      >
        <Card className="border-primary/20 shadow-2xl overflow-hidden">
          <CardContent className="p-8 md:p-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center"
              >
                <div className="p-4 bg-primary/10 rounded-full">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </motion.div>
              
              <h1 className="text-2xl md:text-3xl font-display font-semibold">
                {getText('title')}
              </h1>
              
              <p className="text-muted-foreground">
                {getText('subtitle')}
              </p>
            </div>

            {/* Affirmations */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {affirmations.map((affirmation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{affirmation}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Contradiction */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{getText('contradictionLabel')}</span>
              </div>
              <p className="text-foreground leading-relaxed">
                {contradiction}
              </p>
            </motion.div>

            {/* Provocative Question */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="p-5 bg-primary/5 border border-primary/20 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2 text-primary">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{getText('questionLabel')}</span>
              </div>
              <p className="text-xl font-display text-foreground text-center py-2 italic">
                "{provocativeQuestion}"
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="space-y-4 pt-4"
            >
              <Button 
                onClick={onViewFullReport}
                size="lg"
                className="w-full gap-2 group text-lg py-6"
              >
                {getText('viewReport')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground px-4">
                {getText('reportNote')}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
