import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, AlertTriangle, Lightbulb, Star, TrendingUp, Users, 
  Briefcase, Heart, Shield, Target, Zap, Clock, MessageCircle, Brain,
  Sparkles, ChevronDown, Info
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { parseDISCResultData } from "@/lib/disc";

// ==================== DATA ====================

const DISC_PROFILES_RICH = {
  D: {
    name: { pt: 'Dominância', 'pt-pt': 'Dominância', en: 'Dominance' },
    emoji: '🎯',
    letter: 'D',
    shortDesc: { 
      pt: 'Foco em resultado, decisão rápida, enfrentamento de desafios',
      'pt-pt': 'Foco em resultado, decisão rápida, enfrentamento de desafios',
      en: 'Focus on results, quick decisions, facing challenges'
    },
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
    patterns: {
      pt: ['Busca resultados mesmo sob pressão', 'Lidera pelo exemplo e ação', 'Resolve conflitos enfrentando-os diretamente', 'Toma decisões rápidas quando necessário'],
      'pt-pt': ['Busca resultados mesmo sob pressão', 'Lidera pelo exemplo e ação', 'Resolve conflitos enfrentando-os diretamente', 'Toma decisões rápidas quando necessário'],
      en: ['Seeks results even under pressure', 'Leads by example and action', 'Resolves conflicts by facing them directly', 'Makes quick decisions when needed']
    },
    underPressure: {
      pt: ['Ficar impaciente com processos lentos', 'Interromper os outros para acelerar', 'Tomar decisões sem ouvir todos os lados', 'Parecer duro ou insensível'],
      'pt-pt': ['Ficar impaciente com processos lentos', 'Interromper os outros para acelerar', 'Tomar decisões sem ouvir todos os lados', 'Parecer duro ou insensível'],
      en: ['Become impatient with slow processes', 'Interrupt others to speed up', 'Make decisions without hearing all sides', 'Appear harsh or insensitive']
    },
    atBest: {
      pt: ['Inspirar outros com sua coragem', 'Mover projetos do papel para a ação', 'Proteger quem está sob sua liderança', 'Enfrentar desafios que outros evitam'],
      'pt-pt': ['Inspirar outros com a tua coragem', 'Mover projetos do papel para a ação', 'Proteger quem está sob a tua liderança', 'Enfrentar desafios que outros evitam'],
      en: ['Inspire others with your courage', 'Move projects from paper to action', 'Protect those under your leadership', 'Face challenges that others avoid']
    },
    lifeImpact: {
      work: { pt: 'No trabalho, você lidera naturalmente. Sua energia move projetos do planejamento para a execução. Você se frustra com ineficiência e busca otimização constante.', 'pt-pt': 'No trabalho, lideras naturalmente. A tua energia move projetos do planeamento para a execução. Frustras-te com ineficiência e buscas otimização constante.', en: 'At work, you lead naturally. Your energy moves projects from planning to execution. You get frustrated with inefficiency and seek constant optimization.' },
      relationships: { pt: 'Nos relacionamentos, você é protetor e direto. Prefere resolver problemas a evitá-los. Pode parecer duro, mas seu cuidado aparece em ações, não palavras.', 'pt-pt': 'Nos relacionamentos, és protetor e direto. Preferes resolver problemas a evitá-los. Podes parecer duro, mas o teu cuidado aparece em ações, não palavras.', en: 'In relationships, you are protective and direct. You prefer to solve problems rather than avoid them. You may seem harsh, but your care shows in actions, not words.' },
      inner: { pt: 'Na vida interior, você processa emoções rapidamente, às vezes rápido demais. Seu desafio é desacelerar para ouvir o que Deus quer dizer além da ação.', 'pt-pt': 'Na vida interior, processas emoções rapidamente, às vezes rápido demais. O teu desafio é desacelerar para ouvir o que Deus quer dizer além da ação.', en: 'In your inner life, you process emotions quickly, sometimes too quickly. Your challenge is to slow down to hear what God wants to say beyond action.' }
    },
    traps: {
      pt: ['Confundir produtividade com propósito', 'Ignorar sinais de cansaço do corpo e da alma', 'Acreditar que só você consegue fazer direito'],
      'pt-pt': ['Confundir produtividade com propósito', 'Ignorar sinais de cansaço do corpo e da alma', 'Acreditar que só tu consegues fazer direito'],
      en: ['Confusing productivity with purpose', 'Ignoring signs of fatigue from body and soul', 'Believing only you can do it right']
    },
    adjustments: {
      pt: ['Antes de decidir, pergunte: "Quem ainda não ouvi?"', 'Reserve 10 minutos diários para silêncio intencional', 'Celebre vitórias que não são suas'],
      'pt-pt': ['Antes de decidir, pergunta: "Quem ainda não ouvi?"', 'Reserva 10 minutos diários para silêncio intencional', 'Celebra vitórias que não são tuas'],
      en: ['Before deciding, ask: "Who haven\'t I heard yet?"', 'Reserve 10 minutes daily for intentional silence', 'Celebrate victories that are not yours']
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
    },
    selfExam: {
      pt: 'Sua força está abrindo portas ou fechando corações?',
      'pt-pt': 'A tua força está a abrir portas ou a fechar corações?',
      en: 'Is your strength opening doors or closing hearts?'
    }
  },
  I: {
    name: { pt: 'Influência', 'pt-pt': 'Influência', en: 'Influence' },
    emoji: '✨',
    letter: 'I',
    shortDesc: { 
      pt: 'Comunicação, persuasão, energia social',
      'pt-pt': 'Comunicação, persuasão, energia social',
      en: 'Communication, persuasion, social energy'
    },
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
    patterns: {
      pt: ['Energiza ambientes e equipes naturalmente', 'Conecta pessoas que não se conhecem', 'Transforma tensão em leveza com palavras', 'Vê possibilidades onde outros veem obstáculos'],
      'pt-pt': ['Energiza ambientes e equipas naturalmente', 'Conecta pessoas que não se conhecem', 'Transforma tensão em leveza com palavras', 'Vê possibilidades onde outros veem obstáculos'],
      en: ['Energizes environments and teams naturally', 'Connects people who don\'t know each other', 'Transforms tension into lightness with words', 'Sees possibilities where others see obstacles']
    },
    underPressure: {
      pt: ['Evitar conversas difíceis', 'Prometer mais do que pode entregar', 'Buscar aprovação em excesso', 'Perder foco quando não há estímulo'],
      'pt-pt': ['Evitar conversas difíceis', 'Prometer mais do que podes entregar', 'Buscar aprovação em excesso', 'Perder foco quando não há estímulo'],
      en: ['Avoid difficult conversations', 'Promise more than you can deliver', 'Seek excessive approval', 'Lose focus when there is no stimulus']
    },
    atBest: {
      pt: ['Inspirar outros a sonhar maior', 'Criar conexões genuínas e duradouras', 'Comunicar visão de forma cativante', 'Trazer esperança em momentos difíceis'],
      'pt-pt': ['Inspirar outros a sonhar maior', 'Criar conexões genuínas e duradouras', 'Comunicar visão de forma cativante', 'Trazer esperança em momentos difíceis'],
      en: ['Inspire others to dream bigger', 'Create genuine and lasting connections', 'Communicate vision captivatingly', 'Bring hope in difficult times']
    },
    lifeImpact: {
      work: { pt: 'No trabalho, você brilha em apresentações, vendas e liderança inspiracional. Precisa de ambientes que valorizem criatividade e não o prendam em rotinas rígidas.', 'pt-pt': 'No trabalho, brilhas em apresentações, vendas e liderança inspiracional. Precisas de ambientes que valorizem criatividade e não te prendam em rotinas rígidas.', en: 'At work, you shine in presentations, sales, and inspirational leadership. You need environments that value creativity and don\'t trap you in rigid routines.' },
      relationships: { pt: 'Nos relacionamentos, você é generoso com atenção e palavras. Seu desafio é manter profundidade quando a novidade passa e a rotina chega.', 'pt-pt': 'Nos relacionamentos, és generoso com atenção e palavras. O teu desafio é manter profundidade quando a novidade passa e a rotina chega.', en: 'In relationships, you are generous with attention and words. Your challenge is maintaining depth when novelty fades and routine arrives.' },
      inner: { pt: 'Na vida interior, você precisa de momentos de silêncio para não se perder no barulho externo. Deus te encontra na quietude, não só na ação.', 'pt-pt': 'Na vida interior, precisas de momentos de silêncio para não te perderes no barulho externo. Deus encontra-te na quietude, não só na ação.', en: 'In your inner life, you need moments of silence to not get lost in external noise. God meets you in stillness, not just in action.' }
    },
    traps: {
      pt: ['Confundir popularidade com intimidade', 'Fugir do silêncio e da solidão', 'Abandonar projetos quando a empolgação passa'],
      'pt-pt': ['Confundir popularidade com intimidade', 'Fugir do silêncio e da solidão', 'Abandonar projetos quando a empolgação passa'],
      en: ['Confusing popularity with intimacy', 'Fleeing silence and solitude', 'Abandoning projects when excitement fades']
    },
    adjustments: {
      pt: ['Pratique dizer "preciso pensar" antes de responder', 'Termine uma coisa antes de começar outra', 'Reserve tempo semanal para ficar sozinho'],
      'pt-pt': ['Pratica dizer "preciso pensar" antes de responder', 'Termina uma coisa antes de começar outra', 'Reserva tempo semanal para ficar sozinho'],
      en: ['Practice saying "I need to think" before answering', 'Finish one thing before starting another', 'Reserve weekly time to be alone']
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
    },
    selfExam: {
      pt: 'Você está buscando conexão genuína ou apenas aplausos?',
      'pt-pt': 'Estás a buscar conexão genuína ou apenas aplausos?',
      en: 'Are you seeking genuine connection or just applause?'
    }
  },
  S: {
    name: { pt: 'Estabilidade', 'pt-pt': 'Estabilidade', en: 'Steadiness' },
    emoji: '🤝',
    letter: 'S',
    shortDesc: { 
      pt: 'Consistência, lealdade, ritmo constante',
      'pt-pt': 'Consistência, lealdade, ritmo constante',
      en: 'Consistency, loyalty, steady rhythm'
    },
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
    patterns: {
      pt: ['Cria ambientes seguros para os outros', 'Mantém compromissos mesmo quando é difícil', 'Ouve mais do que fala', 'Cuida sem esperar reconhecimento'],
      'pt-pt': ['Cria ambientes seguros para os outros', 'Mantém compromissos mesmo quando é difícil', 'Ouve mais do que fala', 'Cuida sem esperar reconhecimento'],
      en: ['Creates safe environments for others', 'Keeps commitments even when difficult', 'Listens more than speaks', 'Cares without expecting recognition']
    },
    underPressure: {
      pt: ['Ceder quando deveria manter posição', 'Guardar ressentimento em silêncio', 'Resistir a mudanças necessárias', 'Deixar de expressar necessidades próprias'],
      'pt-pt': ['Ceder quando deveria manter posição', 'Guardar ressentimento em silêncio', 'Resistir a mudanças necessárias', 'Deixar de expressar necessidades próprias'],
      en: ['Give in when should hold position', 'Hold resentment in silence', 'Resist necessary changes', 'Fail to express own needs']
    },
    atBest: {
      pt: ['Ser porto seguro para quem ama', 'Manter calma quando outros entram em pânico', 'Construir relacionamentos que duram décadas', 'Servir com alegria e sem reclamação'],
      'pt-pt': ['Ser porto seguro para quem amas', 'Manter calma quando outros entram em pânico', 'Construir relacionamentos que duram décadas', 'Servir com alegria e sem reclamação'],
      en: ['Be a safe harbor for loved ones', 'Keep calm when others panic', 'Build relationships that last decades', 'Serve with joy and without complaint']
    },
    lifeImpact: {
      work: { pt: 'No trabalho, você é a cola que mantém a equipe unida. Sua consistência gera confiança. Você prospera em ambientes estáveis com expectativas claras.', 'pt-pt': 'No trabalho, és a cola que mantém a equipa unida. A tua consistência gera confiança. Prosperas em ambientes estáveis com expectativas claras.', en: 'At work, you are the glue that holds the team together. Your consistency builds trust. You thrive in stable environments with clear expectations.' },
      relationships: { pt: 'Nos relacionamentos, você é leal até o fim. Seu desafio é expressar o que precisa, não só cuidar do outro. O amor também inclui receber.', 'pt-pt': 'Nos relacionamentos, és leal até ao fim. O teu desafio é expressar o que precisas, não só cuidar do outro. O amor também inclui receber.', en: 'In relationships, you are loyal to the end. Your challenge is expressing what you need, not just caring for others. Love also includes receiving.' },
      inner: { pt: 'Na vida interior, você processa emoções lentamente, o que é uma força. Mas cuidado para não reprimir o que precisa ser dito. Deus ouve seu silêncio também.', 'pt-pt': 'Na vida interior, processas emoções lentamente, o que é uma força. Mas cuidado para não reprimir o que precisa ser dito. Deus ouve o teu silêncio também.', en: 'In your inner life, you process emotions slowly, which is a strength. But be careful not to repress what needs to be said. God hears your silence too.' }
    },
    traps: {
      pt: ['Confundir paz com evitação de conflito', 'Carregar peso emocional que não é seu', 'Acreditar que pedir ajuda é fraqueza'],
      'pt-pt': ['Confundir paz com evitação de conflito', 'Carregar peso emocional que não é teu', 'Acreditar que pedir ajuda é fraqueza'],
      en: ['Confusing peace with conflict avoidance', 'Carrying emotional weight that is not yours', 'Believing that asking for help is weakness']
    },
    adjustments: {
      pt: ['Expresse uma necessidade hoje, mesmo pequena', 'Aceite uma mudança sem resistência interna', 'Diga não a algo que te sobrecarrega'],
      'pt-pt': ['Expressa uma necessidade hoje, mesmo pequena', 'Aceita uma mudança sem resistência interna', 'Diz não a algo que te sobrecarrega'],
      en: ['Express a need today, even a small one', 'Accept a change without internal resistance', 'Say no to something that overwhelms you']
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
    },
    selfExam: {
      pt: 'Sua paz vem do Espírito ou do medo de incomodar?',
      'pt-pt': 'A tua paz vem do Espírito ou do medo de incomodar?',
      en: 'Does your peace come from the Spirit or from fear of disturbing?'
    }
  },
  C: {
    name: { pt: 'Conformidade', 'pt-pt': 'Conformidade', en: 'Conscientiousness' },
    emoji: '📊',
    letter: 'C',
    shortDesc: { 
      pt: 'Critério, qualidade, análise, precisão',
      'pt-pt': 'Critério, qualidade, análise, precisão',
      en: 'Criteria, quality, analysis, precision'
    },
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
    patterns: {
      pt: ['Analisa antes de agir', 'Busca entender o "porquê" das coisas', 'Mantém padrões elevados para si e outros', 'Prefere qualidade a quantidade'],
      'pt-pt': ['Analisa antes de agir', 'Busca entender o "porquê" das coisas', 'Mantém padrões elevados para si e outros', 'Prefere qualidade a quantidade'],
      en: ['Analyzes before acting', 'Seeks to understand the "why" of things', 'Maintains high standards for self and others', 'Prefers quality over quantity']
    },
    underPressure: {
      pt: ['Paralisar por medo de errar', 'Criticar a si mesmo duramente', 'Isolar-se para evitar julgamento', 'Procrastinar decisões importantes'],
      'pt-pt': ['Paralisar por medo de errar', 'Criticar a si mesmo duramente', 'Isolar-se para evitar julgamento', 'Procrastinar decisões importantes'],
      en: ['Freeze for fear of making mistakes', 'Criticize yourself harshly', 'Isolate to avoid judgment', 'Procrastinate important decisions']
    },
    atBest: {
      pt: ['Criar sistemas que funcionam por anos', 'Ver detalhes que salvam projetos', 'Entregar trabalho de qualidade excepcional', 'Pensar de forma estratégica e profunda'],
      'pt-pt': ['Criar sistemas que funcionam por anos', 'Ver detalhes que salvam projetos', 'Entregar trabalho de qualidade excepcional', 'Pensar de forma estratégica e profunda'],
      en: ['Create systems that work for years', 'See details that save projects', 'Deliver work of exceptional quality', 'Think strategically and deeply']
    },
    lifeImpact: {
      work: { pt: 'No trabalho, você é o guardião da qualidade. Sua mente analítica encontra erros antes que se tornem problemas. Você prospera onde precisão importa.', 'pt-pt': 'No trabalho, és o guardião da qualidade. A tua mente analítica encontra erros antes que se tornem problemas. Prosperas onde precisão importa.', en: 'At work, you are the guardian of quality. Your analytical mind finds errors before they become problems. You thrive where precision matters.' },
      relationships: { pt: 'Nos relacionamentos, você ama com consistência e profundidade. Seu desafio é aceitar imperfeições—nos outros e em si mesmo.', 'pt-pt': 'Nos relacionamentos, amas com consistência e profundidade. O teu desafio é aceitar imperfeições—nos outros e em ti mesmo.', en: 'In relationships, you love with consistency and depth. Your challenge is accepting imperfections—in others and in yourself.' },
      inner: { pt: 'Na vida interior, você busca entender antes de sentir. Deus te convida a confiar mesmo quando não tem todas as respostas.', 'pt-pt': 'Na vida interior, buscas entender antes de sentir. Deus te convida a confiar mesmo quando não tens todas as respostas.', en: 'In your inner life, you seek to understand before feeling. God invites you to trust even when you don\'t have all the answers.' }
    },
    traps: {
      pt: ['Confundir perfeição com excelência', 'Deixar o medo de errar te paralisar', 'Isolar-se quando sente que falhou'],
      'pt-pt': ['Confundir perfeição com excelência', 'Deixar o medo de errar te paralisar', 'Isolar-se quando sentes que falhaste'],
      en: ['Confusing perfection with excellence', 'Letting fear of failure paralyze you', 'Isolating yourself when you feel you failed']
    },
    adjustments: {
      pt: ['Entregue algo "bom o suficiente" sem revisar 10 vezes', 'Peça feedback antes de terminar, não depois', 'Celebre progresso, não só resultado final'],
      'pt-pt': ['Entrega algo "bom o suficiente" sem revisar 10 vezes', 'Pede feedback antes de terminar, não depois', 'Celebra progresso, não só resultado final'],
      en: ['Deliver something "good enough" without reviewing 10 times', 'Ask for feedback before finishing, not after', 'Celebrate progress, not just final results']
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
    },
    selfExam: {
      pt: 'Seu padrão de excelência te aproxima ou afasta das pessoas?',
      'pt-pt': 'O teu padrão de excelência te aproxima ou afasta das pessoas?',
      en: 'Does your standard of excellence bring you closer to or farther from people?'
    }
  }
};

const DISC_COMBINATIONS: Record<string, Record<string, string>> = {
  DI: {
    pt: 'Energia rápida e comunicativa. Líder apaixonado que decide com o coração e implementa com força. Você inspira ação nos outros.',
    'pt-pt': 'Energia rápida e comunicativa. Líder apaixonado que decide com o coração e implementa com força. Inspiras ação nos outros.',
    en: 'Fast and communicative energy. Passionate leader who decides with the heart and implements with strength. You inspire action in others.'
  },
  DS: {
    pt: 'Determinação equilibrada com paciência. Líder que conquista resultados cuidando das pessoas. Força gentil que inspira confiança.',
    'pt-pt': 'Determinação equilibrada com paciência. Líder que conquista resultados cuidando das pessoas. Força gentil que inspira confiança.',
    en: 'Determination balanced with patience. Leader who achieves results while caring for people. Gentle strength that inspires trust.'
  },
  DC: {
    pt: 'Foco absoluto em excelência. Mente estratégica que busca resultados com precisão. Exigente consigo e com os outros, mas sempre entrega qualidade.',
    'pt-pt': 'Foco absoluto em excelência. Mente estratégica que busca resultados com precisão. Exigente consigo e com os outros, mas sempre entrega qualidade.',
    en: 'Absolute focus on excellence. Strategic mind seeking results with precision. Demanding of self and others, but always delivers quality.'
  },
  ID: {
    pt: 'Carismático e decidido. Une pessoas e lidera com energia expansiva. Você cria movimento e engaja equipes naturalmente.',
    'pt-pt': 'Carismático e decidido. Une pessoas e lidera com energia expansiva. Crias movimento e engajas equipas naturalmente.',
    en: 'Charismatic and decisive. Unites people and leads with expansive energy. You create movement and engage teams naturally.'
  },
  IS: {
    pt: 'Comunicador empático. Conecta pessoas com calor e profundidade. Construtor de relacionamentos duradouros e significativos.',
    'pt-pt': 'Comunicador empático. Conecta pessoas com calor e profundidade. Construtor de relacionamentos duradouros e significativos.',
    en: 'Empathetic communicator. Connects people with warmth and depth. Builder of lasting and meaningful relationships.'
  },
  IC: {
    pt: 'Criativo e analítico. Une entusiasmo com atenção aos detalhes. Você comunica ideias complexas de forma clara e inspiradora.',
    'pt-pt': 'Criativo e analítico. Une entusiasmo com atenção aos detalhes. Comunicas ideias complexas de forma clara e inspiradora.',
    en: 'Creative and analytical. Combines enthusiasm with attention to detail. You communicate complex ideas clearly and inspiringly.'
  },
  SD: {
    pt: 'Calma determinação. Lidera com paciência mas não abre mão de resultados. Força tranquila que move montanhas em silêncio.',
    'pt-pt': 'Calma determinação. Lidera com paciência mas não abre mão de resultados. Força tranquila que move montanhas em silêncio.',
    en: 'Calm determination. Leads with patience but doesn\'t give up results. Quiet strength that moves mountains in silence.'
  },
  SI: {
    pt: 'Acolhimento comunicativo. Cria ambientes seguros e conecta pessoas com gentileza. Mediador natural em conflitos.',
    'pt-pt': 'Acolhimento comunicativo. Cria ambientes seguros e conecta pessoas com gentileza. Mediador natural em conflitos.',
    en: 'Communicative welcoming. Creates safe environments and connects people with kindness. Natural mediator in conflicts.'
  },
  SC: {
    pt: 'Profundidade emocional e analítica. Calma, precisão e sensibilidade. Excelente em execução silenciosa e cuidadosa.',
    'pt-pt': 'Profundidade emocional e analítica. Calma, precisão e sensibilidade. Excelente em execução silenciosa e cuidadosa.',
    en: 'Emotional and analytical depth. Calm, precision, and sensitivity. Excellent in quiet and careful execution.'
  },
  CD: {
    pt: 'Estrategista exigente. Combina análise profunda com decisão rápida. Alto padrão em resultados, nunca aceita o medíocre.',
    'pt-pt': 'Estrategista exigente. Combina análise profunda com decisão rápida. Alto padrão em resultados, nunca aceita o medíocre.',
    en: 'Demanding strategist. Combines deep analysis with quick decision. High standards in results, never accepts mediocrity.'
  },
  CI: {
    pt: 'Analítico e expressivo. Une rigor com criatividade. Você comunica precisão com entusiasmo contagiante.',
    'pt-pt': 'Analítico e expressivo. Une rigor com criatividade. Comunicas precisão com entusiasmo contagiante.',
    en: 'Analytical and expressive. Combines rigor with creativity. You communicate precision with contagious enthusiasm.'
  },
  CS: {
    pt: 'Precisão acolhedora. Organizado, cuidadoso e empático. Você cria estruturas que servem pessoas, não o contrário.',
    'pt-pt': 'Precisão acolhedora. Organizado, cuidadoso e empático. Crias estruturas que servem pessoas, não o contrário.',
    en: 'Welcoming precision. Organized, careful, and empathetic. You create structures that serve people, not the other way around.'
  }
};

// ==================== INTERFACES ====================

interface DISCResults {
  scores: Record<string, number>;
  dominantProfile: string;
  profileData?: {
    name: string;
    emoji: string;
    description: string;
    traits: string[];
    growth: string;
  };
  // New fields from v2
  primaryProfile?: string;
  secondaryProfile?: string;
  compositeProfile?: string;
  tieStatus?: boolean;
  percentages?: Record<string, number>;
  algorithmVersion?: string;
}

interface DISCResultsSectionProps {
  discResults: DISCResults;
  lang: 'pt' | 'pt-pt' | 'en';
  userName?: string;
}

// ==================== TEXTS ====================

const TEXTS = {
  header: { pt: 'seu mapa DISC está pronto', 'pt-pt': 'o teu mapa DISC está pronto', en: 'your DISC map is ready' },
  tieNotice: { 
    pt: 'Seu perfil principal ficou empatado, então consideramos a combinação como leitura mais fiel.', 
    'pt-pt': 'O teu perfil principal ficou empatado, então consideramos a combinação como leitura mais fiel.', 
    en: 'Your main profile was tied, so we consider the combination as a more accurate reading.' 
  },
  distribution: { pt: 'Distribuição do Perfil', 'pt-pt': 'Distribuição do Perfil', en: 'Profile Distribution' },
  yourLight: { pt: 'Sua Luz', 'pt-pt': 'A Tua Luz', en: 'Your Light' },
  patterns: { pt: 'Padrões que aparecem em você', 'pt-pt': 'Padrões que aparecem em ti', en: 'Patterns that appear in you' },
  underPressure: { pt: 'Sob pressão, você tende a', 'pt-pt': 'Sob pressão, tendes a', en: 'Under pressure, you tend to' },
  atBest: { pt: 'Quando está no seu melhor', 'pt-pt': 'Quando estás no teu melhor', en: 'When at your best' },
  lifeImpact: { pt: 'Impacto nas áreas da vida', 'pt-pt': 'Impacto nas áreas da vida', en: 'Impact on life areas' },
  work: { pt: 'Trabalho e decisões', 'pt-pt': 'Trabalho e decisões', en: 'Work and decisions' },
  relationships: { pt: 'Relacionamentos e comunicação', 'pt-pt': 'Relacionamentos e comunicação', en: 'Relationships and communication' },
  inner: { pt: 'Vida interior e autocontrole', 'pt-pt': 'Vida interior e autocontrolo', en: 'Inner life and self-control' },
  traps: { pt: 'Armadilhas do perfil', 'pt-pt': 'Armadilhas do perfil', en: 'Profile traps' },
  adjustments: { pt: 'Ajustes práticos', 'pt-pt': 'Ajustes práticos', en: 'Practical adjustments' },
  sevenDayPlan: { pt: 'Plano de 7 dias', 'pt-pt': 'Plano de 7 dias', en: '7-day plan' },
  day: { pt: 'Dia', 'pt-pt': 'Dia', en: 'Day' },
  saveChecklist: { pt: 'Salvar como checklist', 'pt-pt': 'Guardar como checklist', en: 'Save as checklist' },
  selfExam: { pt: 'Pergunta de autoexame', 'pt-pt': 'Pergunta de autoexame', en: 'Self-examination question' },
  yourReflection: { pt: 'Sua reflexão (opcional)', 'pt-pt': 'A tua reflexão (opcional)', en: 'Your reflection (optional)' },
  disclaimer: { 
    pt: 'Preferências comportamentais, não diagnóstico. Seu contexto e sua maturidade mudam a forma como isso aparece.', 
    'pt-pt': 'Preferências comportamentais, não diagnóstico. O teu contexto e maturidade mudam a forma como isso aparece.', 
    en: 'Behavioral preferences, not a diagnosis. Your context and maturity change how this appears.' 
  },
  signature: { pt: 'NELLO ONE — uma jornada de autoconhecimento e verdade interior.', 'pt-pt': 'NELLO ONE — uma jornada de autoconhecimento e verdade interior.', en: 'NELLO ONE — a journey of self-knowledge and inner truth.' }
};

// ==================== COMPONENT ====================

export function DISCResultsSection({ discResults, lang, userName = 'Você' }: DISCResultsSectionProps) {
  const [reflection, setReflection] = useState('');
  const [showDistribution, setShowDistribution] = useState(false);
  
  // Parse result data to get v2 fields if available
  const parsedData = parseDISCResultData(discResults);
  
  const { scores } = discResults;
  const primary = parsedData.primary || discResults.dominantProfile;
  const secondary = parsedData.secondary;
  const composite = parsedData.compositeCode;
  const tieStatus = parsedData.tieStatus || false;
  
  // Calculate percentages
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const percentages = parsedData.percentages || Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, totalScore > 0 ? Math.round((v / totalScore) * 100) : 0])
  );
  
  const primaryProfile = DISC_PROFILES_RICH[primary as keyof typeof DISC_PROFILES_RICH];
  const compositeKey = composite || (secondary ? `${primary}${secondary}` : null);
  const compositeDescription = compositeKey && DISC_COMBINATIONS[compositeKey] ? DISC_COMBINATIONS[compositeKey][lang] : null;
  
  // Extract first name
  const firstName = userName.split(' ')[0];
  
  // Sorted profiles for distribution
  const sortedProfiles = Object.entries(scores).sort(([,a], [,b]) => b - a);

  return (
    <div className="space-y-6">
      {/* A) Header with first name */}
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-8 pt-10">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">{primaryProfile.emoji}</div>
            <CardTitle className="text-2xl md:text-3xl font-light">
              {firstName}, {TEXTS.header[lang]}
            </CardTitle>
            <Badge variant="outline" className="text-lg px-4 py-1 bg-background/50">
              {primaryProfile.name[lang]} {composite ? `(${composite})` : `(${primary})`}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-8">
          {/* Tie status notice */}
          {tieStatus && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {TEXTS.tieNotice[lang]}
              </p>
            </div>
          )}
          
          {/* B) Summary */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <p className="text-lg leading-relaxed text-center">
              {primaryProfile.description[lang]}
            </p>
            {compositeDescription && (
              <p className="text-base leading-relaxed text-center text-muted-foreground">
                {compositeDescription}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* C) Distribution with percentages */}
      <Card>
        <Collapsible open={showDistribution} onOpenChange={setShowDistribution}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {TEXTS.distribution[lang]}
                </CardTitle>
                <ChevronDown className={`h-5 w-5 transition-transform ${showDistribution ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {sortedProfiles.map(([profile, score], idx) => {
                const profileData = DISC_PROFILES_RICH[profile as keyof typeof DISC_PROFILES_RICH];
                const percentage = percentages[profile];
                const isPrimary = idx === 0;
                const isSecondary = idx === 1;
                
                return (
                  <div key={profile} className={`space-y-2 p-4 rounded-lg ${isPrimary ? 'bg-primary/10 border-2 border-primary' : isSecondary ? 'bg-muted/50 border border-border' : 'bg-muted/30'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{profileData.emoji}</span>
                        <div>
                          <h4 className={`font-medium ${isPrimary ? 'text-primary' : ''}`}>
                            {profile} — {profileData.name[lang]}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {profileData.shortDesc[lang]}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${isPrimary ? 'text-primary' : ''}`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    <Progress value={percentage} className={isPrimary ? "h-3" : "h-2"} />
                  </div>
                );
              })}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* D) Your Light */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Sparkles className="h-5 w-5" />
            {TEXTS.yourLight[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg italic text-amber-900 dark:text-amber-100 text-center">
            "{primaryProfile.light[lang]}"
          </p>
        </CardContent>
      </Card>

      {/* E) Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {TEXTS.patterns[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {primaryProfile.patterns[lang].map((pattern, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* F) Under Pressure & At Best */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-2 border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <Zap className="h-5 w-5" />
              {TEXTS.underPressure[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {primaryProfile.underPressure[lang].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-rose-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Star className="h-5 w-5" />
              {TEXTS.atBest[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {primaryProfile.atBest[lang].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* G) Life Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {TEXTS.lifeImpact[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-blue-800 dark:text-blue-300">{TEXTS.work[lang]}</h4>
              </div>
              <p className="text-sm text-blue-900 dark:text-blue-100">{primaryProfile.lifeImpact.work[lang]}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                <h4 className="font-medium text-pink-800 dark:text-pink-300">{TEXTS.relationships[lang]}</h4>
              </div>
              <p className="text-sm text-pink-900 dark:text-pink-100">{primaryProfile.lifeImpact.relationships[lang]}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h4 className="font-medium text-violet-800 dark:text-violet-300">{TEXTS.inner[lang]}</h4>
              </div>
              <p className="text-sm text-violet-900 dark:text-violet-100">{primaryProfile.lifeImpact.inner[lang]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* H) Traps & Adjustments */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              {TEXTS.traps[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {primaryProfile.traps[lang].map((trap, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300 text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{trap}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <Lightbulb className="h-5 w-5" />
              {TEXTS.adjustments[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {primaryProfile.adjustments[lang].map((adj, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-teal-200 dark:bg-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 text-xs font-medium flex-shrink-0">
                    ✓
                  </span>
                  <span>{adj}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* I) 7-Day Plan */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {TEXTS.sevenDayPlan[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {primaryProfile.sevenDayPlan[lang].map((task, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                  {TEXTS.day[lang]} {index + 1}
                </div>
                <span className="flex-1">{task}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-2">
            <Button variant="outline" size="sm" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              {TEXTS.saveChecklist[lang]}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* J) Self-Exam Question */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {TEXTS.selfExam[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg italic text-center">
            "{primaryProfile.selfExam[lang]}"
          </p>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{TEXTS.yourReflection[lang]}</label>
            <Textarea 
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* K) Disclaimer */}
      <div className="text-center space-y-4 py-6">
        <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
          {TEXTS.disclaimer[lang]}
        </p>
        <p className="text-base font-light italic text-muted-foreground">
          {TEXTS.signature[lang]}
        </p>
      </div>
    </div>
  );
}
