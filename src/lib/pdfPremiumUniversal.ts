import jsPDF from "jspdf";

/**
 * NELLO ONE - Premium Universal PDF Generator
 * 10-Block Structure for All Tests
 */

export interface TestResult {
  testType: string;
  testName: string;
  primaryResult: {
    name: string;
    emoji: string;
    score: number;
    percentage?: number;
  };
  secondaryResults?: Array<{
    name: string;
    emoji: string;
    score: number;
    percentage?: number;
  }>;
  allScores: Record<string, number>;
  ranking?: Array<{ key: string; score: number; percentage?: number }>;
}

export interface PDFOptions {
  language?: 'pt' | 'pt-pt' | 'en';
  userName: string;
}

// ==================== COLORS ====================
const COLORS = {
  primary: { r: 31, g: 46, b: 75 },      // Miguel Deep Blue
  accent: { r: 205, g: 174, b: 103 },    // Gold
  background: { r: 252, g: 252, b: 252 },
  text: { r: 50, g: 50, b: 50 },
  muted: { r: 120, g: 120, b: 120 },
  success: { r: 16, g: 185, b: 129 },
  warning: { r: 245, g: 158, b: 11 },
  danger: { r: 244, g: 63, b: 94 },
  light: { r: 240, g: 240, b: 240 },
};

const TEST_COLORS: Record<string, { r: number; g: number; b: number }> = {
  arquetipos: { r: 139, g: 92, b: 246 },
  disc: { r: 59, g: 130, b: 246 },
  eneagrama: { r: 236, g: 72, b: 153 },
  mbti: { r: 16, g: 185, b: 129 },
  linguagens_amor: { r: 244, g: 63, b: 94 },
  temperamentos: { r: 245, g: 158, b: 11 },
  inteligencias_multiplas: { r: 52, g: 211, b: 153 },
};

// ==================== TRANSLATIONS ====================
const getTranslations = (lang: 'pt' | 'pt-pt' | 'en') => {
  const translations = {
    pt: {
      // Cover
      coverQuotes: {
        arquetipos: "Sua essência fala através de padrões ancestrais.",
        disc: "Compreender seu ritmo é o primeiro passo para liderar a si mesmo.",
        eneagrama: "Conhecer suas motivações profundas transforma sua jornada.",
        mbti: "Cada mente é um universo — descubra o seu.",
        linguagens_amor: "A conexão se expressa de formas únicas em cada coração.",
        temperamentos: "Seu temperamento é a base de todas as suas reações.",
        inteligencias_multiplas: "A mente revela-se quando entendemos como ela opera.",
      },
      
      // Block 1 - Introduction
      block1Title: "O que este teste revela",
      block1Intro: "Este relatório revela como sua essência opera neste aspecto da vida. Os padrões apresentados aqui não são rótulos. São pontos de consciência para ampliar sua clareza e evoluir com leveza.",
      
      // Block 2 - Primary Result
      block2Title: "Seu Resultado Principal",
      dailyLife: "Como se expressa no dia a dia",
      strengths: "Forças",
      vulnerabilities: "Fragilidades",
      shadow: "Sombra",
      light: "Luz",
      emotionalImpact: "Impacto emocional",
      decisionImpact: "Impacto nas decisões",
      
      // Block 3 - Secondary Results
      block3Title: "Perfil Complementar",
      secondaryTitle: "Resultados Secundários",
      
      // Block 4 - Visual Map
      block4Title: "Mapa Visual",
      
      // Block 5 - Patterns (Miguel explains)
      block5Title: "Padrões e Tendências",
      miguelIntro: "Eu sou Miguel, seu guia. Aqui mostro, sem julgamentos, o que sua energia tende a fazer quando está em equilíbrio e quando está em tensão.",
      dominantPattern: "Padrão dominante",
      emotionalMovement: "Movimento emocional interno",
      decisionBias: "Vieses de decisão",
      stressReaction: "Forma de reagir sob estresse",
      lightActivator: "O que ativa sua luz",
      shadowActivator: "O que ativa sua sombra",
      observeThis: "O que deve ser observado",
      
      // Block 6 - Immediate Evolution (24h)
      block6Title: "Pontos de Evolução Imediatos",
      block6Subtitle: "3 ações para as próximas 24 horas",
      activateStrength: "Ative sua força principal",
      adjustPattern: "Ajuste um padrão que limita",
      expandConsciousness: "Faça algo hoje que expanda sua consciência",
      
      // Block 7 - Life Dimensions
      block7Title: "Impacto nas Dimensões da Vida",
      workProductivity: "Trabalho / Produtividade",
      relationships: "Relacionamentos / Família",
      innerLife: "Vida Interior / Espiritualidade / Emoções",
      
      // Block 8 - 7-Day Plan
      block8Title: "Plano de Evolução — 7 Dias",
      block8Subtitle: "Microtarefas diárias de 5 a 10 minutos",
      day: "Dia",
      
      // Block 9 - Self-Exam Question
      block9Title: "Pergunta de Autoexame",
      selfExamQuestions: {
        arquetipos: "O que sua essência está te pedindo há anos que você ainda não ouviu?",
        disc: "Que movimento simples pode equilibrar sua energia dominante hoje?",
        eneagrama: "Qual padrão você repete esperando resultados diferentes?",
        mbti: "O que sua mente sabe que seu coração ainda resiste?",
        linguagens_amor: "Qual é o cuidado que você espera que alguém te dê, mas que você mesmo pode oferecer?",
        temperamentos: "Como seu temperamento te serve e como te limita?",
        inteligencias_multiplas: "Onde sua mente brilha que você não está usando no dia a dia?",
      },
      
      // Block 10 - Final Phrase
      block10Title: "Mensagem Final",
      finalPhrase: "Clareza é o primeiro passo para a transformação. Caminho com você.",
      signature: "— Miguel, seu guia no NELLO ONE",
      
      // Common
      footer: "NELLO ONE — Clareza gera poder.",
      score: "Pontuação",
      percentage: "Percentual",
    },
    'pt-pt': {
      // Cover
      coverQuotes: {
        arquetipos: "A tua essência fala através de padrões ancestrais.",
        disc: "Compreender o teu ritmo é o primeiro passo para te liderares.",
        eneagrama: "Conhecer as tuas motivações profundas transforma a tua jornada.",
        mbti: "Cada mente é um universo — descobre o teu.",
        linguagens_amor: "A conexão expressa-se de formas únicas em cada coração.",
        temperamentos: "O teu temperamento é a base de todas as tuas reações.",
        inteligencias_multiplas: "A mente revela-se quando entendemos como ela opera.",
      },
      
      block1Title: "O que este teste revela",
      block1Intro: "Este relatório revela como a tua essência opera neste aspecto da vida. Os padrões apresentados aqui não são rótulos. São pontos de consciência para ampliar a tua clareza e evoluir com leveza.",
      
      block2Title: "O Teu Resultado Principal",
      dailyLife: "Como se expressa no dia a dia",
      strengths: "Forças",
      vulnerabilities: "Fragilidades",
      shadow: "Sombra",
      light: "Luz",
      emotionalImpact: "Impacto emocional",
      decisionImpact: "Impacto nas decisões",
      
      block3Title: "Perfil Complementar",
      secondaryTitle: "Resultados Secundários",
      
      block4Title: "Mapa Visual",
      
      block5Title: "Padrões e Tendências",
      miguelIntro: "Eu sou o Miguel, o teu guia. Aqui mostro, sem julgamentos, o que a tua energia tende a fazer quando está em equilíbrio e quando está em tensão.",
      dominantPattern: "Padrão dominante",
      emotionalMovement: "Movimento emocional interno",
      decisionBias: "Vieses de decisão",
      stressReaction: "Forma de reagir sob stress",
      lightActivator: "O que ativa a tua luz",
      shadowActivator: "O que ativa a tua sombra",
      observeThis: "O que deve ser observado",
      
      block6Title: "Pontos de Evolução Imediatos",
      block6Subtitle: "3 ações para as próximas 24 horas",
      activateStrength: "Ativa a tua força principal",
      adjustPattern: "Ajusta um padrão que limita",
      expandConsciousness: "Faz algo hoje que expanda a tua consciência",
      
      block7Title: "Impacto nas Dimensões da Vida",
      workProductivity: "Trabalho / Produtividade",
      relationships: "Relacionamentos / Família",
      innerLife: "Vida Interior / Espiritualidade / Emoções",
      
      block8Title: "Plano de Evolução — 7 Dias",
      block8Subtitle: "Microtarefas diárias de 5 a 10 minutos",
      day: "Dia",
      
      block9Title: "Pergunta de Autoexame",
      selfExamQuestions: {
        arquetipos: "O que a tua essência te pede há anos que ainda não ouviste?",
        disc: "Que movimento simples pode equilibrar a tua energia dominante hoje?",
        eneagrama: "Que padrão repetes esperando resultados diferentes?",
        mbti: "O que a tua mente sabe que o teu coração ainda resiste?",
        linguagens_amor: "Qual é o cuidado que esperas que alguém te dê, mas que tu próprio podes oferecer?",
        temperamentos: "Como o teu temperamento te serve e como te limita?",
        inteligencias_multiplas: "Onde a tua mente brilha que não estás a usar no dia a dia?",
      },
      
      block10Title: "Mensagem Final",
      finalPhrase: "Clareza é o primeiro passo para a transformação. Caminho contigo.",
      signature: "— Miguel, o teu guia no NELLO ONE",
      
      footer: "NELLO ONE — Clareza gera poder.",
      score: "Pontuação",
      percentage: "Percentual",
    },
    en: {
      coverQuotes: {
        arquetipos: "Your essence speaks through ancestral patterns.",
        disc: "Understanding your rhythm is the first step to leading yourself.",
        eneagrama: "Knowing your deep motivations transforms your journey.",
        mbti: "Every mind is a universe — discover yours.",
        linguagens_amor: "Connection expresses itself uniquely in every heart.",
        temperamentos: "Your temperament is the foundation of all your reactions.",
        inteligencias_multiplas: "The mind reveals itself when we understand how it operates.",
      },
      
      block1Title: "What This Test Reveals",
      block1Intro: "This report reveals how your essence operates in this aspect of life. The patterns presented here are not labels. They are points of awareness to expand your clarity and evolve with lightness.",
      
      block2Title: "Your Primary Result",
      dailyLife: "How it expresses in daily life",
      strengths: "Strengths",
      vulnerabilities: "Vulnerabilities",
      shadow: "Shadow",
      light: "Light",
      emotionalImpact: "Emotional impact",
      decisionImpact: "Impact on decisions",
      
      block3Title: "Complementary Profile",
      secondaryTitle: "Secondary Results",
      
      block4Title: "Visual Map",
      
      block5Title: "Patterns and Tendencies",
      miguelIntro: "I am Miguel, your guide. Here I show, without judgment, what your energy tends to do when in balance and when in tension.",
      dominantPattern: "Dominant pattern",
      emotionalMovement: "Internal emotional movement",
      decisionBias: "Decision biases",
      stressReaction: "Stress reaction",
      lightActivator: "What activates your light",
      shadowActivator: "What activates your shadow",
      observeThis: "What should be observed",
      
      block6Title: "Immediate Evolution Points",
      block6Subtitle: "3 actions for the next 24 hours",
      activateStrength: "Activate your main strength",
      adjustPattern: "Adjust a limiting pattern",
      expandConsciousness: "Do something today that expands your consciousness",
      
      block7Title: "Impact on Life Dimensions",
      workProductivity: "Work / Productivity",
      relationships: "Relationships / Family",
      innerLife: "Inner Life / Spirituality / Emotions",
      
      block8Title: "Evolution Plan — 7 Days",
      block8Subtitle: "Daily micro-tasks of 5 to 10 minutes",
      day: "Day",
      
      block9Title: "Self-Exam Question",
      selfExamQuestions: {
        arquetipos: "What has your essence been asking you for years that you still haven't heard?",
        disc: "What simple movement can balance your dominant energy today?",
        eneagrama: "What pattern do you repeat expecting different results?",
        mbti: "What does your mind know that your heart still resists?",
        linguagens_amor: "What care are you waiting for someone to give you, but that you can offer yourself?",
        temperamentos: "How does your temperament serve you and how does it limit you?",
        inteligencias_multiplas: "Where does your mind shine that you're not using in daily life?",
      },
      
      block10Title: "Final Message",
      finalPhrase: "Clarity is the first step to transformation. I walk with you.",
      signature: "— Miguel, your guide at NELLO ONE",
      
      footer: "NELLO ONE — Clarity generates power.",
      score: "Score",
      percentage: "Percentage",
    }
  };
  
  return translations[lang] || translations.pt;
};

// ==================== TEST-SPECIFIC CONTENT ====================
const getTestContent = (testType: string, primaryResultKey: string, lang: 'pt' | 'pt-pt' | 'en') => {
  const content: Record<string, Record<string, any>> = {
    arquetipos: {
      pt: {
        testName: "Arquétipos com Propósito",
        dailyLife: "Você naturalmente se expressa através de padrões simbólicos que influenciam suas escolhas, relacionamentos e forma de ver o mundo. Este arquétipo é seu modo de operar quando está em seu melhor.",
        shadow: "A sombra deste arquétipo aparece quando você nega sua natureza verdadeira ou quando busca validação externa excessivamente.",
        light: "Sua luz brilha quando você abraça completamente sua essência e age a partir de seu centro, sem medo de ser autêntico.",
        emotionalImpact: "Suas emoções são profundamente influenciadas pela necessidade de expressar esta energia arquetípica. Quando bloqueada, pode gerar frustração.",
        decisionImpact: "Suas decisões tendem a ser guiadas pelos valores centrais deste arquétipo — mesmo quando você não está consciente disso.",
        workImpact: "No trabalho, você se destaca quando pode expressar sua essência arquetípica. Ambientes que a reprimem drenam sua energia.",
        relationshipImpact: "Nos relacionamentos, você busca pessoas que ressoem com sua energia ou que complementem seu arquétipo.",
        innerLifeImpact: "Sua vida interior é rica em simbolismos e significados. A meditação e reflexão ajudam a integrar luz e sombra.",
        day1: "Observe hoje quantas vezes você age a partir do seu arquétipo dominante.",
        day2: "Identifique uma situação onde você negou sua essência para agradar outros.",
        day3: "Escolha uma ação pequena que honre seu arquétipo principal.",
        day4: "Reflita sobre como seu arquétipo influencia seus relacionamentos.",
        day5: "Pratique expressar sua essência autenticamente em uma conversa.",
        day6: "Observe a sombra do seu arquétipo: quando ela aparece?",
        day7: "Escreva uma afirmação que integre sua luz e sua sombra.",
      },
      'pt-pt': {
        testName: "Arquétipos com Propósito",
        dailyLife: "Tu naturalmente expressa-te através de padrões simbólicos que influenciam as tuas escolhas, relacionamentos e forma de ver o mundo.",
        shadow: "A sombra deste arquétipo aparece quando negas a tua natureza verdadeira ou quando procuras validação externa excessivamente.",
        light: "A tua luz brilha quando abraças completamente a tua essência e ages a partir do teu centro.",
        emotionalImpact: "As tuas emoções são profundamente influenciadas pela necessidade de expressar esta energia arquetípica.",
        decisionImpact: "As tuas decisões tendem a ser guiadas pelos valores centrais deste arquétipo.",
        workImpact: "No trabalho, destacas-te quando podes expressar a tua essência arquetípica.",
        relationshipImpact: "Nos relacionamentos, procuras pessoas que ressoem com a tua energia.",
        innerLifeImpact: "A tua vida interior é rica em simbolismos e significados.",
        day1: "Observa hoje quantas vezes ages a partir do teu arquétipo dominante.",
        day2: "Identifica uma situação onde negaste a tua essência para agradar outros.",
        day3: "Escolhe uma ação pequena que honre o teu arquétipo principal.",
        day4: "Reflecte sobre como o teu arquétipo influencia os teus relacionamentos.",
        day5: "Pratica expressar a tua essência autenticamente numa conversa.",
        day6: "Observa a sombra do teu arquétipo: quando ela aparece?",
        day7: "Escreve uma afirmação que integre a tua luz e a tua sombra.",
      },
      en: {
        testName: "Archetypes with Purpose",
        dailyLife: "You naturally express yourself through symbolic patterns that influence your choices, relationships, and worldview.",
        shadow: "The shadow of this archetype appears when you deny your true nature or seek excessive external validation.",
        light: "Your light shines when you fully embrace your essence and act from your center.",
        emotionalImpact: "Your emotions are deeply influenced by the need to express this archetypal energy.",
        decisionImpact: "Your decisions tend to be guided by this archetype's core values.",
        workImpact: "At work, you excel when you can express your archetypal essence.",
        relationshipImpact: "In relationships, you seek people who resonate with or complement your energy.",
        innerLifeImpact: "Your inner life is rich in symbolism and meaning.",
        day1: "Observe today how often you act from your dominant archetype.",
        day2: "Identify a situation where you denied your essence to please others.",
        day3: "Choose one small action that honors your main archetype.",
        day4: "Reflect on how your archetype influences your relationships.",
        day5: "Practice expressing your essence authentically in a conversation.",
        day6: "Observe your archetype's shadow: when does it appear?",
        day7: "Write an affirmation that integrates your light and shadow.",
      }
    },
    disc: {
      pt: {
        testName: "DISC",
        dailyLife: "Seu perfil DISC revela seu estilo natural de comportamento — como você toma decisões, se comunica e reage a desafios.",
        shadow: "A sombra do seu perfil aparece quando você exagera suas tendências naturais sob pressão.",
        light: "Sua luz brilha quando você equilibra suas tendências com consciência e flexibilidade.",
        emotionalImpact: "Suas emoções são moldadas pelo seu estilo comportamental. Reconhecer isso é o primeiro passo para a inteligência emocional.",
        decisionImpact: "Você tende a decidir de acordo com seu perfil dominante — rápido ou ponderado, lógico ou relacional.",
        workImpact: "No trabalho, seu perfil DISC influencia como você lidera, colabora e resolve problemas.",
        relationshipImpact: "Nos relacionamentos, compreender seu perfil ajuda a melhorar a comunicação com pessoas de estilos diferentes.",
        innerLifeImpact: "Sua vida interior se beneficia quando você reconhece que seu comportamento tem padrões — e que você pode transcendê-los.",
        day1: "Identifique seu comportamento automático em uma situação de pressão.",
        day2: "Observe como você se comunica com alguém de perfil oposto ao seu.",
        day3: "Pratique flexibilizar seu estilo em uma conversa.",
        day4: "Reflita: o que você ganha e perde com seu perfil dominante?",
        day5: "Experimente agir a partir de um perfil secundário conscientemente.",
        day6: "Observe quando seu perfil dominante te atrapalha.",
        day7: "Defina uma intenção de equilíbrio para a semana seguinte.",
      },
      'pt-pt': {
        testName: "DISC",
        dailyLife: "O teu perfil DISC revela o teu estilo natural de comportamento.",
        shadow: "A sombra do teu perfil aparece quando exageras as tuas tendências naturais sob pressão.",
        light: "A tua luz brilha quando equilibras as tuas tendências com consciência e flexibilidade.",
        emotionalImpact: "As tuas emoções são moldadas pelo teu estilo comportamental.",
        decisionImpact: "Tendes a decidir de acordo com o teu perfil dominante.",
        workImpact: "No trabalho, o teu perfil DISC influencia como lideras e colaboras.",
        relationshipImpact: "Nos relacionamentos, compreender o teu perfil ajuda na comunicação.",
        innerLifeImpact: "A tua vida interior beneficia-se quando reconheces os teus padrões comportamentais.",
        day1: "Identifica o teu comportamento automático numa situação de pressão.",
        day2: "Observa como te comunicas com alguém de perfil oposto.",
        day3: "Pratica flexibilizar o teu estilo numa conversa.",
        day4: "Reflecte: o que ganhas e perdes com o teu perfil dominante?",
        day5: "Experimenta agir a partir de um perfil secundário conscientemente.",
        day6: "Observa quando o teu perfil dominante te atrapalha.",
        day7: "Define uma intenção de equilíbrio para a semana seguinte.",
      },
      en: {
        testName: "DISC",
        dailyLife: "Your DISC profile reveals your natural behavioral style — how you make decisions, communicate, and respond to challenges.",
        shadow: "Your profile's shadow appears when you exaggerate your natural tendencies under pressure.",
        light: "Your light shines when you balance your tendencies with awareness and flexibility.",
        emotionalImpact: "Your emotions are shaped by your behavioral style.",
        decisionImpact: "You tend to decide according to your dominant profile.",
        workImpact: "At work, your DISC profile influences how you lead and collaborate.",
        relationshipImpact: "In relationships, understanding your profile improves communication.",
        innerLifeImpact: "Your inner life benefits when you recognize your behavioral patterns.",
        day1: "Identify your automatic behavior in a pressure situation.",
        day2: "Observe how you communicate with someone of opposite profile.",
        day3: "Practice flexing your style in a conversation.",
        day4: "Reflect: what do you gain and lose with your dominant profile?",
        day5: "Try acting from a secondary profile consciously.",
        day6: "Notice when your dominant profile holds you back.",
        day7: "Set a balance intention for the following week.",
      }
    },
    eneagrama: {
      pt: {
        testName: "Eneagrama",
        dailyLife: "Seu tipo de Eneagrama revela sua motivação central — o motor inconsciente que guia suas ações, medos e desejos mais profundos.",
        shadow: "A sombra do seu tipo aparece quando você opera no automático, repetindo padrões que não te servem mais.",
        light: "Sua luz brilha quando você integra as qualidades de sua asa e conecta-se com seu centro de crescimento.",
        emotionalImpact: "Suas emoções são profundamente conectadas à sua motivação central. Reconhecer isso é libertador.",
        decisionImpact: "Você tende a decidir baseado em evitar seu medo central ou buscar seu desejo mais profundo.",
        workImpact: "No trabalho, seu tipo influencia como você lida com autoridade, prazos e colaboração.",
        relationshipImpact: "Nos relacionamentos, cada tipo tem padrões específicos de conexão e conflito.",
        innerLifeImpact: "Sua vida interior se transforma quando você reconhece que seu tipo não é quem você é — é uma lente.",
        day1: "Observe quando sua motivação central guia suas ações hoje.",
        day2: "Identifique seu medo central: quando ele aparece?",
        day3: "Pratique uma qualidade do seu tipo de crescimento.",
        day4: "Observe padrões de relacionamento típicos do seu tipo.",
        day5: "Experimente agir contra seu padrão automático conscientemente.",
        day6: "Reflita: como seu tipo te serviu e te limitou?",
        day7: "Escreva uma intenção de integração para o próximo mês.",
      },
      'pt-pt': {
        testName: "Eneagrama",
        dailyLife: "O teu tipo de Eneagrama revela a tua motivação central.",
        shadow: "A sombra do teu tipo aparece quando operas no automático.",
        light: "A tua luz brilha quando integras as qualidades da tua asa.",
        emotionalImpact: "As tuas emoções estão profundamente conectadas à tua motivação central.",
        decisionImpact: "Tendes a decidir baseado em evitar o teu medo central.",
        workImpact: "No trabalho, o teu tipo influencia como lidas com autoridade e prazos.",
        relationshipImpact: "Nos relacionamentos, cada tipo tem padrões específicos.",
        innerLifeImpact: "A tua vida interior transforma-se quando reconheces que o teu tipo é uma lente.",
        day1: "Observa quando a tua motivação central guia as tuas ações hoje.",
        day2: "Identifica o teu medo central: quando ele aparece?",
        day3: "Pratica uma qualidade do teu tipo de crescimento.",
        day4: "Observa padrões de relacionamento típicos do teu tipo.",
        day5: "Experimenta agir contra o teu padrão automático.",
        day6: "Reflecte: como o teu tipo te serviu e te limitou?",
        day7: "Escreve uma intenção de integração para o próximo mês.",
      },
      en: {
        testName: "Enneagram",
        dailyLife: "Your Enneagram type reveals your core motivation — the unconscious driver behind your actions, fears, and deepest desires.",
        shadow: "Your type's shadow appears when you operate on autopilot.",
        light: "Your light shines when you integrate your wing's qualities.",
        emotionalImpact: "Your emotions are deeply connected to your core motivation.",
        decisionImpact: "You tend to decide based on avoiding your core fear.",
        workImpact: "At work, your type influences how you handle authority and deadlines.",
        relationshipImpact: "In relationships, each type has specific patterns.",
        innerLifeImpact: "Your inner life transforms when you recognize your type is a lens.",
        day1: "Observe when your core motivation guides your actions today.",
        day2: "Identify your core fear: when does it appear?",
        day3: "Practice a quality from your growth type.",
        day4: "Observe relationship patterns typical of your type.",
        day5: "Try acting against your automatic pattern consciously.",
        day6: "Reflect: how has your type served and limited you?",
        day7: "Write an integration intention for the next month.",
      }
    },
    mbti: {
      pt: {
        testName: "Nello 16 Personality Map",
        dailyLife: "Seu tipo de personalidade revela como você processa informações, toma decisões e interage com o mundo.",
        shadow: "A sombra do seu tipo aparece quando você ignora suas funções inferiores.",
        light: "Sua luz brilha quando você integra todas as suas funções cognitivas.",
        emotionalImpact: "Suas emoções são processadas através do seu stack funcional.",
        decisionImpact: "Você decide através de uma combinação única de percepção e julgamento.",
        workImpact: "No trabalho, seu tipo influencia seu estilo de liderança e colaboração.",
        relationshipImpact: "Nos relacionamentos, cada tipo tem formas específicas de expressar amor e receber afeto.",
        innerLifeImpact: "Sua vida interior é rica quando você honra tanto sua função dominante quanto desenvolve as inferiores.",
        day1: "Observe sua função dominante em ação hoje.",
        day2: "Identifique um momento onde sua função inferior apareceu.",
        day3: "Pratique usar conscientemente uma função que você negligencia.",
        day4: "Reflita sobre como você processa estresse.",
        day5: "Observe suas preferências de comunicação.",
        day6: "Experimente tomar uma decisão usando sua função oposta.",
        day7: "Escreva sobre como equilibrar suas quatro funções.",
      },
      'pt-pt': {
        testName: "Nello 16 Personality Map",
        dailyLife: "O teu tipo de personalidade revela como processas informações e tomas decisões.",
        shadow: "A sombra do teu tipo aparece quando ignoras as tuas funções inferiores.",
        light: "A tua luz brilha quando integras todas as tuas funções cognitivas.",
        emotionalImpact: "As tuas emoções são processadas através do teu stack funcional.",
        decisionImpact: "Decides através de uma combinação única de percepção e julgamento.",
        workImpact: "No trabalho, o teu tipo influencia o teu estilo de liderança.",
        relationshipImpact: "Nos relacionamentos, cada tipo tem formas específicas de expressar amor.",
        innerLifeImpact: "A tua vida interior é rica quando honras a tua função dominante.",
        day1: "Observa a tua função dominante em ação hoje.",
        day2: "Identifica um momento onde a tua função inferior apareceu.",
        day3: "Pratica usar conscientemente uma função que negligencias.",
        day4: "Reflecte sobre como processas stress.",
        day5: "Observa as tuas preferências de comunicação.",
        day6: "Experimenta tomar uma decisão usando a tua função oposta.",
        day7: "Escreve sobre como equilibrar as tuas quatro funções.",
      },
      en: {
        testName: "Nello 16 Personality Map",
        dailyLife: "Your personality type reveals how you process information, make decisions, and interact with the world.",
        shadow: "Your type's shadow appears when you ignore your inferior functions.",
        light: "Your light shines when you integrate all your cognitive functions.",
        emotionalImpact: "Your emotions are processed through your functional stack.",
        decisionImpact: "You decide through a unique combination of perception and judgment.",
        workImpact: "At work, your type influences your leadership style.",
        relationshipImpact: "In relationships, each type has specific ways of expressing love.",
        innerLifeImpact: "Your inner life is rich when you honor your dominant function.",
        day1: "Observe your dominant function in action today.",
        day2: "Identify a moment when your inferior function appeared.",
        day3: "Practice consciously using a function you neglect.",
        day4: "Reflect on how you process stress.",
        day5: "Observe your communication preferences.",
        day6: "Try making a decision using your opposite function.",
        day7: "Write about balancing your four functions.",
      }
    },
    linguagens_amor: {
      pt: {
        testName: "Estilos de Conexão Afetiva",
        dailyLife: "Seu estilo de conexão revela como você naturalmente expressa e recebe afeto nos relacionamentos.",
        shadow: "A sombra aparece quando você espera que outros adivinhem suas necessidades.",
        light: "Sua luz brilha quando você comunica claramente suas necessidades e honra as dos outros.",
        emotionalImpact: "Suas emoções são profundamente afetadas pela qualidade das suas conexões.",
        decisionImpact: "Você decide em relacionamentos baseado no que faz você se sentir amado.",
        workImpact: "No trabalho, seu estilo afeta como você reconhece e valoriza colegas.",
        relationshipImpact: "Nos relacionamentos, conhecer estilos evita mal-entendidos e aprofunda conexões.",
        innerLifeImpact: "Sua vida interior floresce quando você também pratica autocuidado no seu estilo.",
        day1: "Observe como você expressa afeto naturalmente hoje.",
        day2: "Identifique o estilo de alguém próximo a você.",
        day3: "Pratique expressar amor no estilo do outro.",
        day4: "Comunique sua necessidade de afeto a alguém.",
        day5: "Observe quando você se sente mais amado.",
        day6: "Pratique autocuidado no seu estilo principal.",
        day7: "Planeje uma semana de conexão intencional.",
      },
      'pt-pt': {
        testName: "Estilos de Conexão Afetiva",
        dailyLife: "O teu estilo de conexão revela como expressas e recebes afeto naturalmente.",
        shadow: "A sombra aparece quando esperas que outros adivinhem as tuas necessidades.",
        light: "A tua luz brilha quando comunicas claramente as tuas necessidades.",
        emotionalImpact: "As tuas emoções são afetadas pela qualidade das tuas conexões.",
        decisionImpact: "Decides em relacionamentos baseado no que te faz sentir amado.",
        workImpact: "No trabalho, o teu estilo afeta como reconheces colegas.",
        relationshipImpact: "Nos relacionamentos, conhecer estilos evita mal-entendidos.",
        innerLifeImpact: "A tua vida interior floresce com autocuidado no teu estilo.",
        day1: "Observa como expressas afeto naturalmente hoje.",
        day2: "Identifica o estilo de alguém próximo.",
        day3: "Pratica expressar amor no estilo do outro.",
        day4: "Comunica a tua necessidade de afeto a alguém.",
        day5: "Observa quando te sentes mais amado.",
        day6: "Pratica autocuidado no teu estilo principal.",
        day7: "Planeia uma semana de conexão intencional.",
      },
      en: {
        testName: "Affection Connection Styles",
        dailyLife: "Your connection style reveals how you naturally express and receive affection.",
        shadow: "The shadow appears when you expect others to guess your needs.",
        light: "Your light shines when you clearly communicate your needs.",
        emotionalImpact: "Your emotions are deeply affected by connection quality.",
        decisionImpact: "You decide in relationships based on what makes you feel loved.",
        workImpact: "At work, your style affects how you recognize colleagues.",
        relationshipImpact: "In relationships, knowing styles prevents misunderstandings.",
        innerLifeImpact: "Your inner life flourishes with self-care in your style.",
        day1: "Observe how you naturally express affection today.",
        day2: "Identify someone close's style.",
        day3: "Practice expressing love in the other's style.",
        day4: "Communicate your need for affection to someone.",
        day5: "Notice when you feel most loved.",
        day6: "Practice self-care in your main style.",
        day7: "Plan a week of intentional connection.",
      }
    },
    temperamentos: {
      pt: {
        testName: "Temperamentos",
        dailyLife: "Seu temperamento é a base biológica do seu comportamento — sua forma natural de reagir, processar e se expressar.",
        shadow: "A sombra aparece quando seu temperamento opera sem moderação.",
        light: "Sua luz brilha quando você equilibra seu temperamento com consciência.",
        emotionalImpact: "Suas emoções são coloridas pelo seu temperamento base.",
        decisionImpact: "Você tende a decidir de forma consistente com seu temperamento.",
        workImpact: "No trabalho, seu temperamento influencia ritmo, paciência e foco.",
        relationshipImpact: "Nos relacionamentos, temperamentos diferentes criam dinâmicas específicas.",
        innerLifeImpact: "Sua vida interior se beneficia quando você aceita seu temperamento natural.",
        day1: "Observe sua reação natural a um estressor hoje.",
        day2: "Identifique como seu temperamento afeta sua energia.",
        day3: "Pratique equilibrar uma tendência extrema.",
        day4: "Observe interações com temperamentos diferentes.",
        day5: "Experimente agir contra seu padrão temperamental.",
        day6: "Reflita sobre os dons do seu temperamento.",
        day7: "Defina uma prática de equilíbrio semanal.",
      },
      'pt-pt': {
        testName: "Temperamentos",
        dailyLife: "O teu temperamento é a base biológica do teu comportamento.",
        shadow: "A sombra aparece quando o teu temperamento opera sem moderação.",
        light: "A tua luz brilha quando equilibras o teu temperamento com consciência.",
        emotionalImpact: "As tuas emoções são coloridas pelo teu temperamento base.",
        decisionImpact: "Tendes a decidir de forma consistente com o teu temperamento.",
        workImpact: "No trabalho, o teu temperamento influencia ritmo e foco.",
        relationshipImpact: "Nos relacionamentos, temperamentos diferentes criam dinâmicas específicas.",
        innerLifeImpact: "A tua vida interior beneficia-se quando aceitas o teu temperamento natural.",
        day1: "Observa a tua reação natural a um stressor hoje.",
        day2: "Identifica como o teu temperamento afeta a tua energia.",
        day3: "Pratica equilibrar uma tendência extrema.",
        day4: "Observa interações com temperamentos diferentes.",
        day5: "Experimenta agir contra o teu padrão temperamental.",
        day6: "Reflecte sobre os dons do teu temperamento.",
        day7: "Define uma prática de equilíbrio semanal.",
      },
      en: {
        testName: "Temperaments",
        dailyLife: "Your temperament is the biological foundation of your behavior.",
        shadow: "The shadow appears when your temperament operates without moderation.",
        light: "Your light shines when you balance your temperament with awareness.",
        emotionalImpact: "Your emotions are colored by your base temperament.",
        decisionImpact: "You tend to decide consistently with your temperament.",
        workImpact: "At work, your temperament influences pace and focus.",
        relationshipImpact: "In relationships, different temperaments create specific dynamics.",
        innerLifeImpact: "Your inner life benefits when you accept your natural temperament.",
        day1: "Observe your natural reaction to a stressor today.",
        day2: "Identify how your temperament affects your energy.",
        day3: "Practice balancing an extreme tendency.",
        day4: "Observe interactions with different temperaments.",
        day5: "Try acting against your temperamental pattern.",
        day6: "Reflect on your temperament's gifts.",
        day7: "Set a weekly balance practice.",
      }
    },
    inteligencias_multiplas: {
      pt: {
        testName: "Inteligências Múltiplas",
        dailyLife: "Suas inteligências revelam como sua mente processa informações e resolve problemas de formas únicas.",
        shadow: "A sombra aparece quando você ignora inteligências menos desenvolvidas.",
        light: "Sua luz brilha quando você usa suas inteligências dominantes e desenvolve as outras.",
        emotionalImpact: "Suas emoções são processadas através das suas inteligências mais fortes.",
        decisionImpact: "Você tende a decidir usando as inteligências que mais valoriza.",
        workImpact: "No trabalho, suas inteligências dominantes determinam onde você se destaca.",
        relationshipImpact: "Nos relacionamentos, cada inteligência traz formas únicas de conexão.",
        innerLifeImpact: "Sua vida interior se enriquece quando você honra todas as suas inteligências.",
        day1: "Observe qual inteligência você mais usa hoje.",
        day2: "Identifique uma inteligência que você negligencia.",
        day3: "Pratique usar uma inteligência secundária.",
        day4: "Reflita sobre como suas inteligências afetam seu trabalho.",
        day5: "Experimente aprender algo usando uma inteligência diferente.",
        day6: "Observe como você se comunica através das suas inteligências.",
        day7: "Planeje como desenvolver uma inteligência subutilizada.",
      },
      'pt-pt': {
        testName: "Inteligências Múltiplas",
        dailyLife: "As tuas inteligências revelam como a tua mente processa informações.",
        shadow: "A sombra aparece quando ignoras inteligências menos desenvolvidas.",
        light: "A tua luz brilha quando usas as tuas inteligências dominantes.",
        emotionalImpact: "As tuas emoções são processadas através das tuas inteligências mais fortes.",
        decisionImpact: "Tendes a decidir usando as inteligências que mais valorizas.",
        workImpact: "No trabalho, as tuas inteligências dominantes determinam onde te destacas.",
        relationshipImpact: "Nos relacionamentos, cada inteligência traz formas únicas de conexão.",
        innerLifeImpact: "A tua vida interior enriquece-se quando honras todas as tuas inteligências.",
        day1: "Observa qual inteligência mais usas hoje.",
        day2: "Identifica uma inteligência que negligencias.",
        day3: "Pratica usar uma inteligência secundária.",
        day4: "Reflecte sobre como as tuas inteligências afetam o teu trabalho.",
        day5: "Experimenta aprender algo usando uma inteligência diferente.",
        day6: "Observa como te comunicas através das tuas inteligências.",
        day7: "Planeia como desenvolver uma inteligência subutilizada.",
      },
      en: {
        testName: "Multiple Intelligences",
        dailyLife: "Your intelligences reveal how your mind processes information uniquely.",
        shadow: "The shadow appears when you ignore less developed intelligences.",
        light: "Your light shines when you use your dominant intelligences.",
        emotionalImpact: "Your emotions are processed through your strongest intelligences.",
        decisionImpact: "You tend to decide using the intelligences you value most.",
        workImpact: "At work, your dominant intelligences determine where you excel.",
        relationshipImpact: "In relationships, each intelligence brings unique connection forms.",
        innerLifeImpact: "Your inner life enriches when you honor all your intelligences.",
        day1: "Observe which intelligence you use most today.",
        day2: "Identify an intelligence you neglect.",
        day3: "Practice using a secondary intelligence.",
        day4: "Reflect on how your intelligences affect your work.",
        day5: "Try learning something using a different intelligence.",
        day6: "Observe how you communicate through your intelligences.",
        day7: "Plan how to develop an underused intelligence.",
      }
    }
  };
  
  const testContent = content[testType] || content.arquetipos;
  const langContent = testContent[lang] || testContent.pt;
  return langContent;
};

// ==================== MAIN PDF GENERATOR ====================
export const generatePremiumTestPDF = (
  result: TestResult,
  options: PDFOptions
): void => {
  const lang = (options.language === 'pt-pt' ? 'pt-pt' : options.language) || 'pt';
  const normalizedLang = lang === 'pt-pt' ? 'pt-pt' : (lang === 'en' ? 'en' : 'pt');
  const t = getTranslations(normalizedLang);
  const testContent = getTestContent(result.testType, result.primaryResult.name, normalizedLang);
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  
  const testColor = TEST_COLORS[result.testType] || COLORS.primary;
  
  let pageNumber = 0;
  
  const addPageNumber = () => {
    pageNumber++;
    doc.setFontSize(8);
    doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    doc.text(t.footer, margin, pageHeight - 10);
    doc.text(`${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  };
  
  const addHeader = (title: string, color = testColor) => {
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, 23);
  };
  
  const writeWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight = 5): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      doc.text(line, x, y + (index * lineHeight));
    });
    return y + (lines.length * lineHeight);
  };
  
  const dateLocale = normalizedLang === 'en' ? 'en-US' : 'pt-BR';
  const date = new Date().toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ==================== BLOCK 1: COVER ====================
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Accent line
  doc.setFillColor(testColor.r, testColor.g, testColor.b);
  doc.rect(0, pageHeight / 3 - 2, pageWidth, 4, "F");
  
  // Test name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(testContent.testName, contentWidth);
  doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 40, { align: "center" });
  
  // User name
  doc.setFontSize(20);
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text(options.userName, pageWidth / 2, pageHeight / 2, { align: "center" });
  
  // Date
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(date, pageWidth / 2, pageHeight / 2 + 15, { align: "center" });
  
  // Miguel icon representation
  doc.setFontSize(24);
  doc.text("🔮", pageWidth / 2, pageHeight / 2 + 40, { align: "center" });
  
  // Inspirational quote
  const quoteKey = result.testType as keyof typeof t.coverQuotes;
  const quote = t.coverQuotes[quoteKey] || t.coverQuotes.arquetipos;
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(180, 180, 180);
  const quoteLines = doc.splitTextToSize(`"${quote}"`, contentWidth);
  doc.text(quoteLines, pageWidth / 2, pageHeight - 60, { align: "center" });
  
  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text("NELLO ONE", pageWidth / 2, pageHeight - 30, { align: "center" });

  // ==================== BLOCK 1: INTRODUCTION ====================
  doc.addPage();
  addHeader(t.block1Title);
  addPageNumber();
  
  let yPos = 50;
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  yPos = writeWrappedText(t.block1Intro, margin, yPos, contentWidth);
  yPos += 15;
  
  // Test-specific introduction
  doc.setFont("helvetica", "bold");
  doc.setTextColor(testColor.r, testColor.g, testColor.b);
  doc.text(testContent.testName, margin, yPos);
  yPos += 10;
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  yPos = writeWrappedText(testContent.dailyLife, margin, yPos, contentWidth);

  // ==================== BLOCK 2: PRIMARY RESULT ====================
  doc.addPage();
  addHeader(t.block2Title);
  addPageNumber();
  
  yPos = 50;
  
  // Primary result card
  doc.setFillColor(testColor.r, testColor.g, testColor.b);
  doc.roundedRect(margin, yPos, contentWidth, 30, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(result.primaryResult.name, margin + 10, yPos + 19);
  
  if (result.primaryResult.percentage) {
    doc.text(`${result.primaryResult.percentage}%`, pageWidth - margin - 10, yPos + 19, { align: "right" });
  }
  
  yPos += 45;
  
  // Sections
  const sections = [
    { label: t.dailyLife, content: testContent.dailyLife },
    { label: t.strengths, content: testContent.light },
    { label: t.vulnerabilities, content: testContent.shadow },
    { label: t.emotionalImpact, content: testContent.emotionalImpact },
    { label: t.decisionImpact, content: testContent.decisionImpact },
  ];
  
  sections.forEach(section => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 30;
      addPageNumber();
    }
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(testColor.r, testColor.g, testColor.b);
    doc.setFontSize(10);
    doc.text(section.label, margin, yPos);
    yPos += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    yPos = writeWrappedText(section.content, margin, yPos, contentWidth);
    yPos += 8;
  });

  // ==================== BLOCK 3: SECONDARY RESULTS ====================
  if (result.secondaryResults && result.secondaryResults.length > 0) {
    doc.addPage();
    addHeader(t.block3Title);
    addPageNumber();
    
    yPos = 50;
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(t.secondaryTitle, margin, yPos);
    yPos += 15;
    
    result.secondaryResults.slice(0, 3).forEach((secondary, index) => {
      doc.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b);
      doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, "F");
      
      doc.setTextColor(testColor.r, testColor.g, testColor.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 2}. ${secondary.name}`, margin + 10, yPos + 16);
      
      if (secondary.percentage) {
        doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        doc.text(`${secondary.percentage}%`, pageWidth - margin - 10, yPos + 16, { align: "right" });
      }
      
      yPos += 35;
    });
  }

  // ==================== BLOCK 4: VISUAL MAP ====================
  doc.addPage();
  addHeader(t.block4Title);
  addPageNumber();
  
  yPos = 50;
  
  // Draw bar chart for all scores
  const barHeight = 18;
  const barGap = 6;
  const sortedScores = Object.entries(result.allScores)
    .sort(([, a], [, b]) => b - a);
  
  const maxScore = Math.max(...Object.values(result.allScores));
  
  sortedScores.forEach(([key, score]) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 30;
      addPageNumber();
    }
    
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const barWidth = (percentage / 100) * (contentWidth - 50);
    
    // Background bar
    doc.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b);
    doc.roundedRect(margin + 45, yPos, contentWidth - 50, barHeight, 2, 2, "F");
    
    // Filled bar
    doc.setFillColor(testColor.r, testColor.g, testColor.b);
    doc.roundedRect(margin + 45, yPos, barWidth, barHeight, 2, 2, "F");
    
    // Label
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(key.substring(0, 10), margin, yPos + 11);
    
    // Score
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    if (barWidth > 20) {
      doc.text(`${score}`, margin + 50, yPos + 12);
    }
    
    yPos += barHeight + barGap;
  });

  // ==================== BLOCK 5: PATTERNS (MIGUEL) ====================
  doc.addPage();
  addHeader(t.block5Title);
  addPageNumber();
  
  yPos = 50;
  
  // Miguel intro
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const miguelLines = doc.splitTextToSize(t.miguelIntro, contentWidth - 20);
  doc.text(miguelLines, margin + 10, yPos + 15);
  
  yPos += 50;
  
  const patterns = [
    { label: t.dominantPattern, content: testContent.dailyLife },
    { label: t.lightActivator, content: testContent.light },
    { label: t.shadowActivator, content: testContent.shadow },
    { label: t.stressReaction, content: testContent.emotionalImpact },
  ];
  
  patterns.forEach(pattern => {
    if (yPos > pageHeight - 35) {
      doc.addPage();
      yPos = 30;
      addPageNumber();
    }
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(testColor.r, testColor.g, testColor.b);
    doc.setFontSize(10);
    doc.text(pattern.label, margin, yPos);
    yPos += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    yPos = writeWrappedText(pattern.content, margin, yPos, contentWidth);
    yPos += 10;
  });

  // ==================== BLOCK 6: IMMEDIATE EVOLUTION (24h) ====================
  doc.addPage();
  addHeader(t.block6Title);
  addPageNumber();
  
  yPos = 50;
  doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
  doc.setFontSize(11);
  doc.text(t.block6Subtitle, margin, yPos);
  yPos += 20;
  
  const evolutionItems = [
    { icon: "⚡", label: t.activateStrength, color: COLORS.success },
    { icon: "🔄", label: t.adjustPattern, color: COLORS.warning },
    { icon: "✨", label: t.expandConsciousness, color: COLORS.accent },
  ];
  
  evolutionItems.forEach(item => {
    doc.setFillColor(item.color.r, item.color.g, item.color.b);
    doc.roundedRect(margin, yPos, contentWidth, 30, 3, 3, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(item.icon, margin + 10, yPos + 19);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, margin + 30, yPos + 19);
    
    yPos += 40;
  });

  // ==================== BLOCK 7: LIFE DIMENSIONS ====================
  doc.addPage();
  addHeader(t.block7Title);
  addPageNumber();
  
  yPos = 50;
  
  const dimensions = [
    { icon: "💼", label: t.workProductivity, content: testContent.workImpact },
    { icon: "❤️", label: t.relationships, content: testContent.relationshipImpact },
    { icon: "🧘", label: t.innerLife, content: testContent.innerLifeImpact },
  ];
  
  dimensions.forEach(dim => {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = 30;
      addPageNumber();
    }
    
    doc.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b);
    doc.roundedRect(margin, yPos, contentWidth, 50, 3, 3, "F");
    
    doc.setTextColor(testColor.r, testColor.g, testColor.b);
    doc.setFontSize(14);
    doc.text(dim.icon, margin + 10, yPos + 18);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(dim.label, margin + 30, yPos + 18);
    
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const dimLines = doc.splitTextToSize(dim.content, contentWidth - 45);
    doc.text(dimLines.slice(0, 2), margin + 30, yPos + 30);
    
    yPos += 60;
  });

  // ==================== BLOCK 8: 7-DAY PLAN ====================
  doc.addPage();
  addHeader(t.block8Title);
  addPageNumber();
  
  yPos = 50;
  doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
  doc.setFontSize(10);
  doc.text(t.block8Subtitle, margin, yPos);
  yPos += 15;
  
  for (let day = 1; day <= 7; day++) {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 30;
      addPageNumber();
    }
    
    const dayKey = `day${day}` as keyof typeof testContent;
    const dayContent = testContent[dayKey] as string || `Prática do dia ${day}`;
    
    doc.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b);
    doc.roundedRect(margin, yPos, contentWidth, 22, 2, 2, "F");
    
    doc.setFillColor(testColor.r, testColor.g, testColor.b);
    doc.roundedRect(margin, yPos, 25, 22, 2, 2, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${t.day} ${day}`, margin + 4, yPos + 14);
    
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const taskLines = doc.splitTextToSize(dayContent, contentWidth - 35);
    doc.text(taskLines[0] || '', margin + 30, yPos + 14);
    
    yPos += 28;
  }

  // ==================== BLOCK 9: SELF-EXAM QUESTION ====================
  doc.addPage();
  addHeader(t.block9Title);
  addPageNumber();
  
  yPos = pageHeight / 2 - 40;
  
  const questionKey = result.testType as keyof typeof t.selfExamQuestions;
  const selfExamQuestion = t.selfExamQuestions[questionKey] || t.selfExamQuestions.arquetipos;
  
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.roundedRect(margin, yPos, contentWidth, 60, 5, 5, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  const questionLines = doc.splitTextToSize(`"${selfExamQuestion}"`, contentWidth - 30);
  doc.text(questionLines, pageWidth / 2, yPos + 30, { align: "center" });

  // ==================== BLOCK 10: FINAL MESSAGE ====================
  doc.addPage();
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Accent line
  doc.setFillColor(testColor.r, testColor.g, testColor.b);
  doc.rect(0, pageHeight / 2 - 30, pageWidth, 4, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(t.block10Title, pageWidth / 2, pageHeight / 2 - 10, { align: "center" });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  const finalLines = doc.splitTextToSize(`"${t.finalPhrase}"`, contentWidth);
  doc.text(finalLines, pageWidth / 2, pageHeight / 2 + 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(t.signature, pageWidth / 2, pageHeight / 2 + 50, { align: "center" });
  
  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text("NELLO ONE", pageWidth / 2, pageHeight - 30, { align: "center" });

  // Save
  const filePrefix = normalizedLang === 'en' ? 'Premium-Report' : 'Relatorio-Premium';
  const fileName = `${filePrefix}-${testContent.testName.replace(/\s+/g, "-")}-${options.userName.replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
};
