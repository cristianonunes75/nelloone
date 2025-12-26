import jsPDF from 'jspdf';

interface DISCScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

interface DISCPDFData {
  userName: string;
  scores: DISCScores;
  dominantProfile: string;
  language: 'pt' | 'pt-pt' | 'en';
}

const DISC_PROFILES = {
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

const DISC_COMBINATIONS = {
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

const TEXTS = {
  cover: {
    title: { pt: 'DISC – Dinâmicas Comportamentais', 'pt-pt': 'DISC – Dinâmicas Comportamentais', en: 'DISC – Behavioral Dynamics' },
    subtitle: { 
      pt: 'Como sua energia se movimenta nas decisões, emoções e interações', 
      'pt-pt': 'Como a tua energia se movimenta nas decisões, emoções e interações', 
      en: 'How your energy moves in decisions, emotions and interactions' 
    },
    signature: { pt: 'Por Nello AI, seu guia no Nello One', 'pt-pt': 'Por Nello AI, o teu guia no Nello One', en: 'By Nello AI, your guide at Nello One' },
    quote: {
      pt: '"Seu comportamento é uma linguagem. Quando você entende essa linguagem, você entende a si mesmo."',
      'pt-pt': '"O teu comportamento é uma linguagem. Quando entendes essa linguagem, entendes-te a ti mesmo."',
      en: '"Your behavior is a language. When you understand this language, you understand yourself."'
    }
  },
  intro: {
    title: { pt: 'Introdução ao Teste DISC', 'pt-pt': 'Introdução ao Teste DISC', en: 'Introduction to the DISC Test' },
    content: {
      pt: `O DISC revela como sua energia se expressa no cotidiano.
Ele mostra sua forma natural de agir, se relacionar, resolver problemas, reagir à pressão e se posicionar no mundo.

O DISC não determina quem você "é".
Ele revela como sua energia se movimenta quando está:
• confiante
• inseguro
• confortável
• pressionado
• inspirado`,
      'pt-pt': `O DISC revela como a tua energia se expressa no quotidiano.
Mostra a tua forma natural de agir, relacionar-te, resolver problemas, reagir à pressão e posicionar-te no mundo.

O DISC não determina quem tu "és".
Ele revela como a tua energia se movimenta quando estás:
• confiante
• inseguro
• confortável
• pressionado
• inspirado`,
      en: `DISC reveals how your energy expresses itself in everyday life.
It shows your natural way of acting, relating, solving problems, reacting to pressure, and positioning yourself in the world.

DISC doesn't determine who you "are."
It reveals how your energy moves when you are:
• confident
• insecure
• comfortable
• pressured
• inspired`
    }
  },
  sections: {
    dominantProfile: { pt: 'Seu Perfil DISC Dominante', 'pt-pt': 'O Teu Perfil DISC Dominante', en: 'Your Dominant DISC Profile' },
    whatItMeans: { pt: 'O que isso significa', 'pt-pt': 'O que isso significa', en: 'What this means' },
    naturalStrengths: { pt: 'Forças Naturais', 'pt-pt': 'Forças Naturais', en: 'Natural Strengths' },
    vulnerabilities: { pt: 'Fragilidades Naturais', 'pt-pt': 'Fragilidades Naturais', en: 'Natural Vulnerabilities' },
    yourLight: { pt: 'Sua Luz', 'pt-pt': 'A Tua Luz', en: 'Your Light' },
    secondaryTraits: { pt: 'Seus Traços Secundários', 'pt-pt': 'Os Teus Traços Secundários', en: 'Your Secondary Traits' },
    combination: { pt: 'Combinação', 'pt-pt': 'Combinação', en: 'Combination' },
    visualMap: { pt: 'Mapa Visual DISC', 'pt-pt': 'Mapa Visual DISC', en: 'Visual DISC Map' },
    nelloPatterns: { pt: 'Nello AI Revela Seus Padrões', 'pt-pt': 'Nello AI Revela os Teus Padrões', en: 'Nello AI Reveals Your Patterns' },
    lifeDimensions: { pt: 'Impacto nas Três Dimensões da Vida', 'pt-pt': 'Impacto nas Três Dimensões da Vida', en: 'Impact on the Three Dimensions of Life' },
    work: { pt: 'Trabalho', 'pt-pt': 'Trabalho', en: 'Work' },
    relationships: { pt: 'Relacionamentos', 'pt-pt': 'Relacionamentos', en: 'Relationships' },
    innerLife: { pt: 'Vida Interior', 'pt-pt': 'Vida Interior', en: 'Inner Life' },
    evolutionPoints: { pt: 'Pontos de Evolução', 'pt-pt': 'Pontos de Evolução', en: 'Evolution Points' },
    sevenDayPlan: { pt: 'Plano de Desenvolvimento (7 dias)', 'pt-pt': 'Plano de Desenvolvimento (7 dias)', en: 'Development Plan (7 days)' },
    selfExam: { pt: 'Pergunta de Autoexame', 'pt-pt': 'Pergunta de Autoexame', en: 'Self-Examination Question' },
    closing: { pt: 'Encerramento com Nello AI', 'pt-pt': 'Encerramento com Nello AI', en: 'Closing with Nello AI' }
  },
  nelloAI: {
    patternsIntro: {
      pt: '"Vejo como sua energia se move quando você está seguro… e como ela muda quando o mundo te pressiona. Quando você está alinhado, sua força aparece como virtude. Quando está cansado, essa mesma força vira tensão."',
      'pt-pt': '"Vejo como a tua energia se move quando estás seguro… e como ela muda quando o mundo te pressiona. Quando estás alinhado, a tua força aparece como virtude. Quando estás cansado, essa mesma força vira tensão."',
      en: '"I see how your energy moves when you feel secure… and how it changes when the world pressures you. When you are aligned, your strength appears as virtue. When you are tired, that same strength becomes tension."'
    },
    patternsList: {
      pt: [
        'Seu modo de resolver problemas',
        'Seu modo de reagir à crítica',
        'Seu gatilho emocional',
        'Seu padrão de fuga',
        'Como você busca aprovação',
        'O que te ativa',
        'O que te acalma'
      ],
      'pt-pt': [
        'O teu modo de resolver problemas',
        'O teu modo de reagir à crítica',
        'O teu gatilho emocional',
        'O teu padrão de fuga',
        'Como buscas aprovação',
        'O que te ativa',
        'O que te acalma'
      ],
      en: [
        'Your way of solving problems',
        'Your way of reacting to criticism',
        'Your emotional trigger',
        'Your escape pattern',
        'How you seek approval',
        'What activates you',
        'What calms you'
      ]
    }
  },
  dimensions: {
    work: {
      pt: ['Sua motivação principal', 'Seu ritmo natural', 'Seu estilo de liderança', 'Seu modo de entregar resultados', 'Como você colabora em equipe'],
      'pt-pt': ['A tua motivação principal', 'O teu ritmo natural', 'O teu estilo de liderança', 'O teu modo de entregar resultados', 'Como colaboras em equipa'],
      en: ['Your main motivation', 'Your natural rhythm', 'Your leadership style', 'Your way of delivering results', 'How you collaborate in a team']
    },
    relationships: {
      pt: ['Como você expressa carinho', 'Como você pede cuidado', 'Como você lida com conflitos', 'Como você reconcilia', 'Como você lida com silêncio'],
      'pt-pt': ['Como expressas carinho', 'Como pedes cuidado', 'Como lidas com conflitos', 'Como reconcilias', 'Como lidas com silêncio'],
      en: ['How you express affection', 'How you ask for care', 'How you handle conflicts', 'How you reconcile', 'How you handle silence']
    },
    innerLife: {
      pt: ['Como você processa emoções', 'Como Deus te fala internamente', 'Seus bloqueios espirituais comuns', 'Sua forma de perceber propósito'],
      'pt-pt': ['Como processas emoções', 'Como Deus te fala internamente', 'Os teus bloqueios espirituais comuns', 'A tua forma de perceber propósito'],
      en: ['How you process emotions', 'How God speaks to you internally', 'Your common spiritual blocks', 'Your way of perceiving purpose']
    }
  },
  selfExamQuestion: {
    pt: '"Sua energia está a serviço de quem Deus te chamou para ser… ou da pressão de agradar o mundo?"',
    'pt-pt': '"A tua energia está ao serviço de quem Deus te chamou para ser… ou da pressão de agradar o mundo?"',
    en: '"Is your energy serving who God called you to be… or the pressure to please the world?"'
  },
  closingMessage: {
    pt: '"O autoconhecimento não te muda. Ele te revela.\nE quando você se vê com clareza, nada te segura."',
    'pt-pt': '"O autoconhecimento não te muda. Ele revela-te.\nE quando te vês com clareza, nada te segura."',
    en: '"Self-knowledge doesn\'t change you. It reveals you.\nAnd when you see yourself clearly, nothing holds you back."'
  },
  day: { pt: 'Dia', 'pt-pt': 'Dia', en: 'Day' }
};

function getSecondaryProfile(scores: DISCScores, dominant: string): string {
  const sorted = Object.entries(scores)
    .filter(([key]) => key !== dominant)
    .sort(([, a], [, b]) => b - a);
  return sorted[0]?.[0] || 'I';
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line: string, index: number) => {
    doc.text(line, x, y + (index * lineHeight));
  });
  return y + (lines.length * lineHeight);
}

export function generateDISCPremiumPDF(data: DISCPDFData): jsPDF {
  const { userName, scores, dominantProfile, language } = data;
  const lang = language || 'pt';
  
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  const profile = DISC_PROFILES[dominantProfile as keyof typeof DISC_PROFILES];
  const secondaryKey = getSecondaryProfile(scores, dominantProfile);
  const combinationKey = `${dominantProfile}${secondaryKey}` as keyof typeof DISC_COMBINATIONS;
  
  // ========== COVER PAGE ==========
  doc.setFillColor(31, 46, 75); // Ink Blue
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(TEXTS.cover.title[lang], pageWidth / 2, 80, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(TEXTS.cover.subtitle[lang], pageWidth / 2, 95, { align: 'center' });
  
  // Dominant profile badge
  doc.setFillColor(205, 174, 103); // Gold
  doc.roundedRect(pageWidth / 2 - 30, 115, 60, 25, 5, 5, 'F');
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(dominantProfile, pageWidth / 2, 132, { align: 'center' });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(userName, pageWidth / 2, 160, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  addWrappedText(doc, TEXTS.cover.quote[lang], margin + 10, 190, contentWidth - 20, 6);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(TEXTS.cover.signature[lang], pageWidth / 2, pageHeight - 30, { align: 'center' });
  
  // ========== PAGE 2: INTRODUCTION ==========
  doc.addPage();
  doc.setFillColor(252, 252, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  let yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`1. ${TEXTS.intro.title[lang]}`, margin, yPos);
  
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  yPos = addWrappedText(doc, TEXTS.intro.content[lang], margin, yPos, contentWidth, 6);
  
  // ========== PAGE 3: DOMINANT PROFILE ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`2. ${TEXTS.sections.dominantProfile[lang]}`, margin, yPos);
  
  yPos += 15;
  
  // Profile header
  doc.setFillColor(220, 233, 245); // Bruma Blue
  doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setTextColor(31, 46, 75);
  doc.text(`${profile.name[lang]} (${dominantProfile})`, margin + 10, yPos + 13);
  
  yPos += 30;
  
  // Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(TEXTS.sections.whatItMeans[lang], margin, yPos);
  yPos += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  yPos = addWrappedText(doc, profile.description[lang], margin, yPos, contentWidth, 6);
  
  yPos += 10;
  
  // Strengths
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 46, 75);
  doc.text(TEXTS.sections.naturalStrengths[lang], margin, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  profile.strengths[lang].forEach(strength => {
    doc.text(`• ${strength}`, margin + 5, yPos);
    yPos += 6;
  });
  
  yPos += 8;
  
  // Vulnerabilities
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 46, 75);
  doc.text(TEXTS.sections.vulnerabilities[lang], margin, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  profile.vulnerabilities[lang].forEach(vuln => {
    doc.text(`• ${vuln}`, margin + 5, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Light
  doc.setFillColor(237, 234, 255); // Ice Lavender
  doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(31, 46, 75);
  doc.text(`${TEXTS.sections.yourLight[lang]}: "${profile.light[lang]}"`, margin + 10, yPos + 13);
  
  // ========== PAGE 4: SECONDARY TRAITS ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`3. ${TEXTS.sections.secondaryTraits[lang]}`, margin, yPos);
  
  yPos += 15;
  
  // Combination
  doc.setFillColor(220, 233, 245);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 46, 75);
  doc.text(`${TEXTS.sections.combination[lang]}: ${dominantProfile}${secondaryKey}`, margin + 10, yPos + 12);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const combinationText = DISC_COMBINATIONS[combinationKey]?.[lang] || DISC_COMBINATIONS.DI[lang];
  addWrappedText(doc, combinationText, margin + 10, yPos + 22, contentWidth - 20, 5);
  
  yPos += 50;
  
  // All profiles ranking
  const sortedProfiles = Object.entries(scores).sort(([, a], [, b]) => b - a);
  
  sortedProfiles.forEach(([key, score], index) => {
    const p = DISC_PROFILES[key as keyof typeof DISC_PROFILES];
    const isFirst = index === 0;
    
    doc.setFillColor(isFirst ? 205 : 240, isFirst ? 174 : 240, isFirst ? 103 : 240);
    doc.roundedRect(margin, yPos, contentWidth, 18, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', isFirst ? 'bold' : 'normal');
    doc.setTextColor(31, 46, 75);
    doc.text(`${p.name[lang]} (${key})`, margin + 10, yPos + 12);
    
    doc.text(`${score} pts`, pageWidth - margin - 25, yPos + 12);
    
    yPos += 22;
  });
  
  // ========== PAGE 5: VISUAL MAP ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`4. ${TEXTS.sections.visualMap[lang]}`, margin, yPos);
  
  yPos += 20;
  
  const maxScore = Math.max(...Object.values(scores), 1);
  const barHeight = 25;
  const barSpacing = 35;
  
  Object.entries(DISC_PROFILES).forEach(([key, p]) => {
    const score = scores[key as keyof DISCScores];
    const barWidth = (score / maxScore) * (contentWidth - 60);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 46, 75);
    doc.text(key, margin, yPos + 8);
    
    // Background bar
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin + 25, yPos, contentWidth - 60, barHeight, 3, 3, 'F');
    
    // Score bar
    const colors = { D: [205, 74, 74], I: [205, 174, 103], S: [74, 144, 205], C: [100, 100, 100] };
    const color = colors[key as keyof typeof colors];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(margin + 25, yPos, Math.max(barWidth, 5), barHeight, 3, 3, 'F');
    
    // Score text
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    if (barWidth > 30) {
      doc.text(`${score}`, margin + 35, yPos + 16);
    }
    
    yPos += barSpacing;
  });
  
  // ========== PAGE 6: NELLO AI'S PATTERNS ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`5. ${TEXTS.sections.nelloPatterns[lang]}`, margin, yPos);
  
  yPos += 15;
  
  doc.setFillColor(237, 234, 255);
  doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(31, 46, 75);
  addWrappedText(doc, TEXTS.nelloAI.patternsIntro[lang], margin + 10, yPos + 12, contentWidth - 20, 5);
  
  yPos += 55;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  TEXTS.nelloAI.patternsList[lang].forEach(pattern => {
    doc.text(`• ${pattern}`, margin + 5, yPos);
    yPos += 7;
  });
  
  // ========== PAGE 7: LIFE DIMENSIONS ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`6. ${TEXTS.sections.lifeDimensions[lang]}`, margin, yPos);
  
  yPos += 20;
  
  // Work
  doc.setFillColor(220, 233, 245);
  doc.roundedRect(margin, yPos, contentWidth, 12, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(TEXTS.sections.work[lang], margin + 10, yPos + 8);
  yPos += 18;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  TEXTS.dimensions.work[lang].forEach(item => {
    doc.text(`• ${item}`, margin + 5, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Relationships
  doc.setFillColor(220, 233, 245);
  doc.roundedRect(margin, yPos, contentWidth, 12, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 46, 75);
  doc.text(TEXTS.sections.relationships[lang], margin + 10, yPos + 8);
  yPos += 18;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  TEXTS.dimensions.relationships[lang].forEach(item => {
    doc.text(`• ${item}`, margin + 5, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Inner Life
  doc.setFillColor(220, 233, 245);
  doc.roundedRect(margin, yPos, contentWidth, 12, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 46, 75);
  doc.text(TEXTS.sections.innerLife[lang], margin + 10, yPos + 8);
  yPos += 18;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  TEXTS.dimensions.innerLife[lang].forEach(item => {
    doc.text(`• ${item}`, margin + 5, yPos);
    yPos += 6;
  });
  
  // ========== PAGE 8: EVOLUTION POINTS ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`7. ${TEXTS.sections.evolutionPoints[lang]}`, margin, yPos);
  
  yPos += 15;
  
  profile.evolution[lang].forEach((point, index) => {
    doc.setFillColor(237, 234, 255);
    doc.roundedRect(margin, yPos, contentWidth, 14, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 46, 75);
    doc.text(`${index + 1}. ${point}`, margin + 10, yPos + 9);
    yPos += 18;
  });
  
  // ========== PAGE 9: 7-DAY PLAN ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`8. ${TEXTS.sections.sevenDayPlan[lang]}`, margin, yPos);
  
  yPos += 15;
  
  profile.sevenDayPlan[lang].forEach((activity, index) => {
    const dayNum = index + 1;
    
    doc.setFillColor(dayNum % 2 === 0 ? 245 : 220, dayNum % 2 === 0 ? 245 : 233, dayNum % 2 === 0 ? 245 : 245);
    doc.roundedRect(margin, yPos, contentWidth, 18, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 46, 75);
    doc.text(`${TEXTS.day[lang]} ${dayNum}:`, margin + 10, yPos + 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(activity, margin + 35, yPos + 12);
    
    yPos += 22;
  });
  
  // ========== PAGE 10: SELF-EXAM & CLOSING ==========
  doc.addPage();
  yPos = 30;
  
  // Self-Exam Question
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`9. ${TEXTS.sections.selfExam[lang]}`, margin, yPos);
  
  yPos += 15;
  
  doc.setFillColor(237, 234, 255);
  doc.roundedRect(margin, yPos, contentWidth, 30, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(31, 46, 75);
  addWrappedText(doc, TEXTS.selfExamQuestion[lang], margin + 10, yPos + 12, contentWidth - 20, 6);
  
  yPos += 50;
  
  // Closing with Nello AI
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`10. ${TEXTS.sections.closing[lang]}`, margin, yPos);
  
  yPos += 15;
  
  doc.setFillColor(31, 46, 75);
  doc.roundedRect(margin, yPos, contentWidth, 50, 5, 5, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(255, 255, 255);
  addWrappedText(doc, TEXTS.closingMessage[lang], margin + 15, yPos + 18, contentWidth - 30, 7);
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('NELLO ONE • Premium DISC Report', pageWidth / 2, pageHeight - 15, { align: 'center' });
  
  return doc;
}

export function downloadDISCPremiumPDF(data: DISCPDFData): void {
  const doc = generateDISCPremiumPDF(data);
  const fileName = `DISC_Premium_${data.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
