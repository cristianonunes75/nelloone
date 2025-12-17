// Biblioteca de textos dinâmicos para cada arquétipo
// Usado na tela de Resultado Parcial para exibir descrições personalizadas

export interface ArchetypeCopy {
  titleDisplay: string;
  emoji: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
}

export const ARCHETYPE_COPY_LIBRARY: Record<string, ArchetypeCopy> = {
  Governante: {
    titleDisplay: "O Governante",
    emoji: "👑",
    textPrimary: "Você atua com senso de responsabilidade, direção e controle. Sua presença naturalmente busca organizar, liderar e sustentar decisões com visão estratégica. Quando equilibrado, você constrói estabilidade e confiança ao seu redor.",
    textSecondary: "O Governante aparece em você como uma força que organiza e estrutura situações quando necessário. Você sabe assumir a liderança nos momentos certos, oferecendo direção e segurança para quem está ao redor.",
    textTertiary: "Este arquétipo se manifesta de forma sutil, trazendo momentos de clareza estratégica e senso de responsabilidade em contextos pontuais da sua vida."
  },
  Herói: {
    titleDisplay: "O Herói",
    emoji: "🦸",
    textPrimary: "Existe em você uma força de ação e superação. Você enfrenta desafios com coragem, determinado a superar obstáculos e alcançar grandes feitos. Sua energia impulsiona você a seguir em frente mesmo com esforço.",
    textSecondary: "O Herói aparece em você quando é preciso enfrentar desafios, assumir riscos e agir com determinação. Essa força complementar surge nos momentos que exigem coragem e resiliência.",
    textTertiary: "Este arquétipo se manifesta em momentos específicos, trazendo impulsos de coragem e ação quando situações exigem superação."
  },
  Criador: {
    titleDisplay: "O Criador",
    emoji: "🎨",
    textPrimary: "Você é movido pela necessidade de expressar sua visão única e deixar sua marca criativa no mundo. Sua essência busca originalidade, inovação e autenticidade em tudo o que faz.",
    textSecondary: "O Criador aparece em você como uma força que busca expressar algo original. Quando ativado, você encontra soluções inovadoras e formas únicas de se manifestar.",
    textTertiary: "Este arquétipo se manifesta de forma sutil, trazendo lampejos de criatividade e originalidade em situações pontuais."
  },
  Mago: {
    titleDisplay: "O Mago",
    emoji: "✨",
    textPrimary: "Você tem o dom de transformar sonhos em realidade, vendo possibilidades onde outros veem limitações. Sua intuição forte te guia para catalisar mudanças significativas ao seu redor.",
    textSecondary: "O Mago aparece em você como uma força transformadora. Você consegue perceber conexões ocultas e criar mudanças que pareciam impossíveis quando essa energia é ativada.",
    textTertiary: "Este arquétipo se manifesta em momentos específicos, trazendo insights intuitivos e percepções transformadoras."
  },
  Inocente: {
    titleDisplay: "O Inocente",
    emoji: "🌟",
    textPrimary: "Você mantém uma visão otimista da vida, buscando simplicidade, alegria e confiança no bem. Sua essência preserva a capacidade de ver o mundo com esperança e autenticidade.",
    textSecondary: "O Inocente aparece em você como uma força que renova a esperança e busca simplicidade. Essa energia traz leveza e confiança nos momentos necessários.",
    textTertiary: "Este arquétipo se manifesta de forma sutil, trazendo momentos de leveza e otimismo genuíno em situações pontuais."
  },
  Sábio: {
    titleDisplay: "O Sábio",
    emoji: "📚",
    textPrimary: "Você busca constantemente conhecimento e compreensão profunda do mundo. Sua essência valoriza verdade e sabedoria, e você naturalmente se torna um mentor para outros.",
    textSecondary: "O Sábio aparece em você como uma força reflexiva e analítica. Quando essa energia é ativada, você busca entender situações em profundidade antes de agir.",
    textTertiary: "Este arquétipo se manifesta em momentos específicos, trazendo clareza mental e busca por compreensão quando necessário."
  },
  Explorador: {
    titleDisplay: "O Explorador",
    emoji: "🧭",
    textPrimary: "Você é movido pela necessidade de descobrir, experienciar e se aventurar além dos limites conhecidos. Sua essência busca liberdade, independência e experiências autênticas.",
    textSecondary: "O Explorador aparece em você como uma força que busca novos horizontes. Quando ativado, você sente o impulso de expandir seus limites e descobrir o desconhecido.",
    textTertiary: "Este arquétipo se manifesta de forma sutil, trazendo inquietação positiva e desejo de novidade em situações pontuais."
  },
  Rebelde: {
    titleDisplay: "O Rebelde",
    emoji: "⚡",
    textPrimary: "Você desafia convenções e busca transformação, questionando o status quo e criando seu próprio caminho. Sua essência valoriza autenticidade radical e mudança necessária.",
    textSecondary: "O Rebelde aparece em você como uma força que questiona e desafia. Quando essa energia é ativada, você encontra coragem para romper com o que não serve mais.",
    textTertiary: "Este arquétipo se manifesta em momentos específicos, trazendo impulsos de questionamento e ruptura com padrões limitantes."
  },
  Amante: {
    titleDisplay: "O Amante",
    emoji: "❤️",
    textPrimary: "Você vive com intensidade e paixão, valorizando profundamente as conexões emocionais e experiências sensoriais da vida. Sua essência busca beleza, intimidade e prazer genuíno.",
    textSecondary: "O Amante aparece em você como uma força que intensifica conexões. Quando ativado, você se entrega às experiências com profundidade emocional e sensibilidade.",
    textTertiary: "Este arquétipo se manifesta de forma sutil, trazendo momentos de conexão profunda e apreciação estética em situações pontuais."
  },
  Prestativo: {
    titleDisplay: "O Prestativo",
    emoji: "🤗",
    textPrimary: "Você encontra propósito em ajudar os outros, oferecendo suporte e cuidado com generosidade. Sua essência se realiza quando pode conectar, apoiar e nutrir quem precisa.",
    textSecondary: "O Prestativo aparece em você como uma força de cuidado genuíno. Quando ativado, você naturalmente oferece apoio e se coloca disponível para ajudar.",
    textTertiary: "Este arquétipo se manifesta em momentos específicos, trazendo impulsos de cuidado e generosidade em situações que pedem suporte."
  },
  "Bobo da Corte": {
    titleDisplay: "O Bobo da Corte",
    emoji: "🎭",
    textPrimary: "Você traz leveza e alegria para a vida, valorizando o humor e a capacidade de não se levar tão a sério. Sua essência celebra o momento presente com espontaneidade e diversão.",
    textSecondary: "O Bobo da Corte aparece em você como uma força que traz leveza. Quando ativado, você consegue transformar situações pesadas em momentos mais leves e divertidos.",
    textTertiary: "Este arquétipo se manifesta de forma sutil, trazendo humor e espontaneidade em momentos pontuais que precisam de leveza."
  },
  "Homem Comum": {
    titleDisplay: "O Homem Comum",
    emoji: "👤",
    textPrimary: "Você valoriza autenticidade e pertencimento, buscando conexão genuína com os outros através da simplicidade. Sua essência prefere igualdade e relações horizontais.",
    textSecondary: "O Homem Comum aparece em você como uma força de conexão autêntica. Quando ativado, você busca pertencimento e relações verdadeiras, sem pretensões.",
    textTertiary: "Este arquétipo se manifesta em momentos específicos, trazendo desejo de simplicidade e conexão genuína em contextos pontuais."
  },
  Realista: {
    titleDisplay: "O Realista",
    emoji: "🎯",
    textPrimary: "Você valoriza praticidade e pés no chão, buscando soluções concretas e funcionais. Sua essência prefere o que é tangível e comprova seu valor na prática.",
    textSecondary: "O Realista aparece em você como uma força de pragmatismo. Quando ativado, você busca soluções práticas e mantém o foco no que realmente funciona.",
    textTertiary: "Este arquétipo se manifesta de forma sutil, trazendo senso de realidade e praticidade em situações que pedem objetividade."
  },
  Cuidador: {
    titleDisplay: "O Cuidador",
    emoji: "💚",
    textPrimary: "Você encontra propósito em nutrir e proteger os outros, oferecendo cuidado genuíno e suporte emocional. Sua essência se realiza quando pode estar presente para quem precisa.",
    textSecondary: "O Cuidador aparece em você como uma força de proteção e nutrição. Quando ativado, você se dedica ao bem estar de quem está ao seu redor.",
    textTertiary: "Este arquétipo se manifesta em momentos específicos, trazendo impulsos de cuidado e proteção em situações que pedem acolhimento."
  },
  Comediante: {
    titleDisplay: "O Comediante",
    emoji: "😄",
    textPrimary: "Você traz humor e perspectiva leve para a vida, valorizando a capacidade de fazer os outros rirem e encontrar graça nas situações. Sua essência celebra a alegria e a descontração.",
    textSecondary: "O Comediante aparece em você como uma força de humor e leveza. Quando ativado, você consegue trazer perspectiva mais leve e divertida para situações.",
    textTertiary: "Este arquétipo se manifesta de forma sutil, trazendo humor e capacidade de aliviar tensões em momentos pontuais."
  }
};

// Texto de fallback quando o arquétipo não está mapeado na biblioteca
export const FALLBACK_TEXT = {
  primary: "Este arquétipo influencia sua forma de perceber, reagir e se posicionar em situações do dia a dia. Ao longo da jornada, você verá como ele se manifesta em diferentes áreas da sua vida.",
  secondary: "Este arquétipo influencia sua forma de perceber e reagir em contextos específicos. Ao longo da jornada, você perceberá como essa força complementar atua na sua vida.",
  tertiary: "Este arquétipo se manifesta de forma mais sutil, influenciando reações específicas e contextos pontuais da sua vida."
};

// Função helper para obter o texto do arquétipo
export function getArchetypeCopy(archetypeName: string): ArchetypeCopy | null {
  return ARCHETYPE_COPY_LIBRARY[archetypeName] || null;
}

// Função helper para obter o texto com fallback
export function getArchetypeText(
  archetypeName: string, 
  role: 'primary' | 'secondary' | 'tertiary'
): string {
  const copy = ARCHETYPE_COPY_LIBRARY[archetypeName];
  if (copy) {
    return role === 'primary' ? copy.textPrimary : 
           role === 'secondary' ? copy.textSecondary : 
           copy.textTertiary;
  }
  return FALLBACK_TEXT[role];
}

// Função helper para obter emoji com fallback
export function getArchetypeEmoji(archetypeName: string): string {
  return ARCHETYPE_COPY_LIBRARY[archetypeName]?.emoji || "✴️";
}

// Função helper para obter título com fallback
export function getArchetypeTitle(archetypeName: string): string {
  return ARCHETYPE_COPY_LIBRARY[archetypeName]?.titleDisplay || archetypeName;
}
