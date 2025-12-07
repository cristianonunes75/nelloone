import jsPDF from 'jspdf';

interface Nello16PDFData {
  userName: string;
  personalityType: string;
  dimensionScores: {
    E: number; I: number;
    S: number; N: number;
    T: number; F: number;
    J: number; P: number;
  };
  language: 'pt' | 'pt-pt' | 'en';
}

const NELLO_16_TYPES: Record<string, {
  name: { pt: string; 'pt-pt': string; en: string };
  emoji: string;
  subtitle: { pt: string; 'pt-pt': string; en: string };
  description: { pt: string; 'pt-pt': string; en: string };
  light: { pt: string[]; 'pt-pt': string[]; en: string[] };
  shadow: { pt: string[]; 'pt-pt': string[]; en: string[] };
  vocation: { pt: string; 'pt-pt': string; en: string };
  traps: { pt: string[]; 'pt-pt': string[]; en: string[] };
  sevenDayPlan: { pt: string[]; 'pt-pt': string[]; en: string[] };
}> = {
  INTJ: {
    name: { pt: 'O Estrategista', 'pt-pt': 'O Estrategista', en: 'The Strategist' },
    emoji: '🎯',
    subtitle: { pt: 'Mente visionária com foco absoluto', 'pt-pt': 'Mente visionária com foco absoluto', en: 'Visionary mind with absolute focus' },
    description: {
      pt: 'Você enxerga sistemas, padrões e possibilidades que outros ignoram. Sua mente trabalha em camadas profundas de análise e planejamento. Você não aceita superficialidade e busca excelência em tudo que faz.',
      'pt-pt': 'Tu vês sistemas, padrões e possibilidades que outros ignoram. A tua mente trabalha em camadas profundas de análise e planeamento. Não aceitas superficialidade e buscas excelência em tudo o que fazes.',
      en: 'You see systems, patterns, and possibilities that others ignore. Your mind works in deep layers of analysis and planning. You don\'t accept superficiality and seek excellence in everything you do.'
    },
    light: {
      pt: ['Visão estratégica', 'Independência intelectual', 'Determinação inabalável', 'Capacidade de inovação', 'Pensamento de longo prazo'],
      'pt-pt': ['Visão estratégica', 'Independência intelectual', 'Determinação inabalável', 'Capacidade de inovação', 'Pensamento de longo prazo'],
      en: ['Strategic vision', 'Intellectual independence', 'Unwavering determination', 'Innovation capacity', 'Long-term thinking']
    },
    shadow: {
      pt: ['Arrogância intelectual', 'Dificuldade com emoções alheias', 'Perfeccionismo paralisante', 'Impaciência com incompetência', 'Isolamento emocional'],
      'pt-pt': ['Arrogância intelectual', 'Dificuldade com emoções alheias', 'Perfeccionismo paralisante', 'Impaciência com incompetência', 'Isolamento emocional'],
      en: ['Intellectual arrogance', 'Difficulty with others\' emotions', 'Paralyzing perfectionism', 'Impatience with incompetence', 'Emotional isolation']
    },
    vocation: {
      pt: 'Sua vocação está onde estratégia encontra inovação: liderança, ciência, arquitetura de sistemas, pesquisa, empreendedorismo, consultoria estratégica.',
      'pt-pt': 'A tua vocação está onde estratégia encontra inovação: liderança, ciência, arquitetura de sistemas, investigação, empreendedorismo, consultoria estratégica.',
      en: 'Your vocation is where strategy meets innovation: leadership, science, systems architecture, research, entrepreneurship, strategic consulting.'
    },
    traps: {
      pt: ['Vício mental: análise infinita', 'Vício emocional: controle', 'Vício espiritual: autossuficiência'],
      'pt-pt': ['Vício mental: análise infinita', 'Vício emocional: controlo', 'Vício espiritual: autossuficiência'],
      en: ['Mental addiction: infinite analysis', 'Emotional addiction: control', 'Spiritual addiction: self-sufficiency']
    },
    sevenDayPlan: {
      pt: ['Peça opinião a alguém antes de decidir', 'Faça algo sem planejar completamente', 'Ouça uma emoção sem analisar', 'Delegue uma tarefa importante', 'Reconheça um erro em voz alta', 'Descanse sem produzir nada', 'Celebre uma relação, não uma conquista'],
      'pt-pt': ['Pede opinião a alguém antes de decidir', 'Faz algo sem planear completamente', 'Ouve uma emoção sem analisar', 'Delega uma tarefa importante', 'Reconhece um erro em voz alta', 'Descansa sem produzir nada', 'Celebra uma relação, não uma conquista'],
      en: ['Ask someone\'s opinion before deciding', 'Do something without fully planning', 'Listen to an emotion without analyzing', 'Delegate an important task', 'Acknowledge a mistake out loud', 'Rest without producing anything', 'Celebrate a relationship, not an achievement']
    }
  },
  INTP: {
    name: { pt: 'O Analista', 'pt-pt': 'O Analista', en: 'The Analyst' },
    emoji: '🔬',
    subtitle: { pt: 'Mente curiosa em busca de verdade', 'pt-pt': 'Mente curiosa em busca de verdade', en: 'Curious mind seeking truth' },
    description: {
      pt: 'Você vive explorando ideias, conceitos e teorias. Sua mente é um laboratório onde tudo é questionado e testado. Você busca entender como as coisas funcionam no nível mais profundo.',
      'pt-pt': 'Tu vives a explorar ideias, conceitos e teorias. A tua mente é um laboratório onde tudo é questionado e testado. Buscas entender como as coisas funcionam ao nível mais profundo.',
      en: 'You live exploring ideas, concepts, and theories. Your mind is a laboratory where everything is questioned and tested. You seek to understand how things work at the deepest level.'
    },
    light: {
      pt: ['Curiosidade infinita', 'Pensamento original', 'Capacidade de abstração', 'Honestidade intelectual', 'Criatividade conceitual'],
      'pt-pt': ['Curiosidade infinita', 'Pensamento original', 'Capacidade de abstração', 'Honestidade intelectual', 'Criatividade conceptual'],
      en: ['Infinite curiosity', 'Original thinking', 'Abstraction capacity', 'Intellectual honesty', 'Conceptual creativity']
    },
    shadow: {
      pt: ['Desconexão da realidade prática', 'Procrastinação', 'Dificuldade em finalizar', 'Negligência emocional', 'Arrogância sutil'],
      'pt-pt': ['Desconexão da realidade prática', 'Procrastinação', 'Dificuldade em finalizar', 'Negligência emocional', 'Arrogância subtil'],
      en: ['Disconnection from practical reality', 'Procrastination', 'Difficulty finishing', 'Emotional neglect', 'Subtle arrogance']
    },
    vocation: {
      pt: 'Sua vocação está onde análise encontra descoberta: ciência, filosofia, programação, matemática, pesquisa, design de sistemas.',
      'pt-pt': 'A tua vocação está onde análise encontra descoberta: ciência, filosofia, programação, matemática, investigação, design de sistemas.',
      en: 'Your vocation is where analysis meets discovery: science, philosophy, programming, mathematics, research, systems design.'
    },
    traps: {
      pt: ['Vício mental: teorização infinita', 'Vício emocional: evitação', 'Vício espiritual: relativismo'],
      'pt-pt': ['Vício mental: teorização infinita', 'Vício emocional: evitação', 'Vício espiritual: relativismo'],
      en: ['Mental addiction: infinite theorizing', 'Emotional addiction: avoidance', 'Spiritual addiction: relativism']
    },
    sevenDayPlan: {
      pt: ['Termine algo que você começou', 'Converse sobre sentimentos', 'Faça algo físico por 30 min', 'Saia do mundo das ideias e aja', 'Peça feedback sincero', 'Pratique presença sem pensar', 'Celebre uma conexão humana'],
      'pt-pt': ['Termina algo que começaste', 'Conversa sobre sentimentos', 'Faz algo físico por 30 min', 'Sai do mundo das ideias e age', 'Pede feedback sincero', 'Pratica presença sem pensar', 'Celebra uma conexão humana'],
      en: ['Finish something you started', 'Talk about feelings', 'Do something physical for 30 min', 'Leave the world of ideas and act', 'Ask for sincere feedback', 'Practice presence without thinking', 'Celebrate a human connection']
    }
  },
  ENTJ: {
    name: { pt: 'O Comandante', 'pt-pt': 'O Comandante', en: 'The Commander' },
    emoji: '👑',
    subtitle: { pt: 'Líder natural com visão transformadora', 'pt-pt': 'Líder natural com visão transformadora', en: 'Natural leader with transformative vision' },
    description: {
      pt: 'Você nasce para liderar, organizar e transformar. Sua energia mobiliza pessoas e recursos em direção a objetivos ambiciosos. Você não aceita mediocridade e inspira excelência.',
      'pt-pt': 'Tu nasces para liderar, organizar e transformar. A tua energia mobiliza pessoas e recursos em direção a objetivos ambiciosos. Não aceitas mediocridade e inspiras excelência.',
      en: 'You are born to lead, organize, and transform. Your energy mobilizes people and resources toward ambitious goals. You don\'t accept mediocrity and inspire excellence.'
    },
    light: {
      pt: ['Liderança natural', 'Visão estratégica', 'Capacidade de execução', 'Coragem decisória', 'Carisma de comando'],
      'pt-pt': ['Liderança natural', 'Visão estratégica', 'Capacidade de execução', 'Coragem decisória', 'Carisma de comando'],
      en: ['Natural leadership', 'Strategic vision', 'Execution capacity', 'Decisional courage', 'Command charisma']
    },
    shadow: {
      pt: ['Autoritarismo', 'Impaciência extrema', 'Frieza emocional', 'Intolerância à fraqueza', 'Workaholic destrutivo'],
      'pt-pt': ['Autoritarismo', 'Impaciência extrema', 'Frieza emocional', 'Intolerância à fraqueza', 'Workaholic destrutivo'],
      en: ['Authoritarianism', 'Extreme impatience', 'Emotional coldness', 'Intolerance to weakness', 'Destructive workaholic']
    },
    vocation: {
      pt: 'Sua vocação está onde liderança encontra transformação: executivo, empreendedor, estrategista, diretor, consultor de alto impacto.',
      'pt-pt': 'A tua vocação está onde liderança encontra transformação: executivo, empreendedor, estrategista, diretor, consultor de alto impacto.',
      en: 'Your vocation is where leadership meets transformation: executive, entrepreneur, strategist, director, high-impact consultant.'
    },
    traps: {
      pt: ['Vício mental: controle total', 'Vício emocional: poder', 'Vício espiritual: orgulho'],
      'pt-pt': ['Vício mental: controlo total', 'Vício emocional: poder', 'Vício espiritual: orgulho'],
      en: ['Mental addiction: total control', 'Emotional addiction: power', 'Spiritual addiction: pride']
    },
    sevenDayPlan: {
      pt: ['Ouça alguém sem corrigir', 'Delegue algo importante completamente', 'Reconheça uma fraqueza pessoal', 'Descanse um dia inteiro', 'Pergunte como alguém está de verdade', 'Aceite um "não" sem reagir', 'Ore pedindo humildade'],
      'pt-pt': ['Ouve alguém sem corrigir', 'Delega algo importante completamente', 'Reconhece uma fraqueza pessoal', 'Descansa um dia inteiro', 'Pergunta como alguém está de verdade', 'Aceita um "não" sem reagir', 'Reza pedindo humildade'],
      en: ['Listen to someone without correcting', 'Delegate something important completely', 'Acknowledge a personal weakness', 'Rest for a whole day', 'Ask how someone really is', 'Accept a "no" without reacting', 'Pray for humility']
    }
  },
  ENTP: {
    name: { pt: 'O Visionário', 'pt-pt': 'O Visionário', en: 'The Visionary' },
    emoji: '💡',
    subtitle: { pt: 'Mente inventiva que desafia o impossível', 'pt-pt': 'Mente inventiva que desafia o impossível', en: 'Inventive mind that challenges the impossible' },
    description: {
      pt: 'Você vê possibilidades onde outros veem obstáculos. Sua mente conecta ideias de formas surpreendentes. Você adora debater, inovar e provocar o status quo.',
      'pt-pt': 'Tu vês possibilidades onde outros veem obstáculos. A tua mente conecta ideias de formas surpreendentes. Adoras debater, inovar e provocar o status quo.',
      en: 'You see possibilities where others see obstacles. Your mind connects ideas in surprising ways. You love to debate, innovate, and challenge the status quo.'
    },
    light: {
      pt: ['Criatividade explosiva', 'Eloquência', 'Adaptabilidade mental', 'Coragem intelectual', 'Capacidade de inovação'],
      'pt-pt': ['Criatividade explosiva', 'Eloquência', 'Adaptabilidade mental', 'Coragem intelectual', 'Capacidade de inovação'],
      en: ['Explosive creativity', 'Eloquence', 'Mental adaptability', 'Intellectual courage', 'Innovation capacity']
    },
    shadow: {
      pt: ['Inconstância', 'Argumentação excessiva', 'Falta de foco', 'Insensibilidade inadvertida', 'Tédio fácil'],
      'pt-pt': ['Inconstância', 'Argumentação excessiva', 'Falta de foco', 'Insensibilidade inadvertida', 'Tédio fácil'],
      en: ['Inconstancy', 'Excessive argumentation', 'Lack of focus', 'Inadvertent insensitivity', 'Easy boredom']
    },
    vocation: {
      pt: 'Sua vocação está onde inovação encontra comunicação: empreendedorismo, advocacia, marketing, tecnologia, consultoria criativa.',
      'pt-pt': 'A tua vocação está onde inovação encontra comunicação: empreendedorismo, advocacia, marketing, tecnologia, consultoria criativa.',
      en: 'Your vocation is where innovation meets communication: entrepreneurship, law, marketing, technology, creative consulting.'
    },
    traps: {
      pt: ['Vício mental: novidade constante', 'Vício emocional: ter razão', 'Vício espiritual: ceticismo'],
      'pt-pt': ['Vício mental: novidade constante', 'Vício emocional: ter razão', 'Vício espiritual: ceticismo'],
      en: ['Mental addiction: constant novelty', 'Emotional addiction: being right', 'Spiritual addiction: skepticism']
    },
    sevenDayPlan: {
      pt: ['Termine um projeto antes de começar outro', 'Ouça sem contra-argumentar', 'Foque em uma coisa por 2 horas', 'Peça desculpas por algo', 'Valorize algo simples e rotineiro', 'Pratique silêncio por 15 min', 'Celebre consistência, não só novidade'],
      'pt-pt': ['Termina um projeto antes de começar outro', 'Ouve sem contra-argumentar', 'Foca numa coisa por 2 horas', 'Pede desculpas por algo', 'Valoriza algo simples e rotineiro', 'Pratica silêncio por 15 min', 'Celebra consistência, não só novidade'],
      en: ['Finish one project before starting another', 'Listen without counter-arguing', 'Focus on one thing for 2 hours', 'Apologize for something', 'Value something simple and routine', 'Practice silence for 15 min', 'Celebrate consistency, not just novelty']
    }
  },
  INFJ: {
    name: { pt: 'O Conselheiro', 'pt-pt': 'O Conselheiro', en: 'The Counselor' },
    emoji: '🌙',
    subtitle: { pt: 'Alma profunda com visão transformadora', 'pt-pt': 'Alma profunda com visão transformadora', en: 'Deep soul with transformative vision' },
    description: {
      pt: 'Você enxerga além da superfície das pessoas e situações. Sua intuição é profunda, suas emoções são ricas e seu propósito é claro. Você nasceu para curar e transformar.',
      'pt-pt': 'Tu vês além da superfície das pessoas e situações. A tua intuição é profunda, as tuas emoções são ricas e o teu propósito é claro. Nasceste para curar e transformar.',
      en: 'You see beyond the surface of people and situations. Your intuition is deep, your emotions are rich, and your purpose is clear. You were born to heal and transform.'
    },
    light: {
      pt: ['Intuição profunda', 'Empatia transformadora', 'Visão de propósito', 'Sensibilidade espiritual', 'Capacidade de cura emocional'],
      'pt-pt': ['Intuição profunda', 'Empatia transformadora', 'Visão de propósito', 'Sensibilidade espiritual', 'Capacidade de cura emocional'],
      en: ['Deep intuition', 'Transformative empathy', 'Purpose vision', 'Spiritual sensitivity', 'Emotional healing capacity']
    },
    shadow: {
      pt: ['Esgotamento emocional', 'Perfeccionismo', 'Dificuldade em se proteger', 'Idealismo doloroso', 'Isolamento'],
      'pt-pt': ['Esgotamento emocional', 'Perfeccionismo', 'Dificuldade em te protegeres', 'Idealismo doloroso', 'Isolamento'],
      en: ['Emotional exhaustion', 'Perfectionism', 'Difficulty protecting yourself', 'Painful idealism', 'Isolation']
    },
    vocation: {
      pt: 'Sua vocação está onde profundidade encontra cura: aconselhamento, escrita, psicologia, espiritualidade, educação transformadora.',
      'pt-pt': 'A tua vocação está onde profundidade encontra cura: aconselhamento, escrita, psicologia, espiritualidade, educação transformadora.',
      en: 'Your vocation is where depth meets healing: counseling, writing, psychology, spirituality, transformative education.'
    },
    traps: {
      pt: ['Vício mental: idealização', 'Vício emocional: absorver dor alheia', 'Vício espiritual: messianismo'],
      'pt-pt': ['Vício mental: idealização', 'Vício emocional: absorver dor alheia', 'Vício espiritual: messianismo'],
      en: ['Mental addiction: idealization', 'Emotional addiction: absorbing others\' pain', 'Spiritual addiction: messianism']
    },
    sevenDayPlan: {
      pt: ['Diga não a um pedido de ajuda', 'Faça algo só para você', 'Aceite imperfeição em algo', 'Descanse sem culpa', 'Peça ajuda a alguém', 'Expresse raiva saudável', 'Celebre quem você é, não o que faz pelos outros'],
      'pt-pt': ['Diz não a um pedido de ajuda', 'Faz algo só para ti', 'Aceita imperfeição em algo', 'Descansa sem culpa', 'Pede ajuda a alguém', 'Expressa raiva saudável', 'Celebra quem és, não o que fazes pelos outros'],
      en: ['Say no to a request for help', 'Do something just for yourself', 'Accept imperfection in something', 'Rest without guilt', 'Ask someone for help', 'Express healthy anger', 'Celebrate who you are, not what you do for others']
    }
  },
  INFP: {
    name: { pt: 'O Poeta', 'pt-pt': 'O Poeta', en: 'The Poet' },
    emoji: '🦋',
    subtitle: { pt: 'Alma sensível em busca de autenticidade', 'pt-pt': 'Alma sensível em busca de autenticidade', en: 'Sensitive soul seeking authenticity' },
    description: {
      pt: 'Você vive em um mundo de significados, valores e emoções profundas. Sua autenticidade é sua bússola. Você busca um propósito que seja verdadeiro e transformador.',
      'pt-pt': 'Tu vives num mundo de significados, valores e emoções profundas. A tua autenticidade é a tua bússola. Buscas um propósito que seja verdadeiro e transformador.',
      en: 'You live in a world of meanings, values, and deep emotions. Your authenticity is your compass. You seek a purpose that is true and transformative.'
    },
    light: {
      pt: ['Autenticidade radical', 'Criatividade emocional', 'Empatia profunda', 'Idealismo inspirador', 'Sensibilidade artística'],
      'pt-pt': ['Autenticidade radical', 'Criatividade emocional', 'Empatia profunda', 'Idealismo inspirador', 'Sensibilidade artística'],
      en: ['Radical authenticity', 'Emotional creativity', 'Deep empathy', 'Inspiring idealism', 'Artistic sensitivity']
    },
    shadow: {
      pt: ['Autocrítica destrutiva', 'Dificuldade com realidade prática', 'Melancolia', 'Evitação de conflitos', 'Paralisia por idealismo'],
      'pt-pt': ['Autocrítica destrutiva', 'Dificuldade com realidade prática', 'Melancolia', 'Evitação de conflitos', 'Paralisia por idealismo'],
      en: ['Destructive self-criticism', 'Difficulty with practical reality', 'Melancholy', 'Conflict avoidance', 'Paralysis by idealism']
    },
    vocation: {
      pt: 'Sua vocação está onde autenticidade encontra expressão: arte, escrita, música, acolhimento, causas humanitárias, espiritualidade.',
      'pt-pt': 'A tua vocação está onde autenticidade encontra expressão: arte, escrita, música, acolhimento, causas humanitárias, espiritualidade.',
      en: 'Your vocation is where authenticity meets expression: art, writing, music, welcoming, humanitarian causes, spirituality.'
    },
    traps: {
      pt: ['Vício mental: fantasia como fuga', 'Vício emocional: melancolia', 'Vício espiritual: auto-sacrifício'],
      'pt-pt': ['Vício mental: fantasia como fuga', 'Vício emocional: melancolia', 'Vício espiritual: auto-sacrifício'],
      en: ['Mental addiction: fantasy as escape', 'Emotional addiction: melancholy', 'Spiritual addiction: self-sacrifice']
    },
    sevenDayPlan: {
      pt: ['Faça algo prático e útil', 'Enfrente um pequeno conflito', 'Celebre algo imperfeito', 'Saia do mundo interno por 2h', 'Peça o que você precisa', 'Aceite um elogio sem minimizar', 'Declare seu valor em voz alta'],
      'pt-pt': ['Faz algo prático e útil', 'Enfrenta um pequeno conflito', 'Celebra algo imperfeito', 'Sai do mundo interno por 2h', 'Pede o que precisas', 'Aceita um elogio sem minimizar', 'Declara o teu valor em voz alta'],
      en: ['Do something practical and useful', 'Face a small conflict', 'Celebrate something imperfect', 'Leave the internal world for 2h', 'Ask for what you need', 'Accept a compliment without minimizing', 'Declare your value out loud']
    }
  },
  ENFJ: {
    name: { pt: 'O Mentor', 'pt-pt': 'O Mentor', en: 'The Mentor' },
    emoji: '🌟',
    subtitle: { pt: 'Líder inspirador que transforma vidas', 'pt-pt': 'Líder inspirador que transforma vidas', en: 'Inspiring leader who transforms lives' },
    description: {
      pt: 'Você nasce para inspirar, guiar e desenvolver pessoas. Sua energia contagia e sua visão eleva. Você vê o potencial onde outros veem limitações.',
      'pt-pt': 'Tu nasces para inspirar, guiar e desenvolver pessoas. A tua energia contagia e a tua visão eleva. Vês o potencial onde outros veem limitações.',
      en: 'You are born to inspire, guide, and develop people. Your energy is contagious and your vision elevates. You see potential where others see limitations.'
    },
    light: {
      pt: ['Carisma inspirador', 'Empatia ativa', 'Capacidade de desenvolver outros', 'Comunicação transformadora', 'Visão de propósito coletivo'],
      'pt-pt': ['Carisma inspirador', 'Empatia ativa', 'Capacidade de desenvolver outros', 'Comunicação transformadora', 'Visão de propósito coletivo'],
      en: ['Inspiring charisma', 'Active empathy', 'Ability to develop others', 'Transformative communication', 'Collective purpose vision']
    },
    shadow: {
      pt: ['Dependência de aprovação', 'Negligência de si mesmo', 'Manipulação inconsciente', 'Idealização excessiva', 'Esgotamento por doar demais'],
      'pt-pt': ['Dependência de aprovação', 'Negligência de si mesmo', 'Manipulação inconsciente', 'Idealização excessiva', 'Esgotamento por doar demais'],
      en: ['Approval dependency', 'Self-neglect', 'Unconscious manipulation', 'Excessive idealization', 'Exhaustion from giving too much']
    },
    vocation: {
      pt: 'Sua vocação está onde liderança encontra desenvolvimento humano: coaching, educação, liderança inspiradora, ministério, consultoria de pessoas.',
      'pt-pt': 'A tua vocação está onde liderança encontra desenvolvimento humano: coaching, educação, liderança inspiradora, ministério, consultoria de pessoas.',
      en: 'Your vocation is where leadership meets human development: coaching, education, inspiring leadership, ministry, people consulting.'
    },
    traps: {
      pt: ['Vício mental: salvar todos', 'Vício emocional: ser amado', 'Vício espiritual: protagonismo'],
      'pt-pt': ['Vício mental: salvar todos', 'Vício emocional: ser amado', 'Vício espiritual: protagonismo'],
      en: ['Mental addiction: saving everyone', 'Emotional addiction: being loved', 'Spiritual addiction: protagonism']
    },
    sevenDayPlan: {
      pt: ['Diga não sem explicar', 'Cuide de você antes de cuidar de alguém', 'Aceite não ser compreendido', 'Descanse sem sentir culpa', 'Deixe alguém resolver sozinho', 'Expresse uma necessidade sua', 'Celebre quem você é, não quem você inspira'],
      'pt-pt': ['Diz não sem explicar', 'Cuida de ti antes de cuidar de alguém', 'Aceita não ser compreendido', 'Descansa sem sentir culpa', 'Deixa alguém resolver sozinho', 'Expressa uma necessidade tua', 'Celebra quem és, não quem inspiras'],
      en: ['Say no without explaining', 'Take care of yourself before caring for someone', 'Accept not being understood', 'Rest without feeling guilty', 'Let someone solve it alone', 'Express a need of yours', 'Celebrate who you are, not who you inspire']
    }
  },
  ENFP: {
    name: { pt: 'O Inspirador', 'pt-pt': 'O Inspirador', en: 'The Inspirer' },
    emoji: '🌈',
    subtitle: { pt: 'Energia criativa que ilumina possibilidades', 'pt-pt': 'Energia criativa que ilumina possibilidades', en: 'Creative energy that illuminates possibilities' },
    description: {
      pt: 'Você vê potencial em tudo e em todos. Sua energia é expansiva, sua criatividade é contagiante e sua autenticidade inspira mudança. Você nasceu para despertar vida.',
      'pt-pt': 'Tu vês potencial em tudo e em todos. A tua energia é expansiva, a tua criatividade é contagiante e a tua autenticidade inspira mudança. Nasceste para despertar vida.',
      en: 'You see potential in everything and everyone. Your energy is expansive, your creativity is contagious, and your authenticity inspires change. You were born to awaken life.'
    },
    light: {
      pt: ['Entusiasmo contagiante', 'Criatividade ilimitada', 'Autenticidade natural', 'Capacidade de conectar pessoas', 'Visão de possibilidades'],
      'pt-pt': ['Entusiasmo contagiante', 'Criatividade ilimitada', 'Autenticidade natural', 'Capacidade de conectar pessoas', 'Visão de possibilidades'],
      en: ['Contagious enthusiasm', 'Unlimited creativity', 'Natural authenticity', 'Ability to connect people', 'Vision of possibilities']
    },
    shadow: {
      pt: ['Falta de foco', 'Dificuldade com rotina', 'Sensibilidade à rejeição', 'Projetos inacabados', 'Ansiedade por novidade'],
      'pt-pt': ['Falta de foco', 'Dificuldade com rotina', 'Sensibilidade à rejeição', 'Projetos inacabados', 'Ansiedade por novidade'],
      en: ['Lack of focus', 'Difficulty with routine', 'Sensitivity to rejection', 'Unfinished projects', 'Anxiety for novelty']
    },
    vocation: {
      pt: 'Sua vocação está onde criatividade encontra conexão: comunicação, arte, coaching, empreendedorismo criativo, educação inspiradora.',
      'pt-pt': 'A tua vocação está onde criatividade encontra conexão: comunicação, arte, coaching, empreendedorismo criativo, educação inspiradora.',
      en: 'Your vocation is where creativity meets connection: communication, art, coaching, creative entrepreneurship, inspiring education.'
    },
    traps: {
      pt: ['Vício mental: possibilidades infinitas', 'Vício emocional: ser aceito', 'Vício espiritual: superficialidade espiritual'],
      'pt-pt': ['Vício mental: possibilidades infinitas', 'Vício emocional: ser aceite', 'Vício espiritual: superficialidade espiritual'],
      en: ['Mental addiction: infinite possibilities', 'Emotional addiction: being accepted', 'Spiritual addiction: spiritual superficiality']
    },
    sevenDayPlan: {
      pt: ['Foque em uma coisa por 3 horas', 'Cumpra uma rotina chata', 'Termine algo antigo', 'Fique sozinho por 2h sem entretenimento', 'Aceite crítica sem reagir', 'Pratique silêncio por 20 min', 'Celebre consistência, não só inspiração'],
      'pt-pt': ['Foca numa coisa por 3 horas', 'Cumpre uma rotina chata', 'Termina algo antigo', 'Fica sozinho por 2h sem entretenimento', 'Aceita crítica sem reagir', 'Pratica silêncio por 20 min', 'Celebra consistência, não só inspiração'],
      en: ['Focus on one thing for 3 hours', 'Follow a boring routine', 'Finish something old', 'Stay alone for 2h without entertainment', 'Accept criticism without reacting', 'Practice silence for 20 min', 'Celebrate consistency, not just inspiration']
    }
  },
  ISTJ: {
    name: { pt: 'O Guardião', 'pt-pt': 'O Guardião', en: 'The Guardian' },
    emoji: '🏛️',
    subtitle: { pt: 'Pilar de confiança e responsabilidade', 'pt-pt': 'Pilar de confiança e responsabilidade', en: 'Pillar of trust and responsibility' },
    description: {
      pt: 'Você é a rocha onde outros se apoiam. Sua consistência, responsabilidade e integridade criam estrutura e segurança. Você honra compromissos como poucos.',
      'pt-pt': 'Tu és a rocha onde outros se apoiam. A tua consistência, responsabilidade e integridade criam estrutura e segurança. Honras compromissos como poucos.',
      en: 'You are the rock others lean on. Your consistency, responsibility, and integrity create structure and security. You honor commitments like few others.'
    },
    light: {
      pt: ['Confiabilidade absoluta', 'Responsabilidade exemplar', 'Disciplina natural', 'Lealdade profunda', 'Integridade inabalável'],
      'pt-pt': ['Confiabilidade absoluta', 'Responsabilidade exemplar', 'Disciplina natural', 'Lealdade profunda', 'Integridade inabalável'],
      en: ['Absolute reliability', 'Exemplary responsibility', 'Natural discipline', 'Deep loyalty', 'Unwavering integrity']
    },
    shadow: {
      pt: ['Rigidez', 'Dificuldade com mudança', 'Julgamento excessivo', 'Repressão emocional', 'Resistência a novas ideias'],
      'pt-pt': ['Rigidez', 'Dificuldade com mudança', 'Julgamento excessivo', 'Repressão emocional', 'Resistência a novas ideias'],
      en: ['Rigidity', 'Difficulty with change', 'Excessive judgment', 'Emotional repression', 'Resistance to new ideas']
    },
    vocation: {
      pt: 'Sua vocação está onde estrutura encontra serviço: administração, contabilidade, direito, gestão, logística, serviço público.',
      'pt-pt': 'A tua vocação está onde estrutura encontra serviço: administração, contabilidade, direito, gestão, logística, serviço público.',
      en: 'Your vocation is where structure meets service: administration, accounting, law, management, logistics, public service.'
    },
    traps: {
      pt: ['Vício mental: controle por regras', 'Vício emocional: previsibilidade', 'Vício espiritual: legalismo'],
      'pt-pt': ['Vício mental: controlo por regras', 'Vício emocional: previsibilidade', 'Vício espiritual: legalismo'],
      en: ['Mental addiction: control by rules', 'Emotional addiction: predictability', 'Spiritual addiction: legalism']
    },
    sevenDayPlan: {
      pt: ['Quebre uma regra pequena', 'Faça algo espontâneo', 'Expresse uma emoção forte', 'Aceite uma mudança de planos', 'Ouça uma ideia nova sem criticar', 'Descanse sem justificar', 'Celebre flexibilidade, não só dever'],
      'pt-pt': ['Quebra uma regra pequena', 'Faz algo espontâneo', 'Expressa uma emoção forte', 'Aceita uma mudança de planos', 'Ouve uma ideia nova sem criticar', 'Descansa sem justificar', 'Celebra flexibilidade, não só dever'],
      en: ['Break a small rule', 'Do something spontaneous', 'Express a strong emotion', 'Accept a change of plans', 'Listen to a new idea without criticizing', 'Rest without justifying', 'Celebrate flexibility, not just duty']
    }
  },
  ISFJ: {
    name: { pt: 'O Protetor', 'pt-pt': 'O Protetor', en: 'The Protector' },
    emoji: '🛡️',
    subtitle: { pt: 'Coração cuidador que sustenta o amor', 'pt-pt': 'Coração cuidador que sustenta o amor', en: 'Caring heart that sustains love' },
    description: {
      pt: 'Você cuida com profundidade e constância. Sua presença cria segurança, seu amor se manifesta em ações práticas e sua lealdade é inabalável.',
      'pt-pt': 'Tu cuidas com profundidade e constância. A tua presença cria segurança, o teu amor manifesta-se em ações práticas e a tua lealdade é inabalável.',
      en: 'You care with depth and constancy. Your presence creates security, your love manifests in practical actions, and your loyalty is unwavering.'
    },
    light: {
      pt: ['Cuidado profundo', 'Lealdade incondicional', 'Atenção aos detalhes', 'Serviço silencioso', 'Memória emocional'],
      'pt-pt': ['Cuidado profundo', 'Lealdade incondicional', 'Atenção aos detalhes', 'Serviço silencioso', 'Memória emocional'],
      en: ['Deep care', 'Unconditional loyalty', 'Attention to details', 'Silent service', 'Emotional memory']
    },
    shadow: {
      pt: ['Auto-sacrifício excessivo', 'Dificuldade em pedir', 'Ressentimento guardado', 'Medo de mudança', 'Evitação de conflitos'],
      'pt-pt': ['Auto-sacrifício excessivo', 'Dificuldade em pedir', 'Ressentimento guardado', 'Medo de mudança', 'Evitação de conflitos'],
      en: ['Excessive self-sacrifice', 'Difficulty asking', 'Stored resentment', 'Fear of change', 'Conflict avoidance']
    },
    vocation: {
      pt: 'Sua vocação está onde cuidado encontra estrutura: saúde, educação infantil, serviço social, recursos humanos, administração de pessoas.',
      'pt-pt': 'A tua vocação está onde cuidado encontra estrutura: saúde, educação infantil, serviço social, recursos humanos, administração de pessoas.',
      en: 'Your vocation is where care meets structure: health, early childhood education, social work, human resources, people management.'
    },
    traps: {
      pt: ['Vício mental: antecipar necessidades', 'Vício emocional: ser necessário', 'Vício espiritual: mártir silencioso'],
      'pt-pt': ['Vício mental: antecipar necessidades', 'Vício emocional: ser necessário', 'Vício espiritual: mártir silencioso'],
      en: ['Mental addiction: anticipating needs', 'Emotional addiction: being needed', 'Spiritual addiction: silent martyr']
    },
    sevenDayPlan: {
      pt: ['Peça algo que você precisa', 'Diga não sem culpa', 'Deixe alguém cuidar de você', 'Expresse um descontentamento', 'Faça algo só para você', 'Aceite ajuda sem resistir', 'Celebre seu valor, não só seu serviço'],
      'pt-pt': ['Pede algo que precisas', 'Diz não sem culpa', 'Deixa alguém cuidar de ti', 'Expressa um descontentamento', 'Faz algo só para ti', 'Aceita ajuda sem resistir', 'Celebra o teu valor, não só o teu serviço'],
      en: ['Ask for something you need', 'Say no without guilt', 'Let someone take care of you', 'Express a discontent', 'Do something just for yourself', 'Accept help without resisting', 'Celebrate your value, not just your service']
    }
  },
  ESTJ: {
    name: { pt: 'O Executor', 'pt-pt': 'O Executor', en: 'The Executor' },
    emoji: '⚙️',
    subtitle: { pt: 'Líder prático que faz acontecer', 'pt-pt': 'Líder prático que faz acontecer', en: 'Practical leader who makes it happen' },
    description: {
      pt: 'Você organiza, dirige e executa. Sua clareza de visão e capacidade de mobilizar recursos transforma planos em realidade. Você lidera pelo exemplo.',
      'pt-pt': 'Tu organizas, diriges e executas. A tua clareza de visão e capacidade de mobilizar recursos transforma planos em realidade. Lideras pelo exemplo.',
      en: 'You organize, direct, and execute. Your clarity of vision and ability to mobilize resources turns plans into reality. You lead by example.'
    },
    light: {
      pt: ['Liderança operacional', 'Organização impecável', 'Determinação', 'Clareza de direção', 'Responsabilidade exemplar'],
      'pt-pt': ['Liderança operacional', 'Organização impecável', 'Determinação', 'Clareza de direção', 'Responsabilidade exemplar'],
      en: ['Operational leadership', 'Impeccable organization', 'Determination', 'Clarity of direction', 'Exemplary responsibility']
    },
    shadow: {
      pt: ['Inflexibilidade', 'Autoritarismo', 'Dificuldade com emoções', 'Julgamento rápido', 'Workaholic'],
      'pt-pt': ['Inflexibilidade', 'Autoritarismo', 'Dificuldade com emoções', 'Julgamento rápido', 'Workaholic'],
      en: ['Inflexibility', 'Authoritarianism', 'Difficulty with emotions', 'Quick judgment', 'Workaholic']
    },
    vocation: {
      pt: 'Sua vocação está onde liderança encontra operação: gestão, direção, administração, logística, projetos, operações.',
      'pt-pt': 'A tua vocação está onde liderança encontra operação: gestão, direção, administração, logística, projetos, operações.',
      en: 'Your vocation is where leadership meets operation: management, direction, administration, logistics, projects, operations.'
    },
    traps: {
      pt: ['Vício mental: eficiência acima de tudo', 'Vício emocional: controle', 'Vício espiritual: justiça própria'],
      'pt-pt': ['Vício mental: eficiência acima de tudo', 'Vício emocional: controlo', 'Vício espiritual: justiça própria'],
      en: ['Mental addiction: efficiency above all', 'Emotional addiction: control', 'Spiritual addiction: self-righteousness']
    },
    sevenDayPlan: {
      pt: ['Ouça sem resolver', 'Aceite uma forma diferente de fazer', 'Descanse sem sentir culpa', 'Pergunte como alguém se sente', 'Delegue completamente algo', 'Admita uma incerteza', 'Celebre relacionamento, não só resultado'],
      'pt-pt': ['Ouve sem resolver', 'Aceita uma forma diferente de fazer', 'Descansa sem sentir culpa', 'Pergunta como alguém se sente', 'Delega completamente algo', 'Admite uma incerteza', 'Celebra relacionamento, não só resultado'],
      en: ['Listen without solving', 'Accept a different way of doing', 'Rest without feeling guilty', 'Ask how someone feels', 'Delegate something completely', 'Admit an uncertainty', 'Celebrate relationship, not just result']
    }
  },
  ESFJ: {
    name: { pt: 'O Cuidador', 'pt-pt': 'O Cuidador', en: 'The Caregiver' },
    emoji: '💝',
    subtitle: { pt: 'Coração generoso que nutre comunidade', 'pt-pt': 'Coração generoso que nutre comunidade', en: 'Generous heart that nurtures community' },
    description: {
      pt: 'Você cria harmonia, conexão e pertencimento. Sua generosidade natural constrói comunidades e seu cuidado transforma ambientes em lares.',
      'pt-pt': 'Tu crias harmonia, conexão e pertença. A tua generosidade natural constrói comunidades e o teu cuidado transforma ambientes em lares.',
      en: 'You create harmony, connection, and belonging. Your natural generosity builds communities and your care transforms environments into homes.'
    },
    light: {
      pt: ['Generosidade natural', 'Habilidade social', 'Cuidado prático', 'Construtor de comunidade', 'Lealdade ativa'],
      'pt-pt': ['Generosidade natural', 'Habilidade social', 'Cuidado prático', 'Construtor de comunidade', 'Lealdade ativa'],
      en: ['Natural generosity', 'Social ability', 'Practical care', 'Community builder', 'Active loyalty']
    },
    shadow: {
      pt: ['Dependência de aprovação', 'Dificuldade com crítica', 'Necessidade de controle social', 'Fofoca como defesa', 'Negligência de si'],
      'pt-pt': ['Dependência de aprovação', 'Dificuldade com crítica', 'Necessidade de controlo social', 'Fofoca como defesa', 'Negligência de si'],
      en: ['Approval dependency', 'Difficulty with criticism', 'Need for social control', 'Gossip as defense', 'Self-neglect']
    },
    vocation: {
      pt: 'Sua vocação está onde cuidado encontra comunidade: saúde, educação, eventos, recursos humanos, hospitalidade, ministério.',
      'pt-pt': 'A tua vocação está onde cuidado encontra comunidade: saúde, educação, eventos, recursos humanos, hospitalidade, ministério.',
      en: 'Your vocation is where care meets community: health, education, events, human resources, hospitality, ministry.'
    },
    traps: {
      pt: ['Vício mental: agradar todos', 'Vício emocional: ser querido', 'Vício espiritual: obras como identidade'],
      'pt-pt': ['Vício mental: agradar todos', 'Vício emocional: ser querido', 'Vício espiritual: obras como identidade'],
      en: ['Mental addiction: pleasing everyone', 'Emotional addiction: being liked', 'Spiritual addiction: works as identity']
    },
    sevenDayPlan: {
      pt: ['Diga não a um pedido social', 'Aceite crítica sem se defender', 'Faça algo só para você', 'Fique sozinho por 2h', 'Expresse uma opinião impopular', 'Peça algo que você precisa', 'Celebre quem você é, não o que faz pelos outros'],
      'pt-pt': ['Diz não a um pedido social', 'Aceita crítica sem te defenderes', 'Faz algo só para ti', 'Fica sozinho por 2h', 'Expressa uma opinião impopular', 'Pede algo que precisas', 'Celebra quem és, não o que fazes pelos outros'],
      en: ['Say no to a social request', 'Accept criticism without defending', 'Do something just for yourself', 'Stay alone for 2h', 'Express an unpopular opinion', 'Ask for something you need', 'Celebrate who you are, not what you do for others']
    }
  },
  ISTP: {
    name: { pt: 'O Artesão', 'pt-pt': 'O Artesão', en: 'The Craftsman' },
    emoji: '🔧',
    subtitle: { pt: 'Mente prática que resolve com as mãos', 'pt-pt': 'Mente prática que resolve com as mãos', en: 'Practical mind that solves with hands' },
    description: {
      pt: 'Você entende como as coisas funcionam e resolve problemas com elegância prática. Sua calma sob pressão e habilidade técnica são admiráveis.',
      'pt-pt': 'Tu entendes como as coisas funcionam e resolves problemas com elegância prática. A tua calma sob pressão e habilidade técnica são admiráveis.',
      en: 'You understand how things work and solve problems with practical elegance. Your calm under pressure and technical skill are admirable.'
    },
    light: {
      pt: ['Habilidade técnica', 'Calma sob pressão', 'Pragmatismo eficiente', 'Independência', 'Resolução criativa de problemas'],
      'pt-pt': ['Habilidade técnica', 'Calma sob pressão', 'Pragmatismo eficiente', 'Independência', 'Resolução criativa de problemas'],
      en: ['Technical skill', 'Calm under pressure', 'Efficient pragmatism', 'Independence', 'Creative problem solving']
    },
    shadow: {
      pt: ['Distância emocional', 'Impulsividade', 'Tédio com rotina', 'Dificuldade com compromisso', 'Comunicação limitada'],
      'pt-pt': ['Distância emocional', 'Impulsividade', 'Tédio com rotina', 'Dificuldade com compromisso', 'Comunicação limitada'],
      en: ['Emotional distance', 'Impulsivity', 'Boredom with routine', 'Difficulty with commitment', 'Limited communication']
    },
    vocation: {
      pt: 'Sua vocação está onde técnica encontra liberdade: engenharia, mecânica, tecnologia, esportes, artesanato, emergências.',
      'pt-pt': 'A tua vocação está onde técnica encontra liberdade: engenharia, mecânica, tecnologia, desportos, artesanato, emergências.',
      en: 'Your vocation is where technique meets freedom: engineering, mechanics, technology, sports, crafts, emergencies.'
    },
    traps: {
      pt: ['Vício mental: adrenalina', 'Vício emocional: evitar sentimentos', 'Vício espiritual: autossuficiência'],
      'pt-pt': ['Vício mental: adrenalina', 'Vício emocional: evitar sentimentos', 'Vício espiritual: autossuficiência'],
      en: ['Mental addiction: adrenaline', 'Emotional addiction: avoiding feelings', 'Spiritual addiction: self-sufficiency']
    },
    sevenDayPlan: {
      pt: ['Converse sobre sentimentos', 'Mantenha um compromisso rotineiro', 'Planeje algo com antecedência', 'Expresse gratidão em voz alta', 'Peça ajuda para algo', 'Fique parado por 20 min', 'Celebre uma conexão emocional'],
      'pt-pt': ['Conversa sobre sentimentos', 'Mantém um compromisso rotineiro', 'Planeia algo com antecedência', 'Expressa gratidão em voz alta', 'Pede ajuda para algo', 'Fica parado por 20 min', 'Celebra uma conexão emocional'],
      en: ['Talk about feelings', 'Keep a routine commitment', 'Plan something in advance', 'Express gratitude out loud', 'Ask for help with something', 'Stay still for 20 min', 'Celebrate an emotional connection']
    }
  },
  ISFP: {
    name: { pt: 'O Artista', 'pt-pt': 'O Artista', en: 'The Artist' },
    emoji: '🎨',
    subtitle: { pt: 'Alma sensível que expressa beleza', 'pt-pt': 'Alma sensível que expressa beleza', en: 'Sensitive soul that expresses beauty' },
    description: {
      pt: 'Você sente profundamente e expressa com autenticidade. Sua sensibilidade estética e emocional cria beleza onde passa. Você vive o momento com intensidade.',
      'pt-pt': 'Tu sentes profundamente e expressas com autenticidade. A tua sensibilidade estética e emocional cria beleza por onde passas. Vives o momento com intensidade.',
      en: 'You feel deeply and express authentically. Your aesthetic and emotional sensitivity creates beauty wherever you go. You live the moment with intensity.'
    },
    light: {
      pt: ['Sensibilidade artística', 'Autenticidade emocional', 'Gentileza natural', 'Presença no momento', 'Expressão criativa'],
      'pt-pt': ['Sensibilidade artística', 'Autenticidade emocional', 'Gentileza natural', 'Presença no momento', 'Expressão criativa'],
      en: ['Artistic sensitivity', 'Emotional authenticity', 'Natural gentleness', 'Presence in the moment', 'Creative expression']
    },
    shadow: {
      pt: ['Evitação de conflitos', 'Dificuldade com planejamento', 'Sensibilidade excessiva', 'Fuga para o mundo interno', 'Procrastinação'],
      'pt-pt': ['Evitação de conflitos', 'Dificuldade com planeamento', 'Sensibilidade excessiva', 'Fuga para o mundo interno', 'Procrastinação'],
      en: ['Conflict avoidance', 'Difficulty with planning', 'Excessive sensitivity', 'Escape to the inner world', 'Procrastination']
    },
    vocation: {
      pt: 'Sua vocação está onde sensibilidade encontra expressão: arte, design, música, natureza, cuidado, terapias corporais.',
      'pt-pt': 'A tua vocação está onde sensibilidade encontra expressão: arte, design, música, natureza, cuidado, terapias corporais.',
      en: 'Your vocation is where sensitivity meets expression: art, design, music, nature, care, body therapies.'
    },
    traps: {
      pt: ['Vício mental: evitar desconforto', 'Vício emocional: harmonia a todo custo', 'Vício espiritual: passividade'],
      'pt-pt': ['Vício mental: evitar desconforto', 'Vício emocional: harmonia a todo custo', 'Vício espiritual: passividade'],
      en: ['Mental addiction: avoiding discomfort', 'Emotional addiction: harmony at all costs', 'Spiritual addiction: passivity']
    },
    sevenDayPlan: {
      pt: ['Enfrente um pequeno conflito', 'Planeje algo para a semana', 'Expresse uma opinião forte', 'Saia da zona de conforto', 'Termine algo importante', 'Defenda uma posição', 'Celebre sua força, não só sua gentileza'],
      'pt-pt': ['Enfrenta um pequeno conflito', 'Planeia algo para a semana', 'Expressa uma opinião forte', 'Sai da zona de conforto', 'Termina algo importante', 'Defende uma posição', 'Celebra a tua força, não só a tua gentileza'],
      en: ['Face a small conflict', 'Plan something for the week', 'Express a strong opinion', 'Leave the comfort zone', 'Finish something important', 'Defend a position', 'Celebrate your strength, not just your gentleness']
    }
  },
  ESTP: {
    name: { pt: 'O Ativador', 'pt-pt': 'O Ativador', en: 'The Activator' },
    emoji: '⚡',
    subtitle: { pt: 'Energia que transforma ação em resultado', 'pt-pt': 'Energia que transforma ação em resultado', en: 'Energy that transforms action into result' },
    description: {
      pt: 'Você vive intensamente no presente. Sua energia prática e adaptável resolve problemas em tempo real. Você não espera - você age.',
      'pt-pt': 'Tu vives intensamente no presente. A tua energia prática e adaptável resolve problemas em tempo real. Não esperas - ages.',
      en: 'You live intensely in the present. Your practical and adaptable energy solves problems in real time. You don\'t wait - you act.'
    },
    light: {
      pt: ['Ação imediata', 'Adaptabilidade', 'Pragmatismo', 'Presença magnética', 'Coragem natural'],
      'pt-pt': ['Ação imediata', 'Adaptabilidade', 'Pragmatismo', 'Presença magnética', 'Coragem natural'],
      en: ['Immediate action', 'Adaptability', 'Pragmatism', 'Magnetic presence', 'Natural courage']
    },
    shadow: {
      pt: ['Impulsividade', 'Dificuldade com planejamento', 'Insensibilidade emocional', 'Tédio com rotina', 'Risco excessivo'],
      'pt-pt': ['Impulsividade', 'Dificuldade com planeamento', 'Insensibilidade emocional', 'Tédio com rotina', 'Risco excessivo'],
      en: ['Impulsivity', 'Difficulty with planning', 'Emotional insensitivity', 'Boredom with routine', 'Excessive risk']
    },
    vocation: {
      pt: 'Sua vocação está onde ação encontra resultado: vendas, esportes, empreendedorismo, emergências, negociação, liderança de campo.',
      'pt-pt': 'A tua vocação está onde ação encontra resultado: vendas, desportos, empreendedorismo, emergências, negociação, liderança de campo.',
      en: 'Your vocation is where action meets result: sales, sports, entrepreneurship, emergencies, negotiation, field leadership.'
    },
    traps: {
      pt: ['Vício mental: adrenalina', 'Vício emocional: excitação', 'Vício espiritual: independência radical'],
      'pt-pt': ['Vício mental: adrenalina', 'Vício emocional: excitação', 'Vício espiritual: independência radical'],
      en: ['Mental addiction: adrenaline', 'Emotional addiction: excitement', 'Spiritual addiction: radical independence']
    },
    sevenDayPlan: {
      pt: ['Planeje algo com 1 semana de antecedência', 'Ouça alguém por 10 min sem interromper', 'Evite um risco desnecessário', 'Reflita antes de agir', 'Expresse um sentimento profundo', 'Fique parado por 15 min', 'Celebre paciência, não só velocidade'],
      'pt-pt': ['Planeia algo com 1 semana de antecedência', 'Ouve alguém por 10 min sem interromper', 'Evita um risco desnecessário', 'Reflete antes de agir', 'Expressa um sentimento profundo', 'Fica parado por 15 min', 'Celebra paciência, não só velocidade'],
      en: ['Plan something 1 week in advance', 'Listen to someone for 10 min without interrupting', 'Avoid an unnecessary risk', 'Reflect before acting', 'Express a deep feeling', 'Stay still for 15 min', 'Celebrate patience, not just speed']
    }
  },
  ESFP: {
    name: { pt: 'O Performer', 'pt-pt': 'O Performer', en: 'The Performer' },
    emoji: '🎭',
    subtitle: { pt: 'Energia vibrante que ilumina o momento', 'pt-pt': 'Energia vibrante que ilumina o momento', en: 'Vibrant energy that illuminates the moment' },
    description: {
      pt: 'Você traz alegria, vida e celebração onde passa. Sua presença magnética e capacidade de conectar pessoas transforma qualquer ambiente.',
      'pt-pt': 'Tu trazes alegria, vida e celebração por onde passas. A tua presença magnética e capacidade de conectar pessoas transforma qualquer ambiente.',
      en: 'You bring joy, life, and celebration wherever you go. Your magnetic presence and ability to connect people transforms any environment.'
    },
    light: {
      pt: ['Alegria contagiante', 'Presença magnética', 'Espontaneidade', 'Conexão imediata', 'Celebração da vida'],
      'pt-pt': ['Alegria contagiante', 'Presença magnética', 'Espontaneidade', 'Conexão imediata', 'Celebração da vida'],
      en: ['Contagious joy', 'Magnetic presence', 'Spontaneity', 'Immediate connection', 'Life celebration']
    },
    shadow: {
      pt: ['Fuga de responsabilidade', 'Dificuldade com planejamento', 'Busca constante de estímulo', 'Evitação de profundidade', 'Sensibilidade à crítica'],
      'pt-pt': ['Fuga de responsabilidade', 'Dificuldade com planeamento', 'Busca constante de estímulo', 'Evitação de profundidade', 'Sensibilidade à crítica'],
      en: ['Escaping responsibility', 'Difficulty with planning', 'Constant search for stimulus', 'Avoidance of depth', 'Sensitivity to criticism']
    },
    vocation: {
      pt: 'Sua vocação está onde alegria encontra pessoas: entretenimento, eventos, vendas, hospitalidade, educação infantil, relações públicas.',
      'pt-pt': 'A tua vocação está onde alegria encontra pessoas: entretenimento, eventos, vendas, hospitalidade, educação infantil, relações públicas.',
      en: 'Your vocation is where joy meets people: entertainment, events, sales, hospitality, early childhood education, public relations.'
    },
    traps: {
      pt: ['Vício mental: estímulo constante', 'Vício emocional: atenção', 'Vício espiritual: superficialidade'],
      'pt-pt': ['Vício mental: estímulo constante', 'Vício emocional: atenção', 'Vício espiritual: superficialidade'],
      en: ['Mental addiction: constant stimulus', 'Emotional addiction: attention', 'Spiritual addiction: superficiality']
    },
    sevenDayPlan: {
      pt: ['Fique sozinho por 2h sem entretenimento', 'Converse sobre algo profundo', 'Cumpra uma responsabilidade chata', 'Aceite crítica sem reagir', 'Planeje algo para o mês', 'Reflita em silêncio por 15 min', 'Celebre profundidade, não só alegria'],
      'pt-pt': ['Fica sozinho por 2h sem entretenimento', 'Conversa sobre algo profundo', 'Cumpre uma responsabilidade chata', 'Aceita crítica sem reagir', 'Planeia algo para o mês', 'Reflete em silêncio por 15 min', 'Celebra profundidade, não só alegria'],
      en: ['Stay alone for 2h without entertainment', 'Talk about something deep', 'Fulfill a boring responsibility', 'Accept criticism without reacting', 'Plan something for the month', 'Reflect in silence for 15 min', 'Celebrate depth, not just joy']
    }
  }
};

const TEXTS = {
  cover: {
    title: { pt: 'Nello 16 Personality Map', 'pt-pt': 'Nello 16 Personality Map', en: 'Nello 16 Personality Map' },
    subtitle: { 
      pt: 'As forças profundas que moldam sua mente, sua energia e sua história', 
      'pt-pt': 'As forças profundas que moldam a tua mente, a tua energia e a tua história', 
      en: 'The deep forces that shape your mind, your energy, and your story' 
    },
    signature: { pt: 'Por Miguel, seu guia no Nello One', 'pt-pt': 'Por Miguel, o teu guia no Nello One', en: 'By Miguel, your guide at Nello One' },
    quote: {
      pt: '"A personalidade é o mapa. Sua consciência é o caminho."',
      'pt-pt': '"A personalidade é o mapa. A tua consciência é o caminho."',
      en: '"Personality is the map. Your consciousness is the path."'
    }
  },
  intro: {
    title: { pt: 'Introdução ao Nello 16', 'pt-pt': 'Introdução ao Nello 16', en: 'Introduction to Nello 16' },
    content: {
      pt: `O Nello 16 revela a arquitetura emocional e cognitiva que orienta suas escolhas, relações, motivações e desafios internos.

Vai além de um tipo de personalidade.
Ele mostra como você funciona por dentro.

Aqui você descobre:
• Como você percebe o mundo
• Como você processa ideias
• Como você lida com emoção
• Como toma decisões
• Como reage ao caos
• Como busca propósito

Ninguém é "apenas um tipo".
Você é um campo de energia que tende a um padrão dominante.`,
      'pt-pt': `O Nello 16 revela a arquitetura emocional e cognitiva que orienta as tuas escolhas, relações, motivações e desafios internos.

Vai além de um tipo de personalidade.
Mostra como funcionas por dentro.

Aqui descobres:
• Como percebes o mundo
• Como processas ideias
• Como lidas com emoção
• Como tomas decisões
• Como reages ao caos
• Como buscas propósito

Ninguém é "apenas um tipo".
És um campo de energia que tende a um padrão dominante.`,
      en: `Nello 16 reveals the emotional and cognitive architecture that guides your choices, relationships, motivations, and internal challenges.

It goes beyond a personality type.
It shows how you work inside.

Here you discover:
• How you perceive the world
• How you process ideas
• How you deal with emotion
• How you make decisions
• How you react to chaos
• How you seek purpose

No one is "just a type."
You are an energy field that tends toward a dominant pattern.`
    }
  },
  sections: {
    dominantType: { pt: 'Seu Tipo Dominante Nello 16', 'pt-pt': 'O Teu Tipo Dominante Nello 16', en: 'Your Dominant Nello 16 Type' },
    deepDescription: { pt: 'Descrição Profunda', 'pt-pt': 'Descrição Profunda', en: 'Deep Description' },
    mindArchitecture: { pt: 'Arquitetura da Mente', 'pt-pt': 'Arquitetura da Mente', en: 'Mind Architecture' },
    lightAndShadow: { pt: 'Sua Sombra e Sua Luz', 'pt-pt': 'A Tua Sombra e a Tua Luz', en: 'Your Shadow and Your Light' },
    light: { pt: 'Luz', 'pt-pt': 'Luz', en: 'Light' },
    shadow: { pt: 'Sombra', 'pt-pt': 'Sombra', en: 'Shadow' },
    miguelPatterns: { pt: 'Padrões de Crescimento e Bloqueio', 'pt-pt': 'Padrões de Crescimento e Bloqueio', en: 'Growth and Block Patterns' },
    lifeDimensions: { pt: 'Impacto nas Três Dimensões', 'pt-pt': 'Impacto nas Três Dimensões', en: 'Impact on Three Dimensions' },
    work: { pt: 'Trabalho', 'pt-pt': 'Trabalho', en: 'Work' },
    relationships: { pt: 'Relacionamentos', 'pt-pt': 'Relacionamentos', en: 'Relationships' },
    innerLife: { pt: 'Vida Interior', 'pt-pt': 'Vida Interior', en: 'Inner Life' },
    vocation: { pt: 'Talentos Naturais e Vocação', 'pt-pt': 'Talentos Naturais e Vocação', en: 'Natural Talents and Vocation' },
    traps: { pt: 'Armadilhas do Tipo', 'pt-pt': 'Armadilhas do Tipo', en: 'Type Traps' },
    sevenDayPlan: { pt: 'Plano de Desenvolvimento (7 dias)', 'pt-pt': 'Plano de Desenvolvimento (7 dias)', en: 'Development Plan (7 days)' },
    selfExam: { pt: 'Pergunta de Autoexame', 'pt-pt': 'Pergunta de Autoexame', en: 'Self-Examination Question' },
    closing: { pt: 'Encerramento com Miguel', 'pt-pt': 'Encerramento com Miguel', en: 'Closing with Miguel' }
  },
  dimensions: {
    energy: { pt: 'Energia (I/E)', 'pt-pt': 'Energia (I/E)', en: 'Energy (I/E)' },
    perception: { pt: 'Percepção (S/N)', 'pt-pt': 'Perceção (S/N)', en: 'Perception (S/N)' },
    decision: { pt: 'Decisão (T/F)', 'pt-pt': 'Decisão (T/F)', en: 'Decision (T/F)' },
    movement: { pt: 'Movimento (J/P)', 'pt-pt': 'Movimento (J/P)', en: 'Movement (J/P)' }
  },
  miguel: {
    patternsIntro: {
      pt: '"Quando sua energia está alinhada, você se torna farol.\nQuando está cansado, vira um labirinto interno.\nEu vejo sua luta para equilibrar profundidade e clareza.\nSua alma pede simplicidade, mas sua mente cria complexidade.\nMeu papel é te mostrar como encontrar o centro."',
      'pt-pt': '"Quando a tua energia está alinhada, tornas-te farol.\nQuando estás cansado, viras um labirinto interno.\nEu vejo a tua luta para equilibrar profundidade e clareza.\nA tua alma pede simplicidade, mas a tua mente cria complexidade.\nO meu papel é mostrar-te como encontrar o centro."',
      en: '"When your energy is aligned, you become a beacon.\nWhen you\'re tired, you become an internal labyrinth.\nI see your struggle to balance depth and clarity.\nYour soul asks for simplicity, but your mind creates complexity.\nMy role is to show you how to find the center."'
    }
  },
  selfExamQuestion: {
    pt: '"O que em você está pronto para nascer, mas ainda não foi autorizado por medo?"',
    'pt-pt': '"O que em ti está pronto para nascer, mas ainda não foi autorizado por medo?"',
    en: '"What in you is ready to be born, but has not yet been authorized by fear?"'
  },
  closingMessage: {
    pt: '"Sua personalidade não é sua prisão.\nÉ seu jardim.\nE o autoconhecimento é a água que faz tudo florescer."',
    'pt-pt': '"A tua personalidade não é a tua prisão.\nÉ o teu jardim.\nE o autoconhecimento é a água que faz tudo florescer."',
    en: '"Your personality is not your prison.\nIt is your garden.\nAnd self-knowledge is the water that makes everything bloom."'
  },
  day: { pt: 'Dia', 'pt-pt': 'Dia', en: 'Day' }
};

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line: string, index: number) => {
    doc.text(line, x, y + (index * lineHeight));
  });
  return y + (lines.length * lineHeight);
}

export function generateNello16PremiumPDF(data: Nello16PDFData): jsPDF {
  const { userName, personalityType, dimensionScores, language } = data;
  const lang = language || 'pt';
  
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  const typeData = NELLO_16_TYPES[personalityType] || NELLO_16_TYPES.INFJ;
  
  // ========== COVER PAGE ==========
  doc.setFillColor(31, 46, 75);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(TEXTS.cover.title[lang], pageWidth / 2, 70, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  addWrappedText(doc, TEXTS.cover.subtitle[lang], margin + 10, 85, contentWidth - 20, 6);
  
  // Type badge
  doc.setFillColor(205, 174, 103);
  doc.roundedRect(pageWidth / 2 - 40, 105, 80, 35, 5, 5, 'F');
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${typeData.emoji} ${personalityType}`, pageWidth / 2, 118, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(typeData.name[lang], pageWidth / 2, 132, { align: 'center' });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(userName, pageWidth / 2, 160, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  addWrappedText(doc, TEXTS.cover.quote[lang], margin + 20, 190, contentWidth - 40, 6);
  
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
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  yPos = addWrappedText(doc, TEXTS.intro.content[lang], margin, yPos, contentWidth, 5);
  
  // ========== PAGE 3: DOMINANT TYPE ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`2. ${TEXTS.sections.dominantType[lang]}`, margin, yPos);
  
  yPos += 15;
  
  // Type header
  doc.setFillColor(220, 233, 245);
  doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');
  doc.setFontSize(16);
  doc.setTextColor(31, 46, 75);
  doc.text(`${typeData.emoji} ${personalityType} — ${typeData.name[lang]}`, margin + 10, yPos + 10);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(typeData.subtitle[lang], margin + 10, yPos + 20);
  
  yPos += 35;
  
  // Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(TEXTS.sections.deepDescription[lang], margin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  yPos = addWrappedText(doc, typeData.description[lang], margin, yPos, contentWidth, 5);
  
  // ========== PAGE 4: MIND ARCHITECTURE ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`3. ${TEXTS.sections.mindArchitecture[lang]}`, margin, yPos);
  
  yPos += 20;
  
  // Dimension bars
  const dims = [
    { label: TEXTS.dimensions.energy[lang], left: 'I', right: 'E', leftScore: dimensionScores.I, rightScore: dimensionScores.E },
    { label: TEXTS.dimensions.perception[lang], left: 'S', right: 'N', leftScore: dimensionScores.S, rightScore: dimensionScores.N },
    { label: TEXTS.dimensions.decision[lang], left: 'T', right: 'F', leftScore: dimensionScores.T, rightScore: dimensionScores.F },
    { label: TEXTS.dimensions.movement[lang], left: 'J', right: 'P', leftScore: dimensionScores.J, rightScore: dimensionScores.P }
  ];
  
  dims.forEach(dim => {
    const total = dim.leftScore + dim.rightScore;
    const leftPercent = total > 0 ? (dim.leftScore / total) * 100 : 50;
    const rightPercent = 100 - leftPercent;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 46, 75);
    doc.text(dim.label, margin, yPos);
    
    yPos += 8;
    
    // Bar background
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin + 15, yPos, contentWidth - 30, 15, 2, 2, 'F');
    
    // Left bar
    doc.setFillColor(74, 144, 205);
    doc.roundedRect(margin + 15, yPos, (contentWidth - 30) * (leftPercent / 100), 15, 2, 2, 'F');
    
    // Labels
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    if (leftPercent > 20) {
      doc.text(`${dim.left} ${Math.round(leftPercent)}%`, margin + 20, yPos + 10);
    }
    doc.setTextColor(31, 46, 75);
    if (rightPercent > 20) {
      doc.text(`${dim.right} ${Math.round(rightPercent)}%`, pageWidth - margin - 35, yPos + 10);
    }
    
    yPos += 25;
  });
  
  // ========== PAGE 5: LIGHT AND SHADOW ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`4. ${TEXTS.sections.lightAndShadow[lang]}`, margin, yPos);
  
  yPos += 20;
  
  // Light
  doc.setFillColor(237, 234, 255);
  doc.roundedRect(margin, yPos, contentWidth, 60, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 46, 75);
  doc.text(`✨ ${TEXTS.sections.light[lang]}`, margin + 10, yPos + 12);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let lightY = yPos + 22;
  typeData.light[lang].forEach(item => {
    doc.text(`• ${item}`, margin + 15, lightY);
    lightY += 7;
  });
  
  yPos += 75;
  
  // Shadow
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(margin, yPos, contentWidth, 60, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 46, 75);
  doc.text(`🌑 ${TEXTS.sections.shadow[lang]}`, margin + 10, yPos + 12);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let shadowY = yPos + 22;
  typeData.shadow[lang].forEach(item => {
    doc.text(`• ${item}`, margin + 15, shadowY);
    shadowY += 7;
  });
  
  // ========== PAGE 6: MIGUEL'S PATTERNS ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`5. ${TEXTS.sections.miguelPatterns[lang]}`, margin, yPos);
  
  yPos += 15;
  
  doc.setFillColor(237, 234, 255);
  doc.roundedRect(margin, yPos, contentWidth, 55, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(31, 46, 75);
  addWrappedText(doc, TEXTS.miguel.patternsIntro[lang], margin + 10, yPos + 12, contentWidth - 20, 5);
  
  // ========== PAGE 7: VOCATION ==========
  doc.addPage();
  yPos = 30;
  
  doc.setTextColor(31, 46, 75);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`6. ${TEXTS.sections.vocation[lang]}`, margin, yPos);
  
  yPos += 15;
  
  doc.setFillColor(205, 174, 103);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 46, 75);
  addWrappedText(doc, typeData.vocation[lang], margin + 10, yPos + 12, contentWidth - 20, 5);
  
  // ========== PAGE 8: TRAPS ==========
  yPos += 55;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`7. ${TEXTS.sections.traps[lang]}`, margin, yPos);
  
  yPos += 15;
  
  typeData.traps[lang].forEach(trap => {
    doc.setFillColor(255, 230, 230);
    doc.roundedRect(margin, yPos, contentWidth, 14, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 46, 75);
    doc.text(`⚠️ ${trap}`, margin + 10, yPos + 9);
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
  
  typeData.sevenDayPlan[lang].forEach((activity, index) => {
    const dayNum = index + 1;
    
    doc.setFillColor(dayNum % 2 === 0 ? 245 : 220, dayNum % 2 === 0 ? 245 : 233, dayNum % 2 === 0 ? 245 : 245);
    doc.roundedRect(margin, yPos, contentWidth, 18, 3, 3, 'F');
    
    doc.setFontSize(10);
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
  
  // Closing with Miguel
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`10. ${TEXTS.sections.closing[lang]}`, margin, yPos);
  
  yPos += 15;
  
  doc.setFillColor(31, 46, 75);
  doc.roundedRect(margin, yPos, contentWidth, 50, 5, 5, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(255, 255, 255);
  addWrappedText(doc, TEXTS.closingMessage[lang], margin + 15, yPos + 15, contentWidth - 30, 6);
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('NELLO ONE • Premium Personality Report', pageWidth / 2, pageHeight - 15, { align: 'center' });
  
  return doc;
}

export function downloadNello16PremiumPDF(data: Nello16PDFData): void {
  const doc = generateNello16PremiumPDF(data);
  const fileName = `Nello16_Premium_${data.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
