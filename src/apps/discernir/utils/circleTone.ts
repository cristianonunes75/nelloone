/**
 * Tom Automático do Círculo (parágrafo descritivo determinístico).
 *
 * Diferente da frase-motor (1 linha), o tom é um parágrafo curto
 * descrevendo a vibe geral do grupo. Sempre acolhedor, sem rótulos
 * técnicos, sem percentuais.
 *
 * Usado como valor default no card. O coordenador pode sobrescrever
 * com texto próprio (ex: copiar do material .md).
 */

import type { CircleProfilePercentages, BlockKey } from "./circleProfileCalculation";

export interface ToneMember {
  percentages: CircleProfilePercentages;
}

const FALLBACK_TONE =
  "Este é um círculo onde quatro caminhadas se encontram. Cada um traz o seu jeito, e o grupo se forma na escuta mútua. Que a presença de cada um sustente a presença dos outros.";

// Para cada par de blocos top, um parágrafo correspondente.
// Chave alfabética entre os 2 blocos.
const PAIR_TONES: Record<string, string> = {
  acolhimento_comunicacao:
    "Este é um círculo onde a escuta acolhedora encontra a palavra certa. Há aqui o dom raro de receber com presença e responder com clareza, sem pressa e sem distância. Quem chegar com peso encontrará abertura. Quem chegar com dúvida encontrará palavra que não impõe.",
  acolhimento_conducao:
    "Este é um círculo onde acolhimento e direção caminham juntos. Há aqui a capacidade de receber sem julgar e ao mesmo tempo de oferecer um próximo passo quando o grupo precisa. É um lugar onde se pode descansar e também ser convidado a seguir.",
  acolhimento_equipe:
    "Este é um círculo onde o cuidado pelo outro é a língua materna. Há aqui um instinto coletivo de não deixar ninguém para trás, e de fazer da caminhada de um o combustível da caminhada de todos. É um lugar onde se aprende a ser cuidado e a cuidar.",
  acolhimento_espiritualidade:
    "Este é um círculo onde a oração silenciosa e o abraço presente sustentam tudo. Há aqui uma profundidade espiritual que não precisa de muita palavra para fazer o outro se sentir em casa. Quem chegar cansado descansará. Quem chegar perdido encontrará chão.",
  acolhimento_lideranca:
    "Este é um círculo onde firmeza e ternura se equilibram. Há aqui a coragem de abrir caminho e a sabedoria de esperar quem ainda está chegando. É um lugar onde se aprende a ser forte sem deixar de ser delicado.",
  comunicacao_conducao:
    "Este é um círculo onde a clareza ilumina o próximo passo. Há aqui o dom de dizer o que precisa ser dito de um jeito que move sem ferir. É um lugar onde as conversas vão fundo e os encontros saem com direção, não com peso.",
  comunicacao_equipe:
    "Este é um círculo onde se constrói junto e se fala a mesma linguagem. Há aqui uma facilidade rara de combinar e cumprir o combinado. É um lugar onde os encontros viram amizade que dura, e a partilha vira projeto comum.",
  comunicacao_espiritualidade:
    "Este é um círculo onde a Palavra e o silêncio dialogam. Há aqui a graça de partilhar fé sem retórica, e de saber quando rezar e quando ouvir. É um lugar onde Deus aparece nas brechas da conversa.",
  comunicacao_lideranca:
    "Este é um círculo onde a iniciativa anda de mãos dadas com o cuidado de comunicar. Há aqui a coragem de propor e a paciência de explicar até que todos estejam juntos. É um lugar onde quem fica para trás é convidado, não cobrado.",
  conducao_equipe:
    "Este é um círculo onde se conduz junto e se celebra junto. Há aqui um senso natural de ritmo coletivo e de comemoração das pequenas vitórias. É um lugar onde a caminhada vira festa de cada conquista.",
  conducao_espiritualidade:
    "Este é um círculo onde a oração orienta a direção. Há aqui o discernimento sereno de quem espera Deus dizer antes de agir. É um lugar onde decisões amadurecem no silêncio antes de aparecerem nas palavras.",
  conducao_lideranca:
    "Este é um círculo onde quem assume também sabe esperar. Há aqui a iniciativa que não atropela e a presença que abre caminho sem se impor. É um lugar onde se aprende a liderar servindo.",
  equipe_espiritualidade:
    "Este é um círculo onde a oração caminha em comunhão. Há aqui a vocação de rezar uns pelos outros e de fazer da fé uma rede de sustento. É um lugar onde ninguém reza sozinho, mesmo quando está sozinho.",
  equipe_lideranca:
    "Este é um círculo que move e organiza com leveza. Há aqui energia para começar e disciplina para continuar. É um lugar onde a vontade vira plano, e o plano vira vida.",
  espiritualidade_lideranca:
    "Este é um círculo onde a oração precede a ação e a sustenta. Há aqui a coragem que nasce do silêncio e a iniciativa que vem do discernimento. É um lugar onde se age depois de se escutar.",
};

export const getCircleTone = (members: ToneMember[]): string => {
  if (!members || members.length === 0) return FALLBACK_TONE;

  const blocks: BlockKey[] = [
    "lideranca",
    "acolhimento",
    "comunicacao",
    "equipe",
    "espiritualidade",
    "conducao",
  ];

  const averages = blocks.map((b) => {
    const sum = members.reduce((acc, m) => acc + (m.percentages?.[b] ?? 0), 0);
    return { block: b, avg: sum / members.length };
  });

  averages.sort((a, b) => b.avg - a.avg);
  const top2 = averages.slice(0, 2).map((x) => x.block).sort();
  const key = `${top2[0]}_${top2[1]}`;

  return PAIR_TONES[key] || FALLBACK_TONE;
};
