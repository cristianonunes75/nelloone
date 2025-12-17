import jsPDF from "jspdf";
import { InteligenciasResult, INTELLIGENCES, getIntelligenceProfile } from "./inteligenciasMultiplas";

interface PDFOptions {
  language?: 'pt' | 'pt-pt' | 'en';
}

const COLORS = {
  primary: { r: 31, g: 46, b: 75 },      // Miguel Deep Blue
  accent: { r: 205, g: 174, b: 103 },    // Nello Gold
  background: { r: 252, g: 252, b: 252 }, // White
  text: { r: 50, g: 50, b: 50 },
  muted: { r: 120, g: 120, b: 120 },
  success: { r: 16, g: 185, b: 129 },
  warning: { r: 245, g: 158, b: 11 },
  danger: { r: 244, g: 63, b: 94 },
};

const INTELLIGENCE_COLORS: Record<string, { r: number; g: number; b: number }> = {
  linguistica: { r: 139, g: 92, b: 246 },
  logico_matematica: { r: 59, g: 130, b: 246 },
  espacial: { r: 236, g: 72, b: 153 },
  musical: { r: 245, g: 158, b: 11 },
  corporal_cinestesica: { r: 16, g: 185, b: 129 },
  interpessoal: { r: 244, g: 63, b: 94 },
  intrapessoal: { r: 52, g: 211, b: 153 },
  naturalista: { r: 34, g: 197, b: 94 },
};

// Extended intelligence content for premium PDF
const INTELLIGENCE_CONTENT: Record<string, {
  light: { pt: string; 'pt-pt': string; en: string };
  shadow: { pt: string; 'pt-pt': string; en: string };
  mentalPatterns: { pt: string; 'pt-pt': string; en: string };
  learningExpanded: { pt: string; 'pt-pt': string; en: string };
  workExpanded: { pt: string; 'pt-pt': string; en: string };
  vocationText: { pt: string; 'pt-pt': string; en: string };
  expansionPoints: { pt: string[]; 'pt-pt': string[]; en: string[] };
  selfExamQuestion: { pt: string; 'pt-pt': string; en: string };
}> = {
  linguistica: {
    light: {
      pt: "Sua palavra abre caminhos. Sua fala cura, esclarece e direciona. Você transforma ideias em narrativas que movem pessoas.",
      'pt-pt': "A tua palavra abre caminhos. A tua fala cura, esclarece e direciona. Tu transformas ideias em narrativas que movem pessoas.",
      en: "Your word opens paths. Your speech heals, clarifies, and directs. You transform ideas into narratives that move people."
    },
    shadow: {
      pt: "Quando desequilibrado, você pode se perder em palavras sem ação, intelectualizando emoções ao invés de senti-las.",
      'pt-pt': "Quando desequilibrado, podes perder-te em palavras sem ação, intelectualizando emoções em vez de as sentir.",
      en: "When imbalanced, you may get lost in words without action, intellectualizing emotions instead of feeling them."
    },
    mentalPatterns: {
      pt: "Sua mente se organiza por palavras, narrativas, conversas e significados. Você entende, sente e interpreta o mundo através da linguagem. Quando sua inteligência linguística está ativa, tudo flui com clareza. Quando bloqueada, você sente confusão mental e dificuldade de expressão.",
      'pt-pt': "A tua mente organiza-se por palavras, narrativas, conversas e significados. Tu entendes, sentes e interpretas o mundo através da linguagem. Quando a tua inteligência linguística está ativa, tudo flui com clareza. Quando bloqueada, sentes confusão mental e dificuldade de expressão.",
      en: "Your mind is organized by words, narratives, conversations, and meanings. You understand, feel, and interpret the world through language. When your linguistic intelligence is active, everything flows with clarity. When blocked, you feel mental confusion and difficulty expressing yourself."
    },
    learningExpanded: {
      pt: "Você aprende melhor lendo, escrevendo, ouvindo palestras e participando de debates. Anotações detalhadas e resumos são suas ferramentas. Precisa verbalizar para processar informação completamente.",
      'pt-pt': "Tu aprendes melhor a ler, escrever, ouvir palestras e participar de debates. Anotações detalhadas e resumos são as tuas ferramentas. Precisas verbalizar para processar informação completamente.",
      en: "You learn best by reading, writing, listening to lectures, and participating in debates. Detailed notes and summaries are your tools. You need to verbalize to fully process information."
    },
    workExpanded: {
      pt: "Produz melhor em ambientes que valorizam comunicação clara, documentação e expressão de ideias. Você se destaca em trabalhos que envolvam escrita, apresentação ou persuasão. Precisa de espaço para articular seus pensamentos.",
      'pt-pt': "Produzes melhor em ambientes que valorizam comunicação clara, documentação e expressão de ideias. Destacas-te em trabalhos que envolvam escrita, apresentação ou persuasão. Precisas de espaço para articular os teus pensamentos.",
      en: "You produce best in environments that value clear communication, documentation, and expression of ideas. You excel in work involving writing, presentation, or persuasion. You need space to articulate your thoughts."
    },
    vocationText: {
      pt: "Você tem talento para comunicar, ensinar, orientar, inspirar, escrever, liderar conversas e criar compreensão. Isso pode se tornar vocação, carreira ou missão. Sua palavra é sua maior ferramenta de transformação.",
      'pt-pt': "Tu tens talento para comunicar, ensinar, orientar, inspirar, escrever, liderar conversas e criar compreensão. Isso pode tornar-se vocação, carreira ou missão. A tua palavra é a tua maior ferramenta de transformação.",
      en: "You have talent for communicating, teaching, guiding, inspiring, writing, leading conversations, and creating understanding. This can become vocation, career, or mission. Your word is your greatest tool for transformation."
    },
    expansionPoints: {
      pt: [
        "Equilibre palavras com ação prática",
        "Desenvolva escuta ativa além da fala",
        "Pratique silêncio contemplativo diário",
        "Conecte emoções antes de verbalizar"
      ],
      'pt-pt': [
        "Equilibra palavras com ação prática",
        "Desenvolve escuta ativa além da fala",
        "Pratica silêncio contemplativo diário",
        "Conecta emoções antes de verbalizar"
      ],
      en: [
        "Balance words with practical action",
        "Develop active listening beyond speaking",
        "Practice daily contemplative silence",
        "Connect emotions before verbalizing"
      ]
    },
    selfExamQuestion: {
      pt: "Que história você está contando sobre si mesmo que já não serve mais?",
      'pt-pt': "Que história estás a contar sobre ti mesmo que já não serve mais?",
      en: "What story are you telling about yourself that no longer serves you?"
    }
  },
  logico_matematica: {
    light: {
      pt: "Sua mente encontra ordem no caos. Você transforma complexidade em clareza e resolve o que outros consideram impossível.",
      'pt-pt': "A tua mente encontra ordem no caos. Tu transformas complexidade em clareza e resolves o que outros consideram impossível.",
      en: "Your mind finds order in chaos. You transform complexity into clarity and solve what others consider impossible."
    },
    shadow: {
      pt: "Quando desequilibrado, você pode parecer frio ou distante, subestimando emoções e impacientando-se com processos lentos.",
      'pt-pt': "Quando desequilibrado, podes parecer frio ou distante, subestimando emoções e impacientando-te com processos lentos.",
      en: "When imbalanced, you may seem cold or distant, underestimating emotions and becoming impatient with slow processes."
    },
    mentalPatterns: {
      pt: "Sua mente opera em padrões, sequências e relações causais. Você precisa entender o 'porquê' antes de aceitar qualquer informação. Quando ativa, sua lógica é sua maior força. Quando bloqueada, você se sente paralisado pela análise excessiva.",
      'pt-pt': "A tua mente opera em padrões, sequências e relações causais. Precisas entender o 'porquê' antes de aceitar qualquer informação. Quando ativa, a tua lógica é a tua maior força. Quando bloqueada, sentes-te paralisado pela análise excessiva.",
      en: "Your mind operates in patterns, sequences, and causal relationships. You need to understand the 'why' before accepting any information. When active, your logic is your greatest strength. When blocked, you feel paralyzed by over-analysis."
    },
    learningExpanded: {
      pt: "Você aprende através de experimentação, resolução de problemas e análise de dados. Precisa de estrutura lógica e métricas claras para se sentir motivado.",
      'pt-pt': "Tu aprendes através de experimentação, resolução de problemas e análise de dados. Precisas de estrutura lógica e métricas claras para te sentires motivado.",
      en: "You learn through experimentation, problem-solving, and data analysis. You need logical structure and clear metrics to feel motivated."
    },
    workExpanded: {
      pt: "Prospera em ambientes que valorizam lógica, eficiência e resolução de problemas. Prefere projetos com métricas claras e objetivos mensuráveis. Trabalha melhor com autonomia para encontrar soluções.",
      'pt-pt': "Prosperas em ambientes que valorizam lógica, eficiência e resolução de problemas. Preferes projetos com métricas claras e objetivos mensuráveis. Trabalhas melhor com autonomia para encontrar soluções.",
      en: "You thrive in environments that value logic, efficiency, and problem-solving. You prefer projects with clear metrics and measurable goals. You work best with autonomy to find solutions."
    },
    vocationText: {
      pt: "Você nasceu para analisar, otimizar, resolver e criar sistemas. Sua mente estratégica pode transformar qualquer área que exija pensamento claro e decisões baseadas em dados.",
      'pt-pt': "Tu nasceste para analisar, otimizar, resolver e criar sistemas. A tua mente estratégica pode transformar qualquer área que exija pensamento claro e decisões baseadas em dados.",
      en: "You were born to analyze, optimize, solve, and create systems. Your strategic mind can transform any area that requires clear thinking and data-based decisions."
    },
    expansionPoints: {
      pt: [
        "Desenvolva empatia emocional consciente",
        "Pratique aceitar ambiguidade sem resolver",
        "Conecte-se com pessoas antes de problemas",
        "Equilibre razão com intuição"
      ],
      'pt-pt': [
        "Desenvolve empatia emocional consciente",
        "Pratica aceitar ambiguidade sem resolver",
        "Conecta-te com pessoas antes de problemas",
        "Equilibra razão com intuição"
      ],
      en: [
        "Develop conscious emotional empathy",
        "Practice accepting ambiguity without solving",
        "Connect with people before problems",
        "Balance reason with intuition"
      ]
    },
    selfExamQuestion: {
      pt: "Que problema você está tentando resolver que não precisa de solução, mas de aceitação?",
      'pt-pt': "Que problema estás a tentar resolver que não precisa de solução, mas de aceitação?",
      en: "What problem are you trying to solve that doesn't need a solution, but acceptance?"
    }
  },
  espacial: {
    light: {
      pt: "Você vê o que outros não enxergam. Sua visão transforma o abstrato em concreto, o invisível em visível.",
      'pt-pt': "Tu vês o que outros não enxergam. A tua visão transforma o abstrato em concreto, o invisível em visível.",
      en: "You see what others don't. Your vision transforms the abstract into concrete, the invisible into visible."
    },
    shadow: {
      pt: "Quando desequilibrado, você pode se frustrar com descrições verbais e julgar excessivamente pela aparência.",
      'pt-pt': "Quando desequilibrado, podes frustrar-te com descrições verbais e julgar excessivamente pela aparência.",
      en: "When imbalanced, you may get frustrated with verbal descriptions and judge excessively by appearance."
    },
    mentalPatterns: {
      pt: "Sua mente cria mapas mentais e transforma conceitos abstratos em representações visuais. Você percebe o mundo através de formas, cores e relações espaciais. Quando bloqueada, você se sente perdido sem referências visuais.",
      'pt-pt': "A tua mente cria mapas mentais e transforma conceitos abstratos em representações visuais. Tu percebes o mundo através de formas, cores e relações espaciais. Quando bloqueada, sentes-te perdido sem referências visuais.",
      en: "Your mind creates mental maps and transforms abstract concepts into visual representations. You perceive the world through shapes, colors, and spatial relationships. When blocked, you feel lost without visual references."
    },
    learningExpanded: {
      pt: "Você aprende através de imagens, diagramas, mapas e representações visuais. Precisa 'ver' a informação para processá-la completamente. Mind maps são sua ferramenta natural.",
      'pt-pt': "Tu aprendes através de imagens, diagramas, mapas e representações visuais. Precisas 'ver' a informação para processá-la completamente. Mind maps são a tua ferramenta natural.",
      en: "You learn through images, diagrams, maps, and visual representations. You need to 'see' information to fully process it. Mind maps are your natural tool."
    },
    workExpanded: {
      pt: "Produz melhor em ambientes que permitem criação visual e manipulação espacial. Você se destaca em design, arquitetura, arte e qualquer área que exija visão tridimensional.",
      'pt-pt': "Produzes melhor em ambientes que permitem criação visual e manipulação espacial. Destacas-te em design, arquitetura, arte e qualquer área que exija visão tridimensional.",
      en: "You produce best in environments that allow visual creation and spatial manipulation. You excel in design, architecture, art, and any area requiring three-dimensional vision."
    },
    vocationText: {
      pt: "Você nasceu para criar, visualizar, projetar e transformar espaços. Sua capacidade de ver além do óbvio é um dom que pode transformar ambientes, marcas e experiências.",
      'pt-pt': "Tu nasceste para criar, visualizar, projetar e transformar espaços. A tua capacidade de ver além do óbvio é um dom que pode transformar ambientes, marcas e experiências.",
      en: "You were born to create, visualize, design, and transform spaces. Your ability to see beyond the obvious is a gift that can transform environments, brands, and experiences."
    },
    expansionPoints: {
      pt: [
        "Desenvolva descrição verbal das suas visões",
        "Pratique explicar ideias sem imagens",
        "Conecte estética com significado profundo",
        "Equilibre forma com função"
      ],
      'pt-pt': [
        "Desenvolve descrição verbal das tuas visões",
        "Pratica explicar ideias sem imagens",
        "Conecta estética com significado profundo",
        "Equilibra forma com função"
      ],
      en: [
        "Develop verbal description of your visions",
        "Practice explaining ideas without images",
        "Connect aesthetics with deep meaning",
        "Balance form with function"
      ]
    },
    selfExamQuestion: {
      pt: "Que visão você está guardando dentro de si que o mundo precisa ver?",
      'pt-pt': "Que visão estás a guardar dentro de ti que o mundo precisa ver?",
      en: "What vision are you keeping inside that the world needs to see?"
    }
  },
  musical: {
    light: {
      pt: "Você ouve o que outros não escutam. Sua sensibilidade sonora é um portal para emoções e significados profundos.",
      'pt-pt': "Tu ouves o que outros não escutam. A tua sensibilidade sonora é um portal para emoções e significados profundos.",
      en: "You hear what others don't. Your sonic sensitivity is a portal to emotions and deep meanings."
    },
    shadow: {
      pt: "Quando desequilibrado, você pode se distrair facilmente por sons ambientes e se isolar através da música.",
      'pt-pt': "Quando desequilibrado, podes distrair-te facilmente por sons ambientes e isolar-te através da música.",
      en: "When imbalanced, you may be easily distracted by ambient sounds and isolate through music."
    },
    mentalPatterns: {
      pt: "Sua mente opera em ritmos, melodias e harmonias. Você percebe nuances sonoras que outros não captam e encontra significado profundo na música. O som é sua linguagem natural de processamento emocional.",
      'pt-pt': "A tua mente opera em ritmos, melodias e harmonias. Tu percebes nuances sonoras que outros não captam e encontras significado profundo na música. O som é a tua linguagem natural de processamento emocional.",
      en: "Your mind operates in rhythms, melodies, and harmonies. You perceive sonic nuances that others miss and find deep meaning in music. Sound is your natural language for emotional processing."
    },
    learningExpanded: {
      pt: "Você aprende através de músicas, ritmos e padrões sonoros. Memoriza melhor quando associa informações a melodias ou cria rimas. Precisa de ambiente sonoro controlado para concentração.",
      'pt-pt': "Tu aprendes através de músicas, ritmos e padrões sonoros. Memorizas melhor quando associas informações a melodias ou crias rimas. Precisas de ambiente sonoro controlado para concentração.",
      en: "You learn through music, rhythms, and sound patterns. You memorize better when associating information with melodies or creating rhymes. You need a controlled sound environment for concentration."
    },
    workExpanded: {
      pt: "Produz melhor em ambientes com música controlada ou silêncio intencional. Você é sensível a ruídos e distrações sonoras. Trabalhos com componente rítmico ou sonoro amplificam seu desempenho.",
      'pt-pt': "Produzes melhor em ambientes com música controlada ou silêncio intencional. És sensível a ruídos e distrações sonoras. Trabalhos com componente rítmico ou sonoro amplificam o teu desempenho.",
      en: "You produce best in environments with controlled music or intentional silence. You are sensitive to noise and sound distractions. Work with rhythmic or sonic components amplifies your performance."
    },
    vocationText: {
      pt: "Você nasceu para expressar, curar e conectar através do som. Sua sensibilidade musical pode transformar ambientes, aliviar tensões e criar experiências emocionais memoráveis.",
      'pt-pt': "Tu nasceste para expressar, curar e conectar através do som. A tua sensibilidade musical pode transformar ambientes, aliviar tensões e criar experiências emocionais memoráveis.",
      en: "You were born to express, heal, and connect through sound. Your musical sensitivity can transform environments, relieve tension, and create memorable emotional experiences."
    },
    expansionPoints: {
      pt: [
        "Pratique expressão sem dependência de música",
        "Desenvolva tolerância a ambientes ruidosos",
        "Use música para conexão, não isolamento",
        "Equilibre sensibilidade com praticidade"
      ],
      'pt-pt': [
        "Pratica expressão sem dependência de música",
        "Desenvolve tolerância a ambientes ruidosos",
        "Usa música para conexão, não isolamento",
        "Equilibra sensibilidade com praticidade"
      ],
      en: [
        "Practice expression without music dependence",
        "Develop tolerance for noisy environments",
        "Use music for connection, not isolation",
        "Balance sensitivity with practicality"
      ]
    },
    selfExamQuestion: {
      pt: "Que música sua alma está tentando tocar que você ainda não permitiu?",
      'pt-pt': "Que música a tua alma está a tentar tocar que ainda não permitiste?",
      en: "What music is your soul trying to play that you haven't allowed yet?"
    }
  },
  corporal_cinestesica: {
    light: {
      pt: "Seu corpo é sabedoria em movimento. Você transforma ideias em ação física com maestria natural.",
      'pt-pt': "O teu corpo é sabedoria em movimento. Tu transformas ideias em ação física com maestria natural.",
      en: "Your body is wisdom in motion. You transform ideas into physical action with natural mastery."
    },
    shadow: {
      pt: "Quando desequilibrado, você pode parecer inquieto em ambientes estáticos e impaciente com teoria abstrata.",
      'pt-pt': "Quando desequilibrado, podes parecer inquieto em ambientes estáticos e impaciente com teoria abstrata.",
      en: "When imbalanced, you may seem restless in static environments and impatient with abstract theory."
    },
    mentalPatterns: {
      pt: "Você pensa com o corpo. Suas mãos, gestos e movimentos são extensões do seu pensamento. Aprende fazendo, cria através do toque e se expressa através do movimento. Quando bloqueado, você sente energia estagnada e frustração física.",
      'pt-pt': "Tu pensas com o corpo. As tuas mãos, gestos e movimentos são extensões do teu pensamento. Aprendes fazendo, crias através do toque e expressas-te através do movimento. Quando bloqueado, sentes energia estagnada e frustração física.",
      en: "You think with your body. Your hands, gestures, and movements are extensions of your thought. You learn by doing, create through touch, and express yourself through movement. When blocked, you feel stagnant energy and physical frustration."
    },
    learningExpanded: {
      pt: "Você aprende fazendo, tocando e experimentando. Precisa de movimento para processar informação. Estudar caminhando ou gesticulando amplifica sua retenção.",
      'pt-pt': "Tu aprendes fazendo, tocando e experimentando. Precisas de movimento para processar informação. Estudar a caminhar ou gesticulando amplifica a tua retenção.",
      en: "You learn by doing, touching, and experimenting. You need movement to process information. Studying while walking or gesturing amplifies your retention."
    },
    workExpanded: {
      pt: "Produz melhor quando pode se movimentar e usar as mãos. Trabalhos com componente físico, prático ou tátil são ideais. Dificuldade em ficar sentado por longos períodos reduz seu desempenho.",
      'pt-pt': "Produzes melhor quando podes movimentar-te e usar as mãos. Trabalhos com componente físico, prático ou tátil são ideais. Dificuldade em ficar sentado por longos períodos reduz o teu desempenho.",
      en: "You produce best when able to move and use your hands. Work with physical, practical, or tactile components is ideal. Difficulty sitting for long periods reduces your performance."
    },
    vocationText: {
      pt: "Você nasceu para construir, mover, curar e criar com suas mãos. Sua inteligência corporal pode transformar espaços, pessoas e experiências através da ação prática.",
      'pt-pt': "Tu nasceste para construir, mover, curar e criar com as tuas mãos. A tua inteligência corporal pode transformar espaços, pessoas e experiências através da ação prática.",
      en: "You were born to build, move, heal, and create with your hands. Your bodily intelligence can transform spaces, people, and experiences through practical action."
    },
    expansionPoints: {
      pt: [
        "Desenvolva paciência com teoria abstrata",
        "Pratique concentração em ambientes estáticos",
        "Conecte movimento com propósito consciente",
        "Equilibre ação com reflexão"
      ],
      'pt-pt': [
        "Desenvolve paciência com teoria abstrata",
        "Pratica concentração em ambientes estáticos",
        "Conecta movimento com propósito consciente",
        "Equilibra ação com reflexão"
      ],
      en: [
        "Develop patience with abstract theory",
        "Practice concentration in static environments",
        "Connect movement with conscious purpose",
        "Balance action with reflection"
      ]
    },
    selfExamQuestion: {
      pt: "Que movimento seu corpo está pedindo que você faça há tempo?",
      'pt-pt': "Que movimento o teu corpo está a pedir que faças há tempo?",
      en: "What movement has your body been asking you to make for a while?"
    }
  },
  interpessoal: {
    light: {
      pt: "Você entende pessoas. Sua presença cura, conecta e transforma grupos naturalmente.",
      'pt-pt': "Tu entendes pessoas. A tua presença cura, conecta e transforma grupos naturalmente.",
      en: "You understand people. Your presence heals, connects, and transforms groups naturally."
    },
    shadow: {
      pt: "Quando desequilibrado, você pode absorver emoções alheias, perder limites pessoais e se esgotar cuidando dos outros.",
      'pt-pt': "Quando desequilibrado, podes absorver emoções alheias, perder limites pessoais e esgotar-te cuidando dos outros.",
      en: "When imbalanced, you may absorb others' emotions, lose personal boundaries, and exhaust yourself caring for others."
    },
    mentalPatterns: {
      pt: "Você percebe emoções, motivações e dinâmicas sociais que outros não captam. Conectar-se é natural para você. Quando essa inteligência está bloqueada, você se sente isolado e incompreendido.",
      'pt-pt': "Tu percebes emoções, motivações e dinâmicas sociais que outros não captam. Conectar-te é natural para ti. Quando essa inteligência está bloqueada, sentes-te isolado e incompreendido.",
      en: "You perceive emotions, motivations, and social dynamics that others miss. Connecting is natural for you. When this intelligence is blocked, you feel isolated and misunderstood."
    },
    learningExpanded: {
      pt: "Você aprende melhor em grupo, através de discussões e colaboração. Precisa de interação social para processar ideias completamente. Estudar sozinho pode ser menos eficiente.",
      'pt-pt': "Tu aprendes melhor em grupo, através de discussões e colaboração. Precisas de interação social para processar ideias completamente. Estudar sozinho pode ser menos eficiente.",
      en: "You learn best in groups, through discussions and collaboration. You need social interaction to fully process ideas. Studying alone may be less efficient."
    },
    workExpanded: {
      pt: "Prospera em ambientes colaborativos e de equipe. Trabalhos que envolvam pessoas, negociação, liderança ou mediação são ideais. Você se destaca em qualquer função que exija leitura social.",
      'pt-pt': "Prosperas em ambientes colaborativos e de equipa. Trabalhos que envolvam pessoas, negociação, liderança ou mediação são ideais. Destacas-te em qualquer função que exija leitura social.",
      en: "You thrive in collaborative team environments. Work involving people, negotiation, leadership, or mediation is ideal. You excel in any role requiring social reading."
    },
    vocationText: {
      pt: "Você nasceu para trabalhar com pessoas, desenvolver, mediar, entender e influenciar grupos. Sua capacidade de conexão é um dom que pode transformar famílias, equipes e comunidades.",
      'pt-pt': "Tu nasceste para trabalhar com pessoas, desenvolver, mediar, entender e influenciar grupos. A tua capacidade de conexão é um dom que pode transformar famílias, equipas e comunidades.",
      en: "You were born to work with people, develop, mediate, understand, and influence groups. Your ability to connect is a gift that can transform families, teams, and communities."
    },
    expansionPoints: {
      pt: [
        "Desenvolva limites emocionais saudáveis",
        "Pratique autocuidado antes de cuidar dos outros",
        "Conecte-se consigo antes de conectar com grupos",
        "Equilibre empatia com autoproteção"
      ],
      'pt-pt': [
        "Desenvolve limites emocionais saudáveis",
        "Pratica autocuidado antes de cuidar dos outros",
        "Conecta-te contigo antes de conectar com grupos",
        "Equilibra empatia com autoproteção"
      ],
      en: [
        "Develop healthy emotional boundaries",
        "Practice self-care before caring for others",
        "Connect with yourself before connecting with groups",
        "Balance empathy with self-protection"
      ]
    },
    selfExamQuestion: {
      pt: "Quem você está cuidando às custas de si mesmo?",
      'pt-pt': "Quem estás a cuidar às custas de ti mesmo?",
      en: "Who are you caring for at the expense of yourself?"
    }
  },
  intrapessoal: {
    light: {
      pt: "Você se conhece profundamente. Sua clareza interior é um farol para decisões alinhadas.",
      'pt-pt': "Tu conheces-te profundamente. A tua clareza interior é um farol para decisões alinhadas.",
      en: "You know yourself deeply. Your inner clarity is a beacon for aligned decisions."
    },
    shadow: {
      pt: "Quando desequilibrado, você pode se isolar excessivamente, evitar conexões e se perder em introspecção sem ação.",
      'pt-pt': "Quando desequilibrado, podes isolar-te excessivamente, evitar conexões e perder-te em introspecção sem ação.",
      en: "When imbalanced, you may isolate excessively, avoid connections, and get lost in introspection without action."
    },
    mentalPatterns: {
      pt: "Você processa o mundo através de reflexão interior. Precisa de tempo sozinho para integrar experiências. Sua intuição é forte e geralmente acertada. Quando bloqueada, você se sente desconectado de si mesmo.",
      'pt-pt': "Tu processas o mundo através de reflexão interior. Precisas de tempo sozinho para integrar experiências. A tua intuição é forte e geralmente acertada. Quando bloqueada, sentes-te desconectado de ti mesmo.",
      en: "You process the world through inner reflection. You need time alone to integrate experiences. Your intuition is strong and usually accurate. When blocked, you feel disconnected from yourself."
    },
    learningExpanded: {
      pt: "Você aprende melhor através de reflexão pessoal, escrita introspectiva e tempo para processar. Precisa conectar novos conhecimentos com experiências pessoais para absorvê-los.",
      'pt-pt': "Tu aprendes melhor através de reflexão pessoal, escrita introspectiva e tempo para processar. Precisas conectar novos conhecimentos com experiências pessoais para absorvê-los.",
      en: "You learn best through personal reflection, introspective writing, and time to process. You need to connect new knowledge with personal experiences to absorb it."
    },
    workExpanded: {
      pt: "Produz melhor com autonomia e espaço para reflexão. Trabalhos que exigem autogestão, planejamento pessoal e tomada de decisão independente são ideais. Ambientes muito sociais podem drenar sua energia.",
      'pt-pt': "Produzes melhor com autonomia e espaço para reflexão. Trabalhos que exigem autogestão, planeamento pessoal e tomada de decisão independente são ideais. Ambientes muito sociais podem drenar a tua energia.",
      en: "You produce best with autonomy and space for reflection. Work requiring self-management, personal planning, and independent decision-making is ideal. Very social environments may drain your energy."
    },
    vocationText: {
      pt: "Você nasceu para guiar outros através do autoconhecimento. Sua profundidade interior pode iluminar caminhos para pessoas que buscam clareza sobre si mesmas.",
      'pt-pt': "Tu nasceste para guiar outros através do autoconhecimento. A tua profundidade interior pode iluminar caminhos para pessoas que buscam clareza sobre si mesmas.",
      en: "You were born to guide others through self-knowledge. Your inner depth can illuminate paths for people seeking clarity about themselves."
    },
    expansionPoints: {
      pt: [
        "Pratique compartilhar insights com outros",
        "Desenvolva conexões sociais intencionais",
        "Equilibre introspecção com ação externa",
        "Conecte autoconhecimento com contribuição"
      ],
      'pt-pt': [
        "Pratica partilhar insights com outros",
        "Desenvolve conexões sociais intencionais",
        "Equilibra introspecção com ação externa",
        "Conecta autoconhecimento com contribuição"
      ],
      en: [
        "Practice sharing insights with others",
        "Develop intentional social connections",
        "Balance introspection with external action",
        "Connect self-knowledge with contribution"
      ]
    },
    selfExamQuestion: {
      pt: "Que verdade sobre você mesmo você está evitando olhar?",
      'pt-pt': "Que verdade sobre ti mesmo estás a evitar olhar?",
      en: "What truth about yourself are you avoiding looking at?"
    }
  },
  naturalista: {
    light: {
      pt: "Você percebe conexões que outros ignoram. Sua sensibilidade natural revela padrões da vida.",
      'pt-pt': "Tu percebes conexões que outros ignoram. A tua sensibilidade natural revela padrões da vida.",
      en: "You perceive connections others ignore. Your natural sensitivity reveals life patterns."
    },
    shadow: {
      pt: "Quando desequilibrado, você pode se desconectar de ambientes urbanos e sentir desconforto em espaços artificiais.",
      'pt-pt': "Quando desequilibrado, podes desconectar-te de ambientes urbanos e sentir desconforto em espaços artificiais.",
      en: "When imbalanced, you may disconnect from urban environments and feel discomfort in artificial spaces."
    },
    mentalPatterns: {
      pt: "Você percebe padrões naturais, ciclos e conexões entre sistemas vivos. Sua mente categoriza e entende relações complexas na natureza. Quando bloqueada, você se sente desconectado da vida e dos ciclos naturais.",
      'pt-pt': "Tu percebes padrões naturais, ciclos e conexões entre sistemas vivos. A tua mente categoriza e entende relações complexas na natureza. Quando bloqueada, sentes-te desconectado da vida e dos ciclos naturais.",
      en: "You perceive natural patterns, cycles, and connections between living systems. Your mind categorizes and understands complex relationships in nature. When blocked, you feel disconnected from life and natural cycles."
    },
    learningExpanded: {
      pt: "Você aprende melhor através da observação, classificação e experimentação com sistemas naturais. Precisa de conexão com a natureza para se sentir centrado e focado.",
      'pt-pt': "Tu aprendes melhor através da observação, classificação e experimentação com sistemas naturais. Precisas de conexão com a natureza para te sentires centrado e focado.",
      en: "You learn best through observation, classification, and experimentation with natural systems. You need connection with nature to feel centered and focused."
    },
    workExpanded: {
      pt: "Produz melhor em ambientes com elementos naturais ou conexão com o exterior. Trabalhos em biologia, ecologia, sustentabilidade ou áreas que conectem com sistemas vivos são ideais.",
      'pt-pt': "Produzes melhor em ambientes com elementos naturais ou conexão com o exterior. Trabalhos em biologia, ecologia, sustentabilidade ou áreas que conectem com sistemas vivos são ideais.",
      en: "You produce best in environments with natural elements or outdoor connection. Work in biology, ecology, sustainability, or areas connecting with living systems is ideal."
    },
    vocationText: {
      pt: "Você nasceu para proteger, entender e harmonizar sistemas naturais. Sua sensibilidade ecológica pode guiar comunidades, organizações e sociedades para um futuro sustentável.",
      'pt-pt': "Tu nasceste para proteger, entender e harmonizar sistemas naturais. A tua sensibilidade ecológica pode guiar comunidades, organizações e sociedades para um futuro sustentável.",
      en: "You were born to protect, understand, and harmonize natural systems. Your ecological sensitivity can guide communities, organizations, and societies toward a sustainable future."
    },
    expansionPoints: {
      pt: [
        "Desenvolva adaptação a ambientes urbanos",
        "Pratique encontrar natureza em espaços artificiais",
        "Conecte sensibilidade natural com ação prática",
        "Equilibre contemplação com influência social"
      ],
      'pt-pt': [
        "Desenvolve adaptação a ambientes urbanos",
        "Pratica encontrar natureza em espaços artificiais",
        "Conecta sensibilidade natural com ação prática",
        "Equilibra contemplação com influência social"
      ],
      en: [
        "Develop adaptation to urban environments",
        "Practice finding nature in artificial spaces",
        "Connect natural sensitivity with practical action",
        "Balance contemplation with social influence"
      ]
    },
    selfExamQuestion: {
      pt: "Que ciclo natural da sua vida você está resistindo em vez de aceitar?",
      'pt-pt': "Que ciclo natural da tua vida estás a resistir em vez de aceitar?",
      en: "What natural cycle of your life are you resisting instead of accepting?"
    }
  }
};

export const createInteligenciasPremiumPDF = (
  result: InteligenciasResult,
  userName: string,
  options?: PDFOptions
): jsPDF => {
  const lang = options?.language || 'pt';
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const t = getTranslations(lang);
  const dateLocale = lang === 'en' ? 'en-US' : 'pt-BR';
  const date = new Date().toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  let pageNumber = 0;

  const addPageNumber = () => {
    pageNumber++;
    doc.setFontSize(8);
    doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    doc.text(t.footer, margin, pageHeight - 10);
    doc.text(`${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  };

  const addHeader = (title: string, color = COLORS.primary) => {
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const lines = doc.splitTextToSize(title, contentWidth);
    doc.text(lines, margin, 23);
  };

  const writeWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight = 5): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      doc.text(line, x, y + (index * lineHeight));
    });
    return y + (lines.length * lineHeight);
  };

  // ==========================================
  // CAPA DO RELATÓRIO
  // ==========================================
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative accent line
  doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.rect(0, pageHeight / 3 - 2, pageWidth, 4, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(t.reportTitle, pageWidth / 2, pageHeight / 2 - 50, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(t.subtitle, pageWidth / 2, pageHeight / 2 - 30, { align: "center" });

  // Signature
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text(t.signature, pageWidth / 2, pageHeight / 2 - 15, { align: "center" });

  // User name
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(userName, pageWidth / 2, pageHeight / 2 + 20, { align: "center" });

  // Date
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(date, pageWidth / 2, pageHeight / 2 + 35, { align: "center" });

  // Quote
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  const quoteLines = doc.splitTextToSize(`"${t.quote}"`, contentWidth - 20);
  doc.text(quoteLines, pageWidth / 2, pageHeight - 55, { align: "center" });

  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("NELLO ONE", pageWidth / 2, pageHeight - 30, { align: "center" });

  // ==========================================
  // BLOCO 1 — INTRODUÇÃO DO TESTE
  // ==========================================
  doc.addPage();
  addHeader(t.block1Title);
  addPageNumber();

  let yPos = 50;
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  yPos = writeWrappedText(t.introText1, margin, yPos, contentWidth);
  yPos += 8;
  yPos = writeWrappedText(t.introText2, margin, yPos, contentWidth);
  yPos += 8;
  yPos = writeWrappedText(t.introText3, margin, yPos, contentWidth);

  // ==========================================
  // BLOCO 2 — INTELIGÊNCIA DOMINANTE
  // ==========================================
  doc.addPage();
  addHeader(t.block2Title);
  addPageNumber();

  yPos = 50;
  const dominantKey = result.top1;
  const dominantProfile = getIntelligenceProfile(dominantKey);
  const dominantRank = result.ranking.find(r => r.key === dominantKey);
  const dominantContent = INTELLIGENCE_CONTENT[dominantKey];
  const color = INTELLIGENCE_COLORS[dominantKey] || COLORS.primary;

  if (dominantProfile) {
    // Name with emoji
    doc.setFillColor(color.r, color.g, color.b);
    doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${dominantProfile.emoji} ${dominantProfile.name[lang === 'pt-pt' ? 'pt' : lang]} (${dominantRank?.percentage || 0}%)`, margin + 5, yPos + 13);
    yPos += 30;

    // Description
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(t.whatItMeans, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(dominantProfile.description[lang === 'pt-pt' ? 'pt' : lang], margin, yPos, contentWidth);
    yPos += 8;

    // Strengths
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
    doc.text(t.naturalStrengths, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    dominantProfile.strengths[lang === 'pt-pt' ? 'pt' : lang].forEach(strength => {
      doc.text(`• ${strength}`, margin + 3, yPos);
      yPos += 5;
    });
    yPos += 5;

    // Challenges
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.warning.r, COLORS.warning.g, COLORS.warning.b);
    doc.text(t.attentionPoints, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    dominantProfile.challenges[lang === 'pt-pt' ? 'pt' : lang].forEach(challenge => {
      doc.text(`• ${challenge}`, margin + 3, yPos);
      yPos += 5;
    });
    yPos += 5;

    // Light
    if (dominantContent) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
      doc.text(t.yourLight, margin, yPos);
      yPos += 6;
      doc.setFont("helvetica", "italic");
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      yPos = writeWrappedText(`"${dominantContent.light[lang]}"`, margin, yPos, contentWidth);
    }
  }

  // ==========================================
  // BLOCO 3 — INTELIGÊNCIAS SECUNDÁRIAS
  // ==========================================
  doc.addPage();
  addHeader(t.block3Title);
  addPageNumber();

  yPos = 50;
  const secondaryKeys = [result.top2, result.top3];

  secondaryKeys.forEach((key, index) => {
    const profile = getIntelligenceProfile(key);
    const rank = result.ranking.find(r => r.key === key);
    const intColor = INTELLIGENCE_COLORS[key] || COLORS.primary;

    if (profile && yPos < pageHeight - 80) {
      // Header
      doc.setFillColor(intColor.r, intColor.g, intColor.b);
      doc.roundedRect(margin, yPos, contentWidth, 16, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 2}º ${profile.emoji} ${profile.name[lang === 'pt-pt' ? 'pt' : lang]} (${rank?.percentage || 0}%)`, margin + 5, yPos + 11);
      yPos += 22;

      // Description
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPos = writeWrappedText(profile.description[lang === 'pt-pt' ? 'pt' : lang], margin, yPos, contentWidth);
      yPos += 5;

      // How it influences
      doc.setFont("helvetica", "bold");
      doc.setTextColor(intColor.r, intColor.g, intColor.b);
      doc.text(t.howInfluences, margin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.text(`• ${profile.traits[lang === 'pt-pt' ? 'pt' : lang].join(", ")}`, margin + 3, yPos);
      yPos += 15;
    }
  });

  // ==========================================
  // BLOCO 4 — MAPA VISUAL DAS INTELIGÊNCIAS
  // ==========================================
  doc.addPage();
  addHeader(t.block4Title);
  addPageNumber();

  yPos = 50;
  const barHeight = 18;
  const barGap = 6;

  result.ranking.forEach((item) => {
    const profile = getIntelligenceProfile(item.key);
    if (!profile) return;

    const itemColor = INTELLIGENCE_COLORS[item.key] || COLORS.primary;
    const barWidth = (item.percentage / 100) * (contentWidth - 55);

    // Background bar
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin + 50, yPos, contentWidth - 55, barHeight, 3, 3, "F");

    // Filled bar
    doc.setFillColor(itemColor.r, itemColor.g, itemColor.b);
    doc.roundedRect(margin + 50, yPos, barWidth, barHeight, 3, 3, "F");

    // Intelligence name
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(profile.emoji + " " + profile.name[lang === 'pt-pt' ? 'pt' : lang].substring(0, 10), margin, yPos + 11);

    // Percentage
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    if (item.percentage > 15) {
      doc.text(`${item.percentage}%`, margin + 55, yPos + 12);
    }

    yPos += barHeight + barGap;
  });

  // ==========================================
  // BLOCO 5 — PADRÕES COGNITIVOS E EMOCIONAIS
  // ==========================================
  doc.addPage();
  addHeader(t.block5Title);
  addPageNumber();

  yPos = 50;

  // Miguel intro
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  yPos = writeWrappedText(t.miguelIntro, margin, yPos, contentWidth);
  yPos += 10;

  // Mental patterns from dominant
  if (dominantContent) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    yPos = writeWrappedText(dominantContent.mentalPatterns[lang], margin, yPos, contentWidth);
    yPos += 10;

    // Shadow
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.warning.r, COLORS.warning.g, COLORS.warning.b);
    doc.text(t.shadowTitle, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    yPos = writeWrappedText(dominantContent.shadow[lang], margin, yPos, contentWidth);
  }

  // ==========================================
  // BLOCO 6 — ESTILO DE APRENDIZAGEM
  // ==========================================
  doc.addPage();
  addHeader(t.block6Title);
  addPageNumber();

  yPos = 50;

  if (dominantProfile && dominantContent) {
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(dominantContent.learningExpanded[lang], margin, yPos, contentWidth);
    yPos += 10;

    doc.setFont("helvetica", "bold");
    doc.text(t.practicalTips, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    dominantProfile.developmentTips[lang === 'pt-pt' ? 'pt' : lang].forEach(tip => {
      doc.text(`• ${tip}`, margin + 3, yPos);
      yPos += 6;
    });
  }

  // ==========================================
  // BLOCO 7 — ESTILO DE TRABALHO E DECISÃO
  // ==========================================
  doc.addPage();
  addHeader(t.block7Title);
  addPageNumber();

  yPos = 50;

  if (dominantProfile && dominantContent) {
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(dominantContent.workExpanded[lang], margin, yPos, contentWidth);
    yPos += 10;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    doc.text(t.communicationStyle, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    yPos = writeWrappedText(dominantProfile.communicationStyle[lang === 'pt-pt' ? 'pt' : lang], margin, yPos, contentWidth);
  }

  // ==========================================
  // BLOCO 8 — VOCAÇÃO E TALENTOS NATURAIS
  // ==========================================
  doc.addPage();
  addHeader(t.block8Title);
  addPageNumber();

  yPos = 50;

  if (dominantProfile && dominantContent) {
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    yPos = writeWrappedText(dominantContent.vocationText[lang], margin, yPos, contentWidth);
    yPos += 10;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
    doc.text(t.matchingCareers, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    dominantProfile.careers[lang === 'pt-pt' ? 'pt' : lang].forEach(career => {
      doc.text(`• ${career}`, margin + 3, yPos);
      yPos += 5;
    });
  }

  // ==========================================
  // BLOCO 9 — PONTOS DE EXPANSÃO
  // ==========================================
  doc.addPage();
  addHeader(t.block9Title);
  addPageNumber();

  yPos = 50;

  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  yPos = writeWrappedText(t.expansionIntro, margin, yPos, contentWidth);
  yPos += 10;

  if (dominantContent) {
    dominantContent.expansionPoints[lang].forEach((point, index) => {
      doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
      doc.circle(margin + 3, yPos - 1, 2, "F");
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.text(point, margin + 10, yPos);
      yPos += 10;
    });
  }

  // ==========================================
  // BLOCO 10 — PLANO DE 7 DIAS
  // ==========================================
  doc.addPage();
  addHeader(t.block10Title);
  addPageNumber();

  yPos = 50;
  const sevenDayPlan = getSevenDayPlan(lang, dominantKey);

  sevenDayPlan.forEach((day, index) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      addHeader(t.block10Title + ` (${t.continued})`);
      addPageNumber();
      yPos = 50;
    }

    doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    doc.roundedRect(margin, yPos, 25, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${t.day} ${index + 1}`, margin + 3, yPos + 8);

    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(day.title, margin + 30, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    yPos = writeWrappedText(day.action, margin + 30, yPos + 11, contentWidth - 35, 4);
    yPos += 8;
  });

  // ==========================================
  // BLOCO 11 — PERGUNTA DE AUTOEXAME
  // ==========================================
  doc.addPage();
  addHeader(t.block11Title);
  addPageNumber();

  yPos = pageHeight / 2 - 30;

  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, yPos - 20, contentWidth, 60, 5, 5, "F");

  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  
  if (dominantContent) {
    const questionLines = doc.splitTextToSize(`"${dominantContent.selfExamQuestion[lang]}"`, contentWidth - 20);
    doc.text(questionLines, pageWidth / 2, yPos, { align: "center" });
  }

  // ==========================================
  // BLOCO 12 — ENCERRAMENTO COM MIGUEL
  // ==========================================
  doc.addPage();
  addHeader(t.block12Title);
  addPageNumber();

  yPos = pageHeight / 2 - 40;

  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const closingLines = doc.splitTextToSize(t.closingText, contentWidth - 20);
  doc.text(closingLines, pageWidth / 2, yPos, { align: "center" });

  yPos += 40;

  // Final signature
  doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.rect(pageWidth / 2 - 30, yPos, 60, 1, "F");
  yPos += 15;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text("Miguel", pageWidth / 2, yPos, { align: "center" });
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
  doc.text(t.miguelSignature, pageWidth / 2, yPos, { align: "center" });

  return doc;
};

// Wrapper function for download
export const generateInteligenciasPremiumPDF = (
  result: InteligenciasResult,
  userName: string,
  options?: PDFOptions
): void => {
  const doc = createInteligenciasPremiumPDF(result, userName, options);
  const lang = options?.language || 'pt';
  const fileName = lang === 'en' 
    ? `NELLO_ONE_Multiple_Intelligences_${userName.replace(/\s+/g, '_')}.pdf`
    : `NELLO_ONE_Inteligencias_Multiplas_${userName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};

function getTranslations(lang: 'pt' | 'pt-pt' | 'en') {
  const translations = {
    pt: {
      reportTitle: "Inteligências Múltiplas",
      subtitle: "Descubra como sua mente funciona",
      signature: "Por Miguel, seu guia no Nello One",
      quote: "Cada inteligência é uma forma única de manifestar a sabedoria que existe dentro de você.",
      footer: "Nello.one – Clareza gera poder.",
      block1Title: "Introdução do Teste",
      block2Title: "Sua Inteligência Dominante",
      block3Title: "Suas Inteligências Secundárias",
      block4Title: "Mapa Visual das Inteligências",
      block5Title: "Padrões Cognitivos e Emocionais",
      block6Title: "Seu Estilo de Aprendizagem",
      block7Title: "Estilo de Trabalho e Decisão",
      block8Title: "Vocação e Talentos Naturais",
      block9Title: "Pontos de Expansão",
      block10Title: "Plano de Expansão — 7 Dias",
      block11Title: "Pergunta de Autoexame",
      block12Title: "Encerramento com Miguel",
      introText1: "Este relatório revela como sua mente opera. Ele mostra seus tipos de inteligência mais fortes, os que estão em desenvolvimento e aqueles que precisam de atenção.",
      introText2: "Cada inteligência é uma habilidade natural de perceber, interpretar e transformar o mundo. Esse relatório não é sobre certo ou errado, alto ou baixo.",
      introText3: "É sobre como você aprende, cria, se conecta e resolve problemas.",
      whatItMeans: "O que isso significa:",
      naturalStrengths: "Forças Naturais:",
      attentionPoints: "Pontos de Atenção:",
      yourLight: "Sua Luz:",
      howInfluences: "Como influencia sua inteligência principal:",
      miguelIntro: "Sua mente funciona como um campo de energia onde cada inteligência acende um aspecto seu. Quando sua inteligência dominante está ativa, tudo flui. Quando ela é bloqueada, seu corpo, sua motivação e sua clareza diminuem.",
      shadowTitle: "Quando desequilibrado:",
      practicalTips: "Dicas práticas:",
      communicationStyle: "Como você se comunica:",
      matchingCareers: "Carreiras que combinam:",
      expansionIntro: "Estes são os pontos específicos para seu desenvolvimento:",
      day: "Dia",
      continued: "continuação",
      closingText: "Sua mente é um presente. Conhecer suas inteligências é honrar a sabedoria que Deus colocou dentro de você. Cada forma de inteligência é uma janela para sua essência.",
      miguelSignature: "Seu guia no Nello One"
    },
    'pt-pt': {
      reportTitle: "Inteligências Múltiplas",
      subtitle: "Descobre como a tua mente funciona",
      signature: "Por Miguel, o teu guia no Nello One",
      quote: "Cada inteligência é uma forma única de manifestar a sabedoria que existe dentro de ti.",
      footer: "Nello.one – Clareza gera poder.",
      block1Title: "Introdução do Teste",
      block2Title: "A Tua Inteligência Dominante",
      block3Title: "As Tuas Inteligências Secundárias",
      block4Title: "Mapa Visual das Inteligências",
      block5Title: "Padrões Cognitivos e Emocionais",
      block6Title: "O Teu Estilo de Aprendizagem",
      block7Title: "Estilo de Trabalho e Decisão",
      block8Title: "Vocação e Talentos Naturais",
      block9Title: "Pontos de Expansão",
      block10Title: "Plano de Expansão — 7 Dias",
      block11Title: "Pergunta de Autoexame",
      block12Title: "Encerramento com Miguel",
      introText1: "Este relatório revela como a tua mente opera. Mostra os teus tipos de inteligência mais fortes, os que estão em desenvolvimento e aqueles que precisam de atenção.",
      introText2: "Cada inteligência é uma habilidade natural de perceber, interpretar e transformar o mundo. Este relatório não é sobre certo ou errado, alto ou baixo.",
      introText3: "É sobre como tu aprendes, crias, te conectas e resolves problemas.",
      whatItMeans: "O que isso significa:",
      naturalStrengths: "Forças Naturais:",
      attentionPoints: "Pontos de Atenção:",
      yourLight: "A Tua Luz:",
      howInfluences: "Como influencia a tua inteligência principal:",
      miguelIntro: "A tua mente funciona como um campo de energia onde cada inteligência acende um aspecto teu. Quando a tua inteligência dominante está ativa, tudo flui. Quando ela é bloqueada, o teu corpo, a tua motivação e a tua clareza diminuem.",
      shadowTitle: "Quando desequilibrado:",
      practicalTips: "Dicas práticas:",
      communicationStyle: "Como te comunicas:",
      matchingCareers: "Carreiras que combinam:",
      expansionIntro: "Estes são os pontos específicos para o teu desenvolvimento:",
      day: "Dia",
      continued: "continuação",
      closingText: "A tua mente é um presente. Conhecer as tuas inteligências é honrar a sabedoria que Deus colocou dentro de ti. Cada forma de inteligência é uma janela para a tua essência.",
      miguelSignature: "O teu guia no Nello One"
    },
    en: {
      reportTitle: "Multiple Intelligences",
      subtitle: "Discover how your mind works",
      signature: "By Miguel, your guide at Nello One",
      quote: "Each intelligence is a unique way to manifest the wisdom that exists within you.",
      footer: "Nello.one – Clarity generates power.",
      block1Title: "Test Introduction",
      block2Title: "Your Dominant Intelligence",
      block3Title: "Your Secondary Intelligences",
      block4Title: "Visual Map of Intelligences",
      block5Title: "Cognitive and Emotional Patterns",
      block6Title: "Your Learning Style",
      block7Title: "Work and Decision Style",
      block8Title: "Vocation and Natural Talents",
      block9Title: "Expansion Points",
      block10Title: "7-Day Expansion Plan",
      block11Title: "Self-Exam Question",
      block12Title: "Closing with Miguel",
      introText1: "This report reveals how your mind operates. It shows your strongest intelligence types, those in development, and those needing attention.",
      introText2: "Each intelligence is a natural ability to perceive, interpret, and transform the world. This report is not about right or wrong, high or low.",
      introText3: "It's about how you learn, create, connect, and solve problems.",
      whatItMeans: "What this means:",
      naturalStrengths: "Natural Strengths:",
      attentionPoints: "Attention Points:",
      yourLight: "Your Light:",
      howInfluences: "How it influences your main intelligence:",
      miguelIntro: "Your mind works like an energy field where each intelligence ignites an aspect of you. When your dominant intelligence is active, everything flows. When blocked, your body, motivation, and clarity diminish.",
      shadowTitle: "When imbalanced:",
      practicalTips: "Practical tips:",
      communicationStyle: "How you communicate:",
      matchingCareers: "Matching careers:",
      expansionIntro: "These are the specific points for your development:",
      day: "Day",
      continued: "continued",
      closingText: "Your mind is a gift. Knowing your intelligences is honoring the wisdom God placed within you. Each form of intelligence is a window to your essence.",
      miguelSignature: "Your guide at Nello One"
    }
  };

  return translations[lang];
}

function getSevenDayPlan(lang: 'pt' | 'pt-pt' | 'en', intelligenceKey: string): { title: string; action: string }[] {
  const plans: Record<'pt' | 'pt-pt' | 'en', { title: string; action: string }[]> = {
    pt: [
      { title: "Ressalte sua inteligência dominante", action: "Faça uma atividade que use plenamente sua inteligência mais forte. Observe como você se sente." },
      { title: "Acesse uma inteligência secundária", action: "Pratique algo fora da sua zona de conforto usando sua segunda inteligência mais forte." },
      { title: "Reduza bloqueios", action: "Identifique uma situação onde sua inteligência dominante fica bloqueada. Observe sem julgamento." },
      { title: "Reorganização cognitiva", action: "Reorganize uma tarefa do dia usando sua forma natural de pensar. Note a diferença." },
      { title: "Microdesafio prático", action: "Resolva um problema real usando conscientemente sua inteligência dominante." },
      { title: "Clareza emocional", action: "Reflita sobre como suas inteligências afetam suas emoções e relacionamentos." },
      { title: "Síntese e celebração", action: "Escreva 3 insights sobre si mesmo que descobriu esta semana. Celebre seu autoconhecimento." }
    ],
    'pt-pt': [
      { title: "Ressalta a tua inteligência dominante", action: "Faz uma atividade que use plenamente a tua inteligência mais forte. Observa como te sentes." },
      { title: "Acede a uma inteligência secundária", action: "Pratica algo fora da tua zona de conforto usando a tua segunda inteligência mais forte." },
      { title: "Reduz bloqueios", action: "Identifica uma situação onde a tua inteligência dominante fica bloqueada. Observa sem julgamento." },
      { title: "Reorganização cognitiva", action: "Reorganiza uma tarefa do dia usando a tua forma natural de pensar. Nota a diferença." },
      { title: "Microdesafio prático", action: "Resolve um problema real usando conscientemente a tua inteligência dominante." },
      { title: "Clareza emocional", action: "Reflete sobre como as tuas inteligências afetam as tuas emoções e relacionamentos." },
      { title: "Síntese e celebração", action: "Escreve 3 insights sobre ti mesmo que descobriste esta semana. Celebra o teu autoconhecimento." }
    ],
    en: [
      { title: "Highlight your dominant intelligence", action: "Do an activity that fully uses your strongest intelligence. Notice how you feel." },
      { title: "Access a secondary intelligence", action: "Practice something outside your comfort zone using your second strongest intelligence." },
      { title: "Reduce blocks", action: "Identify a situation where your dominant intelligence gets blocked. Observe without judgment." },
      { title: "Cognitive reorganization", action: "Reorganize a daily task using your natural way of thinking. Note the difference." },
      { title: "Practical micro-challenge", action: "Solve a real problem consciously using your dominant intelligence." },
      { title: "Emotional clarity", action: "Reflect on how your intelligences affect your emotions and relationships." },
      { title: "Synthesis and celebration", action: "Write 3 insights about yourself you discovered this week. Celebrate your self-knowledge." }
    ]
  };

  return plans[lang];
}
