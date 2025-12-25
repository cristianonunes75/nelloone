// Nello 16 Personality Map Type Profiles
// Proprietary Nello One system inspired by Carl Jung's psychological type theory

// Mapping from internal MBTI-style codes to Nello proprietary display codes
// This allows us to use original naming while maintaining backward compatibility
export const NELLO_16_CODE_MAP: Record<string, string> = {
  INTJ: "N1-EA", // Nello 1 - Estrategista Analítico
  INTP: "N2-AA", // Nello 2 - Analista Abstrato
  ENTJ: "N3-AO", // Nello 3 - Arquitetador Organizacional
  ENTP: "N4-VI", // Nello 4 - Visionário Inovador
  INFJ: "N5-CP", // Nello 5 - Conselheiro Profundo
  INFP: "N6-PI", // Nello 6 - Poeta Idealista
  ENFJ: "N7-MI", // Nello 7 - Mentor Inspirador
  ENFP: "N8-IC", // Nello 8 - Inspirador Criativo
  ISTJ: "N9-GP", // Nello 9 - Guardião Prático
  ISFJ: "N10-PC", // Nello 10 - Protetor Confiável
  ESTJ: "N11-GE", // Nello 11 - Gestor Eficiente
  ESFJ: "N12-AF", // Nello 12 - Anfitrião Fraterno
  ISTP: "N13-AV", // Nello 13 - Artesão Versátil
  ISFP: "N14-AE", // Nello 14 - Artista Espontâneo
  ESTP: "N15-AT", // Nello 15 - Ativador Tático
  ESFP: "N16-AP", // Nello 16 - Animador Presente
};

// Get the display code for a Nello 16 type
export const getNello16DisplayCode = (internalCode: string): string => {
  return NELLO_16_CODE_MAP[internalCode] || internalCode;
};

export interface Nello16Profile {
  code: string;
  name: {
    pt: string;
    en: string;
    'pt-pt': string;
  };
  quadrant: 'analytic' | 'humanist' | 'pragmatic' | 'visionary';
  description: {
    pt: string;
    en: string;
    'pt-pt': string;
  };
  strengths: {
    pt: string[];
    en: string[];
    'pt-pt': string[];
  };
  challenges: {
    pt: string[];
    en: string[];
    'pt-pt': string[];
  };
  growthTips: {
    pt: string[];
    en: string[];
    'pt-pt': string[];
  };
}

export const NELLO_16_PROFILES: Record<string, Nello16Profile> = {
  INTJ: {
    code: "INTJ",
    name: { pt: "O Estrategista", en: "The Strategist", 'pt-pt': "O Estratega" },
    quadrant: "analytic",
    description: {
      pt: "Visionário e estratégico, você enxerga o futuro com clareza e propósito. Focado e reservado, trabalha por ideais elevados. Cresce ao incluir o outro em sua visão de mundo.",
      en: "Visionary and strategic, you see the future with clarity and purpose. Focused and reserved, you work for elevated ideals. You grow by including others in your worldview.",
      'pt-pt': "Visionário e estratégico, consegue ver o futuro com clareza e propósito. Focado e reservado, trabalha por ideais elevados. Evolui ao incluir os outros na sua visão de mundo."
    },
    strengths: {
      pt: ["Visão estratégica de longo prazo", "Pensamento independente e original", "Capacidade de transformar ideias em planos"],
      en: ["Long-term strategic vision", "Independent and original thinking", "Ability to transform ideas into plans"],
      'pt-pt': ["Visão estratégica de longo prazo", "Pensamento independente e original", "Capacidade de transformar ideias em planos"]
    },
    challenges: {
      pt: ["Dificuldade em expressar emoções", "Tendência ao perfeccionismo", "Pode parecer distante ou frio"],
      en: ["Difficulty expressing emotions", "Tendency towards perfectionism", "May appear distant or cold"],
      'pt-pt': ["Dificuldade em expressar emoções", "Tendência ao perfeccionismo", "Pode parecer distante ou frio"]
    },
    growthTips: {
      pt: ["Pratique expressar seus sentimentos, mesmo que brevemente", "Permita-se celebrar conquistas antes de buscar a próxima meta", "Cultive paciência com processos que não seguem sua lógica"],
      en: ["Practice expressing your feelings, even briefly", "Allow yourself to celebrate achievements before seeking the next goal", "Cultivate patience with processes that don't follow your logic"],
      'pt-pt': ["Pratique expressar os seus sentimentos, mesmo que brevemente", "Permita-se celebrar conquistas antes de procurar o próximo objetivo", "Cultive paciência com processos que não seguem a sua lógica"]
    }
  },
  INTP: {
    code: "INTP",
    name: { pt: "O Analista", en: "The Analyst", 'pt-pt': "O Analista" },
    quadrant: "analytic",
    description: {
      pt: "Analítico e curioso, você busca entender a lógica por trás das coisas. Independente e racional, encontra prazer em descobrir verdades. Cresce quando transforma conhecimento em conexão.",
      en: "Analytical and curious, you seek to understand the logic behind things. Independent and rational, you find pleasure in discovering truths. You grow when you transform knowledge into connection.",
      'pt-pt': "Analítico e curioso, procura compreender a lógica por detrás das coisas. Independente e racional, encontra prazer em descobrir verdades. Evolui quando transforma conhecimento em conexão."
    },
    strengths: {
      pt: ["Mente analítica poderosa", "Criatividade na resolução de problemas", "Busca constante por conhecimento"],
      en: ["Powerful analytical mind", "Creativity in problem solving", "Constant pursuit of knowledge"],
      'pt-pt': ["Mente analítica poderosa", "Criatividade na resolução de problemas", "Busca constante por conhecimento"]
    },
    challenges: {
      pt: ["Dificuldade em finalizar projetos", "Pode ser percebido como distraído", "Resistência a rotinas"],
      en: ["Difficulty finishing projects", "May be perceived as distracted", "Resistance to routines"],
      'pt-pt': ["Dificuldade em finalizar projetos", "Pode ser percebido como distraído", "Resistência a rotinas"]
    },
    growthTips: {
      pt: ["Estabeleça pequenas metas diárias para concluir projetos", "Pratique escuta ativa nas conversas", "Crie uma rotina mínima que dê estrutura ao seu dia"],
      en: ["Set small daily goals to complete projects", "Practice active listening in conversations", "Create a minimal routine that gives structure to your day"],
      'pt-pt': ["Estabeleça pequenas metas diárias para concluir projetos", "Pratique escuta ativa nas conversas", "Crie uma rotina mínima que dê estrutura ao seu dia"]
    }
  },
  ENTJ: {
    code: "ENTJ",
    name: { pt: "O Arquitetador", en: "The Commander", 'pt-pt': "O Arquiteto" },
    quadrant: "analytic",
    description: {
      pt: "Líder natural e decidido, você tem o dom de estruturar e realizar. Move-se com força e direção. Seu poder se completa quando alia firmeza à escuta e sensibilidade.",
      en: "Natural and decisive leader, you have the gift of structuring and accomplishing. You move with strength and direction. Your power is complete when you combine firmness with listening and sensitivity.",
      'pt-pt': "Líder natural e decidido, tem o dom de estruturar e realizar. Move-se com força e direção. O seu poder completa-se quando alia firmeza à escuta e sensibilidade."
    },
    strengths: {
      pt: ["Liderança natural e carismática", "Capacidade de organizar e executar", "Visão clara de objetivos"],
      en: ["Natural and charismatic leadership", "Ability to organize and execute", "Clear vision of objectives"],
      'pt-pt': ["Liderança natural e carismática", "Capacidade de organizar e executar", "Visão clara de objetivos"]
    },
    challenges: {
      pt: ["Pode ser visto como dominador", "Impaciência com processos lentos", "Dificuldade em delegar"],
      en: ["May be seen as domineering", "Impatience with slow processes", "Difficulty delegating"],
      'pt-pt': ["Pode ser visto como dominador", "Impaciência com processos lentos", "Dificuldade em delegar"]
    },
    growthTips: {
      pt: ["Pratique a arte de ouvir antes de decidir", "Confie mais na capacidade dos outros e delegue", "Reserve momentos de vulnerabilidade com pessoas próximas"],
      en: ["Practice the art of listening before deciding", "Trust more in others' capabilities and delegate", "Reserve moments of vulnerability with close people"],
      'pt-pt': ["Pratique a arte de ouvir antes de decidir", "Confie mais na capacidade dos outros e delegue", "Reserve momentos de vulnerabilidade com pessoas próximas"]
    }
  },
  ENTP: {
    code: "ENTP",
    name: { pt: "O Visionário", en: "The Visionary", 'pt-pt': "O Visionário" },
    quadrant: "visionary",
    description: {
      pt: "Inventivo e ousado, você ama desafios intelectuais e novas ideias. Sua energia está em inovar e provocar transformações. Evolui quando usa sua mente brilhante para construir e não apenas debater.",
      en: "Inventive and bold, you love intellectual challenges and new ideas. Your energy lies in innovating and provoking transformations. You evolve when you use your brilliant mind to build, not just debate.",
      'pt-pt': "Inventivo e ousado, adora desafios intelectuais e novas ideias. A sua energia está em inovar e provocar transformações. Evolui quando usa a sua mente brilhante para construir e não apenas debater."
    },
    strengths: {
      pt: ["Criatividade e inovação constantes", "Habilidade em debates e argumentação", "Adaptabilidade a mudanças"],
      en: ["Constant creativity and innovation", "Skill in debates and argumentation", "Adaptability to changes"],
      'pt-pt': ["Criatividade e inovação constantes", "Habilidade em debates e argumentação", "Adaptabilidade a mudanças"]
    },
    challenges: {
      pt: ["Dificuldade em manter foco", "Pode ser argumentativo demais", "Tendência a procrastinar rotinas"],
      en: ["Difficulty maintaining focus", "May be too argumentative", "Tendency to procrastinate routines"],
      'pt-pt': ["Dificuldade em manter foco", "Pode ser argumentativo demais", "Tendência a procrastinar rotinas"]
    },
    growthTips: {
      pt: ["Canalize sua energia em construir, não apenas debater", "Pratique a conclusão de projetos antes de iniciar novos", "Cultive a arte de concordar em discordar"],
      en: ["Channel your energy into building, not just debating", "Practice completing projects before starting new ones", "Cultivate the art of agreeing to disagree"],
      'pt-pt': ["Canalize a sua energia em construir, não apenas debater", "Pratique a conclusão de projetos antes de iniciar novos", "Cultive a arte de concordar em discordar"]
    }
  },
  INFJ: {
    code: "INFJ",
    name: { pt: "O Conselheiro", en: "The Counselor", 'pt-pt': "O Conselheiro" },
    quadrant: "humanist",
    description: {
      pt: "Intuitivo e profundo, você percebe o invisível e busca sentido em tudo. Tende a guiar com sabedoria e empatia. Sua luz cresce quando aceita que o mundo também ensina pela imperfeição.",
      en: "Intuitive and deep, you perceive the invisible and seek meaning in everything. You tend to guide with wisdom and empathy. Your light grows when you accept that the world also teaches through imperfection.",
      'pt-pt': "Intuitivo e profundo, percebe o invisível e procura sentido em tudo. Tende a guiar com sabedoria e empatia. A sua luz cresce quando aceita que o mundo também ensina pela imperfeição."
    },
    strengths: {
      pt: ["Empatia profunda e genuína", "Visão de longo prazo para pessoas", "Capacidade de inspirar mudanças"],
      en: ["Deep and genuine empathy", "Long-term vision for people", "Ability to inspire change"],
      'pt-pt': ["Empatia profunda e genuína", "Visão de longo prazo para pessoas", "Capacidade de inspirar mudanças"]
    },
    challenges: {
      pt: ["Tendência ao perfeccionismo", "Pode se esgotar cuidando dos outros", "Dificuldade em lidar com conflitos"],
      en: ["Tendency towards perfectionism", "May burn out caring for others", "Difficulty dealing with conflicts"],
      'pt-pt': ["Tendência ao perfeccionismo", "Pode esgotar-se a cuidar dos outros", "Dificuldade em lidar com conflitos"]
    },
    growthTips: {
      pt: ["Reserve tempo sagrado para autocuidado", "Aceite que nem todos precisam ser salvos por você", "Pratique expressar suas necessidades sem culpa"],
      en: ["Reserve sacred time for self-care", "Accept that not everyone needs to be saved by you", "Practice expressing your needs without guilt"],
      'pt-pt': ["Reserve tempo sagrado para autocuidado", "Aceite que nem todos precisam de ser salvos por si", "Pratique expressar as suas necessidades sem culpa"]
    }
  },
  INFP: {
    code: "INFP",
    name: { pt: "O Poeta", en: "The Poet", 'pt-pt': "O Poeta" },
    quadrant: "humanist",
    description: {
      pt: "Idealista e compassivo, você é guiado por valores e pela busca de significado. Sensível e criativo, encontra sentido em servir e inspirar. Sua força está em transformar sentimento em beleza e fé em ação.",
      en: "Idealistic and compassionate, you are guided by values and the search for meaning. Sensitive and creative, you find meaning in serving and inspiring. Your strength lies in transforming feeling into beauty and faith into action.",
      'pt-pt': "Idealista e compassivo, é guiado por valores e pela busca de significado. Sensível e criativo, encontra sentido em servir e inspirar. A sua força está em transformar sentimento em beleza e fé em ação."
    },
    strengths: {
      pt: ["Profundidade emocional e criativa", "Lealdade inabalável a valores", "Capacidade de ver o melhor nos outros"],
      en: ["Emotional and creative depth", "Unwavering loyalty to values", "Ability to see the best in others"],
      'pt-pt': ["Profundidade emocional e criativa", "Lealdade inabalável a valores", "Capacidade de ver o melhor nos outros"]
    },
    challenges: {
      pt: ["Sensibilidade a críticas", "Dificuldade com decisões práticas", "Pode idealizar demais"],
      en: ["Sensitivity to criticism", "Difficulty with practical decisions", "May over-idealize"],
      'pt-pt': ["Sensibilidade a críticas", "Dificuldade com decisões práticas", "Pode idealizar demais"]
    },
    growthTips: {
      pt: ["Estabeleça metas concretas para seus sonhos", "Pratique receber feedback como oportunidade de crescimento", "Equilibre idealismo com ação prática"],
      en: ["Set concrete goals for your dreams", "Practice receiving feedback as a growth opportunity", "Balance idealism with practical action"],
      'pt-pt': ["Estabeleça metas concretas para os seus sonhos", "Pratique receber feedback como oportunidade de crescimento", "Equilibre idealismo com ação prática"]
    }
  },
  ENFJ: {
    code: "ENFJ",
    name: { pt: "O Mentor", en: "The Mentor", 'pt-pt': "O Mentor" },
    quadrant: "humanist",
    description: {
      pt: "Carismático e sensível, você lidera com o coração. Enxerga talentos e desperta o melhor nas pessoas. Seu poder floresce quando equilibra doação com descanso e autocuidado.",
      en: "Charismatic and sensitive, you lead with your heart. You see talents and bring out the best in people. Your power flourishes when you balance giving with rest and self-care.",
      'pt-pt': "Carismático e sensível, lidera com o coração. Vê talentos e desperta o melhor nas pessoas. O seu poder floresce quando equilibra doação com descanso e autocuidado."
    },
    strengths: {
      pt: ["Carisma natural e influência", "Habilidade em desenvolver pessoas", "Comunicação inspiradora"],
      en: ["Natural charisma and influence", "Skill in developing people", "Inspiring communication"],
      'pt-pt': ["Carisma natural e influência", "Habilidade em desenvolver pessoas", "Comunicação inspiradora"]
    },
    challenges: {
      pt: ["Dificuldade em dizer não", "Pode negligenciar próprias necessidades", "Sensibilidade a rejeição"],
      en: ["Difficulty saying no", "May neglect own needs", "Sensitivity to rejection"],
      'pt-pt': ["Dificuldade em dizer não", "Pode negligenciar as próprias necessidades", "Sensibilidade à rejeição"]
    },
    growthTips: {
      pt: ["Pratique dizer 'não' como um ato de amor próprio", "Reserve energia para você antes de dar aos outros", "Reconheça que rejeição não define seu valor"],
      en: ["Practice saying 'no' as an act of self-love", "Reserve energy for yourself before giving to others", "Recognize that rejection doesn't define your worth"],
      'pt-pt': ["Pratique dizer 'não' como um ato de amor próprio", "Reserve energia para si antes de dar aos outros", "Reconheça que rejeição não define o seu valor"]
    }
  },
  ENFP: {
    code: "ENFP",
    name: { pt: "O Inspirador", en: "The Inspirer", 'pt-pt': "O Inspirador" },
    quadrant: "visionary",
    description: {
      pt: "Visionário e entusiasmado, você é movido por possibilidades e conexões humanas. Inspira os outros com leveza e autenticidade. Sua energia floresce quando mantém foco e enraizamento.",
      en: "Visionary and enthusiastic, you are driven by possibilities and human connections. You inspire others with lightness and authenticity. Your energy flourishes when you maintain focus and grounding.",
      'pt-pt': "Visionário e entusiasmado, é movido por possibilidades e conexões humanas. Inspira os outros com leveza e autenticidade. A sua energia floresce quando mantém foco e enraizamento."
    },
    strengths: {
      pt: ["Entusiasmo contagiante", "Criatividade em conexões humanas", "Adaptabilidade e otimismo"],
      en: ["Contagious enthusiasm", "Creativity in human connections", "Adaptability and optimism"],
      'pt-pt': ["Entusiasmo contagiante", "Criatividade em conexões humanas", "Adaptabilidade e otimismo"]
    },
    challenges: {
      pt: ["Dificuldade em manter foco", "Pode evitar conflitos necessários", "Tendência a assumir demais"],
      en: ["Difficulty maintaining focus", "May avoid necessary conflicts", "Tendency to take on too much"],
      'pt-pt': ["Dificuldade em manter foco", "Pode evitar conflitos necessários", "Tendência a assumir demais"]
    },
    growthTips: {
      pt: ["Escolha uma prioridade por vez e comprometa-se", "Enfrente conversas difíceis com compaixão", "Estabeleça limites claros de energia"],
      en: ["Choose one priority at a time and commit", "Face difficult conversations with compassion", "Set clear energy boundaries"],
      'pt-pt': ["Escolha uma prioridade de cada vez e comprometa-se", "Enfrente conversas difíceis com compaixão", "Estabeleça limites claros de energia"]
    }
  },
  ISTJ: {
    code: "ISTJ",
    name: { pt: "O Guardião", en: "The Guardian", 'pt-pt': "O Guardião" },
    quadrant: "pragmatic",
    description: {
      pt: "Responsável e organizado, você honra compromissos e mantém a ordem. Valoriza estrutura e previsibilidade. Cresce ao permitir-se flexibilidade e alegria.",
      en: "Responsible and organized, you honor commitments and maintain order. You value structure and predictability. You grow by allowing yourself flexibility and joy.",
      'pt-pt': "Responsável e organizado, honra compromissos e mantém a ordem. Valoriza estrutura e previsibilidade. Evolui ao permitir-se flexibilidade e alegria."
    },
    strengths: {
      pt: ["Confiabilidade inabalável", "Atenção meticulosa a detalhes", "Senso de dever e responsabilidade"],
      en: ["Unwavering reliability", "Meticulous attention to detail", "Sense of duty and responsibility"],
      'pt-pt': ["Confiabilidade inabalável", "Atenção meticulosa a detalhes", "Senso de dever e responsabilidade"]
    },
    challenges: {
      pt: ["Resistência a mudanças", "Pode ser inflexível demais", "Dificuldade em expressar emoções"],
      en: ["Resistance to change", "May be too inflexible", "Difficulty expressing emotions"],
      'pt-pt': ["Resistência a mudanças", "Pode ser inflexível demais", "Dificuldade em expressar emoções"]
    },
    growthTips: {
      pt: ["Permita-se experimentar uma novidade por semana", "Pratique a flexibilidade em pequenas decisões", "Expresse uma emoção genuína por dia"],
      en: ["Allow yourself to try something new each week", "Practice flexibility in small decisions", "Express one genuine emotion per day"],
      'pt-pt': ["Permita-se experimentar uma novidade por semana", "Pratique a flexibilidade em pequenas decisões", "Expresse uma emoção genuína por dia"]
    }
  },
  ISFJ: {
    code: "ISFJ",
    name: { pt: "O Protetor", en: "The Protector", 'pt-pt': "O Protetor" },
    quadrant: "pragmatic",
    description: {
      pt: "Dedicado e protetor, você serve com generosidade e atenção aos detalhes. Valoriza tradição e estabilidade. Cresce quando confia mais em sua voz interior e reconhece o próprio valor.",
      en: "Dedicated and protective, you serve with generosity and attention to detail. You value tradition and stability. You grow when you trust your inner voice more and recognize your own worth.",
      'pt-pt': "Dedicado e protetor, serve com generosidade e atenção aos detalhes. Valoriza tradição e estabilidade. Evolui quando confia mais na sua voz interior e reconhece o próprio valor."
    },
    strengths: {
      pt: ["Dedicação e lealdade profundas", "Memória excepcional para detalhes", "Cuidado genuíno com os outros"],
      en: ["Deep dedication and loyalty", "Exceptional memory for details", "Genuine care for others"],
      'pt-pt': ["Dedicação e lealdade profundas", "Memória excecional para detalhes", "Cuidado genuíno com os outros"]
    },
    challenges: {
      pt: ["Dificuldade em pedir ajuda", "Pode reprimir próprias necessidades", "Resistência a mudanças"],
      en: ["Difficulty asking for help", "May suppress own needs", "Resistance to change"],
      'pt-pt': ["Dificuldade em pedir ajuda", "Pode reprimir as próprias necessidades", "Resistência a mudanças"]
    },
    growthTips: {
      pt: ["Pratique pedir ajuda como um presente aos outros", "Reconheça e expresse suas próprias necessidades", "Abrace pequenas mudanças como oportunidades"],
      en: ["Practice asking for help as a gift to others", "Recognize and express your own needs", "Embrace small changes as opportunities"],
      'pt-pt': ["Pratique pedir ajuda como um presente aos outros", "Reconheça e expresse as suas próprias necessidades", "Abrace pequenas mudanças como oportunidades"]
    }
  },
  ESTJ: {
    code: "ESTJ",
    name: { pt: "O Executor", en: "The Executive", 'pt-pt': "O Executor" },
    quadrant: "pragmatic",
    description: {
      pt: "Prático e eficiente, você transforma planos em resultados. Lidera com clareza e autoridade. Evolui quando reconhece o poder da empatia e do diálogo.",
      en: "Practical and efficient, you transform plans into results. You lead with clarity and authority. You evolve when you recognize the power of empathy and dialogue.",
      'pt-pt': "Prático e eficiente, transforma planos em resultados. Lidera com clareza e autoridade. Evolui quando reconhece o poder da empatia e do diálogo."
    },
    strengths: {
      pt: ["Capacidade de organização e execução", "Liderança direta e eficaz", "Comprometimento com resultados"],
      en: ["Organization and execution capability", "Direct and effective leadership", "Commitment to results"],
      'pt-pt': ["Capacidade de organização e execução", "Liderança direta e eficaz", "Comprometimento com resultados"]
    },
    challenges: {
      pt: ["Pode parecer inflexível", "Dificuldade com mudanças inesperadas", "Impaciência com processos lentos"],
      en: ["May appear inflexible", "Difficulty with unexpected changes", "Impatience with slow processes"],
      'pt-pt': ["Pode parecer inflexível", "Dificuldade com mudanças inesperadas", "Impaciência com processos lentos"]
    },
    growthTips: {
      pt: ["Pratique pausar antes de reagir", "Reconheça o valor de perspectivas diferentes", "Cultive momentos de presença sem agenda"],
      en: ["Practice pausing before reacting", "Recognize the value of different perspectives", "Cultivate moments of presence without agenda"],
      'pt-pt': ["Pratique pausar antes de reagir", "Reconheça o valor de perspetivas diferentes", "Cultive momentos de presença sem agenda"]
    }
  },
  ESFJ: {
    code: "ESFJ",
    name: { pt: "O Cuidador", en: "The Caregiver", 'pt-pt': "O Cuidador" },
    quadrant: "pragmatic",
    description: {
      pt: "Sociável e acolhedor, você constrói laços e harmonia ao seu redor. Gosta de cuidar e ser útil. Seu brilho aumenta quando aprende a dizer não sem culpa.",
      en: "Sociable and welcoming, you build bonds and harmony around you. You like to care and be useful. Your brightness increases when you learn to say no without guilt.",
      'pt-pt': "Sociável e acolhedor, constrói laços e harmonia ao seu redor. Gosta de cuidar e ser útil. O seu brilho aumenta quando aprende a dizer não sem culpa."
    },
    strengths: {
      pt: ["Habilidade em criar harmonia", "Generosidade e hospitalidade", "Memória para detalhes pessoais"],
      en: ["Skill in creating harmony", "Generosity and hospitality", "Memory for personal details"],
      'pt-pt': ["Habilidade em criar harmonia", "Generosidade e hospitalidade", "Memória para detalhes pessoais"]
    },
    challenges: {
      pt: ["Dificuldade em lidar com críticas", "Pode negligenciar próprias necessidades", "Busca excessiva por aprovação"],
      en: ["Difficulty dealing with criticism", "May neglect own needs", "Excessive search for approval"],
      'pt-pt': ["Dificuldade em lidar com críticas", "Pode negligenciar as próprias necessidades", "Busca excessiva por aprovação"]
    },
    growthTips: {
      pt: ["Pratique receber críticas sem internalizar", "Cuide de si antes de cuidar dos outros", "Busque validação interna, não apenas externa"],
      en: ["Practice receiving criticism without internalizing", "Take care of yourself before caring for others", "Seek internal validation, not just external"],
      'pt-pt': ["Pratique receber críticas sem internalizar", "Cuide de si antes de cuidar dos outros", "Procure validação interna, não apenas externa"]
    }
  },
  ISTP: {
    code: "ISTP",
    name: { pt: "O Artesão", en: "The Craftsman", 'pt-pt': "O Artesão" },
    quadrant: "pragmatic",
    description: {
      pt: "Observador e prático, você entende o mundo pelas mãos. Habilidoso e independente, busca liberdade. Evolui ao abrir-se emocionalmente e pedir ajuda quando necessário.",
      en: "Observant and practical, you understand the world through your hands. Skilled and independent, you seek freedom. You evolve by opening up emotionally and asking for help when needed.",
      'pt-pt': "Observador e prático, compreende o mundo pelas mãos. Habilidoso e independente, procura liberdade. Evolui ao abrir-se emocionalmente e pedir ajuda quando necessário."
    },
    strengths: {
      pt: ["Habilidade técnica excepcional", "Capacidade de resolver problemas", "Calma sob pressão"],
      en: ["Exceptional technical skill", "Problem-solving ability", "Calm under pressure"],
      'pt-pt': ["Habilidade técnica excecional", "Capacidade de resolver problemas", "Calma sob pressão"]
    },
    challenges: {
      pt: ["Dificuldade em expressar emoções", "Pode parecer desinteressado", "Resistência a compromissos longos"],
      en: ["Difficulty expressing emotions", "May appear disinterested", "Resistance to long commitments"],
      'pt-pt': ["Dificuldade em expressar emoções", "Pode parecer desinteressado", "Resistência a compromissos longos"]
    },
    growthTips: {
      pt: ["Pratique verbalizar seus sentimentos", "Mostre interesse através de perguntas genuínas", "Permita-se vulnerabilidade em relacionamentos próximos"],
      en: ["Practice verbalizing your feelings", "Show interest through genuine questions", "Allow yourself vulnerability in close relationships"],
      'pt-pt': ["Pratique verbalizar os seus sentimentos", "Mostre interesse através de perguntas genuínas", "Permita-se vulnerabilidade em relacionamentos próximos"]
    }
  },
  ISFP: {
    code: "ISFP",
    name: { pt: "O Artista", en: "The Artist", 'pt-pt': "O Artista" },
    quadrant: "humanist",
    description: {
      pt: "Artístico e sensível, você vive o momento com beleza e autenticidade. Prefere harmonia e liberdade. Cresce ao confiar mais em sua voz e assumir seu espaço no mundo.",
      en: "Artistic and sensitive, you live in the moment with beauty and authenticity. You prefer harmony and freedom. You grow by trusting your voice more and claiming your space in the world.",
      'pt-pt': "Artístico e sensível, vive o momento com beleza e autenticidade. Prefere harmonia e liberdade. Evolui ao confiar mais na sua voz e assumir o seu espaço no mundo."
    },
    strengths: {
      pt: ["Sensibilidade estética apurada", "Autenticidade genuína", "Capacidade de viver o presente"],
      en: ["Refined aesthetic sensitivity", "Genuine authenticity", "Ability to live in the present"],
      'pt-pt': ["Sensibilidade estética apurada", "Autenticidade genuína", "Capacidade de viver o presente"]
    },
    challenges: {
      pt: ["Dificuldade em planejar longo prazo", "Pode evitar conflitos", "Sensibilidade a críticas"],
      en: ["Difficulty planning long term", "May avoid conflicts", "Sensitivity to criticism"],
      'pt-pt': ["Dificuldade em planear a longo prazo", "Pode evitar conflitos", "Sensibilidade a críticas"]
    },
    growthTips: {
      pt: ["Crie uma visão de 3 meses para sua vida", "Enfrente pequenos conflitos antes que cresçam", "Transforme críticas em combustível criativo"],
      en: ["Create a 3-month vision for your life", "Face small conflicts before they grow", "Transform criticism into creative fuel"],
      'pt-pt': ["Crie uma visão de 3 meses para a sua vida", "Enfrente pequenos conflitos antes que cresçam", "Transforme críticas em combustível criativo"]
    }
  },
  ESTP: {
    code: "ESTP",
    name: { pt: "O Ativador", en: "The Activator", 'pt-pt': "O Ativador" },
    quadrant: "pragmatic",
    description: {
      pt: "Aventureiro e dinâmico, você vive para a ação e o agora. Lidera com presença e coragem. Cresce ao integrar sensibilidade à sua força natural.",
      en: "Adventurous and dynamic, you live for action and the now. You lead with presence and courage. You grow by integrating sensitivity into your natural strength.",
      'pt-pt': "Aventureiro e dinâmico, vive para a ação e o agora. Lidera com presença e coragem. Evolui ao integrar sensibilidade à sua força natural."
    },
    strengths: {
      pt: ["Capacidade de ação imediata", "Presença magnética", "Habilidade em situações de crise"],
      en: ["Immediate action capability", "Magnetic presence", "Skill in crisis situations"],
      'pt-pt': ["Capacidade de ação imediata", "Presença magnética", "Habilidade em situações de crise"]
    },
    challenges: {
      pt: ["Dificuldade com planejamento", "Pode ser impulsivo", "Resistência a rotinas"],
      en: ["Difficulty with planning", "May be impulsive", "Resistance to routines"],
      'pt-pt': ["Dificuldade com planeamento", "Pode ser impulsivo", "Resistência a rotinas"]
    },
    growthTips: {
      pt: ["Pause 5 segundos antes de decisões importantes", "Equilibre adrenalina com momentos de reflexão", "Desenvolva uma rotina mínima que respeite sua natureza"],
      en: ["Pause 5 seconds before important decisions", "Balance adrenaline with moments of reflection", "Develop a minimal routine that respects your nature"],
      'pt-pt': ["Pause 5 segundos antes de decisões importantes", "Equilibre adrenalina com momentos de reflexão", "Desenvolva uma rotina mínima que respeite a sua natureza"]
    }
  },
  ESFP: {
    code: "ESFP",
    name: { pt: "O Performer", en: "The Performer", 'pt-pt': "O Performer" },
    quadrant: "humanist",
    description: {
      pt: "Espontâneo e vibrante, você traz cor e alegria aos ambientes. Ama viver intensamente. Sua força floresce quando equilibra prazer com propósito.",
      en: "Spontaneous and vibrant, you bring color and joy to environments. You love living intensely. Your strength flourishes when you balance pleasure with purpose.",
      'pt-pt': "Espontâneo e vibrante, traz cor e alegria aos ambientes. Adora viver intensamente. A sua força floresce quando equilibra prazer com propósito."
    },
    strengths: {
      pt: ["Energia contagiante", "Habilidade em entreter e conectar", "Capacidade de viver o momento"],
      en: ["Contagious energy", "Skill in entertaining and connecting", "Ability to live in the moment"],
      'pt-pt': ["Energia contagiante", "Habilidade em entreter e conectar", "Capacidade de viver o momento"]
    },
    challenges: {
      pt: ["Dificuldade com planejamento", "Pode evitar conversas difíceis", "Busca constante por estímulos"],
      en: ["Difficulty with planning", "May avoid difficult conversations", "Constant search for stimuli"],
      'pt-pt': ["Dificuldade com planeamento", "Pode evitar conversas difíceis", "Busca constante por estímulos"]
    },
    growthTips: {
      pt: ["Defina um propósito claro para sua energia", "Pratique conversas honestas com gentileza", "Cultive momentos de quietude interior"],
      en: ["Define a clear purpose for your energy", "Practice honest conversations with gentleness", "Cultivate moments of inner stillness"],
      'pt-pt': ["Defina um propósito claro para a sua energia", "Pratique conversas honestas com gentileza", "Cultive momentos de quietude interior"]
    }
  },
};

// Quadrant labels for visual map
export const QUADRANT_LABELS = {
  analytic: {
    pt: "Analíticos",
    en: "Analytics",
    'pt-pt': "Analíticos"
  },
  humanist: {
    pt: "Humanistas",
    en: "Humanists",
    'pt-pt': "Humanistas"
  },
  pragmatic: {
    pt: "Pragmáticos",
    en: "Pragmatics",
    'pt-pt': "Pragmáticos"
  },
  visionary: {
    pt: "Visionários",
    en: "Visionaries",
    'pt-pt': "Visionários"
  }
};

interface Nello16Option {
  dimension?: string; // e.g., 'E_I', 'S_N', 'T_F', 'J_P'
  direction?: string; // e.g., 'E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'
  text?: string;
  label?: string;
  value: string; // 'A', 'B' for PT/PT-PT or 'E', 'e', 'i', 'I' etc for EN
}

interface Nello16Answer {
  answer: { value: string };
  test_questions: {
    options: Nello16Option[];
  };
}

export function getNello16Results(answers: Nello16Answer[], language: 'pt' | 'en' | 'pt-pt' = 'pt'): {
  type: string;
  scores: Record<string, number>;
  profileData: Nello16Profile;
  quadrant: string;
} {
  // Initialize scores for each dimension
  const scores: Record<string, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // Calculate scores based on answers
  answers.forEach((answer) => {
    if (answer.test_questions && answer.test_questions.options && Array.isArray(answer.test_questions.options)) {
      const options = answer.test_questions.options;
      const answerValue = answer.answer?.value;
      
      // Find the selected option
      const selectedOption = options.find(opt => opt.value === answerValue);
      
      if (selectedOption) {
        // PT/PT-PT format: options have 'direction' field (e.g., 'E', 'I', 'S', 'N')
        if (selectedOption.direction) {
          const direction = selectedOption.direction.toUpperCase();
          if (scores[direction] !== undefined) {
            scores[direction]++;
          }
        }
        // EN format: value itself is the direction (e.g., 'E', 'e', 'i', 'I')
        // Uppercase = strong preference (+2), lowercase = mild preference (+1)
        else if (answerValue && /^[EISNTFJPeisnstfjp]$/.test(answerValue)) {
          const isStrong = answerValue === answerValue.toUpperCase();
          const direction = answerValue.toUpperCase();
          if (scores[direction] !== undefined) {
            scores[direction] += isStrong ? 2 : 1;
          }
        }
      }
    }
  });

  // Determine the type by comparing scores in each pair
  const type = [
    scores.E >= scores.I ? "E" : "I",
    scores.S >= scores.N ? "S" : "N",
    scores.T >= scores.F ? "T" : "F",
    scores.J >= scores.P ? "J" : "P",
  ].join("");

  const profileData = NELLO_16_PROFILES[type] || NELLO_16_PROFILES.INFP;
  const quadrant = QUADRANT_LABELS[profileData.quadrant][language];

  return {
    type,
    scores,
    profileData,
    quadrant,
  };
}
