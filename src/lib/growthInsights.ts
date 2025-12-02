// Growth insights generator based on test type and results

interface GrowthInsight {
  limitingPattern?: string;
  balancingStrength?: string;
  immediateAction?: string;
  recommendedEvolution?: string;
}

type TestType = 'arquetipos_proposito' | 'disc' | 'mbti' | 'eneagrama' | 'linguagens_amor' | 'temperamentos' | 'inteligencias_multiplas';

const insightsData: Record<TestType, Record<'pt' | 'en', GrowthInsight>> = {
  arquetipos_proposito: {
    pt: {
      limitingPattern: "Tendência a se esconder atrás de máscaras sociais, evitando mostrar sua essência verdadeira por medo de rejeição.",
      balancingStrength: "Sua capacidade de se conectar com simbolismos profundos e traduzir emoções em expressão autêntica.",
      immediateAction: "Hoje, dedique 10 minutos para escrever sobre um momento em que você se sentiu completamente você mesmo.",
      recommendedEvolution: "Integrar conscientemente seu arquétipo dominante nas decisões diárias, honrando sua energia natural."
    },
    en: {
      limitingPattern: "Tendency to hide behind social masks, avoiding showing your true essence for fear of rejection.",
      balancingStrength: "Your ability to connect with deep symbolism and translate emotions into authentic expression.",
      immediateAction: "Today, dedicate 10 minutes to write about a moment when you felt completely yourself.",
      recommendedEvolution: "Consciously integrate your dominant archetype into daily decisions, honoring your natural energy."
    }
  },
  disc: {
    pt: {
      limitingPattern: "Pode haver rigidez no estilo comportamental, dificultando adaptação a contextos que exigem flexibilidade.",
      balancingStrength: "Clareza sobre seu ritmo natural de trabalho e comunicação, permitindo escolhas mais alinhadas.",
      immediateAction: "Identifique uma situação recente onde poderia ter ajustado seu estilo para melhor resultado.",
      recommendedEvolution: "Desenvolver versatilidade comportamental mantendo sua autenticidade como base."
    },
    en: {
      limitingPattern: "There may be rigidity in behavioral style, making it difficult to adapt to contexts that require flexibility.",
      balancingStrength: "Clarity about your natural rhythm of work and communication, allowing more aligned choices.",
      immediateAction: "Identify a recent situation where you could have adjusted your style for a better outcome.",
      recommendedEvolution: "Develop behavioral versatility while maintaining your authenticity as a foundation."
    }
  },
  mbti: {
    pt: {
      limitingPattern: "Tendência a favorecer suas funções dominantes, negligenciando o desenvolvimento das funções inferiores.",
      balancingStrength: "Autoconsciência sobre como você processa informações e toma decisões naturalmente.",
      immediateAction: "Pratique deliberadamente sua função inferior por 15 minutos hoje em uma atividade simples.",
      recommendedEvolution: "Buscar equilíbrio entre todas as funções cognitivas para uma personalidade mais integrada."
    },
    en: {
      limitingPattern: "Tendency to favor your dominant functions, neglecting the development of inferior functions.",
      balancingStrength: "Self-awareness about how you process information and make decisions naturally.",
      immediateAction: "Deliberately practice your inferior function for 15 minutes today in a simple activity.",
      recommendedEvolution: "Seek balance between all cognitive functions for a more integrated personality."
    }
  },
  eneagrama: {
    pt: {
      limitingPattern: "Padrão de comportamento automático ligado ao seu tipo, especialmente em momentos de estresse.",
      balancingStrength: "Consciência profunda das motivações internas que guiam suas escolhas e reações.",
      immediateAction: "Quando sentir sua reação automática surgindo hoje, pause e observe antes de agir.",
      recommendedEvolution: "Caminhar em direção às asas e às linhas de integração do seu tipo para crescimento."
    },
    en: {
      limitingPattern: "Automatic behavior pattern linked to your type, especially in moments of stress.",
      balancingStrength: "Deep awareness of the internal motivations that guide your choices and reactions.",
      immediateAction: "When you feel your automatic reaction arising today, pause and observe before acting.",
      recommendedEvolution: "Move towards the wings and integration lines of your type for growth."
    }
  },
  linguagens_amor: {
    pt: {
      limitingPattern: "Expectativa de que outros se conectem emocionalmente da mesma forma que você, gerando frustração nos relacionamentos.",
      balancingStrength: "Clareza sobre seu estilo de conexão afetiva e como cultivar relacionamentos mais profundos.",
      immediateAction: "Hoje, conecte-se com alguém importante usando o estilo de conexão DELE, não o seu.",
      recommendedEvolution: "Aprender a ser fluente em todos os estilos de conexão para relacionamentos mais ricos."
    },
    en: {
      limitingPattern: "Expectation that others connect emotionally the same way you do, generating frustration in relationships.",
      balancingStrength: "Clarity about your affection connection style and how to cultivate deeper relationships.",
      immediateAction: "Today, connect with someone important using THEIR connection style, not yours.",
      recommendedEvolution: "Learn to be fluent in all connection styles for richer relationships."
    }
  },
  temperamentos: {
    pt: {
      limitingPattern: "Reações emocionais automáticas ligadas ao seu temperamento dominante podem criar conflitos.",
      balancingStrength: "Entendimento do seu modo natural de processar emoções e responder ao ambiente.",
      immediateAction: "Observe sua primeira reação emocional hoje e questione se ela serve ao momento presente.",
      recommendedEvolution: "Harmonizar os temperamentos secundários para maior equilíbrio emocional e relacional."
    },
    en: {
      limitingPattern: "Automatic emotional reactions linked to your dominant temperament can create conflicts.",
      balancingStrength: "Understanding your natural way of processing emotions and responding to the environment.",
      immediateAction: "Observe your first emotional reaction today and question if it serves the present moment.",
      recommendedEvolution: "Harmonize secondary temperaments for greater emotional and relational balance."
    }
  },
  inteligencias_multiplas: {
    pt: {
      limitingPattern: "Foco excessivo nas inteligências dominantes pode limitar o desenvolvimento de outras capacidades.",
      balancingStrength: "Consciência clara dos seus talentos naturais e formas preferidas de aprender.",
      immediateAction: "Hoje, aprenda algo novo usando uma inteligência que você normalmente não prioriza.",
      recommendedEvolution: "Desenvolver inteligências secundárias enquanto aplica suas forças dominantes."
    },
    en: {
      limitingPattern: "Excessive focus on dominant intelligences can limit the development of other capabilities.",
      balancingStrength: "Clear awareness of your natural talents and preferred ways of learning.",
      immediateAction: "Today, learn something new using an intelligence you don't normally prioritize.",
      recommendedEvolution: "Develop secondary intelligences while applying your dominant strengths."
    }
  }
};

export function getGrowthInsights(testType: string, language: 'pt' | 'en'): GrowthInsight {
  const type = testType as TestType;
  const data = insightsData[type];
  
  if (!data) {
    return {
      limitingPattern: language === 'pt' 
        ? "Padrões inconscientes podem estar limitando seu crescimento."
        : "Unconscious patterns may be limiting your growth.",
      balancingStrength: language === 'pt'
        ? "Sua capacidade de autoconhecimento é uma força fundamental."
        : "Your self-awareness capacity is a fundamental strength.",
      immediateAction: language === 'pt'
        ? "Reflita sobre como você pode aplicar os insights deste teste hoje."
        : "Reflect on how you can apply the insights from this test today.",
      recommendedEvolution: language === 'pt'
        ? "Continue explorando suas dimensões internas com curiosidade e compaixão."
        : "Keep exploring your inner dimensions with curiosity and compassion."
    };
  }
  
  return data[language];
}
