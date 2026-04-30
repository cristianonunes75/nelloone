/**
 * Lente pessoal: gera, a partir do mapa_essencia.sections (essence_visual_data)
 * e do cargo da colaboradora, uma leitura "fase, não identidade" para a aba
 * "No trabalho" do BusinessMySpace.
 *
 * Tudo na 2ª pessoa, sem rótulo definitivo, sem termo clínico.
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

export type DiscKey = 'D' | 'I' | 'S' | 'C' | null;
export type TempKey = 'sanguineo' | 'colerico' | 'melancolico' | 'fleumatico' | null;

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

export type EssenceSnapshot = {
  disc: DiscKey;
  temperament: TempKey;
  archetypePrimary: string | null;
  connectionStyle: string | null;
  topIntelligence: string | null;
  leadershipMode: 'Direção' | 'Conexão' | 'Sustentação' | 'Critério' | null;
};

export function extractEssenceSnapshot(sections: unknown): EssenceSnapshot {
  const s = asRecord(sections);
  const disc = asRecord(s.disc);
  const temp = asRecord(s.temperament);
  const arche = asRecord(s.archetypes);
  const conn = asRecord(s.connection_style);
  const intel = asRecord(s.intelligences);
  const intelScores = asRecord((intel.scores as AnyRecord) || intel);

  const discKey = normDisc(
    getString(disc.primary) || getString(disc.dominant) || getString(disc.profile),
  );
  const tempKey = normTemp(getString(temp.primary) || getString(temp.dominant));

  let topIntel: string | null = null;
  const entries = Object.entries(intelScores).filter(([, v]) => typeof v === 'number') as Array<[string, number]>;
  if (entries.length) {
    entries.sort((a, b) => b[1] - a[1]);
    topIntel = entries[0][0].replace(/_/g, ' ');
  }

  const leadership: EssenceSnapshot['leadershipMode'] =
    discKey === 'D' || tempKey === 'colerico' ? 'Direção'
    : discKey === 'I' || tempKey === 'sanguineo' ? 'Conexão'
    : discKey === 'S' || tempKey === 'fleumatico' ? 'Sustentação'
    : discKey === 'C' || tempKey === 'melancolico' ? 'Critério'
    : null;

  return {
    disc: discKey,
    temperament: tempKey,
    archetypePrimary: getString(arche.primary) || null,
    connectionStyle: getString(conn.primary) || null,
    topIntelligence: topIntel,
    leadershipMode: leadership,
  };
}

// ======== Geradores dos 4 blocos ("você") ========

const ROLE_CONTEXT: Record<RoleCategory, string> = {
  leadership: 'na sua função de liderança',
  sales: 'no contato com cliente e nas metas do dia',
  admin: 'na rotina administrativa e financeira',
  ops: 'na operação e na rotina do dia a dia',
  marketing: 'na comunicação e na criação de conteúdo',
  unknown: 'no seu dia a dia',
};

export type WorkLensBlocks = {
  shine: string[];
  weight: string[];
  helpYou: string[];
  askTeam: string[];
};

export function buildWorkLens(snap: EssenceSnapshot, jobTitle: string | null): WorkLensBlocks {
  const role = categorizeRole(jobTitle);
  const ctx = ROLE_CONTEXT[role];
  const blocks: WorkLensBlocks = { shine: [], weight: [], helpYou: [], askTeam: [] };

  // ---- Onde você brilha ----
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    blocks.shine.push(`Hoje, você tende a brilhar quando ${ctx} aparece um problema para resolver, uma decisão para tomar ou uma meta clara para perseguir.`);
    blocks.shine.push('Costuma ter facilidade para cortar caminho e fazer acontecer quando o objetivo está nítido.');
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    blocks.shine.push(`Neste momento, você se conecta com facilidade ${ctx} — cria vínculo rápido, lê o clima e traz energia para o time.`);
    blocks.shine.push('Costuma ser quem aproxima as pessoas e segura o astral nos momentos mais pesados.');
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    blocks.shine.push(`Hoje, sua força aparece ${ctx} na constância: você sustenta rotina, cuida do que precisa continuar funcionando e gera segurança em volta.`);
    blocks.shine.push('Quando o time está agitado, sua presença ajuda a baixar a temperatura.');
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    blocks.shine.push(`Neste momento, você tende a brilhar ${ctx} quando precisa de critério, padrão e atenção ao detalhe — você enxerga o que outras pessoas não veem.`);
    blocks.shine.push('Costuma ser referência de qualidade e organização.');
  } else {
    blocks.shine.push(`Você ainda está construindo seu Código completo. Conforme finalizar a jornada no Identity, esta leitura fica mais precisa para o seu dia a dia ${ctx}.`);
  }

  if (snap.archetypePrimary) {
    blocks.shine.push(`Seu arquétipo de propósito hoje aparece como **${snap.archetypePrimary}** — uma forma natural sua de contribuir e se posicionar.`);
  }

  // ---- O que pode pesar para você ----
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    blocks.weight.push('Reuniões longas sem decisão, processos sem clareza ou pessoas que não respondem podem te tirar do eixo mais rápido do que com outras pessoas.');
    blocks.weight.push('Sob pressão, você pode acelerar demais e o time pode sentir como dureza, mesmo quando sua intenção é só resolver.');
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    blocks.weight.push('Trabalho muito solitário, ambiente seco ou ficar muito tempo sem retorno do gestor podem te esvaziar de energia.');
    blocks.weight.push('Sob pressão, você pode abrir várias frentes e ter dificuldade para fechar o que começou.');
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    blocks.weight.push('Mudanças de regra do dia para a noite, conflito direto ou cobrança no impulso costumam pesar mais para você do que para o time.');
    blocks.weight.push('Sob pressão, você pode silenciar incômodos para preservar a paz, e isso acumula.');
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    blocks.weight.push('Falta de critério, instruções vagas e crítica genérica podem soar como ataque pessoal, mesmo quando não é a intenção.');
    blocks.weight.push('Sob pressão, você pode demorar a decidir esperando informação que talvez não venha.');
  }
  blocks.weight.push('Nada disso é defeito — é só uma fase de funcionamento. Reconhecer ajuda você a se cuidar.');

  // ---- O que costuma te ajudar ----
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    blocks.helpYou.push('Começar o dia com 1 ou 2 prioridades claras, não com a lista inteira.');
    blocks.helpYou.push('Combinar feedback objetivo com seu gestor, sem rodeios.');
    blocks.helpYou.push('Reservar momentos curtos de pausa real — você cansa rápido se não respira.');
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    blocks.helpYou.push('Conversar com o gestor antes de começar tarefas longas — ajuda você a focar.');
    blocks.helpYou.push('Listar as 3 entregas do dia em algum lugar visível e ir riscando.');
    blocks.helpYou.push('Ter momentos de troca com colegas ao longo do dia — você recarrega no contato.');
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    blocks.helpYou.push('Saber com antecedência o que vai mudar na semana.');
    blocks.helpYou.push('Ter um espaço seguro para dizer o que está incomodando antes de virar peso.');
    blocks.helpYou.push('Manter rotinas simples que te dão previsibilidade.');
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    blocks.helpYou.push('Pedir o critério antes de começar (“como vocês esperam que isso fique pronto?”).');
    blocks.helpYou.push('Usar checklist e referência visual sempre que possível.');
    blocks.helpYou.push('Lembrar que “bom o suficiente” entregue vale mais que “perfeito” adiado.');
  } else {
    blocks.helpYou.push('Completar sua jornada no Identity para destravar uma leitura mais específica.');
  }

  // ---- O que pedir ao time / gestor ----
  if (snap.disc === 'D' || snap.temperament === 'colerico') {
    blocks.askTeam.push('“Quando puder, me dá a meta e o prazo — o caminho eu defino.”');
    blocks.askTeam.push('“Se for me corrigir, fala direto. Eu prefiro saber rápido.”');
  } else if (snap.disc === 'I' || snap.temperament === 'sanguineo') {
    blocks.askTeam.push('“Posso ter um check curto com você uma ou duas vezes por semana?”');
    blocks.askTeam.push('“Quando algo for bem feito, me avisa — me ajuda a saber que estou no caminho.”');
  } else if (snap.disc === 'S' || snap.temperament === 'fleumatico') {
    blocks.askTeam.push('“Quando algo for mudar, me avisa antes — eu preciso de um tempo para me organizar.”');
    blocks.askTeam.push('“Se eu estiver quieta demais, me pergunta o que estou pensando. Nem sempre vou falar primeiro.”');
  } else if (snap.disc === 'C' || snap.temperament === 'melancolico') {
    blocks.askTeam.push('“Pode me mostrar um exemplo do que vocês esperam? Ajuda muito.”');
    blocks.askTeam.push('“Quando for me dar feedback, traz um caso específico — funciona melhor para mim.”');
  } else {
    blocks.askTeam.push('“Vou completar minha jornada no Identity e voltamos a conversar sobre meu funcionamento ideal.”');
  }

  return blocks;
}

// ======== Aba "Minha equipe" — frase de "como se conectar com fulana" ========

export function buildConnectFrase(otherFirstName: string, snap: EssenceSnapshot): string {
  if (snap.disc === 'D' || snap.temperament === 'colerico')
    return `${otherFirstName} tende a funcionar melhor quando você vai direto ao ponto, com objetivo claro e prazo.`;
  if (snap.disc === 'I' || snap.temperament === 'sanguineo')
    return `${otherFirstName} responde bem a vínculo e reconhecimento — abra a conversa pelo lado humano antes de entrar na tarefa.`;
  if (snap.disc === 'S' || snap.temperament === 'fleumatico')
    return `${otherFirstName} costuma render mais com previsibilidade — fale com calma e dê tempo para ela processar.`;
  if (snap.disc === 'C' || snap.temperament === 'melancolico')
    return `${otherFirstName} aprecia clareza e critério — traga referência do que se espera e dê espaço para perguntas.`;
  return `${otherFirstName} ainda está construindo o Código dela. Por enquanto, se conectar pelo dia a dia.`;
}
