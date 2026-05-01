/**
 * Perfil de Serviço — Leitura combinada (determinística, sem IA)
 *
 * Gera uma leitura pastoral específica para cada participante a partir da
 * combinação real dos 6 percentuais. Mesmo papel principal, percentuais
 * diferentes → leitura diferente.
 *
 * Linguagem não-clínica e não-diagnóstica: "tende a", "pode ajudar",
 * "cuidar para". Nunca "você é" / "você não consegue".
 */

import type { BlockKey, CircleProfilePercentages } from './circleProfileCalculation';

export interface LeituraPerfilServico {
  abertura: string;
  agrega: string[];
  atencao: string[];
  encaixe: string;
}

const ALTO = 75;
const BAIXO = 50;

type Faixa = 'alto' | 'medio' | 'baixo';

function faixa(pct: number): Faixa {
  if (pct >= ALTO) return 'alto';
  if (pct >= BAIXO) return 'medio';
  return 'baixo';
}

const BLOCOS: BlockKey[] = [
  'lideranca',
  'acolhimento',
  'comunicacao',
  'equipe',
  'espiritualidade',
  'conducao',
];

// ============ ABERTURA: 15 combinações 2 a 2 ============
// Chave normalizada: blocos em ordem alfabética separados por '+'
const ABERTURAS_PAR: Record<string, string> = {
  'acolhimento+lideranca':
    'Conduz pelo cuidado: dá direção sem perder a escuta de quem está ao lado.',
  'comunicacao+lideranca':
    'Lidera abrindo a palavra: organiza o grupo e mantém o diálogo vivo.',
  'equipe+lideranca':
    'Puxa o grupo junto: assume frente sem deixar ninguém para trás.',
  'espiritualidade+lideranca':
    'Lidera com âncora de oração: puxa o círculo a partir do propósito espiritual.',
  'conducao+lideranca':
    'Energia de quem mobiliza: junta visão e ritmo para o grupo avançar.',
  'acolhimento+comunicacao':
    'Acolhe pela palavra: cria ponte com quem chega e com quem é mais tímido.',
  'acolhimento+equipe':
    'Tece os vínculos: percebe quem precisa de atenção e cuida do clima do grupo.',
  'acolhimento+espiritualidade':
    'Cuida com profundidade: escuta sustentada por oração silenciosa.',
  'acolhimento+conducao':
    'Cuida com firmeza: acolhe sem perder o rumo do encontro.',
  'comunicacao+equipe':
    'Faz o grupo conversar: traduz o conteúdo e tece os vínculos entre todos.',
  'comunicacao+espiritualidade':
    'Comunica com sentido: leva o grupo ao essencial pela palavra cuidada.',
  'comunicacao+conducao':
    'Articula e move: explica, engaja e mantém o encontro fluindo.',
  'equipe+espiritualidade':
    'Sustenta o grupo por dentro: harmonia entre membros nascida da postura de oração.',
  'equipe+conducao':
    'Equilibra e impulsiona: mantém o clima leve enquanto o grupo caminha.',
  'conducao+espiritualidade':
    'Move o grupo desde a oração: conduz com energia ancorada no propósito.',
};

function aberturaPara(top1: BlockKey, top2: BlockKey): string {
  const key = [top1, top2].sort().join('+');
  return (
    ABERTURAS_PAR[key] ||
    'Tem um perfil de serviço próprio que combina força e sensibilidade ao seu modo.'
  );
}

// ============ CONTRIBUIÇÃO POR BLOCO ALTO ============
const CONTRIBUICAO_BLOCO_ALTO: Record<BlockKey, string> = {
  lideranca:
    'Dá direção e ritmo ao círculo — bom para abrir caminho quando o grupo trava.',
  acolhimento:
    'Percebe o silêncio dos outros — bom para receber quem chega e cuidar do que não é dito.',
  comunicacao:
    'Traduz e abre a palavra — bom para fazer o conteúdo chegar a todos, inclusive aos mais quietos.',
  equipe:
    'Fortalece o nós — bom para manter harmonia e colaboração entre os membros.',
  espiritualidade:
    'Sustenta o propósito espiritual — bom para lembrar o grupo do porquê de estarem ali.',
  conducao:
    'Carrega energia que mobiliza — bom para manter o encontro vivo e com ritmo.',
};

// ============ TENSÕES POR PAR OPOSTO (alto + baixo no oposto) ============
// Quando um bloco está alto e o "oposto" está baixo, gera tensão real.
const PARES_TENSAO: Array<{ alto: BlockKey; baixo: BlockKey; texto: string }> = [
  {
    alto: 'lideranca',
    baixo: 'acolhimento',
    texto:
      'Pode atropelar quem é mais quieto — vale checar se todos foram ouvidos antes de decidir.',
  },
  {
    alto: 'acolhimento',
    baixo: 'lideranca',
    texto:
      'Pode acolher tanto que esquece de puxar uma direção — vale assumir frente em momentos-chave.',
  },
  {
    alto: 'lideranca',
    baixo: 'equipe',
    texto:
      'Pode caminhar mais rápido que o grupo — vale desacelerar para incluir quem ficou para trás.',
  },
  {
    alto: 'comunicacao',
    baixo: 'acolhimento',
    texto:
      'Pode falar bem mas ouvir pouco — vale criar pausas para escutar o que não foi dito.',
  },
  {
    alto: 'acolhimento',
    baixo: 'comunicacao',
    texto:
      'Sente muito mas pode travar na hora de nomear — vale ensaiar o que dizer ao grupo.',
  },
  {
    alto: 'conducao',
    baixo: 'espiritualidade',
    texto:
      'Pode mover o grupo por energia humana só — vale ancorar a condução em oração silenciosa.',
  },
  {
    alto: 'espiritualidade',
    baixo: 'conducao',
    texto:
      'Profundidade interior pode pedir mais expressão — vale assumir gestos visíveis de animação.',
  },
  {
    alto: 'equipe',
    baixo: 'lideranca',
    texto:
      'Boa para o clima, mas pode evitar conflitos necessários — vale segurar decisões difíceis quando preciso.',
  },
  {
    alto: 'lideranca',
    baixo: 'espiritualidade',
    texto:
      'Pode liderar pela eficiência e esquecer o propósito — vale começar e fechar com oração.',
  },
];

// ============ ATENÇÃO PAPEL × BLOCO BAIXO ============
// Para cada papel principal, blocos baixos críticos para esse papel.
const ATENCAO_PAPEL_BAIXO: Record<string, Partial<Record<BlockKey, string>>> = {
  Condutor: {
    acolhimento:
      'Como condutor, cuidar para não passar por cima de quem é mais reservado.',
    espiritualidade:
      'Como condutor, lembrar que conduzir vem antes de tudo da oração — não só da agenda.',
    equipe:
      'Como condutor, cuidar para que o grupo não vire só execução: o vínculo é parte da missão.',
  },
  'Pastor do Círculo': {
    comunicacao:
      'Cuida bem 1 a 1, mas pode travar quando precisa puxar fala diante do grupo todo.',
    lideranca:
      'Acolhe muito bem, mas pode evitar dar direção quando o grupo está perdido.',
    conducao:
      'Cuidado profundo pode parecer baixo astral — vale puxar momentos de leveza.',
  },
  Facilitador: {
    acolhimento:
      'Comunica bem, mas pode esquecer de checar como cada um está por dentro.',
    espiritualidade:
      'Engaja a fala, mas vale lembrar de levar o grupo ao essencial, não só ao interessante.',
    equipe:
      'Facilita o conteúdo, mas pode descuidar dos vínculos entre os membros.',
  },
  'Guardião do Clima': {
    lideranca:
      'Cuida do clima, mas pode evitar puxar uma direção quando o grupo precisa.',
    comunicacao:
      'Sente o clima, mas vale ensaiar dizer o que percebe em vez de só sustentar em silêncio.',
    espiritualidade:
      'Equilibra bem, mas vale ancorar mais explicitamente em oração para não virar só "boa convivência".',
  },
  Intercessor: {
    comunicacao:
      'Reza muito, mas pode falar pouco — vale partilhar o que percebe na oração com o grupo.',
    conducao:
      'Profundidade pede expressão — vale assumir gestos visíveis de animação no encontro.',
    lideranca:
      'Sustenta por dentro, mas pode esperar demais que outro puxe — vale assumir frente quando ninguém o faz.',
  },
};

// ============ ENCAIXE: PAPEL × 2º BLOCO MAIS ALTO ============
const ENCAIXE_PAPEL_SEGUNDO: Record<string, Partial<Record<BlockKey, string>>> = {
  Condutor: {
    espiritualidade: 'Bom para abrir e fechar encontros com oração curta e firme.',
    acolhimento: 'Bom para conduzir reuniões de discernimento, onde direção e escuta andam juntas.',
    comunicacao: 'Bom para puxar dinâmicas em grupos novos ou maiores.',
    equipe: 'Bom para liderar projetos do círculo que dependem de várias mãos.',
    conducao: 'Bom para conduzir encontros de chegada de novos membros, onde energia conta.',
    lideranca: 'Bom para assumir coordenação geral quando o grupo precisa de um eixo claro.',
  },
  'Pastor do Círculo': {
    espiritualidade: 'Bom para acompanhar pessoalmente quem está em momento difícil.',
    comunicacao: 'Bom para receber jovem novo e fazer a primeira ponte de chegada.',
    equipe: 'Bom para mediar quando há atrito entre membros do círculo.',
    conducao: 'Bom para liderar momentos de partilha mais profundos.',
    lideranca: 'Bom para coordenar grupo pequeno onde cuidado é mais importante que produção.',
    acolhimento: 'Bom para sustentar o círculo nas estações em que ninguém quer falar.',
  },
  Facilitador: {
    acolhimento: 'Bom para receber jovem novo e fazer a primeira ponte com o grupo.',
    espiritualidade: 'Bom para conduzir partilhas sobre fé sem deixar virar debate só intelectual.',
    equipe: 'Bom para puxar dinâmicas que aproximam quem ainda não se conhece.',
    lideranca: 'Bom para conduzir reuniões que precisam de pauta clara e fala distribuída.',
    conducao: 'Bom para animar encontros quando o grupo está mais cabisbaixo.',
    comunicacao: 'Bom para preparar e conduzir formações ou catequeses curtas no círculo.',
  },
  'Guardião do Clima': {
    espiritualidade: 'Bom para sustentar o clima de oração sem precisar muito gesto.',
    acolhimento: 'Bom para perceber rapidamente quem está se sentindo de fora.',
    comunicacao: 'Bom para nomear, com cuidado, o que o grupo está sentindo.',
    lideranca: 'Bom para puxar reorganização do grupo quando o clima azeda.',
    conducao: 'Bom para ajustar energia do encontro: acelerar ou desacelerar conforme preciso.',
    equipe: 'Bom para fortalecer vínculos entre os membros nas pequenas conversas.',
  },
  Intercessor: {
    acolhimento: 'Bom para acompanhar em oração quem está atravessando algo difícil.',
    comunicacao: 'Bom para conduzir momentos de oração em voz alta ou partilhas espirituais.',
    equipe: 'Bom para sustentar o círculo em oração coletiva e silêncio comum.',
    lideranca: 'Bom para assumir os momentos de oração de início e fim do encontro.',
    conducao: 'Bom para puxar adoração ou louvor quando o grupo precisa elevar.',
    espiritualidade: 'Bom para retiros e momentos longos de discernimento espiritual.',
  },
};

// ============ FUNÇÃO PRINCIPAL ============
export function gerarLeituraPerfilServico(
  percentages: CircleProfilePercentages,
  primaryRole: string,
  _secondaryRole?: string | null,
): LeituraPerfilServico {
  // Ordena blocos do maior para o menor percentual
  const ranked = [...BLOCOS].sort((a, b) => (percentages[b] || 0) - (percentages[a] || 0));
  const top1 = ranked[0];
  const top2 = ranked[1];

  // a) Abertura — combina os 2 blocos mais altos
  const abertura = aberturaPara(top1, top2);

  // b) Agrega — uma frase por bloco em faixa Alta (>= 75%)
  const altos = BLOCOS.filter((b) => faixa(percentages[b] || 0) === 'alto');
  const agrega = altos.length > 0
    ? altos.map((b) => CONTRIBUICAO_BLOCO_ALTO[b])
    : [CONTRIBUICAO_BLOCO_ALTO[top1]]; // fallback: usa o top 1 mesmo se não chegar a 75%

  // c) Atenção — tensões por par oposto + atenção do papel × bloco baixo
  const atencao: string[] = [];
  const adicionados = new Set<string>();

  for (const par of PARES_TENSAO) {
    const altoOk = (percentages[par.alto] || 0) >= ALTO;
    const baixoOk = (percentages[par.baixo] || 0) < BAIXO;
    if (altoOk && baixoOk && !adicionados.has(par.texto)) {
      atencao.push(par.texto);
      adicionados.add(par.texto);
    }
  }

  // Atenção específica do papel principal × blocos baixos
  const baixosDoUsuario = BLOCOS.filter((b) => (percentages[b] || 0) < BAIXO);
  const mapPapel = ATENCAO_PAPEL_BAIXO[primaryRole] || {};
  for (const b of baixosDoUsuario) {
    const texto = mapPapel[b];
    if (texto && !adicionados.has(texto)) {
      atencao.push(texto);
      adicionados.add(texto);
    }
  }

  // Limita a 3 atenções para não sobrecarregar pastoralmente
  const atencaoFinal = atencao.slice(0, 3);

  // Se não houver nenhuma atenção, devolve uma frase suave genérica
  if (atencaoFinal.length === 0) {
    atencaoFinal.push(
      'Perfil bastante equilibrado — o cuidado principal é não assumir tarefas demais e manter discernimento sobre onde servir mais.',
    );
  }

  // d) Encaixe — papel principal × 2º bloco mais alto
  const encaixeMap = ENCAIXE_PAPEL_SEGUNDO[primaryRole] || {};
  const encaixe =
    encaixeMap[top2] ||
    encaixeMap[top1] ||
    'Pode servir bem em diferentes frentes do círculo — converse com a coordenação para encontrar o melhor encaixe.';

  return {
    abertura,
    agrega,
    atencao: atencaoFinal,
    encaixe,
  };
}

/**
 * Versão em texto puro, pronta para colar em mensagem (WhatsApp, e-mail).
 */
export function leituraToText(
  leitura: LeituraPerfilServico,
  nomeOpcional?: string,
): string {
  const linhas: string[] = [];
  if (nomeOpcional) linhas.push(`Leitura pastoral — ${nomeOpcional}`, '');
  linhas.push(leitura.abertura, '');
  linhas.push('O que agrega ao círculo:');
  leitura.agrega.forEach((a) => linhas.push(`• ${a}`));
  linhas.push('', 'Pontos de atenção:');
  leitura.atencao.forEach((a) => linhas.push(`• ${a}`));
  linhas.push('', `Melhor encaixe: ${leitura.encaixe}`);
  return linhas.join('\n');
}
