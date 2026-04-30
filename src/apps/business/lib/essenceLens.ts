/**
 * Lente pessoal aprofundada: cruza os 7 mapas (DISC, Temperamento, Eneagrama,
 * Nello16, Inteligências Múltiplas, Estilos de Conexão Afetiva, Arquétipos)
 * com o cargo da colaboradora e gera a leitura "fase, não identidade" para
 * o BusinessMySpace.
 *
 * Tudo na 2ª pessoa, sem rótulo definitivo, sem termo clínico.
 * Trabalho aqui = dar o seu melhor + presença ativa (cuidar e ser cuidado).
 */
import { categorizeRole, type RoleCategory } from './gentleVocabulary';

type AnyRecord = Record<string, unknown>;

function asRecord(v: unknown): AnyRecord {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as AnyRecord) : {};
}
function getString(v: unknown): string | null {
  if (typeof v === 'string' && v.trim()) return v.trim();
  return null;
}
function getNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

// =================== Tipos normalizados ===================

export type DiscKey = 'D' | 'I' | 'S' | 'C' | null;
export type TempKey = 'sanguineo' | 'colerico' | 'melancolico' | 'fleumatico' | null;
export type EneaKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;

function normDisc(v?: string | null): DiscKey {
  const k = v?.trim().toUpperCase().charAt(0);
  return k === 'D' || k === 'I' || k === 'S' || k === 'C' ? k : null;
}
function normTemp(v?: string | null): TempKey {
  const k = (v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (k.startsWith('sang')) return 'sanguineo';
  if (k.startsWith('col')) return 'colerico';
  if (k.startsWith('mel')) return 'melancolico';
  if (k.startsWith('fle')) return 'fleumatico';
  return null;
}
function normEnea(v: unknown): EneaKey {
  const n = getNumber(v);
  if (n && n >= 1 && n <= 9) return Math.round(n) as EneaKey;
  // tentativa string "tipo 5" / "5w4"
  const s = typeof v === 'string' ? v.match(/[1-9]/) : null;
  if (s) return Number(s[0]) as EneaKey;
  return null;
}

export type EssenceSnapshot = {
  // núcleo
  disc: DiscKey;
  temperament: TempKey;
  eneagramType: EneaKey;
  eneagramWing: number | null;
  nello16Code: string | null; // 4 letras Nello16
  // expressão
  archetypePrimary: string | null;
  archetypeSecondary: string | null;
  archetypeShadow: string | null;
  // conexão e cognição
  connectionStylePrimary: string | null;
  connectionStyleSecondary: string | null;
  intelligencesTop3: string[];
  topIntelligence: string | null; // legado
  // sintese
  leadershipMode: 'Direção' | 'Conexão' | 'Sustentação' | 'Critério' | null;
};

export function extractEssenceSnapshot(sections: unknown): EssenceSnapshot {
  const s = asRecord(sections);
  const disc = asRecord(s.disc);
  const temp = asRecord(s.temperament);
  const enea = asRecord(s.eneagram ?? s.eneagrama);
  const n16 = asRecord(s.nello16 ?? s.mbti ?? s.cognition);
  const arche = asRecord(s.archetypes ?? s.arquetipos);
  const conn = asRecord(s.connection_style ?? s.estilos_conexao_afetiva ?? s.estilos);
  const intel = asRecord(s.intelligences ?? s.inteligencias);
  const intelScores = asRecord((intel.scores as AnyRecord) || intel);

  const discKey = normDisc(
    getString(disc.primary) || getString(disc.dominant) || getString(disc.profile),
  );
  const tempKey = normTemp(getString(temp.primary) || getString(temp.dominant));
  const eneaType = normEnea(enea.type ?? enea.primary ?? enea.dominant);
  const eneaWing = getNumber(enea.wing);

  const nelloRaw =
    getString(n16.code) || getString(n16.nello16) || getString(n16.primary) || getString(n16.type);
  const nello16Code = nelloRaw ? nelloRaw.toUpperCase().slice(0, 4) : null;

  // inteligências — top 3
  const entries = Object.entries(intelScores).filter(([, v]) => typeof v === 'number') as Array<[string, number]>;
  entries.sort((a, b) => b[1] - a[1]);
  const intelligencesTop3 = entries.slice(0, 3).map(([k]) => k.replace(/_/g, ' '));
  const topIntel = intelligencesTop3[0] || null;

  // conexão afetiva — primária e secundária
  const connPrimary = getString(conn.primary) || getString(conn.dominant);
  const connSecondary = getString(conn.secondary);

  // arquétipos
  const archetypePrimary = getString(arche.primary) || getString(arche.dominant) || null;
  const archetypeSecondary = getString(arche.secondary) || null;
  const archetypeShadow = getString(arche.shadow) || null;

  const leadership: EssenceSnapshot['leadershipMode'] =
    discKey === 'D' || tempKey === 'colerico' ? 'Direção'
    : discKey === 'I' || tempKey === 'sanguineo' ? 'Conexão'
    : discKey === 'S' || tempKey === 'fleumatico' ? 'Sustentação'
    : discKey === 'C' || tempKey === 'melancolico' ? 'Critério'
    : null;

  return {
    disc: discKey,
    temperament: tempKey,
    eneagramType: eneaType,
    eneagramWing: eneaWing,
    nello16Code,
    archetypePrimary,
    archetypeSecondary,
    archetypeShadow,
    connectionStylePrimary: connPrimary,
    connectionStyleSecondary: connSecondary,
    intelligencesTop3,
    topIntelligence: topIntel,
    leadershipMode: leadership,
  };
}

// =================== Bibliotecas internas ===================

const ROLE_CONTEXT: Record<RoleCategory, string> = {
  leadership: 'na sua função de liderança',
  sales: 'no contato com cliente e nas metas do dia',
  admin: 'na rotina administrativa e financeira',
  ops: 'na operação e na rotina do dia a dia',
  marketing: 'na comunicação e na criação de conteúdo',
  unknown: 'no seu dia a dia',
};

// Eneagrama — leitura curta de "dom" e "zona de cuidado" (sem rótulo clínico)
const ENEA_DOM: Record<number, string> = {
  1: 'cuidado com o detalhe e com o que é justo',
  2: 'sensibilidade ao que o outro precisa',
  3: 'capacidade de transformar visão em entrega',
  4: 'profundidade emocional e estética própria',
  5: 'observação aguda e síntese de informação',
  6: 'lealdade e antecipação de risco',
  7: 'energia de explorar caminhos novos',
  8: 'firmeza para proteger e abrir caminho',
  9: 'capacidade de pacificar e ouvir todos os lados',
};
const ENEA_PESO: Record<number, string> = {
  1: 'cobrar perfeição de você mesma e dos outros',
  2: 'cuidar tanto que esquece de pedir ajuda',
  3: 'medir seu valor pelas entregas e cansar em silêncio',
  4: 'sentir que ninguém entende seu jeito de ver as coisas',
  5: 'isolar-se quando o ambiente fica intenso demais',
  6: 'antecipar problemas que talvez não venham',
  7: 'abrir muitas frentes e ter dificuldade de fechar',
  8: 'aparecer mais dura do que você gostaria',
  9: 'silenciar o seu próprio incômodo para manter a paz',
};

// Estilos de conexão afetiva → linguagem de cuidado profissional
function caringByStyle(style: string | null): { receive: string; give: string } | null {
  if (!style) return null;
  const k = style.toLowerCase();
  if (k.includes('palav') || k.includes('verb')) {
    return {
      receive: 'palavras de reconhecimento sinceras — um “vi seu esforço aqui” faz diferença pra você.',
      give: 'oferecendo retorno verbal claro: elogio específico, agradecimento nominal, feedback acolhedor.',
    };
  }
  if (k.includes('tempo') || k.includes('quality') || k.includes('presen')) {
    return {
      receive: 'tempo de qualidade — uma conversa sem pressa com gestor ou colega te recarrega.',
      give: 'estando presente de verdade: olhar nos olhos, escuta sem interromper, presença inteira no atendimento.',
    };
  }
  if (k.includes('servi') || k.includes('atos') || k.includes('act')) {
    return {
      receive: 'gestos práticos — quando alguém adianta uma tarefa sua, isso te chega como cuidado.',
      give: 'fazendo algo concreto pelo outro: resolver, adiantar, facilitar a vida do colega ou do cliente.',
    };
  }
  if (k.includes('toque') || k.includes('físic') || k.includes('toch') || k.includes('phys')) {
    return {
      receive: 'proximidade respeitosa — um aperto de mão firme, uma celebração com o time presente.',
      give: 'gerando proximidade simbólica: estar perto, comemorar junto, marcar o momento de quem entrega.',
    };
  }
  if (k.includes('present') || k.includes('gift') || k.includes('presen')) {
    return {
      receive: 'lembrancinhas e gestos simbólicos — algo pensado especialmente pra você.',
      give: 'lembrando datas, marcando conquistas com pequenos gestos simbólicos para clientes e colegas.',
    };
  }
  return null;
}

// Arquétipos: afinidade no atendimento ao cliente
const ARCH_FLOW: Record<string, string[]> = {
  cuidador: ['Cuidador', 'Inocente', 'Amante'],
  amante: ['Amante', 'Cuidador', 'Bobo'],
  heroi: ['Herói', 'Governante', 'Mago'],
  governante: ['Governante', 'Herói', 'Sábio'],
  sabio: ['Sábio', 'Mago', 'Explorador'],
  mago: ['Mago', 'Sábio', 'Criador'],
  explorador: ['Explorador', 'Mago', 'Bobo'],
  criador: ['Criador', 'Mago', 'Sábio'],
  bobo: ['Bobo', 'Amante', 'Explorador'],
  inocente: ['Inocente', 'Cuidador', 'Amante'],
  forajido: ['Forajido', 'Mago', 'Explorador'],
  caracomum: ['Cara-comum', 'Cuidador', 'Inocente'],
};
const ARCH_AWARENESS: Record<string, string[]> = {
  cuidador: ['Forajido', 'Governante'],
  amante: ['Sábio', 'Forajido'],
  heroi: ['Inocente', 'Bobo'],
  governante: ['Bobo', 'Forajido'],
  sabio: ['Bobo', 'Amante'],
  mago: ['Cara-comum', 'Inocente'],
  explorador: ['Governante', 'Cuidador'],
  criador: ['Cara-comum', 'Governante'],
  bobo: ['Governante', 'Sábio'],
  inocente: ['Forajido', 'Sábio'],
  forajido: ['Cuidador', 'Inocente'],
  caracomum: ['Mago', 'Criador'],
};
function archKey(name: string | null): string | null {
  if (!name) return null;
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
}

// Inteligências → como você produz/aprende
function intelligenceTip(top: string | null): string | null {
  if (!top) return null;
  const k = top.toLowerCase();
  if (k.includes('linguíst') || k.includes('lingu')) return 'Você tende a aprender e ensinar com palavras — escrever, contar histórias e explicar ajudam você a pensar.';
  if (k.includes('lógica') || k.includes('logic') || k.includes('matem')) return 'Você costuma render melhor quando há lógica, número e padrão visíveis — peça os dados antes de decidir.';
  if (k.includes('espacial') || k.includes('visual')) return 'Você processa melhor com imagem e referência visual — mood, exemplo, foto ajudam mais que descrição longa.';
  if (k.includes('corporal') || k.includes('cinest')) return 'Seu corpo participa do raciocínio — pausas, movimento e fazer com as mãos te ajudam a fechar ideias.';
  if (k.includes('musical') || k.includes('sonora')) return 'Você capta nuances de tom e ritmo — usar isso no atendimento te diferencia.';
  if (k.includes('interpess')) return 'Sua força aparece no contato humano — entrevistar, mediar, acolher.';
  if (k.includes('intrap')) return 'Você precisa de espaço de reflexão antes de decidir — proteja isso na rotina.';
  if (k.includes('natur')) return 'Você lê padrões finos no ambiente — costuma perceber coisas que outros não veem.';
  if (k.includes('exist') || k.includes('espirit')) return 'Você dá sentido às coisas — quando o trabalho conecta com propósito, sua entrega muda de patamar.';
  return null;
}

// =================== Blocos da leitura ===================

export type WorkLensBlocks = {
  // legado
  shine: string[];
  weight: string[];
  helpYou: string[];
  askTeam: string[];
  // novos
  presentation: string[];
  flourish: string[];
  clientConnection: string[];
  activePresence: { receive: string[]; give: string[] };
  clientAffinity: { flowsWith: string[]; asksAwareness: string[] };
  // cenas e liderança
  storeDayScenes: string[];
  awarenessScenes: string[];
  leadershipActions: string[]; // só preenchido se cargo = liderança
  isLeadership: boolean;
};

function buildPresentation(snap: EssenceSnapshot, ctx: string): string[] {
  const out: string[] = [];
  const lead = snap.leadershipMode ? `Modo de contribuição **${snap.leadershipMode}**` : null;
  const temp = snap.temperament ? `temperamento **${snap.temperament}**` : null;
  const enea = snap.eneagramType ? `tipo **${snap.eneagramType}** do Eneagrama` : null;
  const n16 = snap.nello16Code ? `código **${snap.nello16Code}** (Nello16)` : null;
  const arch = snap.archetypePrimary ? `arquétipo **${snap.archetypePrimary}**` : null;

  const parts = [lead, temp, enea, n16, arch].filter(Boolean) as string[];
  if (parts.length) {
    out.push(`Hoje, ${ctx}, você se apresenta como ${parts.join(' · ')}.`);
  }
  out.push('Esses são pontos de partida da sua fase atual — não rótulos fixos. Eles ajudam você (e quem trabalha com você) a se conhecer melhor.');
  return out;
}

function buildFlourish(snap: EssenceSnapshot, ctx: string): string[] {
  const out: string[] = [];
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    out.push(`Você floresce ${ctx} quando aparece um problema para resolver, uma decisão para tomar ou uma meta clara para perseguir.`);
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    out.push(`Você floresce ${ctx} quando há gente para se conectar — você cria vínculo rápido, lê o clima e traz energia para o time.`);
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    out.push(`Você floresce ${ctx} na constância: sustenta rotina, gera segurança em volta, baixa a temperatura quando o ambiente esquenta.`);
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    out.push(`Você floresce ${ctx} quando há critério, padrão e atenção ao detalhe — você enxerga o que outras pessoas não veem.`);
  }
  if (snap.eneagramType && ENEA_DOM[snap.eneagramType]) {
    out.push(`Seu dom natural neste momento aparece como: **${ENEA_DOM[snap.eneagramType]}**.`);
  }
  if (snap.archetypePrimary) {
    out.push(`Seu arquétipo de propósito hoje é **${snap.archetypePrimary}** — uma forma natural sua de contribuir e se posicionar no trabalho.`);
  }
  const it = intelligenceTip(snap.topIntelligence);
  if (it) out.push(it);
  return out;
}

function buildClientConnection(snap: EssenceSnapshot, ctx: string): string[] {
  const out: string[] = [];
  if (snap.disc === 'D' || snap.disc === 'C') {
    out.push(`No contato com o cliente ${ctx}, você tende a ser mais direta e objetiva. Isso resolve, mas pedir ao cliente como ele se sente antes de fechar costuma multiplicar sua taxa de conexão.`);
  } else if (snap.disc === 'I' || snap.disc === 'S') {
    out.push(`No contato com o cliente ${ctx}, você cria vínculo com facilidade. Seu desafio costuma ser **fechar com firmeza** sem sentir que está “forçando”.`);
  }
  if (snap.connectionStylePrimary) {
    out.push(`Seu estilo de conexão afetiva primário é **${snap.connectionStylePrimary}** — leve isso para a forma de receber o cliente: é por ali que sai o seu melhor.`);
  }
  if (snap.archetypePrimary) {
    out.push(`Como **${snap.archetypePrimary}**, você comunica uma atmosfera específica. Use isso a favor: nem todo cliente responde ao mesmo tom, e está tudo bem.`);
  }
  return out;
}

function buildActivePresence(snap: EssenceSnapshot): { receive: string[]; give: string[] } {
  const receive: string[] = [];
  const give: string[] = [];
  const primary = caringByStyle(snap.connectionStylePrimary);
  const secondary = caringByStyle(snap.connectionStyleSecondary);
  if (primary) {
    receive.push(`Você costuma se sentir cuidada por ${primary.receive}`);
    give.push(`Você costuma cuidar do outro ${primary.give}`);
  }
  if (secondary) {
    receive.push(`Em segunda linha, ${secondary.receive}`);
    give.push(`E também ${secondary.give}`);
  }
  if (!primary && !secondary) {
    receive.push('Conforme você finalizar o mapa de Estilos de Conexão Afetiva no Identity, esta leitura fica mais precisa.');
  }
  receive.push('No trabalho, dar o seu melhor também é uma forma de **amar e ser amado** — pelo cliente, pelo time e por você mesma.');
  return { receive, give };
}

function buildClientAffinity(snap: EssenceSnapshot): { flowsWith: string[]; asksAwareness: string[] } {
  const k = archKey(snap.archetypePrimary);
  if (!k || !ARCH_FLOW[k]) return { flowsWith: [], asksAwareness: [] };
  return { flowsWith: ARCH_FLOW[k] || [], asksAwareness: ARCH_AWARENESS[k] || [] };
}

function buildWeight(snap: EssenceSnapshot): string[] {
  const out: string[] = [];
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    out.push('Reuniões longas sem decisão, processos sem clareza ou pessoas que não respondem podem te tirar do eixo mais rápido do que com outras pessoas.');
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    out.push('Trabalho muito solitário, ambiente seco ou ficar muito tempo sem retorno do gestor podem te esvaziar de energia.');
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    out.push('Mudanças de regra do dia para a noite, conflito direto ou cobrança no impulso costumam pesar mais para você do que para o time.');
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    out.push('Falta de critério, instruções vagas e crítica genérica podem soar como ataque pessoal, mesmo quando não é a intenção.');
  }
  if (snap.eneagramType && ENEA_PESO[snap.eneagramType]) {
    out.push(`Sob pressão, sua zona de cuidado costuma ser **${ENEA_PESO[snap.eneagramType]}**.`);
  }
  if (snap.archetypeShadow) {
    out.push(`Quando você cansa, o lado **${snap.archetypeShadow}** do seu arquétipo pode aparecer mais — isso é fase, não defeito.`);
  }
  out.push('Nada disso é problema seu — é uma fase de funcionamento. Reconhecer ajuda você a se cuidar.');
  return out;
}

function buildHelpYou(snap: EssenceSnapshot): string[] {
  const out: string[] = [];
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    out.push('Começar o dia com 1 ou 2 prioridades claras, não com a lista inteira.');
    out.push('Combinar feedback objetivo com seu gestor, sem rodeios.');
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    out.push('Conversar com o gestor antes de tarefas longas — ajuda você a focar.');
    out.push('Ter momentos de troca com colegas ao longo do dia — você recarrega no contato.');
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    out.push('Saber com antecedência o que vai mudar na semana.');
    out.push('Ter um espaço seguro para dizer o que está incomodando antes de virar peso.');
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    out.push('Pedir o critério antes de começar (“como vocês esperam que isso fique pronto?”).');
    out.push('Usar checklist e referência visual sempre que possível.');
  }
  const it = intelligenceTip(snap.topIntelligence);
  if (it) out.push(it);
  if (snap.intelligencesTop3.length > 1) {
    out.push(`Suas três inteligências mais fortes hoje: **${snap.intelligencesTop3.join(', ')}**. Procure tarefas que ativem pelo menos uma delas todo dia.`);
  }
  return out;
}

function buildAskTeam(snap: EssenceSnapshot): string[] {
  const out: string[] = [];
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    out.push('“Quando puder, me dá a meta e o prazo — o caminho eu defino.”');
    out.push('“Se for me corrigir, fala direto. Eu prefiro saber rápido.”');
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    out.push('“Posso ter um check curto com você uma ou duas vezes por semana?”');
    out.push('“Quando algo for bem feito, me avisa — me ajuda a saber que estou no caminho.”');
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    out.push('“Quando algo for mudar, me avisa antes — eu preciso de tempo para me organizar.”');
    out.push('“Se eu estiver quieta demais, me pergunta o que estou pensando.”');
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    out.push('“Pode me mostrar um exemplo do que vocês esperam? Ajuda muito.”');
    out.push('“Quando for me dar feedback, traz um caso específico — funciona melhor para mim.”');
  }
  if (snap.connectionStylePrimary) {
    const c = caringByStyle(snap.connectionStylePrimary);
    if (c) out.push(`“Para mim, reconhecimento chega melhor por ${snap.connectionStylePrimary.toLowerCase()}.”`);
  }
  return out;
}

// =================== Cenas de loja ===================

const SALES_SCENES: Record<'D' | 'I' | 'S' | 'C', string[]> = {
  D: [
    'Quando o cliente chega decidido, você fecha rápido e bem — esse é seu momento de brilho.',
    'Já o cliente que precisa **pensar em voz alta** tende a te cansar. Combine com você mesma uma respiração antes de responder.',
    'Na devolução difícil, sua tendência é resolver no automático. Pause 5 segundos e valide o sentimento do cliente antes de explicar a regra — a venda seguinte agradece.',
    'No final do dia, em vez de fechar tudo sozinha, **delegue uma tarefa pequena** para uma colega. Você descansa e ela cresce.',
  ],
  I: [
    'Você é a primeira a notar quando alguém entra na loja sem rumo — seu sorriso já abre venda.',
    'Seu desafio costuma ser **manter o foco no fechamento** depois de criar vínculo. Um lembrete simples no balcão (“pergunta da forma de pagamento”) ajuda muito.',
    'Em dia de movimento baixo, você pode esvaziar de energia. Use esse tempo para mandar mensagem de pós-venda — você rende muito ali.',
    'Cliente bravo te abala mais do que você admite. Combine com a gestora: nesses casos, vocês trocam por 2 minutos.',
  ],
  S: [
    'Quando a fila aumenta, você é quem mantém a calma do time — isso vale ouro num dia cheio.',
    'Você costuma **silenciar incômodos** para manter o clima. Combine um momento na semana para falar o que está pesando.',
    'Em mudanças de promoção, peça que te avisem com antecedência — não no meio do expediente. Seu rendimento depende de previsibilidade.',
    'No atendimento longo, você dá segurança ao cliente. Esse é seu superpoder em peças de maior valor.',
  ],
  C: [
    'Você nota detalhes na vitrine, no estoque e no atendimento que ninguém mais vê.',
    'Não tente corrigir tudo de uma vez. Escolha **1 ponto por semana** e fale com a gestora — assim sua leitura vira melhoria de verdade.',
    'Quando o cliente faz pergunta técnica, você brilha. Quando ele quer só conversar, lembre: nem toda venda começa pelo produto.',
    'Pedir o critério antes de uma tarefa nova ("como vocês esperam que isso fique pronto?") evita retrabalho e ansiedade.',
  ],
};

const LEADERSHIP_SCENES: Record<'D' | 'I' | 'S' | 'C', string[]> = {
  D: [
    'Na abertura da loja, você já chega com a meta na cabeça. Comece a conversa do dia perguntando à equipe **como elas estão**, não só o que vão fazer.',
    'Quando uma vendedora trava num cliente difícil, sua tendência é assumir. Tente primeiro: “me conta o que você já tentou?”',
    'No fechamento do mês, você acelera. Lembre que sua equipe não acompanha seu ritmo natural — antecipe pressão com clareza, não com cobrança.',
  ],
  I: [
    'Você cria um clima leve na loja — isso é parte do seu valor como líder.',
    'Em dia de meta apertada, sua tendência é puxar a energia, mas pode esquecer o detalhe. Combine com alguém do time o controle de números do dia.',
    'Reuniões longas te cansam. Faça reuniões curtas, em pé, com 1 decisão clara cada — combina mais com você.',
  ],
  S: [
    'Sua presença estável é o que segura a equipe em mês difícil. Torne isso visível: diga em voz alta "estou aqui, vamos juntas".',
    'Conflito direto te custa — mas evitar custa mais. Combine consigo: 1 conversa difícil por semana, 15 minutos, com começo, meio e fim.',
    'Reconhecimento individual é seu canal mais forte. Marque 15 min 1:1 por semana com cada vendedora — vale mais que reunião grande.',
  ],
  C: [
    'Você enxerga padrão e melhoria que ninguém vê. Cuidado para o critério não virar **cobrança silenciosa** — verbalize o que está bom também.',
    'Quando trouxer um padrão novo, mostre o **exemplo bom e o exemplo a evitar**. Sua equipe aprende muito mais com referência visual do que com regra escrita.',
    'Feedback genérico não funciona com você nem para você. Use casos concretos: "naquela venda de quinta, quando você fez X..."',
  ],
};

const ADMIN_OPS_SCENES: string[] = [
  'No início do dia, separe 10 minutos para alinhar prioridades antes de abrir o sistema.',
  'Quando a equipe da loja te procura no meio de uma tarefa, combine um sinal: "me dá 5 min e eu te respondo certinho".',
  'Erro de sistema ou divergência de caixa pesa mais em quem tem perfil de critério — peça apoio antes de virar sobrecarga.',
];

function buildStoreDayScenes(snap: EssenceSnapshot, role: RoleCategory): string[] {
  const key = (snap.disc || (
    snap.temperament === 'colerico' ? 'D'
    : snap.temperament === 'sanguineo' ? 'I'
    : snap.temperament === 'fleumatico' ? 'S'
    : snap.temperament === 'melancolico' ? 'C'
    : null
  )) as 'D' | 'I' | 'S' | 'C' | null;

  if (!key) return [];
  if (role === 'leadership') return LEADERSHIP_SCENES[key];
  if (role === 'admin' || role === 'ops') return [...ADMIN_OPS_SCENES, ...SALES_SCENES[key].slice(0, 1)];
  return SALES_SCENES[key];
}

function buildAwarenessScenes(snap: EssenceSnapshot, _role: RoleCategory): string[] {
  const out: string[] = [];
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    out.push('**Devolução difícil com cliente irritado** → respira, valida o que ele sente antes de explicar a regra.');
    out.push('**Reunião rápida no início do dia** → escreva 1 ou 2 prioridades suas no celular antes de começar.');
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    out.push('**Final de mês com pressão de meta** → combine com a gestora um check de 5 min, não uma cobrança longa.');
    out.push('**Cliente silencioso ou frio** → em vez de forçar conversa, ofereça uma escolha simples ("prefere ver primeiro X ou Y?").');
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    out.push('**Mudança de promoção sem aviso** → peça por escrito antes do turno; isso protege seu rendimento, não é resistência.');
    out.push('**Conflito entre colegas** → você quer pacificar, mas às vezes precisa só escutar. Não carregue o que não é seu.');
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    out.push('**Tarefa nova sem critério claro** → pergunte um exemplo do que se espera antes de começar.');
    out.push('**Crítica genérica** → peça um caso concreto. Você processa muito melhor com exemplo do que com adjetivo.');
  }
  out.push('Lembre: cada cena é uma **fase de funcionamento**, não a sua definição.');
  return out;
}

// =================== Ações de liderança ===================

function buildLeadershipActions(snap: EssenceSnapshot): string[] {
  const out: string[] = [];
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    out.push('**Feedback:** comece pelo ponto direto, mas pergunte *"faz sentido pra você?"* antes de fechar a conversa.');
    out.push('**Delegação:** em vez de assumir a venda difícil, delegue com confiança e fique por perto. Sua equipe cresce assim.');
    out.push('**Reconhecimento:** você costuma esquecer de elogiar o que já é "obrigação". Reserve 2 elogios específicos por dia.');
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    out.push('**Reunião de segunda:** comece pela energia da equipe antes da meta — você lê clima como ninguém, use isso.');
    out.push('**Reconhecimento:** crie um pequeno ritual semanal de elogio nominal. Funciona muito com quem você lidera.');
    out.push('**Decisão difícil:** evite decidir só pelo afeto — peça um número antes de fechar.');
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    out.push('**Conversa difícil:** marque 15 min, com horário definido. Conversa curta com começo e fim te custa menos do que adiar.');
    out.push('**1:1 semanal:** marque 15 min individuais com cada pessoa. É o seu canal mais forte de cuidado.');
    out.push('**Mudança importante:** comunique com antecedência E por escrito — sua equipe te imita: ela também precisa de previsibilidade.');
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    out.push('**Treinamento:** mostre o exemplo bom **e** o exemplo a evitar. Referência visual ensina mais do que regra escrita.');
    out.push('**Feedback positivo:** verbalize o que está bom. Para o time, seu silêncio costuma ser interpretado como insatisfação.');
    out.push('**Padrão novo:** introduza 1 mudança por vez. Sobrecarga de critério desmotiva mesmo perfis dedicados.');
  }
  return out;
}

export function buildWorkLens(snap: EssenceSnapshot, jobTitle: string | null): WorkLensBlocks {
  const role = categorizeRole(jobTitle);
  const ctx = ROLE_CONTEXT[role];
  const isLeadership = role === 'leadership';

  const flourish = buildFlourish(snap, ctx);
  const weight = buildWeight(snap);
  const helpYou = buildHelpYou(snap);
  const askTeam = buildAskTeam(snap);
  const leadershipActions = isLeadership ? buildLeadershipActions(snap) : [];

  return {
    presentation: buildPresentation(snap, ctx),
    flourish,
    clientConnection: buildClientConnection(snap, ctx),
    activePresence: buildActivePresence(snap),
    clientAffinity: buildClientAffinity(snap),
    storeDayScenes: buildStoreDayScenes(snap, role),
    awarenessScenes: buildAwarenessScenes(snap, role),
    leadershipActions,
    isLeadership,
    weight,
    helpYou,
    askTeam,
    // legado: shine espelha flourish para qualquer consumidor antigo
    shine: flourish,
  };
}

// =================== Aba "Minha equipe" ===================

export type TeammateConnect = {
  openConversation: string;
  showCare: string;
  avoidEarly: string;
  bridge: string;
  managementTip?: string;
};

function managementTipFor(other: EssenceSnapshot, otherFirstName?: string): string {
  const name = otherFirstName ? `Com ${otherFirstName}` : 'Com ela';
  if (other.disc === 'D' || other.temperament === 'colerico')
    return `${name}, dê **objetivo claro + prazo + autonomia**. Evite microgerenciar — peça resultado, não passo a passo.`;
  if (other.disc === 'I' || other.temperament === 'sanguineo')
    return `${name}, abra a delegação pelo "porquê" e reconheça publicamente quando ela entrega. Cobre métrica de forma leve, em conversa.`;
  if (other.disc === 'S' || other.temperament === 'fleumatico')
    return `${name}, evite delegar tarefa nova de última hora. Combine na sexta o que vem na segunda — ela rende muito mais com previsibilidade.`;
  if (other.disc === 'C' || other.temperament === 'melancolico')
    return `${name}, traga o critério escrito ou um exemplo visual antes de pedir a tarefa. Feedback dela merece ser ouvido — costuma ser preciso.`;
  return `${name}, comece pequeno: 1 tarefa combinada de cada vez, com retorno curto no fim do dia.`;
}

export function buildTeammateDeepConnect(
  other: EssenceSnapshot,
  self?: EssenceSnapshot | null,
  opts?: { selfIsLeadership?: boolean; otherFirstName?: string },
): TeammateConnect {
  // Como abrir conversa
  let openConversation = 'Comece pelo dia a dia, sem pressa.';
  if (other.disc === 'D' || other.temperament === 'colerico')
    openConversation = 'Vá direto ao ponto — diga o que você precisa e o prazo. Ela responde melhor a clareza.';
  else if (other.disc === 'I' || other.temperament === 'sanguineo')
    openConversation = 'Abra pelo lado humano: cumprimento, um “como você está?” real antes da tarefa.';
  else if (other.disc === 'S' || other.temperament === 'fleumatico')
    openConversation = 'Fale com calma e dê tempo para ela responder — silêncio dela não é desinteresse.';
  else if (other.disc === 'C' || other.temperament === 'melancolico')
    openConversation = 'Traga referência ou exemplo do que se espera — clareza de critério acolhe esse perfil.';

  // Como demonstrar cuidado (estilo de conexão afetiva)
  let showCare = 'Reconheça o esforço dela com palavras simples e sinceras.';
  const c = caringByStyle(other.connectionStylePrimary);
  if (c) showCare = `Cuide dela ${c.give}`;

  // O que evitar
  let avoidEarly = 'Evite julgamentos rápidos sobre o jeito dela.';
  if (other.eneagramType && ENEA_PESO[other.eneagramType]) {
    avoidEarly = `Evite tocar de cara em pontos que ativem ${ENEA_PESO[other.eneagramType]}. Construa confiança primeiro.`;
  } else if (other.archetypeShadow) {
    avoidEarly = `Em momentos de cansaço, ela pode aparecer mais ${other.archetypeShadow.toLowerCase()} — não trate como definição dela.`;
  }

  // Ponte natural com você
  let bridge = 'Com convivência, a forma natural de vocês se complementarem aparece.';
  if (self?.archetypePrimary && other.archetypePrimary) {
    bridge = `Seu **${self.archetypePrimary}** com o **${other.archetypePrimary}** dela costuma criar uma ponte natural quando ambas respeitam o ritmo da outra.`;
  } else if (self?.disc && other.disc) {
    bridge = `Seu perfil **${self.disc}** com o **${other.disc}** dela funciona melhor quando vocês combinam, no início da semana, o que cada uma precisa para render bem.`;
  }

  const managementTip = opts?.selfIsLeadership
    ? managementTipFor(other, opts.otherFirstName)
    : undefined;

  return { openConversation, showCare, avoidEarly, bridge, managementTip };
}

// =================== Leitura cruzada Gestor ↔ Colaboradora ===================

export type LeaderOneOnOneLens = {
  bridge: string;        // onde o jeito de vocês se encontra
  friction: string;      // onde o seu jeito naturalmente colide com o dela
  adaptPresence: string[]; // 2-3 ajustes concretos de presença
  howFeedback: string;   // feedback cruzado: seu DISC + estilo de conexão dela
  howRecognize: string;  // como reconhecer/cuidar usando o estilo dela filtrado pelo seu
};

const DISC_LABEL: Record<'D' | 'I' | 'S' | 'C', string> = {
  D: 'direção e ritmo rápido',
  I: 'vínculo e energia',
  S: 'constância e cuidado estável',
  C: 'critério e precisão',
};

function discBridgeNote(self: 'D' | 'I' | 'S' | 'C', other: 'D' | 'I' | 'S' | 'C'): string {
  if (self === other) {
    return `Vocês duas funcionam por ${DISC_LABEL[self]}. Isso facilita entender, mas pode amplificar pontos cegos comuns — combine quem segura o lado oposto.`;
  }
  // pares clássicos
  const pair = `${self}${other}`;
  switch (pair) {
    case 'DI': case 'ID':
      return 'Você (direção) com ela (vínculo) formam um par natural: você abre caminho, ela abre porta com cliente. A ponte aparece quando você freia 1 instante para ela contar como leu o ambiente.';
    case 'DS': case 'SD':
      return 'Seu ritmo (rápido, decidido) é muito mais alto que o dela (estável, cuidadosa). A ponte é dar **previsibilidade**: ela rende o seu melhor sabendo o que vem antes de acontecer.';
    case 'DC': case 'CD':
      return 'Vocês têm objetivo em comum (entrega), mas caminhos opostos: você quer rápido, ela quer certo. A ponte é combinar **o critério antes**, não corrigir depois.';
    case 'IS': case 'SI':
      return 'Vocês têm o eixo do cuidado em comum — você no calor, ela na constância. A ponte é você não confundir o silêncio dela com desinteresse.';
    case 'IC': case 'CI':
      return 'Sua energia abre a sala; o critério dela ancora a entrega. A ponte é você trazer a ideia, e dar a ela tempo de revisar antes de decidir junto.';
    case 'SC': case 'CS':
      return 'Vocês compartilham o cuidado e a profundidade. A ponte é não deixar nenhuma das duas silenciar incômodo — combinem 1 momento na semana só para falar o que está pesando.';
    default:
      return 'Com convivência, a forma natural de vocês se complementarem aparece.';
  }
}

function discFrictionNote(self: 'D' | 'I' | 'S' | 'C', other: 'D' | 'I' | 'S' | 'C'): string {
  if (self === 'D' && (other === 'S' || other === 'C'))
    return 'Seu ritmo direto pode chegar como **pressão** ou **dureza** pra ela, mesmo que essa não seja sua intenção. O que pra você é eficiência, pra ela pode soar como falta de cuidado.';
  if (self === 'D' && other === 'I')
    return 'Você tende a cortar a conversa pra ir ao ponto — e ela precisa do vínculo antes do tema. Quando você atropela isso, ela perde energia.';
  if (self === 'I' && (other === 'C' || other === 'S'))
    return 'Sua energia alta e o jeito espontâneo podem invadir o espaço dela de processar. Ela pode ficar quieta — não é desinteresse, é **excesso de estímulo**.';
  if (self === 'S' && (other === 'D' || other === 'I'))
    return 'Sua tendência de evitar atrito pode atrasar uma conversa difícil que ela já está pedindo. Para ela, falta de retorno costuma pesar mais que feedback duro.';
  if (self === 'C' && (other === 'I' || other === 'D'))
    return 'Seu olhar de critério pode ser lido como **insatisfação silenciosa**. Quando você só aponta o que falta, ela ouve "nunca está bom".';
  if (self === other)
    return 'Por funcionarem parecido, vocês podem reforçar o mesmo ponto cego — combinem quem traz a perspectiva oposta nas decisões.';
  return 'Quando vocês cansam, cada uma volta para o seu modo natural — e o que era complementar vira atrito. Pausa breve resolve a maioria.';
}

function adaptPresenceFor(self: 'D' | 'I' | 'S' | 'C', other: EssenceSnapshot): string[] {
  const out: string[] = [];
  const otherDisc = other.disc;
  // Foco: o que VOCÊ (líder) precisa fazer diferente do seu padrão natural
  if (self === 'D') {
    if (otherDisc === 'S' || otherDisc === 'C')
      out.push('**Desacelere o início** da conversa: 30 segundos de "como você está hoje?" reais, antes do tema.');
    if (otherDisc === 'I')
      out.push('**Abra pelo vínculo**, não pela tarefa. Pergunte de uma venda boa da semana antes de pedir a próxima.');
    out.push('**Antes de corrigir, pergunte**: "me conta o que você já tentou?" — isso devolve protagonismo a ela.');
    out.push('Troque "faz isso" por "como você faria isso?" — vai parecer pequeno pra você, mas muda o como ela escuta.');
  } else if (self === 'I') {
    if (otherDisc === 'C' || otherDisc === 'S')
      out.push('**Baixe o volume e o ritmo**. Dê espaço de silêncio depois de perguntar — ela precisa de tempo para pensar.');
    out.push('**Traga 1 dado concreto** quando for elogiar ou cobrar — sua energia já chega, a precisão é o que ela guarda.');
    out.push('Resista à tentação de **decidir no impulso da conversa**. Combine: "vou pensar e te respondo amanhã."');
  } else if (self === 'S') {
    if (otherDisc === 'D')
      out.push('**Seja mais direta** do que seu instinto pede. Para ela, rodeio é falta de respeito ao tempo.');
    if (otherDisc === 'I')
      out.push('Marque **conversa curta com horário definido** — evita que vocês duas posterguem o tema.');
    out.push('**Não silencie incômodo seu**. Sua equipe te imita: se você adia, ela também adia.');
    out.push('Comece pelo ponto difícil e termine pelo cuidado — não o contrário.');
  } else if (self === 'C') {
    if (otherDisc === 'I')
      out.push('**Verbalize o que está bom** antes de apontar o que pode melhorar. Para ela, seu silêncio = insatisfação.');
    if (otherDisc === 'S')
      out.push('Traga **1 melhoria por vez**, não a lista inteira. Sobrecarga de critério apaga mesmo quem é dedicada.');
    out.push('**Use exemplo concreto** ("naquela venda de quinta..."): seu jeito analítico precisa virar caso para ela aproveitar.');
    out.push('Cuidado para o critério não virar **régua silenciosa**. Diga em voz alta o que você está observando.');
  }
  return out.slice(0, 3);
}

function howFeedbackFor(self: 'D' | 'I' | 'S' | 'C', other: EssenceSnapshot): string {
  const otherStyle = (other.connectionStylePrimary || '').toLowerCase();
  const otherDisc = other.disc;
  const wantsWords = otherStyle.includes('palav') || otherStyle.includes('verb');
  const wantsTime = otherStyle.includes('tempo') || otherStyle.includes('presen');
  const wantsActs = otherStyle.includes('servi') || otherStyle.includes('atos') || otherStyle.includes('act');

  let base = '';
  if (self === 'D')
    base = 'Você é direta — bom. Mas para ela, comece pelo **fato**, não pelo julgamento ("vi que na venda X aconteceu Y") e termine perguntando "como você viu isso?".';
  else if (self === 'I')
    base = 'Você naturalmente suaviza tudo. Para o feedback funcionar, **nomeie o ponto com clareza** uma vez, sem 5 elogios envolvendo, e depois sim acolha.';
  else if (self === 'S')
    base = 'Você adia o desconforto. Marque **horário curto e definido** (15 min), e abra direto: "vamos falar de uma coisa que precisa ajuste."';
  else
    base = 'Você tende a listar tudo o que viu. Para ela funcionar, escolha **1 ponto por conversa** com 1 exemplo concreto — não a auditoria.';

  // ajuste pelo estilo de conexão dela
  if (wantsWords) base += ' Use **palavras nominais e específicas** ("foi muito bom como você...") — é assim que reconhecimento chega nela.';
  else if (wantsTime) base += ' Faça presencial, com tempo dedicado — não no corredor, não por mensagem.';
  else if (wantsActs) base += ' Combine no mesmo encontro **um próximo passo concreto** — ela ouve o cuidado pelo gesto que vem depois.';

  // ajuste pelo DISC dela
  if (otherDisc === 'S' || otherDisc === 'C')
    base += ' Dê espaço para ela processar — a resposta dela talvez chegue no dia seguinte, não na hora.';
  return base;
}

function howRecognizeFor(self: 'D' | 'I' | 'S' | 'C', other: EssenceSnapshot, otherName: string): string {
  const otherStyle = (other.connectionStylePrimary || '').toLowerCase();
  const c = caringByStyle(other.connectionStylePrimary);
  const baseGive = c
    ? c.give
    : 'reconhecendo o esforço dela com palavras simples e sinceras.';

  let leaderPiece = '';
  if (self === 'D')
    leaderPiece = `Para você (que costuma esquecer de elogiar o que "já é obrigação"), reserve um momento na semana para falar com ${otherName} sobre algo específico que ela fez bem.`;
  else if (self === 'I')
    leaderPiece = `Você reconhece com naturalidade — só cuide para o elogio sair **nominal e específico**, não genérico ("equipe arrasou").`;
  else if (self === 'S')
    leaderPiece = `Seu canal mais forte é o 1:1. Marque 15 min individuais com ${otherName} por semana — é onde seu cuidado chega inteiro.`;
  else
    leaderPiece = `Você tende a só falar quando há ajuste. Faça o caminho contrário também: nomeie em voz alta o que ela faz bem, com a mesma precisão com que aponta o que falta.`;

  return `${leaderPiece} O canal dela é cuidado ${baseGive}`;
}

export function buildLeaderOneOnOneLens(
  self: EssenceSnapshot,
  other: EssenceSnapshot,
  otherFirstName: string,
): LeaderOneOnOneLens | null {
  if (!self.disc || !other.disc) return null; // precisa pelo menos do DISC dos dois
  return {
    bridge: discBridgeNote(self.disc, other.disc),
    friction: discFrictionNote(self.disc, other.disc),
    adaptPresence: adaptPresenceFor(self.disc, other),
    howFeedback: howFeedbackFor(self.disc, other),
    howRecognize: howRecognizeFor(self.disc, other, otherFirstName),
  };
}

// Frase curta legada (mantida para compatibilidade com chamadas existentes)
export function buildConnectFrase(otherFirstName: string, snap: EssenceSnapshot): string {
  if (snap.disc === 'D' || snap.temperament === 'colerico')
    return `${otherFirstName} tende a funcionar melhor quando você vai direto ao ponto, com objetivo claro e prazo.`;
  if (snap.disc === 'I' || snap.temperament === 'sanguineo')
    return `${otherFirstName} responde bem a vínculo e reconhecimento — abra a conversa pelo lado humano antes de entrar na tarefa.`;
  if (snap.disc === 'S' || snap.temperament === 'fleumatico')
    return `${otherFirstName} costuma render mais com previsibilidade — fale com calma e dê tempo para ela processar.`;
  if (snap.disc === 'C' || snap.temperament === 'melancolico')
    return `${otherFirstName} aprecia clareza e critério — traga referência do que se espera e dê espaço para perguntas.`;
  return `${otherFirstName} ainda está construindo o Código dela. Por enquanto, se conectem pelo dia a dia.`;
}

