import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Heart, Sparkles, Target, Users, Briefcase, Home, 
  MessageCircle, Shield, Eye, HandHeart, HelpCircle,
  CheckCircle, Download, Share2, ArrowRight, Flame
} from "lucide-react";
import { EstilosConexaoAfetiva, getStyleData } from "@/lib/estilosConexaoAfetiva";

// Extended content for each style - must be in sync with PDF
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
  practicalActions: { pt: string[]; 'pt-pt': string[]; en: string[] };
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
      pt: "Percebo que você busca segurança na clareza. Quando você entende o que sente e quando se sente entendido, seu coração expande. Quando não há reciprocidade, você se fecha e tenta resolver pela mente o que deveria ser acolhido pelo coração.",
      'pt-pt': "Percebo que tu buscas segurança na clareza. Quando tu entendes o que sentes e quando te sentes entendido, o teu coração expande. Quando não há reciprocidade, tu fechas-te e tentas resolver pela mente o que deveria ser acolhido pelo coração.",
      en: "I perceive that you seek security in clarity. When you understand what you feel and when you feel understood, your heart expands. When there's no reciprocity, you close off and try to resolve through the mind what should be embraced by the heart."
    },
    selfExamQuestion: {
      pt: "Que necessidade emocional sua alma tenta expressar, mas você ainda tem medo de admitir?",
      'pt-pt': "Que necessidade emocional a tua alma tenta expressar, mas ainda tens medo de admitir?",
      en: "What emotional need is your soul trying to express, but you're still afraid to admit?"
    },
    practicalActions: {
      pt: [
        "Escreva uma mensagem de gratidão para alguém importante esta semana",
        "Pratique ouvir sem responder imediatamente por um dia",
        "Comunique uma necessidade emocional que você costuma guardar"
      ],
      'pt-pt': [
        "Escreve uma mensagem de gratidão para alguém importante esta semana",
        "Pratica ouvir sem responder imediatamente por um dia",
        "Comunica uma necessidade emocional que costumas guardar"
      ],
      en: [
        "Write a gratitude message to someone important this week",
        "Practice listening without responding immediately for a day",
        "Communicate an emotional need you usually keep to yourself"
      ]
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
      pt: "Você não precisa de muito, precisa de verdade. Quando está plenamente com alguém, você floresce. Quando sente que compete com distrações, sua alma se retrai. A presença genuína é sua porta de conexão.",
      'pt-pt': "Tu não precisas de muito, precisas de verdade. Quando estás plenamente com alguém, tu floresces. Quando sentes que competes com distrações, a tua alma retrai-se. A presença genuína é a tua porta de conexão.",
      en: "You don't need much, you need truth. When you're fully with someone, you flourish. When you feel you're competing with distractions, your soul withdraws. Genuine presence is your connection door."
    },
    selfExamQuestion: {
      pt: "Você tem oferecido a si mesmo a mesma presença que busca nos outros?",
      'pt-pt': "Tu tens oferecido a ti mesmo a mesma presença que buscas nos outros?",
      en: "Have you been offering yourself the same presence you seek in others?"
    },
    practicalActions: {
      pt: [
        "Planeje um momento de qualidade com alguém importante sem celular",
        "Dedique 15 minutos de presença plena consigo mesmo hoje",
        "Comunique a alguém o quanto valoriza momentos de atenção exclusiva"
      ],
      'pt-pt': [
        "Planeia um momento de qualidade com alguém importante sem telemóvel",
        "Dedica 15 minutos de presença plena contigo mesmo hoje",
        "Comunica a alguém o quanto valorizas momentos de atenção exclusiva"
      ],
      en: [
        "Plan a quality moment with someone important without phones",
        "Dedicate 15 minutes of full presence with yourself today",
        "Tell someone how much you value moments of exclusive attention"
      ]
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
    },
    practicalActions: {
      pt: [
        "Peça ajuda em uma tarefa que você normalmente faria sozinho",
        "Aceite um gesto de cuidado sem oferecer algo em troca",
        "Tire um momento para descansar sem culpa esta semana"
      ],
      'pt-pt': [
        "Pede ajuda numa tarefa que normalmente farias sozinho",
        "Aceita um gesto de cuidado sem oferecer algo em troca",
        "Tira um momento para descansar sem culpa esta semana"
      ],
      en: [
        "Ask for help with a task you'd normally do alone",
        "Accept a caring gesture without offering something in return",
        "Take a moment to rest without guilt this week"
      ]
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
    },
    practicalActions: {
      pt: [
        "Crie um gesto simbólico para alguém importante esta semana",
        "Celebre uma conquista própria com um ritual pessoal",
        "Comunique a alguém o que certos gestos significam para você"
      ],
      'pt-pt': [
        "Cria um gesto simbólico para alguém importante esta semana",
        "Celebra uma conquista própria com um ritual pessoal",
        "Comunica a alguém o que certos gestos significam para ti"
      ],
      en: [
        "Create a symbolic gesture for someone important this week",
        "Celebrate your own achievement with a personal ritual",
        "Tell someone what certain gestures mean to you"
      ]
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
      pt: "Seu corpo fala antes das palavras. Você se conecta pelo toque, pela proximidade, pela presença física. Quando essa porta de conexão é bloqueada, você se sente isolado mesmo cercado de pessoas. Sua forma de conexão é corporal, e isso é legítimo.",
      'pt-pt': "O teu corpo fala antes das palavras. Tu conectas-te pelo toque, pela proximidade, pela presença física. Quando essa porta de conexão é bloqueada, tu sentes-te isolado mesmo cercado de pessoas. A tua porta de conexão é corporal, e isso é legítimo.",
      en: "Your body speaks before words. You connect through touch, proximity, physical presence. When this connection door is blocked, you feel isolated even when surrounded by people. Your connection door is bodily, and that's legitimate."
    },
    selfExamQuestion: {
      pt: "De que abraço você está precisando que ainda não pediu?",
      'pt-pt': "De que abraço estás a precisar que ainda não pediste?",
      en: "What hug do you need that you haven't asked for yet?"
    },
    practicalActions: {
      pt: [
        "Ofereça um abraço sincero a alguém importante hoje",
        "Pratique uma forma de autocuidado corporal esta semana",
        "Comunique a alguém próximo o quanto o toque significa para você"
      ],
      'pt-pt': [
        "Oferece um abraço sincero a alguém importante hoje",
        "Pratica uma forma de autocuidado corporal esta semana",
        "Comunica a alguém próximo o quanto o toque significa para ti"
      ],
      en: [
        "Offer a sincere hug to someone important today",
        "Practice a form of bodily self-care this week",
        "Tell someone close how much touch means to you"
      ]
    }
  }
};

const STYLE_COLORS: Record<string, string> = {
  presenca_ativa: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  expressao_verbal: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  cuidado_pratico: "from-green-500/20 to-green-600/10 border-green-500/30",
  gestos_simbolicos: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  conexao_fisica: "from-rose-500/20 to-rose-600/10 border-rose-500/30",
};

const STYLE_ACCENT_COLORS: Record<string, string> = {
  presenca_ativa: "bg-blue-500",
  expressao_verbal: "bg-purple-500",
  cuidado_pratico: "bg-green-500",
  gestos_simbolicos: "bg-amber-500",
  conexao_fisica: "bg-rose-500",
};

interface EstilosConexaoResultsSectionProps {
  estilosResults: EstilosConexaoAfetiva;
  userName: string;
  lang: 'pt' | 'pt-pt' | 'en';
}

export function EstilosConexaoResultsSection({ 
  estilosResults, 
  userName,
  lang 
}: EstilosConexaoResultsSectionProps) {
  const styleData = getStyleData();
  const firstName = userName.split(' ')[0];
  
  // Get content for primary style
  const primaryContent = STYLE_CONTENT[estilosResults.primary.style];
  const secondaryContent = STYLE_CONTENT[estilosResults.secondary.style];
  
  if (!primaryContent || !secondaryContent) {
    return null;
  }
  
  // Calculate total and percentages
  const totalScore = Object.values(estilosResults.scores).reduce((a, b) => a + b, 0);
  const maxPossible = 30; // 30 questions
  
  // Get all styles sorted by score
  const sortedStyles = Object.entries(estilosResults.scores)
    .sort(([, a], [, b]) => b - a)
    .map(([style, score]) => ({
      style,
      score,
      percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
      data: styleData[style as keyof typeof styleData]
    }));
  
  // Check for tie
  const hasTie = estilosResults.primary.score === estilosResults.secondary.score;

  const texts = {
    pt: {
      title: "este é o seu Estilo de Conexão Afetiva",
      subtitle: "Como você dá e recebe amor",
      emotionalSummaryTitle: "Resumo Emocional",
      rankingTitle: "Seus 5 Estilos de Conexão",
      rankingSubtitle: "Você não é apenas um estilo. Essa é a distribuição das suas preferências emocionais.",
      primaryTitle: "Seu Estilo Primário em Profundidade",
      secondaryTitle: "Seu Estilo Secundário",
      secondaryHow: "Como complementa seu estilo primário",
      strengths: "Forças",
      vulnerabilities: "Vulnerabilidades",
      howShowsLove: "Como demonstra amor",
      howFeelsLove: "Como sente amor",
      dynamicTitle: "Dinâmica Emocional",
      whatTouches: "O que te toca",
      whatHurts: "O que te machuca",
      rejectionResponse: "Como reage à rejeição",
      whatExpects: "O que espera",
      cantAsk: "O que não consegue pedir",
      howProtects: "Como se protege",
      applicationsTitle: "Aplicações Práticas",
      relationships: "Relacionamentos",
      family: "Família",
      work: "Trabalho",
      healingTitle: "Pontos de Cura",
      healingSubtitle: "Caminhos para o amadurecimento emocional",
      aiAnalysisTitle: "Análise do Miguel",
      aiAnalysisSubtitle: "Reflexão personalizada do seu mentor digital",
      reflectionTitle: "Pergunta de Autoexame",
      reflectionSubtitle: "Reflita sobre isso com sinceridade",
      actionsTitle: "Próximos Passos Práticos",
      actionsSubtitle: "Para a próxima semana",
      tieMessage: "Você apresenta equilíbrio entre dois estilos.",
      disclaimer: "Isso mostra preferências, não limita quem você é.",
      primary: "Primário",
      secondary: "Secundário",
      points: "pontos"
    },
    'pt-pt': {
      title: "este é o teu Estilo de Conexão Afetiva",
      subtitle: "Como dás e recebes amor",
      emotionalSummaryTitle: "Resumo Emocional",
      rankingTitle: "Os teus 5 Estilos de Conexão",
      rankingSubtitle: "Tu não és apenas um estilo. Esta é a distribuição das tuas preferências emocionais.",
      primaryTitle: "O teu Estilo Primário em Profundidade",
      secondaryTitle: "O teu Estilo Secundário",
      secondaryHow: "Como complementa o teu estilo primário",
      strengths: "Forças",
      vulnerabilities: "Vulnerabilidades",
      howShowsLove: "Como demonstras amor",
      howFeelsLove: "Como sentes amor",
      dynamicTitle: "Dinâmica Emocional",
      whatTouches: "O que te toca",
      whatHurts: "O que te magoa",
      rejectionResponse: "Como reages à rejeição",
      whatExpects: "O que esperas",
      cantAsk: "O que não consegues pedir",
      howProtects: "Como te proteges",
      applicationsTitle: "Aplicações Práticas",
      relationships: "Relacionamentos",
      family: "Família",
      work: "Trabalho",
      healingTitle: "Pontos de Cura",
      healingSubtitle: "Caminhos para o amadurecimento emocional",
      aiAnalysisTitle: "Análise do Miguel",
      aiAnalysisSubtitle: "Reflexão personalizada do teu mentor digital",
      reflectionTitle: "Pergunta de Autoexame",
      reflectionSubtitle: "Reflete sobre isso com sinceridade",
      actionsTitle: "Próximos Passos Práticos",
      actionsSubtitle: "Para a próxima semana",
      tieMessage: "Tu apresentas equilíbrio entre dois estilos.",
      disclaimer: "Isto mostra preferências, não limita quem és.",
      primary: "Primário",
      secondary: "Secundário",
      points: "pontos"
    },
    en: {
      title: "this is your Affective Connection Style",
      subtitle: "How you give and receive love",
      emotionalSummaryTitle: "Emotional Summary",
      rankingTitle: "Your 5 Connection Styles",
      rankingSubtitle: "You are not just one style. This is the distribution of your emotional preferences.",
      primaryTitle: "Your Primary Style in Depth",
      secondaryTitle: "Your Secondary Style",
      secondaryHow: "How it complements your primary style",
      strengths: "Strengths",
      vulnerabilities: "Vulnerabilities",
      howShowsLove: "How you show love",
      howFeelsLove: "How you feel love",
      dynamicTitle: "Emotional Dynamic",
      whatTouches: "What touches you",
      whatHurts: "What hurts you",
      rejectionResponse: "How you react to rejection",
      whatExpects: "What you expect",
      cantAsk: "What you can't ask for",
      howProtects: "How you protect yourself",
      applicationsTitle: "Practical Applications",
      relationships: "Relationships",
      family: "Family",
      work: "Work",
      healingTitle: "Healing Points",
      healingSubtitle: "Paths for emotional growth",
      aiAnalysisTitle: "Miguel's Analysis",
      aiAnalysisSubtitle: "Personalized reflection from your digital mentor",
      reflectionTitle: "Self-Examination Question",
      reflectionSubtitle: "Reflect on this with sincerity",
      actionsTitle: "Next Practical Steps",
      actionsSubtitle: "For the next week",
      tieMessage: "You show balance between two styles.",
      disclaimer: "This shows preferences, it doesn't limit who you are.",
      primary: "Primary",
      secondary: "Secondary",
      points: "points"
    }
  };

  const t = texts[lang];

  // Generate emotional summary
  const generateEmotionalSummary = () => {
    const primaryName = estilosResults.primary.name[lang];
    const secondaryName = estilosResults.secondary.name[lang];
    
    if (lang === 'en') {
      return `${firstName}, you connect primarily through ${primaryName}, but you are deeply complemented by ${secondaryName}. This combination reveals a person who values both ${primaryName.toLowerCase()} and ${secondaryName.toLowerCase()} in their emotional connections, creating a unique way of loving and feeling loved.`;
    } else if (lang === 'pt-pt') {
      return `${firstName}, tu conectas-te principalmente através de ${primaryName}, mas és profundamente complementado por ${secondaryName}. Esta combinação revela uma pessoa que valoriza tanto ${primaryName.toLowerCase()} quanto ${secondaryName.toLowerCase()} nas suas conexões emocionais, criando uma forma única de amar e sentir-te amado.`;
    }
    return `${firstName}, você se conecta principalmente através de ${primaryName}, mas é profundamente complementado por ${secondaryName}. Essa combinação revela uma pessoa que valoriza tanto ${primaryName.toLowerCase()} quanto ${secondaryName.toLowerCase()} em suas conexões emocionais, criando uma forma única de amar e se sentir amado.`;
  };

  return (
    <div className="space-y-6">
      {/* 1️⃣ Hero Personalizado */}
      <Card className={`border-none shadow-xl bg-gradient-to-br ${STYLE_COLORS[estilosResults.primary.style]}`}>
        <CardHeader className="pb-8 pt-10 text-center">
          <div className="text-7xl mb-4">{estilosResults.primary.symbol}</div>
          <CardTitle className="text-3xl md:text-4xl font-light mb-3">
            {firstName}, {t.title}
          </CardTitle>
          <CardDescription className="text-lg text-foreground/70">
            {t.subtitle}
          </CardDescription>
          <div className="mt-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              {estilosResults.primary.name[lang]}
            </h2>
            <p className="text-lg text-foreground/80 mt-3 max-w-2xl mx-auto italic">
              "{estilosResults.primary.essence[lang]}"
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* 2️⃣ Resumo Emocional Inicial */}
      <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-background">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">{t.emotionalSummaryTitle}</h3>
              <p className="text-base leading-relaxed text-foreground/80">
                {generateEmotionalSummary()}
              </p>
              {hasTie && (
                <p className="mt-3 text-sm text-amber-600 dark:text-amber-400 font-medium">
                  ⚖️ {t.tieMessage}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3️⃣ Ranking Completo dos 5 Estilos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {t.rankingTitle}
          </CardTitle>
          <CardDescription>{t.rankingSubtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedStyles.map((item, index) => (
            <div key={item.style} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.data.symbol}</span>
                  <span className="font-medium">{item.data.name[lang]}</span>
                  {index === 0 && (
                    <Badge variant="default" className="ml-2">{t.primary}</Badge>
                  )}
                  {index === 1 && (
                    <Badge variant="outline" className="ml-2">{t.secondary}</Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{item.score}</span>
                  <span className="text-muted-foreground text-sm ml-1">{t.points}</span>
                  <span className="text-muted-foreground text-sm ml-2">({item.percentage}%)</span>
                </div>
              </div>
              <div className="relative">
                <Progress value={item.percentage} className="h-3" />
                <div 
                  className={`absolute top-0 left-0 h-3 rounded-full ${STYLE_ACCENT_COLORS[item.style]}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-sm text-muted-foreground text-center pt-4 italic">
            {t.disclaimer}
          </p>
        </CardContent>
      </Card>

      {/* 4️⃣ Seu Estilo Primário em Profundidade */}
      <Card className={`border-2 ${STYLE_COLORS[estilosResults.primary.style].split(' ')[2]}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{estilosResults.primary.symbol}</span>
            <div>
              <CardTitle className="text-xl">{t.primaryTitle}</CardTitle>
              <CardDescription className="text-base">{estilosResults.primary.name[lang]}</CardDescription>
            </div>
          </div>
          <p className="text-lg italic text-foreground/80 mt-4">
            "{primaryContent.light[lang]}"
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Forças */}
          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {t.strengths}
            </h4>
            <div className="flex flex-wrap gap-2">
              {primaryContent.strengths[lang].map((strength, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-1">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Vulnerabilidades */}
          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              {t.vulnerabilities}
            </h4>
            <div className="flex flex-wrap gap-2">
              {primaryContent.vulnerabilities[lang].map((vuln, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1">
                  {vuln}
                </Badge>
              ))}
            </div>
          </div>

          {/* Como demonstra e sente amor */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                {t.howShowsLove}
              </h4>
              <p className="text-sm text-foreground/80">
                {primaryContent.emotionalDynamic.howShowsLove[lang]}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <HandHeart className="h-4 w-4 text-pink-500" />
                {t.howFeelsLove}
              </h4>
              <p className="text-sm text-foreground/80">
                {primaryContent.emotionalDynamic.howFeelsLove[lang]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5️⃣ Seu Estilo Secundário */}
      <Card className="border border-muted">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{estilosResults.secondary.symbol}</span>
            <div>
              <CardTitle className="text-lg">{t.secondaryTitle}</CardTitle>
              <CardDescription>{estilosResults.secondary.name[lang]}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">{t.secondaryHow}</h4>
            <p className="text-foreground/80">
              {secondaryContent.light[lang]}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {lang === 'en' 
              ? `When your primary style isn't enough, ${estilosResults.secondary.name.en} emerges as a complementary way of connecting.`
              : lang === 'pt-pt'
              ? `Quando o teu estilo primário não é suficiente, ${estilosResults.secondary.name['pt-pt']} surge como forma complementar de conexão.`
              : `Quando seu estilo primário não é suficiente, ${estilosResults.secondary.name.pt} surge como forma complementar de conexão.`
            }
          </p>
        </CardContent>
      </Card>

      {/* 6️⃣ Dinâmica Emocional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {t.dynamicTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <Eye className="h-5 w-5 text-green-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">{t.whatTouches}</h4>
            <p className="text-xs text-foreground/70">{primaryContent.emotionalDynamic.whatTouches[lang]}</p>
          </div>
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <Shield className="h-5 w-5 text-red-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">{t.whatHurts}</h4>
            <p className="text-xs text-foreground/70">{primaryContent.emotionalDynamic.whatHurts[lang]}</p>
          </div>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Target className="h-5 w-5 text-amber-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">{t.rejectionResponse}</h4>
            <p className="text-xs text-foreground/70">{primaryContent.emotionalDynamic.rejectionResponse[lang]}</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <HelpCircle className="h-5 w-5 text-blue-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">{t.whatExpects}</h4>
            <p className="text-xs text-foreground/70">{primaryContent.emotionalDynamic.whatExpects[lang]}</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <MessageCircle className="h-5 w-5 text-purple-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">{t.cantAsk}</h4>
            <p className="text-xs text-foreground/70">{primaryContent.emotionalDynamic.cantAsk[lang]}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/20">
            <Shield className="h-5 w-5 text-slate-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">{t.howProtects}</h4>
            <p className="text-xs text-foreground/70">{primaryContent.emotionalDynamic.howProtects[lang]}</p>
          </div>
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <Heart className="h-5 w-5 text-rose-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">{t.howShowsLove}</h4>
            <p className="text-xs text-foreground/70">{primaryContent.emotionalDynamic.howShowsLove[lang]}</p>
          </div>
          <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
            <HandHeart className="h-5 w-5 text-pink-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">{t.howFeelsLove}</h4>
            <p className="text-xs text-foreground/70">{primaryContent.emotionalDynamic.howFeelsLove[lang]}</p>
          </div>
        </CardContent>
      </Card>

      {/* 7️⃣ Aplicações Práticas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t.applicationsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-rose-600" />
              <h4 className="font-semibold">❤️ {t.relationships}</h4>
            </div>
            <p className="text-sm text-foreground/80">{primaryContent.relationships[lang]}</p>
          </div>
          <div className="p-5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Home className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold">👨‍👩‍👧 {t.family}</h4>
            </div>
            <p className="text-sm text-foreground/80">{primaryContent.family[lang]}</p>
          </div>
          <div className="p-5 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold">💼 {t.work}</h4>
            </div>
            <p className="text-sm text-foreground/80">{primaryContent.work[lang]}</p>
          </div>
        </CardContent>
      </Card>

      {/* 8️⃣ Pontos de Cura */}
      <Card className="bg-gradient-to-br from-purple-500/5 to-background border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Flame className="h-5 w-5 text-purple-500" />
            {t.healingTitle}
          </CardTitle>
          <CardDescription>{t.healingSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {primaryContent.healingPoints[lang].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-purple-500 mt-0.5">🌱</span>
                <span className="text-foreground/80">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 9️⃣ Análise da IA do Nello One */}
      <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{t.aiAnalysisTitle}</CardTitle>
              <CardDescription>{t.aiAnalysisSubtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-foreground/80 italic">
            "{firstName}, {primaryContent.miguelAnalysis[lang]}"
          </p>
        </CardContent>
      </Card>

      {/* 🔟 Pergunta de Autoexame */}
      <Card className="bg-gradient-to-br from-amber-500/5 to-background border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-amber-500" />
            {t.reflectionTitle}
          </CardTitle>
          <CardDescription>{t.reflectionSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-light text-center py-4 italic">
            "{primaryContent.selfExamQuestion[lang]}"
          </p>
        </CardContent>
      </Card>

      {/* 1️⃣1️⃣ Próximos Passos Práticos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            {t.actionsTitle}
          </CardTitle>
          <CardDescription>{t.actionsSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {primaryContent.practicalActions[lang].map((action, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-foreground/80">{action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}