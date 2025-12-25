// Dados dos Arquétipos com Propósito - Textos profundos e específicos

export interface ArchetypeData {
  name: string;
  description: string;
  characteristics: string[];
  visualStyle: string;
  colorPalette: string[];
  photographyDirection: string;
  emoji: string;
  powerPhrase: string;
  alignedBehavior: string;
  excessBehavior: string;
  complementsEnergy: string;
  reinforcesExpression: string;
  practicalRelationships: string[];
  practicalWork: string[];
  practicalSpiritual: string[];
  morningPractice: string;
  dailyExpression: string;
  eveningReflection: string;
  personalMantra: string;
  // Novos campos para profundidade
  deepPatterns: string[]; // Padrões reais de comportamento
  commonChallenges: string[]; // Desafios e armadilhas típicas
  cultivationPractices: string[]; // Como cultivar em equilíbrio
}

export const ARCHETYPES: Record<string, ArchetypeData> = {
  Governante: {
    name: "O Governante",
    description: "Você não nasceu para ser mais um. Existe em você uma força que busca ordem, estabilidade e controle porque, lá no fundo, você sente que é sua responsabilidade fazer as coisas funcionarem. Quando algo está fora do lugar, você sente. Quando a equipe está perdida, você assume. Não porque queira aplausos, mas porque simplesmente não consegue ficar parado enquanto o barco afunda. O problema é que isso tem um preço: você carrega peso demais. E às vezes esquece que liderar também significa confiar.",
    characteristics: [
      "Você tende a assumir a frente em qualquer situação, mesmo quando ninguém pediu. É quase instintivo.",
      "Fica incomodado com bagunça, atrasos e falta de direção. Caos te desestabiliza.",
      "Toma decisões rápidas e depois se cobra se não foram perfeitas.",
      "Sente que precisa ter resposta para tudo, mesmo quando não tem."
    ],
    visualStyle: "Sofisticado e estruturado, com linhas limpas e composição equilibrada que transmite autoridade natural",
    colorPalette: ["#1a1a1a", "#ffffff", "#c9a961", "#2c3e50"],
    photographyDirection: "Ambiente corporativo elegante, postura confiante, iluminação dramática que transmite autoridade",
    emoji: "👑",
    powerPhrase: "Tenho força para liderar e sabedoria para delegar. Não preciso carregar tudo sozinho.",
    alignedBehavior: "Quando você está em equilíbrio, lidera com visão e generosidade. Constrói estruturas que beneficiam a todos, inspira confiança e sabe quando dar espaço para outros brilharem.",
    excessBehavior: "Quando em excesso, você se torna controlador, rígido e impaciente com quem não segue seu ritmo. Começa a microgerenciar e a sentir que ninguém faz nada direito. O peso aumenta, a solidão também.",
    complementsEnergy: "trazendo estrutura, organização e visão estratégica para suas decisões",
    reinforcesExpression: "adicionando capacidade de liderança e tomada de decisão assertiva",
    practicalRelationships: [
      "Perceba quando você está controlando demais uma situação familiar. Solte. Pergunte ao invés de dirigir.",
      "Esta semana, deixe alguém tomar uma decisão que normalmente seria sua. Observe como você se sente.",
      "Quando seu parceiro ou amigo errar, resista ao impulso de corrigir. Apenas escute."
    ],
    practicalWork: [
      "Delegue uma tarefa importante sem dar instruções detalhadas. Confie no processo.",
      "Em uma reunião, faça mais perguntas do que afirmações. Lidere ouvindo.",
      "Reconheça publicamente uma conquista de alguém da sua equipe que normalmente passaria despercebida."
    ],
    practicalSpiritual: [
      "Pratique 10 minutos de meditação focada em soltar o controle. Respire e confie.",
      "Um dia por mês, não planeje nada. Deixe o dia acontecer.",
      "Escreva sobre um momento em que você confiou em alguém e deu certo. O que isso te ensinou?"
    ],
    morningPractice: "Antes de planejar o dia, pergunte: 'O que realmente depende de mim hoje e o que posso confiar aos outros?'",
    dailyExpression: "Tome uma decisão importante com calma e delegue algo que normalmente faria sozinho",
    eveningReflection: "Onde liderei bem hoje? Onde posso confiar mais amanhã?",
    personalMantra: "Senhor, dá-me sabedoria para liderar e humildade para confiar. Em Ti está a minha força.",
    deepPatterns: [
      "Você provavelmente foi a pessoa responsável desde cedo. Na família, no trabalho, entre amigos.",
      "Quando algo dá errado, sua primeira reação é pensar no que você poderia ter feito diferente.",
      "Elogios te deixam desconfortável porque você sempre acha que poderia ter feito melhor.",
      "Você tem dificuldade de pedir ajuda. Parece fraqueza."
    ],
    commonChallenges: [
      "Carregar responsabilidades que não são suas porque 'ninguém mais vai fazer direito'.",
      "Sentir-se sozinho no topo, mesmo cercado de pessoas.",
      "Rigidez que afasta as pessoas que você mais quer por perto.",
      "Dificuldade em relaxar sem sentir culpa."
    ],
    cultivationPractices: [
      "Pratique pedir ajuda uma vez por semana, mesmo em algo pequeno.",
      "Quando sentir vontade de assumir algo, pergunte primeiro: 'Isso é realmente meu?'",
      "Celebre vitórias antes de já pensar no próximo desafio.",
      "Permita-se descansar sem precisar ter 'merecido'."
    ]
  },
  Amante: {
    name: "O Amante",
    description: "Você sente a vida com intensidade. Onde outros passam rápido, você para. Onde outros veem o comum, você encontra beleza. Suas emoções são profundas, suas conexões são intensas, e você não sabe viver pela metade. O problema é que essa sensibilidade que te torna tão especial também te fere com facilidade. Você ama demais, se entrega demais, e às vezes esquece que precisa guardar algo para si.",
    characteristics: [
      "Você se apaixona por pessoas, lugares, músicas, momentos. Tudo te toca profundamente.",
      "Quando ama, ama de verdade. Quando sofre, sofre intensamente. Não existe meio-termo.",
      "Precisa de conexão genuína para se sentir vivo. Superficialidade te entedia e te esvazia.",
      "Valoriza beleza em todas as formas: um pôr do sol, uma conversa profunda, um abraço demorado."
    ],
    visualStyle: "Sensual e íntimo, com foco em texturas, emoções e atmosfera envolvente",
    colorPalette: ["#8B0000", "#FFC0CB", "#800020", "#FFD700"],
    photographyDirection: "Ambientes aconchegantes, luz natural suave, close-ups emocionais, toques românticos",
    emoji: "❤️",
    powerPhrase: "Minha capacidade de amar profundamente é meu dom. Também mereço receber o que dou.",
    alignedBehavior: "Quando equilibrado, você cria conexões transformadoras e inspira outros a viverem com mais paixão e presença. Sua sensibilidade é um portal para experiências profundas.",
    excessBehavior: "Quando em excesso, você pode se perder no outro, criar dependência emocional ou sofrer desproporcionalmente por rejeições. Ciúme e possessividade aparecem quando você esquece seu próprio valor.",
    complementsEnergy: "trazendo paixão, profundidade emocional e sensibilidade genuína",
    reinforcesExpression: "adicionando calor humano e capacidade de criar conexões que transformam",
    practicalRelationships: [
      "Antes de se entregar completamente, pergunte: essa pessoa está investindo tanto quanto eu?",
      "Reserve um tempo só seu esta semana. Não é abandono, é nutrição.",
      "Expresse seu amor, mas também expresse suas necessidades. Seu parceiro não lê mentes."
    ],
    practicalWork: [
      "Traga beleza para seu ambiente de trabalho. Seu espaço influencia como você se sente.",
      "Conecte-se genuinamente com um colega. Pergunte como ele realmente está e escute de verdade.",
      "Encontre o que te apaixona no seu trabalho atual. Se não existe, isso é um sinal."
    ],
    practicalSpiritual: [
      "Pratique autocuidado como ato de amor próprio, não como recompensa.",
      "Dance sozinho em casa. Sinta seu corpo. Reconecte-se consigo.",
      "Escreva uma carta de amor para você mesmo. Sim, pode parecer estranho. Faça mesmo assim."
    ],
    morningPractice: "Olhe no espelho e diga algo genuinamente amoroso para si mesmo antes de amar qualquer outra pessoa hoje",
    dailyExpression: "Demonstre afeto a alguém importante E reserve um momento de prazer só para você",
    eveningReflection: "O que me nutriu hoje? O que me drenou? Estou recebendo tanto quanto dou?",
    personalMantra: "Jesus, ensina-me a amar como Tu amas: com entrega e sem me perder. Em Ti descanso.",
    deepPatterns: [
      "Você provavelmente já se perdeu em relacionamentos, priorizando o outro até esquecer de si.",
      "Quando alguém se afasta, você tende a achar que fez algo errado.",
      "Tem dificuldade de ficar sozinho porque o silêncio amplifica emoções.",
      "Você idealiza pessoas e depois sofre quando elas se revelam humanas."
    ],
    commonChallenges: [
      "Confundir intensidade com profundidade. Nem toda paixão é amor verdadeiro.",
      "Fazer do outro sua fonte de felicidade e depois sofrer quando ele falha.",
      "Medo de abandono que te faz aceitar menos do que merece.",
      "Dificuldade de estabelecer limites porque você não quer magoar ninguém."
    ],
    cultivationPractices: [
      "Antes de se entregar, pergunte: estou escolhendo ou estou precisando?",
      "Cultive fontes de prazer que não dependam de outra pessoa.",
      "Quando sentir ciúme, pare e pergunte: o que estou com medo de perder em mim?",
      "Pratique dizer não com amor. Limites são atos de cuidado, não de rejeição."
    ]
  },
  Criador: {
    name: "O Criador",
    description: "Você precisa criar. Não é capricho, é necessidade. Quando não está expressando algo, sente que está morrendo por dentro. Seu olhar encontra possibilidades onde outros veem limitações. Você não se contenta com o comum, busca o original, o autêntico, o que nunca foi feito. O problema é que essa busca pela expressão perfeita às vezes te paralisa. Você tem medo de criar algo medíocre, então às vezes prefere não criar nada.",
    characteristics: [
      "Você enxerga o mundo diferente. Onde outros veem problemas, você vê matéria-prima.",
      "Tem ideias constantes. Sua mente não para. Isso é dom e às vezes é exaustão.",
      "Não suporta cópias. Precisa colocar sua marca única em tudo que faz.",
      "Perfeccionismo te atrapalha mais do que ajuda. Você descarta projetos inteiros porque não ficaram 'perfeitos'."
    ],
    visualStyle: "Artístico e experimental, quebrando convenções com originalidade autêntica",
    colorPalette: ["#9B59B6", "#FF6B6B", "#4ECDC4", "#F39C12"],
    photographyDirection: "Ambientes criativos não convencionais, ângulos únicos, uso criativo de cores e luz",
    emoji: "🎨",
    powerPhrase: "Criar imperfeito é melhor do que não criar. Minha expressão não precisa ser perfeita para ter valor.",
    alignedBehavior: "Quando equilibrado, você manifesta sua visão única sem se prender à perfeição. Inspira outros a se expressarem e deixa sua marca genuína no mundo.",
    excessBehavior: "Quando em excesso, você se paralisa buscando a expressão perfeita, ou se frustra quando a realidade não corresponde à visão. Pode se isolar em seu mundo criativo.",
    complementsEnergy: "trazendo criatividade, originalidade e perspectivas que ninguém mais teria",
    reinforcesExpression: "adicionando inovação e capacidade de materializar ideias únicas e transformadoras",
    practicalRelationships: [
      "Compartilhe um projeto ainda incompleto com alguém de confiança. Vulnerabilidade criativa aproxima.",
      "Crie algo junto com alguém que você ama. Cozinhem, pintem, escrevam. O processo importa mais que o resultado.",
      "Quando criticarem sua criação, separe: isso é sobre a obra ou sobre mim?"
    ],
    practicalWork: [
      "Estabeleça prazos para suas ideias. Sem prazo, a busca pela perfeição nunca termina.",
      "Mostre seu trabalho antes de estar 'pronto'. Feedback melhora mais do que perfeccionismo.",
      "Reserve 30 minutos por dia para criar sem objetivo. Sem julgamento. Só expressão."
    ],
    practicalSpiritual: [
      "Crie algo feio de propósito. Liberte-se da tirania do perfeito.",
      "Visite uma exposição, show ou feira criativa. Alimente sua alma de referências.",
      "Termine algo hoje. Qualquer coisa. O ato de concluir é espiritual."
    ],
    morningPractice: "Antes de qualquer autocrítica, pergunte: o que quero expressar hoje, mesmo imperfeito?",
    dailyExpression: "Crie algo e mostre para alguém. A criação só vive quando é compartilhada",
    eveningReflection: "O que criei hoje? Onde o perfeccionismo me travou? O que posso terminar amanhã?",
    personalMantra: "Senhor, que minha criação Te glorifique. Liberta-me do medo de errar e usa minhas mãos.",
    deepPatterns: [
      "Você provavelmente tem projetos inacabados porque nenhum ficou 'bom o suficiente'.",
      "Compara seu trabalho com o de outros e sempre sai perdendo.",
      "Fica frustrado quando a realidade não corresponde à visão que tinha na cabeça.",
      "Às vezes prefere não mostrar do que mostrar e ser criticado."
    ],
    commonChallenges: [
      "Perfeccionismo que paralisa. Você não termina porque nunca está perfeito.",
      "Comparação com outros criadores que te faz questionar seu valor.",
      "Isolamento criativo: mergulhar tanto no seu mundo que esquece de viver.",
      "Sensação de que ninguém realmente entende o que você está tentando expressar."
    ],
    cultivationPractices: [
      "Defina 'pronto' antes de começar. Quando chegar lá, pare.",
      "Mostre trabalhos em progresso. O feedback é parte do processo.",
      "Celebre o que criou antes de já pensar no que falta.",
      "Crie algo todo dia, mesmo pequeno. Consistência supera inspiração."
    ]
  },
  Inocente: {
    name: "O Inocente",
    description: "Você vê o mundo com olhos que outros perderam. Onde há cinismo, você encontra esperança. Onde há complexidade, você busca simplicidade. Sua fé nas pessoas e na vida não é ingenuidade, é escolha consciente. Você sabe que o mundo pode ser duro, mas prefere focar no que há de bom. O problema é que essa pureza às vezes te deixa vulnerável. Você confia demais, espera demais, e quando a realidade decepciona, a queda é grande.",
    characteristics: [
      "Você tende a ver o melhor nas pessoas, mesmo quando já te decepcionaram.",
      "Prefere simplicidade a complicação. Para você, muitas coisas poderiam ser mais fáceis se as pessoas não complicassem.",
      "Fica genuinamente feliz com coisas pequenas: um dia de sol, um café gostoso, uma risada.",
      "Tem dificuldade de entender maldade gratuita. Sempre tenta encontrar uma justificativa."
    ],
    visualStyle: "Luminoso e leve, com atmosfera alegre, natural e despreocupada",
    colorPalette: ["#87CEEB", "#FFE4E1", "#FFFACD", "#E0FFFF"],
    photographyDirection: "Ambientes naturais, luz do dia clara, expressões autênticas de alegria, cenários simples",
    emoji: "🌟",
    powerPhrase: "Minha fé no bem é força, não fraqueza. Posso ver a luz sem negar a sombra.",
    alignedBehavior: "Quando equilibrado, você irradia esperança genuína sem ser ingênuo. Inspira outros a verem possibilidades e traz leveza para situações pesadas.",
    excessBehavior: "Quando em excesso, você nega problemas reais, confia em quem não deveria e depois se surpreende quando é traído. Pode parecer imaturo ou desconectado da realidade.",
    complementsEnergy: "trazendo otimismo, leveza e fé genuína nas pessoas e no futuro",
    reinforcesExpression: "adicionando esperança e capacidade de ver possibilidades onde outros só veem problemas",
    practicalRelationships: [
      "Confie, mas observe. Nem todos merecem sua abertura imediata.",
      "Quando alguém te decepcionar, permita-se sentir raiva. Não precisa justificar tudo.",
      "Escolha com quem compartilhar sua pureza. Alguns vão valorizar, outros vão se aproveitar."
    ],
    practicalWork: [
      "Sua positividade é valiosa, mas aprenda a identificar riscos reais antes de minimizá-los.",
      "Quando algo der errado, resista ao impulso de dizer 'vai dar tudo certo' antes de entender o problema.",
      "Use sua capacidade de ver o positivo para motivar a equipe, mas também seja realista sobre prazos."
    ],
    practicalSpiritual: [
      "Passe tempo na natureza. Ela te reconecta com a simplicidade que você valoriza.",
      "Quando sentir que perdeu a fé, lembre-se: escolher acreditar é coragem, não ignorância.",
      "Pratique discernimento como forma de proteção, não de cinismo."
    ],
    morningPractice: "O que há de bom esperando por mim hoje? E do que preciso me proteger?",
    dailyExpression: "Compartilhe sua alegria com alguém E observe se está ignorando algo importante",
    eveningReflection: "Onde minha fé se confirmou hoje? Onde eu poderia ter sido mais atento?",
    personalMantra: "Senhor, ajuda-me a ver o bem sem negar a verdade. Em Ti coloco minha esperança.",
    deepPatterns: [
      "Você provavelmente já foi chamado de ingênuo ou 'sonhador demais'.",
      "Tem dificuldade de guardar mágoas. Perdoa rápido demais às vezes.",
      "Quando alguém te decepciona, você primeiro duvida de si do que da pessoa.",
      "Ambientes negativos te drenam completamente."
    ],
    commonChallenges: [
      "Confiar em quem não merece e depois se surpreender com a traição.",
      "Negar problemas reais porque é mais fácil do que enfrentá-los.",
      "Ser visto como imaturo ou desconectado por pessoas mais 'realistas'.",
      "Sofrer muito quando a realidade contradiz suas expectativas."
    ],
    cultivationPractices: [
      "Pratique dizer 'preciso pensar' antes de confiar cegamente.",
      "Quando algo parecer bom demais, pergunte: o que eu não estou vendo?",
      "Permita-se sentir decepção. Nem tudo tem explicação positiva.",
      "Escolha conscientemente em quem depositar sua fé. Nem todos merecem."
    ]
  },
  Sábio: {
    name: "O Sábio",
    description: "Você busca entender. Não se contenta com respostas superficiais, precisa ir fundo, encontrar a verdade, compreender o porquê das coisas. Seu prazer está no conhecimento, na reflexão, no momento em que as peças se encaixam. O problema é que às vezes você fica tanto tempo pensando que esquece de viver. Analisa tanto que paralisa. Sabe tanto que se desconecta de quem não acompanha seu ritmo mental.",
    characteristics: [
      "Você questiona tudo. Aceitar algo só porque 'é assim' não funciona para você.",
      "Prefere observar antes de agir. Precisa entender o contexto antes de se posicionar.",
      "Livros, conversas profundas e ideias complexas te energizam mais do que festas.",
      "Às vezes sua mente não para. Você pensa demais, analisa demais, preocupa-se demais."
    ],
    visualStyle: "Contemplativo e intelectual, com atmosfera de introspecção e profundidade",
    colorPalette: ["#2C3E50", "#95A5A6", "#34495E", "#7F8C8D"],
    photographyDirection: "Bibliotecas, espaços de estudo, luz suave que convida à reflexão, expressões pensativas",
    emoji: "📚",
    powerPhrase: "Saber muito não significa saber tudo. Posso aprender com quem sabe diferente.",
    alignedBehavior: "Quando equilibrado, você compartilha conhecimento com humildade e ajuda outros a encontrarem suas próprias respostas. Sua sabedoria ilumina sem ofuscar.",
    excessBehavior: "Quando em excesso, você se isola em seu mundo intelectual, julga quem sabe menos ou paralisa na análise eterna. Pode parecer arrogante ou desconectado.",
    complementsEnergy: "trazendo sabedoria, análise profunda e discernimento para suas escolhas",
    reinforcesExpression: "adicionando clareza mental e capacidade de encontrar verdades que outros não veem",
    practicalRelationships: [
      "Quando alguém te contar um problema, pergunte: ela quer conselho ou quer ser ouvida?",
      "Valorize também a sabedoria emocional dos outros. Nem todo conhecimento vem de livros.",
      "Pare de corrigir informações pequenas. Nem toda conversa é debate."
    ],
    practicalWork: [
      "Estabeleça um prazo para decisões. Análise infinita é procrastinação disfarçada.",
      "Ensine algo que você sabe. Conhecimento guardado é conhecimento perdido.",
      "Ouça ideias de pessoas menos 'qualificadas'. Elas podem ver o que você não vê."
    ],
    practicalSpiritual: [
      "Pratique silêncio mental. Nem todo momento precisa de análise.",
      "Experimente algo novo sem pesquisar antes. Deixe a experiência te ensinar.",
      "Escreva sobre o que você não sabe. Humildade intelectual é sabedoria madura."
    ],
    morningPractice: "O que quero aprender hoje? E o que quero VIVER, não só entender?",
    dailyExpression: "Compartilhe um insight valioso E faça algo sem pensar demais",
    eveningReflection: "O que aprendi hoje? Onde pensei demais ao invés de agir?",
    personalMantra: "Senhor, conduze-me à Verdade que liberta. Que eu saiba menos e Te conheça mais.",
    deepPatterns: [
      "Você provavelmente foi a criança que fazia perguntas que adultos não sabiam responder.",
      "Tem dificuldade de respeitar autoridades que não demonstram conhecimento.",
      "Às vezes se sente sozinho porque poucos acompanham suas reflexões.",
      "Analisa relacionamentos ao invés de simplesmente vivê-los."
    ],
    commonChallenges: [
      "Paralisia por análise: pensar tanto que não consegue agir.",
      "Arrogância intelectual que afasta pessoas.",
      "Desconexão emocional: entender não é o mesmo que sentir.",
      "Dificuldade de aceitar que algumas coisas não têm explicação."
    ],
    cultivationPractices: [
      "Pratique decidir com 80% de informação. Perfeição não existe.",
      "Quando for ensinar, pergunte primeiro. Ensino começa com escuta.",
      "Reserve tempo para atividades 'inúteis'. Nem tudo precisa ter propósito.",
      "Valorize o saber do corpo, não só da mente."
    ]
  },
  Explorador: {
    name: "O Explorador",
    description: "Você não nasceu para ficar parado. Existe em você uma inquietação saudável que te empurra para além do conhecido, do seguro, do previsível. Liberdade não é luxo para você, é oxigênio. O problema é que essa sede de novidade às vezes te impede de criar raízes. Você começa muitas coisas e termina poucas. Foge quando as coisas ficam rotineiras porque confunde estabilidade com prisão.",
    characteristics: [
      "Rotina te sufoca. Você precisa de novidade, variedade, movimento.",
      "Compromissos de longo prazo te assustam. Não porque não quer, mas porque teme perder liberdade.",
      "Você se sente mais vivo viajando, conhecendo pessoas novas, experimentando o desconhecido.",
      "Quando algo se torna familiar demais, você já está pensando no próximo destino."
    ],
    visualStyle: "Dinâmico e expansivo, capturando movimento, descoberta e horizontes abertos",
    colorPalette: ["#2ECC71", "#3498DB", "#F39C12", "#E67E22"],
    photographyDirection: "Ambientes externos, paisagens abertas, captura de movimento, expressões de admiração e descoberta",
    emoji: "🧭",
    powerPhrase: "Posso explorar o mundo e ainda assim criar um lugar para chamar de lar.",
    alignedBehavior: "Quando equilibrado, você inspira outros a expandirem horizontes e vive experiências que enriquecem genuinamente. Sua liberdade não exclui conexão.",
    excessBehavior: "Quando em excesso, você foge de compromissos, abandona projetos no meio e confunde qualquer estabilidade com prisão. Fica inquieto mesmo quando deveria estar presente.",
    complementsEnergy: "trazendo espírito aventureiro, curiosidade insaciável e abertura ao novo",
    reinforcesExpression: "adicionando coragem para explorar caminhos que ninguém tentou antes",
    practicalRelationships: [
      "Compromisso não é prisão. Você pode escolher alguém e ainda ser livre.",
      "Quando sentir vontade de fugir, pergunte: estou buscando algo ou fugindo de algo?",
      "Leve as pessoas que ama nas suas aventuras. Explorar sozinho fica vazio."
    ],
    practicalWork: [
      "Termine um projeto antes de começar o próximo. A conclusão também é descoberta.",
      "Encontre formas de explorar dentro da sua área. Nem toda aventura exige mudar de carreira.",
      "Quando a rotina apertar, mude pequenas coisas antes de abandonar tudo."
    ],
    practicalSpiritual: [
      "Explore mundos internos também. Meditação, autoconhecimento, silêncio.",
      "Pergunte-se: do que estou fugindo quando busco o próximo destino?",
      "Aprenda a encontrar novidade no familiar. O extraordinário existe no cotidiano."
    ],
    morningPractice: "O que posso descobrir hoje, mesmo ficando onde estou?",
    dailyExpression: "Explore algo novo E permaneça presente em algo que já começou",
    eveningReflection: "O que descobri hoje? De onde fugi? Onde poderia ter ficado mais?",
    personalMantra: "Senhor, ensina-me a encontrar plenitude em Ti, onde quer que eu esteja. Tu és o bastante.",
    deepPatterns: [
      "Você provavelmente tem histórico de abandonar coisas quando ficam 'chatas'.",
      "Relacionamentos longos te assustam porque você teme perder sua identidade.",
      "Sente culpa por não conseguir se satisfazer com o que tem.",
      "Compara sua vida com a de quem parece viver mais aventuras."
    ],
    commonChallenges: [
      "Confundir estabilidade com prisão e fugir de coisas boas.",
      "Não terminar o que começa porque já está pensando no próximo.",
      "Dificuldade de estar presente porque está sempre planejando o futuro.",
      "Usar viagens e mudanças para fugir de problemas internos."
    ],
    cultivationPractices: [
      "Antes de abandonar algo, pergunte: explorei tudo que há aqui?",
      "Pratique encontrar novidade no familiar. Olhe de novo para o que já conhece.",
      "Comprometa-se com algo por um período definido. Liberdade também é escolher ficar.",
      "Explore seu mundo interno com a mesma curiosidade que explora o externo."
    ]
  },
  Rebelde: {
    name: "O Rebelde",
    description: "Você não aceita as coisas só porque sempre foram assim. Existe em você uma força que questiona, desafia, transforma. Você vê o que está errado quando outros preferem não ver. Dá voz ao que precisa ser dito quando outros se calam. O problema é que nem toda batalha é sua. Às vezes você luta contra tudo por reflexo, não por convicção. E a rebeldia sem direção vira destruição.",
    characteristics: [
      "Autoridade sem mérito te irrita profundamente. Você não obedece só porque mandam.",
      "Quando vê injustiça, sente necessidade física de fazer algo.",
      "Já foi chamado de 'difícil', 'do contra' ou 'radical'. E provavelmente sentiu orgulho.",
      "Tem dificuldade de seguir regras que não fazem sentido, mesmo quando seria mais fácil."
    ],
    visualStyle: "Ousado e não convencional, quebrando expectativas visuais com impacto",
    colorPalette: ["#000000", "#E74C3C", "#8E44AD", "#C0392B"],
    photographyDirection: "Ambientes urbanos alternativos, contraste dramático, poses ousadas, estética underground",
    emoji: "⚡",
    powerPhrase: "Minha rebeldia tem propósito. Destruo o que não serve para construir o que importa.",
    alignedBehavior: "Quando equilibrado, você catalisa mudanças necessárias e dá voz ao que precisa ser dito. Sua coragem de questionar inspira outros a serem autênticos.",
    excessBehavior: "Quando em excesso, você briga por brigar, destrói sem construir e se isola de todos que não concordam. Sua força vira sabotagem, não transformação.",
    complementsEnergy: "trazendo coragem para questionar o estabelecido e impulso de mudança real",
    reinforcesExpression: "adicionando autenticidade radical e capacidade de quebrar padrões que limitam",
    practicalRelationships: [
      "Nem toda discordância precisa virar confronto. Escolha suas batalhas.",
      "Questione sistemas, não pessoas. Elas também são prisioneiras das estruturas.",
      "Permita que outros mudem no próprio ritmo. Revolução forçada gera resistência."
    ],
    practicalWork: [
      "Antes de destruir algo, tenha clareza do que vai construir no lugar.",
      "Encontre aliados. Mudança coletiva é mais poderosa que rebeldia solitária.",
      "Questione com soluções, não só com críticas. Transformação precisa de alternativas."
    ],
    practicalSpiritual: [
      "Pergunte-se: estou lutando por algo ou lutando contra tudo por hábito?",
      "Rebele-se contra seus próprios padrões também. A maior revolução é interna.",
      "Encontre paz com o que não pode mudar. Nem tudo é batalha."
    ],
    morningPractice: "Qual mudança realmente importa hoje? E o que posso aceitar como é?",
    dailyExpression: "Desafie algo que não serve E construa algo no lugar",
    eveningReflection: "Onde minha rebeldia foi construtiva? Onde foi só destrutiva?",
    personalMantra: "Senhor, dá-me discernimento para lutar pelo que é justo. Que minha força venha de Ti.",
    deepPatterns: [
      "Você provavelmente teve conflitos com autoridades desde cedo.",
      "Sente-se incompreendido com frequência. Poucos entendem sua intensidade.",
      "Quando algo vai bem demais, você desconfia. Estabilidade parece armadilha.",
      "Tem dificuldade de pertencer a grupos porque inevitavelmente discorda de algo."
    ],
    commonChallenges: [
      "Brigar contra tudo sem saber exatamente pelo que está lutando.",
      "Destruir relacionamentos, trabalhos e oportunidades por não saber ceder.",
      "Isolamento porque poucos 'entendem' você.",
      "Usar a rebeldia para evitar vulnerabilidade."
    ],
    cultivationPractices: [
      "Antes de reagir, pergunte: isso é importante ou é reflexo?",
      "Pratique aceitar algo que não concorda sem precisar mudar.",
      "Construa tanto quanto questiona. Destruição sem criação é vazia.",
      "Encontre comunidade com outros inconformados. Você não precisa lutar sozinho."
    ]
  },
  Mago: {
    name: "O Visionário",
    description: "Você vê o que outros não veem. Onde há limitação, você enxerga possibilidade. Onde há problema, você encontra o caminho que transforma. Sua intuição é aguçada, sua visão vai além do óbvio. Você percebe que a realidade pode ser transformada pelo discernimento e pela ação correta. O problema é que essa conexão com o extraordinário às vezes te desconecta do ordinário. Você vive tanto no mundo das possibilidades que esquece de ancorar no mundo concreto.",
    characteristics: [
      "Você percebe coisas que outros não percebem. Padrões, conexões, providências.",
      "Acredita genuinamente que pode transformar situações que parecem impossíveis.",
      "Sua intuição raramente erra, mas nem sempre você sabe explicar de onde vem.",
      "Às vezes se frustra porque sua visão está tão à frente que outros não acompanham."
    ],
    visualStyle: "Profundo e transformador, com elementos de luz e profundidade simbólica",
    colorPalette: ["#9B59B6", "#1ABC9C", "#F1C40F", "#2C3E50"],
    photographyDirection: "Efeitos de luz criativos, composições surreais, atmosfera contemplativa, transformações visuais",
    emoji: "✨",
    powerPhrase: "Minha visão se concretiza quando conecto discernimento com ação. Sonhar é o início, fazer é o poder.",
    alignedBehavior: "Quando equilibrado, você catalisa transformações reais e ajuda outros a enxergarem possibilidades que não viam. Sua visão se materializa em resultados concretos.",
    excessBehavior: "Quando em excesso, você vive no mundo das ideias sem nunca concretizar, manipula situações ou se desconecta da realidade em nome do seu dom. Promete transformações que não entrega.",
    complementsEnergy: "trazendo visão transformadora e capacidade de concretizar o que parece impossível",
    reinforcesExpression: "adicionando intuição aguçada e poder de catalisar mudanças profundas",
    practicalRelationships: [
      "Use sua percepção para ajudar outros, não para manipular.",
      "Nem todos querem ser transformados. Respeite o tempo de cada um.",
      "Comunique suas visões de forma que outros entendam. Clareza aproxima."
    ],
    practicalWork: [
      "Transforme visões em planos de ação concretos. Discernimento precisa de metodologia.",
      "Valide suas intuições com dados. Sua percepção + evidências = poder.",
      "Entregue resultados mensuráveis. Promessas sem entrega destroem credibilidade."
    ],
    practicalSpiritual: [
      "Pratique ancoramento na oração. Sua visão precisa de raízes na verdade.",
      "Questione: isso é intuição ou é o que eu quero acreditar?",
      "Use seu dom para servir, não para impressionar."
    ],
    morningPractice: "Que transformação quero catalisar hoje? E qual o primeiro passo concreto?",
    dailyExpression: "Confie em uma intuição E tome uma ação prática baseada nela",
    eveningReflection: "O que transformei hoje? Onde fiquei só no mundo das ideias?",
    personalMantra: "Espírito Santo, ilumina minha visão e guia meus passos. Que eu veja como Tu vês.",
    deepPatterns: [
      "Você provavelmente já previu coisas que depois aconteceram.",
      "Às vezes se sente mais conectado com o invisível do que com o tangível.",
      "Frustra-se porque sua visão está clara, mas a concretização demora.",
      "Já foi acusado de viver nas nuvens ou de ser desconectado da realidade."
    ],
    commonChallenges: [
      "Prometer grandes transformações e não entregar resultados concretos.",
      "Usar intuição como desculpa para não fazer o trabalho duro.",
      "Manipular situações e pessoas em nome de um 'bem maior'.",
      "Desconectar-se da realidade em nome do extraordinário."
    ],
    cultivationPractices: [
      "Para cada visão, crie um plano de ação com passos concretos.",
      "Pratique ancoramento: exercício físico, natureza, tarefas manuais.",
      "Valide intuições antes de agir. Nem toda intuição é verdade.",
      "Entregue pequenas transformações consistentemente antes de prometer as grandes."
    ]
  },
  Herói: {
    name: "O Herói",
    description: "Você não foge quando a vida aperta. Pelo contrário, é comum sentir que precisa ser forte, resolver e sustentar, mesmo quando isso te cansa. Existe em você uma força que se ativa diante do desafio. Você protege, enfrenta, supera. O problema é que você não sabe parar. Carrega peso demais, pede ajuda de menos, e quando finalmente para, às vezes já está no limite.",
    characteristics: [
      "Você tende a se cobrar muito e dificilmente fica satisfeito com algo feito pela metade.",
      "Quando alguém precisa de ajuda, você é o primeiro a se oferecer, mesmo sobrecarregado.",
      "Tem dificuldade de mostrar fraqueza. Vulnerabilidade parece falha.",
      "Busca excelência em tudo. Mediocridade te incomoda profundamente."
    ],
    visualStyle: "Épico e poderoso, transmitindo força, determinação e capacidade de superação",
    colorPalette: ["#C0392B", "#2C3E50", "#F39C12", "#ECF0F1"],
    photographyDirection: "Poses de ação, iluminação dramática, ambientes que sugerem conquista, expressões de determinação",
    emoji: "🦸",
    powerPhrase: "Tenho força para enfrentar desafios e sabedoria para não carregar o que não é meu.",
    alignedBehavior: "Quando equilibrado, você supera obstáculos com coragem e inspira outros a encontrarem sua própria força. Sabe quando lutar e quando pedir ajuda.",
    excessBehavior: "Quando em excesso, você se esgota salvando todos, não pede ajuda nunca e se frustra quando não é reconhecido. Pode se tornar arrogante ou se ressentir de quem não luta como você.",
    complementsEnergy: "trazendo coragem, determinação e força de vontade inabalável",
    reinforcesExpression: "adicionando capacidade de superar obstáculos e proteger quem precisa",
    practicalRelationships: [
      "Peça ajuda esta semana. Sim, você. Não é fraqueza, é humanidade.",
      "Deixe alguém cuidar de você por um momento. Heróis também precisam de suporte.",
      "Quando for ajudar, pergunte se a pessoa quer ajuda. Nem sempre quer ser salva."
    ],
    practicalWork: [
      "Reconheça publicamente contribuições de outros. Você não vence sozinho.",
      "Estabeleça limites. Assumir tudo não te faz herói, te faz exausto.",
      "Antes de assumir mais um desafio, pergunte: ainda tenho forças para isso?"
    ],
    practicalSpiritual: [
      "Descanse sem culpa. Recuperação faz parte da jornada do herói.",
      "Permita-se ser imperfeito. Você não precisa salvar todo mundo.",
      "Identifique de onde vem essa necessidade de provar. O que você está tentando demonstrar?"
    ],
    morningPractice: "Qual batalha é realmente minha hoje? E o que posso deixar de carregar?",
    dailyExpression: "Enfrente um desafio importante E peça ajuda em outro",
    eveningReflection: "Onde fui corajoso hoje? Onde carreguei peso demais? O que posso soltar?",
    personalMantra: "Senhor, Tu és minha fortaleza. Ensina-me a lutar com coragem e a descansar em Ti.",
    deepPatterns: [
      "Você provavelmente foi responsável por algo ou alguém desde muito cedo.",
      "Quando algo dá errado, sua primeira reação é pensar no que você poderia ter feito.",
      "Tem dificuldade de relaxar porque sempre sente que deveria estar fazendo algo.",
      "Ressente-se quando seu esforço não é reconhecido, mas não fala sobre isso."
    ],
    commonChallenges: [
      "Assumir responsabilidades que não são suas porque 'precisa ser feito'.",
      "Não pedir ajuda até estar no limite do esgotamento.",
      "Frustrar-se quando outros não lutam com a mesma intensidade.",
      "Confundir valor pessoal com capacidade de performance."
    ],
    cultivationPractices: [
      "Antes de assumir algo, pergunte: isso é realmente meu para carregar?",
      "Pratique pedir ajuda em coisas pequenas. É treino.",
      "Celebre vitórias antes de já pensar na próxima batalha.",
      "Descanse como se fosse parte do treinamento, não como prêmio."
    ]
  },
  Prestativo: {
    name: "O Prestativo",
    description: "Você se realiza cuidando. Quando alguém precisa, você está lá. Sua generosidade é genuína, seu cuidado é profundo. O problema é que às vezes você dá tanto que se esvazia. Cuida de todos menos de si. E quando ninguém cuida de você de volta, sente mágoa, mas não fala porque não quer parecer egoísta.",
    characteristics: [
      "Você percebe as necessidades dos outros antes mesmo deles falarem.",
      "Tem dificuldade de dizer não, especialmente quando alguém precisa de você.",
      "Se sente culpado quando faz algo só para si.",
      "Às vezes ressente secretamente quem não retribui seu cuidado."
    ],
    visualStyle: "Caloroso e acolhedor, focando em conexão humana e cuidado genuíno",
    colorPalette: ["#E8B4B8", "#95E1D3", "#F38181", "#AA96DA"],
    photographyDirection: "Ambientes acolhedores, interações humanas, luz suave e calorosa, expressões de cuidado",
    emoji: "🤗",
    powerPhrase: "Cuidar de mim não é egoísmo. É o que me permite continuar cuidando.",
    alignedBehavior: "Quando equilibrado, você nutre relações com cuidado genuíno sem se esvaziar. Sabe receber tanto quanto dar e estabelece limites saudáveis.",
    excessBehavior: "Quando em excesso, você se sacrifica até adoecer, cria dependência nos outros e ressente secretamente quem não retribui. Seu cuidado vira controle disfarçado.",
    complementsEnergy: "trazendo empatia profunda, cuidado genuíno e disponibilidade para apoiar",
    reinforcesExpression: "adicionando calor humano e capacidade de nutrir relacionamentos verdadeiros",
    practicalRelationships: [
      "Antes de ajudar, pergunte se a pessoa quer ajuda ou só quer ser ouvida.",
      "Aceite ajuda quando oferecerem. Dizer sim também é um ato de conexão.",
      "Expresse suas necessidades. Quem te ama quer saber do que você precisa."
    ],
    practicalWork: [
      "Estabeleça limites claros de até onde vai seu cuidado profissional.",
      "Cuide de si durante o expediente também. Pausa para você não é egoísmo.",
      "Reconheça quando está fazendo o trabalho emocional de outros."
    ],
    practicalSpiritual: [
      "Reserve tempo só para você, sem culpa. É recarregar, não abandonar.",
      "Pratique dizer não gentilmente. É cuidar de si para poder cuidar melhor.",
      "Pergunte-se: estou cuidando por amor ou para ser amado?"
    ],
    morningPractice: "Como posso cuidar de mim hoje para ter forças de cuidar dos outros?",
    dailyExpression: "Ofereça seu cuidado a alguém E reserve um momento só para você",
    eveningReflection: "Cuidei de quem precisava hoje? E de mim, cuidei também?",
    personalMantra: "Senhor, que meu cuidado flua do Teu amor. Ensina-me a receber para poder dar.",
    deepPatterns: [
      "Você provavelmente aprendeu cedo que seu valor está em ser útil.",
      "Sente culpa quando faz algo só para si, sem beneficiar ninguém.",
      "Atrai pessoas que precisam de muito e dão pouco em troca.",
      "Quando perguntam o que você quer, você não sabe responder."
    ],
    commonChallenges: [
      "Dar até se esvaziar e depois ressentir quem não retribui.",
      "Dificuldade de receber. Você dá, mas não sabe aceitar.",
      "Criar dependência nas pessoas ao invés de empoderá-las.",
      "Confundir amor com utilidade. Se não está ajudando, não se sente amado."
    ],
    cultivationPractices: [
      "Pratique receber. Quando oferecerem algo, aceite com gratidão.",
      "Pergunte-se: estou ajudando ou estou precisando ser necessário?",
      "Estabeleça um limite esta semana e mantenha-o.",
      "Faça algo só para você, sem utilidade prática."
    ]
  },
  "Bobo da Corte": {
    name: "O Bobo da Corte",
    description: "Você traz leveza para a vida. Onde outros veem peso, você encontra humor. Onde há tensão, você traz alívio. Sua capacidade de rir de si mesmo e não se levar a sério é um dom. O problema é que às vezes você usa o humor para evitar profundidade. Ri para não chorar. Brinca para não enfrentar.",
    characteristics: [
      "Você consegue fazer qualquer um rir, mesmo em situações tensas.",
      "Não se leva a sério e às vezes não entende por que outros levam tudo tão a sério.",
      "Usa humor quando está desconfortável. É sua forma de proteção.",
      "Pessoas te procuram quando precisam de leveza, mas nem sempre quando precisam de profundidade."
    ],
    visualStyle: "Alegre e dinâmico, capturando espontaneidade, diversão e alegria contagiante",
    colorPalette: ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6BCB77"],
    photographyDirection: "Momentos espontâneos, expressões genuínas de alegria, ambientes descontraídos, cores vibrantes",
    emoji: "🎭",
    powerPhrase: "Minha alegria é genuína E posso ser profundo quando preciso.",
    alignedBehavior: "Quando equilibrado, você traz perspectiva saudável e alegria genuína sem fugir do que é sério. Seu humor cura e conecta.",
    excessBehavior: "Quando em excesso, você usa o humor como escudo para evitar vulnerabilidade. Brinca com coisas que deveriam ser tratadas com seriedade e depois se sente sozinho.",
    complementsEnergy: "trazendo humor inteligente, leveza necessária e capacidade de aliviar tensões",
    reinforcesExpression: "adicionando espontaneidade genuína e alegria que contagia e transforma ambientes",
    practicalRelationships: [
      "Quando alguém te contar algo sério, resista ao impulso de fazer piada. Só escute.",
      "Permita-se chorar na frente de alguém de confiança. Vulnerabilidade conecta mais que piada.",
      "Quando usar humor, pergunte: estou conectando ou estou fugindo?"
    ],
    practicalWork: [
      "Seu humor é valioso, mas saiba quando é hora de ser sério.",
      "Use leveza para conectar equipes, não para evitar conversas difíceis.",
      "Quando criticarem algo sério, não responda com piada. Responda com escuta."
    ],
    practicalSpiritual: [
      "Reserve momentos de silêncio. Nem tudo precisa de comentário engraçado.",
      "Pergunte-se: do que estou rindo para não chorar?",
      "Pratique presença sem performance. Você é valioso mesmo sem entreter."
    ],
    morningPractice: "Onde posso trazer leveza genuína hoje? E onde preciso ser presente sem piadas?",
    dailyExpression: "Faça alguém rir E tenha uma conversa séria sem usar humor como escape",
    eveningReflection: "Onde meu humor conectou hoje? Onde usei ele para fugir?",
    personalMantra: "Senhor, que minha alegria venha de Ti. Ensina-me a rir com leveza e chorar com fé.",
    deepPatterns: [
      "Você provavelmente aprendeu que ser engraçado garantia aceitação.",
      "Quando a conversa fica séria demais, você sente desconforto e quer aliviar.",
      "Às vezes sente que ninguém te conhece de verdade porque só veem o palhaço.",
      "Usa humor para testar se as pessoas vão gostar de você antes de mostrar quem é."
    ],
    commonChallenges: [
      "Usar piada para fugir de conversas difíceis ou emoções desconfortáveis.",
      "Não ser levado a sério mesmo quando quer ser.",
      "Sentir-se vazio quando não está entretendo.",
      "Dificuldade de criar intimidade verdadeira porque sempre está 'atuando'."
    ],
    cultivationPractices: [
      "Permita silêncios desconfortáveis sem preenchê-los com humor.",
      "Compartilhe algo vulnerável com alguém de confiança, sem fazer piada.",
      "Observe quando você usa humor como escudo. O que está evitando?",
      "Pratique ser você mesmo sem precisar ser engraçado."
    ]
  },
  "Homem Comum": {
    name: "O Homem Comum",
    description: "Você valoriza o autêntico, o simples, o verdadeiro. Não precisa de holofotes ou status para se sentir bem. Seu maior desejo é pertencer, conectar, ser parte de algo maior sem precisar se destacar. O problema é que às vezes você se diminui para caber. Evita brilhar para não parecer arrogante. E no processo, deixa de ocupar o espaço que merece.",
    characteristics: [
      "Você se sente mais confortável em grupo do que em destaque.",
      "Pretensão te incomoda. Pessoas que se acham melhores que outras te irritam.",
      "Valoriza o comum, o cotidiano, o simples. Luxo excessivo não te atrai.",
      "Tem dificuldade de aceitar elogios. Tende a diminuir suas conquistas."
    ],
    visualStyle: "Natural e genuíno, sem artifícios ou pretensões, transmitindo autenticidade acessível",
    colorPalette: ["#A8DADC", "#457B9D", "#F1FAEE", "#E63946"],
    photographyDirection: "Ambientes cotidianos, luz natural, poses relaxadas, expressões autênticas e acessíveis",
    emoji: "👤",
    powerPhrase: "Pertenço a este mundo exatamente como sou. Meu valor não depende de ser especial.",
    alignedBehavior: "Quando equilibrado, você cria conexões genuínas e faz todos se sentirem incluídos. Sua autenticidade é magnética e seu senso de comunidade constrói pontes.",
    excessBehavior: "Quando em excesso, você se diminui para caber, evita qualquer destaque e pode se tornar invisível. Sabota oportunidades de crescimento por medo de parecer pretensioso.",
    complementsEnergy: "trazendo autenticidade, simplicidade e senso de pertencimento que une",
    reinforcesExpression: "adicionando acessibilidade genuína e capacidade de incluir todos",
    practicalRelationships: [
      "Aceite um elogio com gratidão, sem diminuí-lo. 'Obrigado' basta.",
      "Inclua alguém que parece de fora. Você sabe como é importante pertencer.",
      "Compartilhe uma conquista sua sem se desculpar por ela."
    ],
    practicalWork: [
      "Candidate-se àquela vaga ou projeto que parece 'demais' para você. Você merece.",
      "Reconheça seu diferencial. Humildade não é invisibilidade.",
      "Quando for incluído em algo, não pergunte 'por que eu?'. Pergunte 'como posso contribuir?'"
    ],
    practicalSpiritual: [
      "Você pertence a este mundo exatamente como é. Não precisa ser extraordinário.",
      "Pratique receber reconhecimento sem diminuí-lo.",
      "Pergunte-se: onde estou me escondendo para não parecer pretensioso?"
    ],
    morningPractice: "Eu pertenço. Eu tenho valor. Hoje vou ocupar meu espaço sem me desculpar.",
    dailyExpression: "Conecte-se genuinamente com alguém E reconheça seu próprio valor em algo",
    eveningReflection: "Onde me conectei hoje? Onde me diminuí desnecessariamente?",
    personalMantra: "Senhor, Tu me criaste com propósito. Ajuda-me a ocupar o lugar que preparaste para mim.",
    deepPatterns: [
      "Você provavelmente aprendeu que se destacar era perigoso ou arrogante.",
      "Compara-se com outros e sempre acha que eles são mais qualificados.",
      "Quando algo bom acontece para você, espera que algo ruim venha para equilibrar.",
      "Sente-se impostor quando é reconhecido."
    ],
    commonChallenges: [
      "Diminuir-se para caber e depois ressentir-se de ser invisível.",
      "Evitar oportunidades de crescimento por medo de parecer pretensioso.",
      "Dificuldade de reconhecer que você também tem algo único a oferecer.",
      "Ficar em relacionamentos ou trabalhos medianos por não acreditar que merece mais."
    ],
    cultivationPractices: [
      "Liste 5 coisas em que você é bom. Leia todo dia até acreditar.",
      "Quando minimizar uma conquista, pare e reformule com reconhecimento.",
      "Permita-se desejar mais sem culpa. Ambição não é arrogância.",
      "Ocupe um espaço de destaque esta semana, mesmo pequeno."
    ]
  },
  Cuidador: {
    name: "O Cuidador",
    description: "Você se realiza protegendo e nutrindo. Quando alguém precisa, você está lá, não por obrigação, mas porque cuidar é sua linguagem de amor. Você cria ambientes seguros, oferece suporte incondicional e faz os outros se sentirem acolhidos. O problema é que às vezes você cuida tanto dos outros que esquece de si. E quando ninguém cuida de você de volta, a mágoa cresce em silêncio.",
    characteristics: [
      "Você antecipa as necessidades dos outros antes mesmo deles pedirem.",
      "Sente-se útil e realizado quando está ajudando alguém.",
      "Tem dificuldade de pedir ajuda porque está acostumado a ser quem oferece.",
      "Às vezes se ressente quando seu cuidado não é reconhecido ou retribuído."
    ],
    visualStyle: "Acolhedor e protetor, transmitindo segurança, calor humano e cuidado genuíno",
    colorPalette: ["#E8B4B8", "#95E1D3", "#F5E6E8", "#7FCDCD"],
    photographyDirection: "Ambientes familiares, luz suave e quente, gestos de carinho, atmosfera de segurança",
    emoji: "🌱",
    powerPhrase: "Cuido dos outros com amor e também permito que cuidem de mim.",
    alignedBehavior: "Quando equilibrado, você protege e nutre sem se esgotar, estabelece limites saudáveis e sabe pedir ajuda quando precisa. Seu cuidado empodera ao invés de criar dependência.",
    excessBehavior: "Quando em excesso, você se sacrifica até adoecer, cria dependência emocional e ressente secretamente quem não retribui. Pode se tornar controlador em nome do 'cuidado'.",
    complementsEnergy: "trazendo proteção, nutrição emocional e capacidade de criar ambientes seguros",
    reinforcesExpression: "adicionando compaixão ativa e habilidade de acolher quem precisa",
    practicalRelationships: [
      "Quando for ajudar, pergunte primeiro: essa pessoa quer ajuda ou quer ser ouvida?",
      "Aceite quando oferecerem cuidado. Receber também é um ato de amor.",
      "Expresse quando estiver cansado. Quem te ama quer saber."
    ],
    practicalWork: [
      "Delegue tarefas de cuidado. Você não precisa ser o único que cuida.",
      "Reserve pausas para si mesmo durante o dia. Não é egoísmo.",
      "Reconheça quando está fazendo mais do que sua função exige."
    ],
    practicalSpiritual: [
      "Pratique autocuidado como ritual, não como recompensa.",
      "Pergunte-se: estou cuidando por amor ou para me sentir necessário?",
      "Reserve um dia por mês só para você, sem culpa."
    ],
    morningPractice: "Como posso cuidar de mim hoje para ter forças de cuidar dos outros?",
    dailyExpression: "Ofereça seu cuidado genuíno E aceite cuidado de alguém",
    eveningReflection: "Quem cuidei hoje? E quem cuidou de mim? Estou em equilíbrio?",
    personalMantra: "Meu cuidado flui naturalmente quando também me permito ser cuidado",
    deepPatterns: [
      "Você provavelmente assumiu papel de cuidador desde cedo, na família ou entre amigos.",
      "Quando não está cuidando de alguém, sente-se perdido ou sem propósito.",
      "Atrai pessoas que precisam de muito suporte.",
      "Sente culpa quando faz algo só para si."
    ],
    commonChallenges: [
      "Esgotar-se cuidando dos outros e não sobrar forças para si.",
      "Criar dependência nas pessoas ao invés de empoderá-las.",
      "Dificuldade de receber cuidado. Você só sabe dar.",
      "Ressentir-se em silêncio quando seu esforço não é reconhecido."
    ],
    cultivationPractices: [
      "Pratique dizer 'não' com amor. Limites protegem você e o outro.",
      "Aceite ajuda quando oferecerem, sem justificar ou devolver imediatamente.",
      "Identifique de onde vem essa necessidade de cuidar. O que você está buscando?",
      "Cuide de si com a mesma dedicação que cuida dos outros."
    ]
  },
  Realista: {
    name: "O Realista",
    description: "Você vê as coisas como são, não como gostaria que fossem. Enquanto outros sonham acordados, você analisa, planeja e executa com os pés no chão. Sua praticidade é valiosa: você entrega resultados quando outros ainda estão debatendo possibilidades. O problema é que às vezes você limita o que é possível antes mesmo de tentar. E pode parecer pessimista para quem não entende que você está apenas sendo prático.",
    characteristics: [
      "Você prefere fatos a promessas. Resultados concretos te interessam mais que grandes visões.",
      "Tem dificuldade com pessoas que 'vivem nas nuvens' ou fazem planos irrealistas.",
      "Sua primeira reação a ideias novas é pensar nos obstáculos. Não é negatividade, é análise.",
      "Valoriza estabilidade e segurança. Riscos desnecessários não fazem sentido para você."
    ],
    visualStyle: "Sólido e confiável, transmitindo estabilidade, competência e senso de realidade",
    colorPalette: ["#5D6D7E", "#85929E", "#ABB2B9", "#566573"],
    photographyDirection: "Ambientes funcionais, iluminação natural e neutra, expressões sérias e confiáveis",
    emoji: "⚙️",
    powerPhrase: "Minha praticidade é força. E também posso sonhar antes de calcular.",
    alignedBehavior: "Quando equilibrado, você transforma visões em realidade através de planejamento sólido. Sua praticidade ancora os sonhos dos outros e entrega resultados consistentes.",
    excessBehavior: "Quando em excesso, você descarta possibilidades antes de explorá-las, frustra quem quer inovar e pode parecer negativo ou limitador. Mata sonhos em nome da 'realidade'.",
    complementsEnergy: "trazendo praticidade, senso de realidade e capacidade de execução",
    reinforcesExpression: "adicionando análise criteriosa e habilidade de transformar ideias em planos viáveis",
    practicalRelationships: [
      "Antes de apontar problemas em uma ideia, ouça completamente. Às vezes seu parceiro só quer sonhar em voz alta.",
      "Permita-se fazer algo sem propósito prático de vez em quando.",
      "Quando alguém compartilhar um sonho, pergunte como pode ajudar antes de listar obstáculos."
    ],
    practicalWork: [
      "Use sua análise para viabilizar ideias, não para descartá-las.",
      "Seja o ponte entre visão e execução, não o bloqueador.",
      "Reconheça que inovação às vezes requer tolerar incerteza."
    ],
    practicalSpiritual: [
      "Pratique sonhar sem calcular viabilidade. Só permita-se imaginar.",
      "Pergunte-se: o que seria possível se eu suspendesse minha análise por um momento?",
      "Reserve tempo para atividades 'inúteis'. Nem tudo precisa de resultado."
    ],
    morningPractice: "O que é realista hoje? E que possibilidade nova posso considerar antes de descartar?",
    dailyExpression: "Use sua praticidade para viabilizar algo E ouça uma ideia sem analisar imediatamente",
    eveningReflection: "Onde minha praticidade ajudou? Onde limitei possibilidades cedo demais?",
    personalMantra: "Meus pés estão no chão e minha mente também pode explorar o céu",
    deepPatterns: [
      "Você provavelmente aprendeu que sonhar demais leva a decepções.",
      "Frustra-se com pessoas que não planejam ou que fazem promessas irrealistas.",
      "Às vezes é visto como pessimista quando está apenas sendo prático.",
      "Tem dificuldade de se animar com possibilidades antes de verificar viabilidade."
    ],
    commonChallenges: [
      "Limitar o que é possível antes de explorar opções.",
      "Parecer negativo para quem tem mais otimismo natural.",
      "Perder oportunidades por esperar certeza que nunca vem.",
      "Dificuldade de apreciar o processo quando o resultado ainda não é visível."
    ],
    cultivationPractices: [
      "Quando ouvir uma ideia nova, espere 24 horas antes de apontar problemas.",
      "Pratique dizer 'como podemos fazer isso funcionar?' antes de 'isso não vai dar certo'.",
      "Permita-se um projeto sem garantia de resultado.",
      "Celebre progressos, não só conclusões."
    ]
  },
  Comediante: {
    name: "O Comediante",
    description: "Você transforma o pesado em leve. Onde há tensão, você encontra uma piada. Onde há drama, você traz perspectiva. Sua capacidade de fazer os outros rirem é genuína e poderosa. O problema é que às vezes você usa o humor para evitar sentir. Ri para não enfrentar. E quando finalmente para de fazer piada, não sabe quem você é.",
    characteristics: [
      "Você consegue aliviar qualquer ambiente com uma observação bem colocada.",
      "Percebe o absurdo em situações que outros levam a sério.",
      "Usa autocrítica como ferramenta de conexão, mas às vezes vai longe demais.",
      "Quando algo te machuca, sua primeira reação é fazer graça."
    ],
    visualStyle: "Expressivo e energético, capturando timing, expressão e conexão instantânea",
    colorPalette: ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6BCB77"],
    photographyDirection: "Captura de expressões genuínas, momentos de riso, alegria contagiante",
    emoji: "😄",
    powerPhrase: "Meu humor é dom. E por baixo dele existe uma pessoa completa, com todas as emoções.",
    alignedBehavior: "Quando equilibrado, você usa humor para conectar, curar e trazer perspectiva sem fugir da profundidade. Sabe quando rir e quando estar presente de outras formas.",
    excessBehavior: "Quando em excesso, você transforma tudo em piada, não é levado a sério quando deveria e usa humor para fugir de emoções desconfortáveis. Sente-se vazio quando para de atuar.",
    complementsEnergy: "trazendo leveza essencial, perspectiva cômica e capacidade de transformar clima",
    reinforcesExpression: "adicionando timing perfeito e habilidade de criar conexão instantânea através do riso",
    practicalRelationships: [
      "Quando alguém te contar algo doloroso, resista à piada. Presença silenciosa também conecta.",
      "Mostre quem você é por baixo do personagem engraçado. Vulnerabilidade gera intimidade real.",
      "Pergunte-se: estou fazendo rir para conectar ou para fugir?"
    ],
    practicalWork: [
      "Seu humor é valioso em equipes, mas saiba quando ser sério.",
      "Use leveza para motivar, não para evitar conversas difíceis.",
      "Quando fizerem uma crítica séria, ouça sem fazer graça."
    ],
    practicalSpiritual: [
      "Permita-se momentos de silêncio. Você não precisa entreter sempre.",
      "Explore o que você sente quando não está fazendo ninguém rir.",
      "Pergunte-se: do que tenho medo que aparece quando não estou sendo engraçado?"
    ],
    morningPractice: "Onde posso trazer leveza genuína hoje? E onde preciso estar presente de outras formas?",
    dailyExpression: "Faça alguém rir de verdade E tenha uma conversa séria sem usar humor como escape",
    eveningReflection: "Onde meu humor conectou? Onde usei ele para fugir de algo?",
    personalMantra: "Meu humor é uma das minhas cores, não a minha única cor",
    deepPatterns: [
      "Você provavelmente descobriu cedo que fazer rir garantia aceitação e atenção.",
      "Quando a conversa fica séria, você sente desconforto físico.",
      "Às vezes sente que ninguém conhece quem você realmente é.",
      "Usa autocrítica excessiva antes que outros possam te criticar."
    ],
    commonChallenges: [
      "Transformar tudo em piada, mesmo quando a situação pede seriedade.",
      "Não saber quem você é quando para de performar.",
      "Dificuldade de criar intimidade verdadeira porque sempre está atuando.",
      "Medo de que, se parasse de ser engraçado, ninguém mais te quisesse por perto."
    ],
    cultivationPractices: [
      "Fique em silêncio por 5 minutos em uma conversa sem preencher com humor.",
      "Compartilhe algo vulnerável sem fazer piada para aliviar.",
      "Pergunte a alguém próximo: como você me vê quando não estou tentando ser engraçado?",
      "Identifique momentos em que usa humor como escudo. O que está protegendo?"
    ]
  }
};

export interface ArchetypeScore {
  archetype: string;
  score: number;
}

// Mapeamento de respostas para arquétipos baseado no JSON fornecido
const ANSWER_TO_ARCHETYPE: Record<string, string[]> = {
  "Governante": ["1A","2B","3E","4C","5E","6E","7D","8B","9E","10A","11D","12E","14E","15D","16E","17E","18E","20B","21C","22A","23D","24B","25B","26A","27D","28C","29E","30B","31E","32D","33C","34D","35C","36D"],
  "Herói": ["1A","2B","3E","4D","6E","7D","8B","9E","10A","11D","12B","14E","15D","16E","17E","18E","19B","21C","22E","23D","24C","25B","26A","27B","28C","29E","31E","32D","33C","34D","35C","36D"],
  "Criador": ["1B","2C","3B","4B","5B","6D","7E","8C","9B","10C","11B","12B","13E","14C","15C","16C","17C","18C","19B","21A","22B","23E","24A","25A","26E","27A","28A","29D","30D","31B","34D","35D","36D"],
  "Mago": ["1B","2C","3B","4B","5B","6D","8D","9B","10E","12A","13D","14A","15C","16C","17C","18C","19B","21A","22B","23E","24A","25A","26E","27B","28A","29A","30A","31B","32B","33A","34A","35D","36A"],
  "Inocente": ["1C","2A","3C","4E","5A","6C","7E","8D","9D","10E","11E","12A","13D","14A","15D","16D","17A","18D","20A","21E","23B","24D","26D","27C","29A","30A","31C","32B","33A","34A","35C","36A"],
  "Realista": ["1C","2A","3A","4C","5C","6B","7C","8E","9E","10D","11C","12E","14B","15B","16D","17B","18E","20B","21D","22E","23A","24B","25C","26D","27D","28D","29B","30E","31D","32C","33B","34B","35B","36B"],
  "Cuidador": ["1D","2D","3E","4A","5D","6A","7B","8A","9C","10B","11B","12C","13A","14D","15A","16A","17A","18A","19A","20C","21B","22A","23E","24C","25D","26C","27E","28B","29C","30C","31A","32A","33D","35A","36C"],
  "Amante": ["1D","2D","3D","4A","5D","6A","7B","8A","9C","10B","11B","12C","13A","14D","15A","16A","17A","18A","19A","20C","21B","22A","23E","24C","25D","26C","27E","28B","29C","30C","31A","32A","33D","35A","36C"],
  "Explorador": ["1E","2E","3B","4D","5B","7A","8E","9A","10C","11A","12D","13B","14E","15E","16B","17D","18B","19E","20D","21A","22D","23C","24E","25E","26B","27C","28E","29D","30E","31C","32E","33E","34E","35E","36E"],
  "Rebelde": ["1E","2E","3B","4D","5B","7A","8C","9A","10C","11A","12D","13B","14E","15E","16B","17D","18B","19E","20D","21A","22D","23C","24E","25E","26B","27C","28E","29D","30E","31C","32E","33E","34E","35E","36E"],
  "Sábio": ["2C","3A","4E","5A","6B","7C","8E","9D","10D","11C","12E","13E","14B","15B","16D","17B","18D","19D","20E","21D","22C","23A","24D","25C","26D","27E","28D","29B","30B","31D","32C","33B","34B","35B","36B"],
  "Comediante": ["2A","5C","6C","9C","10C","11E","19C"],
  "Bobo da Corte": ["2A","5C","6C","9C","10C","11E","19C"],
  "Prestativo": ["1D","2D","3E","4A","5D","6A","7B","8A","9C","10B","11B","12C","13A","14D","15A","16A","17A","18A","19A","20C","21B","22A","23E","24C","25D","26C","27E","28B","29C","30C","31A","32A","33D","35A","36C"],
  "Homem Comum": ["1C","2A","3C","4E","5A","6C","7E","8D","9D","10E","11E","12A","13D","14A","15D","16D","17A","18D","20A","21E","23B","24D","26D","27C","29A","30A","31C","32B","33A","34A","35C","36A"]
};

export function calculateArchetypeScores(answers: any[]): ArchetypeScore[] {
  const scores: Record<string, number> = {};

  // Initialize all archetypes with 0
  Object.keys(ARCHETYPES).forEach(archetype => {
    scores[archetype] = 0;
  });

  // Count occurrences for each archetype based on answers
  answers.forEach((answer) => {
    const answerValue = answer.answer?.value || answer.answer;
    if (answerValue) {
      // Check which archetypes this answer contributes to
      Object.entries(ANSWER_TO_ARCHETYPE).forEach(([archetype, answerKeys]) => {
        if (answerKeys.includes(answerValue) && ARCHETYPES[archetype]) {
          scores[archetype] = (scores[archetype] || 0) + 1;
        }
      });
    }
  });

  // Convert to array and sort by score
  const sortedScores = Object.entries(scores)
    .map(([archetype, score]) => ({ archetype, score }))
    .sort((a, b) => b.score - a.score);

  return sortedScores;
}

export function getDominantArchetypes(scores: ArchetypeScore[]): {
  primary: ArchetypeScore;
  secondary?: ArchetypeScore;
  tertiary?: ArchetypeScore;
} {
  const [primary, secondary, tertiary] = scores;
  
  return {
    primary,
    secondary: secondary && secondary.score > 0 ? secondary : undefined,
    tertiary: tertiary && tertiary.score > 0 ? tertiary : undefined
  };
}
