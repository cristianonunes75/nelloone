import jsPDF from "jspdf";
import { EstilosConexaoAfetiva, getStyleData } from "./estilosConexaoAfetiva";

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
  love: { r: 236, g: 72, b: 153 },
};

const STYLE_COLORS: Record<string, { r: number; g: number; b: number }> = {
  presenca_ativa: { r: 59, g: 130, b: 246 },    // Blue
  expressao_verbal: { r: 139, g: 92, b: 246 },  // Purple
  cuidado_pratico: { r: 16, g: 185, b: 129 },   // Green
  gestos_simbolicos: { r: 245, g: 158, b: 11 }, // Orange
  conexao_fisica: { r: 244, g: 63, b: 94 },     // Rose
};

// Extended content for each style
const STYLE_CONTENT: Record<string, {
  light: { pt: string; 'pt-pt': string; en: string };
  strengths: { pt: string[]; 'pt-pt': string[]; en: string[] };
  vulnerabilities: { pt: string[]; 'pt-pt': string[]; en: string[] };
  emotionalDynamic: {
    whatTouches: { pt: string; 'pt-pt': string; en: string };
    whatHurts: { pt: string; 'pt-pt': string; en: string };
    rejectionResponse: { pt: string; 'pt-pt': string; en: string };
    howShowsLove: { pt: string; 'pt-pt': string; en: string };
    howFeelsLove: { pt: string; 'pt-pt': string; en: string };
    whatExpects: { pt: string; 'pt-pt': string; en: string };
    cantAsk: { pt: string; 'pt-pt': string; en: string };
    howProtects: { pt: string; 'pt-pt': string; en: string };
  };
  relationships: { pt: string; 'pt-pt': string; en: string };
  family: { pt: string; 'pt-pt': string; en: string };
  work: { pt: string; 'pt-pt': string; en: string };
  healingPoints: { pt: string[]; 'pt-pt': string[]; en: string[] };
  miguelAnalysis: { pt: string; 'pt-pt': string; en: string };
  selfExamQuestion: { pt: string; 'pt-pt': string; en: string };
}> = {
  expressao_verbal: {
    light: {
      pt: "Você cria vínculo quando cria clareza. Sua palavra é cuidado.",
      'pt-pt': "Tu crias vínculo quando crias clareza. A tua palavra é cuidado.",
      en: "You create bond when you create clarity. Your word is care."
    },
    strengths: {
      pt: ["Comunicação clara", "Afeto pela conversa", "Capacidade de resolver conflitos com diálogo", "Empatia verbal", "Capacidade de descrever sentimentos"],
      'pt-pt': ["Comunicação clara", "Afeto pela conversa", "Capacidade de resolver conflitos com diálogo", "Empatia verbal", "Capacidade de descrever sentimentos"],
      en: ["Clear communication", "Affection through conversation", "Ability to resolve conflicts with dialogue", "Verbal empathy", "Ability to describe feelings"]
    },
    vulnerabilities: {
      pt: ["Sensibilidade à falta de retorno", "Overthinking afetivo", "Interpretação emocional exagerada", "Ansiedade quando alguém 'desaparece'"],
      'pt-pt': ["Sensibilidade à falta de retorno", "Overthinking afetivo", "Interpretação emocional exagerada", "Ansiedade quando alguém 'desaparece'"],
      en: ["Sensitivity to lack of response", "Affective overthinking", "Exaggerated emotional interpretation", "Anxiety when someone 'disappears'"]
    },
    emotionalDynamic: {
      whatTouches: {
        pt: "Palavras sinceras, reconhecimento verbal, mensagens que mostram presença",
        'pt-pt': "Palavras sinceras, reconhecimento verbal, mensagens que mostram presença",
        en: "Sincere words, verbal recognition, messages that show presence"
      },
      whatHurts: {
        pt: "Silêncio prolongado, respostas monossilábicas, falta de feedback emocional",
        'pt-pt': "Silêncio prolongado, respostas monossilábicas, falta de feedback emocional",
        en: "Prolonged silence, monosyllabic responses, lack of emotional feedback"
      },
      rejectionResponse: {
        pt: "Tenta resolver com mais palavras, depois se fecha em racionalização",
        'pt-pt': "Tenta resolver com mais palavras, depois fecha-se em racionalização",
        en: "Tries to resolve with more words, then withdraws into rationalization"
      },
      howShowsLove: {
        pt: "Através de elogios, palavras de encorajamento, mensagens carinhosas e conversas profundas",
        'pt-pt': "Através de elogios, palavras de encorajamento, mensagens carinhosas e conversas profundas",
        en: "Through compliments, words of encouragement, loving messages and deep conversations"
      },
      howFeelsLove: {
        pt: "Quando ouve palavras sinceras de apreciação, quando é compreendido verbalmente",
        'pt-pt': "Quando ouve palavras sinceras de apreciação, quando é compreendido verbalmente",
        en: "When hearing sincere words of appreciation, when being verbally understood"
      },
      whatExpects: {
        pt: "Diálogo aberto, reciprocidade emocional, respostas às mensagens",
        'pt-pt': "Diálogo aberto, reciprocidade emocional, respostas às mensagens",
        en: "Open dialogue, emotional reciprocity, responses to messages"
      },
      cantAsk: {
        pt: "Para que alguém fale mais sobre o que sente, tem medo de parecer carente",
        'pt-pt': "Para que alguém fale mais sobre o que sente, tem medo de parecer carente",
        en: "For someone to talk more about what they feel, afraid of seeming needy"
      },
      howProtects: {
        pt: "Se fecha em silêncio ou racionaliza emoções para não sofrer",
        'pt-pt': "Fecha-se em silêncio ou racionaliza emoções para não sofrer",
        en: "Withdraws into silence or rationalizes emotions to avoid suffering"
      }
    },
    relationships: {
      pt: "Você precisa de diálogo. Quando alguém te ouve, seu coração repousa. Você ama conversas profundas, mensagens que mostram presença e palavras que criam ponte.",
      'pt-pt': "Tu precisas de diálogo. Quando alguém te ouve, o teu coração repousa. Tu amas conversas profundas, mensagens que mostram presença e palavras que criam ponte.",
      en: "You need dialogue. When someone listens to you, your heart rests. You love deep conversations, messages that show presence and words that create bridges."
    },
    family: {
      pt: "Você se irrita com silêncio prolongado. É sensível a mudanças de tom. Sente necessidade de organizar afetos com palavras.",
      'pt-pt': "Tu irritas-te com silêncio prolongado. És sensível a mudanças de tom. Sentes necessidade de organizar afetos com palavras.",
      en: "You get irritated with prolonged silence. You're sensitive to changes in tone. You feel the need to organize affection with words."
    },
    work: {
      pt: "Conecta pelo diálogo. É ótimo mediador. Fica ansioso com comunicação truncada.",
      'pt-pt': "Conectas pelo diálogo. És ótimo mediador. Ficas ansioso com comunicação truncada.",
      en: "Connects through dialogue. Great mediator. Gets anxious with truncated communication."
    },
    healingPoints: {
      pt: [
        "Aprender a descansar sem depender do retorno dos outros",
        "Reduzir expectativa emocional sobre comunicação",
        "Desenvolver outros estilos afetivos como suporte",
        "Fortalecer a percepção do corpo, não só da mente",
        "Criar práticas de presença interior"
      ],
      'pt-pt': [
        "Aprender a descansar sem depender do retorno dos outros",
        "Reduzir expectativa emocional sobre comunicação",
        "Desenvolver outros estilos afetivos como suporte",
        "Fortalecer a perceção do corpo, não só da mente",
        "Criar práticas de presença interior"
      ],
      en: [
        "Learn to rest without depending on others' response",
        "Reduce emotional expectation about communication",
        "Develop other affective styles as support",
        "Strengthen body perception, not just mind",
        "Create inner presence practices"
      ]
    },
    miguelAnalysis: {
      pt: "Percebo que sua energia emocional se organiza buscando segurança na clareza. Quando você entende o que sente e quando se sente entendido, seu coração expande. Quando não há reciprocidade, você se fecha e tenta resolver pela mente o que deveria ser acolhido pelo coração.",
      'pt-pt': "Percebo que a tua energia emocional se organiza buscando segurança na clareza. Quando tu entendes o que sentes e quando te sentes entendido, o teu coração expande. Quando não há reciprocidade, tu fechas-te e tentas resolver pela mente o que deveria ser acolhido pelo coração.",
      en: "I perceive that your emotional energy organizes itself seeking security in clarity. When you understand what you feel and when you feel understood, your heart expands. When there's no reciprocity, you close off and try to resolve through the mind what should be embraced by the heart."
    },
    selfExamQuestion: {
      pt: "Que necessidade emocional sua alma tenta expressar, mas você ainda tem medo de admitir?",
      'pt-pt': "Que necessidade emocional a tua alma tenta expressar, mas ainda tens medo de admitir?",
      en: "What emotional need is your soul trying to express, but you're still afraid to admit?"
    }
  },
  presenca_ativa: {
    light: {
      pt: "Sua presença é o maior presente que você pode dar. Quando você está, tudo se acalma.",
      'pt-pt': "A tua presença é o maior presente que podes dar. Quando estás, tudo se acalma.",
      en: "Your presence is the greatest gift you can give. When you're there, everything calms down."
    },
    strengths: {
      pt: ["Atenção profunda", "Escuta genuína", "Capacidade de criar momentos memoráveis", "Valorização do tempo juntos", "Conexão intensa sem palavras"],
      'pt-pt': ["Atenção profunda", "Escuta genuína", "Capacidade de criar momentos memoráveis", "Valorização do tempo juntos", "Conexão intensa sem palavras"],
      en: ["Deep attention", "Genuine listening", "Ability to create memorable moments", "Valuing time together", "Intense connection without words"]
    },
    vulnerabilities: {
      pt: ["Sensibilidade a distrações do outro", "Frustração quando não há presença genuína", "Dificuldade com relacionamentos à distância", "Interpretação de ausência como rejeição"],
      'pt-pt': ["Sensibilidade a distrações do outro", "Frustração quando não há presença genuína", "Dificuldade com relacionamentos à distância", "Interpretação de ausência como rejeição"],
      en: ["Sensitivity to others' distractions", "Frustration when there's no genuine presence", "Difficulty with long-distance relationships", "Interpreting absence as rejection"]
    },
    emotionalDynamic: {
      whatTouches: {
        pt: "Momentos de atenção exclusiva, programas pensados para vocês dois, presença sem celular",
        'pt-pt': "Momentos de atenção exclusiva, programas pensados para vocês dois, presença sem telemóvel",
        en: "Moments of exclusive attention, plans made for just the two of you, presence without phone"
      },
      whatHurts: {
        pt: "Quando a pessoa está presente fisicamente mas mentalmente ausente",
        'pt-pt': "Quando a pessoa está presente fisicamente mas mentalmente ausente",
        en: "When the person is physically present but mentally absent"
      },
      rejectionResponse: {
        pt: "Se retrai e busca conexão em outros lugares ou atividades",
        'pt-pt': "Retrai-se e busca conexão em outros lugares ou atividades",
        en: "Withdraws and seeks connection elsewhere or in activities"
      },
      howShowsLove: {
        pt: "Dedicando tempo exclusivo, criando experiências compartilhadas, estando presente de corpo e alma",
        'pt-pt': "Dedicando tempo exclusivo, criando experiências partilhadas, estando presente de corpo e alma",
        en: "Dedicating exclusive time, creating shared experiences, being present in body and soul"
      },
      howFeelsLove: {
        pt: "Quando alguém reserva tempo só para estar com você, sem distrações",
        'pt-pt': "Quando alguém reserva tempo só para estar contigo, sem distrações",
        en: "When someone reserves time just to be with you, without distractions"
      },
      whatExpects: {
        pt: "Momentos de qualidade, atenção plena, compromisso com tempo juntos",
        'pt-pt': "Momentos de qualidade, atenção plena, compromisso com tempo juntos",
        en: "Quality moments, full attention, commitment to time together"
      },
      cantAsk: {
        pt: "Para que o outro desligue o celular e fique totalmente presente",
        'pt-pt': "Para que o outro desligue o telemóvel e fique totalmente presente",
        en: "For the other to turn off their phone and be fully present"
      },
      howProtects: {
        pt: "Se afasta emocionalmente ou busca atividades solitárias como refúgio",
        'pt-pt': "Afasta-se emocionalmente ou busca atividades solitárias como refúgio",
        en: "Withdraws emotionally or seeks solitary activities as refuge"
      }
    },
    relationships: {
      pt: "Você precisa de momentos de atenção exclusiva. Quando alguém escolhe estar com você sem distrações, seu coração se abre completamente.",
      'pt-pt': "Tu precisas de momentos de atenção exclusiva. Quando alguém escolhe estar contigo sem distrações, o teu coração abre-se completamente.",
      en: "You need moments of exclusive attention. When someone chooses to be with you without distractions, your heart opens completely."
    },
    family: {
      pt: "Valoriza reuniões de qualidade. Sente-se magoado quando ignorado em eventos familiares. Precisa de atenção individualizada.",
      'pt-pt': "Valorizas reuniões de qualidade. Sentes-te magoado quando ignorado em eventos familiares. Precisas de atenção individualizada.",
      en: "Values quality gatherings. Feels hurt when ignored at family events. Needs individualized attention."
    },
    work: {
      pt: "Prefere reuniões focadas a e-mails intermináveis. Produz melhor em ambiente com atenção dedicada.",
      'pt-pt': "Preferes reuniões focadas a e-mails intermináveis. Produzes melhor em ambiente com atenção dedicada.",
      en: "Prefers focused meetings to endless emails. Produces better in environments with dedicated attention."
    },
    healingPoints: {
      pt: [
        "Aprender a estar presente consigo mesmo antes de buscar presença dos outros",
        "Desenvolver tolerância para momentos de conexão menos intensos",
        "Criar rituais de presença interior",
        "Aceitar que qualidade importa mais que quantidade",
        "Comunicar suas necessidades sem culpar"
      ],
      'pt-pt': [
        "Aprender a estar presente contigo mesmo antes de buscar presença dos outros",
        "Desenvolver tolerância para momentos de conexão menos intensos",
        "Criar rituais de presença interior",
        "Aceitar que qualidade importa mais que quantidade",
        "Comunicar as tuas necessidades sem culpar"
      ],
      en: [
        "Learn to be present with yourself before seeking others' presence",
        "Develop tolerance for less intense moments of connection",
        "Create inner presence rituals",
        "Accept that quality matters more than quantity",
        "Communicate your needs without blaming"
      ]
    },
    miguelAnalysis: {
      pt: "Sua energia se estabiliza quando há presença genuína e plena. Você não precisa de muito, precisa de verdade. Quando está plenamente com alguém, você floresce. Quando sente que compete com distrações, sua alma se retrai.",
      'pt-pt': "A tua energia estabiliza-se quando há presença genuína e plena. Tu não precisas de muito, precisas de verdade. Quando estás plenamente com alguém, tu floresces. Quando sentes que competes com distrações, a tua alma retrai-se.",
      en: "Your energy stabilizes when there's genuine and full presence. You don't need much, you need truth. When you're fully with someone, you flourish. When you feel you're competing with distractions, your soul withdraws."
    },
    selfExamQuestion: {
      pt: "Você tem oferecido a si mesmo a mesma presença que busca nos outros?",
      'pt-pt': "Tu tens oferecido a ti mesmo a mesma presença que buscas nos outros?",
      en: "Have you been offering yourself the same presence you seek in others?"
    }
  },
  cuidado_pratico: {
    light: {
      pt: "Seu amor é verbo. Quando você age, o mundo ao seu redor se transforma.",
      'pt-pt': "O teu amor é verbo. Quando tu ages, o mundo à tua volta transforma-se.",
      en: "Your love is a verb. When you act, the world around you transforms."
    },
    strengths: {
      pt: ["Ação concreta", "Resolução de problemas", "Antecipação de necessidades", "Confiabilidade", "Cuidado tangível"],
      'pt-pt': ["Ação concreta", "Resolução de problemas", "Antecipação de necessidades", "Confiabilidade", "Cuidado tangível"],
      en: ["Concrete action", "Problem-solving", "Anticipating needs", "Reliability", "Tangible care"]
    },
    vulnerabilities: {
      pt: ["Frustração quando ajuda não é reconhecida", "Dificuldade em receber ajuda", "Tendência a se sobrecarregar cuidando dos outros", "Pode parecer controlador"],
      'pt-pt': ["Frustração quando ajuda não é reconhecida", "Dificuldade em receber ajuda", "Tendência a sobrecarregar-se cuidando dos outros", "Pode parecer controlador"],
      en: ["Frustration when help isn't recognized", "Difficulty receiving help", "Tendency to overload caring for others", "May seem controlling"]
    },
    emotionalDynamic: {
      whatTouches: {
        pt: "Quando alguém faz algo prático para ajudar sem que você peça",
        'pt-pt': "Quando alguém faz algo prático para ajudar sem que peças",
        en: "When someone does something practical to help without you asking"
      },
      whatHurts: {
        pt: "Quando seu esforço passa despercebido ou quando não retribuem com ações",
        'pt-pt': "Quando o teu esforço passa despercebido ou quando não retribuem com ações",
        en: "When your effort goes unnoticed or when they don't reciprocate with actions"
      },
      rejectionResponse: {
        pt: "Para de ajudar e se afasta, sentindo que não é valorizado",
        'pt-pt': "Para de ajudar e afasta-se, sentindo que não é valorizado",
        en: "Stops helping and withdraws, feeling unvalued"
      },
      howShowsLove: {
        pt: "Fazendo coisas práticas, resolvendo problemas, cuidando de tarefas",
        'pt-pt': "Fazendo coisas práticas, resolvendo problemas, cuidando de tarefas",
        en: "Doing practical things, solving problems, taking care of tasks"
      },
      howFeelsLove: {
        pt: "Quando alguém alivia sua carga, quando fazem algo prático por você",
        'pt-pt': "Quando alguém alivia a tua carga, quando fazem algo prático por ti",
        en: "When someone lightens your load, when they do something practical for you"
      },
      whatExpects: {
        pt: "Reciprocidade nas ações, reconhecimento do esforço, ajuda concreta",
        'pt-pt': "Reciprocidade nas ações, reconhecimento do esforço, ajuda concreta",
        en: "Reciprocity in actions, recognition of effort, concrete help"
      },
      cantAsk: {
        pt: "Para que cuidem de você, sente que deve dar conta de tudo sozinho",
        'pt-pt': "Para que cuidem de ti, sentes que deves dar conta de tudo sozinho",
        en: "For others to take care of you, feels they must handle everything alone"
      },
      howProtects: {
        pt: "Se fecha para receber e se concentra apenas em dar",
        'pt-pt': "Fecha-se para receber e concentra-se apenas em dar",
        en: "Closes off to receiving and focuses only on giving"
      }
    },
    relationships: {
      pt: "Você demonstra amor ajudando, fazendo, resolvendo. Sua alma se acalma quando vê utilidade em seu gesto.",
      'pt-pt': "Tu demonstras amor ajudando, fazendo, resolvendo. A tua alma acalma-se quando vês utilidade no teu gesto.",
      en: "You show love by helping, doing, solving. Your soul calms when you see usefulness in your gesture."
    },
    family: {
      pt: "É o primeiro a resolver problemas familiares. Pode se sentir usado se ninguém retribui. Precisa de reconhecimento prático.",
      'pt-pt': "És o primeiro a resolver problemas familiares. Podes sentir-te usado se ninguém retribui. Precisas de reconhecimento prático.",
      en: "First to solve family problems. May feel used if no one reciprocates. Needs practical recognition."
    },
    work: {
      pt: "Excelente em execução e entrega. Pode assumir demais. Precisa delegar mais.",
      'pt-pt': "Excelente em execução e entrega. Pode assumir demais. Precisa delegar mais.",
      en: "Excellent at execution and delivery. May take on too much. Needs to delegate more."
    },
    healingPoints: {
      pt: [
        "Aprender a receber cuidado sem culpa",
        "Reconhecer que presença também é amor, não só ação",
        "Estabelecer limites saudáveis no dar",
        "Permitir que outros cuidem de você",
        "Descansar sem precisar produzir"
      ],
      'pt-pt': [
        "Aprender a receber cuidado sem culpa",
        "Reconhecer que presença também é amor, não só ação",
        "Estabelecer limites saudáveis no dar",
        "Permitir que outros cuidem de ti",
        "Descansar sem precisar produzir"
      ],
      en: [
        "Learn to receive care without guilt",
        "Recognize that presence is also love, not just action",
        "Establish healthy limits in giving",
        "Allow others to take care of you",
        "Rest without needing to produce"
      ]
    },
    miguelAnalysis: {
      pt: "Você demonstra amor através da ação. Seu coração se acalma quando pode resolver, cuidar, facilitar. Mas às vezes você se esgota dando, sem perceber que também precisa receber. Seu desafio é permitir ser cuidado.",
      'pt-pt': "Tu demonstras amor através da ação. O teu coração acalma-se quando podes resolver, cuidar, facilitar. Mas às vezes tu esgotas-te a dar, sem perceber que também precisas receber. O teu desafio é permitir ser cuidado.",
      en: "You demonstrate love through action. Your heart calms when you can solve, care, facilitate. But sometimes you exhaust yourself giving, without realizing you also need to receive. Your challenge is allowing yourself to be cared for."
    },
    selfExamQuestion: {
      pt: "Quando foi a última vez que você permitiu que alguém cuidasse de você sem sentir que precisava retribuir?",
      'pt-pt': "Quando foi a última vez que permitiste que alguém cuidasse de ti sem sentir que precisavas retribuir?",
      en: "When was the last time you let someone take care of you without feeling you needed to reciprocate?"
    }
  },
  gestos_simbolicos: {
    light: {
      pt: "Você transforma o invisível em visível. Cada gesto seu carrega significado eterno.",
      'pt-pt': "Tu transformas o invisível em visível. Cada gesto teu carrega significado eterno.",
      en: "You transform the invisible into visible. Each of your gestures carries eternal meaning."
    },
    strengths: {
      pt: ["Sensibilidade ao significado", "Memória afetiva aguçada", "Atenção aos detalhes", "Criatividade na expressão de amor", "Valorização do pensamento por trás do gesto"],
      'pt-pt': ["Sensibilidade ao significado", "Memória afetiva aguçada", "Atenção aos detalhes", "Criatividade na expressão de amor", "Valorização do pensamento por trás do gesto"],
      en: ["Sensitivity to meaning", "Sharp affective memory", "Attention to details", "Creativity in expressing love", "Valuing the thought behind the gesture"]
    },
    vulnerabilities: {
      pt: ["Pode parecer materialista quando não é", "Decepção com presentes genéricos", "Expectativa alta sobre datas especiais", "Sensibilidade a esquecimentos"],
      'pt-pt': ["Pode parecer materialista quando não é", "Deceção com presentes genéricos", "Expectativa alta sobre datas especiais", "Sensibilidade a esquecimentos"],
      en: ["May seem materialistic when not", "Disappointment with generic gifts", "High expectation about special dates", "Sensitivity to forgetfulness"]
    },
    emotionalDynamic: {
      whatTouches: {
        pt: "Presentes pensados especialmente para você, lembranças de detalhes, surpresas que mostram atenção",
        'pt-pt': "Presentes pensados especialmente para ti, lembranças de detalhes, surpresas que mostram atenção",
        en: "Gifts thought especially for you, memories of details, surprises that show attention"
      },
      whatHurts: {
        pt: "Datas esquecidas, presentes genéricos, falta de pensamento no gesto",
        'pt-pt': "Datas esquecidas, presentes genéricos, falta de pensamento no gesto",
        en: "Forgotten dates, generic gifts, lack of thought in gestures"
      },
      rejectionResponse: {
        pt: "Sente-se invisível e questiona seu valor para a pessoa",
        'pt-pt': "Sente-se invisível e questiona o seu valor para a pessoa",
        en: "Feels invisible and questions their value to the person"
      },
      howShowsLove: {
        pt: "Dando presentes significativos, lembrando datas, criando símbolos da relação",
        'pt-pt': "Dando presentes significativos, lembrando datas, criando símbolos da relação",
        en: "Giving meaningful gifts, remembering dates, creating relationship symbols"
      },
      howFeelsLove: {
        pt: "Quando recebe algo que mostra que o outro realmente prestou atenção em você",
        'pt-pt': "Quando recebes algo que mostra que o outro realmente prestou atenção em ti",
        en: "When receiving something that shows the other really paid attention to you"
      },
      whatExpects: {
        pt: "Gestos que mostrem que foi lembrado, símbolos tangíveis de amor",
        'pt-pt': "Gestos que mostrem que foi lembrado, símbolos tangíveis de amor",
        en: "Gestures showing they were remembered, tangible symbols of love"
      },
      cantAsk: {
        pt: "Por presentes ou gestos, sente que seria forçar a demonstração",
        'pt-pt': "Por presentes ou gestos, sente que seria forçar a demonstração",
        en: "For gifts or gestures, feels it would be forcing the demonstration"
      },
      howProtects: {
        pt: "Minimiza a importância dos gestos simbólicos para não parecer carente",
        'pt-pt': "Minimiza a importância dos gestos simbólicos para não parecer carente",
        en: "Minimizes the importance of symbolic gestures to not seem needy"
      }
    },
    relationships: {
      pt: "Você valoriza pequenos gestos que mostram intenção, lembrança e cuidado. Não é sobre o valor material, é sobre o significado.",
      'pt-pt': "Tu valorizas pequenos gestos que mostram intenção, lembrança e cuidado. Não é sobre o valor material, é sobre o significado.",
      en: "You value small gestures that show intention, remembrance and care. It's not about material value, it's about meaning."
    },
    family: {
      pt: "Guarda objetos com valor sentimental. Celebra datas importantes. Sente-se ferido quando ignorado em ocasiões especiais.",
      'pt-pt': "Guardas objetos com valor sentimental. Celebras datas importantes. Sentes-te ferido quando ignorado em ocasiões especiais.",
      en: "Keeps objects with sentimental value. Celebrates important dates. Feels hurt when ignored on special occasions."
    },
    work: {
      pt: "Valoriza reconhecimento tangível. Guarda certificados e troféus. Gosta de rituais de celebração.",
      'pt-pt': "Valorizas reconhecimento tangível. Guardas certificados e troféus. Gostas de rituais de celebração.",
      en: "Values tangible recognition. Keeps certificates and trophies. Likes celebration rituals."
    },
    healingPoints: {
      pt: [
        "Aprender a comunicar suas necessidades simbólicas",
        "Reconhecer que nem todos expressam amor através de símbolos",
        "Criar seus próprios rituais de autocelebração",
        "Valorizar gestos imperfeitos mas sinceros",
        "Não medir amor apenas por lembranças materiais"
      ],
      'pt-pt': [
        "Aprender a comunicar as tuas necessidades simbólicas",
        "Reconhecer que nem todos expressam amor através de símbolos",
        "Criar os teus próprios rituais de autocelebração",
        "Valorizar gestos imperfeitos mas sinceros",
        "Não medir amor apenas por lembranças materiais"
      ],
      en: [
        "Learn to communicate your symbolic needs",
        "Recognize that not everyone expresses love through symbols",
        "Create your own self-celebration rituals",
        "Value imperfect but sincere gestures",
        "Don't measure love only by material memories"
      ]
    },
    miguelAnalysis: {
      pt: "Para você, o amor precisa ser visível. Não é sobre coisas, é sobre símbolos. Quando alguém lembra de você através de um gesto, você sente que existe no coração dessa pessoa. Quando esquecido, você questiona seu lugar.",
      'pt-pt': "Para ti, o amor precisa ser visível. Não é sobre coisas, é sobre símbolos. Quando alguém lembra de ti através de um gesto, tu sentes que existes no coração dessa pessoa. Quando esquecido, tu questionas o teu lugar.",
      en: "For you, love needs to be visible. It's not about things, it's about symbols. When someone remembers you through a gesture, you feel you exist in that person's heart. When forgotten, you question your place."
    },
    selfExamQuestion: {
      pt: "Que símbolo de amor você está esperando receber que poderia criar para si mesmo?",
      'pt-pt': "Que símbolo de amor estás à espera de receber que poderias criar para ti mesmo?",
      en: "What symbol of love are you waiting to receive that you could create for yourself?"
    }
  },
  conexao_fisica: {
    light: {
      pt: "Seu toque é oração. Quando você abraça, o mundo se cura.",
      'pt-pt': "O teu toque é oração. Quando tu abraças, o mundo cura-se.",
      en: "Your touch is prayer. When you embrace, the world heals."
    },
    strengths: {
      pt: ["Comunicação não-verbal potente", "Capacidade de confortar fisicamente", "Presença corporal que acalma", "Conexão profunda através do toque", "Expressão de afeto natural"],
      'pt-pt': ["Comunicação não-verbal potente", "Capacidade de confortar fisicamente", "Presença corporal que acalma", "Conexão profunda através do toque", "Expressão de afeto natural"],
      en: ["Powerful non-verbal communication", "Ability to comfort physically", "Body presence that calms", "Deep connection through touch", "Natural expression of affection"]
    },
    vulnerabilities: {
      pt: ["Sensibilidade à falta de contato físico", "Pode parecer invasivo para alguns", "Dificuldade em relacionamentos sem proximidade física", "Pode confundir afeto físico com outros tipos de conexão"],
      'pt-pt': ["Sensibilidade à falta de contacto físico", "Pode parecer invasivo para alguns", "Dificuldade em relacionamentos sem proximidade física", "Pode confundir afeto físico com outros tipos de conexão"],
      en: ["Sensitivity to lack of physical contact", "May seem invasive to some", "Difficulty in relationships without physical proximity", "May confuse physical affection with other types of connection"]
    },
    emotionalDynamic: {
      whatTouches: {
        pt: "Abraços demorados, carinhos, proximidade física, toques suaves",
        'pt-pt': "Abraços demorados, carinhos, proximidade física, toques suaves",
        en: "Long hugs, caresses, physical proximity, gentle touches"
      },
      whatHurts: {
        pt: "Distância física prolongada, rejeição ao toque, frieza corporal",
        'pt-pt': "Distância física prolongada, rejeição ao toque, frieza corporal",
        en: "Prolonged physical distance, rejection of touch, bodily coldness"
      },
      rejectionResponse: {
        pt: "Se retrai fisicamente e sente-se desconectado emocionalmente",
        'pt-pt': "Retrai-se fisicamente e sente-se desconectado emocionalmente",
        en: "Physically withdraws and feels emotionally disconnected"
      },
      howShowsLove: {
        pt: "Através de abraços, toques, proximidade física, gestos afetuosos",
        'pt-pt': "Através de abraços, toques, proximidade física, gestos afetuosos",
        en: "Through hugs, touches, physical proximity, affectionate gestures"
      },
      howFeelsLove: {
        pt: "Quando recebe contato físico afetuoso, quando há proximidade corporal",
        'pt-pt': "Quando recebes contacto físico afetuoso, quando há proximidade corporal",
        en: "When receiving affectionate physical contact, when there's bodily proximity"
      },
      whatExpects: {
        pt: "Contato físico regular, proximidade, toques de carinho",
        'pt-pt': "Contacto físico regular, proximidade, toques de carinho",
        en: "Regular physical contact, proximity, affectionate touches"
      },
      cantAsk: {
        pt: "Por um abraço quando mais precisa, tem medo de parecer necessitado",
        'pt-pt': "Por um abraço quando mais precisas, tens medo de parecer necessitado",
        en: "For a hug when most needed, afraid of seeming needy"
      },
      howProtects: {
        pt: "Se fecha para o toque e cria barreira física como defesa",
        'pt-pt': "Fecha-se para o toque e cria barreira física como defesa",
        en: "Closes off to touch and creates physical barrier as defense"
      }
    },
    relationships: {
      pt: "O contato físico é sua linguagem de conexão. Não é sobre sexualidade, é sobre presença corporal que comunica amor.",
      'pt-pt': "O contacto físico é a tua linguagem de conexão. Não é sobre sexualidade, é sobre presença corporal que comunica amor.",
      en: "Physical contact is your connection language. It's not about sexuality, it's about bodily presence that communicates love."
    },
    family: {
      pt: "Abraça muito. Precisa de contato físico para se sentir amado. Sofre com famílias distantes fisicamente.",
      'pt-pt': "Abraças muito. Precisas de contacto físico para te sentires amado. Sofres com famílias distantes fisicamente.",
      en: "Hugs a lot. Needs physical contact to feel loved. Suffers with physically distant families."
    },
    work: {
      pt: "Precisa de ambiente acolhedor. Pode ter dificuldade em ambientes muito formais. Valoriza proximidade com colegas.",
      'pt-pt': "Precisas de ambiente acolhedor. Podes ter dificuldade em ambientes muito formais. Valorizas proximidade com colegas.",
      en: "Needs welcoming environment. May have difficulty in very formal environments. Values proximity with colleagues."
    },
    healingPoints: {
      pt: [
        "Aprender a se conectar emocionalmente sem depender do físico",
        "Desenvolver tolerância para pessoas menos táteis",
        "Criar práticas de autocuidado corporal",
        "Comunicar suas necessidades de toque sem culpa",
        "Respeitar os limites físicos dos outros"
      ],
      'pt-pt': [
        "Aprender a conectar-te emocionalmente sem depender do físico",
        "Desenvolver tolerância para pessoas menos táteis",
        "Criar práticas de autocuidado corporal",
        "Comunicar as tuas necessidades de toque sem culpa",
        "Respeitar os limites físicos dos outros"
      ],
      en: [
        "Learn to connect emotionally without depending on the physical",
        "Develop tolerance for less tactile people",
        "Create bodily self-care practices",
        "Communicate your touch needs without guilt",
        "Respect others' physical boundaries"
      ]
    },
    miguelAnalysis: {
      pt: "Seu corpo fala antes das palavras. Você se conecta pelo toque, pela proximidade, pela presença física. Quando essa energia é bloqueada, você se sente isolado mesmo cercado de pessoas. Sua porta de conexão é corporal, e isso é legítimo.",
      'pt-pt': "O teu corpo fala antes das palavras. Tu conectas-te pelo toque, pela proximidade, pela presença física. Quando essa energia é bloqueada, tu sentes-te isolado mesmo cercado de pessoas. A tua porta de conexão é corporal, e isso é legítimo.",
      en: "Your body speaks before words. You connect through touch, through proximity, through physical presence. When this energy is blocked, you feel isolated even surrounded by people. Your connection door is bodily, and that is legitimate."
    },
    selfExamQuestion: {
      pt: "Quando foi a última vez que você abraçou alguém sem pressa, apenas para estar presente?",
      'pt-pt': "Quando foi a última vez que abraçaste alguém sem pressa, apenas para estar presente?",
      en: "When was the last time you hugged someone without hurry, just to be present?"
    }
  }
};

export const createEstilosConexaoPDF = (
  result: EstilosConexaoAfetiva,
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

  const primaryKey = result.primary.style;
  const primaryContent = STYLE_CONTENT[primaryKey];
  const primaryColor = STYLE_COLORS[primaryKey] || COLORS.love;

  // ==========================================
  // CAPA DO RELATÓRIO
  // ==========================================
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative accent line with love color
  doc.setFillColor(COLORS.love.r, COLORS.love.g, COLORS.love.b);
  doc.rect(0, pageHeight / 3 - 2, pageWidth, 4, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text(t.reportTitle, pageWidth / 2, pageHeight / 2 - 50, { align: "center" });

  // Subtitle
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  const subtitleLines = doc.splitTextToSize(t.subtitle, contentWidth - 20);
  doc.text(subtitleLines, pageWidth / 2, pageHeight / 2 - 25, { align: "center" });

  // Signature
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text(t.signature, pageWidth / 2, pageHeight / 2 - 5, { align: "center" });

  // User name
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(userName, pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

  // Date
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(date, pageWidth / 2, pageHeight / 2 + 40, { align: "center" });

  // Quote
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.love.r, COLORS.love.g, COLORS.love.b);
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
  yPos += 8;
  yPos = writeWrappedText(t.introText4, margin, yPos, contentWidth);

  // ==========================================
  // BLOCO 2 — ESTILO AFETIVO PRINCIPAL
  // ==========================================
  doc.addPage();
  addHeader(t.block2Title);
  addPageNumber();

  yPos = 50;

  // Name with symbol
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.roundedRect(margin, yPos, contentWidth, 18, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.primary.name[lang]} (${result.primary.score} ${t.points})`, margin + 5, yPos + 12);
  yPos += 32;

  // What it means
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(t.whatItMeans, margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  yPos = writeWrappedText(result.primary.essence[lang], margin, yPos, contentWidth);
  yPos += 8;

  // Strengths
  if (primaryContent) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
    doc.text(t.naturalStrengths, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    primaryContent.strengths[lang].forEach(strength => {
      doc.text(`• ${strength}`, margin + 3, yPos);
      yPos += 5;
    });
    yPos += 5;

    // Vulnerabilities
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.warning.r, COLORS.warning.g, COLORS.warning.b);
    doc.text(t.naturalVulnerabilities, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    primaryContent.vulnerabilities[lang].forEach(vuln => {
      doc.text(`• ${vuln}`, margin + 3, yPos);
      yPos += 5;
    });
    yPos += 5;

    // Light
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.love.r, COLORS.love.g, COLORS.love.b);
    doc.text(t.yourLight, margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "italic");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    yPos = writeWrappedText(`"${primaryContent.light[lang]}"`, margin, yPos, contentWidth);
  }

  // ==========================================
  // BLOCO 3 — ESTILOS DE APOIO
  // ==========================================
  doc.addPage();
  addHeader(t.block3Title);
  addPageNumber();

  yPos = 50;
  const styleData = getStyleData();
  const sortedStyles = Object.entries(result.scores)
    .sort(([, a], [, b]) => b - a)
    .slice(1); // Skip primary

  sortedStyles.forEach(([styleKey, score]) => {
    const style = styleData[styleKey as keyof typeof styleData];
    if (!style) return;

    const styleColor = STYLE_COLORS[styleKey] || COLORS.muted;

    if (yPos > pageHeight - 50) {
      doc.addPage();
      addHeader(t.block3Title + ` (${t.continued})`);
      addPageNumber();
      yPos = 50;
    }

    // Style header
    doc.setFillColor(styleColor.r, styleColor.g, styleColor.b);
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${style.name[lang]} (${score} ${t.points})`, margin + 5, yPos + 8);
    yPos += 16;

    // Description
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(style.essence[lang], margin, yPos, contentWidth, 4);
    yPos += 10;
  });

  // ==========================================
  // BLOCO 4 — MAPA VISUAL DE CONEXÃO
  // ==========================================
  doc.addPage();
  addHeader(t.block4Title);
  addPageNumber();

  yPos = 50;
  const barHeight = 20;
  const barGap = 8;
  const maxScore = Math.max(...Object.values(result.scores));

  Object.entries(result.scores)
    .sort(([, a], [, b]) => b - a)
    .forEach(([styleKey, score]) => {
      const style = styleData[styleKey as keyof typeof styleData];
      if (!style) return;

      const styleColor = STYLE_COLORS[styleKey] || COLORS.muted;
      const barWidth = maxScore > 0 ? (score / maxScore) * (contentWidth - 50) : 0;

      // Background bar
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(margin + 45, yPos, contentWidth - 50, barHeight, 3, 3, "F");

      // Filled bar
      doc.setFillColor(styleColor.r, styleColor.g, styleColor.b);
      doc.roundedRect(margin + 45, yPos, barWidth, barHeight, 3, 3, "F");

      // Style name
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(style.name[lang].substring(0, 10), margin, yPos + 12);

      // Score
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      if (score > 2) {
        doc.text(`${score}`, margin + 50, yPos + 13);
      }

      yPos += barHeight + barGap;
    });

  // ==========================================
  // BLOCO 5 — PADRÕES AFETIVOS E EMOCIONAIS
  // ==========================================
  doc.addPage();
  addHeader(t.block5Title);
  addPageNumber();

  yPos = 50;

  if (primaryContent) {
    // Miguel intro
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    yPos = writeWrappedText(`"${primaryContent.miguelAnalysis[lang]}"`, margin, yPos, contentWidth);
    yPos += 15;

    // Pattern sections
    const patterns = [
      { title: t.seekConnection, text: primaryContent.emotionalDynamic.howShowsLove[lang] },
      { title: t.askCare, text: primaryContent.emotionalDynamic.whatExpects[lang] },
      { title: t.emotionalTrigger, text: primaryContent.emotionalDynamic.whatHurts[lang] },
      { title: t.calmingMovement, text: primaryContent.emotionalDynamic.howFeelsLove[lang] },
    ];

    patterns.forEach(pattern => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.text(pattern.title, margin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      yPos = writeWrappedText(pattern.text, margin, yPos, contentWidth, 4);
      yPos += 8;
    });
  }

  // ==========================================
  // BLOCO 6 — DINÂMICA AFETIVA
  // ==========================================
  doc.addPage();
  addHeader(t.block6Title);
  addPageNumber();

  yPos = 50;

  if (primaryContent) {
    const dynamics = [
      { title: t.whatTouches, text: primaryContent.emotionalDynamic.whatTouches[lang] },
      { title: t.whatHurts, text: primaryContent.emotionalDynamic.whatHurts[lang] },
      { title: t.rejectionResponse, text: primaryContent.emotionalDynamic.rejectionResponse[lang] },
      { title: t.howShowsLove, text: primaryContent.emotionalDynamic.howShowsLove[lang] },
      { title: t.howFeelsLove, text: primaryContent.emotionalDynamic.howFeelsLove[lang] },
      { title: t.cantAsk, text: primaryContent.emotionalDynamic.cantAsk[lang] },
      { title: t.howProtects, text: primaryContent.emotionalDynamic.howProtects[lang] },
    ];

    dynamics.forEach(item => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        addHeader(t.block6Title + ` (${t.continued})`);
        addPageNumber();
        yPos = 50;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
      doc.text(item.title, margin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      yPos = writeWrappedText(item.text, margin, yPos, contentWidth, 4);
      yPos += 8;
    });
  }

  // ==========================================
  // BLOCO 7 — IMPACTO NAS TRÊS DIMENSÕES
  // ==========================================
  doc.addPage();
  addHeader(t.block7Title);
  addPageNumber();

  yPos = 50;

  if (primaryContent) {
    // Relationships
    doc.setFillColor(COLORS.love.r, COLORS.love.g, COLORS.love.b);
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(t.loveRelationships, margin + 5, yPos + 8);
    yPos += 18;
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(primaryContent.relationships[lang], margin, yPos, contentWidth);
    yPos += 12;

    // Family
    doc.setFillColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(t.family, margin + 5, yPos + 8);
    yPos += 18;
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(primaryContent.family[lang], margin, yPos, contentWidth);
    yPos += 12;

    // Work
    doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(t.work, margin + 5, yPos + 8);
    yPos += 18;
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(primaryContent.work[lang], margin, yPos, contentWidth);
  }

  // ==========================================
  // BLOCO 8 — PONTOS DE CURA E EXPANSÃO
  // ==========================================
  doc.addPage();
  addHeader(t.block8Title);
  addPageNumber();

  yPos = 50;

  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  yPos = writeWrappedText(t.healingIntro, margin, yPos, contentWidth);
  yPos += 10;

  if (primaryContent) {
    primaryContent.healingPoints[lang].forEach((point, index) => {
      doc.setFillColor(COLORS.love.r, COLORS.love.g, COLORS.love.b);
      doc.circle(margin + 3, yPos - 1, 2, "F");
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.text(point, margin + 10, yPos);
      yPos += 10;
    });
  }

  // ==========================================
  // BLOCO 9 — PLANO DE EVOLUÇÃO AFETIVA (7 DIAS)
  // ==========================================
  doc.addPage();
  addHeader(t.block9Title);
  addPageNumber();

  yPos = 50;
  const sevenDayPlan = getSevenDayPlan(lang);

  sevenDayPlan.forEach((day, index) => {
    if (yPos > pageHeight - 35) {
      doc.addPage();
      addHeader(t.block9Title + ` (${t.continued})`);
      addPageNumber();
      yPos = 50;
    }

    doc.setFillColor(COLORS.love.r, COLORS.love.g, COLORS.love.b);
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
    yPos += 10;
  });

  // ==========================================
  // BLOCO 10 — PERGUNTA DE AUTOEXAME
  // ==========================================
  doc.addPage();
  addHeader(t.block10Title);
  addPageNumber();

  yPos = pageHeight / 2 - 30;

  doc.setFillColor(252, 231, 243); // Light pink
  doc.roundedRect(margin, yPos - 20, contentWidth, 60, 5, 5, "F");

  doc.setTextColor(COLORS.love.r, COLORS.love.g, COLORS.love.b);
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  
  if (primaryContent) {
    const questionLines = doc.splitTextToSize(`"${primaryContent.selfExamQuestion[lang]}"`, contentWidth - 20);
    doc.text(questionLines, pageWidth / 2, yPos, { align: "center" });
  }

  // ==========================================
  // BLOCO 11 — ENCERRAMENTO COM MIGUEL
  // ==========================================
  doc.addPage();
  addHeader(t.block11Title);
  addPageNumber();

  yPos = pageHeight / 2 - 40;

  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  const closingLines = doc.splitTextToSize(`"${t.closingText}"`, contentWidth - 20);
  doc.text(closingLines, pageWidth / 2, yPos, { align: "center" });

  yPos += 40;

  // Final signature
  doc.setFillColor(COLORS.love.r, COLORS.love.g, COLORS.love.b);
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
export const generateEstilosConexaoPremiumPDF = (
  result: EstilosConexaoAfetiva,
  userName: string,
  options?: PDFOptions
): void => {
  const doc = createEstilosConexaoPDF(result, userName, options);
  const lang = options?.language || 'pt';
  const fileName = lang === 'en' 
    ? `NELLO_ONE_Affection_Connection_Styles_${userName.replace(/\s+/g, '_')}.pdf`
    : `NELLO_ONE_Estilos_Conexao_Afetiva_${userName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};

function getTranslations(lang: 'pt' | 'pt-pt' | 'en') {
  const translations = {
    pt: {
      reportTitle: "Estilos de Conexão Afetiva",
      subtitle: "Como você cria, sente e recebe vínculo emocional",
      signature: "Por Miguel, seu guia no Nello One",
      quote: "A forma como você ama revela a forma como sua alma se move.",
      footer: "Nello.one – Clareza gera poder.",
      points: "pontos",
      block1Title: "Introdução do Teste",
      block2Title: "Seu Estilo Afetivo Principal",
      block3Title: "Seus Estilos de Apoio",
      block4Title: "Mapa Visual de Conexão",
      block5Title: "Padrões Afetivos e Emocionais",
      block6Title: "Dinâmica Afetiva do Seu Estilo",
      block7Title: "Impacto nas Três Dimensões da Vida",
      block8Title: "Pontos de Cura e Expansão",
      block9Title: "Plano de Evolução Afetiva — 7 Dias",
      block10Title: "Pergunta de Autoexame",
      block11Title: "Encerramento com Miguel",
      introText1: "Este relatório revela como sua energia emocional se conecta ao mundo.",
      introText2: "Ele mostra seu estilo natural de expressar carinho, pedir cuidado, estabilizar vínculos e sentir segurança.",
      introText3: "Não existe certo ou errado. Cada estilo é uma forma legítima de se relacionar.",
      introText4: "Você pode ter mais de um estilo em funcionamento. O resultado mostra sua energia atual, não sua história inteira.",
      whatItMeans: "O que isso significa:",
      naturalStrengths: "Forças Naturais:",
      naturalVulnerabilities: "Fragilidades Naturais:",
      yourLight: "Sua Luz:",
      seekConnection: "Seu modo de buscar conexão:",
      askCare: "Seu modo de pedir cuidado:",
      emotionalTrigger: "Seu gatilho emocional:",
      calmingMovement: "O que te acalma:",
      whatTouches: "O que te emociona:",
      whatHurts: "O que te magoa:",
      rejectionResponse: "Como reage à rejeição:",
      howShowsLove: "Como demonstra amor:",
      howFeelsLove: "Como sente amor:",
      cantAsk: "O que não consegue pedir:",
      howProtects: "Como se protege:",
      loveRelationships: "Relacionamentos Amorosos",
      family: "Família",
      work: "Trabalho",
      healingIntro: "Estes são os pontos específicos para sua cura e expansão afetiva:",
      day: "Dia",
      continued: "continuação",
      closingText: "Você merece vínculos seguros. A clareza que você busca fora começa dentro.",
      miguelSignature: "Seu guia no Nello One"
    },
    'pt-pt': {
      reportTitle: "Estilos de Conexão Afetiva",
      subtitle: "Como tu crias, sentes e recebes vínculo emocional",
      signature: "Por Miguel, o teu guia no Nello One",
      quote: "A forma como tu amas revela a forma como a tua alma se move.",
      footer: "Nello.one – Clareza gera poder.",
      points: "pontos",
      block1Title: "Introdução do Teste",
      block2Title: "O Teu Estilo Afetivo Principal",
      block3Title: "Os Teus Estilos de Apoio",
      block4Title: "Mapa Visual de Conexão",
      block5Title: "Padrões Afetivos e Emocionais",
      block6Title: "Dinâmica Afetiva do Teu Estilo",
      block7Title: "Impacto nas Três Dimensões da Vida",
      block8Title: "Pontos de Cura e Expansão",
      block9Title: "Plano de Evolução Afetiva — 7 Dias",
      block10Title: "Pergunta de Autoexame",
      block11Title: "Encerramento com Miguel",
      introText1: "Este relatório revela como a tua energia emocional se conecta ao mundo.",
      introText2: "Mostra o teu estilo natural de expressar carinho, pedir cuidado, estabilizar vínculos e sentir segurança.",
      introText3: "Não existe certo ou errado. Cada estilo é uma forma legítima de te relacionares.",
      introText4: "Podes ter mais de um estilo em funcionamento. O resultado mostra a tua energia atual, não a tua história inteira.",
      whatItMeans: "O que isso significa:",
      naturalStrengths: "Forças Naturais:",
      naturalVulnerabilities: "Fragilidades Naturais:",
      yourLight: "A Tua Luz:",
      seekConnection: "O teu modo de buscar conexão:",
      askCare: "O teu modo de pedir cuidado:",
      emotionalTrigger: "O teu gatilho emocional:",
      calmingMovement: "O que te acalma:",
      whatTouches: "O que te emociona:",
      whatHurts: "O que te magoa:",
      rejectionResponse: "Como reages à rejeição:",
      howShowsLove: "Como demonstras amor:",
      howFeelsLove: "Como sentes amor:",
      cantAsk: "O que não consegues pedir:",
      howProtects: "Como te proteges:",
      loveRelationships: "Relacionamentos Amorosos",
      family: "Família",
      work: "Trabalho",
      healingIntro: "Estes são os pontos específicos para a tua cura e expansão afetiva:",
      day: "Dia",
      continued: "continuação",
      closingText: "Tu mereces vínculos seguros. A clareza que buscas fora começa dentro.",
      miguelSignature: "O teu guia no Nello One"
    },
    en: {
      reportTitle: "Affection Connection Styles",
      subtitle: "How you create, feel and receive emotional bonds",
      signature: "By Miguel, your guide at Nello One",
      quote: "The way you love reveals the way your soul moves.",
      footer: "Nello.one – Clarity generates power.",
      points: "points",
      block1Title: "Test Introduction",
      block2Title: "Your Primary Affective Style",
      block3Title: "Your Supporting Styles",
      block4Title: "Visual Connection Map",
      block5Title: "Affective and Emotional Patterns",
      block6Title: "Affective Dynamics of Your Style",
      block7Title: "Impact on Three Life Dimensions",
      block8Title: "Healing and Expansion Points",
      block9Title: "Affective Evolution Plan — 7 Days",
      block10Title: "Self-Exam Question",
      block11Title: "Closing with Miguel",
      introText1: "This report reveals how your emotional energy connects to the world.",
      introText2: "It shows your natural style of expressing affection, asking for care, stabilizing bonds and feeling security.",
      introText3: "There's no right or wrong. Each style is a legitimate way of relating.",
      introText4: "You may have more than one style at work. The result shows your current energy, not your entire story.",
      whatItMeans: "What this means:",
      naturalStrengths: "Natural Strengths:",
      naturalVulnerabilities: "Natural Vulnerabilities:",
      yourLight: "Your Light:",
      seekConnection: "How you seek connection:",
      askCare: "How you ask for care:",
      emotionalTrigger: "Your emotional trigger:",
      calmingMovement: "What calms you:",
      whatTouches: "What moves you:",
      whatHurts: "What hurts you:",
      rejectionResponse: "How you respond to rejection:",
      howShowsLove: "How you show love:",
      howFeelsLove: "How you feel love:",
      cantAsk: "What you can't ask for:",
      howProtects: "How you protect yourself:",
      loveRelationships: "Love Relationships",
      family: "Family",
      work: "Work",
      healingIntro: "These are the specific points for your affective healing and expansion:",
      day: "Day",
      continued: "continued",
      closingText: "You deserve secure bonds. The clarity you seek outside begins within.",
      miguelSignature: "Your guide at Nello One"
    }
  };

  return translations[lang];
}

function getSevenDayPlan(lang: 'pt' | 'pt-pt' | 'en'): { title: string; action: string }[] {
  const plans: Record<'pt' | 'pt-pt' | 'en', { title: string; action: string }[]> = {
    pt: [
      { title: "Clareza interior", action: "Descreva um sentimento sem julgamento. Apenas observe o que sente agora." },
      { title: "Ação de cuidado prático", action: "Faça um gesto concreto por alguém sem esperar retorno." },
      { title: "Pausa verbal", action: "Pratique silêncio consciente por 3 minutos. Apenas esteja presente." },
      { title: "Afeto sensorial", action: "Coloque o corpo em movimento leve. Dance, caminhe ou alongue com consciência." },
      { title: "Presença ativa", action: "Converse olhando nos olhos por 5 minutos. Sem celular, sem pressa." },
      { title: "Limite emocional", action: "Diga 'isso não está bem para mim' em alguma situação. Pratique o não." },
      { title: "Entrega", action: "Ore pedindo para amar sem ansiedade. Entregue sua necessidade afetiva a Deus." }
    ],
    'pt-pt': [
      { title: "Clareza interior", action: "Descreve um sentimento sem julgamento. Apenas observa o que sentes agora." },
      { title: "Ação de cuidado prático", action: "Faz um gesto concreto por alguém sem esperar retorno." },
      { title: "Pausa verbal", action: "Pratica silêncio consciente por 3 minutos. Apenas está presente." },
      { title: "Afeto sensorial", action: "Coloca o corpo em movimento leve. Dança, caminha ou alonga com consciência." },
      { title: "Presença ativa", action: "Conversa olhando nos olhos por 5 minutos. Sem telemóvel, sem pressa." },
      { title: "Limite emocional", action: "Diz 'isso não está bem para mim' em alguma situação. Pratica o não." },
      { title: "Entrega", action: "Reza pedindo para amar sem ansiedade. Entrega a tua necessidade afetiva a Deus." }
    ],
    en: [
      { title: "Inner clarity", action: "Describe a feeling without judgment. Just observe what you feel now." },
      { title: "Practical care action", action: "Do a concrete gesture for someone without expecting return." },
      { title: "Verbal pause", action: "Practice conscious silence for 3 minutes. Just be present." },
      { title: "Sensory affection", action: "Put your body in light movement. Dance, walk or stretch with awareness." },
      { title: "Active presence", action: "Have a conversation looking into eyes for 5 minutes. No phone, no hurry." },
      { title: "Emotional boundary", action: "Say 'this is not okay for me' in some situation. Practice saying no." },
      { title: "Surrender", action: "Pray asking to love without anxiety. Surrender your affective need to God." }
    ]
  };

  return plans[lang];
}
