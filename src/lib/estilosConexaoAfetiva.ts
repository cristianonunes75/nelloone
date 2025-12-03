// Estilos de Conexão Afetiva - Calculation Logic
// Replaces the old "Linguagens do Amor" test with a new framework

export interface EstilosConexaoAfetiva {
  primary: {
    style: string;
    score: number;
    name: {
      pt: string;
      en: string;
      'pt-pt': string;
    };
    symbol: string;
    essence: {
      pt: string;
      en: string;
      'pt-pt': string;
    };
  };
  secondary: {
    style: string;
    score: number;
    name: {
      pt: string;
      en: string;
      'pt-pt': string;
    };
    symbol: string;
    essence: {
      pt: string;
      en: string;
      'pt-pt': string;
    };
  };
  scores: {
    presenca_ativa: number;
    expressao_verbal: number;
    cuidado_pratico: number;
    gestos_simbolicos: number;
    conexao_fisica: number;
  };
  interpretation: {
    pt: string;
    en: string;
    'pt-pt': string;
  };
}

const styleData = {
  presenca_ativa: {
    name: {
      pt: "Presença Ativa",
      en: "Active Presence",
      'pt-pt': "Presença Ativa"
    },
    symbol: "🌅",
    essence: {
      pt: "Você se conecta através da presença plena. Momentos de atenção total são sua forma de amar e se sentir amado.",
      en: "You connect through full presence. Moments of undivided attention are your way of loving and feeling loved.",
      'pt-pt': "Tu conectas-te através da presença plena. Momentos de atenção total são a tua forma de amar e sentir-te amado."
    },
    description: {
      pt: "Para você, amor é presença. Conversas profundas, atenção exclusiva e momentos compartilhados sem distrações são a forma mais verdadeira de conexão.",
      en: "For you, love is presence. Deep conversations, undivided attention and shared moments without distractions are the truest form of connection.",
      'pt-pt': "Para ti, amor é presença. Conversas profundas, atenção exclusiva e momentos partilhados sem distrações são a forma mais verdadeira de conexão."
    }
  },
  expressao_verbal: {
    name: {
      pt: "Expressão Verbal",
      en: "Verbal Expression",
      'pt-pt': "Expressão Verbal"
    },
    symbol: "🕊️",
    essence: {
      pt: "Você cria mundos com suas palavras. Quando fala com amor, tudo floresce ao seu redor.",
      en: "You create worlds with your words. When you speak with love, everything flourishes around you.",
      'pt-pt': "Tu crias mundos com as tuas palavras. Quando falas com amor, tudo floresce à tua volta."
    },
    description: {
      pt: "Sua conexão afetiva é expressa através de palavras. Elogios, encorajamento, reconhecimento verbal e mensagens de carinho são fundamentais para você.",
      en: "Your affective connection is expressed through words. Compliments, encouragement, verbal recognition and loving messages are essential to you.",
      'pt-pt': "A tua conexão afetiva é expressa através de palavras. Elogios, encorajamento, reconhecimento verbal e mensagens de carinho são fundamentais para ti."
    }
  },
  cuidado_pratico: {
    name: {
      pt: "Cuidado Prático",
      en: "Practical Care",
      'pt-pt': "Cuidado Prático"
    },
    symbol: "💧",
    essence: {
      pt: "O amor, para você, é verbo. Está em cuidar, servir e aliviar o peso do outro.",
      en: "Love, for you, is a verb. It's about caring, serving and lightening another's burden.",
      'pt-pt': "O amor, para ti, é verbo. Está em cuidar, servir e aliviar o peso do outro."
    },
    description: {
      pt: "Para você, amor é ação. Quando alguém faz algo prático para ajudar, resolver problemas ou facilitar sua vida, você sente o amor verdadeiro.",
      en: "For you, love is action. When someone does something practical to help, solve problems or make your life easier, you feel true love.",
      'pt-pt': "Para ti, amor é ação. Quando alguém faz algo prático para ajudar, resolver problemas ou facilitar a tua vida, sentes o amor verdadeiro."
    }
  },
  gestos_simbolicos: {
    name: {
      pt: "Gestos Simbólicos",
      en: "Symbolic Gestures",
      'pt-pt': "Gestos Simbólicos"
    },
    symbol: "🎁",
    essence: {
      pt: "Para você, o amor é um gesto visível, uma lembrança do que é invisível.",
      en: "For you, love is a visible gesture, a reminder of what is invisible.",
      'pt-pt': "Para ti, o amor é um gesto visível, uma lembrança do que é invisível."
    },
    description: {
      pt: "Os gestos simbólicos carregam significado profundo para você. Não é o valor material, mas o pensamento, a lembrança e o simbolismo que tocam seu coração.",
      en: "Symbolic gestures carry deep meaning for you. It's not the material value, but the thought, the memory and the symbolism that touch your heart.",
      'pt-pt': "Os gestos simbólicos carregam significado profundo para ti. Não é o valor material, mas o pensamento, a lembrança e o simbolismo que tocam o teu coração."
    }
  },
  conexao_fisica: {
    name: {
      pt: "Conexão Física",
      en: "Physical Connection",
      'pt-pt': "Conexão Física"
    },
    symbol: "🔥",
    essence: {
      pt: "Você se comunica pelo contato. O toque é oração, presença e entrega.",
      en: "You communicate through contact. Touch is prayer, presence and surrender.",
      'pt-pt': "Tu comunicas-te pelo contacto. O toque é oração, presença e entrega."
    },
    description: {
      pt: "O contato físico é sua linguagem de conexão. Abraços, carinhos, proximidade física e gestos afetuosos são essenciais para você.",
      en: "Physical contact is your connection language. Hugs, caresses, physical proximity and affectionate gestures are essential to you.",
      'pt-pt': "O contacto físico é a tua linguagem de conexão. Abraços, carinhos, proximidade física e gestos afetuosos são essenciais para ti."
    }
  }
};

// Mapping from old values to new style keys (PT, EN, and new values)
const valueMapping: Record<string, keyof typeof styleData> = {
  // Old PT values
  palavras_afirmacao: 'expressao_verbal',
  tempo_qualidade: 'presenca_ativa',
  presentes: 'gestos_simbolicos',
  atos_servico: 'cuidado_pratico',
  toque_fisico: 'conexao_fisica',
  // Old EN values
  words_of_affirmation: 'expressao_verbal',
  quality_time: 'presenca_ativa',
  receiving_gifts: 'gestos_simbolicos',
  acts_of_service: 'cuidado_pratico',
  physical_touch: 'conexao_fisica',
  // New standardized values (all languages)
  presenca_ativa: 'presenca_ativa',
  expressao_verbal: 'expressao_verbal',
  cuidado_pratico: 'cuidado_pratico',
  gestos_simbolicos: 'gestos_simbolicos',
  conexao_fisica: 'conexao_fisica'
};

export const calculateEstilosConexaoAfetiva = (answers: any[], language: 'pt' | 'en' | 'pt-pt' = 'pt'): EstilosConexaoAfetiva => {
  const scores = {
    presenca_ativa: 0,
    expressao_verbal: 0,
    cuidado_pratico: 0,
    gestos_simbolicos: 0,
    conexao_fisica: 0
  };

  // Count each style occurrence in the answers
  answers.forEach((answer) => {
    const value = answer.answer?.value || answer.answer;
    if (value) {
      const mappedStyle = valueMapping[value];
      if (mappedStyle && scores.hasOwnProperty(mappedStyle)) {
        scores[mappedStyle]++;
      }
    }
  });

  // Sort by score to find primary and secondary
  const sortedStyles = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([style, score]) => ({
      style,
      score,
      ...styleData[style as keyof typeof styleData]
    }));

  const primary = sortedStyles[0];
  const secondary = sortedStyles[1];

  const interpretations = {
    pt: `Seu estilo primário de conexão afetiva é ${primary.name.pt}. ${primary.description.pt}

Seu estilo secundário é ${secondary.name.pt}, mostrando que você também valoriza ${secondary.name.pt.toLowerCase()} em seus relacionamentos.

Essa combinação revela uma pessoa que se conecta de forma ${primary.score > secondary.score + 5 ? 'profundamente focada' : 'equilibrada'}, sabendo expressar e receber afeto através de ${primary.name.pt.toLowerCase()}${primary.score <= secondary.score + 3 ? ` e ${secondary.name.pt.toLowerCase()}` : ''}.`,
    
    en: `Your primary affection connection style is ${primary.name.en}. ${primary.description.en}

Your secondary style is ${secondary.name.en}, showing that you also value ${secondary.name.en.toLowerCase()} in your relationships.

This combination reveals a person who connects in a ${primary.score > secondary.score + 5 ? 'deeply focused' : 'balanced'} way, knowing how to express and receive affection through ${primary.name.en.toLowerCase()}${primary.score <= secondary.score + 3 ? ` and ${secondary.name.en.toLowerCase()}` : ''}.`,
    
    'pt-pt': `O teu estilo primário de conexão afetiva é ${primary.name['pt-pt']}. ${primary.description['pt-pt']}

O teu estilo secundário é ${secondary.name['pt-pt']}, mostrando que também valorizas ${secondary.name['pt-pt'].toLowerCase()} nos teus relacionamentos.

Esta combinação revela uma pessoa que se conecta de forma ${primary.score > secondary.score + 5 ? 'profundamente focada' : 'equilibrada'}, sabendo expressar e receber afeto através de ${primary.name['pt-pt'].toLowerCase()}${primary.score <= secondary.score + 3 ? ` e ${secondary.name['pt-pt'].toLowerCase()}` : ''}.`
  };

  return {
    primary: {
      style: primary.style,
      score: primary.score,
      name: primary.name,
      symbol: primary.symbol,
      essence: primary.essence
    },
    secondary: {
      style: secondary.style,
      score: secondary.score,
      name: secondary.name,
      symbol: secondary.symbol,
      essence: secondary.essence
    },
    scores,
    interpretation: interpretations
  };
};

// Export style data for use in result pages
export const getStyleData = () => styleData;
