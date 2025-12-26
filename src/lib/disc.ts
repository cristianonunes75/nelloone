// DISC Test Logic - Behavioral Profile Assessment
// Algorithm Version: disc_v2_2025_12_26

export const DISC_ALGORITHM_VERSION = "disc_v2_2025_12_26";

// Fixed order for deterministic tie-breaking
const DISC_ORDER = ['D', 'I', 'S', 'C'] as const;

export interface DISCScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface DISCProfileResult {
  primary: string;
  secondary: string;
  tieStatus: boolean;
  compositeCode: string;
  percentages: DISCScores;
  scores: DISCScores;
}

export const DISC_PROFILES = {
  D: {
    name: { pt: 'Dominância', 'pt-pt': 'Dominância', en: 'Dominance' },
    emoji: '🎯',
    shortDescription: {
      pt: 'Foco em resultado, decisão rápida, enfrentamento de desafios',
      'pt-pt': 'Foco no resultado, decisão rápida, enfrentamento de desafios',
      en: 'Result-focused, quick decisions, facing challenges'
    },
    description: {
      pt: 'Você é movido por ação e resultado. Sua energia é direta, firme, objetiva. Você pensa rápido, decide rápido e se frustra com lentidão.',
      'pt-pt': 'És movido pela ação e pelo resultado. A tua energia é direta, firme, objetiva. Pensas rápido, decides rápido e frustras-te com lentidão.',
      en: 'You are driven by action and results. Your energy is direct, firm, and objective. You think fast, decide fast, and get frustrated with slowness.'
    },
    traits: { 
      pt: ['Direto', 'Decisivo', 'Orientado a resultados', 'Desafiador'],
      'pt-pt': ['Direto', 'Decisivo', 'Orientado a resultados', 'Desafiador'],
      en: ['Direct', 'Decisive', 'Results-oriented', 'Challenging']
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
    underPressure: {
      pt: ['Tende a ser mais impositivo e menos paciente', 'Pode ignorar sentimentos alheios em nome do resultado', 'Assume riscos maiores do que deveria', 'Força o ritmo e se isola quando contrariado'],
      'pt-pt': ['Tende a ser mais impositivo e menos paciente', 'Pode ignorar sentimentos alheios em nome do resultado', 'Assume riscos maiores do que deveria', 'Força o ritmo e isola-se quando contrariado'],
      en: ['Tends to be more imposing and less patient', 'May ignore others\' feelings for results', 'Takes greater risks than should', 'Forces the pace and isolates when opposed']
    },
    atBest: {
      pt: ['Lidera com visão clara e energia contagiante', 'Toma decisões corajosas com responsabilidade', 'Abre caminho para outros seguirem', 'Transforma desafios em oportunidades reais'],
      'pt-pt': ['Lidera com visão clara e energia contagiante', 'Toma decisões corajosas com responsabilidade', 'Abre caminho para outros seguirem', 'Transforma desafios em oportunidades reais'],
      en: ['Leads with clear vision and contagious energy', 'Makes courageous decisions responsibly', 'Paves the way for others to follow', 'Transforms challenges into real opportunities']
    },
    patterns: {
      pt: ['Resolve problemas indo direto ao ponto', 'Reage a críticas defendendo sua posição', 'Busca aprovação através de resultados tangíveis', 'Se ativa com desafios e metas claras'],
      'pt-pt': ['Resolve problemas indo direto ao ponto', 'Reage a críticas defendendo a sua posição', 'Busca aprovação através de resultados tangíveis', 'Ativa-se com desafios e metas claras'],
      en: ['Solves problems going straight to the point', 'Reacts to criticism by defending position', 'Seeks approval through tangible results', 'Gets activated by challenges and clear goals']
    },
    traps: {
      pt: ['Confundir produtividade com propósito', 'Usar dureza como escudo emocional', 'Ignorar sinais de exaustão própria e alheia'],
      'pt-pt': ['Confundir produtividade com propósito', 'Usar dureza como escudo emocional', 'Ignorar sinais de exaustão própria e alheia'],
      en: ['Confusing productivity with purpose', 'Using harshness as emotional shield', 'Ignoring exhaustion signs in self and others']
    },
    adjustments: {
      pt: ['Praticar 3 segundos de pausa antes de responder', 'Perguntar "como você está?" antes de cobrar resultado', 'Celebrar pequenas vitórias dos outros'],
      'pt-pt': ['Praticar 3 segundos de pausa antes de responder', 'Perguntar "como estás?" antes de cobrar resultado', 'Celebrar pequenas vitórias dos outros'],
      en: ['Practice 3-second pause before responding', 'Ask "how are you?" before demanding results', 'Celebrate others\' small victories']
    },
    lifeImpact: {
      work: {
        pt: 'No trabalho, você é motor de execução. Seu risco é atropelar processos e pessoas. Seu crescimento está em liderar com firmeza e escuta.',
        'pt-pt': 'No trabalho, és motor de execução. O teu risco é atropelar processos e pessoas. O teu crescimento está em liderar com firmeza e escuta.',
        en: 'At work, you are an execution engine. Your risk is running over processes and people. Your growth is in leading with firmness and listening.'
      },
      relationships: {
        pt: 'Nos relacionamentos, você oferece proteção e direção. Seu risco é parecer controlador. Seu crescimento está em ouvir antes de resolver.',
        'pt-pt': 'Nos relacionamentos, ofereces proteção e direção. O teu risco é parecer controlador. O teu crescimento está em ouvir antes de resolver.',
        en: 'In relationships, you offer protection and direction. Your risk is seeming controlling. Your growth is in listening before solving.'
      },
      innerLife: {
        pt: 'Na vida interior, você busca conquistas. Seu risco é medir valor próprio só por entregas. Seu crescimento está em descansar sem culpa.',
        'pt-pt': 'Na vida interior, buscas conquistas. O teu risco é medir valor próprio só por entregas. O teu crescimento está em descansar sem culpa.',
        en: 'In inner life, you seek achievements. Your risk is measuring self-worth only by deliveries. Your growth is in resting without guilt.'
      }
    },
    selfExamQuestion: {
      pt: 'Você está liderando para servir ou para provar algo a si mesmo?',
      'pt-pt': 'Estás a liderar para servir ou para provar algo a ti mesmo?',
      en: 'Are you leading to serve or to prove something to yourself?'
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
    },
    growth: { 
      pt: 'Equilibrar firmeza com empatia e escuta',
      'pt-pt': 'Equilibrar firmeza com empatia e escuta',
      en: 'Balance firmness with empathy and listening'
    }
  },
  I: {
    name: { pt: 'Influência', 'pt-pt': 'Influência', en: 'Influence' },
    emoji: '✨',
    shortDescription: {
      pt: 'Comunicação, persuasão, energia social',
      'pt-pt': 'Comunicação, persuasão, energia social',
      en: 'Communication, persuasion, social energy'
    },
    description: {
      pt: 'Você é movido por conexão e entusiasmo. Sua energia é leve, expansiva e comunicativa. Você inspira, anima e aproxima pessoas.',
      'pt-pt': 'És movido pela conexão e entusiasmo. A tua energia é leve, expansiva e comunicativa. Tu inspiras, animas e aproximas pessoas.',
      en: 'You are driven by connection and enthusiasm. Your energy is light, expansive, and communicative. You inspire, encourage, and bring people together.'
    },
    traits: {
      pt: ['Comunicativo', 'Entusiasta', 'Inspirador', 'Carismático'],
      'pt-pt': ['Comunicativo', 'Entusiasta', 'Inspirador', 'Carismático'],
      en: ['Communicative', 'Enthusiastic', 'Inspiring', 'Charismatic']
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
    underPressure: {
      pt: ['Fala demais e ouve de menos', 'Busca aprovação de forma excessiva', 'Evita conversas difíceis ou confrontos', 'Perde foco e se dispersa em múltiplas frentes'],
      'pt-pt': ['Fala demais e ouve de menos', 'Busca aprovação de forma excessiva', 'Evita conversas difíceis ou confrontos', 'Perde foco e dispersa-se em múltiplas frentes'],
      en: ['Talks too much and listens too little', 'Seeks approval excessively', 'Avoids difficult conversations or confrontations', 'Loses focus and scatters across multiple fronts']
    },
    atBest: {
      pt: ['Inspira e mobiliza pessoas com autenticidade', 'Cria conexões genuínas e duradouras', 'Transmite esperança mesmo em cenários difíceis', 'Facilita acordos e aproxima diferenças'],
      'pt-pt': ['Inspira e mobiliza pessoas com autenticidade', 'Cria conexões genuínas e duradouras', 'Transmite esperança mesmo em cenários difíceis', 'Facilita acordos e aproxima diferenças'],
      en: ['Inspires and mobilizes people authentically', 'Creates genuine and lasting connections', 'Transmits hope even in difficult scenarios', 'Facilitates agreements and bridges differences']
    },
    patterns: {
      pt: ['Resolve problemas conversando e envolvendo outros', 'Reage a críticas sentindo-se pessoalmente rejeitado', 'Busca aprovação através de reconhecimento público', 'Se ativa com novidades e interação social'],
      'pt-pt': ['Resolve problemas conversando e envolvendo outros', 'Reage a críticas sentindo-se pessoalmente rejeitado', 'Busca aprovação através de reconhecimento público', 'Ativa-se com novidades e interação social'],
      en: ['Solves problems by talking and involving others', 'Reacts to criticism feeling personally rejected', 'Seeks approval through public recognition', 'Gets activated by novelty and social interaction']
    },
    traps: {
      pt: ['Confundir popularidade com propósito', 'Evitar verdades duras para manter harmonia', 'Deixar promessas no ar por querer agradar'],
      'pt-pt': ['Confundir popularidade com propósito', 'Evitar verdades duras para manter harmonia', 'Deixar promessas no ar por querer agradar'],
      en: ['Confusing popularity with purpose', 'Avoiding hard truths to keep harmony', 'Leaving promises hanging to please others']
    },
    adjustments: {
      pt: ['Terminar uma tarefa antes de começar outra', 'Praticar silêncio intencional por 10 minutos', 'Dizer "não" com gentileza quando necessário'],
      'pt-pt': ['Terminar uma tarefa antes de começar outra', 'Praticar silêncio intencional por 10 minutos', 'Dizer "não" com gentileza quando necessário'],
      en: ['Finish one task before starting another', 'Practice intentional silence for 10 minutes', 'Say "no" kindly when necessary']
    },
    lifeImpact: {
      work: {
        pt: 'No trabalho, você é conector e motivador. Seu risco é prometer mais do que entregar. Seu crescimento está em transformar entusiasmo em consistência.',
        'pt-pt': 'No trabalho, és conector e motivador. O teu risco é prometer mais do que entregar. O teu crescimento está em transformar entusiasmo em consistência.',
        en: 'At work, you are a connector and motivator. Your risk is promising more than delivering. Your growth is in transforming enthusiasm into consistency.'
      },
      relationships: {
        pt: 'Nos relacionamentos, você traz leveza e energia. Seu risco é evitar profundidade. Seu crescimento está em sustentar conversas difíceis.',
        'pt-pt': 'Nos relacionamentos, trazes leveza e energia. O teu risco é evitar profundidade. O teu crescimento está em sustentar conversas difíceis.',
        en: 'In relationships, you bring lightness and energy. Your risk is avoiding depth. Your growth is in sustaining difficult conversations.'
      },
      innerLife: {
        pt: 'Na vida interior, você busca reconhecimento. Seu risco é depender de validação externa. Seu crescimento está em valorizar sua voz interior.',
        'pt-pt': 'Na vida interior, buscas reconhecimento. O teu risco é depender de validação externa. O teu crescimento está em valorizar a tua voz interior.',
        en: 'In inner life, you seek recognition. Your risk is depending on external validation. Your growth is in valuing your inner voice.'
      }
    },
    selfExamQuestion: {
      pt: 'Você está se conectando para servir ou para ser visto?',
      'pt-pt': 'Estás a conectar-te para servir ou para seres visto?',
      en: 'Are you connecting to serve or to be seen?'
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
    },
    growth: {
      pt: 'Cultivar foco e consistência',
      'pt-pt': 'Cultivar foco e consistência',
      en: 'Cultivate focus and consistency'
    }
  },
  S: {
    name: { pt: 'Estabilidade', 'pt-pt': 'Estabilidade', en: 'Steadiness' },
    emoji: '🤝',
    shortDescription: {
      pt: 'Consistência, lealdade, ritmo constante',
      'pt-pt': 'Consistência, lealdade, ritmo constante',
      en: 'Consistency, loyalty, steady rhythm'
    },
    description: {
      pt: 'Você é movido por segurança, cuidado e calma. Sua energia é acolhedora, constante e confiável. Você traz paz onde há turbulência.',
      'pt-pt': 'És movido pela segurança, cuidado e calma. A tua energia é acolhedora, constante e confiável. Tu trazes paz onde há turbulência.',
      en: 'You are driven by security, care, and calm. Your energy is welcoming, constant, and reliable. You bring peace where there is turbulence.'
    },
    traits: {
      pt: ['Paciente', 'Leal', 'Confiável', 'Harmonioso'],
      'pt-pt': ['Paciente', 'Leal', 'Confiável', 'Harmonioso'],
      en: ['Patient', 'Loyal', 'Reliable', 'Harmonious']
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
    underPressure: {
      pt: ['Paralisa diante de decisões urgentes', 'Cede para evitar conflito mesmo discordando', 'Carrega peso emocional que não é seu', 'Resiste passivamente a mudanças necessárias'],
      'pt-pt': ['Paralisa diante de decisões urgentes', 'Cede para evitar conflito mesmo discordando', 'Carrega peso emocional que não é seu', 'Resiste passivamente a mudanças necessárias'],
      en: ['Freezes in front of urgent decisions', 'Yields to avoid conflict even when disagreeing', 'Carries emotional weight that isn\'t yours', 'Passively resists necessary changes']
    },
    atBest: {
      pt: ['Sustenta ambientes com serenidade genuína', 'Oferece apoio consistente sem esperar retorno', 'Medeia conflitos com sabedoria e calma', 'Constrói confiança profunda ao longo do tempo'],
      'pt-pt': ['Sustenta ambientes com serenidade genuína', 'Oferece apoio consistente sem esperar retorno', 'Medeia conflitos com sabedoria e calma', 'Constrói confiança profunda ao longo do tempo'],
      en: ['Sustains environments with genuine serenity', 'Offers consistent support without expecting return', 'Mediates conflicts with wisdom and calm', 'Builds deep trust over time']
    },
    patterns: {
      pt: ['Resolve problemas buscando consenso e tempo', 'Reage a críticas internalizando e ruminando', 'Busca aprovação sendo útil e disponível', 'Se ativa com rotina e previsibilidade'],
      'pt-pt': ['Resolve problemas buscando consenso e tempo', 'Reage a críticas internalizando e ruminando', 'Busca aprovação sendo útil e disponível', 'Ativa-se com rotina e previsibilidade'],
      en: ['Solves problems seeking consensus and time', 'Reacts to criticism by internalizing and ruminating', 'Seeks approval by being useful and available', 'Gets activated by routine and predictability']
    },
    traps: {
      pt: ['Confundir serviço com autoanulação', 'Evitar mudanças necessárias por medo', 'Acumular ressentimento calado'],
      'pt-pt': ['Confundir serviço com autoanulação', 'Evitar mudanças necessárias por medo', 'Acumular ressentimento calado'],
      en: ['Confusing service with self-annulment', 'Avoiding necessary changes out of fear', 'Accumulating silent resentment']
    },
    adjustments: {
      pt: ['Expressar discordância gentilmente uma vez por dia', 'Tomar uma pequena decisão sem consultar ninguém', 'Pedir algo que você precisa diretamente'],
      'pt-pt': ['Expressar discordância gentilmente uma vez por dia', 'Tomar uma pequena decisão sem consultar ninguém', 'Pedir algo que precisas diretamente'],
      en: ['Express disagreement gently once a day', 'Make a small decision without consulting anyone', 'Ask for something you need directly']
    },
    lifeImpact: {
      work: {
        pt: 'No trabalho, você é base de confiança. Seu risco é se sobrecarregar em silêncio. Seu crescimento está em pedir ajuda e dizer não.',
        'pt-pt': 'No trabalho, és base de confiança. O teu risco é sobrecarregares-te em silêncio. O teu crescimento está em pedir ajuda e dizer não.',
        en: 'At work, you are a foundation of trust. Your risk is overloading yourself in silence. Your growth is in asking for help and saying no.'
      },
      relationships: {
        pt: 'Nos relacionamentos, você oferece segurança. Seu risco é anular suas necessidades. Seu crescimento está em pedir cuidado também.',
        'pt-pt': 'Nos relacionamentos, ofereces segurança. O teu risco é anular as tuas necessidades. O teu crescimento está em pedir cuidado também.',
        en: 'In relationships, you offer security. Your risk is nullifying your needs. Your growth is in asking for care too.'
      },
      innerLife: {
        pt: 'Na vida interior, você busca paz. Seu risco é evitar confrontos necessários consigo mesmo. Seu crescimento está em abraçar desconforto temporário.',
        'pt-pt': 'Na vida interior, buscas paz. O teu risco é evitar confrontos necessários contigo mesmo. O teu crescimento está em abraçar desconforto temporário.',
        en: 'In inner life, you seek peace. Your risk is avoiding necessary confrontations with yourself. Your growth is in embracing temporary discomfort.'
      }
    },
    selfExamQuestion: {
      pt: 'Você está servindo por amor ou para evitar conflito?',
      'pt-pt': 'Estás a servir por amor ou para evitar conflito?',
      en: 'Are you serving out of love or to avoid conflict?'
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
    },
    growth: {
      pt: 'Agir com mais iniciativa',
      'pt-pt': 'Agir com mais iniciativa',
      en: 'Act with more initiative'
    }
  },
  C: {
    name: { pt: 'Conformidade', 'pt-pt': 'Conformidade', en: 'Conscientiousness' },
    emoji: '📊',
    shortDescription: {
      pt: 'Critério, qualidade, análise, precisão',
      'pt-pt': 'Critério, qualidade, análise, precisão',
      en: 'Criteria, quality, analysis, precision'
    },
    description: {
      pt: 'Você é movido por precisão, lógica e clareza. Sua energia é analítica, cuidadosa e estruturada. Você honra a excelência em tudo que faz.',
      'pt-pt': 'És movido pela precisão, lógica e clareza. A tua energia é analítica, cuidadosa e estruturada. Tu honras a excelência em tudo o que fazes.',
      en: 'You are driven by precision, logic, and clarity. Your energy is analytical, careful, and structured. You honor excellence in everything you do.'
    },
    traits: {
      pt: ['Analítico', 'Organizado', 'Preciso', 'Detalhista'],
      'pt-pt': ['Analítico', 'Organizado', 'Preciso', 'Detalhista'],
      en: ['Analytical', 'Organized', 'Precise', 'Detail-oriented']
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
    underPressure: {
      pt: ['Paralisa por excesso de análise', 'Se fecha emocionalmente e fica crítico', 'Aumenta exigência consigo e com outros', 'Demora demais para agir por medo de errar'],
      'pt-pt': ['Paralisa por excesso de análise', 'Fecha-se emocionalmente e fica crítico', 'Aumenta exigência consigo e com outros', 'Demora demais para agir por medo de errar'],
      en: ['Freezes from over-analysis', 'Closes emotionally and becomes critical', 'Increases demands on self and others', 'Takes too long to act for fear of error']
    },
    atBest: {
      pt: ['Entrega trabalho de altíssima qualidade', 'Antecipa problemas antes que aconteçam', 'Constrói sistemas sólidos e duráveis', 'Traz clareza onde há confusão'],
      'pt-pt': ['Entrega trabalho de altíssima qualidade', 'Antecipa problemas antes que aconteçam', 'Constrói sistemas sólidos e duráveis', 'Traz clareza onde há confusão'],
      en: ['Delivers highest quality work', 'Anticipates problems before they happen', 'Builds solid and durable systems', 'Brings clarity where there is confusion']
    },
    patterns: {
      pt: ['Resolve problemas analisando todas as variáveis', 'Reage a críticas revisando obsessivamente', 'Busca aprovação através de perfeição', 'Se ativa com estrutura e regras claras'],
      'pt-pt': ['Resolve problemas analisando todas as variáveis', 'Reage a críticas revisando obsessivamente', 'Busca aprovação através de perfeição', 'Ativa-se com estrutura e regras claras'],
      en: ['Solves problems analyzing all variables', 'Reacts to criticism by revising obsessively', 'Seeks approval through perfection', 'Gets activated by structure and clear rules']
    },
    traps: {
      pt: ['Confundir perfeição com excelência', 'Adiar decisões por medo de errar', 'Medir valor próprio só por desempenho'],
      'pt-pt': ['Confundir perfeição com excelência', 'Adiar decisões por medo de errar', 'Medir valor próprio só por desempenho'],
      en: ['Confusing perfection with excellence', 'Postponing decisions for fear of error', 'Measuring self-worth only by performance']
    },
    adjustments: {
      pt: ['Entregar algo "bom o suficiente" uma vez por semana', 'Rir de um pequeno erro', 'Aceitar um elogio sem relativizar'],
      'pt-pt': ['Entregar algo "bom o suficiente" uma vez por semana', 'Rir de um pequeno erro', 'Aceitar um elogio sem relativizar'],
      en: ['Deliver something "good enough" once a week', 'Laugh at a small mistake', 'Accept a compliment without qualifying']
    },
    lifeImpact: {
      work: {
        pt: 'No trabalho, você é garantia de qualidade. Seu risco é travar por perfeccionismo. Seu crescimento está em entregar bom o suficiente.',
        'pt-pt': 'No trabalho, és garantia de qualidade. O teu risco é travar por perfeccionismo. O teu crescimento está em entregar bom o suficiente.',
        en: 'At work, you are a quality guarantee. Your risk is getting stuck by perfectionism. Your growth is in delivering good enough.'
      },
      relationships: {
        pt: 'Nos relacionamentos, você oferece confiabilidade. Seu risco é parecer frio ou distante. Seu crescimento está em expressar afeto imperfeito.',
        'pt-pt': 'Nos relacionamentos, ofereces confiabilidade. O teu risco é parecer frio ou distante. O teu crescimento está em expressar afeto imperfeito.',
        en: 'In relationships, you offer reliability. Your risk is seeming cold or distant. Your growth is in expressing imperfect affection.'
      },
      innerLife: {
        pt: 'Na vida interior, você busca clareza. Seu risco é se criticar sem piedade. Seu crescimento está em acolher sua própria imperfeição.',
        'pt-pt': 'Na vida interior, buscas clareza. O teu risco é criticares-te sem piedade. O teu crescimento está em acolher a tua própria imperfeição.',
        en: 'In inner life, you seek clarity. Your risk is criticizing yourself mercilessly. Your growth is in embracing your own imperfection.'
      }
    },
    selfExamQuestion: {
      pt: 'Você está buscando excelência ou fugindo do erro?',
      'pt-pt': 'Estás a buscar excelência ou a fugir do erro?',
      en: 'Are you seeking excellence or fleeing from error?'
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
    },
    growth: {
      pt: 'Permitir flexibilidade e confiar no processo',
      'pt-pt': 'Permitir flexibilidade e confiar no processo',
      en: 'Allow flexibility and trust the process'
    }
  }
};

export const DISC_COMBINATIONS: Record<string, Record<string, string>> = {
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

interface TestAnswer {
  answer: {
    value: string;
  };
}

/**
 * Calculate raw DISC scores from answers
 */
export function calculateDISCScores(answers: TestAnswer[]): DISCScores {
  const scores: DISCScores = { D: 0, I: 0, S: 0, C: 0 };

  answers.forEach((answer) => {
    const value = answer.answer?.value as keyof DISCScores;
    if (value && value in scores) {
      scores[value]++;
    }
  });

  return scores;
}

/**
 * Calculate percentages from raw scores
 */
export function calculatePercentages(scores: DISCScores): DISCScores {
  const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
  
  if (total === 0) {
    return { D: 0, I: 0, S: 0, C: 0 };
  }

  return {
    D: Math.round((scores.D / total) * 100 * 100) / 100,
    I: Math.round((scores.I / total) * 100 * 100) / 100,
    S: Math.round((scores.S / total) * 100 * 100) / 100,
    C: Math.round((scores.C / total) * 100 * 100) / 100
  };
}

/**
 * Get primary and secondary profiles with tie handling
 * Uses fixed order D, I, S, C for deterministic tie-breaking
 */
export function getPrimarySecondaryProfiles(scores: DISCScores): {
  primary: string;
  secondary: string;
  tieStatus: boolean;
  compositeCode: string;
} {
  // Sort profiles by score descending, then by fixed order for ties
  const sortedProfiles = DISC_ORDER
    .map(profile => ({ profile, score: scores[profile] }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Same score: use fixed order (D, I, S, C)
      return DISC_ORDER.indexOf(a.profile as typeof DISC_ORDER[number]) - 
             DISC_ORDER.indexOf(b.profile as typeof DISC_ORDER[number]);
    });

  const topScore = sortedProfiles[0].score;
  const secondScore = sortedProfiles[1].score;
  
  // Check for ties at the top
  const topTiedProfiles = sortedProfiles.filter(p => p.score === topScore);
  const tieStatus = topTiedProfiles.length > 1;

  const primary = sortedProfiles[0].profile;
  const secondary = sortedProfiles[1].profile;
  const compositeCode = `${primary}${secondary}`;

  return {
    primary,
    secondary,
    tieStatus,
    compositeCode
  };
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getPrimarySecondaryProfiles instead
 */
export function getDominantProfile(scores: DISCScores): string {
  return getPrimarySecondaryProfiles(scores).primary;
}

/**
 * Get complete DISC results with all new fields
 */
export function getDISCResults(answers: TestAnswer[]): DISCProfileResult & {
  dominantProfile: string; // Legacy compatibility
  profileData: typeof DISC_PROFILES.D;
  secondaryProfileData: typeof DISC_PROFILES.D;
  allProfiles: typeof DISC_PROFILES;
  algorithmVersion: string;
} {
  const scores = calculateDISCScores(answers);
  const percentages = calculatePercentages(scores);
  const { primary, secondary, tieStatus, compositeCode } = getPrimarySecondaryProfiles(scores);
  
  const profileData = DISC_PROFILES[primary as keyof typeof DISC_PROFILES];
  const secondaryProfileData = DISC_PROFILES[secondary as keyof typeof DISC_PROFILES];

  return {
    scores,
    percentages,
    primary,
    secondary,
    dominantProfile: primary, // Legacy compatibility
    tieStatus,
    compositeCode,
    profileData,
    secondaryProfileData,
    allProfiles: DISC_PROFILES,
    algorithmVersion: DISC_ALGORITHM_VERSION
  };
}

/**
 * Build result_data object for saving to database
 * Maintains backward compatibility with old format
 */
export function buildDISCResultData(answers: TestAnswer[], totalQuestions: number = 28) {
  const results = getDISCResults(answers);
  
  return {
    testType: 'disc',
    completed_at: new Date().toISOString(),
    total_questions: totalQuestions,
    // New fields (v2)
    scores: results.scores,
    percentages: results.percentages,
    primaryProfile: results.primary,
    secondaryProfile: results.secondary,
    compositeProfile: results.compositeCode,
    tieStatus: results.tieStatus,
    algorithmVersion: results.algorithmVersion,
    // Legacy fields for backward compatibility
    dominantProfile: results.primary,
    profileData: {
      name: results.profileData.name.pt,
      emoji: results.profileData.emoji,
      description: results.profileData.description.pt,
      traits: results.profileData.traits.pt,
      growth: results.profileData.growth.pt
    }
  };
}

/**
 * Parse result_data from database, handling both old and new formats
 */
export function parseDISCResultData(resultData: any, lang: 'pt' | 'pt-pt' | 'en' = 'pt'): DISCProfileResult & {
  profileData: typeof DISC_PROFILES.D;
  secondaryProfileData: typeof DISC_PROFILES.D;
  algorithmVersion: string;
} {
  // Handle new format (v2)
  if (resultData.algorithmVersion && resultData.primaryProfile) {
    const primary = resultData.primaryProfile as keyof typeof DISC_PROFILES;
    const secondary = resultData.secondaryProfile as keyof typeof DISC_PROFILES;
    
    return {
      scores: resultData.scores,
      percentages: resultData.percentages || calculatePercentages(resultData.scores),
      primary: resultData.primaryProfile,
      secondary: resultData.secondaryProfile,
      tieStatus: resultData.tieStatus || false,
      compositeCode: resultData.compositeProfile || `${primary}${secondary}`,
      profileData: DISC_PROFILES[primary],
      secondaryProfileData: DISC_PROFILES[secondary],
      algorithmVersion: resultData.algorithmVersion
    };
  }
  
  // Handle legacy format (v1)
  const scores: DISCScores = resultData.scores || { D: 0, I: 0, S: 0, C: 0 };
  const { primary, secondary, tieStatus, compositeCode } = getPrimarySecondaryProfiles(scores);
  
  return {
    scores,
    percentages: calculatePercentages(scores),
    primary: resultData.dominantProfile || primary,
    secondary,
    tieStatus,
    compositeCode,
    profileData: DISC_PROFILES[(resultData.dominantProfile || primary) as keyof typeof DISC_PROFILES],
    secondaryProfileData: DISC_PROFILES[secondary as keyof typeof DISC_PROFILES],
    algorithmVersion: 'disc_v1_legacy'
  };
}
