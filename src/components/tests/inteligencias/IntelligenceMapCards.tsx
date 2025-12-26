import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { INTELLIGENCES, InteligenciasResult } from "@/lib/inteligenciasMultiplas";
import { motion } from "framer-motion";

interface IntelligenceMapCardsProps {
  results: InteligenciasResult;
  lang: 'pt' | 'pt-pt' | 'en';
}

const translations = {
  pt: {
    title: "O que significa cada inteligência no seu mapa",
    subtitle: "Entenda o que cada área representa e como ela aparece em você"
  },
  'pt-pt': {
    title: "O que significa cada inteligência no seu mapa",
    subtitle: "Entenda o que cada área representa e como ela aparece em si"
  },
  en: {
    title: "What each intelligence means in your map",
    subtitle: "Understand what each area represents and how it shows up in you"
  }
};

const intelligenceExplanations = {
  pt: {
    linguistica: "Preferência por pensar e se expressar com palavras.",
    logico_matematica: "Preferência por pensar em padrões, lógica e estruturas.",
    espacial: "Preferência por visualizar, imaginar e perceber relações visuais.",
    musical: "Preferência por ritmo, melodia e sensibilidade sonora.",
    corporal_cinestesica: "Preferência por aprender e criar através do corpo.",
    interpessoal: "Preferência por entender e conectar-se com outras pessoas.",
    intrapessoal: "Preferência por reflexão interior e autoconhecimento.",
    naturalista: "Preferência por padrões naturais e seres vivos."
  },
  'pt-pt': {
    linguistica: "Preferência por pensar e expressar-se com palavras.",
    logico_matematica: "Preferência por pensar em padrões, lógica e estruturas.",
    espacial: "Preferência por visualizar, imaginar e perceber relações visuais.",
    musical: "Preferência por ritmo, melodia e sensibilidade sonora.",
    corporal_cinestesica: "Preferência por aprender e criar através do corpo.",
    interpessoal: "Preferência por entender e conectar-se com outras pessoas.",
    intrapessoal: "Preferência por reflexão interior e autoconhecimento.",
    naturalista: "Preferência por padrões naturais e seres vivos."
  },
  en: {
    linguistica: "Preference for thinking and expressing through words.",
    logico_matematica: "Preference for thinking in patterns, logic, and structures.",
    espacial: "Preference for visualizing, imagining, and perceiving visual relationships.",
    musical: "Preference for rhythm, melody, and sound sensitivity.",
    corporal_cinestesica: "Preference for learning and creating through the body.",
    interpessoal: "Preference for understanding and connecting with others.",
    intrapessoal: "Preference for inner reflection and self-knowledge.",
    naturalista: "Preference for natural patterns and living beings."
  }
};

export function IntelligenceMapCards({ results, lang }: IntelligenceMapCardsProps) {
  const t = translations[lang] || translations.pt;
  const langKey = lang === 'pt-pt' ? 'pt' : lang;
  const explanations = intelligenceExplanations[lang] || intelligenceExplanations.pt;

  // Sort by percentage descending
  const sortedIntelligences = results.ranking;

  return (
    <Card className="border-2 border-[hsl(var(--accent))]/30">
      <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/5 to-background">
        <CardTitle className="text-2xl font-light flex items-center gap-2">
          <span className="text-3xl">📖</span>
          {t.title}
        </CardTitle>
        <CardDescription className="text-base">
          {t.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedIntelligences.map((item, idx) => {
            const intel = INTELLIGENCES[item.key];
            const explanation = explanations[item.key as keyof typeof explanations] || "";
            const isTop3 = idx < 3;
            const isLowest = idx === sortedIntelligences.length - 1;
            
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-lg border transition-all ${
                  isTop3 
                    ? 'bg-emerald-50/50 border-emerald-200/50 dark:bg-emerald-950/20 dark:border-emerald-800/30' 
                    : isLowest
                    ? 'bg-amber-50/50 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-800/30'
                    : 'bg-muted/30 border-border/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{intel.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold text-sm ${isTop3 ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                        {intel.name[langKey]}
                      </h4>
                      <span className={`text-sm font-bold ${
                        isTop3 ? 'text-emerald-600 dark:text-emerald-400' : 
                        isLowest ? 'text-amber-600 dark:text-amber-400' : 
                        'text-muted-foreground'
                      }`}>
                        {item.percentage}%
                      </span>
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className={`h-1.5 mb-2 ${isTop3 ? '[&>div]:bg-emerald-500' : isLowest ? '[&>div]:bg-amber-500' : ''}`}
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Disclaimer */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground text-center italic">
            {lang === 'en' 
              ? "This map shows how your mind tends to work, not what you are capable or incapable of doing."
              : "Este mapa mostra como sua mente tende a funcionar, não o que você é capaz ou incapaz de fazer."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
