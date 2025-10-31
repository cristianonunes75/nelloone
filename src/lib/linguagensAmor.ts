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

const languageData = {
  palavras_afirmacao: {
    name: "Palavras de Afirmação",
    symbol: "🕊️ Voz da Criação",
    essence: "Você cria mundos com suas palavras. Quando fala com amor, tudo floresce.",
    description: "Sua linguagem do amor é expressa através de palavras. Elogios, palavras de encorajamento, reconhecimento verbal e mensagens de carinho são fundamentais para você se sentir amado(a) e para demonstrar amor aos outros."
  },
  tempo_qualidade: {
    name: "Tempo de Qualidade",
    symbol: "🌅 Presença Plena",
    essence: "O tempo é sua forma de amar. Você transforma simples momentos em eternidade.",
    description: "Para você, amor é presença. Conversas profundas, atenção total e momentos compartilhados sem distrações são a forma mais verdadeira de conexão. O tempo dedicado é seu maior presente."
  },
  presentes: {
    name: "Presentes e Gestos Simbólicos",
    symbol: "🎁 Rituais de Amor",
    essence: "Para você, o amor é um gesto visível, uma lembrança do que é invisível.",
    description: "Os presentes e gestos simbólicos carregam significado profundo para você. Não é o valor material, mas o pensamento, a lembrança e o simbolismo que tocam seu coração."
  },
  atos_servico: {
    name: "Atos de Serviço",
    symbol: "💧 Amor em Ação",
    essence: "O amor, pra você, é verbo. Está em cuidar, servir e aliviar o peso do outro.",
    description: "Para você, amor é ação. Quando alguém faz algo prático para ajudar, resolver problemas ou facilitar sua vida, você sente o amor verdadeiro. E é assim que você demonstra cuidado aos outros."
  },
  toque_fisico: {
    name: "Toque Físico",
    symbol: "🔥 Fogo Sagrado",
    essence: "Você se comunica pelo contato. O toque é oração, presença e entrega.",
    description: "O toque físico é sua linguagem de conexão. Abraços, carinhos, proximidade física e gestos afetuosos são essenciais para você se sentir amado(a) e expressar amor aos outros."
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
  const sortedLanguages = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([language, score]) => ({
      language,
      score,
      ...languageData[language as keyof typeof languageData]
    }));

  const primary = sortedLanguages[0];
  const secondary = sortedLanguages[1];

  const interpretation = `Sua linguagem principal de amor é ${primary.name}. ${primary.description}

Sua linguagem secundária é ${secondary.name}, mostrando que você também valoriza ${secondary.name.toLowerCase()} em seus relacionamentos.

Essa combinação revela uma pessoa que ama de forma ${primary.score > secondary.score + 5 ? 'profundamente focada' : 'equilibrada'}, sabendo expressar e receber afeto através de ${primary.name.toLowerCase()}${primary.score <= secondary.score + 3 ? ` e ${secondary.name.toLowerCase()}` : ''}.`;

  return {
    primary,
    secondary,
    scores,
    interpretation
  };
};
