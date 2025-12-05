// Inteligências Múltiplas - Howard Gardner's Theory
// 8 intelligences with 5 questions each (40 total)

export interface IntelligenceProfile {
  key: string;
  name: {
    pt: string;
    en: string;
  };
  emoji: string;
  shortDescription: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
  traits: {
    pt: string[];
    en: string[];
  };
  careers: {
    pt: string[];
    en: string[];
  };
  learningStyle: {
    pt: string;
    en: string;
  };
  workStyle: {
    pt: string;
    en: string;
  };
  communicationStyle: {
    pt: string;
    en: string;
  };
  strengths: {
    pt: string[];
    en: string[];
  };
  challenges: {
    pt: string[];
    en: string[];
  };
  developmentTips: {
    pt: string[];
    en: string[];
  };
}

export const INTELLIGENCES: Record<string, IntelligenceProfile> = {
  linguistica: {
    key: "linguistica",
    name: { pt: "Linguística", en: "Linguistic" },
    emoji: "📝",
    shortDescription: {
      pt: "Facilidade com palavras, escrita e comunicação verbal",
      en: "Facility with words, writing, and verbal communication"
    },
    description: {
      pt: "Você possui uma mente verbal poderosa. Pensa através de palavras, expressa ideias com clareza e absorve conhecimento pela leitura e escuta. Sua comunicação é uma das suas maiores forças.",
      en: "You possess a powerful verbal mind. You think through words, express ideas clearly, and absorb knowledge through reading and listening. Communication is one of your greatest strengths."
    },
    traits: {
      pt: ["Articulado", "Persuasivo", "Expressivo", "Literário", "Comunicativo"],
      en: ["Articulate", "Persuasive", "Expressive", "Literary", "Communicative"]
    },
    careers: {
      pt: ["Escritor", "Jornalista", "Advogado", "Professor", "Palestrante", "Tradutor", "Editor", "Roteirista"],
      en: ["Writer", "Journalist", "Lawyer", "Teacher", "Speaker", "Translator", "Editor", "Screenwriter"]
    },
    learningStyle: {
      pt: "Aprende melhor lendo, escrevendo, ouvindo palestras e participando de debates. Anotações detalhadas e resumos são suas ferramentas.",
      en: "Learns best by reading, writing, listening to lectures, and participating in debates. Detailed notes and summaries are your tools."
    },
    workStyle: {
      pt: "Produz melhor em ambientes que valorizam comunicação clara, documentação e expressão de ideias. Prefere trabalhos que envolvam escrita, apresentação ou persuasão.",
      en: "Produces best in environments that value clear communication, documentation, and expression of ideas. Prefers work involving writing, presentation, or persuasion."
    },
    communicationStyle: {
      pt: "Comunica-se de forma clara e estruturada. Usa metáforas e histórias para ilustrar pontos. Tem facilidade em adaptar a linguagem ao público.",
      en: "Communicates clearly and in a structured way. Uses metaphors and stories to illustrate points. Easily adapts language to the audience."
    },
    strengths: {
      pt: ["Escrita clara e persuasiva", "Oratória natural", "Memorização através de palavras", "Argumentação lógica", "Sensibilidade poética"],
      en: ["Clear and persuasive writing", "Natural oratory", "Memorization through words", "Logical argumentation", "Poetic sensitivity"]
    },
    challenges: {
      pt: ["Pode se perder em palavras sem ação", "Tendência a intelectualizar emoções", "Dificuldade com tarefas práticas não-verbais"],
      en: ["May get lost in words without action", "Tendency to intellectualize emotions", "Difficulty with practical non-verbal tasks"]
    },
    developmentTips: {
      pt: ["Escreva diariamente um diário", "Leia gêneros variados", "Pratique oratória", "Aprenda um novo idioma", "Experimente poesia ou storytelling"],
      en: ["Keep a daily journal", "Read varied genres", "Practice public speaking", "Learn a new language", "Try poetry or storytelling"]
    }
  },
  logico_matematica: {
    key: "logico_matematica",
    name: { pt: "Lógico-Matemática", en: "Logical-Mathematical" },
    emoji: "🧮",
    shortDescription: {
      pt: "Pensamento analítico, padrões e resolução de problemas",
      en: "Analytical thinking, patterns, and problem-solving"
    },
    description: {
      pt: "Sua mente opera em padrões, sequências e relações causais. Você encontra clareza na lógica e satisfação em resolver problemas complexos. Análise e estratégia são seus pontos fortes.",
      en: "Your mind operates in patterns, sequences, and causal relationships. You find clarity in logic and satisfaction in solving complex problems. Analysis and strategy are your strengths."
    },
    traits: {
      pt: ["Analítico", "Estratégico", "Racional", "Sistemático", "Investigativo"],
      en: ["Analytical", "Strategic", "Rational", "Systematic", "Investigative"]
    },
    careers: {
      pt: ["Cientista", "Engenheiro", "Programador", "Contador", "Economista", "Analista de Dados", "Matemático", "Pesquisador"],
      en: ["Scientist", "Engineer", "Programmer", "Accountant", "Economist", "Data Analyst", "Mathematician", "Researcher"]
    },
    learningStyle: {
      pt: "Aprende através de experimentação, resolução de problemas e análise de dados. Precisa entender o 'porquê' antes de aceitar qualquer informação.",
      en: "Learns through experimentation, problem-solving, and data analysis. Needs to understand the 'why' before accepting any information."
    },
    workStyle: {
      pt: "Prospera em ambientes que valorizam lógica, eficiência e resolução de problemas. Prefere projetos com métricas claras e objetivos mensuráveis.",
      en: "Thrives in environments that value logic, efficiency, and problem-solving. Prefers projects with clear metrics and measurable goals."
    },
    communicationStyle: {
      pt: "Comunicação direta e objetiva. Prefere fatos a opiniões. Organiza informações de forma estruturada e sequencial.",
      en: "Direct and objective communication. Prefers facts to opinions. Organizes information in a structured and sequential way."
    },
    strengths: {
      pt: ["Resolução de problemas complexos", "Análise de dados", "Pensamento estratégico", "Detecção de padrões", "Tomada de decisão racional"],
      en: ["Complex problem-solving", "Data analysis", "Strategic thinking", "Pattern detection", "Rational decision-making"]
    },
    challenges: {
      pt: ["Pode parecer frio ou distante", "Dificuldade com ambiguidade", "Tendência a subestimar emoções", "Impaciência com processos lentos"],
      en: ["May seem cold or distant", "Difficulty with ambiguity", "Tendency to underestimate emotions", "Impatience with slow processes"]
    },
    developmentTips: {
      pt: ["Pratique jogos de estratégia", "Aprenda programação", "Estude estatística", "Desafie-se com quebra-cabeças", "Analise problemas do cotidiano"],
      en: ["Practice strategy games", "Learn programming", "Study statistics", "Challenge yourself with puzzles", "Analyze everyday problems"]
    }
  },
  espacial: {
    key: "espacial",
    name: { pt: "Espacial", en: "Spatial" },
    emoji: "🎨",
    shortDescription: {
      pt: "Visualização, design e percepção tridimensional",
      en: "Visualization, design, and three-dimensional perception"
    },
    description: {
      pt: "Você pensa em imagens e visualizações. Percebe o mundo através de formas, cores e relações espaciais. Sua mente cria mapas mentais e transforma conceitos abstratos em representações visuais.",
      en: "You think in images and visualizations. You perceive the world through shapes, colors, and spatial relationships. Your mind creates mental maps and transforms abstract concepts into visual representations."
    },
    traits: {
      pt: ["Visual", "Criativo", "Imaginativo", "Observador", "Artístico"],
      en: ["Visual", "Creative", "Imaginative", "Observant", "Artistic"]
    },
    careers: {
      pt: ["Designer", "Arquiteto", "Artista Visual", "Fotógrafo", "Diretor de Arte", "Piloto", "Cirurgião", "Engenheiro Civil"],
      en: ["Designer", "Architect", "Visual Artist", "Photographer", "Art Director", "Pilot", "Surgeon", "Civil Engineer"]
    },
    learningStyle: {
      pt: "Aprende através de imagens, diagramas, mapas e representações visuais. Precisa 'ver' a informação para processá-la completamente.",
      en: "Learns through images, diagrams, maps, and visual representations. Needs to 'see' information to fully process it."
    },
    workStyle: {
      pt: "Produz melhor em ambientes que permitem criação visual e manipulação espacial. Prefere trabalhos que envolvam design, planejamento ou criação estética.",
      en: "Produces best in environments that allow visual creation and spatial manipulation. Prefers work involving design, planning, or aesthetic creation."
    },
    communicationStyle: {
      pt: "Comunica-se através de imagens, desenhos e metáforas visuais. Usa gestos para explicar ideias e prefere apresentações visuais a textos longos.",
      en: "Communicates through images, drawings, and visual metaphors. Uses gestures to explain ideas and prefers visual presentations to long texts."
    },
    strengths: {
      pt: ["Visualização de conceitos", "Senso estético apurado", "Orientação espacial", "Criação de layouts", "Memória visual"],
      en: ["Concept visualization", "Refined aesthetic sense", "Spatial orientation", "Layout creation", "Visual memory"]
    },
    challenges: {
      pt: ["Pode se frustrar com descrições verbais", "Dificuldade em ambientes sem estímulo visual", "Tendência a julgar pela aparência"],
      en: ["May get frustrated with verbal descriptions", "Difficulty in environments without visual stimulation", "Tendency to judge by appearance"]
    },
    developmentTips: {
      pt: ["Pratique desenho ou pintura", "Use mapas mentais", "Fotografe seu dia a dia", "Estude design", "Explore softwares de criação visual"],
      en: ["Practice drawing or painting", "Use mind maps", "Photograph your daily life", "Study design", "Explore visual creation software"]
    }
  },
  musical: {
    key: "musical",
    name: { pt: "Musical", en: "Musical" },
    emoji: "🎵",
    shortDescription: {
      pt: "Sensibilidade a ritmos, melodias e sons",
      en: "Sensitivity to rhythms, melodies, and sounds"
    },
    description: {
      pt: "Sua mente opera em ritmos, melodias e harmonias. Você percebe nuances sonoras que outros não captam e encontra significado profundo na música. O som é sua linguagem natural.",
      en: "Your mind operates in rhythms, melodies, and harmonies. You perceive sonic nuances that others miss and find deep meaning in music. Sound is your natural language."
    },
    traits: {
      pt: ["Rítmico", "Harmônico", "Sensível", "Expressivo", "Intuitivo"],
      en: ["Rhythmic", "Harmonic", "Sensitive", "Expressive", "Intuitive"]
    },
    careers: {
      pt: ["Músico", "Produtor Musical", "Terapeuta Musical", "DJ", "Compositor", "Cantor", "Engenheiro de Som", "Professor de Música"],
      en: ["Musician", "Music Producer", "Music Therapist", "DJ", "Composer", "Singer", "Sound Engineer", "Music Teacher"]
    },
    learningStyle: {
      pt: "Aprende através de músicas, ritmos e padrões sonoros. Memoriza melhor quando associa informações a melodias ou cria rimas.",
      en: "Learns through music, rhythms, and sound patterns. Memorizes better when associating information with melodies or creating rhymes."
    },
    workStyle: {
      pt: "Produz melhor em ambientes com música ou em silêncio controlado. Sensível a ruídos e distrações sonoras. Prefere trabalhos com componente rítmico ou sonoro.",
      en: "Produces best in environments with music or controlled silence. Sensitive to noise and sound distractions. Prefers work with rhythmic or sonic components."
    },
    communicationStyle: {
      pt: "Comunica-se com variação tonal e ritmo na fala. Percebe emoções através da voz dos outros. Usa música como ferramenta de conexão.",
      en: "Communicates with tonal variation and rhythm in speech. Perceives emotions through others' voices. Uses music as a connection tool."
    },
    strengths: {
      pt: ["Ouvido apurado", "Sensibilidade emocional através do som", "Ritmo natural", "Expressão através da música", "Memorização auditiva"],
      en: ["Refined ear", "Emotional sensitivity through sound", "Natural rhythm", "Expression through music", "Auditory memorization"]
    },
    challenges: {
      pt: ["Distração por sons ambientes", "Dificuldade em ambientes barulhentos", "Pode se isolar através da música"],
      en: ["Distraction by ambient sounds", "Difficulty in noisy environments", "May isolate through music"]
    },
    developmentTips: {
      pt: ["Aprenda um instrumento", "Pratique canto", "Estude teoria musical", "Crie playlists intencionais", "Experimente produção musical"],
      en: ["Learn an instrument", "Practice singing", "Study music theory", "Create intentional playlists", "Try music production"]
    }
  },
  corporal_cinestesica: {
    key: "corporal_cinestesica",
    name: { pt: "Corporal-Cinestésica", en: "Bodily-Kinesthetic" },
    emoji: "🤸",
    shortDescription: {
      pt: "Controle corporal, coordenação e expressão física",
      en: "Body control, coordination, and physical expression"
    },
    description: {
      pt: "Você pensa com o corpo. Suas mãos, gestos e movimentos são extensões do seu pensamento. Aprende fazendo, cria através do toque e se expressa através do movimento.",
      en: "You think with your body. Your hands, gestures, and movements are extensions of your thought. You learn by doing, create through touch, and express yourself through movement."
    },
    traits: {
      pt: ["Físico", "Coordenado", "Prático", "Expressivo", "Energético"],
      en: ["Physical", "Coordinated", "Practical", "Expressive", "Energetic"]
    },
    careers: {
      pt: ["Atleta", "Dançarino", "Cirurgião", "Artesão", "Fisioterapeuta", "Chef", "Ator", "Personal Trainer"],
      en: ["Athlete", "Dancer", "Surgeon", "Craftsman", "Physiotherapist", "Chef", "Actor", "Personal Trainer"]
    },
    learningStyle: {
      pt: "Aprende fazendo, tocando e experimentando. Precisa de movimento para processar informação. Memoriza melhor quando associa conhecimento a ações físicas.",
      en: "Learns by doing, touching, and experimenting. Needs movement to process information. Memorizes better when associating knowledge with physical actions."
    },
    workStyle: {
      pt: "Produz melhor quando pode se movimentar e usar as mãos. Dificuldade em ficar sentado por longos períodos. Prefere trabalhos com componente físico.",
      en: "Produces best when able to move and use hands. Difficulty sitting for long periods. Prefers work with physical components."
    },
    communicationStyle: {
      pt: "Comunica-se com gestos e expressões corporais. Toque é uma forma de conexão. Demonstra em vez de explicar verbalmente.",
      en: "Communicates with gestures and body expressions. Touch is a form of connection. Demonstrates rather than explains verbally."
    },
    strengths: {
      pt: ["Coordenação motora", "Consciência corporal", "Aprendizado prático", "Expressão física", "Resistência e energia"],
      en: ["Motor coordination", "Body awareness", "Practical learning", "Physical expression", "Stamina and energy"]
    },
    challenges: {
      pt: ["Inquietude em ambientes estáticos", "Dificuldade com teoria abstrata", "Pode ser visto como impaciente"],
      en: ["Restlessness in static environments", "Difficulty with abstract theory", "May be seen as impatient"]
    },
    developmentTips: {
      pt: ["Pratique esporte ou dança", "Aprenda artesanato", "Faça pausas para movimento", "Experimente yoga", "Use gestos ao estudar"],
      en: ["Practice sports or dance", "Learn crafts", "Take movement breaks", "Try yoga", "Use gestures when studying"]
    }
  },
  interpessoal: {
    key: "interpessoal",
    name: { pt: "Interpessoal", en: "Interpersonal" },
    emoji: "🤝",
    shortDescription: {
      pt: "Compreensão dos outros, empatia e liderança social",
      en: "Understanding others, empathy, and social leadership"
    },
    description: {
      pt: "Você entende pessoas. Percebe emoções, motivações e dinâmicas sociais que outros não captam. Conectar-se é natural para você, e sua presença influencia positivamente grupos.",
      en: "You understand people. You perceive emotions, motivations, and social dynamics that others miss. Connecting comes naturally to you, and your presence positively influences groups."
    },
    traits: {
      pt: ["Empático", "Sociável", "Influente", "Mediador", "Comunicativo"],
      en: ["Empathetic", "Sociable", "Influential", "Mediator", "Communicative"]
    },
    careers: {
      pt: ["Psicólogo", "Líder", "Vendedor", "Professor", "Coach", "RH", "Político", "Terapeuta"],
      en: ["Psychologist", "Leader", "Salesperson", "Teacher", "Coach", "HR", "Politician", "Therapist"]
    },
    learningStyle: {
      pt: "Aprende melhor em grupo, através de discussões e colaboração. Precisa de interação social para processar ideias completamente.",
      en: "Learns best in groups, through discussions and collaboration. Needs social interaction to fully process ideas."
    },
    workStyle: {
      pt: "Prospera em ambientes colaborativos e de equipe. Prefere trabalhos que envolvam pessoas, negociação ou liderança.",
      en: "Thrives in collaborative team environments. Prefers work involving people, negotiation, or leadership."
    },
    communicationStyle: {
      pt: "Comunicação adaptativa e empática. Percebe o estado emocional dos outros e ajusta a abordagem. Constrói rapport naturalmente.",
      en: "Adaptive and empathetic communication. Perceives others' emotional states and adjusts approach. Builds rapport naturally."
    },
    strengths: {
      pt: ["Leitura de pessoas", "Construção de relacionamentos", "Liderança", "Resolução de conflitos", "Influência positiva"],
      en: ["Reading people", "Building relationships", "Leadership", "Conflict resolution", "Positive influence"]
    },
    challenges: {
      pt: ["Dificuldade de dizer não", "Pode absorver emoções dos outros", "Tendência a agradar demais"],
      en: ["Difficulty saying no", "May absorb others' emotions", "Tendency to please too much"]
    },
    developmentTips: {
      pt: ["Pratique escuta ativa", "Estude linguagem corporal", "Participe de grupos diversos", "Desenvolva liderança", "Aprenda mediação"],
      en: ["Practice active listening", "Study body language", "Join diverse groups", "Develop leadership", "Learn mediation"]
    }
  },
  intrapessoal: {
    key: "intrapessoal",
    name: { pt: "Intrapessoal", en: "Intrapersonal" },
    emoji: "🧘",
    shortDescription: {
      pt: "Autoconhecimento, reflexão e inteligência emocional",
      en: "Self-knowledge, reflection, and emotional intelligence"
    },
    description: {
      pt: "Você se conhece profundamente. Entende suas emoções, motivações e limites com clareza rara. Sua bússola interna é precisa, e sua autorreflexão guia decisões sábias.",
      en: "You know yourself deeply. You understand your emotions, motivations, and limits with rare clarity. Your inner compass is precise, and your self-reflection guides wise decisions."
    },
    traits: {
      pt: ["Introspectivo", "Autoconsciente", "Reflexivo", "Independente", "Filosófico"],
      en: ["Introspective", "Self-aware", "Reflective", "Independent", "Philosophical"]
    },
    careers: {
      pt: ["Filósofo", "Escritor", "Psicanalista", "Monge/Religioso", "Pesquisador", "Consultor", "Coach", "Artista"],
      en: ["Philosopher", "Writer", "Psychoanalyst", "Monk/Religious", "Researcher", "Consultant", "Coach", "Artist"]
    },
    learningStyle: {
      pt: "Aprende através da reflexão solitária e autoanálise. Precisa de tempo para processar informações internamente antes de agir.",
      en: "Learns through solitary reflection and self-analysis. Needs time to process information internally before acting."
    },
    workStyle: {
      pt: "Produz melhor em ambientes calmos com tempo para reflexão. Prefere trabalho independente ou com alta autonomia.",
      en: "Produces best in calm environments with time for reflection. Prefers independent work or high autonomy."
    },
    communicationStyle: {
      pt: "Comunicação profunda e significativa. Prefere conversas um-a-um. Compartilha insights quando sente confiança.",
      en: "Deep and meaningful communication. Prefers one-on-one conversations. Shares insights when feeling trust."
    },
    strengths: {
      pt: ["Autoconhecimento profundo", "Regulação emocional", "Tomada de decisão consciente", "Independência", "Sabedoria interior"],
      en: ["Deep self-knowledge", "Emotional regulation", "Conscious decision-making", "Independence", "Inner wisdom"]
    },
    challenges: {
      pt: ["Pode parecer distante", "Tendência ao isolamento", "Dificuldade em ambientes muito sociais"],
      en: ["May seem distant", "Tendency to isolation", "Difficulty in very social environments"]
    },
    developmentTips: {
      pt: ["Pratique meditação", "Mantenha um diário", "Faça terapia", "Reserve tempo para silêncio", "Estude filosofia"],
      en: ["Practice meditation", "Keep a journal", "Do therapy", "Reserve time for silence", "Study philosophy"]
    }
  },
  naturalista: {
    key: "naturalista",
    name: { pt: "Naturalista", en: "Naturalistic" },
    emoji: "🌿",
    shortDescription: {
      pt: "Conexão com a natureza, padrões naturais e sistemas vivos",
      en: "Connection with nature, natural patterns, and living systems"
    },
    description: {
      pt: "Você percebe a natureza com olhos especiais. Reconhece padrões em sistemas vivos, se conecta profundamente com o ambiente natural e encontra paz e clareza no mundo natural.",
      en: "You perceive nature with special eyes. You recognize patterns in living systems, connect deeply with the natural environment, and find peace and clarity in the natural world."
    },
    traits: {
      pt: ["Observador", "Ecológico", "Sensível", "Conectado", "Classificador"],
      en: ["Observant", "Ecological", "Sensitive", "Connected", "Classifier"]
    },
    careers: {
      pt: ["Biólogo", "Veterinário", "Agricultor", "Ambientalista", "Botânico", "Chef", "Paisagista", "Guia de Ecoturismo"],
      en: ["Biologist", "Veterinarian", "Farmer", "Environmentalist", "Botanist", "Chef", "Landscaper", "Ecotourism Guide"]
    },
    learningStyle: {
      pt: "Aprende através da observação da natureza, classificação e identificação de padrões em sistemas vivos. Prefere estudar ao ar livre.",
      en: "Learns through nature observation, classification, and pattern identification in living systems. Prefers outdoor study."
    },
    workStyle: {
      pt: "Produz melhor em contato com a natureza ou trabalhando com seres vivos. Sensível a ambientes artificiais ou muito fechados.",
      en: "Produces best in contact with nature or working with living beings. Sensitive to artificial or very enclosed environments."
    },
    communicationStyle: {
      pt: "Comunica-se usando metáforas da natureza. Observa padrões comportamentais como observaria animais. Paciente e atento aos detalhes.",
      en: "Communicates using nature metaphors. Observes behavioral patterns as would observe animals. Patient and attentive to details."
    },
    strengths: {
      pt: ["Observação de padrões naturais", "Conexão com seres vivos", "Classificação e organização", "Consciência ambiental", "Paciência"],
      en: ["Natural pattern observation", "Connection with living beings", "Classification and organization", "Environmental awareness", "Patience"]
    },
    challenges: {
      pt: ["Dificuldade em ambientes urbanos fechados", "Pode parecer desconectado de questões sociais", "Frustração com destruição ambiental"],
      en: ["Difficulty in closed urban environments", "May seem disconnected from social issues", "Frustration with environmental destruction"]
    },
    developmentTips: {
      pt: ["Cultive um jardim", "Pratique observação de aves", "Caminhe na natureza", "Estude botânica ou zoologia", "Participe de projetos ambientais"],
      en: ["Cultivate a garden", "Practice bird watching", "Walk in nature", "Study botany or zoology", "Join environmental projects"]
    }
  }
};

// Question-to-intelligence mapping (5 questions each)
const QUESTION_INTELLIGENCE_MAP: Record<number, string> = {};
const intelligenceOrder = [
  "linguistica",
  "logico_matematica", 
  "espacial",
  "musical",
  "corporal_cinestesica",
  "interpessoal",
  "intrapessoal",
  "naturalista"
];

intelligenceOrder.forEach((intelligence, index) => {
  for (let i = 1; i <= 5; i++) {
    QUESTION_INTELLIGENCE_MAP[index * 5 + i] = intelligence;
  }
});

export interface InteligenciasAnswer {
  question_id: string;
  answer: any;
  test_questions: {
    question_number: number;
    options: any;
  };
}

export interface InteligenciasResult {
  scores: Record<string, number>;
  percentages: Record<string, number>;
  ranking: Array<{ key: string; score: number; percentage: number }>;
  top1: string;
  top2: string;
  top3: string;
  lowest: string;
}

export const getInteligenciasResults = (answers: InteligenciasAnswer[]): InteligenciasResult => {
  const scores: Record<string, number> = {};
  
  // Initialize scores
  intelligenceOrder.forEach(intelligence => {
    scores[intelligence] = 0;
  });

  // Calculate scores based on question number
  answers.forEach((answer) => {
    const questionNumber = answer.test_questions.question_number;
    const intelligence = QUESTION_INTELLIGENCE_MAP[questionNumber];
    
    if (intelligence) {
      // Handle different answer formats
      let value = 0;
      if (typeof answer.answer === 'number') {
        value = answer.answer;
      } else if (typeof answer.answer === 'object' && answer.answer?.value !== undefined) {
        value = answer.answer.value;
      } else if (typeof answer.answer === 'string') {
        value = parseInt(answer.answer, 10) || 0;
      }
      
      scores[intelligence] += value;
    }
  });

  // Max score per intelligence (5 questions × 5 max points = 25)
  const maxScorePerIntelligence = 25;
  
  // Calculate percentages
  const percentages: Record<string, number> = {};
  Object.keys(scores).forEach(key => {
    percentages[key] = Math.round((scores[key] / maxScorePerIntelligence) * 100);
  });

  // Create ranking
  const ranking = Object.keys(scores)
    .map(key => ({
      key,
      score: scores[key],
      percentage: percentages[key]
    }))
    .sort((a, b) => b.score - a.score);

  return {
    scores,
    percentages,
    ranking,
    top1: ranking[0]?.key || "",
    top2: ranking[1]?.key || "",
    top3: ranking[2]?.key || "",
    lowest: ranking[ranking.length - 1]?.key || ""
  };
};

export const getIntelligenceProfile = (key: string): IntelligenceProfile | undefined => {
  return INTELLIGENCES[key];
};
