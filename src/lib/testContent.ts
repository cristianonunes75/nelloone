// Centralized test content for PT/EN versions
export interface TestContent {
  title: string;
  subtitle: string;
  storytelling: string;
  benefits: string[];
  audience: string;
  howItWorks: {
    step1: string;
    step2: string;
    step3: string;
  };
  whatItHelps: string[];
  ctaText: string;
}

export interface TestContentMap {
  pt: TestContent;
  en: TestContent;
}

// Test slugs for routing
export const testSlugs = {
  arquetipos: { pt: 'arquetipos', en: 'archetypes' },
  disc: { pt: 'disc', en: 'disc' },
  temperamentos: { pt: 'temperamentos', en: 'temperaments' },
  linguagens_amor: { pt: 'linguagens-do-amor', en: 'love-languages' },
  inteligencias_multiplas: { pt: 'inteligencias', en: 'intelligences' },
  eneagrama: { pt: 'eneagrama', en: 'enneagram' },
  mbti: { pt: 'mbti', en: 'mbti' },
};

export const testContent: Record<string, TestContentMap> = {
  arquetipos: {
    pt: {
      title: "Arquétipos",
      subtitle: "Descubra o símbolo que habita em você",
      storytelling: `Antes de qualquer palavra, o mundo já sente quem você é.
Essa presença é o reflexo do seu arquétipo — a energia que comunica sua verdade antes mesmo que você fale.

No NELLO ONE, esse teste revela as forças simbólicas que movem sua personalidade, sua imagem e sua missão.
Mais do que marketing, é um mapa espiritual da sua comunicação.`,
      benefits: [
        "Seu arquétipo principal e o complementar",
        "Como traduzir propósito em presença",
        "Como alinhar sua imagem à sua verdade interior",
      ],
      audience: "Líderes, empreendedores e comunicadores que desejam se posicionar com autoridade e autenticidade.",
      howItWorks: {
        step1: "Você responde 36 perguntas sobre comportamento e preferências",
        step2: "Miguel analisa seus padrões e identifica seus arquétipos dominantes",
        step3: "Você recebe seu perfil completo com forças, desafios e orientações",
      },
      whatItHelps: [
        "Entender como você se comunica naturalmente",
        "Identificar sua energia de liderança",
        "Alinhar sua imagem pessoal e profissional",
        "Descobrir seu propósito central",
        "Melhorar sua presença em público",
      ],
      ctaText: "Começar Teste Gratuito",
    },
    en: {
      title: "Archetypes",
      subtitle: "Discover the symbol that lives within you",
      storytelling: `Before any words are spoken, the world already senses who you are.
This presence is a reflection of your archetype — the energy that communicates your truth before you even speak.

In NELLO ONE, this test reveals the symbolic forces that drive your personality, your image and your mission.
More than marketing, it's a spiritual map of your communication.`,
      benefits: [
        "Your main archetype and complementary one",
        "How to translate purpose into presence",
        "How to align your image with your inner truth",
      ],
      audience: "Leaders, entrepreneurs and communicators who want to position themselves with authority and authenticity.",
      howItWorks: {
        step1: "You answer 36 questions about behavior and preferences",
        step2: "Miguel analyzes your patterns and identifies your dominant archetypes",
        step3: "You receive your complete profile with strengths, challenges and guidance",
      },
      whatItHelps: [
        "Understand how you naturally communicate",
        "Identify your leadership energy",
        "Align your personal and professional image",
        "Discover your core purpose",
        "Improve your public presence",
      ],
      ctaText: "Start Free Test",
    },
  },
  disc: {
    pt: {
      title: "DISC",
      subtitle: "Descubra seu perfil comportamental",
      storytelling: `Este teste identifica o seu perfil comportamental natural. A metodologia DISC revela como você reage, decide, comunica e contribui em diferentes contextos da vida e do trabalho.

Cada pessoa tem um ritmo único de ação. O DISC mostra como você se expressa, toma decisões e se relaciona. No NELLO ONE, esse teste ajuda você a compreender o que move suas atitudes e como gerar impacto com equilíbrio e autenticidade.`,
      benefits: [
        "Seu perfil comportamental predominante (D, I, S ou C)",
        "Como usar sua energia natural sem se sobrecarregar",
        "Como fortalecer relacionamentos e liderança",
        "Seu caminho de crescimento pessoal",
      ],
      audience: "Profissionais, gestores, mentores e pessoas que desejam liderar com empatia e propósito.",
      howItWorks: {
        step1: "Você responde 28 perguntas sobre situações do dia a dia",
        step2: "Miguel identifica seu estilo comportamental dominante",
        step3: "Você recebe insights sobre como otimizar suas relações e decisões",
      },
      whatItHelps: [
        "Entender seu estilo de comunicação",
        "Melhorar relacionamentos profissionais",
        "Aumentar sua eficácia em equipes",
        "Reduzir conflitos interpessoais",
        "Desenvolver liderança consciente",
      ],
      ctaText: "Começar Teste",
    },
    en: {
      title: "DISC",
      subtitle: "Discover your behavioral profile",
      storytelling: `This test identifies your natural behavioral profile. The DISC methodology reveals how you react, decide, communicate and contribute in different life and work contexts.

Each person has a unique rhythm of action. DISC shows how you express yourself, make decisions and relate to others. In NELLO ONE, this test helps you understand what drives your attitudes and how to create impact with balance and authenticity.`,
      benefits: [
        "Your predominant behavioral profile (D, I, S or C)",
        "How to use your natural energy without burning out",
        "How to strengthen relationships and leadership",
        "Your path to personal growth",
      ],
      audience: "Professionals, managers, mentors and people who want to lead with empathy and purpose.",
      howItWorks: {
        step1: "You answer 28 questions about everyday situations",
        step2: "Miguel identifies your dominant behavioral style",
        step3: "You receive insights on how to optimize your relationships and decisions",
      },
      whatItHelps: [
        "Understand your communication style",
        "Improve professional relationships",
        "Increase your effectiveness in teams",
        "Reduce interpersonal conflicts",
        "Develop conscious leadership",
      ],
      ctaText: "Start Test",
    },
  },
  temperamentos: {
    pt: {
      title: "Temperamentos",
      subtitle: "Conheça sua natureza essencial",
      storytelling: `Desde Hipócrates, o ser humano busca entender as quatro formas fundamentais de ser: sanguíneo, colérico, melancólico e fleumático.

Esse teste revela a base da sua personalidade — e como harmonizar suas tendências naturais com propósito e equilíbrio.`,
      benefits: [
        "Seu temperamento dominante e secundário",
        "Como sua natureza influencia decisões e relacionamentos",
        "Como desenvolver suas forças e harmonizar suas tendências",
      ],
      audience: "Líderes, empreendedores, profissionais de saúde e todos que buscam autoconhecimento profundo baseado em tradição milenar.",
      howItWorks: {
        step1: "Você responde 32 perguntas sobre suas reações naturais",
        step2: "Miguel mapeia seu temperamento primário e secundário",
        step3: "Você entende como equilibrar suas tendências inatas",
      },
      whatItHelps: [
        "Compreender suas reações emocionais",
        "Melhorar a gestão do estresse",
        "Entender padrões de relacionamento",
        "Desenvolver autocontrole",
        "Harmonizar sua energia vital",
      ],
      ctaText: "Começar Teste",
    },
    en: {
      title: "Temperaments",
      subtitle: "Know your essential nature",
      storytelling: `Since Hippocrates, humanity has sought to understand the four fundamental ways of being: sanguine, choleric, melancholic and phlegmatic.

This test reveals the foundation of your personality — and how to harmonize your natural tendencies with purpose and balance.`,
      benefits: [
        "Your dominant and secondary temperament",
        "How your nature influences decisions and relationships",
        "How to develop your strengths and harmonize your tendencies",
      ],
      audience: "Leaders, entrepreneurs, health professionals and all who seek deep self-knowledge based on ancient tradition.",
      howItWorks: {
        step1: "You answer 32 questions about your natural reactions",
        step2: "Miguel maps your primary and secondary temperament",
        step3: "You understand how to balance your innate tendencies",
      },
      whatItHelps: [
        "Understand your emotional reactions",
        "Improve stress management",
        "Understand relationship patterns",
        "Develop self-control",
        "Harmonize your vital energy",
      ],
      ctaText: "Start Test",
    },
  },
  linguagens_amor: {
    pt: {
      title: "Linguagens do Amor",
      subtitle: "Como você ama e se sente amado?",
      storytelling: `Cada pessoa expressa e recebe amor de formas diferentes: palavras, tempo, presentes, ajuda prática ou toque físico.

Esse teste revela como o amor fala em sua alma — e como você pode comunicar e receber afeto de forma mais verdadeira.`,
      benefits: [
        "Sua linguagem primária e secundária de amor",
        "Como melhorar seus relacionamentos afetivos",
        "Recomendações práticas de comunicação e convivência",
      ],
      audience: "Pessoas em relacionamentos, famílias, profissionais que trabalham com pessoas e todos que desejam aprofundar conexões verdadeiras.",
      howItWorks: {
        step1: "Você responde 30 perguntas sobre preferências afetivas",
        step2: "Miguel identifica suas linguagens de amor dominantes",
        step3: "Você aprende a dar e receber amor de forma mais eficaz",
      },
      whatItHelps: [
        "Melhorar a comunicação em relacionamentos",
        "Entender as necessidades do parceiro",
        "Fortalecer vínculos familiares",
        "Resolver conflitos afetivos",
        "Criar conexões mais profundas",
      ],
      ctaText: "Começar Teste",
    },
    en: {
      title: "Love Languages",
      subtitle: "How do you love and feel loved?",
      storytelling: `Each person expresses and receives love in different ways: words, time, gifts, acts of service or physical touch.

This test reveals how love speaks to your soul — and how you can communicate and receive affection more authentically.`,
      benefits: [
        "Your primary and secondary love language",
        "How to improve your affective relationships",
        "Practical recommendations for communication and connection",
      ],
      audience: "People in relationships, families, professionals who work with people and all who want to deepen genuine connections.",
      howItWorks: {
        step1: "You answer 30 questions about affective preferences",
        step2: "Miguel identifies your dominant love languages",
        step3: "You learn to give and receive love more effectively",
      },
      whatItHelps: [
        "Improve communication in relationships",
        "Understand your partner's needs",
        "Strengthen family bonds",
        "Resolve affective conflicts",
        "Create deeper connections",
      ],
      ctaText: "Start Test",
    },
  },
  inteligencias_multiplas: {
    pt: {
      title: "Inteligências Múltiplas",
      subtitle: "Reconheça seus dons e talentos",
      storytelling: `Cada pessoa tem uma combinação única de talentos e formas de pensar. O teste das Inteligências Múltiplas mostra quais áreas da sua mente têm mais energia — e como usá-las no trabalho, na vocação e na vida.`,
      benefits: [
        "Gráfico com suas 8 inteligências mapeadas",
        "Relatório com leitura simbólica + plano de ação pessoal",
        "Recomendações personalizadas de desenvolvimento",
      ],
      audience: "Profissionais, educadores, artistas e empreendedores que desejam alinhar talento, propósito e potencial.",
      howItWorks: {
        step1: "Você responde 40 perguntas sobre habilidades e preferências",
        step2: "Miguel mapeia suas 8 inteligências em um gráfico visual",
        step3: "Você descobre como potencializar seus talentos naturais",
      },
      whatItHelps: [
        "Identificar seus talentos naturais",
        "Escolher carreiras mais alinhadas",
        "Desenvolver habilidades específicas",
        "Entender seu estilo de aprendizagem",
        "Maximizar seu potencial único",
      ],
      ctaText: "Começar Teste",
    },
    en: {
      title: "Multiple Intelligences",
      subtitle: "Recognize your gifts and talents",
      storytelling: `Each person has a unique combination of talents and ways of thinking. The Multiple Intelligences test shows which areas of your mind have the most energy — and how to use them in work, vocation and life.`,
      benefits: [
        "Graph with your 8 intelligences mapped",
        "Report with symbolic reading + personal action plan",
        "Personalized development recommendations",
      ],
      audience: "Professionals, educators, artists and entrepreneurs who want to align talent, purpose and potential.",
      howItWorks: {
        step1: "You answer 40 questions about skills and preferences",
        step2: "Miguel maps your 8 intelligences in a visual graph",
        step3: "You discover how to enhance your natural talents",
      },
      whatItHelps: [
        "Identify your natural talents",
        "Choose more aligned careers",
        "Develop specific skills",
        "Understand your learning style",
        "Maximize your unique potential",
      ],
      ctaText: "Start Test",
    },
  },
  eneagrama: {
    pt: {
      title: "Eneagrama",
      subtitle: "O mapa das motivações da alma",
      storytelling: `Por trás de cada atitude, existe uma motivação. O Eneagrama revela o que move seu coração — as virtudes e desafios que moldam seu modo de amar, trabalhar e viver.

No NELLO ONE, ele é uma chave para a liberdade interior.`,
      benefits: [
        "Seu tipo de personalidade entre os 9 perfis do Eneagrama",
        "Como transformar desafios em virtudes através do autoconhecimento",
        "Compreender padrões emocionais profundos que guiam suas ações",
        "O caminho de crescimento único do seu tipo",
      ],
      audience: "Para quem busca compreender as motivações profundas da alma e viver com mais equilíbrio interior.",
      howItWorks: {
        step1: "Você responde 45 perguntas sobre motivações e medos",
        step2: "Miguel identifica seu tipo principal e suas asas",
        step3: "Você recebe um mapa de crescimento personalizado",
      },
      whatItHelps: [
        "Entender suas motivações profundas",
        "Reconhecer padrões de autossabotagem",
        "Desenvolver inteligência emocional",
        "Melhorar relacionamentos significativos",
        "Encontrar seu caminho de evolução",
      ],
      ctaText: "Começar Teste",
    },
    en: {
      title: "Enneagram",
      subtitle: "The map of the soul's motivations",
      storytelling: `Behind every attitude, there is a motivation. The Enneagram reveals what moves your heart — the virtues and challenges that shape how you love, work and live.

In NELLO ONE, it is a key to inner freedom.`,
      benefits: [
        "Your personality type among the 9 Enneagram profiles",
        "How to transform challenges into virtues through self-knowledge",
        "Understand deep emotional patterns that guide your actions",
        "The unique growth path for your type",
      ],
      audience: "For those who seek to understand the deep motivations of the soul and live with more inner balance.",
      howItWorks: {
        step1: "You answer 45 questions about motivations and fears",
        step2: "Miguel identifies your main type and your wings",
        step3: "You receive a personalized growth map",
      },
      whatItHelps: [
        "Understand your deep motivations",
        "Recognize self-sabotage patterns",
        "Develop emotional intelligence",
        "Improve meaningful relationships",
        "Find your evolution path",
      ],
      ctaText: "Start Test",
    },
  },
  mbti: {
    pt: {
      title: "MBTI",
      subtitle: "Compreenda sua forma única de pensar e decidir",
      storytelling: `Descubra como você percebe o mundo, toma decisões e se relaciona com a vida. Este teste identifica o seu tipo psicológico segundo a teoria dos tipos de Carl Jung e adapta-o à linguagem simbólica do NELLO ONE.`,
      benefits: [
        "Seu tipo psicológico (ex: INFP, ESTJ etc.)",
        "Como equilibrar razão, emoção e propósito",
        "Como se posicionar com clareza em decisões profissionais e pessoais",
      ],
      audience: "Quem busca autoconhecimento profundo e alinhamento entre mente, emoção e propósito.",
      howItWorks: {
        step1: "Você responde 60 perguntas sobre preferências cognitivas",
        step2: "Miguel identifica seu tipo entre os 16 perfis MBTI",
        step3: "Você entende como sua mente processa informações e decide",
      },
      whatItHelps: [
        "Compreender seu estilo cognitivo",
        "Melhorar tomada de decisões",
        "Escolher carreiras alinhadas",
        "Entender dinâmicas de equipe",
        "Desenvolver áreas menos dominantes",
      ],
      ctaText: "Começar Teste",
    },
    en: {
      title: "MBTI",
      subtitle: "Understand your unique way of thinking and deciding",
      storytelling: `Discover how you perceive the world, make decisions and relate to life. This test identifies your psychological type according to Carl Jung's type theory and adapts it to NELLO ONE's symbolic language.`,
      benefits: [
        "Your psychological type (e.g., INFP, ESTJ, etc.)",
        "How to balance reason, emotion and purpose",
        "How to position yourself clearly in professional and personal decisions",
      ],
      audience: "Those who seek deep self-knowledge and alignment between mind, emotion and purpose.",
      howItWorks: {
        step1: "You answer 60 questions about cognitive preferences",
        step2: "Miguel identifies your type among the 16 MBTI profiles",
        step3: "You understand how your mind processes information and decides",
      },
      whatItHelps: [
        "Understand your cognitive style",
        "Improve decision making",
        "Choose aligned careers",
        "Understand team dynamics",
        "Develop less dominant areas",
      ],
      ctaText: "Start Test",
    },
  },
};

// Helper to get test path based on language
export const getTestPath = (testType: string, language: 'pt' | 'en'): string => {
  const slugs = testSlugs[testType as keyof typeof testSlugs];
  if (!slugs) return language === 'en' ? '/en' : '/';
  
  return language === 'en' 
    ? `/en/tests/${slugs.en}`
    : `/testes/${slugs.pt}`;
};

// Helper to get test type from slug
export const getTestTypeFromSlug = (slug: string): string | null => {
  for (const [type, slugPair] of Object.entries(testSlugs)) {
    if (slugPair.pt === slug || slugPair.en === slug) {
      return type;
    }
  }
  return null;
};
