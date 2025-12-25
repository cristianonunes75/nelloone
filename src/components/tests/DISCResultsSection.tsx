import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Lightbulb, Star, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

// Rich DISC profile data with all the content from pdfDisc.ts
const DISC_PROFILES_RICH = {
  D: {
    name: { pt: 'Dominância', 'pt-pt': 'Dominância', en: 'Dominance' },
    emoji: '🎯',
    description: {
      pt: 'Você é movido por ação e resultado. Sua energia é direta, firme, objetiva. Você pensa rápido, decide rápido e se frustra com lentidão.',
      'pt-pt': 'És movido pela ação e pelo resultado. A tua energia é direta, firme, objetiva. Pensas rápido, decides rápido e frustras-te com lentidão.',
      en: 'You are driven by action and results. Your energy is direct, firm, and objective. You think fast, decide fast, and get frustrated with slowness.'
    },
    strengths: {
      pt: ['Liderança natural', 'Coragem', 'Decisão rápida', 'Produtividade elevada', 'Capacidade de enfrentar problemas'],
      'pt-pt': ['Liderança natural', 'Coragem', 'Decisão rápida', 'Produtividade elevada', 'Capacidade de enfrentar problemas'],
      en: ['Natural leadership', 'Courage', 'Quick decision-making', 'High productivity', 'Problem-facing ability']
    },
    vulnerabilities: {
      pt: ['Impaciência', 'Dureza verbal', 'Falta de escuta emocional', 'Dificuldade em delegar'],
      'pt-pt': ['Impaciência', 'Dureza verbal', 'Falta de escuta emocional', 'Dificuldade em delegar'],
      en: ['Impatience', 'Verbal harshness', 'Lack of emotional listening', 'Difficulty delegating']
    },
    light: {
      pt: 'Você abre caminhos que outros têm medo de atravessar.',
      'pt-pt': 'Tu abres caminhos que outros têm medo de atravessar.',
      en: 'You open paths that others are afraid to cross.'
    },
    evolution: {
      pt: ['Reduzir pressa nas decisões', 'Aumentar escuta ativa', 'Refinar sensibilidade emocional', 'Praticar paciência consciente', 'Celebrar pequenas vitórias dos outros'],
      'pt-pt': ['Reduzir pressa nas decisões', 'Aumentar escuta ativa', 'Refinar sensibilidade emocional', 'Praticar paciência consciente', 'Celebrar pequenas vitórias dos outros'],
      en: ['Reduce rushing decisions', 'Increase active listening', 'Refine emotional sensitivity', 'Practice conscious patience', 'Celebrate others\' small victories']
    },
    sevenDayPlan: {
      pt: [
        'Ouça alguém por 5 minutos sem interromper',
        'Delegue uma tarefa e confie no processo',
        'Agradeça em voz alta por algo simples',
        'Respire antes de responder a uma crítica',
        'Pergunte "como posso ajudar?" a alguém',
        'Reduza o ritmo de uma atividade pela metade',
        'Celebre uma conquista emocional, não só produtiva'
      ],
      'pt-pt': [
        'Ouve alguém por 5 minutos sem interromper',
        'Delega uma tarefa e confia no processo',
        'Agradece em voz alta por algo simples',
        'Respira antes de responder a uma crítica',
        'Pergunta "como posso ajudar?" a alguém',
        'Reduz o ritmo de uma atividade para metade',
        'Celebra uma conquista emocional, não só produtiva'
      ],
      en: [
        'Listen to someone for 5 minutes without interrupting',
        'Delegate a task and trust the process',
        'Thank out loud for something simple',
        'Breathe before responding to criticism',
        'Ask someone "how can I help?"',
        'Reduce the pace of an activity by half',
        'Celebrate an emotional achievement, not just productive'
      ]
    }
  },
  I: {
    name: { pt: 'Influência', 'pt-pt': 'Influência', en: 'Influence' },
    emoji: '✨',
    description: {
      pt: 'Você é movido por conexão e entusiasmo. Sua energia é leve, expansiva e comunicativa. Você inspira, anima e aproxima pessoas.',
      'pt-pt': 'És movido pela conexão e entusiasmo. A tua energia é leve, expansiva e comunicativa. Tu inspiras, animas e aproximas pessoas.',
      en: 'You are driven by connection and enthusiasm. Your energy is light, expansive, and communicative. You inspire, encourage, and bring people together.'
    },
    strengths: {
      pt: ['Carisma natural', 'Comunicação fluida', 'Sociabilidade', 'Otimismo contagiante', 'Criatividade relacional'],
      'pt-pt': ['Carisma natural', 'Comunicação fluida', 'Sociabilidade', 'Otimismo contagiante', 'Criatividade relacional'],
      en: ['Natural charisma', 'Fluid communication', 'Sociability', 'Contagious optimism', 'Relational creativity']
    },
    vulnerabilities: {
      pt: ['Dificuldade com disciplina', 'Procrastinação emocional', 'Impulso por agradar', 'Vulnerabilidade a críticas'],
      'pt-pt': ['Dificuldade com disciplina', 'Procrastinação emocional', 'Impulso por agradar', 'Vulnerabilidade a críticas'],
      en: ['Difficulty with discipline', 'Emotional procrastination', 'Impulse to please', 'Vulnerability to criticism']
    },
    light: {
      pt: 'Você movimenta corações. Sua presença muda ambientes.',
      'pt-pt': 'Tu movimentas corações. A tua presença muda ambientes.',
      en: 'You move hearts. Your presence changes environments.'
    },
    evolution: {
      pt: ['Criar disciplina emocional', 'Estabilizar foco', 'Reduzir necessidade de aprovação', 'Praticar silêncio construtivo', 'Terminar o que começa'],
      'pt-pt': ['Criar disciplina emocional', 'Estabilizar foco', 'Reduzir necessidade de aprovação', 'Praticar silêncio construtivo', 'Terminar o que começas'],
      en: ['Create emotional discipline', 'Stabilize focus', 'Reduce need for approval', 'Practice constructive silence', 'Finish what you start']
    },
    sevenDayPlan: {
      pt: [
        'Fale sua verdade com calma',
        'Termine uma tarefa antes de abrir outra',
        'Escreva o que está sentindo',
        'Ignore críticas não construtivas',
        'Recolha-se por 30 minutos em silêncio',
        'Pratique foco absoluto por 10 minutos',
        'Celebre uma vitória emocional pessoal'
      ],
      'pt-pt': [
        'Fala a tua verdade com calma',
        'Termina uma tarefa antes de abrir outra',
        'Escreve o que estás a sentir',
        'Ignora críticas não construtivas',
        'Recolhe-te por 30 minutos em silêncio',
        'Pratica foco absoluto por 10 minutos',
        'Celebra uma vitória emocional pessoal'
      ],
      en: [
        'Speak your truth calmly',
        'Finish one task before starting another',
        'Write down what you are feeling',
        'Ignore non-constructive criticism',
        'Withdraw for 30 minutes in silence',
        'Practice absolute focus for 10 minutes',
        'Celebrate a personal emotional victory'
      ]
    }
  },
  S: {
    name: { pt: 'Estabilidade', 'pt-pt': 'Estabilidade', en: 'Steadiness' },
    emoji: '🤝',
    description: {
      pt: 'Você é movido por segurança, cuidado e calma. Sua energia é acolhedora, constante e confiável. Você traz paz onde há turbulência.',
      'pt-pt': 'És movido pela segurança, cuidado e calma. A tua energia é acolhedora, constante e confiável. Tu trazes paz onde há turbulência.',
      en: 'You are driven by security, care, and calm. Your energy is welcoming, constant, and reliable. You bring peace where there is turbulence.'
    },
    strengths: {
      pt: ['Lealdade profunda', 'Escuta ativa', 'Empatia natural', 'Ritmo saudável', 'Consistência admirável'],
      'pt-pt': ['Lealdade profunda', 'Escuta ativa', 'Empatia natural', 'Ritmo saudável', 'Consistência admirável'],
      en: ['Deep loyalty', 'Active listening', 'Natural empathy', 'Healthy rhythm', 'Admirable consistency']
    },
    vulnerabilities: {
      pt: ['Medo de mudança', 'Dificuldade em dizer não', 'Assumir peso emocional dos outros', 'Evitar conflitos demais'],
      'pt-pt': ['Medo de mudança', 'Dificuldade em dizer não', 'Assumir peso emocional dos outros', 'Evitar conflitos demais'],
      en: ['Fear of change', 'Difficulty saying no', 'Taking on others\' emotional weight', 'Avoiding conflicts too much']
    },
    light: {
      pt: 'Você traz paz onde existe turbulência.',
      'pt-pt': 'Tu trazes paz onde existe turbulência.',
      en: 'You bring peace where there is turbulence.'
    },
    evolution: {
      pt: ['Ampliar coragem para mudanças', 'Praticar limites saudáveis', 'Treinar tomada de decisão', 'Expressar necessidades próprias', 'Aceitar desconforto temporário'],
      'pt-pt': ['Ampliar coragem para mudanças', 'Praticar limites saudáveis', 'Treinar tomada de decisão', 'Expressar necessidades próprias', 'Aceitar desconforto temporário'],
      en: ['Expand courage for changes', 'Practice healthy boundaries', 'Train decision-making', 'Express your own needs', 'Accept temporary discomfort']
    },
    sevenDayPlan: {
      pt: [
        'Diga "não" a algo que te sobrecarrega',
        'Tome uma decisão rápida sobre algo pequeno',
        'Expresse uma opinião diferente em voz alta',
        'Aceite uma mudança sem resistência',
        'Peça algo que você precisa diretamente',
        'Faça algo novo que te causa leve desconforto',
        'Celebre sua coragem de mudar'
      ],
      'pt-pt': [
        'Diz "não" a algo que te sobrecarrega',
        'Toma uma decisão rápida sobre algo pequeno',
        'Expressa uma opinião diferente em voz alta',
        'Aceita uma mudança sem resistência',
        'Pede algo que precisas diretamente',
        'Faz algo novo que te causa leve desconforto',
        'Celebra a tua coragem de mudar'
      ],
      en: [
        'Say "no" to something that overwhelms you',
        'Make a quick decision about something small',
        'Express a different opinion out loud',
        'Accept a change without resistance',
        'Ask for something you need directly',
        'Do something new that causes slight discomfort',
        'Celebrate your courage to change'
      ]
    }
  },
  C: {
    name: { pt: 'Conformidade', 'pt-pt': 'Conformidade', en: 'Conscientiousness' },
    emoji: '📊',
    description: {
      pt: 'Você é movido por precisão, lógica e clareza. Sua energia é analítica, cuidadosa e estruturada. Você honra a excelência em tudo que faz.',
      'pt-pt': 'És movido pela precisão, lógica e clareza. A tua energia é analítica, cuidadosa e estruturada. Tu honras a excelência em tudo o que fazes.',
      en: 'You are driven by precision, logic, and clarity. Your energy is analytical, careful, and structured. You honor excellence in everything you do.'
    },
    strengths: {
      pt: ['Organização mental', 'Atenção aos detalhes', 'Raciocínio profundo', 'Alto padrão de qualidade', 'Disciplina natural'],
      'pt-pt': ['Organização mental', 'Atenção aos detalhes', 'Raciocínio profundo', 'Alto padrão de qualidade', 'Disciplina natural'],
      en: ['Mental organization', 'Attention to details', 'Deep reasoning', 'High quality standards', 'Natural discipline']
    },
    vulnerabilities: {
      pt: ['Autocrítica excessiva', 'Rigidez mental', 'Ansiedade por perfeição', 'Dificuldade em delegar'],
      'pt-pt': ['Autocrítica excessiva', 'Rigidez mental', 'Ansiedade por perfeição', 'Dificuldade em delegar'],
      en: ['Excessive self-criticism', 'Mental rigidity', 'Anxiety for perfection', 'Difficulty delegating']
    },
    light: {
      pt: 'Você honra a excelência. Seu olhar enxerga o que ninguém vê.',
      'pt-pt': 'Tu honras a excelência. O teu olhar vê o que ninguém vê.',
      en: 'You honor excellence. Your eye sees what no one else sees.'
    },
    evolution: {
      pt: ['Reduzir perfeccionismo paralisante', 'Aumentar flexibilidade', 'Praticar vulnerabilidade', 'Aceitar "bom o suficiente"', 'Celebrar progresso, não só perfeição'],
      'pt-pt': ['Reduzir perfeccionismo paralisante', 'Aumentar flexibilidade', 'Praticar vulnerabilidade', 'Aceitar "bom o suficiente"', 'Celebrar progresso, não só perfeição'],
      en: ['Reduce paralyzing perfectionism', 'Increase flexibility', 'Practice vulnerability', 'Accept "good enough"', 'Celebrate progress, not just perfection']
    },
    sevenDayPlan: {
      pt: [
        'Entregue algo imperfeito de propósito',
        'Peça ajuda em algo que você domina',
        'Ria de um erro pequeno',
        'Faça algo sem planejar antes',
        'Compartilhe uma vulnerabilidade',
        'Aceite um elogio sem minimizar',
        'Celebre quem você é, não só o que faz'
      ],
      'pt-pt': [
        'Entrega algo imperfeito de propósito',
        'Pede ajuda em algo que dominas',
        'Ri de um erro pequeno',
        'Faz algo sem planear antes',
        'Partilha uma vulnerabilidade',
        'Aceita um elogio sem minimizar',
        'Celebra quem és, não só o que fazes'
      ],
      en: [
        'Deliver something imperfect on purpose',
        'Ask for help with something you master',
        'Laugh at a small mistake',
        'Do something without planning first',
        'Share a vulnerability',
        'Accept a compliment without minimizing',
        'Celebrate who you are, not just what you do'
      ]
    }
  }
};

const DISC_COMBINATIONS: Record<string, Record<string, string>> = {
  DI: {
    pt: 'Energia rápida e comunicativa. Líder apaixonado que decide com o coração e implementa com força. Inspira ação.',
    'pt-pt': 'Energia rápida e comunicativa. Líder apaixonado que decide com o coração e implementa com força. Inspira ação.',
    en: 'Fast and communicative energy. Passionate leader who decides with the heart and implements with strength. Inspires action.'
  },
  DS: {
    pt: 'Determinação equilibrada com paciência. Líder que conquista resultados cuidando das pessoas. Força gentil.',
    'pt-pt': 'Determinação equilibrada com paciência. Líder que conquista resultados cuidando das pessoas. Força gentil.',
    en: 'Determination balanced with patience. Leader who achieves results while caring for people. Gentle strength.'
  },
  DC: {
    pt: 'Foco absoluto em excelência. Mente estratégica que busca resultados com precisão. Exigente consigo e com os outros.',
    'pt-pt': 'Foco absoluto em excelência. Mente estratégica que busca resultados com precisão. Exigente consigo e com os outros.',
    en: 'Absolute focus on excellence. Strategic mind seeking results with precision. Demanding of self and others.'
  },
  ID: {
    pt: 'Carismático e decidido. Une pessoas e lidera com energia expansiva. Cria movimento e engaja equipes.',
    'pt-pt': 'Carismático e decidido. Une pessoas e lidera com energia expansiva. Cria movimento e engaja equipas.',
    en: 'Charismatic and decisive. Unites people and leads with expansive energy. Creates movement and engages teams.'
  },
  IS: {
    pt: 'Comunicador empático. Conecta pessoas com calor e profundidade. Construtor de relacionamentos duradouros.',
    'pt-pt': 'Comunicador empático. Conecta pessoas com calor e profundidade. Construtor de relacionamentos duradouros.',
    en: 'Empathetic communicator. Connects people with warmth and depth. Builder of lasting relationships.'
  },
  IC: {
    pt: 'Criativo e analítico. Une entusiasmo com atenção aos detalhes. Comunica ideias complexas com clareza.',
    'pt-pt': 'Criativo e analítico. Une entusiasmo com atenção aos detalhes. Comunica ideias complexas com clareza.',
    en: 'Creative and analytical. Combines enthusiasm with attention to detail. Communicates complex ideas clearly.'
  },
  SD: {
    pt: 'Calma determinação. Lidera com paciência mas não abre mão de resultados. Força tranquila.',
    'pt-pt': 'Calma determinação. Lidera com paciência mas não abre mão de resultados. Força tranquila.',
    en: 'Calm determination. Leads with patience but doesn\'t give up results. Quiet strength.'
  },
  SI: {
    pt: 'Acolhimento comunicativo. Cria ambientes seguros e conecta pessoas com gentileza. Mediador natural.',
    'pt-pt': 'Acolhimento comunicativo. Cria ambientes seguros e conecta pessoas com gentileza. Mediador natural.',
    en: 'Communicative welcoming. Creates safe environments and connects people with kindness. Natural mediator.'
  },
  SC: {
    pt: 'Profundidade emocional e analítica. Calma, precisão e sensibilidade. Excelente em execução silenciosa e cuidadosa.',
    'pt-pt': 'Profundidade emocional e analítica. Calma, precisão e sensibilidade. Excelente em execução silenciosa e cuidadosa.',
    en: 'Emotional and analytical depth. Calm, precision, and sensitivity. Excellent in quiet and careful execution.'
  },
  CD: {
    pt: 'Estrategista exigente. Combina análise profunda com decisão rápida. Alto padrão em resultados.',
    'pt-pt': 'Estrategista exigente. Combina análise profunda com decisão rápida. Alto padrão em resultados.',
    en: 'Demanding strategist. Combines deep analysis with quick decision. High standards in results.'
  },
  CI: {
    pt: 'Analítico e expressivo. Une rigor com criatividade. Comunica precisão com entusiasmo.',
    'pt-pt': 'Analítico e expressivo. Une rigor com criatividade. Comunica precisão com entusiasmo.',
    en: 'Analytical and expressive. Combines rigor with creativity. Communicates precision with enthusiasm.'
  },
  CS: {
    pt: 'Precisão acolhedora. Organizado, cuidadoso e empático. Cria estruturas que servem pessoas.',
    'pt-pt': 'Precisão acolhedora. Organizado, cuidadoso e empático. Cria estruturas que servem pessoas.',
    en: 'Welcoming precision. Organized, careful, and empathetic. Creates structures that serve people.'
  }
};

interface DISCResults {
  scores: Record<string, number>;
  dominantProfile: string;
  profileData: {
    name: string;
    emoji: string;
    description: string;
    traits: string[];
    growth: string;
  };
}

interface DISCResultsSectionProps {
  discResults: DISCResults;
  lang: 'pt' | 'pt-pt' | 'en';
}

export function DISCResultsSection({ discResults, lang }: DISCResultsSectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const { scores, dominantProfile } = discResults;
  const profileRich = DISC_PROFILES_RICH[dominantProfile as keyof typeof DISC_PROFILES_RICH];
  
  // Calculate total and percentages
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const percentages = Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, totalScore > 0 ? Math.round((v / totalScore) * 100) : 0])
  );
  
  // Get secondary profile (second highest score)
  const sortedProfiles = Object.entries(scores).sort(([,a], [,b]) => b - a);
  const secondaryProfile = sortedProfiles.length > 1 ? sortedProfiles[1][0] : null;
  const blendKey = secondaryProfile ? `${dominantProfile}${secondaryProfile}` : null;
  const blendDescription = blendKey && DISC_COMBINATIONS[blendKey] ? DISC_COMBINATIONS[blendKey][lang] : null;

  const texts = {
    yourProfile: { pt: 'Seu Perfil Comportamental', 'pt-pt': 'O Seu Perfil Comportamental', en: 'Your Behavioral Profile' },
    howCalculated: { pt: 'Como este resultado foi calculado', 'pt-pt': 'Como este resultado foi calculado', en: 'How this result was calculated' },
    scores: { pt: 'Pontuação por Perfil', 'pt-pt': 'Pontuação por Perfil', en: 'Score by Profile' },
    dominant: { pt: 'Perfil Dominante', 'pt-pt': 'Perfil Dominante', en: 'Dominant Profile' },
    secondary: { pt: 'Perfil Secundário', 'pt-pt': 'Perfil Secundário', en: 'Secondary Profile' },
    strengths: { pt: 'Seus Pontos Fortes', 'pt-pt': 'Os Seus Pontos Fortes', en: 'Your Strengths' },
    vulnerabilities: { pt: 'Pontos de Atenção', 'pt-pt': 'Pontos de Atenção', en: 'Points of Attention' },
    evolution: { pt: 'Caminho de Evolução', 'pt-pt': 'Caminho de Evolução', en: 'Path of Evolution' },
    sevenDayPlan: { pt: 'Plano Prático de 7 Dias', 'pt-pt': 'Plano Prático de 7 Dias', en: 'Practical 7-Day Plan' },
    blend: { pt: 'Sua Combinação de Perfis', 'pt-pt': 'A Sua Combinação de Perfis', en: 'Your Profile Blend' },
    showDetails: { pt: 'Ver detalhes do cálculo', 'pt-pt': 'Ver detalhes do cálculo', en: 'Show calculation details' },
    day: { pt: 'Dia', 'pt-pt': 'Dia', en: 'Day' },
    signature: { pt: 'NELLO ONE — uma jornada de autoconhecimento e verdade interior.', 'pt-pt': 'NELLO ONE — uma jornada de autoconhecimento e verdade interior.', en: 'NELLO ONE — a journey of self-knowledge and inner truth.' }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 pb-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">{profileRich.emoji}</div>
          <CardTitle className="text-3xl font-light">{profileRich.name[lang]}</CardTitle>
          <CardDescription className="text-lg">{texts.yourProfile[lang]}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-8 space-y-8">
        {/* Main Description */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <p className="text-lg leading-relaxed">{profileRich.description[lang]}</p>
          <p className="text-base italic text-muted-foreground">"{profileRich.light[lang]}"</p>
        </div>

        {/* Score Transparency */}
        <Card className="border-2 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              {texts.scores[lang]}
            </CardTitle>
            <CardDescription>{texts.howCalculated[lang]}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedProfiles.map(([profile, score], idx) => {
              const profileData = DISC_PROFILES_RICH[profile as keyof typeof DISC_PROFILES_RICH];
              const percentage = percentages[profile];
              const isPrimary = idx === 0;
              const isSecondary = idx === 1;
              
              return (
                <div key={profile} className={`space-y-2 p-4 rounded-lg ${isPrimary ? 'bg-blue-500/10 border-2 border-blue-500' : isSecondary ? 'bg-muted/50 border border-muted-foreground/20' : 'bg-muted/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{profileData.emoji}</span>
                      <div>
                        <h4 className={`font-medium ${isPrimary ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                          {profileData.name[lang]}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {isPrimary ? texts.dominant[lang] : isSecondary ? texts.secondary[lang] : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${isPrimary ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                        {score}/{totalScore}
                      </span>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                  <Progress value={percentage} className={isPrimary ? "h-3" : "h-2"} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Profile Blend */}
        {blendDescription && (
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                {texts.blend[lang]}: {dominantProfile}{secondaryProfile}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{blendDescription}</p>
            </CardContent>
          </Card>
        )}

        {/* Strengths */}
        <Card className="border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Star className="h-5 w-5" />
              {texts.strengths[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {profileRich.strengths[lang].map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Vulnerabilities */}
        <Card className="border-2 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              {texts.vulnerabilities[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {profileRich.vulnerabilities[lang].map((vuln, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xs font-medium mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{vuln}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Evolution Path */}
        <Card className="border-2 border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Lightbulb className="h-5 w-5" />
              {texts.evolution[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {profileRich.evolution[lang].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-medium mt-0.5 flex-shrink-0">
                    ✦
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 7-Day Plan */}
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              📅 {texts.sevenDayPlan[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {profileRich.sevenDayPlan[lang].map((task, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {texts.day[lang]} {index + 1}
                  </div>
                  <span className="flex-1">{task}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Signature */}
        <div className="text-center py-8">
          <p className="text-lg font-light italic text-muted-foreground">
            {texts.signature[lang]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
