// Inteligências Múltiplas - Howard Gardner's Theory
// 8 intelligences with 5 questions each (40 total)
// Textos profundos e específicos para identificação real

export interface IntelligenceProfile {
  key: string;
  name: {
    pt: string;
    en: string;
  };
  emoji: string;
  shortDescription: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
  traits: {
    pt: string[];
    en: string[];
  };
  careers: {
    pt: string[];
    en: string[];
  };
  learningStyle: {
    pt: string;
    en: string;
  };
  workStyle: {
    pt: string;
    en: string;
  };
  communicationStyle: {
    pt: string;
    en: string;
  };
  strengths: {
    pt: string[];
    en: string[];
  };
  challenges: {
    pt: string[];
    en: string[];
  };
  developmentTips: {
    pt: string[];
    en: string[];
  };
  // Novos campos para profundidade
  deepPatterns: {
    pt: string[];
    en: string[];
  };
  excessBehaviors: {
    pt: string[];
    en: string[];
  };
  identificationPhrases: {
    pt: string[];
    en: string[];
  };
  practicalApplications: {
    pt: {
      learning: string;
      problemSolving: string;
      workProjects: string;
    };
    en: {
      learning: string;
      problemSolving: string;
      workProjects: string;
    };
  };
  developmentPractice: {
    pt: { strong: string; weak: string };
    en: { strong: string; weak: string };
  };
}

export const INTELLIGENCES: Record<string, IntelligenceProfile> = {
  linguistica: {
    key: "linguistica",
    name: { pt: "Linguística", en: "Linguistic" },
    emoji: "📝",
    shortDescription: {
      pt: "Facilidade com palavras, escrita e comunicação verbal",
      en: "Facility with words, writing, and verbal communication"
    },
    description: {
      pt: "Você pensa em palavras. Literalmente. Quando processa uma ideia, já está formulando frases na cabeça. Tem facilidade natural para explicar conceitos, contar histórias e encontrar a palavra certa no momento certo. O problema é que às vezes você vive tanto no mundo das palavras que esquece de agir. Planeja, discute, escreve, mas a execução fica para depois.",
      en: "You think in words. Literally. When processing an idea, you're already formulating sentences in your head. You have a natural facility for explaining concepts, telling stories, and finding the right word at the right time. The problem is that sometimes you live so much in the world of words that you forget to act. You plan, discuss, write, but execution is left for later."
    },
    traits: {
      pt: ["Articulado", "Persuasivo", "Expressivo", "Literário", "Comunicativo"],
      en: ["Articulate", "Persuasive", "Expressive", "Literary", "Communicative"]
    },
    careers: {
      pt: ["Escritor", "Jornalista", "Advogado", "Professor", "Palestrante", "Tradutor", "Editor", "Roteirista"],
      en: ["Writer", "Journalist", "Lawyer", "Teacher", "Speaker", "Translator", "Editor", "Screenwriter"]
    },
    learningStyle: {
      pt: "Aprende melhor lendo, escrevendo, ouvindo palestras e participando de debates. Anotações detalhadas e resumos são suas ferramentas.",
      en: "Learns best by reading, writing, listening to lectures, and participating in debates. Detailed notes and summaries are your tools."
    },
    workStyle: {
      pt: "Produz melhor em ambientes que valorizam comunicação clara, documentação e expressão de ideias. Prefere trabalhos que envolvam escrita, apresentação ou persuasão.",
      en: "Produces best in environments that value clear communication, documentation, and expression of ideas. Prefers work involving writing, presentation, or persuasion."
    },
    communicationStyle: {
      pt: "Comunica-se de forma clara e estruturada. Usa metáforas e histórias para ilustrar pontos. Tem facilidade em adaptar a linguagem ao público.",
      en: "Communicates clearly and in a structured way. Uses metaphors and stories to illustrate points. Easily adapts language to the audience."
    },
    strengths: {
      pt: ["Escrita clara e persuasiva", "Oratória natural", "Memorização através de palavras", "Argumentação lógica", "Sensibilidade poética"],
      en: ["Clear and persuasive writing", "Natural oratory", "Memorization through words", "Logical argumentation", "Poetic sensitivity"]
    },
    challenges: {
      pt: ["Pode se perder em palavras sem ação", "Tendência a intelectualizar emoções", "Dificuldade com tarefas práticas não-verbais"],
      en: ["May get lost in words without action", "Tendency to intellectualize emotions", "Difficulty with practical non-verbal tasks"]
    },
    developmentTips: {
      pt: ["Escreva diariamente um diário", "Leia gêneros variados", "Pratique oratória", "Aprenda um novo idioma", "Experimente poesia ou storytelling"],
      en: ["Keep a daily journal", "Read varied genres", "Practice public speaking", "Learn a new language", "Try poetry or storytelling"]
    },
    deepPatterns: {
      pt: [
        "Você provavelmente foi a criança que adorava ler ou contar histórias.",
        "Quando precisa processar algo importante, você escreve ou fala em voz alta.",
        "Fica frustrado quando outros não conseguem se expressar com clareza.",
        "Tem facilidade para aprender idiomas ou captar nuances de linguagem."
      ],
      en: [
        "You were probably the child who loved reading or telling stories.",
        "When you need to process something important, you write or speak out loud.",
        "You get frustrated when others can't express themselves clearly.",
        "You easily learn languages or catch language nuances."
      ]
    },
    excessBehaviors: {
      pt: [
        "Falar demais sobre fazer ao invés de realmente fazer.",
        "Usar palavras para evitar confronto emocional direto.",
        "Sobrescrever e sobreexplicar quando menos seria mais.",
        "Julgar outros pela forma como se expressam."
      ],
      en: [
        "Talking too much about doing instead of actually doing.",
        "Using words to avoid direct emotional confrontation.",
        "Overwriting and overexplaining when less would be more.",
        "Judging others by how they express themselves."
      ]
    },
    identificationPhrases: {
      pt: [
        "Você provavelmente se reconhece quando consegue explicar algo complexo de forma simples e vê os olhos do outro brilharem de compreensão.",
        "Você provavelmente se reconhece quando encontra exatamente a palavra certa que captura um sentimento.",
        "Você provavelmente se reconhece quando prefere ler as instruções ao invés de ir tentando."
      ],
      en: [
        "You probably recognize yourself when you can explain something complex simply and see the other's eyes light up with understanding.",
        "You probably recognize yourself when you find exactly the right word that captures a feeling.",
        "You probably recognize yourself when you prefer reading instructions instead of just trying."
      ]
    },
    practicalApplications: {
      pt: {
        learning: "Você aprende melhor quando pode ler, escrever resumos ou explicar o conteúdo para alguém. Grave áudios para si mesmo ou crie flashcards com definições.",
        problemSolving: "Quando enfrenta um problema, você tende a escrever sobre ele, listar opções ou conversar para clarear as ideias. Use isso: antes de decidir, escreva prós e contras.",
        workProjects: "Seu diferencial está na comunicação. Ofereça-se para escrever relatórios, fazer apresentações ou traduzir conceitos técnicos para linguagem acessível."
      },
      en: {
        learning: "You learn best when you can read, write summaries, or explain content to someone. Record audios for yourself or create flashcards with definitions.",
        problemSolving: "When facing a problem, you tend to write about it, list options, or talk to clarify ideas. Use this: before deciding, write pros and cons.",
        workProjects: "Your differentiator is communication. Offer to write reports, make presentations, or translate technical concepts into accessible language."
      }
    },
    developmentPractice: {
      pt: {
        strong: "Escreva 15 minutos por dia sobre qualquer tema. Não para publicar, só para exercitar. Sua mente verbal precisa de vazão regular.",
        weak: "Quando perceber que está só falando sobre fazer, pare e faça uma ação concreta, mesmo pequena. Equilibre palavras com ação."
      },
      en: {
        strong: "Write 15 minutes a day about any topic. Not to publish, just to exercise. Your verbal mind needs regular outlet.",
        weak: "When you notice you're just talking about doing, stop and take a concrete action, even a small one. Balance words with action."
      }
    }
  },
  logico_matematica: {
    key: "logico_matematica",
    name: { pt: "Lógico-Matemática", en: "Logical-Mathematical" },
    emoji: "🧮",
    shortDescription: {
      pt: "Pensamento analítico, padrões e resolução de problemas",
      en: "Analytical thinking, patterns, and problem-solving"
    },
    description: {
      pt: "Sua mente funciona em padrões. Você vê conexões que outros não veem, encontra sequências no caos e sente satisfação genuína quando resolve um problema complexo. O mundo faz mais sentido quando você consegue explicar o porquê das coisas. O problema é que nem tudo tem lógica, e às vezes você força explicações racionais para situações que pedem intuição ou emoção.",
      en: "Your mind works in patterns. You see connections others don't, find sequences in chaos, and feel genuine satisfaction when solving a complex problem. The world makes more sense when you can explain why things happen. The problem is that not everything is logical, and sometimes you force rational explanations for situations that call for intuition or emotion."
    },
    traits: {
      pt: ["Analítico", "Estratégico", "Racional", "Sistemático", "Investigativo"],
      en: ["Analytical", "Strategic", "Rational", "Systematic", "Investigative"]
    },
    careers: {
      pt: ["Cientista", "Engenheiro", "Programador", "Contador", "Economista", "Analista de Dados", "Matemático", "Pesquisador"],
      en: ["Scientist", "Engineer", "Programmer", "Accountant", "Economist", "Data Analyst", "Mathematician", "Researcher"]
    },
    learningStyle: {
      pt: "Aprende através de experimentação, resolução de problemas e análise de dados. Precisa entender o 'porquê' antes de aceitar qualquer informação.",
      en: "Learns through experimentation, problem-solving, and data analysis. Needs to understand the 'why' before accepting any information."
    },
    workStyle: {
      pt: "Prospera em ambientes que valorizam lógica, eficiência e resolução de problemas. Prefere projetos com métricas claras e objetivos mensuráveis.",
      en: "Thrives in environments that value logic, efficiency, and problem-solving. Prefers projects with clear metrics and measurable goals."
    },
    communicationStyle: {
      pt: "Comunicação direta e objetiva. Prefere fatos a opiniões. Organiza informações de forma estruturada e sequencial.",
      en: "Direct and objective communication. Prefers facts to opinions. Organizes information in a structured and sequential way."
    },
    strengths: {
      pt: ["Resolução de problemas complexos", "Análise de dados", "Pensamento estratégico", "Detecção de padrões", "Tomada de decisão racional"],
      en: ["Complex problem-solving", "Data analysis", "Strategic thinking", "Pattern detection", "Rational decision-making"]
    },
    challenges: {
      pt: ["Pode parecer frio ou distante", "Dificuldade com ambiguidade", "Tendência a subestimar emoções", "Impaciência com processos lentos"],
      en: ["May seem cold or distant", "Difficulty with ambiguity", "Tendency to underestimate emotions", "Impatience with slow processes"]
    },
    developmentTips: {
      pt: ["Pratique jogos de estratégia", "Aprenda programação", "Estude estatística", "Desafie-se com quebra-cabeças", "Analise problemas do cotidiano"],
      en: ["Practice strategy games", "Learn programming", "Study statistics", "Challenge yourself with puzzles", "Analyze everyday problems"]
    },
    deepPatterns: {
      pt: [
        "Você provavelmente era a criança que perguntava 'por quê?' até os adultos desistirem.",
        "Quando algo não faz sentido, você não consegue simplesmente aceitar.",
        "Sente desconforto com decisões 'de feeling' sem justificativa lógica.",
        "Percebe erros em cálculos ou argumentos que outros deixam passar."
      ],
      en: [
        "You were probably the child who asked 'why?' until adults gave up.",
        "When something doesn't make sense, you can't just accept it.",
        "You feel discomfort with 'gut feeling' decisions without logical justification.",
        "You notice errors in calculations or arguments that others miss."
      ]
    },
    excessBehaviors: {
      pt: [
        "Racionalizar emoções ao invés de senti-las.",
        "Paralisar em análise eterna buscando a decisão perfeita.",
        "Menosprezar intuição ou decisões emocionais de outros.",
        "Ficar frustrado quando a realidade não segue a lógica."
      ],
      en: [
        "Rationalizing emotions instead of feeling them.",
        "Paralyzing in eternal analysis seeking the perfect decision.",
        "Belittling intuition or emotional decisions of others.",
        "Getting frustrated when reality doesn't follow logic."
      ]
    },
    identificationPhrases: {
      pt: [
        "Você provavelmente se reconhece quando encontra um padrão que ninguém tinha percebido e sente aquela satisfação silenciosa.",
        "Você provavelmente se reconhece quando alguém te dá uma explicação e você já está pensando nas falhas do argumento.",
        "Você provavelmente se reconhece quando prefere uma planilha organizada a uma lista rabiscada."
      ],
      en: [
        "You probably recognize yourself when you find a pattern no one had noticed and feel that silent satisfaction.",
        "You probably recognize yourself when someone gives you an explanation and you're already thinking about the flaws in the argument.",
        "You probably recognize yourself when you prefer an organized spreadsheet to a scribbled list."
      ]
    },
    practicalApplications: {
      pt: {
        learning: "Você aprende melhor quando pode estruturar a informação em categorias, ver a lógica por trás dos conceitos e resolver problemas práticos. Crie mapas mentais com conexões causais.",
        problemSolving: "Quando enfrenta um problema, você naturalmente quebra em partes menores e analisa cada uma. Use isso, mas estabeleça um prazo para decidir, ou a análise não termina.",
        workProjects: "Seu diferencial está na capacidade de encontrar eficiências e resolver problemas que outros evitam. Ofereça-se para otimizar processos ou analisar dados."
      },
      en: {
        learning: "You learn best when you can structure information into categories, see the logic behind concepts, and solve practical problems. Create mind maps with causal connections.",
        problemSolving: "When facing a problem, you naturally break it into smaller parts and analyze each one. Use this, but set a deadline to decide, or the analysis never ends.",
        workProjects: "Your differentiator is the ability to find efficiencies and solve problems others avoid. Offer to optimize processes or analyze data."
      }
    },
    developmentPractice: {
      pt: {
        strong: "Reserve 20 minutos por dia para resolver um problema lógico (sudoku, xadrez, programação). Sua mente analítica precisa de desafios regulares.",
        weak: "Quando perceber que está racionalizando uma emoção, pare e pergunte: o que estou sentindo, antes de explicar por quê."
      },
      en: {
        strong: "Reserve 20 minutes a day to solve a logical problem (sudoku, chess, programming). Your analytical mind needs regular challenges.",
        weak: "When you notice you're rationalizing an emotion, stop and ask: what am I feeling, before explaining why."
      }
    }
  },
  espacial: {
    key: "espacial",
    name: { pt: "Espacial", en: "Spatial" },
    emoji: "🎨",
    shortDescription: {
      pt: "Visualização, design e percepção tridimensional",
      en: "Visualization, design, and three-dimensional perception"
    },
    description: {
      pt: "Você pensa em imagens. Quando alguém te explica algo, você cria um filme mental. Quando resolve um problema, visualiza as peças se encaixando. Seu senso estético é apurado: você percebe quando algo está visualmente 'errado' mesmo sem saber explicar por quê. O problema é que nem sempre consegue traduzir o que vê na cabeça para palavras, e isso pode frustrar tanto você quanto quem tenta te entender.",
      en: "You think in images. When someone explains something to you, you create a mental movie. When solving a problem, you visualize the pieces fitting together. Your aesthetic sense is refined: you notice when something is visually 'wrong' even without knowing how to explain why. The problem is that you can't always translate what you see in your head into words, and this can frustrate both you and those trying to understand you."
    },
    traits: {
      pt: ["Visual", "Criativo", "Imaginativo", "Observador", "Artístico"],
      en: ["Visual", "Creative", "Imaginative", "Observant", "Artistic"]
    },
    careers: {
      pt: ["Designer", "Arquiteto", "Artista Visual", "Fotógrafo", "Diretor de Arte", "Piloto", "Cirurgião", "Engenheiro Civil"],
      en: ["Designer", "Architect", "Visual Artist", "Photographer", "Art Director", "Pilot", "Surgeon", "Civil Engineer"]
    },
    learningStyle: {
      pt: "Aprende através de imagens, diagramas, mapas e representações visuais. Precisa 'ver' a informação para processá-la completamente.",
      en: "Learns through images, diagrams, maps, and visual representations. Needs to 'see' information to fully process it."
    },
    workStyle: {
      pt: "Produz melhor em ambientes que permitem criação visual e manipulação espacial. Prefere trabalhos que envolvam design, planejamento ou criação estética.",
      en: "Produces best in environments that allow visual creation and spatial manipulation. Prefers work involving design, planning, or aesthetic creation."
    },
    communicationStyle: {
      pt: "Comunica-se através de imagens, desenhos e metáforas visuais. Usa gestos para explicar ideias e prefere apresentações visuais a textos longos.",
      en: "Communicates through images, drawings, and visual metaphors. Uses gestures to explain ideas and prefers visual presentations to long texts."
    },
    strengths: {
      pt: ["Visualização de conceitos", "Senso estético apurado", "Orientação espacial", "Criação de layouts", "Memória visual"],
      en: ["Concept visualization", "Refined aesthetic sense", "Spatial orientation", "Layout creation", "Visual memory"]
    },
    challenges: {
      pt: ["Pode se frustrar com descrições verbais", "Dificuldade em ambientes sem estímulo visual", "Tendência a julgar pela aparência"],
      en: ["May get frustrated with verbal descriptions", "Difficulty in environments without visual stimulation", "Tendency to judge by appearance"]
    },
    developmentTips: {
      pt: ["Pratique desenho ou pintura", "Use mapas mentais", "Fotografe seu dia a dia", "Estude design", "Explore softwares de criação visual"],
      en: ["Practice drawing or painting", "Use mind maps", "Photograph your daily life", "Study design", "Explore visual creation software"]
    },
    deepPatterns: {
      pt: [
        "Você provavelmente consegue dar direções descrevendo visuais: 'vira na casa azul'.",
        "Quando lê um livro, cria imagens tão vívidas que às vezes o filme decepciona.",
        "Percebe quando um ambiente está desorganizado ou 'feio' antes de outros notarem.",
        "Prefere gráficos a tabelas de números."
      ],
      en: [
        "You can probably give directions describing visuals: 'turn at the blue house'.",
        "When reading a book, you create images so vivid that sometimes the movie disappoints.",
        "You notice when an environment is disorganized or 'ugly' before others notice.",
        "You prefer graphs to number tables."
      ]
    },
    excessBehaviors: {
      pt: [
        "Julgar coisas pela aparência antes de conhecer o conteúdo.",
        "Ficar paralisado porque a 'visão' na cabeça é perfeita demais para executar.",
        "Frustrar-se quando outros não enxergam o que você vê mentalmente.",
        "Gastar tempo demais no visual e pouco no funcional."
      ],
      en: [
        "Judging things by appearance before knowing the content.",
        "Getting paralyzed because the 'vision' in your head is too perfect to execute.",
        "Getting frustrated when others don't see what you see mentally.",
        "Spending too much time on the visual and little on the functional."
      ]
    },
    identificationPhrases: {
      pt: [
        "Você provavelmente se reconhece quando consegue montar móveis sem ler instruções, só olhando as peças.",
        "Você provavelmente se reconhece quando reorganiza um ambiente e sente uma satisfação quase física quando 'fica certo'.",
        "Você provavelmente se reconhece quando prefere que te mostrem ao invés de te explicarem."
      ],
      en: [
        "You probably recognize yourself when you can assemble furniture without reading instructions, just looking at the pieces.",
        "You probably recognize yourself when you reorganize an environment and feel an almost physical satisfaction when it 'looks right'.",
        "You probably recognize yourself when you prefer to be shown instead of explained."
      ]
    },
    practicalApplications: {
      pt: {
        learning: "Você aprende melhor quando pode visualizar. Transforme textos em mapas mentais, use cores para categorizar informações, desenhe conceitos ao invés de escrever.",
        problemSolving: "Quando enfrenta um problema, você naturalmente tenta 'ver' a solução. Desenhe o problema em papel, use diagramas, visualize antes de agir.",
        workProjects: "Seu diferencial está na capacidade de criar apresentações visuais impactantes e organizar informações de forma clara. Ofereça-se para criar materiais visuais."
      },
      en: {
        learning: "You learn best when you can visualize. Transform texts into mind maps, use colors to categorize information, draw concepts instead of writing.",
        problemSolving: "When facing a problem, you naturally try to 'see' the solution. Draw the problem on paper, use diagrams, visualize before acting.",
        workProjects: "Your differentiator is the ability to create impactful visual presentations and organize information clearly. Offer to create visual materials."
      }
    },
    developmentPractice: {
      pt: {
        strong: "Desenhe algo todo dia, mesmo simples. Fotografe, crie, manipule imagens. Sua mente visual precisa de estímulo regular.",
        weak: "Quando perceber que está julgando algo pela aparência, pare e pergunte: qual é o conteúdo real por trás dessa superfície?"
      },
      en: {
        strong: "Draw something every day, even simple. Photograph, create, manipulate images. Your visual mind needs regular stimulation.",
        weak: "When you notice you're judging something by appearance, stop and ask: what's the real content behind this surface?"
      }
    }
  },
  musical: {
    key: "musical",
    name: { pt: "Musical", en: "Musical" },
    emoji: "🎵",
    shortDescription: {
      pt: "Sensibilidade a ritmos, melodias e sons",
      en: "Sensitivity to rhythms, melodies, and sounds"
    },
    description: {
      pt: "O mundo tem uma trilha sonora para você. Você percebe ritmos em lugares onde outros só ouvem barulho, memoriza melodias sem esforço e sente a música fisicamente. Som não é só entretenimento, é linguagem. O problema é que sua sensibilidade sonora também significa que barulhos te afetam mais que a maioria, e você pode usar música para se isolar do mundo ao invés de conectar.",
      en: "The world has a soundtrack for you. You notice rhythms in places where others only hear noise, memorize melodies effortlessly, and feel music physically. Sound isn't just entertainment, it's language. The problem is that your sound sensitivity also means noises affect you more than most, and you may use music to isolate from the world instead of connecting."
    },
    traits: {
      pt: ["Rítmico", "Harmônico", "Sensível", "Expressivo", "Intuitivo"],
      en: ["Rhythmic", "Harmonic", "Sensitive", "Expressive", "Intuitive"]
    },
    careers: {
      pt: ["Músico", "Produtor Musical", "Terapeuta Musical", "DJ", "Compositor", "Cantor", "Engenheiro de Som", "Professor de Música"],
      en: ["Musician", "Music Producer", "Music Therapist", "DJ", "Composer", "Singer", "Sound Engineer", "Music Teacher"]
    },
    learningStyle: {
      pt: "Aprende através de músicas, ritmos e padrões sonoros. Memoriza melhor quando associa informações a melodias ou cria rimas.",
      en: "Learns through music, rhythms, and sound patterns. Memorizes better when associating information with melodies or creating rhymes."
    },
    workStyle: {
      pt: "Produz melhor em ambientes com música ou em silêncio controlado. Sensível a ruídos e distrações sonoras. Prefere trabalhos com componente rítmico ou sonoro.",
      en: "Produces best in environments with music or controlled silence. Sensitive to noise and sound distractions. Prefers work with rhythmic or sonic components."
    },
    communicationStyle: {
      pt: "Comunica-se com variação tonal e ritmo na fala. Percebe emoções através da voz dos outros. Usa música como ferramenta de conexão.",
      en: "Communicates with tonal variation and rhythm in speech. Perceives emotions through others' voices. Uses music as a connection tool."
    },
    strengths: {
      pt: ["Ouvido apurado", "Sensibilidade emocional através do som", "Ritmo natural", "Expressão através da música", "Memorização auditiva"],
      en: ["Refined ear", "Emotional sensitivity through sound", "Natural rhythm", "Expression through music", "Auditory memorization"]
    },
    challenges: {
      pt: ["Distração por sons ambientes", "Dificuldade em ambientes barulhentos", "Pode se isolar através da música"],
      en: ["Distraction by ambient sounds", "Difficulty in noisy environments", "May isolate through music"]
    },
    developmentTips: {
      pt: ["Aprenda um instrumento", "Pratique canto", "Estude teoria musical", "Crie playlists intencionais", "Experimente produção musical"],
      en: ["Learn an instrument", "Practice singing", "Study music theory", "Create intentional playlists", "Try music production"]
    },
    deepPatterns: {
      pt: [
        "Você provavelmente tem músicas associadas a memórias específicas tão fortes que ouvir transporta você no tempo.",
        "Percebe quando alguém está mentindo ou desconfortável pelo tom de voz, não pelas palavras.",
        "Fica incomodado com sons que outros nem percebem (torneira pingando, zumbido de eletrônicos).",
        "Quando está processando emoções, música ajuda mais que conversa."
      ],
      en: [
        "You probably have songs associated with specific memories so strong that listening transports you in time.",
        "You notice when someone is lying or uncomfortable by their tone of voice, not their words.",
        "You get bothered by sounds others don't even notice (dripping faucet, electronics humming).",
        "When processing emotions, music helps more than conversation."
      ]
    },
    excessBehaviors: {
      pt: [
        "Usar música para evitar silêncio desconfortável (e as emoções que vêm com ele).",
        "Isolar-se com fones de ouvido ao invés de estar presente.",
        "Ficar irritado demais com barulhos cotidianos.",
        "Depender de música para regular emoções ao invés de processá-las."
      ],
      en: [
        "Using music to avoid uncomfortable silence (and the emotions that come with it).",
        "Isolating with headphones instead of being present.",
        "Getting too irritated with everyday noises.",
        "Depending on music to regulate emotions instead of processing them."
      ]
    },
    identificationPhrases: {
      pt: [
        "Você provavelmente se reconhece quando uma música nova te arrepia e você precisa ouvir de novo imediatamente.",
        "Você provavelmente se reconhece quando consegue identificar instrumentos separadamente em uma música complexa.",
        "Você provavelmente se reconhece quando seu humor muda completamente dependendo da playlist."
      ],
      en: [
        "You probably recognize yourself when a new song gives you chills and you need to hear it again immediately.",
        "You probably recognize yourself when you can identify instruments separately in a complex song.",
        "You probably recognize yourself when your mood changes completely depending on the playlist."
      ]
    },
    practicalApplications: {
      pt: {
        learning: "Você aprende melhor com música de fundo (instrumental, sem letra). Crie jingles para memorizar informações. Grave áudios ao invés de escrever notas.",
        problemSolving: "Quando enfrenta um problema, você pode processá-lo enquanto ouve música. Use diferentes playlists para diferentes modos mentais.",
        workProjects: "Seu diferencial está na capacidade de criar atmosferas e perceber nuances de tom em comunicações. Use isso em apresentações, podcasts ou criação de conteúdo."
      },
      en: {
        learning: "You learn best with background music (instrumental, no lyrics). Create jingles to memorize information. Record audios instead of writing notes.",
        problemSolving: "When facing a problem, you can process it while listening to music. Use different playlists for different mental modes.",
        workProjects: "Your differentiator is the ability to create atmospheres and perceive nuances of tone in communications. Use this in presentations, podcasts, or content creation."
      }
    },
    developmentPractice: {
      pt: {
        strong: "Reserve tempo toda semana para apenas ouvir música ativamente, sem fazer nada. Sua mente musical precisa de nutrição.",
        weak: "Quando perceber que está usando música para fugir do silêncio, tire os fones e fique presente por 5 minutos."
      },
      en: {
        strong: "Reserve time every week to just actively listen to music, doing nothing else. Your musical mind needs nutrition.",
        weak: "When you notice you're using music to escape silence, remove the headphones and be present for 5 minutes."
      }
    }
  },
  corporal_cinestesica: {
    key: "corporal_cinestesica",
    name: { pt: "Corporal-Cinestésica", en: "Bodily-Kinesthetic" },
    emoji: "🤸",
    shortDescription: {
      pt: "Controle corporal, coordenação e expressão física",
      en: "Body control, coordination, and physical expression"
    },
    description: {
      pt: "Você pensa com o corpo. Literalmente. Quando processa uma ideia, suas mãos querem se mover. Quando aprende algo novo, precisa fazer, não só ouvir. Seu corpo é instrumento de expressão e compreensão. O problema é que o mundo moderno valoriza 'ficar sentado e prestar atenção', e você provavelmente passou a vida sendo chamado de inquieto quando na verdade seu corpo só precisava de movimento para pensar.",
      en: "You think with your body. Literally. When processing an idea, your hands want to move. When learning something new, you need to do, not just hear. Your body is an instrument of expression and understanding. The problem is that the modern world values 'sitting still and paying attention', and you probably spent your life being called restless when actually your body just needed movement to think."
    },
    traits: {
      pt: ["Físico", "Coordenado", "Prático", "Expressivo", "Energético"],
      en: ["Physical", "Coordinated", "Practical", "Expressive", "Energetic"]
    },
    careers: {
      pt: ["Atleta", "Dançarino", "Cirurgião", "Artesão", "Fisioterapeuta", "Chef", "Ator", "Personal Trainer"],
      en: ["Athlete", "Dancer", "Surgeon", "Craftsman", "Physiotherapist", "Chef", "Actor", "Personal Trainer"]
    },
    learningStyle: {
      pt: "Aprende fazendo, tocando e experimentando. Precisa de movimento para processar informação. Memoriza melhor quando associa conhecimento a ações físicas.",
      en: "Learns by doing, touching, and experimenting. Needs movement to process information. Memorizes better when associating knowledge with physical actions."
    },
    workStyle: {
      pt: "Produz melhor quando pode se movimentar e usar as mãos. Dificuldade em ficar sentado por longos períodos. Prefere trabalhos com componente físico.",
      en: "Produces best when able to move and use hands. Difficulty sitting for long periods. Prefers work with physical components."
    },
    communicationStyle: {
      pt: "Comunica-se com gestos e expressões corporais. Toque é uma forma de conexão. Demonstra em vez de explicar verbalmente.",
      en: "Communicates with gestures and body expressions. Touch is a form of connection. Demonstrates rather than explains verbally."
    },
    strengths: {
      pt: ["Coordenação motora", "Consciência corporal", "Aprendizado prático", "Expressão física", "Resistência e energia"],
      en: ["Motor coordination", "Body awareness", "Practical learning", "Physical expression", "Stamina and energy"]
    },
    challenges: {
      pt: ["Inquietude em ambientes estáticos", "Dificuldade com teoria abstrata", "Pode ser visto como impaciente"],
      en: ["Restlessness in static environments", "Difficulty with abstract theory", "May be seen as impatient"]
    },
    developmentTips: {
      pt: ["Pratique esporte ou dança", "Aprenda artesanato", "Faça pausas para movimento", "Experimente yoga", "Use gestos ao estudar"],
      en: ["Practice sports or dance", "Learn crafts", "Take movement breaks", "Try yoga", "Use gestures when studying"]
    },
    deepPatterns: {
      pt: [
        "Você provavelmente foi a criança que não conseguia ficar sentada na aula.",
        "Quando está nervoso, seu corpo não para: balança a perna, rói unha, mexe as mãos.",
        "Aprende muito mais rápido quando pode fazer ao invés de só ouvir explicação.",
        "Sente as emoções no corpo antes de processá-las mentalmente."
      ],
      en: [
        "You were probably the child who couldn't sit still in class.",
        "When nervous, your body doesn't stop: you shake your leg, bite nails, fidget with hands.",
        "You learn much faster when you can do instead of just hearing explanations.",
        "You feel emotions in your body before processing them mentally."
      ]
    },
    excessBehaviors: {
      pt: [
        "Evitar qualquer atividade que exija ficar parado por muito tempo.",
        "Desvalorizar atividades 'mentais' porque não têm componente físico.",
        "Usar exercício para fugir de processamento emocional.",
        "Ficar impaciente demais com processos que exigem planejamento antes de ação."
      ],
      en: [
        "Avoiding any activity that requires staying still for too long.",
        "Devaluing 'mental' activities because they have no physical component.",
        "Using exercise to escape emotional processing.",
        "Getting too impatient with processes that require planning before action."
      ]
    },
    identificationPhrases: {
      pt: [
        "Você provavelmente se reconhece quando consegue aprender um movimento novo vendo uma vez e imitando.",
        "Você provavelmente se reconhece quando suas melhores ideias vêm enquanto caminha ou faz exercício.",
        "Você provavelmente se reconhece quando prefere demonstrar ao invés de explicar."
      ],
      en: [
        "You probably recognize yourself when you can learn a new movement by seeing it once and imitating.",
        "You probably recognize yourself when your best ideas come while walking or exercising.",
        "You probably recognize yourself when you prefer to demonstrate instead of explain."
      ]
    },
    practicalApplications: {
      pt: {
        learning: "Você aprende melhor fazendo. Levante-se e ande enquanto estuda. Use as mãos para manipular objetos. Faça pausas para movimento a cada 25 minutos.",
        problemSolving: "Quando enfrenta um problema, vá caminhar. Movimento ajuda seu cérebro a processar. Volte para a mesa só quando sentir que a solução está se formando.",
        workProjects: "Seu diferencial está na capacidade de fazer acontecer. Ofereça-se para prototipar, demonstrar ou liderar a parte prática de projetos."
      },
      en: {
        learning: "You learn best by doing. Stand up and walk while studying. Use your hands to manipulate objects. Take movement breaks every 25 minutes.",
        problemSolving: "When facing a problem, go for a walk. Movement helps your brain process. Return to the desk only when you feel the solution forming.",
        workProjects: "Your differentiator is the ability to make things happen. Offer to prototype, demonstrate, or lead the practical part of projects."
      }
    },
    developmentPractice: {
      pt: {
        strong: "Mova seu corpo todo dia, mesmo 15 minutos. Sua mente corporal precisa de movimento para funcionar bem.",
        weak: "Quando perceber que está evitando atividades estáticas, pratique ficar sentado por 10 minutos focado. É um músculo que também se treina."
      },
      en: {
        strong: "Move your body every day, even 15 minutes. Your bodily mind needs movement to function well.",
        weak: "When you notice you're avoiding static activities, practice sitting for 10 focused minutes. It's a muscle that can also be trained."
      }
    }
  },
  interpessoal: {
    key: "interpessoal",
    name: { pt: "Interpessoal", en: "Interpersonal" },
    emoji: "🤝",
    shortDescription: {
      pt: "Compreensão dos outros, empatia e liderança social",
      en: "Understanding others, empathy, and social leadership"
    },
    description: {
      pt: "Você lê pessoas. Percebe emoções que não foram ditas, motivações que não foram declaradas, tensões que outros não captam. Conectar-se é natural para você. O problema é que essa sensibilidade às vezes te sobrecarrega. Você absorve o que os outros sentem, tem dificuldade de dizer não, e pode confundir seu valor com sua utilidade para os outros.",
      en: "You read people. You perceive emotions that weren't spoken, motivations that weren't declared, tensions that others don't catch. Connecting comes naturally to you. The problem is that this sensitivity sometimes overwhelms you. You absorb what others feel, have difficulty saying no, and may confuse your value with your usefulness to others."
    },
    traits: {
      pt: ["Empático", "Sociável", "Influente", "Mediador", "Comunicativo"],
      en: ["Empathetic", "Sociable", "Influential", "Mediator", "Communicative"]
    },
    careers: {
      pt: ["Psicólogo", "Líder", "Vendedor", "Professor", "Coach", "RH", "Político", "Terapeuta"],
      en: ["Psychologist", "Leader", "Salesperson", "Teacher", "Coach", "HR", "Politician", "Therapist"]
    },
    learningStyle: {
      pt: "Aprende melhor em grupo, através de discussões e colaboração. Precisa de interação social para processar ideias completamente.",
      en: "Learns best in groups, through discussions and collaboration. Needs social interaction to fully process ideas."
    },
    workStyle: {
      pt: "Prospera em ambientes colaborativos e de equipe. Prefere trabalhos que envolvam pessoas, negociação ou liderança.",
      en: "Thrives in collaborative team environments. Prefers work involving people, negotiation, or leadership."
    },
    communicationStyle: {
      pt: "Comunicação adaptativa e empática. Percebe o estado emocional dos outros e ajusta a abordagem. Constrói rapport naturalmente.",
      en: "Adaptive and empathetic communication. Perceives others' emotional states and adjusts approach. Builds rapport naturally."
    },
    strengths: {
      pt: ["Leitura de pessoas", "Construção de relacionamentos", "Liderança", "Resolução de conflitos", "Influência positiva"],
      en: ["Reading people", "Building relationships", "Leadership", "Conflict resolution", "Positive influence"]
    },
    challenges: {
      pt: ["Dificuldade de dizer não", "Pode absorver emoções dos outros", "Tendência a agradar demais"],
      en: ["Difficulty saying no", "May absorb others' emotions", "Tendency to please too much"]
    },
    developmentTips: {
      pt: ["Pratique escuta ativa", "Estude linguagem corporal", "Participe de grupos diversos", "Desenvolva liderança", "Aprenda mediação"],
      en: ["Practice active listening", "Study body language", "Join diverse groups", "Develop leadership", "Learn mediation"]
    },
    deepPatterns: {
      pt: [
        "Você provavelmente era a pessoa que todos procuravam para desabafar.",
        "Percebe quando tem tensão entre duas pessoas antes de qualquer sinal óbvio.",
        "Fica desconfortável quando alguém está mal, mesmo que não tenha nada a ver com você.",
        "Adapta naturalmente seu jeito de falar dependendo de com quem está conversando."
      ],
      en: [
        "You were probably the person everyone sought to vent to.",
        "You notice when there's tension between two people before any obvious sign.",
        "You feel uncomfortable when someone is upset, even if it has nothing to do with you.",
        "You naturally adapt your way of speaking depending on who you're talking to."
      ]
    },
    excessBehaviors: {
      pt: [
        "Dizer sim quando quer dizer não para não decepcionar.",
        "Carregar as emoções dos outros como se fossem suas.",
        "Perder-se tentando agradar a todos.",
        "Medir seu valor pela quantidade de pessoas que dependem de você."
      ],
      en: [
        "Saying yes when you want to say no to not disappoint.",
        "Carrying others' emotions as if they were yours.",
        "Losing yourself trying to please everyone.",
        "Measuring your value by how many people depend on you."
      ]
    },
    identificationPhrases: {
      pt: [
        "Você provavelmente se reconhece quando entra em uma sala e instantaneamente percebe o 'clima' do ambiente.",
        "Você provavelmente se reconhece quando consegue mediar conflitos que outros não conseguem.",
        "Você provavelmente se reconhece quando pessoas te contam coisas que não contam para ninguém."
      ],
      en: [
        "You probably recognize yourself when you enter a room and instantly perceive the 'vibe' of the environment.",
        "You probably recognize yourself when you can mediate conflicts others can't.",
        "You probably recognize yourself when people tell you things they don't tell anyone."
      ]
    },
    practicalApplications: {
      pt: {
        learning: "Você aprende melhor em grupo, discutindo ideias. Forme grupos de estudo, ensine o que aprendeu para outros, processe ideias em conversas.",
        problemSolving: "Quando enfrenta um problema, você naturalmente quer conversar com alguém sobre. Use isso: encontre um parceiro de brainstorm ou mentor.",
        workProjects: "Seu diferencial está na capacidade de conectar pessoas e criar colaboração. Ofereça-se para facilitar reuniões, mediar conflitos ou liderar equipes."
      },
      en: {
        learning: "You learn best in groups, discussing ideas. Form study groups, teach what you learned to others, process ideas in conversations.",
        problemSolving: "When facing a problem, you naturally want to talk to someone about it. Use this: find a brainstorm partner or mentor.",
        workProjects: "Your differentiator is the ability to connect people and create collaboration. Offer to facilitate meetings, mediate conflicts, or lead teams."
      }
    },
    developmentPractice: {
      pt: {
        strong: "Reserve tempo toda semana para conexões genuínas com pessoas que te nutrem, não só as que precisam de você.",
        weak: "Quando perceber que está absorvendo a emoção de alguém, pergunte: isso é meu ou é deles? Pratique devolver o que não é seu."
      },
      en: {
        strong: "Reserve time every week for genuine connections with people who nurture you, not just those who need you.",
        weak: "When you notice you're absorbing someone's emotion, ask: is this mine or theirs? Practice returning what's not yours."
      }
    }
  },
  intrapessoal: {
    key: "intrapessoal",
    name: { pt: "Intrapessoal", en: "Intrapersonal" },
    emoji: "🧘",
    shortDescription: {
      pt: "Autoconhecimento, reflexão e inteligência emocional",
      en: "Self-knowledge, reflection, and emotional intelligence"
    },
    description: {
      pt: "Você se conhece. Sabe o que sente, por que sente, o que te move e o que te trava. Sua bússola interna é precisa: você percebe quando algo está 'errado' em você antes de conseguir explicar. O problema é que essa introspecção pode virar isolamento. Você pode passar tanto tempo dentro de si que esquece de viver lá fora.",
      en: "You know yourself. You know what you feel, why you feel it, what moves you and what blocks you. Your inner compass is precise: you notice when something is 'wrong' in you before you can explain it. The problem is that this introspection can become isolation. You can spend so much time inside yourself that you forget to live out there."
    },
    traits: {
      pt: ["Introspectivo", "Autoconsciente", "Reflexivo", "Independente", "Filosófico"],
      en: ["Introspective", "Self-aware", "Reflective", "Independent", "Philosophical"]
    },
    careers: {
      pt: ["Filósofo", "Escritor", "Psicanalista", "Monge/Religioso", "Pesquisador", "Consultor", "Coach", "Artista"],
      en: ["Philosopher", "Writer", "Psychoanalyst", "Monk/Religious", "Researcher", "Consultant", "Coach", "Artist"]
    },
    learningStyle: {
      pt: "Aprende através da reflexão solitária e autoanálise. Precisa de tempo para processar informações internamente antes de agir.",
      en: "Learns through solitary reflection and self-analysis. Needs time to process information internally before acting."
    },
    workStyle: {
      pt: "Produz melhor em ambientes calmos com tempo para reflexão. Prefere trabalho independente ou com alta autonomia.",
      en: "Produces best in calm environments with time for reflection. Prefers independent work or high autonomy."
    },
    communicationStyle: {
      pt: "Comunicação profunda e significativa. Prefere conversas um-a-um. Compartilha insights quando sente confiança.",
      en: "Deep and meaningful communication. Prefers one-on-one conversations. Shares insights when feeling trust."
    },
    strengths: {
      pt: ["Autoconhecimento profundo", "Regulação emocional", "Tomada de decisão consciente", "Independência", "Sabedoria interior"],
      en: ["Deep self-knowledge", "Emotional regulation", "Conscious decision-making", "Independence", "Inner wisdom"]
    },
    challenges: {
      pt: ["Pode parecer distante", "Tendência ao isolamento", "Dificuldade em ambientes muito sociais"],
      en: ["May seem distant", "Tendency to isolation", "Difficulty in very social environments"]
    },
    developmentTips: {
      pt: ["Pratique meditação", "Mantenha um diário", "Faça terapia", "Reserve tempo para silêncio", "Estude filosofia"],
      en: ["Practice meditation", "Keep a journal", "Do therapy", "Reserve time for silence", "Study philosophy"]
    },
    deepPatterns: {
      pt: [
        "Você provavelmente precisa de tempo sozinho para recarregar, não porque não goste de pessoas.",
        "Sabe quando está prestes a perder a paciência e consegue regular antes de explodir.",
        "Tem facilidade para identificar seus próprios padrões de comportamento.",
        "Às vezes sabe que algo está errado antes de conseguir nomear."
      ],
      en: [
        "You probably need time alone to recharge, not because you don't like people.",
        "You know when you're about to lose patience and can regulate before exploding.",
        "You easily identify your own behavior patterns.",
        "Sometimes you know something is wrong before you can name it."
      ]
    },
    excessBehaviors: {
      pt: [
        "Isolar-se demais em nome de 'processar'.",
        "Analisar tanto seus sentimentos que esquece de vivê-los.",
        "Parecer frio ou distante quando está apenas refletindo.",
        "Evitar situações sociais porque 'prefere ficar sozinho'."
      ],
      en: [
        "Isolating too much in the name of 'processing'.",
        "Analyzing your feelings so much that you forget to live them.",
        "Seeming cold or distant when you're just reflecting.",
        "Avoiding social situations because you 'prefer to be alone'."
      ]
    },
    identificationPhrases: {
      pt: [
        "Você provavelmente se reconhece quando consegue identificar exatamente por que está de mau humor.",
        "Você provavelmente se reconhece quando precisa de tempo sozinho depois de muito contato social.",
        "Você provavelmente se reconhece quando suas decisões mais importantes vieram de 'saber por dentro' que era certo."
      ],
      en: [
        "You probably recognize yourself when you can identify exactly why you're in a bad mood.",
        "You probably recognize yourself when you need time alone after too much social contact.",
        "You probably recognize yourself when your most important decisions came from 'knowing inside' it was right."
      ]
    },
    practicalApplications: {
      pt: {
        learning: "Você aprende melhor quando tem tempo para processar sozinho. Após aulas ou reuniões, reserve 15 minutos para refletir e integrar o que aprendeu.",
        problemSolving: "Quando enfrenta um problema, você precisa de silêncio para processar. Avise que precisa de tempo e volte com clareza.",
        workProjects: "Seu diferencial está na capacidade de tomar decisões conscientes e reguladas. Ofereça-se para análises profundas ou para ser a voz da ponderação em equipes."
      },
      en: {
        learning: "You learn best when you have time to process alone. After classes or meetings, reserve 15 minutes to reflect and integrate what you learned.",
        problemSolving: "When facing a problem, you need silence to process. Let others know you need time and return with clarity.",
        workProjects: "Your differentiator is the ability to make conscious, regulated decisions. Offer for deep analyses or to be the voice of deliberation in teams."
      }
    },
    developmentPractice: {
      pt: {
        strong: "Reserve tempo todo dia para silêncio e reflexão. Sua mente intrapessoal precisa de espaço interno regular.",
        weak: "Quando perceber que está se isolando demais, force uma conexão social pequena. Equilíbrio entre dentro e fora."
      },
      en: {
        strong: "Reserve time every day for silence and reflection. Your intrapersonal mind needs regular internal space.",
        weak: "When you notice you're isolating too much, force a small social connection. Balance between inside and outside."
      }
    }
  },
  naturalista: {
    key: "naturalista",
    name: { pt: "Naturalista", en: "Naturalistic" },
    emoji: "🌿",
    shortDescription: {
      pt: "Conexão com a natureza, padrões naturais e sistemas vivos",
      en: "Connection with nature, natural patterns, and living systems"
    },
    description: {
      pt: "Você percebe a natureza com olhos que outros não têm. Vê padrões onde outros veem apenas paisagem, conecta-se com animais e plantas de forma intuitiva, e encontra paz genuína em ambientes naturais. O mundo vivo fala uma linguagem que você entende. O problema é que o mundo moderno é majoritariamente artificial, e isso pode te deixar em desconexão constante.",
      en: "You perceive nature with eyes others don't have. You see patterns where others see just landscape, connect with animals and plants intuitively, and find genuine peace in natural environments. The living world speaks a language you understand. The problem is that the modern world is mostly artificial, and this can leave you in constant disconnection."
    },
    traits: {
      pt: ["Observador", "Ecológico", "Sensível", "Conectado", "Classificador"],
      en: ["Observant", "Ecological", "Sensitive", "Connected", "Classifier"]
    },
    careers: {
      pt: ["Biólogo", "Veterinário", "Agricultor", "Ambientalista", "Botânico", "Chef", "Paisagista", "Guia de Ecoturismo"],
      en: ["Biologist", "Veterinarian", "Farmer", "Environmentalist", "Botanist", "Chef", "Landscaper", "Ecotourism Guide"]
    },
    learningStyle: {
      pt: "Aprende através da observação da natureza, classificação e identificação de padrões em sistemas vivos. Prefere estudar ao ar livre.",
      en: "Learns through nature observation, classification, and pattern identification in living systems. Prefers outdoor study."
    },
    workStyle: {
      pt: "Produz melhor em contato com a natureza ou trabalhando com seres vivos. Sensível a ambientes artificiais ou muito fechados.",
      en: "Produces best in contact with nature or working with living beings. Sensitive to artificial or very enclosed environments."
    },
    communicationStyle: {
      pt: "Comunica-se usando metáforas da natureza. Observa padrões comportamentais como observaria animais. Paciente e atento aos detalhes.",
      en: "Communicates using nature metaphors. Observes behavioral patterns as would observe animals. Patient and attentive to details."
    },
    strengths: {
      pt: ["Observação de padrões naturais", "Conexão com seres vivos", "Classificação e organização", "Consciência ambiental", "Paciência"],
      en: ["Natural pattern observation", "Connection with living beings", "Classification and organization", "Environmental awareness", "Patience"]
    },
    challenges: {
      pt: ["Dificuldade em ambientes urbanos fechados", "Pode parecer desconectado de questões sociais", "Frustração com destruição ambiental"],
      en: ["Difficulty in closed urban environments", "May seem disconnected from social issues", "Frustration with environmental destruction"]
    },
    developmentTips: {
      pt: ["Cultive um jardim", "Pratique observação de aves", "Caminhe na natureza", "Estude botânica ou zoologia", "Participe de projetos ambientais"],
      en: ["Cultivate a garden", "Practice bird watching", "Walk in nature", "Study botany or zoology", "Join environmental projects"]
    },
    deepPatterns: {
      pt: [
        "Você provavelmente teve mais conexão com animais ou natureza do que com pessoas em algum momento.",
        "Percebe mudanças climáticas ou de estação antes de outros notarem.",
        "Fica desconfortável em ambientes muito artificiais ou sem plantas.",
        "Sente um tipo de paz em espaços naturais que não consegue replicar em outros lugares."
      ],
      en: [
        "You probably had more connection with animals or nature than with people at some point.",
        "You notice weather or seasonal changes before others notice.",
        "You feel uncomfortable in very artificial environments or without plants.",
        "You feel a kind of peace in natural spaces that you can't replicate elsewhere."
      ]
    },
    excessBehaviors: {
      pt: [
        "Preferir animais a pessoas de forma sistemática.",
        "Frustrar-se demais com questões ambientais a ponto de ficar paralisado.",
        "Parecer desconectado de problemas 'humanos' porque está focado no natural.",
        "Evitar ambientes urbanos ao ponto de limitar oportunidades."
      ],
      en: [
        "Systematically preferring animals to people.",
        "Getting so frustrated with environmental issues that you become paralyzed.",
        "Seeming disconnected from 'human' problems because you're focused on nature.",
        "Avoiding urban environments to the point of limiting opportunities."
      ]
    },
    identificationPhrases: {
      pt: [
        "Você provavelmente se reconhece quando consegue identificar espécies de plantas ou animais que outros nem percebem.",
        "Você provavelmente se reconhece quando precisa de tempo na natureza para se reequilibrar.",
        "Você provavelmente se reconhece quando percebe padrões climáticos ou de comportamento animal intuitivamente."
      ],
      en: [
        "You probably recognize yourself when you can identify plant or animal species that others don't even notice.",
        "You probably recognize yourself when you need time in nature to rebalance.",
        "You probably recognize yourself when you intuitively perceive weather patterns or animal behavior."
      ]
    },
    practicalApplications: {
      pt: {
        learning: "Você aprende melhor ao ar livre ou em contato com natureza. Estude em parques, use analogias naturais para memorizar conceitos, classifique informações como classificaria espécies.",
        problemSolving: "Quando enfrenta um problema, vá para a natureza. A observação de sistemas naturais pode te dar insights sobre sistemas humanos.",
        workProjects: "Seu diferencial está na capacidade de observar padrões e ser paciente. Ofereça-se para análises que exigem observação detalhada ou projetos de longo prazo."
      },
      en: {
        learning: "You learn best outdoors or in contact with nature. Study in parks, use natural analogies to memorize concepts, classify information as you would classify species.",
        problemSolving: "When facing a problem, go to nature. Observing natural systems can give you insights about human systems.",
        workProjects: "Your differentiator is the ability to observe patterns and be patient. Offer for analyses requiring detailed observation or long-term projects."
      }
    },
    developmentPractice: {
      pt: {
        strong: "Reserve tempo toda semana para contato com natureza. Sua mente naturalista precisa desse nutriente para funcionar bem.",
        weak: "Quando perceber que está evitando demais o mundo humano, lembre-se: você também é natureza, e conexão humana é natural."
      },
      en: {
        strong: "Reserve time every week for contact with nature. Your naturalistic mind needs this nutrient to function well.",
        weak: "When you notice you're avoiding the human world too much, remember: you are also nature, and human connection is natural."
      }
    }
  }
};

// Question-to-intelligence mapping (5 questions each)
const QUESTION_INTELLIGENCE_MAP: Record<number, string> = {};
const intelligenceOrder = [
  "linguistica",
  "logico_matematica", 
  "espacial",
  "musical",
  "corporal_cinestesica",
  "interpessoal",
  "intrapessoal",
  "naturalista"
];

intelligenceOrder.forEach((intelligence, index) => {
  for (let i = 1; i <= 5; i++) {
    QUESTION_INTELLIGENCE_MAP[index * 5 + i] = intelligence;
  }
});

export interface InteligenciasAnswer {
  question_id: string;
  answer: any;
  test_questions: {
    question_number: number;
    options: any;
  };
}

export interface InteligenciasResult {
  scores: Record<string, number>;
  percentages: Record<string, number>;
  ranking: Array<{ key: string; score: number; percentage: number }>;
  top1: string;
  top2: string;
  top3: string;
  lowest: string;
}

export const getInteligenciasResults = (answers: InteligenciasAnswer[]): InteligenciasResult => {
  const scores: Record<string, number> = {};
  
  // Initialize scores
  intelligenceOrder.forEach(intelligence => {
    scores[intelligence] = 0;
  });

  // Calculate scores based on question number
  answers.forEach((answer) => {
    // Defensive check: ensure test_questions exists
    if (!answer.test_questions || typeof answer.test_questions.question_number !== 'number') {
      return;
    }
    
    const questionNumber = answer.test_questions.question_number;
    const intelligence = QUESTION_INTELLIGENCE_MAP[questionNumber];

    if (!intelligence) return;

    // Handle different answer formats safely
    const coerceToNumber = (v: unknown): number => {
      if (typeof v === "number") return Number.isFinite(v) ? v : 0;
      if (typeof v === "string") {
        const n = Number(v);
        if (Number.isFinite(n)) return n;
        const intN = parseInt(v, 10);
        return Number.isFinite(intN) ? intN : 0;
      }
      if (typeof v === "boolean") return v ? 1 : 0;
      return 0;
    };

    const raw =
      typeof answer.answer === "object" && answer.answer !== null && "value" in (answer.answer as any)
        ? (answer.answer as any).value
        : answer.answer;

    const value = coerceToNumber(raw);
    scores[intelligence] = (scores[intelligence] || 0) + value;
  });

  // Max score per intelligence (5 questions × 5 max points = 25)
  const maxScorePerIntelligence = 25;
  
  // Calculate percentages
  const percentages: Record<string, number> = {};
  Object.keys(scores).forEach(key => {
    percentages[key] = Math.round((scores[key] / maxScorePerIntelligence) * 100);
  });

  // Create ranking
  const ranking = Object.keys(scores)
    .map(key => ({
      key,
      score: scores[key],
      percentage: percentages[key]
    }))
    .sort((a, b) => b.score - a.score);

  return {
    scores,
    percentages,
    ranking,
    top1: ranking[0]?.key || "",
    top2: ranking[1]?.key || "",
    top3: ranking[2]?.key || "",
    lowest: ranking[ranking.length - 1]?.key || ""
  };
};

export const getIntelligenceProfile = (key: string): IntelligenceProfile | undefined => {
  return INTELLIGENCES[key];
};
