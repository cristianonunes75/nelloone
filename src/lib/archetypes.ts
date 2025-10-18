// Dados dos Arquétipos com Propósito

export interface ArchetypeData {
  name: string;
  description: string;
  characteristics: string[];
  visualStyle: string;
  colorPalette: string[];
  photographyDirection: string;
  emoji: string;
}

export const ARCHETYPES: Record<string, ArchetypeData> = {
  Governante: {
    name: "O Governante",
    description: "Você é um líder nato com forte senso de responsabilidade e controle. Sua essência busca ordem, estabilidade e prosperidade através de decisões estratégicas.",
    characteristics: [
      "Organizado e metódico",
      "Assume responsabilidade naturalmente",
      "Valoriza estabilidade e controle",
      "Toma decisões baseadas em lógica"
    ],
    visualStyle: "Sofisticado e estruturado, com linhas limpas e composição equilibrada",
    colorPalette: ["#1a1a1a", "#ffffff", "#c9a961", "#2c3e50"],
    photographyDirection: "Ambiente corporativo elegante, postura confiante, iluminação dramática que transmite autoridade",
    emoji: "👑"
  },
  Amante: {
    name: "O Amante",
    description: "Você vive com intensidade e paixão, valorizando profundamente as conexões emocionais e experiências sensoriais da vida.",
    characteristics: [
      "Intenso e apaixonado",
      "Valoriza conexões profundas",
      "Busca beleza e prazer",
      "Guiado pelas emoções"
    ],
    visualStyle: "Sensual e íntimo, com foco em texturas e emoções",
    colorPalette: ["#8B0000", "#FFC0CB", "#800020", "#FFD700"],
    photographyDirection: "Ambientes aconchegantes, luz natural suave, close-ups emocionais, toques românticos",
    emoji: "❤️"
  },
  Criador: {
    name: "O Criador",
    description: "Você é movido pela necessidade de expressar sua visão única e deixar sua marca criativa no mundo.",
    characteristics: [
      "Original e inovador",
      "Expressa criatividade livremente",
      "Busca autenticidade",
      "Valoriza a individualidade"
    ],
    visualStyle: "Artístico e experimental, quebrando convenções",
    colorPalette: ["#9B59B6", "#FF6B6B", "#4ECDC4", "#F39C12"],
    photographyDirection: "Ambientes criativos não convencionais, ângulos únicos, uso criativo de cores e luz",
    emoji: "🎨"
  },
  Inocente: {
    name: "O Inocente",
    description: "Você mantém uma visão otimista da vida, buscando simplicidade, alegria e confiança no bem.",
    characteristics: [
      "Otimista e confiante",
      "Aprecia a simplicidade",
      "Mantém fé no bem",
      "Busca felicidade genuína"
    ],
    visualStyle: "Luminoso e leve, com atmosfera alegre e despreocupada",
    colorPalette: ["#87CEEB", "#FFE4E1", "#FFFACD", "#E0FFFF"],
    photographyDirection: "Ambientes naturais, luz do dia clara, expressões autênticas de alegria, cenários simples",
    emoji: "🌟"
  },
  Sábio: {
    name: "O Sábio",
    description: "Você busca constantemente conhecimento e compreensão profunda do mundo, valorizando verdade e sabedoria.",
    characteristics: [
      "Reflexivo e analítico",
      "Busca conhecimento",
      "Valoriza a verdade",
      "Mentor natural"
    ],
    visualStyle: "Contemplativo e intelectual, com atmosfera de introspecção",
    colorPalette: ["#2C3E50", "#95A5A6", "#34495E", "#7F8C8D"],
    photographyDirection: "Bibliotecas, espaços de estudo, luz suave que convida à reflexão, expressões pensativas",
    emoji: "📚"
  },
  Explorador: {
    name: "O Explorador",
    description: "Você é movido pela necessidade de descobrir, experienciar e se aventurar além dos limites conhecidos.",
    characteristics: [
      "Aventureiro e curioso",
      "Busca liberdade",
      "Valoriza experiências novas",
      "Independente"
    ],
    visualStyle: "Dinâmico e expansivo, capturando movimento e descoberta",
    colorPalette: ["#2ECC71", "#3498DB", "#F39C12", "#E67E22"],
    photographyDirection: "Ambientes externos, paisagens abertas, captura de movimento, expressões de admiração",
    emoji: "🧭"
  },
  Rebelde: {
    name: "O Rebelde",
    description: "Você desafia convenções e busca transformação, questionando o status quo e criando seu próprio caminho.",
    characteristics: [
      "Desafiador e autêntico",
      "Questiona regras",
      "Busca mudança",
      "Valoriza liberdade"
    ],
    visualStyle: "Ousado e não convencional, quebrando expectativas visuais",
    colorPalette: ["#000000", "#E74C3C", "#8E44AD", "#C0392B"],
    photographyDirection: "Ambientes urbanos alternativos, contraste dramático, poses ousadas, estética underground",
    emoji: "⚡"
  },
  Mago: {
    name: "O Mago",
    description: "Você tem o dom de transformar sonhos em realidade, vendo possibilidades onde outros veem limitações.",
    characteristics: [
      "Visionário e transformador",
      "Acredita em possibilidades",
      "Catalisador de mudanças",
      "Intuitivo"
    ],
    visualStyle: "Místico e transformador, com elementos de fantasia e magia",
    colorPalette: ["#9B59B6", "#1ABC9C", "#F1C40F", "#2C3E50"],
    photographyDirection: "Efeitos de luz criativos, composições surreais, atmosfera mística, transformações visuais",
    emoji: "✨"
  },
  Herói: {
    name: "O Herói",
    description: "Você enfrenta desafios com coragem, determinado a superar obstáculos e alcançar grandes feitos.",
    characteristics: [
      "Corajoso e determinado",
      "Supera obstáculos",
      "Busca excelência",
      "Protege os outros"
    ],
    visualStyle: "Épico e poderoso, transmitindo força e determinação",
    colorPalette: ["#C0392B", "#2C3E50", "#F39C12", "#ECF0F1"],
    photographyDirection: "Poses de ação, iluminação dramática, ambientes que sugerem conquista, expressões de determinação",
    emoji: "🦸"
  },
  Prestativo: {
    name: "O Prestativo",
    description: "Você encontra propósito em ajudar os outros, oferecendo suporte e cuidado com generosidade.",
    characteristics: [
      "Generoso e empático",
      "Coloca outros em primeiro lugar",
      "Busca ser útil",
      "Conecta e apoia"
    ],
    visualStyle: "Caloroso e acolhedor, focando em conexão humana",
    colorPalette: ["#E8B4B8", "#95E1D3", "#F38181", "#AA96DA"],
    photographyDirection: "Ambientes acolhedores, interações humanas, luz suave e calorosa, expressões de cuidado",
    emoji: "🤗"
  },
  "Bobo da Corte": {
    name: "O Bobo da Corte",
    description: "Você traz leveza e alegria para a vida, valorizando o humor e a capacidade de não se levar tão a sério.",
    characteristics: [
      "Divertido e espontâneo",
      "Valoriza o momento presente",
      "Traz alegria aos outros",
      "Leve e descontraído"
    ],
    visualStyle: "Alegre e dinâmico, capturando espontaneidade e diversão",
    colorPalette: ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6BCB77"],
    photographyDirection: "Momentos espontâneos, expressões genuínas de alegria, ambientes descontraídos, cores vibrantes",
    emoji: "🎭"
  },
  "Homem Comum": {
    name: "O Homem Comum",
    description: "Você valoriza autenticidade e pertencimento, buscando conexão genuína com os outros através da simplicidade.",
    characteristics: [
      "Autêntico e acessível",
      "Valoriza igualdade",
      "Busca pertencimento",
      "Pés no chão"
    ],
    visualStyle: "Natural e genuíno, sem artifícios ou pretensões",
    colorPalette: ["#A8DADC", "#457B9D", "#F1FAEE", "#E63946"],
    photographyDirection: "Ambientes cotidianos, luz natural, poses relaxadas, expressões autênticas e acessíveis",
    emoji: "👤"
  }
};

export interface ArchetypeScore {
  archetype: string;
  score: number;
}

// Mapeamento de respostas para arquétipos baseado no JSON fornecido
const ANSWER_TO_ARCHETYPE: Record<string, string[]> = {
  "Governante": ["1A","2B","3E","4C","5E","6E","7D","8B","9E","10A","11D","12E","14E","15D","16E","17E","18E","20B","21C","22A","23D","24B","25B","26A","27D","28C","29E","30B","31E","32D","33C","34D","35C","36D"],
  "Herói": ["1A","2B","3E","4D","6E","7D","8B","9E","10A","11D","12B","14E","15D","16E","17E","18E","19B","21C","22E","23D","24C","25B","26A","27B","28C","29E","31E","32D","33C","34D","35C","36D"],
  "Criador": ["1B","2C","3B","4B","5B","6D","7E","8C","9B","10C","11B","12B","13E","14C","15C","16C","17C","18C","19B","21A","22B","23E","24A","25A","26E","27A","28A","29D","30D","31B","34D","35D","36D"],
  "Mago": ["1B","2C","3B","4B","5B","6D","8D","9B","10E","12A","13D","14A","15C","16C","17C","18C","19B","21A","22B","23E","24A","25A","26E","27B","28A","29A","30A","31B","32B","33A","34A","35D","36A"],
  "Inocente": ["1C","2A","3C","4E","5A","6C","7E","8D","9D","10E","11E","12A","13D","14A","15D","16D","17A","18D","20A","21E","23B","24D","26D","27C","29A","30A","31C","32B","33A","34A","35C","36A"],
  "Realista": ["1C","2A","3A","4C","5C","6B","7C","8E","9E","10D","11C","12E","14B","15B","16D","17B","18E","20B","21D","22E","23A","24B","25C","26D","27D","28D","29B","30E","31D","32C","33B","34B","35B","36B"],
  "Cuidador": ["1D","2D","3E","4A","5D","6A","7B","8A","9C","10B","11B","12C","13A","14D","15A","16A","17A","18A","19A","20C","21B","22A","23E","24C","25D","26C","27E","28B","29C","30C","31A","32A","33D","35A","36C"],
  "Amante": ["1D","2D","3D","4A","5D","6A","7B","8A","9C","10B","11B","12C","13A","14D","15A","16A","17A","18A","19A","20C","21B","22A","23E","24C","25D","26C","27E","28B","29C","30C","31A","32A","33D","35A","36C"],
  "Explorador": ["1E","2E","3B","4D","5B","7A","8E","9A","10C","11A","12D","13B","14E","15E","16B","17D","18B","19E","20D","21A","22D","23C","24E","25E","26B","27C","28E","29D","30E","31C","32E","33E","34E","35E","36E"],
  "Rebelde": ["1E","2E","3B","4D","5B","7A","8C","9A","10C","11A","12D","13B","14E","15E","16B","17D","18B","19E","20D","21A","22D","23C","24E","25E","26B","27C","28E","29D","30E","31C","32E","33E","34E","35E","36E"],
  "Sábio": ["2C","3A","4E","5A","6B","7C","8E","9D","10D","11C","12E","13E","14B","15B","16D","17B","18D","19D","20E","21D","22C","23A","24D","25C","26D","27E","28D","29B","30B","31D","32C","33B","34B","35B","36B"],
  "Comediante": ["2A","5C","6C","9C","10C","11E","19C"]
};

export function calculateArchetypeScores(answers: any[]): ArchetypeScore[] {
  const scores: Record<string, number> = {};

  // Initialize all archetypes with 0
  Object.keys(ANSWER_TO_ARCHETYPE).forEach(archetype => {
    scores[archetype] = 0;
  });

  // Count occurrences for each archetype based on answers
  answers.forEach((answer) => {
    const answerValue = answer.answer?.value || answer.answer;
    if (answerValue) {
      // Check which archetypes this answer contributes to
      Object.entries(ANSWER_TO_ARCHETYPE).forEach(([archetype, answerKeys]) => {
        if (answerKeys.includes(answerValue)) {
          scores[archetype] = (scores[archetype] || 0) + 1;
        }
      });
    }
  });

  // Convert to array and sort by score
  const sortedScores = Object.entries(scores)
    .map(([archetype, score]) => ({ archetype, score }))
    .sort((a, b) => b.score - a.score);

  return sortedScores;
}

export function getDominantArchetypes(scores: ArchetypeScore[]): {
  primary: ArchetypeScore;
  secondary?: ArchetypeScore;
  tertiary?: ArchetypeScore;
} {
  const [primary, secondary, tertiary] = scores;
  
  return {
    primary,
    secondary: secondary && secondary.score > 0 ? secondary : undefined,
    tertiary: tertiary && tertiary.score > 0 ? tertiary : undefined
  };
}