// Extended data for Nello 16 Personality Map - Rich content for on-screen display
// This file contains vocations, shadows, traps, 7-day plans, and dynamic content generators

export interface Nello16ExtendedType {
  subtitle: { pt: string; 'pt-pt': string; en: string };
  light: { pt: string[]; 'pt-pt': string[]; en: string[] };
  shadow: { pt: string[]; 'pt-pt': string[]; en: string[] };
  vocation: { pt: string; 'pt-pt': string; en: string };
  traps: { pt: string[]; 'pt-pt': string[]; en: string[] };
  sevenDayPlan: { pt: string[]; 'pt-pt': string[]; en: string[] };
}

export const NELLO_16_EXTENDED_DATA: Record<string, Nello16ExtendedType> = {
  INTJ: {
    subtitle: { pt: 'Mente visionária com foco absoluto', 'pt-pt': 'Mente visionária com foco absoluto', en: 'Visionary mind with absolute focus' },
    light: {
      pt: ['Visão estratégica que antecipa tendências', 'Independência para seguir sua própria lógica', 'Determinação inabalável diante de obstáculos', 'Capacidade de transformar ideias em sistemas', 'Pensamento de longo prazo que poucos conseguem'],
      'pt-pt': ['Visão estratégica que antecipa tendências', 'Independência para seguir a tua própria lógica', 'Determinação inabalável perante obstáculos', 'Capacidade de transformar ideias em sistemas', 'Pensamento de longo prazo que poucos conseguem'],
      en: ['Strategic vision that anticipates trends', 'Independence to follow your own logic', 'Unwavering determination in the face of obstacles', 'Ability to transform ideas into systems', 'Long-term thinking that few can match']
    },
    shadow: {
      pt: ['Arrogância intelectual que afasta aliados', 'Dificuldade em validar emoções alheias', 'Perfeccionismo que paralisa a ação', 'Impaciência com quem não acompanha seu raciocínio', 'Isolamento emocional como defesa'],
      'pt-pt': ['Arrogância intelectual que afasta aliados', 'Dificuldade em validar emoções alheias', 'Perfeccionismo que paralisa a ação', 'Impaciência com quem não acompanha o teu raciocínio', 'Isolamento emocional como defesa'],
      en: ['Intellectual arrogance that pushes allies away', 'Difficulty validating others\' emotions', 'Perfectionism that paralyzes action', 'Impatience with those who can\'t follow your reasoning', 'Emotional isolation as defense']
    },
    vocation: {
      pt: 'Sua vocação está onde estratégia encontra inovação: liderança visionária, ciência, arquitetura de sistemas, pesquisa, empreendedorismo ou consultoria estratégica.',
      'pt-pt': 'A tua vocação está onde estratégia encontra inovação: liderança visionária, ciência, arquitetura de sistemas, investigação, empreendedorismo ou consultoria estratégica.',
      en: 'Your vocation is where strategy meets innovation: visionary leadership, science, systems architecture, research, entrepreneurship, or strategic consulting.'
    },
    traps: {
      pt: ['Vício mental: análise infinita sem ação', 'Vício emocional: necessidade de controle total', 'Vício espiritual: autossuficiência que rejeita ajuda'],
      'pt-pt': ['Vício mental: análise infinita sem ação', 'Vício emocional: necessidade de controlo total', 'Vício espiritual: autossuficiência que rejeita ajuda'],
      en: ['Mental addiction: infinite analysis without action', 'Emotional addiction: need for total control', 'Spiritual addiction: self-sufficiency that rejects help']
    },
    sevenDayPlan: {
      pt: ['Peça opinião a alguém antes de decidir', 'Faça algo sem planejar completamente', 'Ouça uma emoção sem tentar analisar', 'Delegue uma tarefa importante com confiança', 'Reconheça um erro em voz alta', 'Descanse um dia sem produzir nada', 'Celebre uma relação, não uma conquista'],
      'pt-pt': ['Pede opinião a alguém antes de decidir', 'Faz algo sem planear completamente', 'Ouve uma emoção sem tentar analisar', 'Delega uma tarefa importante com confiança', 'Reconhece um erro em voz alta', 'Descansa um dia sem produzir nada', 'Celebra uma relação, não uma conquista'],
      en: ['Ask someone\'s opinion before deciding', 'Do something without fully planning', 'Listen to an emotion without trying to analyze', 'Delegate an important task with confidence', 'Acknowledge a mistake out loud', 'Rest a day without producing anything', 'Celebrate a relationship, not an achievement']
    }
  },
  INTP: {
    subtitle: { pt: 'Mente curiosa em busca de verdade', 'pt-pt': 'Mente curiosa em busca de verdade', en: 'Curious mind seeking truth' },
    light: {
      pt: ['Curiosidade infinita que questiona tudo', 'Pensamento original que conecta ideias inesperadas', 'Capacidade de abstração que poucos alcançam', 'Honestidade intelectual implacável', 'Criatividade conceitual para resolver problemas complexos'],
      'pt-pt': ['Curiosidade infinita que questiona tudo', 'Pensamento original que conecta ideias inesperadas', 'Capacidade de abstração que poucos alcançam', 'Honestidade intelectual implacável', 'Criatividade conceptual para resolver problemas complexos'],
      en: ['Infinite curiosity that questions everything', 'Original thinking that connects unexpected ideas', 'Abstraction capacity that few can reach', 'Relentless intellectual honesty', 'Conceptual creativity to solve complex problems']
    },
    shadow: {
      pt: ['Desconexão da realidade prática', 'Procrastinação que adia indefinidamente', 'Dificuldade em finalizar o que começa', 'Negligência com necessidades emocionais', 'Arrogância sutil disfarçada de objetividade'],
      'pt-pt': ['Desconexão da realidade prática', 'Procrastinação que adia indefinidamente', 'Dificuldade em finalizar o que começas', 'Negligência com necessidades emocionais', 'Arrogância subtil disfarçada de objetividade'],
      en: ['Disconnection from practical reality', 'Procrastination that postpones indefinitely', 'Difficulty finishing what you start', 'Neglect of emotional needs', 'Subtle arrogance disguised as objectivity']
    },
    vocation: {
      pt: 'Sua vocação está onde análise encontra descoberta: ciência, filosofia, programação, matemática, pesquisa acadêmica ou design de sistemas complexos.',
      'pt-pt': 'A tua vocação está onde análise encontra descoberta: ciência, filosofia, programação, matemática, investigação académica ou design de sistemas complexos.',
      en: 'Your vocation is where analysis meets discovery: science, philosophy, programming, mathematics, academic research, or complex systems design.'
    },
    traps: {
      pt: ['Vício mental: teorização infinita sem aplicação', 'Vício emocional: evitação de confrontos', 'Vício espiritual: relativismo que evita compromissos'],
      'pt-pt': ['Vício mental: teorização infinita sem aplicação', 'Vício emocional: evitação de confrontos', 'Vício espiritual: relativismo que evita compromissos'],
      en: ['Mental addiction: infinite theorizing without application', 'Emotional addiction: avoiding confrontations', 'Spiritual addiction: relativism that avoids commitments']
    },
    sevenDayPlan: {
      pt: ['Termine algo que você começou há tempo', 'Converse sobre seus sentimentos com alguém', 'Faça atividade física por 30 minutos', 'Saia do mundo das ideias e execute uma ação', 'Peça feedback sincero sobre você', 'Pratique presença sem pensar no futuro', 'Celebre uma conexão humana genuína'],
      'pt-pt': ['Termina algo que começaste há tempo', 'Conversa sobre os teus sentimentos com alguém', 'Faz atividade física por 30 minutos', 'Sai do mundo das ideias e executa uma ação', 'Pede feedback sincero sobre ti', 'Pratica presença sem pensar no futuro', 'Celebra uma conexão humana genuína'],
      en: ['Finish something you started a while ago', 'Talk about your feelings with someone', 'Do physical activity for 30 minutes', 'Leave the world of ideas and execute an action', 'Ask for sincere feedback about yourself', 'Practice presence without thinking about the future', 'Celebrate a genuine human connection']
    }
  },
  ENTJ: {
    subtitle: { pt: 'Líder natural com visão transformadora', 'pt-pt': 'Líder natural com visão transformadora', en: 'Natural leader with transformative vision' },
    light: {
      pt: ['Liderança natural que inspira ação', 'Visão estratégica clara e ambiciosa', 'Capacidade de execução que transforma planos em realidade', 'Coragem para tomar decisões difíceis', 'Carisma de comando que mobiliza equipes'],
      'pt-pt': ['Liderança natural que inspira ação', 'Visão estratégica clara e ambiciosa', 'Capacidade de execução que transforma planos em realidade', 'Coragem para tomar decisões difíceis', 'Carisma de comando que mobiliza equipas'],
      en: ['Natural leadership that inspires action', 'Clear and ambitious strategic vision', 'Execution capacity that turns plans into reality', 'Courage to make difficult decisions', 'Command charisma that mobilizes teams']
    },
    shadow: {
      pt: ['Autoritarismo que sufoca colaboração', 'Impaciência extrema com processos lentos', 'Frieza emocional que fere relacionamentos', 'Intolerância à fraqueza alheia', 'Workaholismo destrutivo que ignora limites'],
      'pt-pt': ['Autoritarismo que sufoca colaboração', 'Impaciência extrema com processos lentos', 'Frieza emocional que fere relacionamentos', 'Intolerância à fraqueza alheia', 'Workaholismo destrutivo que ignora limites'],
      en: ['Authoritarianism that stifles collaboration', 'Extreme impatience with slow processes', 'Emotional coldness that hurts relationships', 'Intolerance of others\' weakness', 'Destructive workaholism that ignores limits']
    },
    vocation: {
      pt: 'Sua vocação está onde liderança encontra transformação: posições executivas, empreendedorismo, estratégia empresarial, direção de projetos ou consultoria de alto impacto.',
      'pt-pt': 'A tua vocação está onde liderança encontra transformação: posições executivas, empreendedorismo, estratégia empresarial, direção de projetos ou consultoria de alto impacto.',
      en: 'Your vocation is where leadership meets transformation: executive positions, entrepreneurship, business strategy, project direction, or high-impact consulting.'
    },
    traps: {
      pt: ['Vício mental: necessidade de controle total', 'Vício emocional: poder como validação', 'Vício espiritual: orgulho que rejeita humildade'],
      'pt-pt': ['Vício mental: necessidade de controlo total', 'Vício emocional: poder como validação', 'Vício espiritual: orgulho que rejeita humildade'],
      en: ['Mental addiction: need for total control', 'Emotional addiction: power as validation', 'Spiritual addiction: pride that rejects humility']
    },
    sevenDayPlan: {
      pt: ['Ouça alguém completamente sem corrigir', 'Delegue algo importante sem supervisionar', 'Reconheça uma fraqueza pessoal em voz alta', 'Descanse um dia inteiro sem trabalhar', 'Pergunte como alguém está de verdade', 'Aceite um "não" sem reagir', 'Ore ou medite pedindo humildade'],
      'pt-pt': ['Ouve alguém completamente sem corrigir', 'Delega algo importante sem supervisionar', 'Reconhece uma fraqueza pessoal em voz alta', 'Descansa um dia inteiro sem trabalhar', 'Pergunta como alguém está de verdade', 'Aceita um "não" sem reagir', 'Reza ou medita pedindo humildade'],
      en: ['Listen to someone completely without correcting', 'Delegate something important without supervising', 'Acknowledge a personal weakness out loud', 'Rest a whole day without working', 'Ask how someone is truly doing', 'Accept a "no" without reacting', 'Pray or meditate asking for humility']
    }
  },
  ENTP: {
    subtitle: { pt: 'Mente inventiva que desafia o impossível', 'pt-pt': 'Mente inventiva que desafia o impossível', en: 'Inventive mind that challenges the impossible' },
    light: {
      pt: ['Criatividade explosiva que gera ideias', 'Eloquência que persuade e inspira', 'Adaptabilidade mental para qualquer contexto', 'Coragem intelectual para desafiar o status quo', 'Capacidade de inovação constante'],
      'pt-pt': ['Criatividade explosiva que gera ideias', 'Eloquência que persuade e inspira', 'Adaptabilidade mental para qualquer contexto', 'Coragem intelectual para desafiar o status quo', 'Capacidade de inovação constante'],
      en: ['Explosive creativity that generates ideas', 'Eloquence that persuades and inspires', 'Mental adaptability to any context', 'Intellectual courage to challenge the status quo', 'Constant innovation capacity']
    },
    shadow: {
      pt: ['Inconstância que abandona projetos', 'Argumentação excessiva que cansa os outros', 'Falta de foco que dispersa energia', 'Insensibilidade inadvertida com sentimentos', 'Tédio fácil que busca novidade constante'],
      'pt-pt': ['Inconstância que abandona projetos', 'Argumentação excessiva que cansa os outros', 'Falta de foco que dispersa energia', 'Insensibilidade inadvertida com sentimentos', 'Tédio fácil que busca novidade constante'],
      en: ['Inconstancy that abandons projects', 'Excessive argumentation that tires others', 'Lack of focus that disperses energy', 'Inadvertent insensitivity to feelings', 'Easy boredom that seeks constant novelty']
    },
    vocation: {
      pt: 'Sua vocação está onde inovação encontra comunicação: empreendedorismo criativo, advocacia, marketing, tecnologia, consultoria ou startups.',
      'pt-pt': 'A tua vocação está onde inovação encontra comunicação: empreendedorismo criativo, advocacia, marketing, tecnologia, consultoria ou startups.',
      en: 'Your vocation is where innovation meets communication: creative entrepreneurship, law, marketing, technology, consulting, or startups.'
    },
    traps: {
      pt: ['Vício mental: novidade constante como fuga', 'Vício emocional: necessidade de ter razão', 'Vício espiritual: ceticismo que evita fé'],
      'pt-pt': ['Vício mental: novidade constante como fuga', 'Vício emocional: necessidade de ter razão', 'Vício espiritual: ceticismo que evita fé'],
      en: ['Mental addiction: constant novelty as escape', 'Emotional addiction: need to be right', 'Spiritual addiction: skepticism that avoids faith']
    },
    sevenDayPlan: {
      pt: ['Termine um projeto antes de começar outro', 'Ouça alguém sem contra-argumentar', 'Foque em uma única coisa por 2 horas', 'Peça desculpas por algo que você disse', 'Valorize algo simples e rotineiro', 'Pratique silêncio por 15 minutos', 'Celebre consistência, não só novidade'],
      'pt-pt': ['Termina um projeto antes de começar outro', 'Ouve alguém sem contra-argumentar', 'Foca numa única coisa por 2 horas', 'Pede desculpas por algo que disseste', 'Valoriza algo simples e rotineiro', 'Pratica silêncio por 15 minutos', 'Celebra consistência, não só novidade'],
      en: ['Finish one project before starting another', 'Listen to someone without counter-arguing', 'Focus on a single thing for 2 hours', 'Apologize for something you said', 'Value something simple and routine', 'Practice silence for 15 minutes', 'Celebrate consistency, not just novelty']
    }
  },
  INFJ: {
    subtitle: { pt: 'Alma profunda com visão transformadora', 'pt-pt': 'Alma profunda com visão transformadora', en: 'Deep soul with transformative vision' },
    light: {
      pt: ['Intuição profunda que percebe o invisível', 'Empatia transformadora que cura', 'Visão de propósito que guia decisões', 'Sensibilidade espiritual rara', 'Capacidade de inspirar mudança genuína'],
      'pt-pt': ['Intuição profunda que percebe o invisível', 'Empatia transformadora que cura', 'Visão de propósito que guia decisões', 'Sensibilidade espiritual rara', 'Capacidade de inspirar mudança genuína'],
      en: ['Deep intuition that perceives the invisible', 'Transformative empathy that heals', 'Purpose vision that guides decisions', 'Rare spiritual sensitivity', 'Ability to inspire genuine change']
    },
    shadow: {
      pt: ['Esgotamento emocional por absorver dor alheia', 'Perfeccionismo paralisante', 'Dificuldade em estabelecer limites', 'Idealismo doloroso que decepciona', 'Isolamento como proteção'],
      'pt-pt': ['Esgotamento emocional por absorver dor alheia', 'Perfeccionismo paralisante', 'Dificuldade em estabelecer limites', 'Idealismo doloroso que decepciona', 'Isolamento como proteção'],
      en: ['Emotional exhaustion from absorbing others\' pain', 'Paralyzing perfectionism', 'Difficulty setting boundaries', 'Painful idealism that disappoints', 'Isolation as protection']
    },
    vocation: {
      pt: 'Sua vocação está onde profundidade encontra cura: aconselhamento, escrita, psicologia, espiritualidade, educação transformadora ou causas humanitárias.',
      'pt-pt': 'A tua vocação está onde profundidade encontra cura: aconselhamento, escrita, psicologia, espiritualidade, educação transformadora ou causas humanitárias.',
      en: 'Your vocation is where depth meets healing: counseling, writing, psychology, spirituality, transformative education, or humanitarian causes.'
    },
    traps: {
      pt: ['Vício mental: idealização que ignora realidade', 'Vício emocional: absorver dor alheia como própria', 'Vício espiritual: messianismo que esquece de si'],
      'pt-pt': ['Vício mental: idealização que ignora realidade', 'Vício emocional: absorver dor alheia como própria', 'Vício espiritual: messianismo que esquece de si'],
      en: ['Mental addiction: idealization that ignores reality', 'Emotional addiction: absorbing others\' pain as your own', 'Spiritual addiction: messianism that forgets yourself']
    },
    sevenDayPlan: {
      pt: ['Diga não a um pedido de ajuda', 'Faça algo prazeroso só para você', 'Aceite imperfeição em algo importante', 'Descanse sem sentir culpa', 'Peça ajuda a alguém próximo', 'Expresse raiva de forma saudável', 'Celebre quem você é, não o que faz pelos outros'],
      'pt-pt': ['Diz não a um pedido de ajuda', 'Faz algo prazeroso só para ti', 'Aceita imperfeição em algo importante', 'Descansa sem sentir culpa', 'Pede ajuda a alguém próximo', 'Expressa raiva de forma saudável', 'Celebra quem és, não o que fazes pelos outros'],
      en: ['Say no to a request for help', 'Do something pleasurable just for yourself', 'Accept imperfection in something important', 'Rest without feeling guilty', 'Ask someone close for help', 'Express anger in a healthy way', 'Celebrate who you are, not what you do for others']
    }
  },
  INFP: {
    subtitle: { pt: 'Alma sensível em busca de autenticidade', 'pt-pt': 'Alma sensível em busca de autenticidade', en: 'Sensitive soul seeking authenticity' },
    light: {
      pt: ['Autenticidade radical que inspira', 'Criatividade emocional profunda', 'Empatia que enxerga o melhor nos outros', 'Idealismo inspirador que sonha alto', 'Sensibilidade artística única'],
      'pt-pt': ['Autenticidade radical que inspira', 'Criatividade emocional profunda', 'Empatia que vê o melhor nos outros', 'Idealismo inspirador que sonha alto', 'Sensibilidade artística única'],
      en: ['Radical authenticity that inspires', 'Deep emotional creativity', 'Empathy that sees the best in others', 'Inspiring idealism that dreams big', 'Unique artistic sensitivity']
    },
    shadow: {
      pt: ['Autocrítica destrutiva que paralisa', 'Dificuldade com a realidade prática', 'Melancolia que se torna refúgio', 'Evitação de conflitos a qualquer custo', 'Paralisia por idealismo excessivo'],
      'pt-pt': ['Autocrítica destrutiva que paralisa', 'Dificuldade com a realidade prática', 'Melancolia que se torna refúgio', 'Evitação de conflitos a qualquer custo', 'Paralisia por idealismo excessivo'],
      en: ['Destructive self-criticism that paralyzes', 'Difficulty with practical reality', 'Melancholy that becomes refuge', 'Conflict avoidance at any cost', 'Paralysis from excessive idealism']
    },
    vocation: {
      pt: 'Sua vocação está onde autenticidade encontra expressão: arte, escrita, música, acolhimento, causas humanitárias, espiritualidade ou terapia.',
      'pt-pt': 'A tua vocação está onde autenticidade encontra expressão: arte, escrita, música, acolhimento, causas humanitárias, espiritualidade ou terapia.',
      en: 'Your vocation is where authenticity meets expression: art, writing, music, welcoming, humanitarian causes, spirituality, or therapy.'
    },
    traps: {
      pt: ['Vício mental: fantasia como fuga da realidade', 'Vício emocional: melancolia como identidade', 'Vício espiritual: auto-sacrifício que ignora limites'],
      'pt-pt': ['Vício mental: fantasia como fuga da realidade', 'Vício emocional: melancolia como identidade', 'Vício espiritual: auto-sacrifício que ignora limites'],
      en: ['Mental addiction: fantasy as escape from reality', 'Emotional addiction: melancholy as identity', 'Spiritual addiction: self-sacrifice that ignores limits']
    },
    sevenDayPlan: {
      pt: ['Faça algo prático e útil hoje', 'Enfrente um pequeno conflito', 'Celebre algo imperfeito que você criou', 'Saia do mundo interno por 2 horas', 'Peça claramente o que você precisa', 'Aceite um elogio sem minimizar', 'Declare seu valor em voz alta'],
      'pt-pt': ['Faz algo prático e útil hoje', 'Enfrenta um pequeno conflito', 'Celebra algo imperfeito que criaste', 'Sai do mundo interno por 2 horas', 'Pede claramente o que precisas', 'Aceita um elogio sem minimizar', 'Declara o teu valor em voz alta'],
      en: ['Do something practical and useful today', 'Face a small conflict', 'Celebrate something imperfect you created', 'Leave the internal world for 2 hours', 'Clearly ask for what you need', 'Accept a compliment without minimizing', 'Declare your value out loud']
    }
  },
  ENFJ: {
    subtitle: { pt: 'Líder inspirador que transforma vidas', 'pt-pt': 'Líder inspirador que transforma vidas', en: 'Inspiring leader who transforms lives' },
    light: {
      pt: ['Carisma inspirador que mobiliza pessoas', 'Empatia ativa que desenvolve talentos', 'Capacidade de enxergar potencial oculto', 'Comunicação transformadora', 'Visão de propósito coletivo'],
      'pt-pt': ['Carisma inspirador que mobiliza pessoas', 'Empatia ativa que desenvolve talentos', 'Capacidade de ver potencial oculto', 'Comunicação transformadora', 'Visão de propósito coletivo'],
      en: ['Inspiring charisma that mobilizes people', 'Active empathy that develops talents', 'Ability to see hidden potential', 'Transformative communication', 'Collective purpose vision']
    },
    shadow: {
      pt: ['Dependência de aprovação externa', 'Negligência das próprias necessidades', 'Manipulação inconsciente para ajudar', 'Idealização excessiva de pessoas', 'Esgotamento por doar demais'],
      'pt-pt': ['Dependência de aprovação externa', 'Negligência das próprias necessidades', 'Manipulação inconsciente para ajudar', 'Idealização excessiva de pessoas', 'Esgotamento por doar demais'],
      en: ['Dependency on external approval', 'Neglect of your own needs', 'Unconscious manipulation to help', 'Excessive idealization of people', 'Exhaustion from giving too much']
    },
    vocation: {
      pt: 'Sua vocação está onde liderança encontra desenvolvimento humano: coaching, educação, liderança inspiradora, ministério, consultoria de pessoas ou mentoria.',
      'pt-pt': 'A tua vocação está onde liderança encontra desenvolvimento humano: coaching, educação, liderança inspiradora, ministério, consultoria de pessoas ou mentoria.',
      en: 'Your vocation is where leadership meets human development: coaching, education, inspiring leadership, ministry, people consulting, or mentoring.'
    },
    traps: {
      pt: ['Vício mental: salvar todos ao redor', 'Vício emocional: ser amado como necessidade', 'Vício espiritual: protagonismo que esquece humildade'],
      'pt-pt': ['Vício mental: salvar todos ao redor', 'Vício emocional: ser amado como necessidade', 'Vício espiritual: protagonismo que esquece humildade'],
      en: ['Mental addiction: saving everyone around', 'Emotional addiction: being loved as a need', 'Spiritual addiction: protagonism that forgets humility']
    },
    sevenDayPlan: {
      pt: ['Diga não sem precisar explicar', 'Cuide de você antes de cuidar de alguém', 'Aceite não ser compreendido', 'Descanse sem sentir culpa', 'Deixe alguém resolver sozinho', 'Expresse uma necessidade sua', 'Celebre quem você é, não quem você inspira'],
      'pt-pt': ['Diz não sem precisar explicar', 'Cuida de ti antes de cuidar de alguém', 'Aceita não ser compreendido', 'Descansa sem sentir culpa', 'Deixa alguém resolver sozinho', 'Expressa uma necessidade tua', 'Celebra quem és, não quem inspiras'],
      en: ['Say no without needing to explain', 'Take care of yourself before caring for someone', 'Accept not being understood', 'Rest without feeling guilty', 'Let someone solve it alone', 'Express a need of yours', 'Celebrate who you are, not who you inspire']
    }
  },
  ENFP: {
    subtitle: { pt: 'Energia criativa que ilumina possibilidades', 'pt-pt': 'Energia criativa que ilumina possibilidades', en: 'Creative energy that illuminates possibilities' },
    light: {
      pt: ['Entusiasmo contagiante que inspira', 'Criatividade ilimitada em conexões', 'Autenticidade natural que atrai', 'Capacidade de conectar pessoas', 'Visão de possibilidades infinitas'],
      'pt-pt': ['Entusiasmo contagiante que inspira', 'Criatividade ilimitada em conexões', 'Autenticidade natural que atrai', 'Capacidade de conectar pessoas', 'Visão de possibilidades infinitas'],
      en: ['Contagious enthusiasm that inspires', 'Unlimited creativity in connections', 'Natural authenticity that attracts', 'Ability to connect people', 'Vision of infinite possibilities']
    },
    shadow: {
      pt: ['Falta de foco que dispersa talentos', 'Dificuldade com rotina e estrutura', 'Sensibilidade à rejeição que fere', 'Projetos inacabados acumulados', 'Ansiedade por novidade constante'],
      'pt-pt': ['Falta de foco que dispersa talentos', 'Dificuldade com rotina e estrutura', 'Sensibilidade à rejeição que fere', 'Projetos inacabados acumulados', 'Ansiedade por novidade constante'],
      en: ['Lack of focus that disperses talents', 'Difficulty with routine and structure', 'Sensitivity to rejection that hurts', 'Accumulated unfinished projects', 'Anxiety for constant novelty']
    },
    vocation: {
      pt: 'Sua vocação está onde criatividade encontra conexão: comunicação, arte, coaching, empreendedorismo criativo, educação inspiradora ou marketing.',
      'pt-pt': 'A tua vocação está onde criatividade encontra conexão: comunicação, arte, coaching, empreendedorismo criativo, educação inspiradora ou marketing.',
      en: 'Your vocation is where creativity meets connection: communication, art, coaching, creative entrepreneurship, inspiring education, or marketing.'
    },
    traps: {
      pt: ['Vício mental: possibilidades infinitas como fuga', 'Vício emocional: ser aceito como necessidade', 'Vício espiritual: superficialidade que evita profundidade'],
      'pt-pt': ['Vício mental: possibilidades infinitas como fuga', 'Vício emocional: ser aceite como necessidade', 'Vício espiritual: superficialidade que evita profundidade'],
      en: ['Mental addiction: infinite possibilities as escape', 'Emotional addiction: being accepted as a need', 'Spiritual addiction: superficiality that avoids depth']
    },
    sevenDayPlan: {
      pt: ['Foque em uma única coisa por 3 horas', 'Cumpra uma rotina mesmo sendo chata', 'Termine algo que começou há tempo', 'Fique sozinho por 2 horas sem entretenimento', 'Aceite crítica sem reagir defensivamente', 'Pratique silêncio por 20 minutos', 'Celebre consistência, não só inspiração'],
      'pt-pt': ['Foca numa única coisa por 3 horas', 'Cumpre uma rotina mesmo sendo chata', 'Termina algo que começaste há tempo', 'Fica sozinho por 2 horas sem entretenimento', 'Aceita crítica sem reagir defensivamente', 'Pratica silêncio por 20 minutos', 'Celebra consistência, não só inspiração'],
      en: ['Focus on a single thing for 3 hours', 'Follow a routine even if boring', 'Finish something you started a while ago', 'Stay alone for 2 hours without entertainment', 'Accept criticism without reacting defensively', 'Practice silence for 20 minutes', 'Celebrate consistency, not just inspiration']
    }
  },
  ISTJ: {
    subtitle: { pt: 'Pilar de confiança e responsabilidade', 'pt-pt': 'Pilar de confiança e responsabilidade', en: 'Pillar of trust and responsibility' },
    light: {
      pt: ['Confiabilidade absoluta que sustenta', 'Responsabilidade exemplar em tudo', 'Disciplina natural que alcança metas', 'Lealdade profunda a pessoas e valores', 'Integridade inabalável'],
      'pt-pt': ['Confiabilidade absoluta que sustenta', 'Responsabilidade exemplar em tudo', 'Disciplina natural que alcança metas', 'Lealdade profunda a pessoas e valores', 'Integridade inabalável'],
      en: ['Absolute reliability that sustains', 'Exemplary responsibility in everything', 'Natural discipline that achieves goals', 'Deep loyalty to people and values', 'Unwavering integrity']
    },
    shadow: {
      pt: ['Rigidez que resiste a mudanças', 'Dificuldade em adaptar-se ao novo', 'Julgamento excessivo de quem é diferente', 'Repressão emocional como norma', 'Resistência a ideias não comprovadas'],
      'pt-pt': ['Rigidez que resiste a mudanças', 'Dificuldade em adaptar-te ao novo', 'Julgamento excessivo de quem é diferente', 'Repressão emocional como norma', 'Resistência a ideias não comprovadas'],
      en: ['Rigidity that resists change', 'Difficulty adapting to the new', 'Excessive judgment of those who are different', 'Emotional repression as norm', 'Resistance to unproven ideas']
    },
    vocation: {
      pt: 'Sua vocação está onde estrutura encontra serviço: administração, contabilidade, direito, gestão de processos, logística ou serviço público.',
      'pt-pt': 'A tua vocação está onde estrutura encontra serviço: administração, contabilidade, direito, gestão de processos, logística ou serviço público.',
      en: 'Your vocation is where structure meets service: administration, accounting, law, process management, logistics, or public service.'
    },
    traps: {
      pt: ['Vício mental: controle através de regras', 'Vício emocional: previsibilidade como segurança', 'Vício espiritual: legalismo que ignora graça'],
      'pt-pt': ['Vício mental: controlo através de regras', 'Vício emocional: previsibilidade como segurança', 'Vício espiritual: legalismo que ignora graça'],
      en: ['Mental addiction: control through rules', 'Emotional addiction: predictability as security', 'Spiritual addiction: legalism that ignores grace']
    },
    sevenDayPlan: {
      pt: ['Quebre uma regra pequena de propósito', 'Faça algo completamente espontâneo', 'Expresse uma emoção forte a alguém', 'Aceite uma mudança de planos sem resistir', 'Ouça uma ideia nova sem criticar', 'Descanse sem justificar para ninguém', 'Celebre flexibilidade, não só dever cumprido'],
      'pt-pt': ['Quebra uma regra pequena de propósito', 'Faz algo completamente espontâneo', 'Expressa uma emoção forte a alguém', 'Aceita uma mudança de planos sem resistir', 'Ouve uma ideia nova sem criticar', 'Descansa sem justificar para ninguém', 'Celebra flexibilidade, não só dever cumprido'],
      en: ['Break a small rule on purpose', 'Do something completely spontaneous', 'Express a strong emotion to someone', 'Accept a change of plans without resisting', 'Listen to a new idea without criticizing', 'Rest without justifying to anyone', 'Celebrate flexibility, not just duty fulfilled']
    }
  },
  ISFJ: {
    subtitle: { pt: 'Coração cuidador que sustenta o amor', 'pt-pt': 'Coração cuidador que sustenta o amor', en: 'Caring heart that sustains love' },
    light: {
      pt: ['Cuidado profundo e consistente', 'Lealdade incondicional a quem ama', 'Atenção aos detalhes que importam', 'Serviço silencioso que transforma', 'Memória emocional que honra histórias'],
      'pt-pt': ['Cuidado profundo e consistente', 'Lealdade incondicional a quem amas', 'Atenção aos detalhes que importam', 'Serviço silencioso que transforma', 'Memória emocional que honra histórias'],
      en: ['Deep and consistent care', 'Unconditional loyalty to those you love', 'Attention to details that matter', 'Silent service that transforms', 'Emotional memory that honors stories']
    },
    shadow: {
      pt: ['Auto-sacrifício excessivo que esgota', 'Dificuldade em pedir o que precisa', 'Ressentimento guardado por muito tempo', 'Medo de mudança que paralisa', 'Evitação de conflitos a qualquer custo'],
      'pt-pt': ['Auto-sacrifício excessivo que esgota', 'Dificuldade em pedir o que precisas', 'Ressentimento guardado por muito tempo', 'Medo de mudança que paralisa', 'Evitação de conflitos a qualquer custo'],
      en: ['Excessive self-sacrifice that exhausts', 'Difficulty asking for what you need', 'Resentment held for too long', 'Fear of change that paralyzes', 'Conflict avoidance at any cost']
    },
    vocation: {
      pt: 'Sua vocação está onde cuidado encontra estrutura: saúde, educação infantil, serviço social, recursos humanos, administração de pessoas ou hospitalidade.',
      'pt-pt': 'A tua vocação está onde cuidado encontra estrutura: saúde, educação infantil, serviço social, recursos humanos, administração de pessoas ou hospitalidade.',
      en: 'Your vocation is where care meets structure: health, early childhood education, social work, human resources, people management, or hospitality.'
    },
    traps: {
      pt: ['Vício mental: antecipar necessidades dos outros', 'Vício emocional: ser necessário como identidade', 'Vício espiritual: mártir silencioso que não pede'],
      'pt-pt': ['Vício mental: antecipar necessidades dos outros', 'Vício emocional: ser necessário como identidade', 'Vício espiritual: mártir silencioso que não pede'],
      en: ['Mental addiction: anticipating others\' needs', 'Emotional addiction: being needed as identity', 'Spiritual addiction: silent martyr who doesn\'t ask']
    },
    sevenDayPlan: {
      pt: ['Peça claramente algo que você precisa', 'Diga não a um pedido sem culpa', 'Deixe alguém cuidar de você', 'Expresse um descontentamento guardado', 'Faça algo prazeroso só para você', 'Aceite ajuda sem resistir', 'Celebre seu valor, não só seu serviço'],
      'pt-pt': ['Pede claramente algo que precisas', 'Diz não a um pedido sem culpa', 'Deixa alguém cuidar de ti', 'Expressa um descontentamento guardado', 'Faz algo prazeroso só para ti', 'Aceita ajuda sem resistir', 'Celebra o teu valor, não só o teu serviço'],
      en: ['Clearly ask for something you need', 'Say no to a request without guilt', 'Let someone take care of you', 'Express a stored discontent', 'Do something pleasurable just for yourself', 'Accept help without resisting', 'Celebrate your value, not just your service']
    }
  },
  ESTJ: {
    subtitle: { pt: 'Líder prático que faz acontecer', 'pt-pt': 'Líder prático que faz acontecer', en: 'Practical leader who makes it happen' },
    light: {
      pt: ['Liderança operacional que entrega', 'Organização impecável de processos', 'Determinação que supera obstáculos', 'Clareza de direção que guia equipes', 'Responsabilidade exemplar'],
      'pt-pt': ['Liderança operacional que entrega', 'Organização impecável de processos', 'Determinação que supera obstáculos', 'Clareza de direção que guia equipas', 'Responsabilidade exemplar'],
      en: ['Operational leadership that delivers', 'Impeccable process organization', 'Determination that overcomes obstacles', 'Clarity of direction that guides teams', 'Exemplary responsibility']
    },
    shadow: {
      pt: ['Inflexibilidade com métodos diferentes', 'Autoritarismo que não aceita questionamento', 'Dificuldade com emoções alheias', 'Julgamento rápido de quem falha', 'Workaholismo que ignora relacionamentos'],
      'pt-pt': ['Inflexibilidade com métodos diferentes', 'Autoritarismo que não aceita questionamento', 'Dificuldade com emoções alheias', 'Julgamento rápido de quem falha', 'Workaholismo que ignora relacionamentos'],
      en: ['Inflexibility with different methods', 'Authoritarianism that doesn\'t accept questioning', 'Difficulty with others\' emotions', 'Quick judgment of those who fail', 'Workaholism that ignores relationships']
    },
    vocation: {
      pt: 'Sua vocação está onde liderança encontra operação: gestão, direção de empresas, administração, logística, projetos ou operações.',
      'pt-pt': 'A tua vocação está onde liderança encontra operação: gestão, direção de empresas, administração, logística, projetos ou operações.',
      en: 'Your vocation is where leadership meets operation: management, company direction, administration, logistics, projects, or operations.'
    },
    traps: {
      pt: ['Vício mental: eficiência acima de tudo', 'Vício emocional: controle como segurança', 'Vício espiritual: justiça própria que condena'],
      'pt-pt': ['Vício mental: eficiência acima de tudo', 'Vício emocional: controlo como segurança', 'Vício espiritual: justiça própria que condena'],
      en: ['Mental addiction: efficiency above all', 'Emotional addiction: control as security', 'Spiritual addiction: self-righteousness that condemns']
    },
    sevenDayPlan: {
      pt: ['Ouça alguém sem tentar resolver', 'Aceite uma forma diferente de fazer', 'Descanse um dia sem sentir culpa', 'Pergunte como alguém se sente de verdade', 'Delegue algo completamente', 'Admita uma incerteza sua', 'Celebre um relacionamento, não só um resultado'],
      'pt-pt': ['Ouve alguém sem tentar resolver', 'Aceita uma forma diferente de fazer', 'Descansa um dia sem sentir culpa', 'Pergunta como alguém se sente de verdade', 'Delega algo completamente', 'Admite uma incerteza tua', 'Celebra um relacionamento, não só um resultado'],
      en: ['Listen to someone without trying to solve', 'Accept a different way of doing', 'Rest a day without feeling guilty', 'Ask how someone truly feels', 'Delegate something completely', 'Admit an uncertainty of yours', 'Celebrate a relationship, not just a result']
    }
  },
  ESFJ: {
    subtitle: { pt: 'Coração generoso que nutre comunidade', 'pt-pt': 'Coração generoso que nutre comunidade', en: 'Generous heart that nurtures community' },
    light: {
      pt: ['Generosidade natural que acolhe', 'Habilidade social que constrói pontes', 'Cuidado prático que resolve', 'Capacidade de criar comunidade', 'Lealdade ativa que protege'],
      'pt-pt': ['Generosidade natural que acolhe', 'Habilidade social que constrói pontes', 'Cuidado prático que resolve', 'Capacidade de criar comunidade', 'Lealdade ativa que protege'],
      en: ['Natural generosity that welcomes', 'Social ability that builds bridges', 'Practical care that solves', 'Ability to create community', 'Active loyalty that protects']
    },
    shadow: {
      pt: ['Dependência de aprovação social', 'Dificuldade em receber críticas', 'Necessidade de controle social', 'Fofoca como forma de defesa', 'Negligência de si mesmo'],
      'pt-pt': ['Dependência de aprovação social', 'Dificuldade em receber críticas', 'Necessidade de controlo social', 'Fofoca como forma de defesa', 'Negligência de si mesmo'],
      en: ['Dependency on social approval', 'Difficulty receiving criticism', 'Need for social control', 'Gossip as a form of defense', 'Self-neglect']
    },
    vocation: {
      pt: 'Sua vocação está onde cuidado encontra comunidade: saúde, educação, eventos, recursos humanos, hospitalidade, ministério ou serviço social.',
      'pt-pt': 'A tua vocação está onde cuidado encontra comunidade: saúde, educação, eventos, recursos humanos, hospitalidade, ministério ou serviço social.',
      en: 'Your vocation is where care meets community: health, education, events, human resources, hospitality, ministry, or social work.'
    },
    traps: {
      pt: ['Vício mental: agradar a todos', 'Vício emocional: ser querido como necessidade', 'Vício espiritual: obras como identidade'],
      'pt-pt': ['Vício mental: agradar a todos', 'Vício emocional: ser querido como necessidade', 'Vício espiritual: obras como identidade'],
      en: ['Mental addiction: pleasing everyone', 'Emotional addiction: being liked as a need', 'Spiritual addiction: works as identity']
    },
    sevenDayPlan: {
      pt: ['Diga não a um pedido social', 'Aceite uma crítica sem se defender', 'Faça algo prazeroso só para você', 'Fique sozinho por 2 horas', 'Expresse uma opinião impopular', 'Peça algo que você precisa', 'Celebre quem você é, não o que faz pelos outros'],
      'pt-pt': ['Diz não a um pedido social', 'Aceita uma crítica sem te defenderes', 'Faz algo prazeroso só para ti', 'Fica sozinho por 2 horas', 'Expressa uma opinião impopular', 'Pede algo que precisas', 'Celebra quem és, não o que fazes pelos outros'],
      en: ['Say no to a social request', 'Accept criticism without defending yourself', 'Do something pleasurable just for yourself', 'Stay alone for 2 hours', 'Express an unpopular opinion', 'Ask for something you need', 'Celebrate who you are, not what you do for others']
    }
  },
  ISTP: {
    subtitle: { pt: 'Mente prática que resolve com as mãos', 'pt-pt': 'Mente prática que resolve com as mãos', en: 'Practical mind that solves with hands' },
    light: {
      pt: ['Habilidade técnica excepcional', 'Calma sob pressão admirável', 'Pragmatismo eficiente', 'Independência que liberta', 'Resolução criativa de problemas'],
      'pt-pt': ['Habilidade técnica excepcional', 'Calma sob pressão admirável', 'Pragmatismo eficiente', 'Independência que liberta', 'Resolução criativa de problemas'],
      en: ['Exceptional technical skill', 'Admirable calm under pressure', 'Efficient pragmatism', 'Independence that liberates', 'Creative problem solving']
    },
    shadow: {
      pt: ['Distância emocional que afasta', 'Impulsividade em momentos errados', 'Tédio fácil com rotina', 'Dificuldade com compromissos longos', 'Comunicação limitada de sentimentos'],
      'pt-pt': ['Distância emocional que afasta', 'Impulsividade em momentos errados', 'Tédio fácil com rotina', 'Dificuldade com compromissos longos', 'Comunicação limitada de sentimentos'],
      en: ['Emotional distance that pushes away', 'Impulsivity at wrong moments', 'Easy boredom with routine', 'Difficulty with long commitments', 'Limited communication of feelings']
    },
    vocation: {
      pt: 'Sua vocação está onde técnica encontra liberdade: engenharia, mecânica, tecnologia, esportes, artesanato ou trabalho de emergência.',
      'pt-pt': 'A tua vocação está onde técnica encontra liberdade: engenharia, mecânica, tecnologia, desportos, artesanato ou trabalho de emergência.',
      en: 'Your vocation is where technique meets freedom: engineering, mechanics, technology, sports, crafts, or emergency work.'
    },
    traps: {
      pt: ['Vício mental: adrenalina como combustível', 'Vício emocional: evitar sentimentos profundos', 'Vício espiritual: autossuficiência total'],
      'pt-pt': ['Vício mental: adrenalina como combustível', 'Vício emocional: evitar sentimentos profundos', 'Vício espiritual: autossuficiência total'],
      en: ['Mental addiction: adrenaline as fuel', 'Emotional addiction: avoiding deep feelings', 'Spiritual addiction: total self-sufficiency']
    },
    sevenDayPlan: {
      pt: ['Converse sobre seus sentimentos', 'Mantenha um compromisso rotineiro', 'Planeje algo com uma semana de antecedência', 'Expresse gratidão em voz alta', 'Peça ajuda para algo', 'Fique parado por 20 minutos', 'Celebre uma conexão emocional'],
      'pt-pt': ['Conversa sobre os teus sentimentos', 'Mantém um compromisso rotineiro', 'Planeia algo com uma semana de antecedência', 'Expressa gratidão em voz alta', 'Pede ajuda para algo', 'Fica parado por 20 minutos', 'Celebra uma conexão emocional'],
      en: ['Talk about your feelings', 'Keep a routine commitment', 'Plan something a week in advance', 'Express gratitude out loud', 'Ask for help with something', 'Stay still for 20 minutes', 'Celebrate an emotional connection']
    }
  },
  ISFP: {
    subtitle: { pt: 'Alma sensível que expressa beleza', 'pt-pt': 'Alma sensível que expressa beleza', en: 'Sensitive soul that expresses beauty' },
    light: {
      pt: ['Sensibilidade artística profunda', 'Autenticidade emocional genuína', 'Gentileza natural que acolhe', 'Presença no momento que inspira', 'Expressão criativa única'],
      'pt-pt': ['Sensibilidade artística profunda', 'Autenticidade emocional genuína', 'Gentileza natural que acolhe', 'Presença no momento que inspira', 'Expressão criativa única'],
      en: ['Deep artistic sensitivity', 'Genuine emotional authenticity', 'Natural gentleness that welcomes', 'Presence in the moment that inspires', 'Unique creative expression']
    },
    shadow: {
      pt: ['Evitação de conflitos necessários', 'Dificuldade com planejamento', 'Sensibilidade excessiva a críticas', 'Fuga para o mundo interno', 'Procrastinação de decisões'],
      'pt-pt': ['Evitação de conflitos necessários', 'Dificuldade com planeamento', 'Sensibilidade excessiva a críticas', 'Fuga para o mundo interno', 'Procrastinação de decisões'],
      en: ['Avoidance of necessary conflicts', 'Difficulty with planning', 'Excessive sensitivity to criticism', 'Escape to the inner world', 'Decision procrastination']
    },
    vocation: {
      pt: 'Sua vocação está onde sensibilidade encontra expressão: arte, design, música, natureza, cuidado ou terapias corporais.',
      'pt-pt': 'A tua vocação está onde sensibilidade encontra expressão: arte, design, música, natureza, cuidado ou terapias corporais.',
      en: 'Your vocation is where sensitivity meets expression: art, design, music, nature, care, or body therapies.'
    },
    traps: {
      pt: ['Vício mental: evitar desconforto a todo custo', 'Vício emocional: harmonia acima de tudo', 'Vício espiritual: passividade que evita ação'],
      'pt-pt': ['Vício mental: evitar desconforto a todo custo', 'Vício emocional: harmonia acima de tudo', 'Vício espiritual: passividade que evita ação'],
      en: ['Mental addiction: avoiding discomfort at all costs', 'Emotional addiction: harmony above all', 'Spiritual addiction: passivity that avoids action']
    },
    sevenDayPlan: {
      pt: ['Enfrente um pequeno conflito hoje', 'Planeje algo para a próxima semana', 'Expresse uma opinião forte', 'Saia da zona de conforto', 'Termine algo importante', 'Defenda uma posição sua', 'Celebre sua força, não só sua gentileza'],
      'pt-pt': ['Enfrenta um pequeno conflito hoje', 'Planeia algo para a próxima semana', 'Expressa uma opinião forte', 'Sai da zona de conforto', 'Termina algo importante', 'Defende uma posição tua', 'Celebra a tua força, não só a tua gentileza'],
      en: ['Face a small conflict today', 'Plan something for next week', 'Express a strong opinion', 'Leave the comfort zone', 'Finish something important', 'Defend a position of yours', 'Celebrate your strength, not just your gentleness']
    }
  },
  ESTP: {
    subtitle: { pt: 'Energia que transforma ação em resultado', 'pt-pt': 'Energia que transforma ação em resultado', en: 'Energy that transforms action into result' },
    light: {
      pt: ['Ação imediata que resolve', 'Adaptabilidade impressionante', 'Pragmatismo que funciona', 'Presença magnética que atrai', 'Coragem natural para arriscar'],
      'pt-pt': ['Ação imediata que resolve', 'Adaptabilidade impressionante', 'Pragmatismo que funciona', 'Presença magnética que atrai', 'Coragem natural para arriscar'],
      en: ['Immediate action that solves', 'Impressive adaptability', 'Pragmatism that works', 'Magnetic presence that attracts', 'Natural courage to take risks']
    },
    shadow: {
      pt: ['Impulsividade que gera arrependimento', 'Dificuldade com planejamento longo', 'Insensibilidade emocional não intencional', 'Tédio fácil com rotina', 'Risco excessivo que prejudica'],
      'pt-pt': ['Impulsividade que gera arrependimento', 'Dificuldade com planeamento longo', 'Insensibilidade emocional não intencional', 'Tédio fácil com rotina', 'Risco excessivo que prejudica'],
      en: ['Impulsivity that generates regret', 'Difficulty with long-term planning', 'Unintentional emotional insensitivity', 'Easy boredom with routine', 'Excessive risk that harms']
    },
    vocation: {
      pt: 'Sua vocação está onde ação encontra resultado: vendas, esportes, empreendedorismo, emergências, negociação ou liderança de campo.',
      'pt-pt': 'A tua vocação está onde ação encontra resultado: vendas, desportos, empreendedorismo, emergências, negociação ou liderança de campo.',
      en: 'Your vocation is where action meets result: sales, sports, entrepreneurship, emergencies, negotiation, or field leadership.'
    },
    traps: {
      pt: ['Vício mental: adrenalina constante', 'Vício emocional: excitação como combustível', 'Vício espiritual: independência radical que isola'],
      'pt-pt': ['Vício mental: adrenalina constante', 'Vício emocional: excitação como combustível', 'Vício espiritual: independência radical que isola'],
      en: ['Mental addiction: constant adrenaline', 'Emotional addiction: excitement as fuel', 'Spiritual addiction: radical independence that isolates']
    },
    sevenDayPlan: {
      pt: ['Planeje algo com 1 semana de antecedência', 'Ouça alguém por 10 minutos sem interromper', 'Evite um risco desnecessário', 'Reflita antes de agir hoje', 'Expresse um sentimento profundo', 'Fique parado por 15 minutos', 'Celebre paciência, não só velocidade'],
      'pt-pt': ['Planeia algo com 1 semana de antecedência', 'Ouve alguém por 10 minutos sem interromper', 'Evita um risco desnecessário', 'Reflete antes de agir hoje', 'Expressa um sentimento profundo', 'Fica parado por 15 minutos', 'Celebra paciência, não só velocidade'],
      en: ['Plan something 1 week in advance', 'Listen to someone for 10 minutes without interrupting', 'Avoid an unnecessary risk', 'Reflect before acting today', 'Express a deep feeling', 'Stay still for 15 minutes', 'Celebrate patience, not just speed']
    }
  },
  ESFP: {
    subtitle: { pt: 'Energia vibrante que ilumina o momento', 'pt-pt': 'Energia vibrante que ilumina o momento', en: 'Vibrant energy that illuminates the moment' },
    light: {
      pt: ['Alegria contagiante que transforma', 'Presença magnética que cativa', 'Espontaneidade que liberta', 'Conexão imediata com pessoas', 'Celebração da vida presente'],
      'pt-pt': ['Alegria contagiante que transforma', 'Presença magnética que cativa', 'Espontaneidade que liberta', 'Conexão imediata com pessoas', 'Celebração da vida presente'],
      en: ['Contagious joy that transforms', 'Magnetic presence that captivates', 'Spontaneity that liberates', 'Immediate connection with people', 'Celebration of present life']
    },
    shadow: {
      pt: ['Fuga de responsabilidades difíceis', 'Dificuldade com planejamento longo', 'Busca constante de estímulo novo', 'Evitação de profundidade emocional', 'Sensibilidade à crítica que fere'],
      'pt-pt': ['Fuga de responsabilidades difíceis', 'Dificuldade com planeamento longo', 'Busca constante de estímulo novo', 'Evitação de profundidade emocional', 'Sensibilidade à crítica que fere'],
      en: ['Escaping difficult responsibilities', 'Difficulty with long-term planning', 'Constant search for new stimulus', 'Avoidance of emotional depth', 'Sensitivity to criticism that hurts']
    },
    vocation: {
      pt: 'Sua vocação está onde alegria encontra pessoas: entretenimento, eventos, vendas, hospitalidade, educação infantil ou relações públicas.',
      'pt-pt': 'A tua vocação está onde alegria encontra pessoas: entretenimento, eventos, vendas, hospitalidade, educação infantil ou relações públicas.',
      en: 'Your vocation is where joy meets people: entertainment, events, sales, hospitality, early childhood education, or public relations.'
    },
    traps: {
      pt: ['Vício mental: estímulo constante como necessidade', 'Vício emocional: atenção como validação', 'Vício espiritual: superficialidade que evita dor'],
      'pt-pt': ['Vício mental: estímulo constante como necessidade', 'Vício emocional: atenção como validação', 'Vício espiritual: superficialidade que evita dor'],
      en: ['Mental addiction: constant stimulus as need', 'Emotional addiction: attention as validation', 'Spiritual addiction: superficiality that avoids pain']
    },
    sevenDayPlan: {
      pt: ['Fique sozinho por 2 horas sem entretenimento', 'Converse sobre algo profundo', 'Cumpra uma responsabilidade mesmo sendo chata', 'Aceite uma crítica sem reagir', 'Planeje algo para o próximo mês', 'Reflita em silêncio por 15 minutos', 'Celebre profundidade, não só alegria'],
      'pt-pt': ['Fica sozinho por 2 horas sem entretenimento', 'Conversa sobre algo profundo', 'Cumpre uma responsabilidade mesmo sendo chata', 'Aceita uma crítica sem reagir', 'Planeia algo para o próximo mês', 'Reflete em silêncio por 15 minutos', 'Celebra profundidade, não só alegria'],
      en: ['Stay alone for 2 hours without entertainment', 'Talk about something deep', 'Fulfill a responsibility even if boring', 'Accept criticism without reacting', 'Plan something for next month', 'Reflect in silence for 15 minutes', 'Celebrate depth, not just joy']
    }
  }
};

// Dynamic content generators
export function getDeepSummary(type: string, lang: 'pt' | 'pt-pt' | 'en'): string {
  const summaries: Record<string, Record<string, string>> = {
    INTJ: {
      pt: 'Você tende a enxergar sistemas e padrões onde outros veem caos. Sua mente trabalha em camadas de análise, buscando sempre a melhor estratégia. Ao mesmo tempo, pode se frustrar quando o mundo não segue sua lógica, e a conexão emocional pode parecer um desvio do caminho.',
      'pt-pt': 'Tendes a ver sistemas e padrões onde outros veem caos. A tua mente trabalha em camadas de análise, buscando sempre a melhor estratégia. Ao mesmo tempo, podes frustrar-te quando o mundo não segue a tua lógica, e a conexão emocional pode parecer um desvio do caminho.',
      en: 'You tend to see systems and patterns where others see chaos. Your mind works in layers of analysis, always seeking the best strategy. At the same time, you may get frustrated when the world doesn\'t follow your logic, and emotional connection may feel like a detour.'
    },
    INTP: {
      pt: 'Você vive explorando ideias, teorias e conceitos. Sua mente é um laboratório onde tudo é questionado e testado. A tensão interna está entre o mundo infinito das ideias e a necessidade de agir na realidade prática.',
      'pt-pt': 'Vives a explorar ideias, teorias e conceitos. A tua mente é um laboratório onde tudo é questionado e testado. A tensão interna está entre o mundo infinito das ideias e a necessidade de agir na realidade prática.',
      en: 'You live exploring ideas, theories, and concepts. Your mind is a laboratory where everything is questioned and tested. The internal tension is between the infinite world of ideas and the need to act in practical reality.'
    },
    ENTJ: {
      pt: 'Você nasce para liderar, organizar e transformar. Sua energia mobiliza pessoas em direção a objetivos ambiciosos. A tensão está entre a necessidade de controle e a sabedoria de confiar e delegar.',
      'pt-pt': 'Nasces para liderar, organizar e transformar. A tua energia mobiliza pessoas em direção a objetivos ambiciosos. A tensão está entre a necessidade de controlo e a sabedoria de confiar e delegar.',
      en: 'You are born to lead, organize, and transform. Your energy mobilizes people toward ambitious goals. The tension is between the need for control and the wisdom to trust and delegate.'
    },
    ENTP: {
      pt: 'Você vê possibilidades onde outros veem obstáculos. Sua mente conecta ideias de formas surpreendentes e adora desafiar o status quo. A tensão interna está entre a excitação de novas ideias e a necessidade de focar e concluir.',
      'pt-pt': 'Vês possibilidades onde outros veem obstáculos. A tua mente conecta ideias de formas surpreendentes e adoras desafiar o status quo. A tensão interna está entre a excitação de novas ideias e a necessidade de focar e concluir.',
      en: 'You see possibilities where others see obstacles. Your mind connects ideas in surprising ways and loves to challenge the status quo. The internal tension is between the excitement of new ideas and the need to focus and conclude.'
    },
    INFJ: {
      pt: 'Você enxerga além da superfície das pessoas e situações. Sua intuição é profunda e seu propósito é claro. A tensão está entre o desejo de ajudar todos e a necessidade de cuidar de si mesmo.',
      'pt-pt': 'Vês além da superfície das pessoas e situações. A tua intuição é profunda e o teu propósito é claro. A tensão está entre o desejo de ajudar todos e a necessidade de cuidar de ti mesmo.',
      en: 'You see beyond the surface of people and situations. Your intuition is deep and your purpose is clear. The tension is between the desire to help everyone and the need to take care of yourself.'
    },
    INFP: {
      pt: 'Você vive em um mundo de significados, valores e emoções profundas. Sua autenticidade é sua bússola. A tensão interna está entre o idealismo que sonha e a realidade que exige ação prática.',
      'pt-pt': 'Vives num mundo de significados, valores e emoções profundas. A tua autenticidade é a tua bússola. A tensão interna está entre o idealismo que sonha e a realidade que exige ação prática.',
      en: 'You live in a world of meanings, values, and deep emotions. Your authenticity is your compass. The internal tension is between the idealism that dreams and the reality that demands practical action.'
    },
    ENFJ: {
      pt: 'Você nasce para inspirar, guiar e desenvolver pessoas. Sua energia contagia e sua visão eleva. A tensão está entre doar-se aos outros e preservar suas próprias necessidades.',
      'pt-pt': 'Nasces para inspirar, guiar e desenvolver pessoas. A tua energia contagia e a tua visão eleva. A tensão está entre doares-te aos outros e preservar as tuas próprias necessidades.',
      en: 'You are born to inspire, guide, and develop people. Your energy is contagious and your vision elevates. The tension is between giving yourself to others and preserving your own needs.'
    },
    ENFP: {
      pt: 'Você vê potencial em tudo e em todos. Sua energia é expansiva e sua criatividade contagiante. A tensão interna está entre explorar infinitas possibilidades e manter foco em uma direção.',
      'pt-pt': 'Vês potencial em tudo e em todos. A tua energia é expansiva e a tua criatividade contagiante. A tensão interna está entre explorar infinitas possibilidades e manter foco numa direção.',
      en: 'You see potential in everything and everyone. Your energy is expansive and your creativity contagious. The internal tension is between exploring infinite possibilities and maintaining focus in one direction.'
    },
    ISTJ: {
      pt: 'Você é a rocha onde outros se apoiam. Sua consistência e integridade criam estrutura e segurança. A tensão está entre honrar tradições e se abrir para o novo.',
      'pt-pt': 'És a rocha onde outros se apoiam. A tua consistência e integridade criam estrutura e segurança. A tensão está entre honrar tradições e abrir-te para o novo.',
      en: 'You are the rock others lean on. Your consistency and integrity create structure and security. The tension is between honoring traditions and opening up to the new.'
    },
    ISFJ: {
      pt: 'Você cuida com profundidade e constância. Sua presença cria segurança e seu amor se manifesta em ações práticas. A tensão está entre servir aos outros e pedir o que você precisa.',
      'pt-pt': 'Cuidas com profundidade e constância. A tua presença cria segurança e o teu amor manifesta-se em ações práticas. A tensão está entre servir aos outros e pedir o que precisas.',
      en: 'You care with depth and constancy. Your presence creates security and your love manifests in practical actions. The tension is between serving others and asking for what you need.'
    },
    ESTJ: {
      pt: 'Você organiza, dirige e executa. Sua clareza de visão transforma planos em realidade. A tensão está entre a eficiência que busca e a flexibilidade que às vezes é necessária.',
      'pt-pt': 'Organizas, diriges e executas. A tua clareza de visão transforma planos em realidade. A tensão está entre a eficiência que buscas e a flexibilidade que às vezes é necessária.',
      en: 'You organize, direct, and execute. Your clarity of vision turns plans into reality. The tension is between the efficiency you seek and the flexibility that is sometimes needed.'
    },
    ESFJ: {
      pt: 'Você cria harmonia, conexão e pertencimento. Sua generosidade constrói comunidades. A tensão está entre cuidar de todos e permitir-se receber cuidado.',
      'pt-pt': 'Crias harmonia, conexão e pertença. A tua generosidade constrói comunidades. A tensão está entre cuidar de todos e permitires-te receber cuidado.',
      en: 'You create harmony, connection, and belonging. Your generosity builds communities. The tension is between caring for everyone and allowing yourself to receive care.'
    },
    ISTP: {
      pt: 'Você entende como as coisas funcionam e resolve problemas com elegância prática. Sua calma sob pressão é admirável. A tensão está entre a liberdade que busca e os compromissos que a vida exige.',
      'pt-pt': 'Entendes como as coisas funcionam e resolves problemas com elegância prática. A tua calma sob pressão é admirável. A tensão está entre a liberdade que buscas e os compromissos que a vida exige.',
      en: 'You understand how things work and solve problems with practical elegance. Your calm under pressure is admirable. The tension is between the freedom you seek and the commitments life demands.'
    },
    ISFP: {
      pt: 'Você sente profundamente e expressa com autenticidade. Sua sensibilidade cria beleza. A tensão está entre viver no momento presente e planejar para o futuro.',
      'pt-pt': 'Sentes profundamente e expressas com autenticidade. A tua sensibilidade cria beleza. A tensão está entre viver no momento presente e planear para o futuro.',
      en: 'You feel deeply and express authentically. Your sensitivity creates beauty. The tension is between living in the present moment and planning for the future.'
    },
    ESTP: {
      pt: 'Você vive intensamente no presente. Sua energia prática resolve problemas em tempo real. A tensão está entre agir imediatamente e refletir antes de decidir.',
      'pt-pt': 'Vives intensamente no presente. A tua energia prática resolve problemas em tempo real. A tensão está entre agir imediatamente e refletir antes de decidir.',
      en: 'You live intensely in the present. Your practical energy solves problems in real time. The tension is between acting immediately and reflecting before deciding.'
    },
    ESFP: {
      pt: 'Você traz alegria, vida e celebração onde passa. Sua presença magnética transforma qualquer ambiente. A tensão está entre aproveitar o momento e construir para o futuro.',
      'pt-pt': 'Trazes alegria, vida e celebração por onde passas. A tua presença magnética transforma qualquer ambiente. A tensão está entre aproveitar o momento e construir para o futuro.',
      en: 'You bring joy, life, and celebration wherever you go. Your magnetic presence transforms any environment. The tension is between enjoying the moment and building for the future.'
    }
  };
  
  return summaries[type]?.[lang] || summaries.INTJ[lang];
}

export function getMindInPractice(type: string, lang: 'pt' | 'pt-pt' | 'en'): {
  energy: string;
  perception: string;
  decision: string;
  lifestyle: string;
} {
  const firstLetter = type[0]; // E or I
  const secondLetter = type[1]; // S or N
  const thirdLetter = type[2]; // T or F
  const fourthLetter = type[3]; // J or P
  
  const energyTexts = {
    E: {
      pt: 'Você recarrega energia em interações sociais. Pensa em voz alta e se sente mais vivo quando está conectado com pessoas.',
      'pt-pt': 'Recarregas energia em interações sociais. Pensas em voz alta e sentes-te mais vivo quando estás conectado com pessoas.',
      en: 'You recharge through social interactions. You think out loud and feel most alive when connected with people.'
    },
    I: {
      pt: 'Você recarrega energia em momentos de silêncio e reflexão. Processa internamente antes de compartilhar e precisa de espaço para pensar.',
      'pt-pt': 'Recarregas energia em momentos de silêncio e reflexão. Processas internamente antes de partilhar e precisas de espaço para pensar.',
      en: 'You recharge through silence and reflection. You process internally before sharing and need space to think.'
    }
  };
  
  const perceptionTexts = {
    S: {
      pt: 'Você confia no que pode ver, tocar e experimentar. Valoriza fatos concretos e detalhes práticos do presente.',
      'pt-pt': 'Confias no que podes ver, tocar e experimentar. Valorizas factos concretos e detalhes práticos do presente.',
      en: 'You trust what you can see, touch, and experience. You value concrete facts and practical details of the present.'
    },
    N: {
      pt: 'Você enxerga padrões, possibilidades e conexões. Pensa no futuro e se interessa mais por significados do que por detalhes.',
      'pt-pt': 'Vês padrões, possibilidades e conexões. Pensas no futuro e interessas-te mais por significados do que por detalhes.',
      en: 'You see patterns, possibilities, and connections. You think about the future and are more interested in meanings than details.'
    }
  };
  
  const decisionTexts = {
    T: {
      pt: 'Você decide baseado em lógica e análise objetiva. Busca a verdade mesmo que seja desconfortável e valoriza justiça acima de harmonia.',
      'pt-pt': 'Decides baseado em lógica e análise objetiva. Buscas a verdade mesmo que seja desconfortável e valorizas justiça acima de harmonia.',
      en: 'You decide based on logic and objective analysis. You seek truth even if uncomfortable and value justice over harmony.'
    },
    F: {
      pt: 'Você decide considerando valores e impacto nas pessoas. Busca harmonia e se importa profundamente com como suas decisões afetam outros.',
      'pt-pt': 'Decides considerando valores e impacto nas pessoas. Buscas harmonia e importas-te profundamente com como as tuas decisões afetam outros.',
      en: 'You decide considering values and impact on people. You seek harmony and care deeply about how your decisions affect others.'
    }
  };
  
  const lifestyleTexts = {
    J: {
      pt: 'Você prefere estrutura, planejamento e decisões tomadas. Sente-se melhor quando tem controle sobre seu ambiente e cronograma.',
      'pt-pt': 'Preferes estrutura, planeamento e decisões tomadas. Sentes-te melhor quando tens controlo sobre o teu ambiente e cronograma.',
      en: 'You prefer structure, planning, and decisions made. You feel better when you have control over your environment and schedule.'
    },
    P: {
      pt: 'Você prefere flexibilidade, espontaneidade e opções abertas. Adapta-se facilmente e sente-se sufocado por estruturas rígidas.',
      'pt-pt': 'Preferes flexibilidade, espontaneidade e opções abertas. Adaptas-te facilmente e sentes-te sufocado por estruturas rígidas.',
      en: 'You prefer flexibility, spontaneity, and open options. You adapt easily and feel suffocated by rigid structures.'
    }
  };
  
  return {
    energy: energyTexts[firstLetter as 'E' | 'I'][lang],
    perception: perceptionTexts[secondLetter as 'S' | 'N'][lang],
    decision: decisionTexts[thirdLetter as 'T' | 'F'][lang],
    lifestyle: lifestyleTexts[fourthLetter as 'J' | 'P'][lang]
  };
}

export function getSelfExamQuestion(type: string, lang: 'pt' | 'pt-pt' | 'en'): string {
  const questions: Record<string, Record<string, string>> = {
    INTJ: {
      pt: 'Onde na sua vida você está sendo tão estratégico que se esqueceu de viver o presente?',
      'pt-pt': 'Onde na tua vida estás a ser tão estratégico que te esqueceste de viver o presente?',
      en: 'Where in your life are you being so strategic that you forgot to live the present?'
    },
    INTP: {
      pt: 'Qual ideia você está evitando transformar em ação por medo de que não seja perfeita?',
      'pt-pt': 'Qual ideia estás a evitar transformar em ação por medo de que não seja perfeita?',
      en: 'Which idea are you avoiding turning into action for fear it won\'t be perfect?'
    },
    ENTJ: {
      pt: 'Quem ao seu redor precisa que você ouça mais do que lidere?',
      'pt-pt': 'Quem ao teu redor precisa que ouças mais do que lideres?',
      en: 'Who around you needs you to listen more than lead?'
    },
    ENTP: {
      pt: 'Qual projeto você precisa terminar antes de iniciar o próximo?',
      'pt-pt': 'Qual projeto precisas de terminar antes de iniciar o próximo?',
      en: 'Which project do you need to finish before starting the next one?'
    },
    INFJ: {
      pt: 'De quem você está tentando cuidar enquanto ignora suas próprias necessidades?',
      'pt-pt': 'De quem estás a tentar cuidar enquanto ignoras as tuas próprias necessidades?',
      en: 'Who are you trying to take care of while ignoring your own needs?'
    },
    INFP: {
      pt: 'Qual sonho você está guardando por medo de ser julgado?',
      'pt-pt': 'Qual sonho estás a guardar por medo de ser julgado?',
      en: 'Which dream are you holding back for fear of being judged?'
    },
    ENFJ: {
      pt: 'Quando foi a última vez que você permitiu que alguém cuidasse de você?',
      'pt-pt': 'Quando foi a última vez que permitiste que alguém cuidasse de ti?',
      en: 'When was the last time you allowed someone to take care of you?'
    },
    ENFP: {
      pt: 'Qual compromisso você está evitando por medo de perder sua liberdade?',
      'pt-pt': 'Qual compromisso estás a evitar por medo de perder a tua liberdade?',
      en: 'Which commitment are you avoiding for fear of losing your freedom?'
    },
    ISTJ: {
      pt: 'Qual regra você segue que já não serve mais ao seu crescimento?',
      'pt-pt': 'Qual regra segues que já não serve mais ao teu crescimento?',
      en: 'Which rule are you following that no longer serves your growth?'
    },
    ISFJ: {
      pt: 'O que você precisa e não está pedindo a ninguém?',
      'pt-pt': 'O que precisas e não estás a pedir a ninguém?',
      en: 'What do you need and are not asking anyone for?'
    },
    ESTJ: {
      pt: 'Onde sua eficiência está prejudicando seus relacionamentos?',
      'pt-pt': 'Onde a tua eficiência está a prejudicar os teus relacionamentos?',
      en: 'Where is your efficiency hurting your relationships?'
    },
    ESFJ: {
      pt: 'O que você faria diferente se não se importasse com a opinião dos outros?',
      'pt-pt': 'O que farias diferente se não te importasses com a opinião dos outros?',
      en: 'What would you do differently if you didn\'t care about others\' opinions?'
    },
    ISTP: {
      pt: 'Qual sentimento você está evitando enfrentar?',
      'pt-pt': 'Qual sentimento estás a evitar enfrentar?',
      en: 'Which feeling are you avoiding facing?'
    },
    ISFP: {
      pt: 'Qual conflito você precisa enfrentar para crescer?',
      'pt-pt': 'Qual conflito precisas de enfrentar para crescer?',
      en: 'Which conflict do you need to face to grow?'
    },
    ESTP: {
      pt: 'Onde na sua vida você está agindo no automático, sem refletir sobre as consequências?',
      'pt-pt': 'Onde na tua vida estás a agir no automático, sem refletir sobre as consequências?',
      en: 'Where in your life are you acting on autopilot, without reflecting on the consequences?'
    },
    ESFP: {
      pt: 'Qual conversa profunda você está evitando ter?',
      'pt-pt': 'Qual conversa profunda estás a evitar ter?',
      en: 'Which deep conversation are you avoiding having?'
    }
  };
  
  return questions[type]?.[lang] || questions.INTJ[lang];
}

export function getDevelopmentGuidance(type: string, lang: 'pt' | 'pt-pt' | 'en'): {
  limitingPattern: string;
  balancingStrength: string;
  immediateAction: string;
  evolutionDirection: string;
} {
  const guidance: Record<string, Record<string, { limitingPattern: string; balancingStrength: string; immediateAction: string; evolutionDirection: string }>> = {
    INTJ: {
      pt: {
        limitingPattern: 'Análise infinita que paralisa a ação e afasta conexões emocionais.',
        balancingStrength: 'Usar sua visão estratégica para também planejar momentos de conexão humana.',
        immediateAction: 'Hoje, pergunte a alguém como ela está se sentindo, e apenas ouça.',
        evolutionDirection: 'Integrar sensibilidade emocional à sua clareza estratégica.'
      },
      'pt-pt': {
        limitingPattern: 'Análise infinita que paralisa a ação e afasta conexões emocionais.',
        balancingStrength: 'Usar a tua visão estratégica para também planear momentos de conexão humana.',
        immediateAction: 'Hoje, pergunta a alguém como ela está a sentir-se, e apenas ouve.',
        evolutionDirection: 'Integrar sensibilidade emocional à tua clareza estratégica.'
      },
      en: {
        limitingPattern: 'Infinite analysis that paralyzes action and pushes away emotional connections.',
        balancingStrength: 'Use your strategic vision to also plan moments of human connection.',
        immediateAction: 'Today, ask someone how they are feeling, and just listen.',
        evolutionDirection: 'Integrate emotional sensitivity into your strategic clarity.'
      }
    },
    INTP: {
      pt: {
        limitingPattern: 'Teorização sem aplicação que mantém você no mundo das ideias.',
        balancingStrength: 'Usar sua criatividade conceitual para resolver um problema real hoje.',
        immediateAction: 'Escolha uma ideia e execute uma ação concreta nas próximas 24 horas.',
        evolutionDirection: 'Transformar conhecimento abstrato em contribuição prática.'
      },
      'pt-pt': {
        limitingPattern: 'Teorização sem aplicação que te mantém no mundo das ideias.',
        balancingStrength: 'Usar a tua criatividade conceptual para resolver um problema real hoje.',
        immediateAction: 'Escolhe uma ideia e executa uma ação concreta nas próximas 24 horas.',
        evolutionDirection: 'Transformar conhecimento abstrato em contribuição prática.'
      },
      en: {
        limitingPattern: 'Theorizing without application that keeps you in the world of ideas.',
        balancingStrength: 'Use your conceptual creativity to solve a real problem today.',
        immediateAction: 'Choose one idea and execute a concrete action in the next 24 hours.',
        evolutionDirection: 'Transform abstract knowledge into practical contribution.'
      }
    },
    ENTJ: {
      pt: {
        limitingPattern: 'Controle excessivo que sufoca colaboração e relacionamentos.',
        balancingStrength: 'Usar sua liderança para também desenvolver e empoderar outros.',
        immediateAction: 'Delegue uma tarefa importante hoje sem supervisionar.',
        evolutionDirection: 'Liderar através da confiança, não apenas do controle.'
      },
      'pt-pt': {
        limitingPattern: 'Controlo excessivo que sufoca colaboração e relacionamentos.',
        balancingStrength: 'Usar a tua liderança para também desenvolver e empoderar outros.',
        immediateAction: 'Delega uma tarefa importante hoje sem supervisionar.',
        evolutionDirection: 'Liderar através da confiança, não apenas do controlo.'
      },
      en: {
        limitingPattern: 'Excessive control that stifles collaboration and relationships.',
        balancingStrength: 'Use your leadership to also develop and empower others.',
        immediateAction: 'Delegate an important task today without supervising.',
        evolutionDirection: 'Lead through trust, not just control.'
      }
    },
    ENTP: {
      pt: {
        limitingPattern: 'Busca por novidade que abandona projetos antes de concluir.',
        balancingStrength: 'Usar sua criatividade para encontrar maneiras interessantes de concluir.',
        immediateAction: 'Termine algo que você começou antes de iniciar qualquer coisa nova.',
        evolutionDirection: 'Construir legado através de consistência, não só de inovação.'
      },
      'pt-pt': {
        limitingPattern: 'Busca por novidade que abandona projetos antes de concluir.',
        balancingStrength: 'Usar a tua criatividade para encontrar maneiras interessantes de concluir.',
        immediateAction: 'Termina algo que começaste antes de iniciar qualquer coisa nova.',
        evolutionDirection: 'Construir legado através de consistência, não só de inovação.'
      },
      en: {
        limitingPattern: 'Search for novelty that abandons projects before completing.',
        balancingStrength: 'Use your creativity to find interesting ways to finish.',
        immediateAction: 'Finish something you started before starting anything new.',
        evolutionDirection: 'Build legacy through consistency, not just innovation.'
      }
    },
    INFJ: {
      pt: {
        limitingPattern: 'Absorver dor alheia enquanto ignora suas próprias necessidades.',
        balancingStrength: 'Usar sua empatia para também reconhecer e honrar o que você precisa.',
        immediateAction: 'Diga não a um pedido de ajuda hoje e use o tempo para você.',
        evolutionDirection: 'Curar outros a partir de sua própria inteireza.'
      },
      'pt-pt': {
        limitingPattern: 'Absorver dor alheia enquanto ignoras as tuas próprias necessidades.',
        balancingStrength: 'Usar a tua empatia para também reconhecer e honrar o que precisas.',
        immediateAction: 'Diz não a um pedido de ajuda hoje e usa o tempo para ti.',
        evolutionDirection: 'Curar outros a partir da tua própria inteireza.'
      },
      en: {
        limitingPattern: 'Absorbing others\' pain while ignoring your own needs.',
        balancingStrength: 'Use your empathy to also recognize and honor what you need.',
        immediateAction: 'Say no to a request for help today and use the time for yourself.',
        evolutionDirection: 'Heal others from your own wholeness.'
      }
    },
    INFP: {
      pt: {
        limitingPattern: 'Idealismo que paralisa a ação por medo de imperfeição.',
        balancingStrength: 'Usar sua criatividade para fazer algo imperfeito mas real.',
        immediateAction: 'Comece algo hoje sem esperar que esteja perfeito.',
        evolutionDirection: 'Manifestar seus valores através de ação, não só de intenção.'
      },
      'pt-pt': {
        limitingPattern: 'Idealismo que paralisa a ação por medo de imperfeição.',
        balancingStrength: 'Usar a tua criatividade para fazer algo imperfeito mas real.',
        immediateAction: 'Começa algo hoje sem esperar que esteja perfeito.',
        evolutionDirection: 'Manifestar os teus valores através de ação, não só de intenção.'
      },
      en: {
        limitingPattern: 'Idealism that paralyzes action for fear of imperfection.',
        balancingStrength: 'Use your creativity to do something imperfect but real.',
        immediateAction: 'Start something today without waiting for it to be perfect.',
        evolutionDirection: 'Manifest your values through action, not just intention.'
      }
    },
    ENFJ: {
      pt: {
        limitingPattern: 'Doar-se aos outros enquanto negligencia suas próprias necessidades.',
        balancingStrength: 'Usar sua capacidade de cuidar para também cuidar de si.',
        immediateAction: 'Faça algo prazeroso só para você nas próximas 24 horas.',
        evolutionDirection: 'Inspirar outros a partir de sua própria plenitude.'
      },
      'pt-pt': {
        limitingPattern: 'Doar-te aos outros enquanto negligenias as tuas próprias necessidades.',
        balancingStrength: 'Usar a tua capacidade de cuidar para também cuidar de ti.',
        immediateAction: 'Faz algo prazeroso só para ti nas próximas 24 horas.',
        evolutionDirection: 'Inspirar outros a partir da tua própria plenitude.'
      },
      en: {
        limitingPattern: 'Giving yourself to others while neglecting your own needs.',
        balancingStrength: 'Use your caring capacity to also take care of yourself.',
        immediateAction: 'Do something pleasurable just for yourself in the next 24 hours.',
        evolutionDirection: 'Inspire others from your own fullness.'
      }
    },
    ENFP: {
      pt: {
        limitingPattern: 'Dispersão de energia em muitas possibilidades sem foco.',
        balancingStrength: 'Usar seu entusiasmo para se comprometer profundamente com uma coisa.',
        immediateAction: 'Escolha uma prioridade e foque nela por 3 horas seguidas.',
        evolutionDirection: 'Criar impacto profundo através de consistência.'
      },
      'pt-pt': {
        limitingPattern: 'Dispersão de energia em muitas possibilidades sem foco.',
        balancingStrength: 'Usar o teu entusiasmo para te comprometeres profundamente com uma coisa.',
        immediateAction: 'Escolhe uma prioridade e foca nela por 3 horas seguidas.',
        evolutionDirection: 'Criar impacto profundo através de consistência.'
      },
      en: {
        limitingPattern: 'Dispersion of energy in many possibilities without focus.',
        balancingStrength: 'Use your enthusiasm to commit deeply to one thing.',
        immediateAction: 'Choose one priority and focus on it for 3 hours straight.',
        evolutionDirection: 'Create deep impact through consistency.'
      }
    },
    ISTJ: {
      pt: {
        limitingPattern: 'Rigidez que resiste a mudanças necessárias.',
        balancingStrength: 'Usar sua disciplina para experimentar algo novo de forma estruturada.',
        immediateAction: 'Quebre uma regra pequena de propósito hoje.',
        evolutionDirection: 'Honrar tradições enquanto abraça evolução.'
      },
      'pt-pt': {
        limitingPattern: 'Rigidez que resiste a mudanças necessárias.',
        balancingStrength: 'Usar a tua disciplina para experimentar algo novo de forma estruturada.',
        immediateAction: 'Quebra uma regra pequena de propósito hoje.',
        evolutionDirection: 'Honrar tradições enquanto abraças evolução.'
      },
      en: {
        limitingPattern: 'Rigidity that resists necessary changes.',
        balancingStrength: 'Use your discipline to try something new in a structured way.',
        immediateAction: 'Break a small rule on purpose today.',
        evolutionDirection: 'Honor traditions while embracing evolution.'
      }
    },
    ISFJ: {
      pt: {
        limitingPattern: 'Auto-sacrifício que esgota e gera ressentimento.',
        balancingStrength: 'Usar sua capacidade de servir para também pedir o que precisa.',
        immediateAction: 'Peça claramente algo que você precisa a alguém hoje.',
        evolutionDirection: 'Servir a partir de abundância, não de esgotamento.'
      },
      'pt-pt': {
        limitingPattern: 'Auto-sacrifício que esgota e gera ressentimento.',
        balancingStrength: 'Usar a tua capacidade de servir para também pedir o que precisas.',
        immediateAction: 'Pede claramente algo que precisas a alguém hoje.',
        evolutionDirection: 'Servir a partir de abundância, não de esgotamento.'
      },
      en: {
        limitingPattern: 'Self-sacrifice that exhausts and generates resentment.',
        balancingStrength: 'Use your service capacity to also ask for what you need.',
        immediateAction: 'Clearly ask someone for something you need today.',
        evolutionDirection: 'Serve from abundance, not exhaustion.'
      }
    },
    ESTJ: {
      pt: {
        limitingPattern: 'Eficiência que ignora necessidades emocionais.',
        balancingStrength: 'Usar sua clareza para também criar espaço para conexão.',
        immediateAction: 'Pergunte a alguém como ela se sente e apenas ouça.',
        evolutionDirection: 'Liderar com eficiência E humanidade.'
      },
      'pt-pt': {
        limitingPattern: 'Eficiência que ignora necessidades emocionais.',
        balancingStrength: 'Usar a tua clareza para também criar espaço para conexão.',
        immediateAction: 'Pergunta a alguém como ela se sente e apenas ouve.',
        evolutionDirection: 'Liderar com eficiência E humanidade.'
      },
      en: {
        limitingPattern: 'Efficiency that ignores emotional needs.',
        balancingStrength: 'Use your clarity to also create space for connection.',
        immediateAction: 'Ask someone how they feel and just listen.',
        evolutionDirection: 'Lead with efficiency AND humanity.'
      }
    },
    ESFJ: {
      pt: {
        limitingPattern: 'Busca por aprovação que ignora suas próprias vontades.',
        balancingStrength: 'Usar sua habilidade social para também expressar suas necessidades.',
        immediateAction: 'Expresse uma opinião impopular hoje.',
        evolutionDirection: 'Ser amado por quem você é, não pelo que faz.'
      },
      'pt-pt': {
        limitingPattern: 'Busca por aprovação que ignora as tuas próprias vontades.',
        balancingStrength: 'Usar a tua habilidade social para também expressar as tuas necessidades.',
        immediateAction: 'Expressa uma opinião impopular hoje.',
        evolutionDirection: 'Ser amado por quem és, não pelo que fazes.'
      },
      en: {
        limitingPattern: 'Search for approval that ignores your own desires.',
        balancingStrength: 'Use your social ability to also express your needs.',
        immediateAction: 'Express an unpopular opinion today.',
        evolutionDirection: 'Be loved for who you are, not what you do.'
      }
    },
    ISTP: {
      pt: {
        limitingPattern: 'Evitação emocional que isola e limita intimidade.',
        balancingStrength: 'Usar sua calma para ter uma conversa emocional difícil.',
        immediateAction: 'Converse sobre um sentimento seu com alguém próximo.',
        evolutionDirection: 'Conectar-se através de vulnerabilidade, não só de competência.'
      },
      'pt-pt': {
        limitingPattern: 'Evitação emocional que isola e limita intimidade.',
        balancingStrength: 'Usar a tua calma para ter uma conversa emocional difícil.',
        immediateAction: 'Conversa sobre um sentimento teu com alguém próximo.',
        evolutionDirection: 'Conectar-se através de vulnerabilidade, não só de competência.'
      },
      en: {
        limitingPattern: 'Emotional avoidance that isolates and limits intimacy.',
        balancingStrength: 'Use your calm to have a difficult emotional conversation.',
        immediateAction: 'Talk about a feeling of yours with someone close.',
        evolutionDirection: 'Connect through vulnerability, not just competence.'
      }
    },
    ISFP: {
      pt: {
        limitingPattern: 'Evitação de conflitos que impede crescimento.',
        balancingStrength: 'Usar sua sensibilidade para enfrentar um conflito com cuidado.',
        immediateAction: 'Enfrente um pequeno conflito que você está evitando.',
        evolutionDirection: 'Expressar-se com força E gentileza.'
      },
      'pt-pt': {
        limitingPattern: 'Evitação de conflitos que impede crescimento.',
        balancingStrength: 'Usar a tua sensibilidade para enfrentar um conflito com cuidado.',
        immediateAction: 'Enfrenta um pequeno conflito que estás a evitar.',
        evolutionDirection: 'Expressar-te com força E gentileza.'
      },
      en: {
        limitingPattern: 'Conflict avoidance that prevents growth.',
        balancingStrength: 'Use your sensitivity to face a conflict with care.',
        immediateAction: 'Face a small conflict you are avoiding.',
        evolutionDirection: 'Express yourself with strength AND gentleness.'
      }
    },
    ESTP: {
      pt: {
        limitingPattern: 'Impulsividade que gera consequências não previstas.',
        balancingStrength: 'Usar sua energia para também refletir antes de agir.',
        immediateAction: 'Antes de sua próxima decisão importante, espere 24 horas.',
        evolutionDirection: 'Agir com velocidade E sabedoria.'
      },
      'pt-pt': {
        limitingPattern: 'Impulsividade que gera consequências não previstas.',
        balancingStrength: 'Usar a tua energia para também refletir antes de agir.',
        immediateAction: 'Antes da tua próxima decisão importante, espera 24 horas.',
        evolutionDirection: 'Agir com velocidade E sabedoria.'
      },
      en: {
        limitingPattern: 'Impulsivity that generates unforeseen consequences.',
        balancingStrength: 'Use your energy to also reflect before acting.',
        immediateAction: 'Before your next important decision, wait 24 hours.',
        evolutionDirection: 'Act with speed AND wisdom.'
      }
    },
    ESFP: {
      pt: {
        limitingPattern: 'Fuga de profundidade emocional e responsabilidades.',
        balancingStrength: 'Usar sua alegria para também abraçar conversas profundas.',
        immediateAction: 'Tenha uma conversa profunda com alguém hoje.',
        evolutionDirection: 'Celebrar a vida com profundidade E alegria.'
      },
      'pt-pt': {
        limitingPattern: 'Fuga de profundidade emocional e responsabilidades.',
        balancingStrength: 'Usar a tua alegria para também abraçar conversas profundas.',
        immediateAction: 'Tem uma conversa profunda com alguém hoje.',
        evolutionDirection: 'Celebrar a vida com profundidade E alegria.'
      },
      en: {
        limitingPattern: 'Escaping emotional depth and responsibilities.',
        balancingStrength: 'Use your joy to also embrace deep conversations.',
        immediateAction: 'Have a deep conversation with someone today.',
        evolutionDirection: 'Celebrate life with depth AND joy.'
      }
    }
  };
  
  return guidance[type]?.[lang] || guidance.INTJ[lang];
}

export function getAIReflection(type: string, userName: string, lang: 'pt' | 'pt-pt' | 'en'): string {
  const reflections: Record<string, Record<string, string>> = {
    INTJ: {
      pt: `${userName}, sua mente é uma ferramenta poderosa de visão e estratégia. Você enxerga sistemas onde outros veem caos, e isso é um dom raro.\n\nMas há algo que preciso te dizer: nem tudo precisa ser analisado, planejado ou controlado. Às vezes, a vida pede que você simplesmente sinta, sem tentar entender.\n\nSua evolução não está em pensar mais, mas em se permitir sentir sem julgamento. As pessoas ao seu redor não são problemas a resolver — são mistérios a amar.`,
      'pt-pt': `${userName}, a tua mente é uma ferramenta poderosa de visão e estratégia. Vês sistemas onde outros veem caos, e isso é um dom raro.\n\nMas há algo que preciso dizer-te: nem tudo precisa ser analisado, planeado ou controlado. Às vezes, a vida pede que simplesmente sintas, sem tentar entender.\n\nA tua evolução não está em pensar mais, mas em permitir-te sentir sem julgamento. As pessoas ao teu redor não são problemas a resolver — são mistérios a amar.`,
      en: `${userName}, your mind is a powerful tool of vision and strategy. You see systems where others see chaos, and that is a rare gift.\n\nBut there's something I need to tell you: not everything needs to be analyzed, planned, or controlled. Sometimes life asks you to simply feel, without trying to understand.\n\nYour evolution is not in thinking more, but in allowing yourself to feel without judgment. The people around you are not problems to solve — they are mysteries to love.`
    },
    INTP: {
      pt: `${userName}, sua mente é um laboratório infinito de ideias e conexões. Você questiona o que outros aceitam, e isso é uma força rara.\n\nMas preciso te lembrar: o mundo real precisa da sua contribuição, não apenas da sua análise. Ideias que não viram ação são apenas potencial não realizado.\n\nSua evolução está em transformar conhecimento em impacto. O mundo não precisa que você entenda tudo — precisa que você compartilhe o que já entendeu.`,
      'pt-pt': `${userName}, a tua mente é um laboratório infinito de ideias e conexões. Questionas o que outros aceitam, e isso é uma força rara.\n\nMas preciso lembrar-te: o mundo real precisa da tua contribuição, não apenas da tua análise. Ideias que não viram ação são apenas potencial não realizado.\n\nA tua evolução está em transformar conhecimento em impacto. O mundo não precisa que entendas tudo — precisa que partilhes o que já entendeste.`,
      en: `${userName}, your mind is an infinite laboratory of ideas and connections. You question what others accept, and that is a rare strength.\n\nBut I need to remind you: the real world needs your contribution, not just your analysis. Ideas that don't become action are just unrealized potential.\n\nYour evolution is in transforming knowledge into impact. The world doesn't need you to understand everything — it needs you to share what you already understand.`
    },
    ENTJ: {
      pt: `${userName}, você nasceu para liderar e transformar. Sua clareza e determinação movem montanhas.\n\nMas liderança verdadeira não é sobre controle — é sobre confiança. Os maiores líderes são aqueles que sabem quando soltar, quando delegar, quando simplesmente confiar.\n\nSua evolução está em liderar através da vulnerabilidade. Mostrar que você também não sabe tudo não diminui sua autoridade — a aumenta.`,
      'pt-pt': `${userName}, nasceste para liderar e transformar. A tua clareza e determinação movem montanhas.\n\nMas liderança verdadeira não é sobre controlo — é sobre confiança. Os maiores líderes são aqueles que sabem quando soltar, quando delegar, quando simplesmente confiar.\n\nA tua evolução está em liderar através da vulnerabilidade. Mostrar que também não sabes tudo não diminui a tua autoridade — aumenta-a.`,
      en: `${userName}, you were born to lead and transform. Your clarity and determination move mountains.\n\nBut true leadership is not about control — it's about trust. The greatest leaders are those who know when to let go, when to delegate, when to simply trust.\n\nYour evolution is in leading through vulnerability. Showing that you don't know everything doesn't diminish your authority — it increases it.`
    },
    ENTP: {
      pt: `${userName}, sua mente é uma explosão criativa de possibilidades. Você vê conexões que ninguém mais vê, e isso é um superpoder.\n\nMas possibilidades infinitas podem ser uma armadilha. A liberdade de começar precisa encontrar a disciplina de concluir.\n\nSua evolução está em construir, não apenas imaginar. O mundo não precisa de mais ideias — precisa das suas ideias transformadas em realidade.`,
      'pt-pt': `${userName}, a tua mente é uma explosão criativa de possibilidades. Vês conexões que ninguém mais vê, e isso é um superpoder.\n\nMas possibilidades infinitas podem ser uma armadilha. A liberdade de começar precisa encontrar a disciplina de concluir.\n\nA tua evolução está em construir, não apenas imaginar. O mundo não precisa de mais ideias — precisa das tuas ideias transformadas em realidade.`,
      en: `${userName}, your mind is a creative explosion of possibilities. You see connections no one else sees, and that is a superpower.\n\nBut infinite possibilities can be a trap. The freedom to start needs to find the discipline to finish.\n\nYour evolution is in building, not just imagining. The world doesn't need more ideas — it needs your ideas transformed into reality.`
    },
    INFJ: {
      pt: `${userName}, você enxerga além da superfície. Sua intuição percebe o que está invisível, e seu coração quer curar o mundo.\n\nMas você não pode curar o mundo se estiver vazio. Absorver a dor dos outros não é amor — é desgaste.\n\nSua evolução está em aprender a cuidar de si com a mesma intensidade que cuida dos outros. Você só pode oferecer o que tem.`,
      'pt-pt': `${userName}, vês além da superfície. A tua intuição percebe o que está invisível, e o teu coração quer curar o mundo.\n\nMas não podes curar o mundo se estiveres vazio. Absorver a dor dos outros não é amor — é desgaste.\n\nA tua evolução está em aprender a cuidar de ti com a mesma intensidade que cuidas dos outros. Só podes oferecer o que tens.`,
      en: `${userName}, you see beyond the surface. Your intuition perceives what is invisible, and your heart wants to heal the world.\n\nBut you cannot heal the world if you are empty. Absorbing others' pain is not love — it's exhaustion.\n\nYour evolution is in learning to care for yourself with the same intensity you care for others. You can only offer what you have.`
    },
    INFP: {
      pt: `${userName}, você vive em um mundo de significados profundos. Sua autenticidade e criatividade são tesouros raros.\n\nMas ideais não realizados são apenas sonhos. A beleza que você enxerga precisa se manifestar no mundo real.\n\nSua evolução está em transformar sentimento em ação. O mundo precisa da sua visão — mas materializada, não apenas sonhada.`,
      'pt-pt': `${userName}, vives num mundo de significados profundos. A tua autenticidade e criatividade são tesouros raros.\n\nMas ideais não realizados são apenas sonhos. A beleza que vês precisa manifestar-se no mundo real.\n\nA tua evolução está em transformar sentimento em ação. O mundo precisa da tua visão — mas materializada, não apenas sonhada.`,
      en: `${userName}, you live in a world of deep meanings. Your authenticity and creativity are rare treasures.\n\nBut unrealized ideals are just dreams. The beauty you see needs to manifest in the real world.\n\nYour evolution is in transforming feeling into action. The world needs your vision — but materialized, not just dreamed.`
    },
    ENFJ: {
      pt: `${userName}, você nasceu para inspirar e desenvolver pessoas. Seu carisma ilumina caminhos e desperta potenciais.\n\nMas você não pode dar o que não tem. Cuidar de todos enquanto se negligencia não é generosidade — é autodestruição.\n\nSua evolução está em aprender a receber. Os melhores mentores são aqueles que também se deixam ensinar.`,
      'pt-pt': `${userName}, nasceste para inspirar e desenvolver pessoas. O teu carisma ilumina caminhos e desperta potenciais.\n\nMas não podes dar o que não tens. Cuidar de todos enquanto te negligencias não é generosidade — é autodestruição.\n\nA tua evolução está em aprender a receber. Os melhores mentores são aqueles que também se deixam ensinar.`,
      en: `${userName}, you were born to inspire and develop people. Your charisma illuminates paths and awakens potentials.\n\nBut you cannot give what you don't have. Caring for everyone while neglecting yourself is not generosity — it's self-destruction.\n\nYour evolution is in learning to receive. The best mentors are those who also let themselves be taught.`
    },
    ENFP: {
      pt: `${userName}, sua energia é contagiante. Você vê potencial em tudo e em todos, e isso transforma ambientes.\n\nMas possibilidades infinitas podem ser uma forma de fuga. A profundidade exige parar em um lugar.\n\nSua evolução está em escolher e se comprometer. Não é sobre perder liberdade — é sobre criar impacto real.`,
      'pt-pt': `${userName}, a tua energia é contagiante. Vês potencial em tudo e em todos, e isso transforma ambientes.\n\nMas possibilidades infinitas podem ser uma forma de fuga. A profundidade exige parar num lugar.\n\nA tua evolução está em escolher e te comprometeres. Não é sobre perder liberdade — é sobre criar impacto real.`,
      en: `${userName}, your energy is contagious. You see potential in everything and everyone, and that transforms environments.\n\nBut infinite possibilities can be a form of escape. Depth requires stopping in one place.\n\nYour evolution is in choosing and committing. It's not about losing freedom — it's about creating real impact.`
    },
    ISTJ: {
      pt: `${userName}, você é a rocha onde outros se apoiam. Sua consistência e integridade criam estrutura e confiança.\n\nMas nem todas as regras servem para sempre. Às vezes, a vida pede flexibilidade, e isso não é fraqueza.\n\nSua evolução está em honrar tradições enquanto abraça o novo. Estrutura é importante — mas não mais que vida.`,
      'pt-pt': `${userName}, és a rocha onde outros se apoiam. A tua consistência e integridade criam estrutura e confiança.\n\nMas nem todas as regras servem para sempre. Às vezes, a vida pede flexibilidade, e isso não é fraqueza.\n\nA tua evolução está em honrar tradições enquanto abraças o novo. Estrutura é importante — mas não mais que vida.`,
      en: `${userName}, you are the rock others lean on. Your consistency and integrity create structure and trust.\n\nBut not all rules serve forever. Sometimes life asks for flexibility, and that is not weakness.\n\nYour evolution is in honoring traditions while embracing the new. Structure is important — but not more than life.`
    },
    ISFJ: {
      pt: `${userName}, você cuida com uma profundidade que poucos entendem. Seu amor se manifesta em ações silenciosas e constantes.\n\nMas cuidar dos outros enquanto ignora a si mesmo não é sustentável. Você também merece receber.\n\nSua evolução está em aprender a pedir. Não é egoísmo — é sabedoria.`,
      'pt-pt': `${userName}, cuidas com uma profundidade que poucos entendem. O teu amor manifesta-se em ações silenciosas e constantes.\n\nMas cuidar dos outros enquanto te ignoras não é sustentável. Tu também mereces receber.\n\nA tua evolução está em aprender a pedir. Não é egoísmo — é sabedoria.`,
      en: `${userName}, you care with a depth few understand. Your love manifests in silent and constant actions.\n\nBut caring for others while ignoring yourself is not sustainable. You also deserve to receive.\n\nYour evolution is in learning to ask. It's not selfishness — it's wisdom.`
    },
    ESTJ: {
      pt: `${userName}, você faz acontecer. Sua clareza e determinação transformam planos em resultados.\n\nMas eficiência sem humanidade é vazia. Relacionamentos não são projetos a gerenciar.\n\nSua evolução está em liderar com eficiência E coração. O resultado mais importante é quem você se torna no processo.`,
      'pt-pt': `${userName}, fazes acontecer. A tua clareza e determinação transformam planos em resultados.\n\nMas eficiência sem humanidade é vazia. Relacionamentos não são projetos a gerir.\n\nA tua evolução está em liderar com eficiência E coração. O resultado mais importante é quem te tornas no processo.`,
      en: `${userName}, you make things happen. Your clarity and determination turn plans into results.\n\nBut efficiency without humanity is empty. Relationships are not projects to manage.\n\nYour evolution is in leading with efficiency AND heart. The most important result is who you become in the process.`
    },
    ESFJ: {
      pt: `${userName}, você cria comunidade onde passa. Sua generosidade constrói pontes e pertencimento.\n\nMas buscar aprovação pode te afastar de você mesmo. Você não precisa agradar para ter valor.\n\nSua evolução está em ser amado por quem você é, não pelo que faz pelos outros. Sua presença já é suficiente.`,
      'pt-pt': `${userName}, crias comunidade por onde passas. A tua generosidade constrói pontes e pertença.\n\nMas buscar aprovação pode afastar-te de ti mesmo. Não precisas de agradar para ter valor.\n\nA tua evolução está em ser amado por quem és, não pelo que fazes pelos outros. A tua presença já é suficiente.`,
      en: `${userName}, you create community wherever you go. Your generosity builds bridges and belonging.\n\nBut seeking approval can distance you from yourself. You don't need to please to have value.\n\nYour evolution is in being loved for who you are, not what you do for others. Your presence is already enough.`
    },
    ISTP: {
      pt: `${userName}, você entende como as coisas funcionam. Sua calma e habilidade técnica resolvem o que outros nem tentam.\n\nMas conexão emocional não é fraqueza — é força. Vulnerabilidade é a ponte para intimidade real.\n\nSua evolução está em se conectar através de sentimentos, não apenas de ações. O mundo precisa do seu coração tanto quanto das suas mãos.`,
      'pt-pt': `${userName}, entendes como as coisas funcionam. A tua calma e habilidade técnica resolvem o que outros nem tentam.\n\nMas conexão emocional não é fraqueza — é força. Vulnerabilidade é a ponte para intimidade real.\n\nA tua evolução está em te conectares através de sentimentos, não apenas de ações. O mundo precisa do teu coração tanto quanto das tuas mãos.`,
      en: `${userName}, you understand how things work. Your calm and technical skill solve what others don't even try.\n\nBut emotional connection is not weakness — it's strength. Vulnerability is the bridge to real intimacy.\n\nYour evolution is in connecting through feelings, not just actions. The world needs your heart as much as your hands.`
    },
    ISFP: {
      pt: `${userName}, você sente profundamente e expressa com autenticidade. Sua sensibilidade cria beleza onde passa.\n\nMas evitar conflitos não traz paz — apenas adia. Às vezes, amor exige enfrentamento.\n\nSua evolução está em expressar sua força junto com sua gentileza. Você pode ser suave E firme.`,
      'pt-pt': `${userName}, sentes profundamente e expressas com autenticidade. A tua sensibilidade cria beleza por onde passas.\n\nMas evitar conflitos não traz paz — apenas adia. Às vezes, amor exige enfrentamento.\n\nA tua evolução está em expressar a tua força junto com a tua gentileza. Podes ser suave E firme.`,
      en: `${userName}, you feel deeply and express authentically. Your sensitivity creates beauty wherever you go.\n\nBut avoiding conflicts doesn't bring peace — it just postpones. Sometimes love requires confrontation.\n\nYour evolution is in expressing your strength along with your gentleness. You can be soft AND firm.`
    },
    ESTP: {
      pt: `${userName}, você vive intensamente no presente. Sua energia resolve problemas em tempo real.\n\nMas velocidade sem reflexão pode custar caro. Às vezes, a melhor ação é parar e pensar.\n\nSua evolução está em agir com velocidade E sabedoria. Impacto duradouro vem de decisões conscientes.`,
      'pt-pt': `${userName}, vives intensamente no presente. A tua energia resolve problemas em tempo real.\n\nMas velocidade sem reflexão pode custar caro. Às vezes, a melhor ação é parar e pensar.\n\nA tua evolução está em agir com velocidade E sabedoria. Impacto duradouro vem de decisões conscientes.`,
      en: `${userName}, you live intensely in the present. Your energy solves problems in real time.\n\nBut speed without reflection can cost dearly. Sometimes the best action is to stop and think.\n\nYour evolution is in acting with speed AND wisdom. Lasting impact comes from conscious decisions.`
    },
    ESFP: {
      pt: `${userName}, você traz alegria e vida onde passa. Sua presença transforma qualquer ambiente.\n\nMas celebração constante pode esconder dor. Profundidade não é inimiga da alegria — é sua companheira.\n\nSua evolução está em celebrar a vida com profundidade. As conversas mais importantes são as que você mais evita.`,
      'pt-pt': `${userName}, trazes alegria e vida por onde passas. A tua presença transforma qualquer ambiente.\n\nMas celebração constante pode esconder dor. Profundidade não é inimiga da alegria — é sua companheira.\n\nA tua evolução está em celebrar a vida com profundidade. As conversas mais importantes são as que mais evitas.`,
      en: `${userName}, you bring joy and life wherever you go. Your presence transforms any environment.\n\nBut constant celebration can hide pain. Depth is not the enemy of joy — it's its companion.\n\nYour evolution is in celebrating life with depth. The most important conversations are the ones you avoid the most.`
    }
  };
  
  return reflections[type]?.[lang] || reflections.INTJ[lang];
}
