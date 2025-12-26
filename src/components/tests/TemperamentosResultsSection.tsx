import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Lightbulb, Heart, Briefcase, Sparkles, MessageCircle, Calendar } from "lucide-react";
import { TemperamentosResult } from "@/lib/temperamentos";

interface TemperamentosResultsSectionProps {
  temperamentosResults: TemperamentosResult;
  lang: 'pt' | 'pt-pt' | 'en';
  userName?: string;
}

const TEMPERAMENT_DATA = {
  sanguineo: {
    pt: {
      name: 'Sanguíneo',
      element: 'Ar',
      elementIcon: '🌬️',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-700 dark:text-amber-400',
      description: 'Você é movido por conexão, entusiasmo e alegria. Sua energia é leve, expansiva e comunicativa. Você inspira, anima e aproxima pessoas naturalmente.',
      strengths: ['Carisma natural', 'Comunicação fluida', 'Sociabilidade elevada', 'Otimismo contagiante', 'Criatividade relacional', 'Adaptabilidade'],
      fragilities: ['Dificuldade com disciplina', 'Procrastinação emocional', 'Impulso por agradar', 'Vulnerabilidade a críticas', 'Falta de foco prolongado', 'Superficialidade em vínculos'],
      light: 'Você movimenta corações. Sua presença muda ambientes e ilumina pessoas.',
      nelloMessage: 'Sua alma é festa. Você transforma ambientes pesados em lugares leves. Mas cuidado: nem toda alegria é saúde. Às vezes você sorri para esconder. Aprenda a ser leve E profundo.',
      expansion: ['Criar rotina emocional', 'Praticar constância', 'Reduzir impulsividade', 'Aprofundar vínculos', 'Aceitar momentos de solidão'],
      sevenDayPlan: [
        'Termine uma tarefa antes de começar outra',
        'Fique 15 minutos em silêncio',
        'Escreva o que está sentindo',
        'Diga não para algo que não quer fazer',
        'Aprofunde uma conversa com alguém',
        'Ore pedindo foco e direção',
        'Celebre uma conquista sua'
      ]
    },
    en: {
      name: 'Sanguine',
      element: 'Air',
      elementIcon: '🌬️',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-700 dark:text-amber-400',
      description: 'You are driven by connection, enthusiasm, and joy. Your energy is light, expansive, and communicative. You inspire, encourage, and bring people together naturally.',
      strengths: ['Natural charisma', 'Fluid communication', 'High sociability', 'Contagious optimism', 'Relational creativity', 'Adaptability'],
      fragilities: ['Difficulty with discipline', 'Emotional procrastination', 'Urge to please', 'Vulnerability to criticism', 'Lack of prolonged focus', 'Superficiality in bonds'],
      light: 'You move hearts. Your presence changes environments and illuminates people.',
      nelloMessage: 'Your soul is a celebration. You transform heavy environments into light places. But be careful: not all joy is health. Sometimes you smile to hide. Learn to be light AND deep.',
      expansion: ['Create emotional routine', 'Practice constancy', 'Reduce impulsivity', 'Deepen bonds', 'Accept moments of solitude'],
      sevenDayPlan: [
        'Finish one task before starting another',
        'Stay silent for 15 minutes',
        'Write down what you are feeling',
        'Say no to something you don\'t want to do',
        'Deepen a conversation with someone',
        'Pray for focus and direction',
        'Celebrate one of your achievements'
      ]
    }
  },
  colerico: {
    pt: {
      name: 'Colérico',
      element: 'Fogo',
      elementIcon: '🔥',
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-700 dark:text-red-400',
      description: 'Você é movido por ação, resultado e intensidade. Sua energia é rápida, direcionada e determinada. Você toma iniciativa naturalmente e possui um forte senso de justiça.',
      strengths: ['Decisão rápida e certeira', 'Liderança natural', 'Clareza de propósito', 'Coragem para enfrentar desafios', 'Produtividade elevada', 'Capacidade de resolver problemas'],
      fragilities: ['Dureza no trato pessoal', 'Impaciência com processos lentos', 'Dificuldade em delegar', 'Tendência a controlar demais', 'Pouca tolerância a erros', 'Desconexão emocional sob pressão'],
      light: 'Você abre caminhos que outros têm medo de atravessar. Sua força move montanhas.',
      nelloMessage: 'Vejo em você uma força que poucos têm. Sua energia é fogo que ilumina ou queima. Quando você aprende a dosar essa intensidade, você se torna líder de verdade — não por imposição, mas por inspiração.',
      expansion: ['Suavizar o tom nas conversas', 'Pausar antes de reagir', 'Ampliar a empatia', 'Praticar a escuta ativa', 'Aceitar que nem tudo depende de você'],
      sevenDayPlan: [
        'Ouça alguém sem interromper',
        'Pause 10 segundos antes de responder',
        'Peça desculpas por algo pequeno',
        'Faça algo lento de propósito',
        'Elogie alguém genuinamente',
        'Ore pedindo paciência',
        'Celebre uma vitória alheia'
      ]
    },
    en: {
      name: 'Choleric',
      element: 'Fire',
      elementIcon: '🔥',
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-700 dark:text-red-400',
      description: 'You are driven by action, results, and intensity. Your energy is fast, directed, and determined. You take initiative naturally and have a strong sense of justice.',
      strengths: ['Quick and accurate decisions', 'Natural leadership', 'Clarity of purpose', 'Courage to face challenges', 'High productivity', 'Problem-solving ability'],
      fragilities: ['Harshness in personal dealings', 'Impatience with slow processes', 'Difficulty delegating', 'Tendency to over-control', 'Low tolerance for mistakes', 'Emotional disconnection under pressure'],
      light: 'You open paths that others are afraid to cross. Your strength moves mountains.',
      nelloMessage: 'I see in you a strength that few have. Your energy is fire that illuminates or burns. When you learn to dose this intensity, you become a true leader — not by imposition, but by inspiration.',
      expansion: ['Soften the tone in conversations', 'Pause before reacting', 'Expand empathy', 'Practice active listening', 'Accept that not everything depends on you'],
      sevenDayPlan: [
        'Listen to someone without interrupting',
        'Pause 10 seconds before responding',
        'Apologize for something small',
        'Do something slowly on purpose',
        'Genuinely compliment someone',
        'Pray for patience',
        'Celebrate someone else\'s victory'
      ]
    }
  },
  melancolico: {
    pt: {
      name: 'Melancólico',
      element: 'Água',
      elementIcon: '💧',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-700 dark:text-blue-400',
      description: 'Você sente profundamente, pensa profundamente e vive com intensidade emocional e significado. Sua energia é sensível, cuidadosa, profunda, criativa e observadora.',
      strengths: ['Empatia profunda', 'Memória emocional rica', 'Cuidado com detalhes', 'Reflexão antes de agir', 'Profundidade estética e espiritual', 'Capacidade analítica'],
      fragilities: ['Autocrítica excessiva', 'Timidez emocional', 'Medo de errar', 'Desânimo diante de caos', 'Perfeccionismo paralisante', 'Tendência à melancolia'],
      light: 'Sua alma enxerga o que outros não veem. Você sente com verdade e profundidade.',
      nelloMessage: 'Você carrega um universo interno que poucos conhecem. Sua profundidade é dom, não fardo. Aprenda a não se afogar no que sente. A clareza vem quando você para de se julgar.',
      expansion: ['Reduzir autocrítica', 'Simplificar expectativas', 'Praticar ações rápidas', 'Fortalecer coragem emocional', 'Aceitar imperfeição'],
      sevenDayPlan: [
        'Nomeie um sentimento sem julgá-lo',
        'Aja sem esperar perfeição',
        'Fale uma verdade com calma',
        'Ignore um pensamento crítico',
        'Faça algo leve sem culpa',
        'Ore pedindo cura emocional',
        'Honre sua sensibilidade como dom'
      ]
    },
    en: {
      name: 'Melancholic',
      element: 'Water',
      elementIcon: '💧',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-700 dark:text-blue-400',
      description: 'You feel deeply, think deeply, and live with emotional intensity and meaning. Your energy is sensitive, careful, deep, creative, and observant.',
      strengths: ['Deep empathy', 'Rich emotional memory', 'Attention to detail', 'Reflection before action', 'Aesthetic and spiritual depth', 'Analytical capacity'],
      fragilities: ['Excessive self-criticism', 'Emotional shyness', 'Fear of making mistakes', 'Discouragement in chaos', 'Paralyzing perfectionism', 'Tendency toward melancholy'],
      light: 'Your soul sees what others cannot see. You feel with truth and depth.',
      nelloMessage: 'You carry an inner universe that few know. Your depth is a gift, not a burden. Learn not to drown in what you feel. Clarity comes when you stop judging yourself.',
      expansion: ['Reduce self-criticism', 'Simplify expectations', 'Practice quick actions', 'Strengthen emotional courage', 'Accept imperfection'],
      sevenDayPlan: [
        'Name a feeling without judging it',
        'Act without expecting perfection',
        'Speak a truth calmly',
        'Ignore a critical thought',
        'Do something light without guilt',
        'Pray for emotional healing',
        'Honor your sensitivity as a gift'
      ]
    }
  },
  fleumatico: {
    pt: {
      name: 'Fleumático',
      element: 'Terra',
      elementIcon: '🌍',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      description: 'Você é movido por paz, estabilidade e harmonia. Sua energia é calma, constante e equilibrada. Você traz serenidade aos ambientes e é um porto seguro para quem te cerca.',
      strengths: ['Paciência elevada', 'Equilíbrio emocional', 'Capacidade de mediação', 'Lealdade profunda', 'Escuta atenta', 'Consistência'],
      fragilities: ['Medo de conflito', 'Passividade excessiva', 'Dificuldade em decidir', 'Resistência a mudanças', 'Tendência a postergar', 'Dificuldade em expressar necessidades'],
      light: 'Você é âncora em meio à tempestade. Sua calma é refúgio para muitos.',
      nelloMessage: 'Sua paz é real, mas às vezes você se esconde nela. A tranquilidade é sua força — mas não pode virar prisão. Você precisa aprender a agir, mesmo sem garantias.',
      expansion: ['Tomar mais iniciativa', 'Expressar desejos claramente', 'Aceitar mudanças', 'Confrontar com gentileza', 'Celebrar pequenas vitórias'],
      sevenDayPlan: [
        'Tome uma decisão sem consultar ninguém',
        'Expresse uma opinião em público',
        'Faça algo novo sem planejar',
        'Diga o que precisa a alguém',
        'Comece algo antes de terminar outra coisa',
        'Ore pedindo coragem',
        'Celebre uma conquista em voz alta'
      ]
    },
    en: {
      name: 'Phlegmatic',
      element: 'Earth',
      elementIcon: '🌍',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      description: 'You are driven by peace, stability, and harmony. Your energy is calm, constant, and balanced. You bring serenity to environments and are a safe harbor for those around you.',
      strengths: ['High patience', 'Emotional balance', 'Mediation ability', 'Deep loyalty', 'Attentive listening', 'Consistency'],
      fragilities: ['Fear of conflict', 'Excessive passivity', 'Difficulty deciding', 'Resistance to change', 'Tendency to procrastinate', 'Difficulty expressing needs'],
      light: 'You are an anchor in the storm. Your calm is a refuge for many.',
      nelloMessage: 'Your peace is real, but sometimes you hide in it. Tranquility is your strength — but it cannot become a prison. You need to learn to act, even without guarantees.',
      expansion: ['Take more initiative', 'Express desires clearly', 'Accept changes', 'Confront with kindness', 'Celebrate small victories'],
      sevenDayPlan: [
        'Make a decision without consulting anyone',
        'Express an opinion in public',
        'Do something new without planning',
        'Tell someone what you need',
        'Start something before finishing another thing',
        'Pray for courage',
        'Celebrate an achievement out loud'
      ]
    }
  }
};

const getLabels = (lang: string) => {
  const labels: Record<string, Record<string, string>> = {
    pt: {
      yourTemperament: 'Seu Temperamento',
      howEmotionsMove: 'Como suas emoções se movem e se expressam no mundo',
      dominantTemperament: 'Temperamento Dominante',
      secondaryTemperament: 'Temperamento Secundário',
      points: 'pontos',
      element: 'Elemento',
      yourStrengths: 'Suas Forças Naturais',
      naturalGifts: 'Dons que fazem de você quem é',
      vulnerabilities: 'Vulnerabilidades',
      areasOfGrowth: 'Áreas que pedem atenção e cuidado',
      yourLight: 'Sua Luz',
      nelloMessage: 'Mensagem do Nello AI',
      expansionPoints: 'Pontos de Expansão',
      pathToGrowth: 'Seu caminho de evolução emocional',
      sevenDayPlan: 'Plano de 7 Dias',
      practicalEvolution: 'Práticas diárias para sua evolução',
      day: 'Dia',
      scoresBreakdown: 'Seus Scores por Temperamento',
      howCalculated: 'Como seu resultado foi calculado'
    },
    'pt-pt': {
      yourTemperament: 'O Teu Temperamento',
      howEmotionsMove: 'Como as tuas emoções se movem e se expressam no mundo',
      dominantTemperament: 'Temperamento Dominante',
      secondaryTemperament: 'Temperamento Secundário',
      points: 'pontos',
      element: 'Elemento',
      yourStrengths: 'As Tuas Forças Naturais',
      naturalGifts: 'Dons que fazem de ti quem és',
      vulnerabilities: 'Vulnerabilidades',
      areasOfGrowth: 'Áreas que pedem atenção e cuidado',
      yourLight: 'A Tua Luz',
      nelloMessage: 'Mensagem do Nello AI',
      expansionPoints: 'Pontos de Expansão',
      pathToGrowth: 'O teu caminho de evolução emocional',
      sevenDayPlan: 'Plano de 7 Dias',
      practicalEvolution: 'Práticas diárias para a tua evolução',
      day: 'Dia',
      scoresBreakdown: 'Os Teus Scores por Temperamento',
      howCalculated: 'Como o teu resultado foi calculado'
    },
    en: {
      yourTemperament: 'Your Temperament',
      howEmotionsMove: 'How your emotions move and express themselves in the world',
      dominantTemperament: 'Dominant Temperament',
      secondaryTemperament: 'Secondary Temperament',
      points: 'points',
      element: 'Element',
      yourStrengths: 'Your Natural Strengths',
      naturalGifts: 'Gifts that make you who you are',
      vulnerabilities: 'Vulnerabilities',
      areasOfGrowth: 'Areas that need attention and care',
      yourLight: 'Your Light',
      nelloMessage: 'Message from Nello AI',
      expansionPoints: 'Expansion Points',
      pathToGrowth: 'Your path to emotional evolution',
      sevenDayPlan: '7-Day Plan',
      practicalEvolution: 'Daily practices for your evolution',
      day: 'Day',
      scoresBreakdown: 'Your Scores by Temperament',
      howCalculated: 'How your result was calculated'
    }
  };
  return labels[lang] || labels['pt'];
};

export function TemperamentosResultsSection({ temperamentosResults, lang, userName = 'Você' }: TemperamentosResultsSectionProps) {
  const labels = getLabels(lang);
  const effectiveLang = lang === 'pt-pt' ? 'pt' : lang; // pt-pt uses pt content
  
  // Safety checks for required data
  if (!temperamentosResults?.primary?.temperament || !temperamentosResults?.secondary?.temperament || !temperamentosResults?.scores) {
    console.error('TemperamentosResultsSection: Missing required data', temperamentosResults);
    return null;
  }
  
  const primaryKey = temperamentosResults.primary.temperament as keyof typeof TEMPERAMENT_DATA;
  const secondaryKey = temperamentosResults.secondary.temperament as keyof typeof TEMPERAMENT_DATA;
  
  const primaryData = TEMPERAMENT_DATA[primaryKey]?.[effectiveLang] || TEMPERAMENT_DATA[primaryKey]?.pt;
  const secondaryData = TEMPERAMENT_DATA[secondaryKey]?.[effectiveLang] || TEMPERAMENT_DATA[secondaryKey]?.pt;
  
  if (!primaryData || !secondaryData) {
    console.error('TemperamentosResultsSection: Invalid temperament keys', { primaryKey, secondaryKey });
    return null;
  }

  const scores = temperamentosResults.scores || { sanguineo: 0, colerico: 0, melancolico: 0, fleumatico: 0 };
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const temperamentOrder = [
    { key: 'colerico', label: 'Colérico', score: scores.colerico || 0 },
    { key: 'sanguineo', label: 'Sanguíneo', score: scores.sanguineo || 0 },
    { key: 'melancolico', label: 'Melancólico', score: scores.melancolico || 0 },
    { key: 'fleumatico', label: 'Fleumático', score: scores.fleumatico || 0 }
  ].sort((a, b) => b.score - a.score);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className={`bg-gradient-to-r ${primaryData.color} pb-8`}>
        <div className="text-center space-y-4">
          <div className="text-6xl">{primaryData.elementIcon}</div>
          <CardTitle className="text-3xl font-light text-white">{labels.yourTemperament}</CardTitle>
          <CardDescription className="text-lg text-white/80">{labels.howEmotionsMove}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-8 space-y-8">
        {/* Primary and Secondary Temperaments */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className={`border-2 ${primaryData.borderColor} ${primaryData.bgColor}`}>
            <CardHeader>
              <CardTitle className={`text-xl flex items-center gap-2 ${primaryData.textColor}`}>
                <span className="text-3xl">{primaryData.elementIcon}</span>
                {labels.dominantTemperament}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold">{primaryData.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{labels.element}: {primaryData.element}</p>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                {temperamentosResults.primary.score} {labels.points}
              </Badge>
              <p className="text-base leading-relaxed">
                {primaryData.description}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-muted">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-3xl">{secondaryData.elementIcon}</span>
                {labels.secondaryTemperament}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold">{secondaryData.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{labels.element}: {secondaryData.element}</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {temperamentosResults.secondary.score} {labels.points}
              </Badge>
              <p className="text-base leading-relaxed">
                {secondaryData.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Scores Breakdown */}
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {labels.scoresBreakdown}
            </CardTitle>
            <CardDescription>{labels.howCalculated}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {temperamentOrder.map((temp) => {
              const tempData = TEMPERAMENT_DATA[temp.key as keyof typeof TEMPERAMENT_DATA]?.[effectiveLang] || 
                             TEMPERAMENT_DATA[temp.key as keyof typeof TEMPERAMENT_DATA]?.pt;
              const percentage = totalScore > 0 ? Math.round((temp.score / totalScore) * 100) : 0;
              const isPrimary = temp.key === primaryKey;
              
              return (
                <div key={temp.key} className={`p-4 rounded-lg border-2 ${isPrimary ? `${tempData?.bgColor} ${tempData?.borderColor}` : 'bg-muted/30 border-border'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium flex items-center gap-2">
                      <span>{tempData?.elementIcon}</span>
                      {tempData?.name || temp.label}
                    </span>
                    <span className="text-lg font-bold">{temp.score} ({percentage}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card className={`border-2 ${primaryData.borderColor} ${primaryData.bgColor}`}>
          <CardHeader>
            <CardTitle className={`text-xl flex items-center gap-2 ${primaryData.textColor}`}>
              <CheckCircle className="h-5 w-5" />
              {labels.yourStrengths}
            </CardTitle>
            <CardDescription>{labels.naturalGifts}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-3">
              {primaryData.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className={`h-5 w-5 ${primaryData.textColor} mt-0.5 flex-shrink-0`} />
                  <span className="text-foreground">{strength}</span>
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
              {labels.vulnerabilities}
            </CardTitle>
            <CardDescription>{labels.areasOfGrowth}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-3">
              {primaryData.fragilities.map((fragility, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xs font-medium mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{fragility}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Your Light */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Sparkles className="h-5 w-5" />
              {labels.yourLight}
            </div>
            <p className="text-xl leading-relaxed pl-7 italic text-foreground">
              "{primaryData.light}"
            </p>
          </CardContent>
        </Card>

        {/* Nello AI's Message */}
        <Card className="bg-gradient-to-br from-accent/20 to-background border-accent/30">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MessageCircle className="h-5 w-5 text-accent" />
              {labels.nelloMessage}
            </div>
            <p className="text-base leading-relaxed pl-7 text-muted-foreground whitespace-pre-line">
              {primaryData.nelloMessage}
            </p>
          </CardContent>
        </Card>

        {/* Expansion Points */}
        <Card className="border-2 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <Lightbulb className="h-5 w-5" />
              {labels.expansionPoints}
            </CardTitle>
            <CardDescription>{labels.pathToGrowth}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {primaryData.expansion.map((point, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/80 border border-border/50">
                  <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 7-Day Plan */}
        <Card className="border-2 border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-accent">
              <Calendar className="h-5 w-5" />
              {labels.sevenDayPlan}
            </CardTitle>
            <CardDescription>{labels.practicalEvolution}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {primaryData.sevenDayPlan.map((task, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background/80 border border-border/50">
                  <Badge variant="outline" className="flex-shrink-0">
                    {labels.day} {index + 1}
                  </Badge>
                  <span className="text-foreground text-sm">{task}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interpretation */}
        <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/30">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Heart className="h-5 w-5 text-accent" />
              {lang === 'en' ? 'Your Personalized Interpretation' : 'Interpretação Personalizada'}
            </div>
            <p className="text-base leading-relaxed pl-7 whitespace-pre-line text-muted-foreground">
              {temperamentosResults.interpretation}
            </p>
          </CardContent>
        </Card>

        <div className="text-center py-8">
          <p className="text-lg font-light italic text-muted-foreground">
            NELLO ONE — {lang === 'en' ? 'a journey of self-knowledge and inner truth.' : 'uma jornada de autoconhecimento e verdade interior.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
