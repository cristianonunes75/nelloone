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

export function calculateArchetypeScores(answers: any[]): ArchetypeScore[] {
  const scores: Record<string, number> = {};

  // Sum points for each archetype based on responses (1-3 scale)
  answers.forEach((answer) => {
    const selectedOption = answer.answer;
    if (selectedOption && selectedOption.archetype) {
      const archetype = selectedOption.archetype;
      const points = parseInt(selectedOption.value || "0", 10);
      scores[archetype] = (scores[archetype] || 0) + points;
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