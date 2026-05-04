/**
 * Frase-motor pastoral para um Círculo de Discernir.
 *
 * Gera deterministicamente UMA frase descrevendo o "tom" do círculo
 * a partir dos 2 blocos (entre 6) com maior média no grupo.
 *
 * Sem IA, sem chamadas externas. Auditável e idempotente.
 */

import type { CircleProfilePercentages, BlockKey } from "./circleProfileCalculation";

export interface MotorPhraseMember {
  percentages: CircleProfilePercentages;
}

const FALLBACK_PHRASE = "Um círculo de discernimento e comunhão.";

// Mapa de pares de blocos para frase pastoral pré-aprovada.
// Chave sempre alfabética entre os 2 blocos para idempotência.
const PAIR_PHRASES: Record<string, string> = {
  acolhimento_comunicacao: "Um círculo que escuta com presença e responde com clareza.",
  acolhimento_conducao: "Um círculo que acolhe e conduz com mãos abertas.",
  acolhimento_equipe: "Um círculo que cuida e caminha junto.",
  acolhimento_espiritualidade: "Um círculo que escuta com fé e abraça com presença.",
  acolhimento_lideranca: "Um círculo que abraça com firmeza e acolhe com direção.",
  comunicacao_conducao: "Um círculo que fala com clareza e abre caminho.",
  comunicacao_equipe: "Um círculo que constrói junto e fala a mesma linguagem.",
  comunicacao_espiritualidade: "Um círculo que partilha a Palavra e o silêncio.",
  comunicacao_lideranca: "Um círculo que toma a frente e comunica com cuidado.",
  conducao_equipe: "Um círculo que conduz junto e celebra junto.",
  conducao_espiritualidade: "Um círculo que conduz pela oração.",
  conducao_lideranca: "Um círculo que toma a frente com clareza e direção.",
  equipe_espiritualidade: "Um círculo de oração que caminha em comunhão.",
  equipe_lideranca: "Um círculo que move e organiza com leveza.",
  espiritualidade_lideranca: "Um círculo que reza com firmeza.",
};

export const getCircleMotorPhrase = (members: MotorPhraseMember[]): string => {
  if (!members || members.length === 0) return FALLBACK_PHRASE;

  const blocks: BlockKey[] = [
    "lideranca",
    "acolhimento",
    "comunicacao",
    "equipe",
    "espiritualidade",
    "conducao",
  ];

  // Calcula media de cada bloco no grupo
  const averages = blocks.map((b) => {
    const sum = members.reduce((acc, m) => acc + (m.percentages?.[b] ?? 0), 0);
    return { block: b, avg: sum / members.length };
  });

  // Top 2 blocos
  averages.sort((a, b) => b.avg - a.avg);
  const top2 = averages.slice(0, 2).map((x) => x.block).sort();
  const key = `${top2[0]}_${top2[1]}`;

  return PAIR_PHRASES[key] || FALLBACK_PHRASE;
};
