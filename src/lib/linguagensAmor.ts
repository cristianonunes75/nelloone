export interface LinguagensAmorResult {
  primary: {
    language: string;
    score: number;
    name: string;
    symbol: string;
    essence: string;
  };
  secondary: {
    language: string;
    score: number;
    name: string;
    symbol: string;
    essence: string;
  };
  scores: {
    palavras_afirmacao: number;
    tempo_qualidade: number;
    presentes: number;
    atos_servico: number;
    toque_fisico: number;
  };
  interpretation: string;
}

const styleData = {
  palavras_afirmacao: {
    name: "Expressão Verbal",
    symbol: "🕊️ Voz da Criação",
    essence: "Você cria mundos com suas palavras. Quando fala com amor, tudo floresce.",
    description: "Seu estilo de conexão é expresso através de palavras. Elogios, palavras de encorajamento, reconhecimento verbal e mensagens de carinho são fundamentais para você se sentir amado(a) e para demonstrar afeto aos outros."
  },
  tempo_qualidade: {
    name: "Presença Ativa",
    symbol: "🌅 Presença Plena",
    essence: "O tempo é sua forma de amar. Você transforma simples momentos em eternidade.",
    description: "Para você, conexão é presença. Conversas profundas, atenção total e momentos compartilhados sem distrações são a forma mais verdadeira de conexão. O tempo dedicado é seu maior presente."
  },
  presentes: {
    name: "Gestos Simbólicos",
    symbol: "🎁 Rituais de Afeto",
    essence: "Para você, o amor é um gesto visível, uma lembrança do que é invisível.",
    description: "Os gestos simbólicos carregam significado profundo para você. Não é o valor material, mas o pensamento, a lembrança e o simbolismo que tocam seu coração."
  },
  atos_servico: {
    name: "Cuidado Prático",
    symbol: "💧 Amor em Ação",
    essence: "O amor, pra você, é verbo. Está em cuidar, servir e aliviar o peso do outro.",
    description: "Para você, conexão é ação. Quando alguém faz algo prático para ajudar, resolver problemas ou facilitar sua vida, você sente o amor verdadeiro. E é assim que você demonstra cuidado aos outros."
  },
  toque_fisico: {
    name: "Conexão Física",
    symbol: "🔥 Fogo Sagrado",
    essence: "Você se comunica pelo contato. O toque é oração, presença e entrega.",
    description: "O contato físico é seu estilo de conexão. Abraços, carinhos, proximidade física e gestos afetuosos são essenciais para você se sentir amado(a) e expressar afeto aos outros."
  }
};

export const calculateLinguagensAmor = (answers: any[]): LinguagensAmorResult => {
  const scores = {
    palavras_afirmacao: 0,
    tempo_qualidade: 0,
    presentes: 0,
    atos_servico: 0,
    toque_fisico: 0
  };

  // Count each language occurrence in the answers
  answers.forEach((answer) => {
    const value = answer.answer?.value || answer.answer;
    if (value && scores.hasOwnProperty(value)) {
      scores[value as keyof typeof scores]++;
    }
  });

  // Sort by score to find primary and secondary
  const sortedStyles = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([language, score]) => ({
      language,
      score,
      ...styleData[language as keyof typeof styleData]
    }));

  const primary = sortedStyles[0];
  const secondary = sortedStyles[1];

  const interpretation = `Seu estilo primário de conexão afetiva é ${primary.name}. ${primary.description}

Seu estilo secundário é ${secondary.name}, mostrando que você também valoriza esse estilo em seus relacionamentos.

Essa combinação revela uma pessoa que se conecta de forma ${primary.score > secondary.score + 5 ? 'profundamente focada' : 'equilibrada'}, sabendo expressar e receber afeto de maneiras diversas e complementares.`;

  return {
    primary,
    secondary,
    scores,
    interpretation
  };
};
