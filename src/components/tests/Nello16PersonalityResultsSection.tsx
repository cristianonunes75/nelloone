import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Target, 
  Compass, 
  Eye, 
  Scale, 
  Clock, 
  Star, 
  AlertTriangle, 
  Lightbulb, 
  Briefcase, 
  Calendar, 
  MessageCircle, 
  HelpCircle, 
  TrendingUp,
  Info,
  Share2,
  BookmarkPlus,
  ArrowRight
} from "lucide-react";
import { getNello16DisplayCode, NELLO_16_PROFILES } from "@/lib/nello16Personality";
import { NELLO_16_EXTENDED_DATA, getDeepSummary, getMindInPractice, getSelfExamQuestion, getDevelopmentGuidance, getAIReflection } from "@/lib/nello16ExtendedData";

interface Nello16PersonalityResultsSectionProps {
  mbtiResultData: {
    type: string;
    scores: {
      E: number;
      I: number;
      S: number;
      N: number;
      T: number;
      F: number;
      J: number;
      P: number;
    };
  };
  userName: string;
  lang: 'pt' | 'pt-pt' | 'en';
}

const TEXTS = {
  hero: {
    title: {
      pt: ', este é o mapa da sua mente',
      'pt-pt': ', este é o mapa da tua mente',
      en: ', this is the map of your mind'
    },
    subtitle: {
      pt: 'Como você percebe o mundo, decide e age',
      'pt-pt': 'Como percebes o mundo, decides e ages',
      en: 'How you perceive the world, decide and act'
    }
  },
  deepSummary: {
    title: {
      pt: 'Resumo Profundo do Seu Perfil',
      'pt-pt': 'Resumo Profundo do Teu Perfil',
      en: 'Deep Summary of Your Profile'
    }
  },
  cognitiveMap: {
    title: {
      pt: 'Seu Mapa Cognitivo Visual',
      'pt-pt': 'O Teu Mapa Cognitivo Visual',
      en: 'Your Visual Cognitive Map'
    },
    subtitle: {
      pt: 'Essas barras mostram suas preferências naturais, não limites.',
      'pt-pt': 'Estas barras mostram as tuas preferências naturais, não limites.',
      en: 'These bars show your natural preferences, not limits.'
    },
    balance: {
      pt: 'Você apresenta equilíbrio entre dois polos neste eixo.',
      'pt-pt': 'Apresentas equilíbrio entre dois polos neste eixo.',
      en: 'You show balance between two poles in this axis.'
    }
  },
  mindInPractice: {
    title: {
      pt: 'Como Sua Mente Funciona na Prática',
      'pt-pt': 'Como a Tua Mente Funciona na Prática',
      en: 'How Your Mind Works in Practice'
    }
  },
  strengths: {
    title: {
      pt: 'Seus Pontos Fortes Naturais',
      'pt-pt': 'Os Teus Pontos Fortes Naturais',
      en: 'Your Natural Strengths'
    },
    subtitle: {
      pt: 'Quando você está alinhado, tende a...',
      'pt-pt': 'Quando estás alinhado, tendes a...',
      en: 'When you are aligned, you tend to...'
    }
  },
  shadows: {
    title: {
      pt: 'Sombras e Armadilhas do Tipo',
      'pt-pt': 'Sombras e Armadilhas do Tipo',
      en: 'Shadows and Traps of the Type'
    },
    warning: {
      pt: 'Toda força, quando em excesso, vira risco.',
      'pt-pt': 'Toda força, quando em excesso, vira risco.',
      en: 'Every strength, when in excess, becomes a risk.'
    }
  },
  vocation: {
    title: {
      pt: 'Sua Vocação Natural',
      'pt-pt': 'A Tua Vocação Natural',
      en: 'Your Natural Vocation'
    },
    subtitle: {
      pt: 'Onde esse perfil costuma prosperar',
      'pt-pt': 'Onde este perfil costuma prosperar',
      en: 'Where this profile tends to thrive'
    },
    warning: {
      pt: 'Vocação não é profissão fixa, é padrão de funcionamento.',
      'pt-pt': 'Vocação não é profissão fixa, é padrão de funcionamento.',
      en: 'Vocation is not a fixed profession, it\'s a pattern of functioning.'
    }
  },
  sevenDayPlan: {
    title: {
      pt: 'Seu Plano de 7 Dias para Desenvolver seu Tipo',
      'pt-pt': 'O Teu Plano de 7 Dias para Desenvolver o Teu Tipo',
      en: 'Your 7-Day Plan to Develop Your Type'
    }
  },
  aiReflection: {
    title: {
      pt: 'Análise do Nello AI',
      'pt-pt': 'Análise do Nello AI',
      en: 'Nello AI Analysis'
    },
    subtitle: {
      pt: 'Reflexão do seu mentor digital',
      'pt-pt': 'Reflexão do teu mentor digital',
      en: 'Reflection from your digital mentor'
    }
  },
  selfExam: {
    title: {
      pt: 'Pergunta de Autoexame',
      'pt-pt': 'Pergunta de Autoexame',
      en: 'Self-Examination Question'
    },
    cta: {
      pt: 'Reflita com sinceridade.',
      'pt-pt': 'Reflete com sinceridade.',
      en: 'Reflect honestly.'
    }
  },
  development: {
    title: {
      pt: 'O Que Você Pode Desenvolver Agora',
      'pt-pt': 'O Que Podes Desenvolver Agora',
      en: 'What You Can Develop Now'
    }
  },
  disclaimer: {
    text: {
      pt: 'Este resultado mostra preferências naturais de funcionamento mental. Ele não define quem você é, nem substitui avaliação profissional.',
      'pt-pt': 'Este resultado mostra preferências naturais de funcionamento mental. Não define quem és, nem substitui avaliação profissional.',
      en: 'This result shows natural mental functioning preferences. It does not define who you are, nor does it replace professional assessment.'
    }
  },
  cta: {
    save: {
      pt: 'Salvar meu mapa',
      'pt-pt': 'Guardar o meu mapa',
      en: 'Save my map'
    },
    share: {
      pt: 'Compartilhar',
      'pt-pt': 'Partilhar',
      en: 'Share'
    },
    continue: {
      pt: 'Continuar minha jornada',
      'pt-pt': 'Continuar a minha jornada',
      en: 'Continue my journey'
    }
  }
};

const DIMENSION_LABELS = {
  EI: {
    title: { pt: 'Energia', 'pt-pt': 'Energia', en: 'Energy' },
    E: { pt: 'Extroversão (E)', 'pt-pt': 'Extroversão (E)', en: 'Extraversion (E)' },
    I: { pt: 'Introversão (I)', 'pt-pt': 'Introversão (I)', en: 'Introversion (I)' },
    icon: Compass
  },
  SN: {
    title: { pt: 'Percepção', 'pt-pt': 'Perceção', en: 'Perception' },
    S: { pt: 'Sensação (S)', 'pt-pt': 'Sensação (S)', en: 'Sensing (S)' },
    N: { pt: 'Intuição (N)', 'pt-pt': 'Intuição (N)', en: 'Intuition (N)' },
    icon: Eye
  },
  TF: {
    title: { pt: 'Julgamento', 'pt-pt': 'Julgamento', en: 'Judgment' },
    T: { pt: 'Pensamento (T)', 'pt-pt': 'Pensamento (T)', en: 'Thinking (T)' },
    F: { pt: 'Sentimento (F)', 'pt-pt': 'Sentimento (F)', en: 'Feeling (F)' },
    icon: Scale
  },
  JP: {
    title: { pt: 'Estilo de Vida', 'pt-pt': 'Estilo de Vida', en: 'Lifestyle' },
    J: { pt: 'Julgamento (J)', 'pt-pt': 'Julgamento (J)', en: 'Judging (J)' },
    P: { pt: 'Percepção (P)', 'pt-pt': 'Perceção (P)', en: 'Perceiving (P)' },
    icon: Clock
  }
};

const QUADRANT_DATA = {
  analytic: {
    emoji: '🔬',
    name: { pt: 'Analítico', 'pt-pt': 'Analítico', en: 'Analytic' },
    description: { pt: 'Focado em lógica e estratégia', 'pt-pt': 'Focado em lógica e estratégia', en: 'Focused on logic and strategy' }
  },
  humanist: {
    emoji: '💝',
    name: { pt: 'Humanista', 'pt-pt': 'Humanista', en: 'Humanist' },
    description: { pt: 'Focado em pessoas e valores', 'pt-pt': 'Focado em pessoas e valores', en: 'Focused on people and values' }
  },
  pragmatic: {
    emoji: '⚙️',
    name: { pt: 'Pragmático', 'pt-pt': 'Pragmático', en: 'Pragmatic' },
    description: { pt: 'Focado em ação e resultados', 'pt-pt': 'Focado em ação e resultados', en: 'Focused on action and results' }
  },
  visionary: {
    emoji: '🔮',
    name: { pt: 'Visionário', 'pt-pt': 'Visionário', en: 'Visionary' },
    description: { pt: 'Focado em possibilidades e inovação', 'pt-pt': 'Focado em possibilidades e inovação', en: 'Focused on possibilities and innovation' }
  }
};

const DAY_LABELS = {
  pt: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7'],
  'pt-pt': ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7'],
  en: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
};

export function Nello16PersonalityResultsSection({ 
  mbtiResultData, 
  userName, 
  lang 
}: Nello16PersonalityResultsSectionProps) {
  const { type, scores } = mbtiResultData;
  const profile = NELLO_16_PROFILES[type];
  const extendedData = NELLO_16_EXTENDED_DATA[type];
  const displayCode = getNello16DisplayCode(type);
  const quadrant = profile?.quadrant || 'analytic';
  const quadrantData = QUADRANT_DATA[quadrant];

  // Calculate percentages for each dimension
  const calculatePercentage = (a: number, b: number) => {
    const total = a + b;
    if (total === 0) return { left: 50, right: 50, isBalanced: true };
    const leftPct = Math.round((a / total) * 100);
    const rightPct = 100 - leftPct;
    const isBalanced = Math.abs(leftPct - 50) < 10;
    return { left: leftPct, right: rightPct, isBalanced };
  };

  const getIntensity = (percentage: number, lang: 'pt' | 'pt-pt' | 'en') => {
    const diff = Math.abs(percentage - 50);
    if (diff < 10) return { pt: 'Equilibrado', 'pt-pt': 'Equilibrado', en: 'Balanced' }[lang];
    if (diff < 25) return { pt: 'Leve', 'pt-pt': 'Leve', en: 'Slight' }[lang];
    if (diff < 40) return { pt: 'Moderada', 'pt-pt': 'Moderada', en: 'Moderate' }[lang];
    return { pt: 'Forte', 'pt-pt': 'Forte', en: 'Strong' }[lang];
  };

  const eiPct = calculatePercentage(scores.E, scores.I);
  const snPct = calculatePercentage(scores.S, scores.N);
  const tfPct = calculatePercentage(scores.T, scores.F);
  const jpPct = calculatePercentage(scores.J, scores.P);

  const deepSummary = getDeepSummary(type, lang);
  const mindInPractice = getMindInPractice(type, lang);
  const selfExamQuestion = getSelfExamQuestion(type, lang);
  const developmentGuidance = getDevelopmentGuidance(type, lang);
  const aiReflection = getAIReflection(type, userName, lang);

  return (
    <div className="space-y-6">
      {/* 1. Hero Personalizado */}
      <Card className="border-none shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground p-8 md:p-12">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur">
              <Brain className="h-5 w-5" />
              <span className="text-sm font-medium">Nello 16 Personality Map</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">
              {userName}{TEXTS.hero.title[lang]}
            </h1>
            <p className="text-lg opacity-90">{TEXTS.hero.subtitle[lang]}</p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-background/20 hover:bg-background/30">
                {displayCode} / {type}
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-background/20 hover:bg-background/30">
                {profile?.name?.[lang] || type}
              </Badge>
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="text-3xl">{quadrantData.emoji}</span>
              <div className="text-left">
                <p className="font-semibold">{quadrantData.name[lang]}</p>
                <p className="text-sm opacity-80">{quadrantData.description[lang]}</p>
              </div>
            </div>
            
            {extendedData?.subtitle?.[lang] && (
              <p className="text-xl italic opacity-90 pt-4">
                "{extendedData.subtitle[lang]}"
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* 2. Resumo Profundo do Perfil */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {TEXTS.deepSummary.title[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {deepSummary}
          </p>
        </CardContent>
      </Card>

      {/* 3. Mapa Cognitivo Visual */}
      <Card className="border-2 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            {TEXTS.cognitiveMap.title[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* E/I Dimension */}
          <DimensionBar 
            dimension="EI" 
            leftScore={scores.E} 
            rightScore={scores.I}
            leftLabel={DIMENSION_LABELS.EI.E[lang]}
            rightLabel={DIMENSION_LABELS.EI.I[lang]}
            title={DIMENSION_LABELS.EI.title[lang]}
            dominant={type[0] as 'E' | 'I'}
            percentage={eiPct}
            intensity={getIntensity(eiPct.left > 50 ? eiPct.left : eiPct.right, lang)}
            lang={lang}
          />
          
          {/* S/N Dimension */}
          <DimensionBar 
            dimension="SN" 
            leftScore={scores.S} 
            rightScore={scores.N}
            leftLabel={DIMENSION_LABELS.SN.S[lang]}
            rightLabel={DIMENSION_LABELS.SN.N[lang]}
            title={DIMENSION_LABELS.SN.title[lang]}
            dominant={type[1] as 'S' | 'N'}
            percentage={snPct}
            intensity={getIntensity(snPct.left > 50 ? snPct.left : snPct.right, lang)}
            lang={lang}
          />
          
          {/* T/F Dimension */}
          <DimensionBar 
            dimension="TF" 
            leftScore={scores.T} 
            rightScore={scores.F}
            leftLabel={DIMENSION_LABELS.TF.T[lang]}
            rightLabel={DIMENSION_LABELS.TF.F[lang]}
            title={DIMENSION_LABELS.TF.title[lang]}
            dominant={type[2] as 'T' | 'F'}
            percentage={tfPct}
            intensity={getIntensity(tfPct.left > 50 ? tfPct.left : tfPct.right, lang)}
            lang={lang}
          />
          
          {/* J/P Dimension */}
          <DimensionBar 
            dimension="JP" 
            leftScore={scores.J} 
            rightScore={scores.P}
            leftLabel={DIMENSION_LABELS.JP.J[lang]}
            rightLabel={DIMENSION_LABELS.JP.P[lang]}
            title={DIMENSION_LABELS.JP.title[lang]}
            dominant={type[3] as 'J' | 'P'}
            percentage={jpPct}
            intensity={getIntensity(jpPct.left > 50 ? jpPct.left : jpPct.right, lang)}
            lang={lang}
          />
          
          <p className="text-sm text-muted-foreground text-center italic pt-4">
            {TEXTS.cognitiveMap.subtitle[lang]}
          </p>
        </CardContent>
      </Card>

      {/* 4. Como Sua Mente Funciona na Prática */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            {TEXTS.mindInPractice.title[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MindBlock 
              icon={<Compass className="h-5 w-5" />}
              title={lang === 'en' ? 'How you focus' : 'Como você foca'}
              description={mindInPractice.energy}
              dimension="E/I"
            />
            <MindBlock 
              icon={<Eye className="h-5 w-5" />}
              title={lang === 'en' ? 'How you perceive' : 'Como você percebe'}
              description={mindInPractice.perception}
              dimension="S/N"
            />
            <MindBlock 
              icon={<Scale className="h-5 w-5" />}
              title={lang === 'en' ? 'How you decide' : 'Como você decide'}
              description={mindInPractice.decision}
              dimension="T/F"
            />
            <MindBlock 
              icon={<Clock className="h-5 w-5" />}
              title={lang === 'en' ? 'How you organize life' : 'Como você organiza a vida'}
              description={mindInPractice.lifestyle}
              dimension="J/P"
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. Pontos Fortes Naturais */}
      {extendedData?.light?.[lang] && (
        <Card className="border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Star className="h-5 w-5" />
              {TEXTS.strengths.title[lang]}
            </CardTitle>
            <CardDescription>{TEXTS.strengths.subtitle[lang]}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extendedData.light[lang].map((strength, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background/80 border border-emerald-200 dark:border-emerald-800">
                  <span className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 6. Sombras e Armadilhas */}
      {extendedData?.shadow?.[lang] && (
        <Card className="border-2 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              {TEXTS.shadows.title[lang]}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              {TEXTS.shadows.warning[lang]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sombras */}
            <div>
              <h4 className="font-semibold mb-3 text-amber-800 dark:text-amber-300">
                {lang === 'en' ? 'Shadows' : 'Sombras'}
              </h4>
              <ul className="space-y-2">
                {extendedData.shadow[lang].map((shadow, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/80">
                    <span className="text-amber-500">•</span>
                    <span className="text-foreground">{shadow}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Armadilhas */}
            {extendedData?.traps?.[lang] && (
              <div>
                <h4 className="font-semibold mb-3 text-amber-800 dark:text-amber-300">
                  {lang === 'en' ? 'Traps' : 'Armadilhas'}
                </h4>
                <ul className="space-y-2">
                  {extendedData.traps[lang].map((trap, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/80">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 7. Vocação Natural */}
      {extendedData?.vocation?.[lang] && (
        <Card className="border-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Briefcase className="h-5 w-5" />
              {TEXTS.vocation.title[lang]}
            </CardTitle>
            <CardDescription>{TEXTS.vocation.subtitle[lang]}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">{extendedData.vocation[lang]}</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-100/50 dark:bg-blue-900/30 text-sm text-blue-800 dark:text-blue-200">
              <Info className="h-4 w-4 flex-shrink-0" />
              <span className="italic">{TEXTS.vocation.warning[lang]}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 8. Plano de 7 Dias */}
      {extendedData?.sevenDayPlan?.[lang] && (
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {TEXTS.sevenDayPlan.title[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {extendedData.sevenDayPlan[lang].map((task, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-sm">{DAY_LABELS[lang][index]}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{task}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 9. Mensagem da IA */}
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <MessageCircle className="h-5 w-5" />
            {TEXTS.aiReflection.title[lang]}
          </CardTitle>
          <CardDescription>{TEXTS.aiReflection.subtitle[lang]}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-line">{aiReflection}</p>
          </div>
        </CardContent>
      </Card>

      {/* 10. Pergunta de Autoexame */}
      <Card className="border-2 border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <HelpCircle className="h-5 w-5" />
            {TEXTS.selfExam.title[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xl font-medium text-center py-6 px-4 rounded-lg bg-background/80">
            "{selfExamQuestion}"
          </p>
          <p className="text-center text-muted-foreground italic">
            {TEXTS.selfExam.cta[lang]}
          </p>
        </CardContent>
      </Card>

      {/* 11. O Que Você Pode Desenvolver Agora */}
      <Card className="border-2 border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <TrendingUp className="h-5 w-5" />
            {TEXTS.development.title[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-teal-700 dark:text-teal-400">
                {lang === 'en' ? 'Limiting Pattern' : 'Padrão Limitante'}
              </h4>
              <p className="p-4 rounded-lg bg-background/80 border border-teal-200 dark:border-teal-800">
                {developmentGuidance.limitingPattern}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-teal-700 dark:text-teal-400">
                {lang === 'en' ? 'Balancing Strength' : 'Força que Equilibra'}
              </h4>
              <p className="p-4 rounded-lg bg-background/80 border border-teal-200 dark:border-teal-800">
                {developmentGuidance.balancingStrength}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-teal-700 dark:text-teal-400">
                {lang === 'en' ? 'Immediate Action' : 'Ação Imediata Prática'}
              </h4>
              <p className="p-4 rounded-lg bg-background/80 border border-teal-200 dark:border-teal-800">
                {developmentGuidance.immediateAction}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-teal-700 dark:text-teal-400">
                {lang === 'en' ? 'Direction of Evolution' : 'Direção de Evolução'}
              </h4>
              <p className="p-4 rounded-lg bg-background/80 border border-teal-200 dark:border-teal-800">
                {developmentGuidance.evolutionDirection}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 12. Aviso de Uso Consciente */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
        <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <p>{TEXTS.disclaimer.text[lang]}</p>
      </div>

      {/* 13. CTA Final */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Button variant="outline" className="gap-2">
          <BookmarkPlus className="h-4 w-4" />
          {TEXTS.cta.save[lang]}
        </Button>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          {TEXTS.cta.share[lang]}
        </Button>
        <Button className="gap-2">
          {TEXTS.cta.continue[lang]}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Assinatura */}
      <div className="text-center py-8">
        <p className="text-lg font-light italic text-muted-foreground">
          NELLO ONE — {lang === 'en' ? 'a journey of self-knowledge and inner truth.' : 'uma jornada de autoconhecimento e verdade interior.'}
        </p>
      </div>
    </div>
  );
}

// Sub-components
interface DimensionBarProps {
  dimension: string;
  leftScore: number;
  rightScore: number;
  leftLabel: string;
  rightLabel: string;
  title: string;
  dominant: string;
  percentage: { left: number; right: number; isBalanced: boolean };
  intensity: string;
  lang: 'pt' | 'pt-pt' | 'en';
}

function DimensionBar({ 
  leftScore, rightScore, leftLabel, rightLabel, title, dominant, percentage, intensity, lang 
}: DimensionBarProps) {
  const isLeftDominant = percentage.left > percentage.right;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{title}</h4>
        <Badge variant="outline" className="text-xs">
          {intensity}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border-2 transition-all ${isLeftDominant ? 'bg-accent/20 border-accent shadow-sm' : 'bg-muted/30 border-border'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{leftLabel}</span>
            <span className="text-lg font-bold">{percentage.left}%</span>
          </div>
          <Progress value={percentage.left} className="h-2" />
        </div>
        <div className={`p-4 rounded-lg border-2 transition-all ${!isLeftDominant ? 'bg-accent/20 border-accent shadow-sm' : 'bg-muted/30 border-border'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{rightLabel}</span>
            <span className="text-lg font-bold">{percentage.right}%</span>
          </div>
          <Progress value={percentage.right} className="h-2" />
        </div>
      </div>
      {percentage.isBalanced && (
        <p className="text-xs text-center text-muted-foreground italic">
          {lang === 'en' ? 'You show balance between two poles in this axis.' : 'Você apresenta equilíbrio entre dois polos neste eixo.'}
        </p>
      )}
    </div>
  );
}

interface MindBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  dimension: string;
}

function MindBlock({ icon, title, description, dimension }: MindBlockProps) {
  return (
    <div className="p-5 rounded-xl border border-border bg-muted/30 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <Badge variant="outline" className="text-xs">{dimension}</Badge>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
