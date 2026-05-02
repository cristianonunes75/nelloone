/**
 * Compatibilidade par a par dentro de um círculo.
 *
 * Determinístico, sem IA. Usa os 6 percentuais do Perfil de Serviço de cada
 * pessoa para calcular o quanto dois membros tendem a se complementar quando
 * postos no mesmo círculo.
 *
 * Linguagem pastoral, não-clínica. Cada justificativa cita os blocos e os
 * percentuais reais — nunca clichês genéricos.
 */

import type { BlockKey, CircleProfilePercentages } from './circleProfileCalculation';

export type CompatType = 'complementar' | 'bom_encaixe' | 'encaixe_parcial' | 'tensao';

export interface PairMember {
  user_id: string;
  display_name: string;
  primary_role: string;
  percentages: CircleProfilePercentages;
  spouse_user_id?: string | null;
  participant_type?: 'casal' | 'jovem' | null;
  /** True when this PairMember represents a married couple grouped as one unit. */
  is_couple_unit?: boolean;
  /** When is_couple_unit is true, the user_ids of both spouses. */
  member_user_ids?: string[];
}

export interface PairCompatibility {
  outro_user_id: string;
  outro_nome: string;
  outro_papel: string;
  score: number; // 0–100
  tipo: CompatType;
  rotulo: string; // ex.: "complementar", "bom encaixe"
  justificativa: string;
  cuidado: string | null;
}

const BLOCOS: BlockKey[] = [
  'lideranca',
  'acolhimento',
  'comunicacao',
  'equipe',
  'espiritualidade',
  'conducao',
];

const BLOCO_LABEL: Record<BlockKey, string> = {
  lideranca: 'Liderança',
  acolhimento: 'Acolhimento',
  comunicacao: 'Comunicação',
  equipe: 'Equipe',
  espiritualidade: 'Espiritualidade',
  conducao: 'Condução',
};

const ALTO = 75;
const BAIXO = 50;

function pct(p: CircleProfilePercentages, b: BlockKey): number {
  return Math.round(p[b] || 0);
}

function altos(p: CircleProfilePercentages): BlockKey[] {
  return BLOCOS.filter((b) => pct(p, b) >= ALTO);
}

function baixos(p: CircleProfilePercentages): BlockKey[] {
  return BLOCOS.filter((b) => pct(p, b) < BAIXO);
}

/**
 * Score 0–100 par a par.
 *
 * Componentes (somam até 100):
 *  - Complementaridade (até 50): para cada bloco baixo de um, soma se o outro
 *    está alto naquele bloco. Mútuo conta dobrado.
 *  - Eixo espiritual compartilhado (até 12): bônus se ambos têm
 *    Espiritualidade ≥ 60 — núcleo de oração comum.
 *  - Cobertura de blocos do grupo (até 18): pares cobrem mais blocos altos
 *    diferentes ⇒ mais valor (anti-espelhamento).
 *  - Distância vetorial moderada (até 20): pares nem idênticos nem opostos
 *    radicais. Distância média ⇒ mais pontos.
 *  - Penalidade espelhamento: até −15 se altos e baixos coincidem demais.
 */
export function calcPairCompatibility(
  a: PairMember,
  b: PairMember,
): PairCompatibility {
  const pa = a.percentages;
  const pb = b.percentages;

  const altosA = altos(pa);
  const altosB = altos(pb);
  const baixosA = baixos(pa);
  const baixosB = baixos(pb);

  // 1. Complementaridade (até 50)
  let comp = 0;
  const blocosComplementadosParaA: BlockKey[] = [];
  const blocosComplementadosParaB: BlockKey[] = [];

  for (const blk of baixosA) {
    if (altosB.includes(blk)) {
      comp += 8;
      blocosComplementadosParaA.push(blk);
    } else if (pct(pb, blk) >= 60) {
      comp += 4;
      blocosComplementadosParaA.push(blk);
    }
  }
  for (const blk of baixosB) {
    if (altosA.includes(blk)) {
      comp += 8;
      blocosComplementadosParaB.push(blk);
    } else if (pct(pa, blk) >= 60) {
      comp += 4;
      blocosComplementadosParaB.push(blk);
    }
  }
  comp = Math.min(50, comp);

  // 2. Eixo espiritual compartilhado (até 12)
  let espirit = 0;
  const espA = pct(pa, 'espiritualidade');
  const espB = pct(pb, 'espiritualidade');
  if (espA >= 60 && espB >= 60) {
    espirit = Math.min(12, Math.round(((espA + espB) / 2 - 50) * 0.4));
  }

  // 3. Cobertura de blocos altos diferentes (até 18)
  const altosUnion = new Set<BlockKey>([...altosA, ...altosB]);
  const altosIntersect = altosA.filter((x) => altosB.includes(x));
  // mais união e menos interseção = mais cobertura
  const cobertura = Math.min(
    18,
    altosUnion.size * 4 - altosIntersect.length * 2,
  );

  // 4. Distância vetorial moderada (até 20)
  let distSq = 0;
  for (const blk of BLOCOS) {
    const d = pct(pa, blk) - pct(pb, blk);
    distSq += d * d;
  }
  const dist = Math.sqrt(distSq / BLOCOS.length); // 0–~50
  // pico em distância ~20–25 (perfis diferentes mas conversáveis)
  const distScore = Math.max(
    0,
    Math.min(20, 20 - Math.abs(dist - 22) * 0.7),
  );

  // 5. Penalidade espelhamento
  let espelho = 0;
  const altosIguais = altosIntersect.length;
  const baixosIntersect = baixosA.filter((x) => baixosB.includes(x)).length;
  if (altosIguais >= 2 && baixosIntersect >= 2) {
    espelho = -Math.min(15, (altosIguais + baixosIntersect) * 2);
  }

  const raw = comp + espirit + Math.max(0, cobertura) + distScore + espelho;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  // Classificação
  let tipo: CompatType;
  let rotulo: string;
  if (score >= 75) {
    tipo = 'complementar';
    rotulo = 'complementar';
  } else if (score >= 55) {
    tipo = 'bom_encaixe';
    rotulo = 'bom encaixe';
  } else if (score >= 40) {
    tipo = 'encaixe_parcial';
    rotulo = 'encaixe parcial';
  } else {
    tipo = 'tensao';
    rotulo = 'tensão a cuidar';
  }

  // Justificativa: cita os percentuais reais
  const partes: string[] = [];

  if (blocosComplementadosParaA.length > 0) {
    const blk = blocosComplementadosParaA[0];
    partes.push(
      `${a.display_name.split(' ')[0]} mais discreto em ${BLOCO_LABEL[blk]} (${pct(pa, blk)}%) encontra ${b.display_name.split(' ')[0]} forte ali (${pct(pb, blk)}%)`,
    );
  }
  if (blocosComplementadosParaB.length > 0) {
    const blk = blocosComplementadosParaB[0];
    partes.push(
      `${b.display_name.split(' ')[0]} mais discreto em ${BLOCO_LABEL[blk]} (${pct(pb, blk)}%) ganha apoio de ${a.display_name.split(' ')[0]} (${pct(pa, blk)}%)`,
    );
  }
  if (partes.length === 0 && espirit > 0) {
    partes.push(
      `eixo de oração compartilhado — ambos com Espiritualidade alta (${espA}% e ${espB}%)`,
    );
  }
  if (partes.length === 0 && altosIguais >= 2) {
    const blk = altosIntersect[0];
    partes.push(
      `ambos fortes em ${BLOCO_LABEL[blk]} (${pct(pa, blk)}% e ${pct(pb, blk)}%) — combinação que reforça esse eixo`,
    );
  }
  if (partes.length === 0) {
    const top = [...BLOCOS].sort((x, y) => pct(pa, y) - pct(pa, x))[0];
    partes.push(
      `${a.display_name.split(' ')[0]} forte em ${BLOCO_LABEL[top]} (${pct(pa, top)}%) entra ao lado de ${b.display_name.split(' ')[0]} (${BLOCO_LABEL[top]} ${pct(pb, top)}%)`,
    );
  }

  let justificativa = partes.join('; ') + '.';
  // capitaliza
  justificativa = justificativa.charAt(0).toUpperCase() + justificativa.slice(1);

  // Cuidado quando há tensão real ou espelhamento
  let cuidado: string | null = null;
  if (espelho < 0) {
    const blk = altosIntersect[0];
    cuidado = `Os dois reforçam ${BLOCO_LABEL[blk]} e compartilham os mesmos pontos discretos — vale checar quem cobre o que falta no grupo.`;
  } else if (tipo === 'tensao') {
    cuidado = 'Os perfis estão distantes — pode pedir uma terceira pessoa do círculo para fazer ponte.';
  } else if (blocosComplementadosParaA.length === 0 && blocosComplementadosParaB.length === 0 && altosIguais >= 2) {
    cuidado = 'Combinação forte mas concentrada — vale equilibrar com alguém de perfil diferente no mesmo encontro.';
  }

  return {
    outro_user_id: b.user_id,
    outro_nome: b.display_name,
    outro_papel: b.primary_role,
    score,
    tipo,
    rotulo,
    justificativa,
    cuidado,
  };
}

/**
 * Para um membro do círculo, devolve a lista de compatibilidade com cada
 * outro membro, ordenada do maior score para o menor.
 */
export function calcCompatibilitiesFor(
  member: PairMember,
  others: PairMember[],
): PairCompatibility[] {
  return others
    .filter((o) => o.user_id !== member.user_id)
    .map((o) => calcPairCompatibility(member, o))
    .sort((a, b) => b.score - a.score);
}

/**
 * Estatísticas do círculo inteiro: média e desvio por bloco, blocos
 * saturados (≥3 altos) e blocos lacuna (ninguém alto).
 */
export interface CircleStats {
  size: number;
  averages: Record<BlockKey, number>;
  saturated: BlockKey[]; // ≥ 3 pessoas em alta
  gaps: BlockKey[]; // ninguém alto
  spiritualBackbone: number; // % de membros com Espiritualidade ≥ 60
}

export function calcCircleStats(members: PairMember[]): CircleStats {
  const size = members.length || 1;
  const averages = {} as Record<BlockKey, number>;
  const altosCount = {} as Record<BlockKey, number>;

  for (const blk of BLOCOS) {
    let sum = 0;
    let altosN = 0;
    for (const m of members) {
      const v = pct(m.percentages, blk);
      sum += v;
      if (v >= ALTO) altosN += 1;
    }
    averages[blk] = Math.round(sum / size);
    altosCount[blk] = altosN;
  }

  const saturated = BLOCOS.filter((b) => altosCount[b] >= 3);
  const gaps = BLOCOS.filter((b) => altosCount[b] === 0);

  const espN = members.filter((m) => pct(m.percentages, 'espiritualidade') >= 60).length;
  const spiritualBackbone = Math.round((espN / size) * 100);

  return { size, averages, saturated, gaps, spiritualBackbone };
}

/**
 * Retorna os top N pares com melhor score do círculo, sem repetir pares
 * (A↔B só aparece uma vez).
 */
export interface TopPair {
  a: PairMember;
  b: PairMember;
  compat: PairCompatibility;
}

export function topPairsOfCircle(members: PairMember[], n = 4): TopPair[] {
  const seen = new Set<string>();
  const pairs: TopPair[] = [];
  for (let i = 0; i < members.length; i += 1) {
    for (let j = i + 1; j < members.length; j += 1) {
      const a = members[i];
      const b = members[j];
      const key = [a.user_id, b.user_id].sort().join(':');
      if (seen.has(key)) continue;
      seen.add(key);
      const compat = calcPairCompatibility(a, b);
      pairs.push({ a, b, compat });
    }
  }
  pairs.sort((x, y) => y.compat.score - x.compat.score);
  return pairs.slice(0, n);
}
