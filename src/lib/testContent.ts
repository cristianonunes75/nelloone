// Centralized test content for PT/EN versions
export interface TestContent {
  title: string;
  subtitle: string;
  about: {
    acronym?: string; // Full name behind acronym (if applicable)
    origin: string; // Who created/where it comes from
    objective: string; // Main goal of the test
    methodology: string; // How it works conceptually
  };
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
  'pt-pt'?: TestContent;
}

// Test slugs for routing
export const testSlugs = {
  arquetipos: { pt: 'arquetipos', en: 'archetypes' },
  disc: { pt: 'disc', en: 'disc' },
  temperamentos: { pt: 'temperamentos', en: 'temperaments' },
  linguagens_amor: { pt: 'estilos-conexao-afetiva', en: 'affection-connection-styles' },
  inteligencias_multiplas: { pt: 'inteligencias', en: 'intelligences' },
  eneagrama: { pt: 'eneagrama', en: 'enneagram' },
  mbti: { pt: 'nello-16-personalidades', en: '16-personality-map' },
};

export const testContent: Record<string, TestContentMap> = {
  arquetipos: {
    pt: {
      title: "Arquétipos",
      subtitle: "Descubra o símbolo que habita em você",
      about: {
        origin: "Criado por Carl Jung (1875-1961), psiquiatra suíço, e popularizado por Carol S. Pearson para aplicação em marcas e comunicação.",
        objective: "Identificar os padrões universais de comportamento e imagem que moldam como você se apresenta ao mundo e se conecta com os outros.",
        methodology: "Baseado em 12 arquétipos universais (Herói, Mago, Sábio, etc.), o teste mapeia quais símbolos dominam sua personalidade e como eles influenciam sua comunicação e presença.",
      },
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
        step2: "Nello AI analisa seus padrões e identifica seus arquétipos dominantes",
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
      about: {
        origin: "Created by Carl Jung (1875-1961), Swiss psychiatrist, and popularized by Carol S. Pearson for application in branding and communication.",
        objective: "Identify the universal behavior and image patterns that shape how you present yourself to the world and connect with others.",
        methodology: "Based on 12 universal archetypes (Hero, Magician, Sage, etc.), the test maps which symbols dominate your personality and how they influence your communication and presence.",
      },
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
        step2: "Nello AI analyzes your patterns and identifies your dominant archetypes",
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
      about: {
        acronym: "D = Dominância, I = Influência, S = Estabilidade (Steadiness), C = Conformidade (Conscientiousness)",
        origin: "Desenvolvido por William Moulton Marston em 1928 no livro 'Emotions of Normal People'. Hoje é uma das ferramentas comportamentais mais usadas no mundo corporativo.",
        objective: "Mapear seu estilo natural de comportamento para entender como você age, se comunica e toma decisões em diferentes situações.",
        methodology: "Avalia 4 dimensões comportamentais: como você lida com desafios (D), influencia pessoas (I), responde ao ritmo do ambiente (S) e segue regras e procedimentos (C).",
      },
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
        step2: "Nello AI identifica seu estilo comportamental dominante",
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
      about: {
        acronym: "D = Dominance, I = Influence, S = Steadiness, C = Conscientiousness",
        origin: "Developed by William Moulton Marston in 1928 in the book 'Emotions of Normal People'. Today it is one of the most widely used behavioral tools in the corporate world.",
        objective: "Map your natural behavioral style to understand how you act, communicate and make decisions in different situations.",
        methodology: "Evaluates 4 behavioral dimensions: how you deal with challenges (D), influence people (I), respond to the pace of the environment (S) and follow rules and procedures (C).",
      },
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
        step2: "Nello AI identifies your dominant behavioral style",
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
      about: {
        origin: "Teoria criada por Hipócrates (460-370 a.C.), o pai da medicina, e aprofundada por Galeno. É uma das mais antigas formas de compreender a personalidade humana.",
        objective: "Revelar sua natureza emocional fundamental — o 'motor interno' que influencia suas reações, ritmo de vida e forma de se relacionar.",
        methodology: "Classifica em 4 temperamentos: Sanguíneo (expansivo, sociável), Colérico (decidido, intenso), Melancólico (profundo, detalhista) e Fleumático (calmo, observador). Cada pessoa tem um dominante e um secundário.",
      },
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
        step2: "Nello AI mapeia seu temperamento primário e secundário",
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
      about: {
        origin: "Theory created by Hippocrates (460-370 BC), the father of medicine, and deepened by Galen. It is one of the oldest ways to understand human personality.",
        objective: "Reveal your fundamental emotional nature — the 'internal engine' that influences your reactions, pace of life and way of relating.",
        methodology: "Classifies into 4 temperaments: Sanguine (expansive, sociable), Choleric (decisive, intense), Melancholic (deep, detailed) and Phlegmatic (calm, observant). Each person has a dominant and a secondary one.",
      },
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
        step2: "Nello AI maps your primary and secondary temperament",
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
      title: "Mapa dos Estilos de Conexão Afetiva",
      subtitle: "Como você se conecta emocionalmente?",
      about: {
        origin: "Inspirado no trabalho de Gary Chapman ('As 5 Linguagens do Amor', 1992), adaptado pelo Nello para uma perspectiva mais ampla de conexão emocional.",
        objective: "Descobrir como você expressa e recebe afeto, melhorando a qualidade dos seus relacionamentos pessoais e profissionais.",
        methodology: "Mapeia 5 estilos de conexão: Tempo de Qualidade (presença), Palavras de Afirmação (reconhecimento verbal), Atos de Serviço (ajuda prática), Presentes (gestos simbólicos) e Toque Físico (contato). Identifica seu estilo primário e secundário.",
      },
      storytelling: `Cada pessoa se conecta emocionalmente de formas diferentes: através da presença, das palavras, do cuidado prático, de gestos simbólicos ou do contato físico.

Este teste revela seu estilo primário de conexão afetiva — e como você pode cultivar relacionamentos mais profundos e autênticos.`,
      benefits: [
        "Seu estilo primário e secundário de conexão afetiva",
        "Como fortalecer seus relacionamentos",
        "Recomendações práticas para conexões mais profundas",
      ],
      audience: "Pessoas em relacionamentos, famílias, profissionais que trabalham com pessoas e todos que desejam cultivar conexões mais verdadeiras.",
      howItWorks: {
        step1: "Você responde 30 perguntas sobre como se conecta emocionalmente",
        step2: "Nello AI identifica seus estilos de conexão dominantes",
        step3: "Você aprende a cultivar relacionamentos mais profundos",
      },
      whatItHelps: [
        "Compreender seu estilo de conexão emocional",
        "Melhorar a comunicação em relacionamentos",
        "Entender as necessidades afetivas do parceiro",
        "Fortalecer vínculos familiares e profissionais",
        "Criar conexões mais autênticas e profundas",
      ],
      ctaText: "Começar Teste",
    },
    en: {
      title: "Affection Connection Styles",
      subtitle: "How do you emotionally connect?",
      about: {
        origin: "Inspired by Gary Chapman's work ('The 5 Love Languages', 1992), adapted by Nello for a broader perspective on emotional connection.",
        objective: "Discover how you express and receive affection, improving the quality of your personal and professional relationships.",
        methodology: "Maps 5 connection styles: Quality Time (presence), Words of Affirmation (verbal recognition), Acts of Service (practical help), Gifts (symbolic gestures) and Physical Touch (contact). Identifies your primary and secondary style.",
      },
      storytelling: `Each person connects emotionally in different ways: through presence, words, practical care, symbolic gestures or physical contact.

This test reveals your primary affection connection style — and how you can cultivate deeper and more authentic relationships.`,
      benefits: [
        "Your primary and secondary connection style",
        "How to strengthen your relationships",
        "Practical recommendations for deeper connections",
      ],
      audience: "People in relationships, families, professionals who work with people and all who want to cultivate more genuine connections.",
      howItWorks: {
        step1: "You answer 30 questions about how you emotionally connect",
        step2: "Nello AI identifies your dominant connection styles",
        step3: "You learn to cultivate deeper relationships",
      },
      whatItHelps: [
        "Understand your emotional connection style",
        "Improve communication in relationships",
        "Understand your partner's affective needs",
        "Strengthen family and professional bonds",
        "Create more authentic and deeper connections",
      ],
      ctaText: "Start Test",
    },
    'pt-pt': {
      title: "Mapa dos Estilos de Conexão Afetiva",
      subtitle: "Como te conectas emocionalmente?",
      about: {
        origin: "Inspirado no trabalho de Gary Chapman ('As 5 Linguagens do Amor', 1992), adaptado pelo Nello para uma perspetiva mais ampla de conexão emocional.",
        objective: "Descobrir como expressas e recebes afeto, melhorando a qualidade dos teus relacionamentos pessoais e profissionais.",
        methodology: "Mapeia 5 estilos de conexão: Tempo de Qualidade (presença), Palavras de Afirmação (reconhecimento verbal), Atos de Serviço (ajuda prática), Presentes (gestos simbólicos) e Toque Físico (contacto). Identifica o teu estilo primário e secundário.",
      },
      storytelling: `Cada pessoa conecta-se emocionalmente de formas diferentes: através da presença, das palavras, do cuidado prático, de gestos simbólicos ou do contacto físico.

Este teste revela o teu estilo primário de conexão afetiva — e como podes cultivar relacionamentos mais profundos e autênticos.`,
      benefits: [
        "O teu estilo primário e secundário de conexão afetiva",
        "Como fortalecer os teus relacionamentos",
        "Recomendações práticas para conexões mais profundas",
      ],
      audience: "Pessoas em relacionamentos, famílias, profissionais que trabalham com pessoas e todos que desejam cultivar conexões mais verdadeiras.",
      howItWorks: {
        step1: "Respondes a 30 perguntas sobre como te conectas emocionalmente",
        step2: "Nello AI identifica os teus estilos de conexão dominantes",
        step3: "Aprendes a cultivar relacionamentos mais profundos",
      },
      whatItHelps: [
        "Compreender o teu estilo de conexão emocional",
        "Melhorar a comunicação em relacionamentos",
        "Entender as necessidades afetivas do parceiro",
        "Fortalecer vínculos familiares e profissionais",
        "Criar conexões mais autênticas e profundas",
      ],
      ctaText: "Começar Teste",
    },
  },
  inteligencias_multiplas: {
    pt: {
      title: "Inteligências Múltiplas",
      subtitle: "Reconheça seus dons e talentos",
      about: {
        origin: "Teoria desenvolvida por Howard Gardner em 1983 (Harvard), revolucionando a visão de que inteligência não é única, mas múltipla.",
        objective: "Mapear suas 8 inteligências para descobrir onde estão seus maiores talentos naturais e como desenvolvê-los estrategicamente.",
        methodology: "Avalia 8 tipos de inteligência: Linguística (palavras), Lógico-Matemática (raciocínio), Musical (ritmo e sons), Corporal-Cinestésica (movimento), Espacial (visualização), Interpessoal (pessoas), Intrapessoal (autoconhecimento) e Naturalista (natureza e padrões).",
      },
      storytelling: `Cada pessoa tem uma combinação única de talentos e formas de pensar. O teste das Inteligências Múltiplas mostra quais áreas da sua mente têm mais energia — e como usá-las no trabalho, na vocação e na vida.`,
      benefits: [
        "Gráfico com suas 8 inteligências mapeadas",
        "Relatório com leitura simbólica + plano de ação pessoal",
        "Recomendações personalizadas de desenvolvimento",
      ],
      audience: "Profissionais, educadores, artistas e empreendedores que desejam alinhar talento, propósito e potencial.",
      howItWorks: {
        step1: "Você responde 40 perguntas sobre habilidades e preferências",
        step2: "Nello AI mapeia suas 8 inteligências em um gráfico visual",
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
      about: {
        origin: "Theory developed by Howard Gardner in 1983 (Harvard), revolutionizing the view that intelligence is not unique, but multiple.",
        objective: "Map your 8 intelligences to discover where your greatest natural talents lie and how to develop them strategically.",
        methodology: "Evaluates 8 types of intelligence: Linguistic (words), Logical-Mathematical (reasoning), Musical (rhythm and sounds), Bodily-Kinesthetic (movement), Spatial (visualization), Interpersonal (people), Intrapersonal (self-knowledge) and Naturalistic (nature and patterns).",
      },
      storytelling: `Each person has a unique combination of talents and ways of thinking. The Multiple Intelligences test shows which areas of your mind have the most energy — and how to use them in work, vocation and life.`,
      benefits: [
        "Graph with your 8 intelligences mapped",
        "Report with symbolic reading + personal action plan",
        "Personalized development recommendations",
      ],
      audience: "Professionals, educators, artists and entrepreneurs who want to align talent, purpose and potential.",
      howItWorks: {
        step1: "You answer 40 questions about skills and preferences",
        step2: "Nello AI maps your 8 intelligences in a visual graph",
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
      about: {
        acronym: "Do grego 'ennea' (nove) + 'gramma' (figura/desenho) = figura de nove pontas",
        origin: "Sistema com raízes antigas (tradição Sufi, séculos 14-15), modernizado por Oscar Ichazo e Claudio Naranjo nos anos 1960-70.",
        objective: "Revelar suas motivações inconscientes, medos centrais e caminhos de crescimento pessoal e espiritual.",
        methodology: "Identifica 9 tipos de personalidade (1-Perfeccionista, 2-Ajudador, 3-Realizador, 4-Romântico, 5-Observador, 6-Questionador, 7-Entusiasta, 8-Desafiador, 9-Pacificador), cada um com suas motivações, medos e caminhos de evolução únicos.",
      },
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
        step2: "Nello AI identifica seu tipo principal e suas asas",
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
      about: {
        acronym: "From Greek 'ennea' (nine) + 'gramma' (figure/drawing) = nine-pointed figure",
        origin: "System with ancient roots (Sufi tradition, 14th-15th centuries), modernized by Oscar Ichazo and Claudio Naranjo in the 1960s-70s.",
        objective: "Reveal your unconscious motivations, core fears and paths for personal and spiritual growth.",
        methodology: "Identifies 9 personality types (1-Perfectionist, 2-Helper, 3-Achiever, 4-Romantic, 5-Observer, 6-Questioner, 7-Enthusiast, 8-Challenger, 9-Peacemaker), each with their unique motivations, fears and evolution paths.",
      },
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
        step2: "Nello AI identifies your main type and your wings",
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
      title: "Nello 16 Personality Map",
      subtitle: "Descubra seu perfil psicológico em 4 letras",
      about: {
        acronym: "As 4 letras representam: E/I (Extroversão/Introversão), S/N (Sensação/Intuição), T/F (Pensamento/Sentimento), J/P (Julgamento/Percepção)",
        origin: "Baseado nas teorias de Carl Jung (1921) e desenvolvido por Katharine Briggs e Isabel Myers. Adaptado pelo Nello para uma versão moderna e acessível.",
        objective: "Revelar seu tipo psicológico único entre 16 perfis possíveis, mostrando como você percebe o mundo e toma decisões.",
        methodology: "Avalia 4 dimensões: de onde vem sua energia (E/I), como você coleta informações (S/N), como você toma decisões (T/F) e como você organiza sua vida (J/P).",
      },
      storytelling: `O Nello 16 Personality Map é um sistema exclusivo do Nello One que traduz as teorias de Carl Jung em um modelo moderno de 16 perfis psicológicos.

Ele identifica como você percebe o mundo, processa informações, toma decisões e se relaciona com diferentes ambientes.

Em poucos minutos, você descobre seus pontos fortes naturais, seus desafios emocionais, suas tendências de comportamento, como você reage sob pressão, o tipo de ambiente em que você evolui e como melhorar comunicação, carreira e relacionamentos.`,
      benefits: [
        "Seu tipo psicológico em 4 letras (ex: INFP, ESTJ)",
        "Como seu comportamento molda suas relações e decisões",
        "Mapa visual com forças, desafios e orientações práticas",
      ],
      audience: "Quem busca autoconhecimento profundo e clareza sobre como pensa, decide e se relaciona.",
      howItWorks: {
        step1: "Você responde 24 perguntas sobre comportamento e preferências",
        step2: "Nello AI identifica seu tipo entre os 16 perfis Nello",
        step3: "Você recebe seu perfil completo com forças, desafios e aplicações práticas",
      },
      whatItHelps: [
        "Compreender como você se comunica",
        "Identificar onde você trava",
        "Entender como você cresce",
        "Descobrir que ambientes te drenam",
        "Organizar sua vida em direção ao que funciona para você",
      ],
      ctaText: "Começar Teste",
    },
    en: {
      title: "Nello 16 Personality Map",
      subtitle: "Discover your 4-letter psychological type",
      about: {
        acronym: "The 4 letters represent: E/I (Extraversion/Introversion), S/N (Sensing/Intuition), T/F (Thinking/Feeling), J/P (Judging/Perceiving)",
        origin: "Based on Carl Jung's theories (1921) and developed by Katharine Briggs and Isabel Myers. Adapted by Nello for a modern and accessible version.",
        objective: "Reveal your unique psychological type among 16 possible profiles, showing how you perceive the world and make decisions.",
        methodology: "Evaluates 4 dimensions: where your energy comes from (E/I), how you gather information (S/N), how you make decisions (T/F) and how you organize your life (J/P).",
      },
      storytelling: `The Nello 16 Personality Map is a proprietary Nello One system inspired by Carl Jung's psychological type theory and redesigned for the modern world.

It helps you understand how you perceive reality, process information, make decisions, and interact with different environments.

In just a few minutes, you'll discover your natural strengths, your emotional challenges, your behavioral tendencies, how you react under pressure, your ideal environment for growth, and how to improve communication, career and relationships.`,
      benefits: [
        "Your 4-letter psychological type (e.g., INFP, ESTJ)",
        "How your behavior shapes your relationships and decisions",
        "Visual map with strengths, challenges and practical guidance",
      ],
      audience: "Those who seek deep self-knowledge and clarity on how they think, decide and relate.",
      howItWorks: {
        step1: "You answer 24 questions about behavior and preferences",
        step2: "Nello AI identifies your type among the 16 Nello profiles",
        step3: "You receive your complete profile with strengths, challenges and practical applications",
      },
      whatItHelps: [
        "Understand how you communicate",
        "Identify where you get stuck",
        "Understand how you grow",
        "Discover which environments drain you",
        "Align your life with what truly energizes you",
      ],
      ctaText: "Start Test",
    },
    'pt-pt': {
      title: "Mapa das 16 Personalidades Nello",
      subtitle: "Descubra o seu perfil psicológico em 4 letras",
      about: {
        acronym: "As 4 letras representam: E/I (Extroversão/Introversão), S/N (Sensação/Intuição), T/F (Pensamento/Sentimento), J/P (Julgamento/Perceção)",
        origin: "Baseado nas teorias de Carl Jung (1921) e desenvolvido por Katharine Briggs e Isabel Myers. Adaptado pelo Nello para uma versão moderna e acessível.",
        objective: "Revelar o seu tipo psicológico único entre 16 perfis possíveis, mostrando como percebe o mundo e toma decisões.",
        methodology: "Avalia 4 dimensões: de onde vem a sua energia (E/I), como recolhe informações (S/N), como toma decisões (T/F) e como organiza a sua vida (J/P).",
      },
      storytelling: `O Mapa das 16 Personalidades Nello é um sistema exclusivo do Nello One que transforma as teorias de Carl Jung num modelo moderno composto por 16 perfis psicológicos.

Ele identifica a forma como percebe o mundo, processa informação, toma decisões e se adapta a diferentes contextos.

Em poucos minutos irá descobrir os seus pontos fortes naturais, os desafios emocionais que mais aparecem, as suas tendências comportamentais, a forma como reage sob pressão, o tipo de ambiente onde mais se desenvolve e como melhorar comunicação, carreira e relações.`,
      benefits: [
        "O seu tipo psicológico em 4 letras (ex: INFP, ESTJ)",
        "Como o seu comportamento influencia relações e decisões",
        "Mapa visual com forças, desafios e orientações práticas",
      ],
      audience: "Quem procura autoconhecimento profundo e clareza sobre como pensa, decide e se relaciona.",
      howItWorks: {
        step1: "Responde a 24 perguntas sobre comportamento e preferências",
        step2: "Nello AI identifica o seu tipo entre os 16 perfis Nello",
        step3: "Recebe o seu perfil completo com forças, desafios e aplicações práticas",
      },
      whatItHelps: [
        "Compreender como comunica",
        "Identificar onde sente bloqueios",
        "Entender como evolui",
        "Descobrir que ambientes o desgastam",
        "Alinhar a sua vida ao que realmente funciona consigo",
      ],
      ctaText: "Começar Teste",
    },
  },
};

// Helper to get test path based on language
export const getTestPath = (testType: string, language: 'pt' | 'en' | 'pt-pt'): string => {
  const slugs = testSlugs[testType as keyof typeof testSlugs];
  if (!slugs) {
    if (language === 'en') return '/en';
    if (language === 'pt-pt') return '/pt-pt';
    return '/';
  }
  
  switch (language) {
    case 'en':
      return `/en/tests/${slugs.en}`;
    case 'pt-pt':
      return `/pt-pt/testes/${slugs.pt}`;
    case 'pt':
    default:
      return `/testes/${slugs.pt}`;
  }
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
