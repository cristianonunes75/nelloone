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
  linguagens_amor: { pt: 'estilos-conexao-afetiva', en: 'connection-styles' },
  inteligencias_multiplas: { pt: 'inteligencias', en: 'intelligences' },
  eneagrama: { pt: 'eneagrama', en: 'enneagram' },
  mbti: { pt: 'nello16', en: 'nello16' },
  nello16: { pt: 'nello16', en: 'nello16' },
};

export const testContent: Record<string, TestContentMap> = {
  arquetipos: {
    pt: {
      title: "Arquétipos",
      subtitle: "Explore padrões simbólicos que influenciam sua identidade",
      about: {
        origin: "Criado por Carl Jung (1875-1961), psiquiatra suíço, e popularizado por Carol S. Pearson para aplicação em marcas e comunicação.",
        objective: "Explorar os padrões universais de comportamento e imagem que moldam como você se apresenta ao mundo e se conecta com os outros.",
        methodology: "Baseado em 12 arquétipos universais (Herói, Mago, Sábio, etc.), o mapa organiza quais símbolos predominam na sua personalidade e como eles influenciam sua comunicação e presença.",
      },
      storytelling: `Antes de qualquer palavra, o mundo já sente quem você é.
Essa presença é o reflexo do seu arquétipo — a energia que comunica sua verdade antes mesmo que você fale.

No Identity, esse mapa revela as forças simbólicas que movem sua personalidade, sua imagem e sua missão.
Mais do que marketing, é um instrumento de autoconhecimento para sua comunicação.`,
      benefits: [
        "Seu arquétipo principal e o complementar",
        "Como traduzir propósito em presença",
        "Como alinhar sua imagem à sua verdade interior",
      ],
      audience: "Líderes, empreendedores e comunicadores que desejam se posicionar com autoridade e autenticidade.",
      howItWorks: {
        step1: "Você responde perguntas sobre comportamento e preferências",
        step2: "Nello organiza seus padrões e sugere seus arquétipos predominantes",
        step3: "Você recebe seu perfil completo com forças, desafios e orientações",
      },
      whatItHelps: [
        "Compreender como você se comunica naturalmente",
        "Explorar sua energia de liderança",
        "Refletir sobre sua imagem pessoal e profissional",
        "Reconhecer seu propósito central",
        "Apoiar reflexões sobre sua presença em público",
      ],
      ctaText: "Começar Mapa",
    },
    en: {
      title: "Archetypes",
      subtitle: "Explore symbolic patterns that influence your identity",
      about: {
        origin: "Created by Carl Jung (1875-1961), Swiss psychiatrist, and popularized by Carol S. Pearson for application in branding and communication.",
        objective: "Explore the universal behavior and image patterns that shape how you present yourself to the world and connect with others.",
        methodology: "Based on 12 universal archetypes (Hero, Magician, Sage, etc.), the map organizes which symbols predominate in your personality and how they influence your communication and presence.",
      },
      storytelling: `Before any words are spoken, the world already senses who you are.
This presence is a reflection of your archetype — the energy that communicates your truth before you even speak.

In Identity, this map reveals the symbolic forces that drive your personality, your image and your mission.
More than marketing, it's a self-knowledge tool for your communication.`,
      benefits: [
        "Your main archetype and complementary one",
        "How to translate purpose into presence",
        "How to align your image with your inner truth",
      ],
      audience: "Leaders, entrepreneurs and communicators who want to position themselves with authority and authenticity.",
      howItWorks: {
        step1: "You answer questions about behavior and preferences",
        step2: "Nello organizes your patterns and suggests your predominant archetypes",
        step3: "You receive your complete profile with strengths, challenges and guidance",
      },
      whatItHelps: [
        "Understand how you naturally communicate",
        "Explore your leadership energy",
        "Reflect on your personal and professional image",
        "Recognize your core purpose",
        "Support reflections on your public presence",
      ],
      ctaText: "Start Map",
    },
  },
  disc: {
    pt: {
      title: "DISC",
      subtitle: "Explore tendências do seu estilo comportamental",
      about: {
        acronym: "D = Dominância, I = Influência, S = Estabilidade (Steadiness), C = Conformidade (Conscientiousness)",
        origin: "Desenvolvido por William Moulton Marston em 1928 no livro 'Emotions of Normal People'. Hoje é uma das ferramentas de autoconhecimento mais usadas no mundo corporativo.",
        objective: "Mapear seu estilo natural de comportamento para compreender como você age, se comunica e toma decisões em diferentes situações.",
        methodology: "Avalia 4 dimensões comportamentais: como você lida com desafios (D), influencia pessoas (I), responde ao ritmo do ambiente (S) e segue regras e procedimentos (C).",
      },
      storytelling: `Este mapa organiza o seu perfil comportamental natural. A metodologia DISC revela como você reage, decide, comunica e contribui em diferentes contextos da vida e do trabalho.

Cada pessoa tem um ritmo único de ação. O DISC mostra como você se expressa, toma decisões e se relaciona. No Identity, esse mapa ajuda você a compreender o que move suas atitudes e como gerar impacto com equilíbrio e autenticidade.`,
      benefits: [
        "Seu perfil comportamental predominante (D, I, S ou C)",
        "Como usar sua energia natural sem se sobrecarregar",
        "Como fortalecer relacionamentos e liderança",
        "Seu caminho de desenvolvimento pessoal",
      ],
      audience: "Profissionais, gestores, mentores e pessoas que desejam liderar com empatia e propósito.",
      howItWorks: {
        step1: "Você responde perguntas sobre situações do dia a dia",
        step2: "Nello organiza suas respostas e sugere seu estilo comportamental predominante",
        step3: "Você recebe insights sobre como otimizar suas relações e decisões",
      },
      whatItHelps: [
        "Compreender seu estilo de comunicação",
        "Apoiar reflexões sobre relacionamentos profissionais",
        "Reconhecer sua eficácia em equipes",
        "Compreender dinâmicas de conflito interpessoal",
        "Explorar caminhos de liderança consciente",
      ],
      ctaText: "Começar Mapa",
    },
    en: {
      title: "DISC",
      subtitle: "Explore tendencies in your behavioral style",
      about: {
        acronym: "D = Dominance, I = Influence, S = Steadiness, C = Conscientiousness",
        origin: "Developed by William Moulton Marston in 1928 in the book 'Emotions of Normal People'. Today it is one of the most widely used self-knowledge tools in the corporate world.",
        objective: "Map your natural behavioral style to understand how you act, communicate and make decisions in different situations.",
        methodology: "Evaluates 4 behavioral dimensions: how you deal with challenges (D), influence people (I), respond to the pace of the environment (S) and follow rules and procedures (C).",
      },
      storytelling: `This map organizes your natural behavioral profile. The DISC methodology reveals how you react, decide, communicate and contribute in different life and work contexts.

Each person has a unique rhythm of action. DISC shows how you express yourself, make decisions and relate to others. In Identity, this map helps you understand what drives your attitudes and how to create impact with balance and authenticity.`,
      benefits: [
        "Your predominant behavioral profile (D, I, S or C)",
        "How to use your natural energy without burning out",
        "How to strengthen relationships and leadership",
        "Your path to personal development",
      ],
      audience: "Professionals, managers, mentors and people who want to lead with empathy and purpose.",
      howItWorks: {
        step1: "You answer questions about everyday situations",
        step2: "Nello organizes your responses and suggests your predominant behavioral style",
        step3: "You receive insights on how to optimize your relationships and decisions",
      },
      whatItHelps: [
        "Understand your communication style",
        "Support reflections on professional relationships",
        "Recognize your effectiveness in teams",
        "Understand interpersonal conflict dynamics",
        "Explore paths of conscious leadership",
      ],
      ctaText: "Start Map",
    },
  },
  temperamentos: {
    pt: {
      title: "Temperamentos",
      subtitle: "Reconheça tendências naturais do seu temperamento",
      about: {
        origin: "Teoria criada por Hipócrates (460-370 a.C.), o pai da medicina, e aprofundada por Galeno. É uma das mais antigas formas de compreender a personalidade humana.",
        objective: "Revelar sua natureza emocional fundamental — o 'motor interno' que influencia suas reações, ritmo de vida e forma de se relacionar.",
        methodology: "Classifica em 4 temperamentos: Sanguíneo (expansivo, sociável), Colérico (decidido, intenso), Melancólico (profundo, detalhista) e Fleumático (calmo, observador). Cada pessoa tem um dominante e um secundário.",
      },
      storytelling: `Desde Hipócrates, o ser humano busca entender as quatro formas fundamentais de ser: sanguíneo, colérico, melancólico e fleumático.

Esse mapa revela a base da sua personalidade — e como harmonizar suas tendências naturais com propósito e equilíbrio.`,
      benefits: [
        "Seu temperamento dominante e secundário",
        "Como sua natureza influencia decisões e relacionamentos",
        "Como desenvolver suas forças e harmonizar suas tendências",
      ],
      audience: "Líderes, empreendedores, profissionais de desenvolvimento humano e todos que buscam autoconhecimento profundo baseado em tradição milenar.",
      howItWorks: {
        step1: "Você responde perguntas sobre suas reações naturais",
        step2: "Nello organiza suas respostas e sugere seu temperamento primário e secundário",
        step3: "Você compreende como equilibrar suas tendências inatas",
      },
      whatItHelps: [
        "Reconhecer padrões de reação emocional",
        "Apoiar reflexões sobre gestão do estresse",
        "Compreender padrões de relacionamento",
        "Explorar caminhos de autocontrole",
        "Refletir sobre harmonia da energia vital",
      ],
      ctaText: "Começar Mapa",
    },
    en: {
      title: "Temperaments",
      subtitle: "Recognize natural tendencies in your temperament",
      about: {
        origin: "Theory created by Hippocrates (460-370 BC), the father of medicine, and deepened by Galen. It is one of the oldest ways to understand human personality.",
        objective: "Reveal your fundamental emotional nature — the 'internal engine' that influences your reactions, pace of life and way of relating.",
        methodology: "Classifies into 4 temperaments: Sanguine (expansive, sociable), Choleric (decisive, intense), Melancholic (deep, detailed) and Phlegmatic (calm, observant). Each person has a dominant and a secondary one.",
      },
      storytelling: `Since Hippocrates, humanity has sought to understand the four fundamental ways of being: sanguine, choleric, melancholic and phlegmatic.

This map reveals the foundation of your personality — and how to harmonize your natural tendencies with purpose and balance.`,
      benefits: [
        "Your dominant and secondary temperament",
        "How your nature influences decisions and relationships",
        "How to develop your strengths and harmonize your tendencies",
      ],
      audience: "Leaders, entrepreneurs, human development professionals and all who seek deep self-knowledge based on ancient tradition.",
      howItWorks: {
        step1: "You answer questions about your natural reactions",
        step2: "Nello organizes your responses and suggests your primary and secondary temperament",
        step3: "You understand how to balance your innate tendencies",
      },
      whatItHelps: [
        "Recognize emotional reaction patterns",
        "Support reflections on stress management",
        "Understand relationship patterns",
        "Explore paths of self-control",
        "Reflect on vital energy harmony",
      ],
      ctaText: "Start Map",
    },
  },
  linguagens_amor: {
    pt: {
      title: "Mapa dos Estilos de Conexão Afetiva",
      subtitle: "Como você tende a criar vínculo e se sentir compreendido",
      about: {
        origin: "Metodologia desenvolvida pelo Nello para mapeamento de estilos de conexão emocional e afetiva.",
        objective: "Explorar como você expressa e recebe afeto, apoiando reflexões sobre a qualidade dos seus relacionamentos pessoais e profissionais.",
        methodology: "Mapeia 5 estilos de conexão: Presença Ativa (tempo de qualidade), Expressão Verbal (reconhecimento), Cuidado Prático (ajuda), Gestos Simbólicos (presentes) e Conexão Física (contato). Identifica seu estilo primário e secundário.",
      },
      storytelling: `Cada pessoa se conecta emocionalmente de formas diferentes: através da presença, das palavras, do cuidado prático, de gestos simbólicos ou do contato físico.

Este mapa revela seu estilo primário de conexão afetiva — e como você pode cultivar relacionamentos mais profundos e autênticos.`,
      benefits: [
        "Seu estilo primário e secundário de conexão afetiva",
        "Como fortalecer seus relacionamentos",
        "Recomendações práticas para conexões mais profundas",
      ],
      audience: "Pessoas em relacionamentos, famílias, profissionais que trabalham com pessoas e todos que desejam cultivar conexões mais verdadeiras.",
      howItWorks: {
        step1: "Você responde perguntas sobre como se conecta emocionalmente",
        step2: "Nello organiza suas respostas e sugere seus estilos de conexão predominantes",
        step3: "Você explora caminhos para cultivar relacionamentos mais profundos",
      },
      whatItHelps: [
        "Compreender seu estilo de conexão emocional",
        "Apoiar reflexões sobre comunicação em relacionamentos",
        "Reconhecer as necessidades afetivas do parceiro",
        "Refletir sobre vínculos familiares e profissionais",
        "Explorar conexões mais autênticas e profundas",
      ],
      ctaText: "Começar Mapa",
    },
    en: {
      title: "Affection Connection Styles",
      subtitle: "How you tend to create bonds and feel understood",
      about: {
        origin: "Methodology developed by Nello for mapping emotional and affective connection styles.",
        objective: "Explore how you express and receive affection, supporting reflections on the quality of your personal and professional relationships.",
        methodology: "Maps 5 connection styles: Active Presence (quality time), Verbal Expression (recognition), Practical Care (help), Symbolic Gestures (gifts) and Physical Connection (contact). Identifies your primary and secondary style.",
      },
      storytelling: `Each person connects emotionally in different ways: through presence, words, practical care, symbolic gestures or physical contact.

This map reveals your primary affection connection style — and how you can cultivate deeper and more authentic relationships.`,
      benefits: [
        "Your primary and secondary connection style",
        "How to strengthen your relationships",
        "Practical recommendations for deeper connections",
      ],
      audience: "People in relationships, families, professionals who work with people and all who want to cultivate more genuine connections.",
      howItWorks: {
        step1: "You answer questions about how you emotionally connect",
        step2: "Nello organizes your responses and suggests your predominant connection styles",
        step3: "You explore paths to cultivate deeper relationships",
      },
      whatItHelps: [
        "Understand your emotional connection style",
        "Support reflections on communication in relationships",
        "Recognize your partner's affective needs",
        "Reflect on family and professional bonds",
        "Explore more authentic and deeper connections",
      ],
      ctaText: "Start Map",
    },
    'pt-pt': {
      title: "Mapa dos Estilos de Conexão Afetiva",
      subtitle: "Como tendes a criar vínculo e a sentir-te compreendido",
      about: {
        origin: "Metodologia desenvolvida pelo Nello para mapeamento de estilos de conexão emocional e afetiva.",
        objective: "Explorar como expressas e recebes afeto, apoiando reflexões sobre a qualidade dos teus relacionamentos pessoais e profissionais.",
        methodology: "Mapeia 5 estilos de conexão: Presença Ativa (tempo de qualidade), Expressão Verbal (reconhecimento), Cuidado Prático (ajuda), Gestos Simbólicos (presentes) e Conexão Física (contacto). Identifica o teu estilo primário e secundário.",
      },
      storytelling: `Cada pessoa conecta-se emocionalmente de formas diferentes: através da presença, das palavras, do cuidado prático, de gestos simbólicos ou do contacto físico.

Este mapa revela o teu estilo primário de conexão afetiva — e como podes cultivar relacionamentos mais profundos e autênticos.`,
      benefits: [
        "O teu estilo primário e secundário de conexão afetiva",
        "Como fortalecer os teus relacionamentos",
        "Recomendações práticas para conexões mais profundas",
      ],
      audience: "Pessoas em relacionamentos, famílias, profissionais que trabalham com pessoas e todos que desejam cultivar conexões mais verdadeiras.",
      howItWorks: {
        step1: "Respondes a perguntas sobre como te conectas emocionalmente",
        step2: "Nello organiza as tuas respostas e sugere os teus estilos de conexão predominantes",
        step3: "Exploras caminhos para cultivar relacionamentos mais profundos",
      },
      whatItHelps: [
        "Compreender o teu estilo de conexão emocional",
        "Apoiar reflexões sobre comunicação em relacionamentos",
        "Reconhecer as necessidades afetivas do parceiro",
        "Refletir sobre vínculos familiares e profissionais",
        "Explorar conexões mais autênticas e profundas",
      ],
      ctaText: "Começar Mapa",
    },
  },
  inteligencias_multiplas: {
    pt: {
      title: "Inteligências Múltiplas",
      subtitle: "Mapeie áreas de talento e formas diferentes de inteligência",
      about: {
        origin: "Teoria desenvolvida por Howard Gardner em 1983 (Harvard), revolucionando a visão de que inteligência não é única, mas múltipla.",
        objective: "Mapear suas 8 inteligências para explorar onde estão seus maiores talentos naturais e como desenvolvê-los estrategicamente.",
        methodology: "Avalia 8 tipos de inteligência: Linguística (palavras), Lógico-Matemática (raciocínio), Musical (ritmo e sons), Corporal-Cinestésica (movimento), Espacial (visualização), Interpessoal (pessoas), Intrapessoal (autoconhecimento) e Naturalista (natureza e padrões).",
      },
      storytelling: `Cada pessoa tem uma combinação única de talentos e formas de pensar. O mapa das Inteligências Múltiplas mostra quais áreas da sua mente têm mais energia — e como usá-las no trabalho, na vocação e na vida.`,
      benefits: [
        "Gráfico com suas 8 inteligências mapeadas",
        "Relatório com leitura reflexiva + plano de ação pessoal",
        "Recomendações personalizadas de desenvolvimento",
      ],
      audience: "Profissionais, educadores, artistas e empreendedores que desejam alinhar talento, propósito e potencial.",
      howItWorks: {
        step1: "Você responde perguntas sobre habilidades e preferências",
        step2: "Nello organiza suas respostas em um gráfico visual das 8 inteligências",
        step3: "Você explora como potencializar seus talentos naturais",
      },
      whatItHelps: [
        "Reconhecer seus talentos naturais",
        "Refletir sobre carreiras mais alinhadas",
        "Explorar habilidades específicas",
        "Compreender seu estilo de aprendizagem",
        "Organizar insights sobre seu potencial único",
      ],
      ctaText: "Começar Mapa",
    },
    en: {
      title: "Multiple Intelligences",
      subtitle: "Map talent areas and different forms of intelligence",
      about: {
        origin: "Theory developed by Howard Gardner in 1983 (Harvard), revolutionizing the view that intelligence is not unique, but multiple.",
        objective: "Map your 8 intelligences to explore where your greatest natural talents lie and how to develop them strategically.",
        methodology: "Evaluates 8 types of intelligence: Linguistic (words), Logical-Mathematical (reasoning), Musical (rhythm and sounds), Bodily-Kinesthetic (movement), Spatial (visualization), Interpersonal (people), Intrapersonal (self-knowledge) and Naturalistic (nature and patterns).",
      },
      storytelling: `Each person has a unique combination of talents and ways of thinking. The Multiple Intelligences map shows which areas of your mind have the most energy — and how to use them in work, vocation and life.`,
      benefits: [
        "Graph with your 8 intelligences mapped",
        "Report with reflective reading + personal action plan",
        "Personalized development recommendations",
      ],
      audience: "Professionals, educators, artists and entrepreneurs who want to align talent, purpose and potential.",
      howItWorks: {
        step1: "You answer questions about skills and preferences",
        step2: "Nello organizes your responses into a visual graph of the 8 intelligences",
        step3: "You explore how to enhance your natural talents",
      },
      whatItHelps: [
        "Recognize your natural talents",
        "Reflect on more aligned careers",
        "Explore specific skills",
        "Understand your learning style",
        "Organize insights about your unique potential",
      ],
      ctaText: "Start Map",
    },
  },
  eneagrama: {
    pt: {
      title: "Eneagrama",
      subtitle: "Um mapa simbólico de motivações e padrões emocionais",
      about: {
        acronym: "Do grego 'ennea' (nove) + 'gramma' (figura/desenho) = figura de nove pontas",
        origin: "Sistema com raízes antigas (tradição Sufi, séculos 14-15), modernizado por Oscar Ichazo e Claudio Naranjo nos anos 1960-70.",
        objective: "Revelar suas motivações inconscientes, medos centrais e caminhos de desenvolvimento pessoal.",
        methodology: "Organiza 9 padrões de personalidade (1-Perfeccionista, 2-Ajudador, 3-Realizador, 4-Romântico, 5-Observador, 6-Questionador, 7-Entusiasta, 8-Desafiador, 9-Pacificador), cada um com suas motivações, medos e caminhos de evolução únicos.",
      },
      storytelling: `Por trás de cada atitude, existe uma motivação. O Eneagrama revela o que move seu coração — as virtudes e desafios que moldam seu modo de amar, trabalhar e viver.

No Identity, ele é uma chave para a liberdade interior.`,
      benefits: [
        "Tendências predominantes entre os 9 perfis do Eneagrama",
        "Como transformar desafios em virtudes através do autoconhecimento",
        "Compreender padrões emocionais profundos que guiam suas ações",
        "Possíveis direções de desenvolvimento pessoal para seu perfil",
      ],
      audience: "Para quem busca compreender as motivações profundas e viver com mais equilíbrio interior.",
      howItWorks: {
        step1: "Você responde perguntas sobre motivações e medos",
        step2: "Nello organiza suas respostas e sugere seu perfil predominante e suas asas",
        step3: "Você recebe um mapa de desenvolvimento personalizado",
      },
      whatItHelps: [
        "Compreender suas motivações profundas",
        "Reconhecer padrões de autossabotagem",
        "Explorar caminhos de inteligência emocional",
        "Apoiar reflexões sobre relacionamentos significativos",
        "Refletir sobre seu caminho de evolução pessoal",
      ],
      ctaText: "Começar Mapa",
    },
    en: {
      title: "Enneagram",
      subtitle: "A symbolic map of motivations and emotional patterns",
      about: {
        acronym: "From Greek 'ennea' (nine) + 'gramma' (figure/drawing) = nine-pointed figure",
        origin: "System with ancient roots (Sufi tradition, 14th-15th centuries), modernized by Oscar Ichazo and Claudio Naranjo in the 1960s-70s.",
        objective: "Reveal your unconscious motivations, core fears and paths for personal development.",
        methodology: "Organizes 9 personality patterns (1-Perfectionist, 2-Helper, 3-Achiever, 4-Romantic, 5-Observer, 6-Questioner, 7-Enthusiast, 8-Challenger, 9-Peacemaker), each with their unique motivations, fears and evolution paths.",
      },
      storytelling: `Behind every attitude, there is a motivation. The Enneagram reveals what moves your heart — the virtues and challenges that shape how you love, work and live.

In Identity, it is a key to inner freedom.`,
      benefits: [
        "Predominant tendencies among the 9 Enneagram profiles",
        "How to transform challenges into virtues through self-knowledge",
        "Understand deep emotional patterns that guide your actions",
        "Possible personal development directions for your profile",
      ],
      audience: "For those who seek to understand deep motivations and live with more inner balance.",
      howItWorks: {
        step1: "You answer questions about motivations and fears",
        step2: "Nello organizes your responses and suggests your predominant profile and wings",
        step3: "You receive a personalized development map",
      },
      whatItHelps: [
        "Understand your deep motivations",
        "Recognize self-sabotage patterns",
        "Explore paths of emotional intelligence",
        "Support reflections on meaningful relationships",
        "Reflect on your personal evolution path",
      ],
      ctaText: "Start Map",
    },
  },
  mbti: {
    pt: {
      title: "Nello 16 Personality Map",
      subtitle: "Explore tendências do seu perfil de personalidade em 4 letras",
      about: {
        acronym: "As 4 letras representam: E/I (Extroversão/Introversão), S/N (Sensação/Intuição), T/F (Pensamento/Sentimento), J/P (Julgamento/Percepção)",
        origin: "Baseado nas teorias de Carl Jung (1921) e desenvolvido por Katharine Briggs e Isabel Myers. Adaptado pelo Nello para uma versão moderna e acessível.",
        objective: "Explorar tendências predominantes do seu perfil entre 16 padrões possíveis, mostrando como você percebe o mundo e toma decisões.",
        methodology: "Avalia 4 dimensões: de onde vem sua energia (E/I), como você coleta informações (S/N), como você toma decisões (T/F) e como você organiza sua vida (J/P).",
      },
      storytelling: `O Nello 16 Personality Map é um sistema exclusivo do Identity que traduz as teorias de Carl Jung em um modelo moderno de 16 perfis de personalidade.

O Nello organiza suas respostas e sugere tendências predominantes dentro deste modelo interpretativo (não clínico).

Em poucos minutos, você explora seus pontos fortes naturais, seus desafios emocionais, suas tendências de comportamento, como você reage sob pressão, o tipo de ambiente em que você evolui e como apoiar reflexões sobre comunicação, carreira e relacionamentos.`,
      benefits: [
        "Seu perfil de personalidade em 4 letras (ex: INFP, ESTJ)",
        "Como seu comportamento molda suas relações e decisões",
        "Mapa visual com forças, desafios e orientações práticas",
      ],
      audience: "Quem busca autoconhecimento profundo e clareza sobre como pensa, decide e se relaciona.",
      howItWorks: {
        step1: "Você responde perguntas sobre comportamento e preferências",
        step2: "Nello organiza suas respostas e sugere seu perfil entre os 16 padrões",
        step3: "Você recebe seu perfil completo com forças, desafios e aplicações práticas",
      },
      whatItHelps: [
        "Compreender como você se comunica",
        "Reconhecer onde você trava",
        "Explorar como você se desenvolve",
        "Refletir sobre que ambientes te drenam",
        "Organizar sua vida em direção ao que funciona para você",
      ],
      ctaText: "Começar Mapa",
    },
    en: {
      title: "Nello 16 Personality Map",
      subtitle: "Explore tendencies in your personality profile in 4 letters",
      about: {
        acronym: "The 4 letters represent: E/I (Extraversion/Introversion), S/N (Sensing/Intuition), T/F (Thinking/Feeling), J/P (Judging/Perceiving)",
        origin: "Based on Carl Jung's theories (1921) and developed by Katharine Briggs and Isabel Myers. Adapted by Nello for a modern and accessible version.",
        objective: "Explore predominant tendencies in your profile among 16 possible patterns, showing how you perceive the world and make decisions.",
        methodology: "Evaluates 4 dimensions: where your energy comes from (E/I), how you gather information (S/N), how you make decisions (T/F) and how you organize your life (J/P).",
      },
      storytelling: `The Nello 16 Personality Map is an Identity exclusive system inspired by Carl Jung's psychological type theory and redesigned for the modern world.

Nello organizes your responses and suggests predominant tendencies within this interpretive model (non-clinical).

In just a few minutes, you'll explore your natural strengths, your emotional challenges, your behavioral tendencies, how you react under pressure, your ideal environment for growth, and how to support reflections on communication, career and relationships.`,
      benefits: [
        "Your 4-letter personality profile (e.g., INFP, ESTJ)",
        "How your behavior shapes your relationships and decisions",
        "Visual map with strengths, challenges and practical guidance",
      ],
      audience: "Those who seek deep self-knowledge and clarity on how they think, decide and relate.",
      howItWorks: {
        step1: "You answer questions about behavior and preferences",
        step2: "Nello organizes your responses and suggests your profile among the 16 patterns",
        step3: "You receive your complete profile with strengths, challenges and practical applications",
      },
      whatItHelps: [
        "Understand how you communicate",
        "Recognize where you get stuck",
        "Explore how you develop",
        "Reflect on which environments drain you",
        "Align your life with what truly energizes you",
      ],
      ctaText: "Start Map",
    },
    'pt-pt': {
      title: "Mapa das 16 Personalidades Nello",
      subtitle: "Explora tendências do teu perfil de personalidade em 4 letras",
      about: {
        acronym: "As 4 letras representam: E/I (Extroversão/Introversão), S/N (Sensação/Intuição), T/F (Pensamento/Sentimento), J/P (Julgamento/Perceção)",
        origin: "Baseado nas teorias de Carl Jung (1921) e desenvolvido por Katharine Briggs e Isabel Myers. Adaptado pelo Nello para uma versão moderna e acessível.",
        objective: "Explorar tendências predominantes do teu perfil entre 16 padrões possíveis, mostrando como percebes o mundo e tomas decisões.",
        methodology: "Avalia 4 dimensões: de onde vem a tua energia (E/I), como recolhes informações (S/N), como tomas decisões (T/F) e como organizas a tua vida (J/P).",
      },
      storytelling: `O Mapa das 16 Personalidades Nello é um sistema exclusivo do Identity que transforma as teorias de Carl Jung num modelo moderno composto por 16 perfis de personalidade.

O Nello organiza as tuas respostas e sugere tendências predominantes dentro deste modelo interpretativo (não clínico).

Em poucos minutos irás explorar os teus pontos fortes naturais, os desafios emocionais que mais aparecem, as tuas tendências comportamentais, a forma como reages sob pressão, o tipo de ambiente onde mais te desenvolves e como apoiar reflexões sobre comunicação, carreira e relações.`,
      benefits: [
        "O teu perfil de personalidade em 4 letras (ex: INFP, ESTJ)",
        "Como o teu comportamento influencia relações e decisões",
        "Mapa visual com forças, desafios e orientações práticas",
      ],
      audience: "Quem procura autoconhecimento profundo e clareza sobre como pensa, decide e se relaciona.",
      howItWorks: {
        step1: "Respondes a perguntas sobre comportamento e preferências",
        step2: "Nello organiza as tuas respostas e sugere o teu perfil entre os 16 padrões",
        step3: "Recebes o teu perfil completo com forças, desafios e aplicações práticas",
      },
      whatItHelps: [
        "Compreender como comunicas",
        "Reconhecer onde sentes bloqueios",
        "Explorar como te desenvolves",
        "Refletir sobre que ambientes te desgastam",
        "Alinhar a tua vida ao que realmente funciona contigo",
      ],
      ctaText: "Começar Mapa",
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
