import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Crown,
  Download,
  GitCompare,
  HeartHandshake,
  Network,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  UserPlus,
  X,
} from 'lucide-react';
import { useScreenPDF } from '@/hooks/useScreenPDF';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, Cell, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { useBusinessEnforcement } from '../hooks/useBusinessEnforcement';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

type JsonRecord = Record<string, unknown>;

type TeamCrossingRpc = {
  rpc: (
    name: 'get_company_identity_team_crossing',
    args: { p_company_id: string }
  ) => Promise<{ data: TeamMemberRow[] | null; error: { message: string } | null }>;
};

type TeamMemberRow = {
  user_id: string | null;
  full_name: string;
  job_title: string | null;
  department: string | null;
  business_role: string | null;
  journey_status: string | null;
  journey_completed_tests: number | null;
  has_essence_code: boolean;
  essence_visual_data: JsonRecord | null;
  available_maps: string[] | null;
  tests_data: Record<string, { result_data?: JsonRecord; completed_at?: string | null }> | null;
};

type MemberProfile = TeamMemberRow & {
  groupName: string;
  discProfile: string | null;
  discSecondary: string | null;
  discScores: Record<string, number>;
  temperamentProfile: string | null;
  temperamentSecondary: string | null;
  temperamentScores: Record<string, number>;
  archetypePrimary: string | null;
  archetypeSecondary: string | null;
  topIntelligence: string | null;
  connectionStyle: string | null;
  enneagramType: string | null;
  nello16Type: string | null;
  completeness: 'codigo_completo' | 'jornada_sem_codigo' | 'parcial';
  leadershipMode: 'Direção' | 'Conexão' | 'Sustentação' | 'Critério';
};

type DistributionItem = { key: string; label: string; count: number; percent: number; fill: string };
type RadarItem = { axis: string; value: number; fullMark: number };

const DISC_LABELS: Record<string, string> = { D: 'Dominância', I: 'Influência', S: 'Estabilidade', C: 'Conformidade' };
const TEMPERAMENT_LABELS: Record<string, string> = { sanguineo: 'Sanguíneo', colerico: 'Colérico', melancolico: 'Melancólico', fleumatico: 'Fleumático' };
const CHART_FILLS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--secondary-foreground))', 'hsl(var(--muted-foreground))'];
const MAP_LABELS: Record<string, string> = {
  disc: 'DISC',
  temperamentos: 'Temperamentos',
  eneagrama: 'Eneagrama',
  arquetipos_proposito: 'Arquétipos',
  inteligencias_multiplas: 'Inteligências',
  estilos_conexao_afetiva: 'Estilos de conexão',
  nello16: 'nello16',
};
const EXPECTED_MAPS = ['disc', 'temperamentos', 'arquetipos_proposito', 'inteligencias_multiplas', 'estilos_conexao_afetiva', 'eneagrama', 'nello16'];

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function asNumberMap(value: unknown): Record<string, number> {
  const record = asRecord(value);
  return Object.fromEntries(Object.entries(record).filter(([, v]) => typeof v === 'number')) as Record<string, number>;
}

function getString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number') return String(value);
  return null;
}

function normalizeKey(value?: string | null) {
  return value?.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
}

function normalizeDisc(value?: string | null) {
  const key = value?.trim().toUpperCase().charAt(0);
  return key && DISC_LABELS[key] ? key : null;
}

function normalizeTemperament(value?: string | null) {
  const key = normalizeKey(value);
  if (key.startsWith('sang')) return 'sanguineo';
  if (key.startsWith('col')) return 'colerico';
  if (key.startsWith('mel')) return 'melancolico';
  if (key.startsWith('fle')) return 'fleumatico';
  return key || null;
}

function testData(row: TeamMemberRow, key: string) {
  return asRecord(row.tests_data?.[key]?.result_data);
}

function visualData(row: TeamMemberRow, key: string) {
  return asRecord(row.essence_visual_data?.[key]);
}

function pickPrimaryFromObject(value: unknown) {
  const object = asRecord(value);
  return getString(object.name) || getString(object.pt) || getString(object.temperament) || getString(object.archetype) || getString(value);
}

function extractDisc(row: TeamMemberRow) {
  const visual = visualData(row, 'disc');
  const test = testData(row, 'disc');
  const primary = getString(visual.primary) || getString(visual.dominant) || getString(visual.profile) || getString(test.primary) || getString(test.dominantProfile) || getString(test.primaryProfile);
  const secondary = getString(visual.secondary) || getString(test.secondary) || getString(test.secondaryProfile);
  const scores = asNumberMap(visual.scores && Object.keys(asRecord(visual.scores)).length ? visual.scores : test.percentages || test.scores);
  return { primary: normalizeDisc(primary), secondary: normalizeDisc(secondary), scores };
}

function extractTemperament(row: TeamMemberRow) {
  const visual = visualData(row, 'temperament');
  const test = testData(row, 'temperamentos');
  const primary = getString(visual.primary) || getString(visual.dominant) || pickPrimaryFromObject(test.primary) || getString(test.dominantTemperament);
  const secondary = getString(visual.secondary) || pickPrimaryFromObject(test.secondary) || getString(test.secondaryTemperament);
  const scores = asNumberMap(visual.scores && Object.keys(asRecord(visual.scores)).length ? visual.scores : test.percentages || test.scores);
  return { primary: normalizeTemperament(primary), secondary: normalizeTemperament(secondary), scores };
}

function extractArchetypes(row: TeamMemberRow) {
  const visual = visualData(row, 'archetypes');
  const test = testData(row, 'arquetipos_proposito');
  const dominant = asRecord(test.dominantArchetypes);
  return {
    primary: getString(visual.primary) || getString(asRecord(dominant.primary).archetype) || getString(asRecord(test.primary).archetype),
    secondary: getString(visual.secondary) || getString(asRecord(dominant.secondary).archetype) || getString(asRecord(test.secondary).archetype),
  };
}

function extractTopIntelligence(row: TeamMemberRow) {
  const visual = visualData(row, 'intelligences');
  const test = testData(row, 'inteligencias_multiplas');
  const scores = asNumberMap(asRecord(visual.scores).scores || visual.scores || test.scores);
  const explicit = pickPrimaryFromObject(test.dominant) || getString(test.top1);
  if (explicit) return explicit;
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return top?.[0]?.replace(/_/g, ' ') || null;
}

function extractConnection(row: TeamMemberRow) {
  const visual = visualData(row, 'connection_style');
  const test = testData(row, 'estilos_conexao_afetiva');
  return getString(visual.primary) || pickPrimaryFromObject(test.primary) || getString(test.primary);
}

function extractNello16(row: TeamMemberRow) {
  const visual = visualData(row, 'nello16');
  const test = testData(row, 'nello16');
  return getString(visual.name) || getString(visual.type) || getString(visual.code) || getString(test.type) || getString(test.code);
}

function extractEnneagram(row: TeamMemberRow) {
  const visual = visualData(row, 'enneagram');
  const test = testData(row, 'eneagrama');
  return getString(visual.type) || getString(test.primaryType) || getString(test.type) || getString(test.primary);
}

function getLeadershipMode(profile: Pick<MemberProfile, 'discProfile' | 'temperamentProfile'>) {
  if (profile.discProfile === 'D' || profile.temperamentProfile === 'colerico') return 'Direção';
  if (profile.discProfile === 'I' || profile.temperamentProfile === 'sanguineo') return 'Conexão';
  if (profile.discProfile === 'S' || profile.temperamentProfile === 'fleumatico') return 'Sustentação';
  return 'Critério';
}

function getFirstName(name: string) {
  return name.split(' ')[0] || name;
}

function hasMap(row: MemberProfile, map: string) {
  const visualKeys: Record<string, string> = {
    disc: 'disc',
    temperamentos: 'temperament',
    arquetipos_proposito: 'archetypes',
    inteligencias_multiplas: 'intelligences',
    estilos_conexao_afetiva: 'connection_style',
    eneagrama: 'enneagram',
    nello16: 'nello16',
  };
  const visual = asRecord(row.essence_visual_data?.[visualKeys[map]]);
  if (row.has_essence_code && Object.keys(visual).length > 0) return true;
  return (row.available_maps || []).includes(map);
}

function missingMaps(row: MemberProfile) {
  return EXPECTED_MAPS.filter((map) => !hasMap(row, map));
}

function getBehaviorReading(row: MemberProfile) {
  const disc = row.discProfile;
  const temp = row.temperamentProfile;
  const first = getFirstName(row.full_name);

  if (row.journey_status === 'pending_invite') {
    return `${first} ainda não aceitou o convite da equipe. Não há Código da Essência disponível no Identity para interpretar comportamento, reações, motivadores ou pontos de desenvolvimento dentro da empresa.`;
  }

  if (disc === 'D' || temp === 'colerico') {
    return `${first} tende a entrar no ambiente com foco em solução, decisão e avanço. Quando percebe lentidão, falta de prioridade ou excesso de conversa sem encaminhamento, pode ficar mais direta, impaciente ou assumir o controle da situação. Em pressão, a reação provável é acelerar, cobrar definição e reduzir a tolerância a detalhes que pareçam secundários. Essa força é útil para metas, vendas, resolução de gargalos e momentos que exigem firmeza, mas precisa de combinados claros para que a objetividade não seja percebida pela equipe como dureza.`;
  }
  if (disc === 'I' || temp === 'sanguineo') {
    return `${first} tende a sentir o ambiente e influenciar pessoas por presença, comunicação e vínculo. Costuma reagir melhor quando percebe abertura, reconhecimento e espaço para participar. Em pressão, pode absorver o clima emocional do time, falar antes de organizar tudo, oscilar foco ou buscar validação para se sentir segura. Essa energia é valiosa em atendimento, acolhimento, relacionamento com clientes e integração da equipe, desde que acompanhada por prioridades simples, fechamento das tarefas e retorno frequente.`;
  }
  if (disc === 'S' || temp === 'fleumatico') {
    return `${first} tende a preservar estabilidade, continuidade e confiança. Geralmente prefere entender o ritmo antes de mudar, sustenta rotinas com paciência e evita conflitos desnecessários. Em pressão, pode silenciar, ceder para manter a paz, demorar a verbalizar incômodos ou travar quando mudanças chegam sem contexto. Dentro da empresa, sua contribuição aparece em constância, cuidado no atendimento, pós-venda, manutenção de processos e suporte à supervisão. Precisa de segurança, previsibilidade e espaço para dizer o que pensa antes que o desconforto acumule.`;
  }
  if (disc === 'C' || temp === 'melancolico') {
    return `${first} tende a observar, comparar, organizar e buscar o jeito certo de fazer. Pode perceber falhas que outras pessoas não veem e se incomodar com improviso, retrabalho ou ausência de padrão. Em pressão, pode ficar mais crítica, preocupada com erro, sensível a cobranças vagas ou lenta para decidir quando falta informação. Na empresa, entrega muito valor em conferência, estoque, organização, qualidade, processos e tarefas que exigem precisão. Para crescer, precisa de clareza de expectativa, checklist, referência do padrão desejado e feedback específico.`;
  }
  return `${first} ainda tem dados limitados para uma leitura profunda de comportamento atual. Use os mapas disponíveis como sinal inicial e complete a jornada para entender reações, motivações e forma de contribuição com mais segurança.`;
}

function getActionReading(row: MemberProfile) {
  const actions: string[] = [];
  if (row.discProfile === 'D') actions.push('delegue metas com indicador, prazo e liberdade para decidir o caminho');
  if (row.discProfile === 'I') actions.push('posicione em interações com cliente, relacionamento, acolhimento e apresentação de ideias');
  if (row.discProfile === 'S') actions.push('use em rotinas que exigem constância, paciência, pós-venda e manutenção da confiança');
  if (row.discProfile === 'C') actions.push('envolva em conferência, organização, estoque, padrão de atendimento e redução de erros');
  if (row.temperamentProfile === 'colerico') actions.push('evite microgerenciar; faça alinhamentos curtos e objetivos');
  if (row.temperamentProfile === 'sanguineo') actions.push('dê feedback frequente e ajude a transformar entusiasmo em execução concreta');
  if (row.temperamentProfile === 'fleumatico') actions.push('não pressione apenas no impulso; combine mudanças com antecedência');
  if (row.temperamentProfile === 'melancolico') actions.push('não deixe expectativas implícitas; documente padrões e prioridades');
  if (row.connectionStyle) actions.push(`observe que o estilo de conexão predominante (${row.connectionStyle}) influencia como ela percebe reconhecimento, confiança e pertencimento`);
  if (row.topIntelligence) actions.push(`aproveite sua inteligência predominante (${row.topIntelligence}) como porta de entrada para treinamento e evolução`);
  return actions.slice(0, 5);
}

function getGrowthReading(row: MemberProfile) {
  if (row.journey_status === 'pending_invite') return 'Neste momento, a melhor ação é concluir o acesso ao Business e autorizar o compartilhamento dos dados do Identity. Sem isso, qualquer leitura seria incompleta e injusta para a colaboradora.';
  if (row.leadershipMode === 'Direção') return 'Pode ser melhor aproveitada com pequenas frentes de responsabilidade: meta do dia, solução de gargalos, condução de uma ação comercial ou decisão operacional com prazo. O cuidado é equilibrar autonomia com escuta: combine indicadores objetivos e também peça que valide o impacto nas colegas antes de mudar o ritmo do time.';
  if (row.leadershipMode === 'Conexão') return 'Pode crescer quando sua sensibilidade ao ambiente vira ponte concreta com clientes e colegas. Funciona bem em acolhimento, vendas consultivas, reconquista de cliente, integração e comunicação interna. Para performar melhor, precisa transformar entusiasmo em execução: tarefa curta, prioridade visível, prazo e retorno sobre o que foi bem feito.';
  if (row.leadershipMode === 'Sustentação') return 'Pode evoluir como referência de constância, confiança e cuidado. É uma boa força para rotinas, atendimento contínuo, pós-venda, organização de fluxo e suporte à supervisão. Para não ficar apenas “segurando tudo”, precisa ser incentivada a se posicionar, pedir ajuda cedo e nomear incômodos antes de aceitar sobrecarga.';
  return 'Pode contribuir mais como guardiã de qualidade, organização e critério. É útil para conferir processos, reduzir erros, estruturar padrão de atendimento, cuidar de detalhes e preservar consistência. O ponto de desenvolvimento é não deixar excesso de análise, medo de errar ou perfeccionismo atrasarem decisões simples.';
}

function getRiskReading(row: MemberProfile): string[] {
  const first = getFirstName(row.full_name);
  const risks: string[] = [];
  if (row.journey_status === 'pending_invite') {
    return [`Sem dados do Identity, qualquer leitura de risco para ${first} seria suposição. Conclua o acesso para liberar essa análise.`];
  }
  if (row.discProfile === 'D' || row.temperamentProfile === 'colerico') {
    risks.push('Pode ser percebida como dura, impaciente ou autoritária quando cobra ritmo sem cuidar do tom.');
    risks.push('Tende a passar por cima de combinados quando sente que a decisão está demorando.');
    risks.push('Pode entrar em conflito com colegas mais lentas ou mais detalhistas se não houver mediação.');
  }
  if (row.discProfile === 'I' || row.temperamentProfile === 'sanguineo') {
    risks.push('Pode dispersar foco, começar várias tarefas e não fechar o que é prioridade.');
    risks.push('Tende a oscilar humor conforme o clima da equipe e a precisar de muito reconhecimento.');
    risks.push('Pode falar demais em momentos sensíveis ou compartilhar informação sem filtro.');
  }
  if (row.discProfile === 'S' || row.temperamentProfile === 'fleumatico') {
    risks.push('Pode silenciar incômodos até acumular ressentimento ou pedir desligamento sem aviso prévio.');
    risks.push('Resiste a mudanças repentinas; pode travar quando o processo muda sem explicação.');
    risks.push('Tende a aceitar sobrecarga para evitar conflito, o que afeta saúde e qualidade no longo prazo.');
  }
  if (row.discProfile === 'C' || row.temperamentProfile === 'melancolico') {
    risks.push('Perfeccionismo pode travar entregas e gerar autocrítica excessiva diante de erros.');
    risks.push('Sensível a cobranças vagas; interpreta feedback genérico como crítica pessoal.');
    risks.push('Pode adiar decisões esperando 100% de informação e atrasar respostas a clientes.');
  }
  if (row.enneagramType) {
    risks.push(`Eneagrama tipo ${row.enneagramType}: observe os gatilhos típicos desse padrão (medo central e mecanismo de defesa) em momentos de pressão.`);
  }
  if (!risks.length) {
    risks.push(`Há poucos dados sobre ${first} para mapear pontos de atenção com segurança. Use o que já existe como sinal e complete a jornada para uma leitura mais precisa.`);
  }
  return risks.slice(0, 5);
}

function getGroupSynergy(members: MemberProfile[]) {
  const strengths: string[] = [];
  const tensions: string[] = [];
  const howToWork: string[] = [];

  if (members.length < 2) {
    return { strengths, tensions, howToWork };
  }

  const names = members.map((m) => getFirstName(m.full_name));
  const namesList = names.length === 2
    ? `${names[0]} e ${names[1]}`
    : `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;

  // Distribuição de modos de liderança
  const modeCount: Record<string, string[]> = {};
  members.forEach((m) => {
    if (!m.leadershipMode) return;
    if (!modeCount[m.leadershipMode]) modeCount[m.leadershipMode] = [];
    modeCount[m.leadershipMode].push(getFirstName(m.full_name));
  });
  const modes = Object.keys(modeCount);
  const allModes = ['Direção', 'Conexão', 'Sustentação', 'Critério'];
  const missingModes = allModes.filter((mode) => !modes.includes(mode));

  if (modes.length === 1) {
    strengths.push(`${namesList} compartilham o modo "${modes[0]}", o que cria linguagem comum e velocidade de decisão.`);
    tensions.push(`O grupo tende a reforçar o mesmo ponto cego: todas reagem do mesmo jeito sob pressão. Faltam contrapontos naturais.`);
    howToWork.push(`Defina papéis distintos por área (meta, processo, cliente, qualidade) para evitar competição pela mesma decisão.`);
  } else if (modes.length === allModes.length) {
    strengths.push(`O grupo cobre os 4 modos (Direção, Conexão, Sustentação e Critério). É uma combinação completa de funcionamento.`);
    howToWork.push(`Aproveite a complementaridade: Direção decide, Conexão envolve, Sustentação executa e Critério valida. Crie um ritual semanal curto para alinhar essas frentes.`);
  } else {
    strengths.push(`O grupo combina os modos: ${modes.join(' + ')}. Há complementaridade real entre as participantes.`);
    if (missingModes.length) {
      tensions.push(`O grupo não tem ninguém em "${missingModes.join(', ')}". Cuidado com lacunas: ${missingModes.includes('Direção') ? 'pode faltar quem decide e fecha; ' : ''}${missingModes.includes('Conexão') ? 'pode faltar quem cuida do vínculo com o cliente; ' : ''}${missingModes.includes('Sustentação') ? 'pode faltar quem garante constância e rotina; ' : ''}${missingModes.includes('Critério') ? 'pode faltar quem revisa qualidade antes de entregar.' : ''}`);
    }
  }

  // Detalhe por modo presente
  Object.entries(modeCount).forEach(([mode, people]) => {
    if (people.length > 1) {
      tensions.push(`${people.join(' e ')} têm o mesmo modo (${mode}). Risco de disputa pelo mesmo papel — combinem áreas distintas.`);
    }
  });

  // Recomendações práticas por modo presente
  if (modeCount['Direção']) howToWork.push(`${modeCount['Direção'].join(' / ')} (Direção): assuma a definição de meta e prazos do grupo.`);
  if (modeCount['Conexão']) howToWork.push(`${modeCount['Conexão'].join(' / ')} (Conexão): cuide do clima do grupo e do vínculo com cliente.`);
  if (modeCount['Sustentação']) howToWork.push(`${modeCount['Sustentação'].join(' / ')} (Sustentação): garanta o passo a passo, follow-up e ritmo constante.`);
  if (modeCount['Critério']) howToWork.push(`${modeCount['Critério'].join(' / ')} (Critério): valide qualidade e padrão antes da entrega final.`);

  // Distribuição de temperamentos
  const tempSet = new Set(members.map((m) => m.temperamentProfile).filter(Boolean));
  if (tempSet.size > 1) {
    const labels = Array.from(tempSet).map((t) => TEMPERAMENT_LABELS[t as string] || t).join(', ');
    strengths.push(`Mistura de temperamentos (${labels}): equilibra emoção, ritmo e energia no grupo.`);
  } else if (tempSet.size === 1) {
    const only = Array.from(tempSet)[0];
    tensions.push(`Todas com temperamento ${TEMPERAMENT_LABELS[only as string] || only}: o grupo tende ao mesmo ritmo emocional. Atenção para não amplificar o mesmo gatilho.`);
  }

  // Estilos de conexão
  const styleSet = new Set(members.map((m) => m.connectionStyle).filter(Boolean));
  if (styleSet.size > 1) {
    howToWork.push(`Estilos de conexão diferentes no grupo (${Array.from(styleSet).join(', ')}): cada uma percebe reconhecimento e apoio de um jeito. Combinem como vão sinalizar suporte umas às outras.`);
  }

  return { strengths, tensions, howToWork };
}

const ROLE_HINTS: Array<{ test: RegExp; label: string; tone: string }> = [
  { test: /(ce[oa]|fundador|s[oó]ci|owner|diretor|head|gerente|gestor|supervisor|coordenador|l[ií]der)/i, label: 'gestão / liderança', tone: 'Como líder, sua leitura sobre o time vira decisão: contratação, alocação, feedback e clima.' },
  { test: /(vended|comerc|consultor de vendas|atend)/i, label: 'vendas / atendimento', tone: 'O foco está no cliente, na meta e no ritmo do salão/loja.' },
  { test: /(financ|administ|backoffice|fiscal|contas)/i, label: 'administrativo / financeiro', tone: 'Aqui pesa precisão, prazo e controle.' },
  { test: /(operac|estoque|log[ií]stica|produç|manuten)/i, label: 'operação / rotina', tone: 'Aqui pesa constância, processo e cuidado com o detalhe.' },
  { test: /(marketing|m[ií]dia|conte[uú]do|social)/i, label: 'marketing / comunicação', tone: 'Aqui pesa criatividade, vínculo com público e clareza de mensagem.' },
];

function describeRole(jobTitle: string | null) {
  if (!jobTitle) return null;
  const hit = ROLE_HINTS.find((r) => r.test.test(jobTitle));
  return hit ? { label: hit.label, tone: hit.tone, raw: jobTitle } : { label: jobTitle.toLowerCase(), tone: '', raw: jobTitle };
}

function getLeaderToMemberReading(leader: MemberProfile, member: MemberProfile) {
  const leaderFirst = getFirstName(leader.full_name);
  const memberFirst = getFirstName(member.full_name);
  const leaderRole = describeRole(leader.job_title);
  const memberRole = describeRole(member.job_title);

  const result = {
    accessing: '' as string,
    delegating: '' as string,
    feedback: '' as string,
    avoid: '' as string,
    roleNote: null as string | null,
    leaderNotice: null as string | null,
    memberNotice: null as string | null,
  };

  if (!leader.job_title) {
    result.leaderNotice = `Não há cargo cadastrado para ${leaderFirst}. A leitura abaixo considera apenas o perfil comportamental dela como gestora.`;
  }
  if (!member.job_title) {
    result.memberNotice = `Não há cargo cadastrado para ${memberFirst}. A leitura abaixo considera apenas o perfil comportamental, sem ajustar por função.`;
  } else if (leaderRole && memberRole) {
    result.roleNote = `${leaderFirst} (${leaderRole.raw}) acessando ${memberFirst} (${memberRole.raw}). ${leaderRole.tone} ${memberRole.tone}`.trim();
  }

  if (member.journey_status === 'pending_invite') {
    result.accessing = `${memberFirst} ainda não tem Código da Essência disponível. Por enquanto, ${leaderFirst} acessa ${memberFirst} pelo cargo e pelo histórico do dia a dia, sem leitura comportamental confirmada.`;
    result.delegating = 'Use combinados explícitos e por escrito até que o Identity esteja completo.';
    result.feedback = 'Faça check-ins curtos e observe reações para começar a mapear padrão.';
    result.avoid = 'Evite supor estilo dela com base em uma única situação — peça que conclua a jornada para liberar a leitura completa.';
    return result;
  }

  // ACCESSING — como a líder se aproxima dessa colaboradora específica
  const lDisc = leader.discProfile;
  const mDisc = member.discProfile;
  const mTemp = member.temperamentProfile;

  if (mDisc === 'D' || mTemp === 'colerico') {
    result.accessing = `${memberFirst} responde melhor a quem chega direto, com objetivo claro e respeito à autonomia dela. ${leaderFirst}, vá ao ponto: contexto curto, decisão esperada, prazo. Ela perde paciência com rodeios e preâmbulos longos.`;
    result.delegating = 'Delegue resultado, não passo a passo. Defina o quê e até quando; deixe o como com ela. Peça retorno por exceção (só se algo travar).';
    result.feedback = 'Feedback objetivo, com fato + impacto + próximo passo. Evite suavizar demais — ela interpreta como falta de clareza. Reconheça resultado, não esforço genérico.';
    result.avoid = 'Não microgerencie e não decida no lugar dela. Não chame para reuniões longas sem pauta. Não dê feedback emocional sem dado concreto.';
  } else if (mDisc === 'I' || mTemp === 'sanguineo') {
    result.accessing = `${memberFirst} responde a vínculo, presença e reconhecimento. ${leaderFirst}, abra a conversa pelo lado humano antes de entrar na tarefa. Ela rende mais quando se sente vista e parte do time.`;
    result.delegating = 'Delegue mostrando o impacto da entrega nas pessoas (cliente, equipe). Combine prioridade clara e prazo curto, porque ela tende a abrir várias frentes ao mesmo tempo.';
    result.feedback = 'Feedback frequente e específico. Reconheça em público quando puder; corrija em particular. Use exemplos concretos, evite generalizar ("você sempre…").';
    result.avoid = 'Não a deixe muito tempo sem retorno — o silêncio dela vira insegurança. Não corrija em frente à equipe. Não a coloque só em tarefa solitária e repetitiva.';
  } else if (mDisc === 'S' || mTemp === 'fleumatico') {
    result.accessing = `${memberFirst} responde a estabilidade, segurança e previsibilidade. ${leaderFirst}, fale com calma, dê contexto antes de pedir mudança e dê tempo para ela processar. Ela costuma silenciar em vez de discordar — pergunte o que está pensando.`;
    result.delegating = 'Delegue com clareza de processo e prazo realista. Mudanças bruscas travam o ritmo dela; antecipe combinados. Reforce que ela pode pedir ajuda sem julgamento.';
    result.feedback = 'Feedback em ambiente reservado, com tom firme mas acolhedor. Pergunte o que ela pensa antes de concluir. Reconheça a constância dela, não só os picos.';
    result.avoid = 'Não pressione no impulso, não mude regra do dia para a noite, não interprete o silêncio como concordância. Evite expor publicamente.';
  } else if (mDisc === 'C' || mTemp === 'melancolico') {
    result.accessing = `${memberFirst} responde a clareza, padrão e justiça. ${leaderFirst}, traga referência do que se espera ("o padrão é assim, com este nível de detalhe"). Ela precisa entender o critério antes de executar.`;
    result.delegating = 'Delegue com checklist, exemplo do resultado esperado e prazo. Evite ambiguidade. Permita perguntas — ela costuma ter muitas no início e poucas depois.';
    result.feedback = 'Feedback específico, com fato e dado. Crítica genérica é interpretada como ataque pessoal. Reconheça precisão e zelo, não só velocidade.';
    result.avoid = 'Não dê feedback vago, não mude o critério no meio do caminho, não a apresse em decisões sem informação. Cuidado com piadas sobre perfeccionismo.';
  } else {
    result.accessing = `${memberFirst} ainda tem dados parciais no Identity. ${leaderFirst}, use os mapas disponíveis como sinal e observe o dia a dia para ajustar a abordagem.`;
    result.delegating = 'Combine objetivo claro e prazo, e ajuste depois conforme o retorno dela.';
    result.feedback = 'Faça feedback frequente e curto até ter mais leitura comportamental.';
    result.avoid = 'Evite assumir estilo sem dado — peça que conclua os mapas que faltam.';
  }

  // Camada da líder — ajuste pelo perfil DELA
  if (lDisc === 'D' && (mDisc === 'S' || mDisc === 'C')) {
    result.avoid += ` Cuidado: como ${leaderFirst} é mais direta, o tom pode soar duro para ${memberFirst}. Reduza ritmo no início da conversa.`;
  }
  if (lDisc === 'I' && (mDisc === 'C' || mTemp === 'melancolico')) {
    result.avoid += ` Cuidado: o estilo mais expansivo de ${leaderFirst} pode parecer pouco estruturado para ${memberFirst}. Traga dado e exemplo, não só entusiasmo.`;
  }
  if (lDisc === 'C' && (mDisc === 'I' || mTemp === 'sanguineo')) {
    result.avoid += ` Cuidado: ${leaderFirst} tende a focar no padrão; ${memberFirst} precisa também de vínculo. Reserve espaço para conversa humana antes da correção.`;
  }
  if (lDisc === 'S' && (mDisc === 'D' || mTemp === 'colerico')) {
    result.avoid += ` Cuidado: ${leaderFirst} costuma evitar conflito; ${memberFirst} precisa de posicionamento claro. Não suavize a ponto de virar ambiguidade.`;
  }

  return result;
}

function getDataNotice(row: MemberProfile) {
  if (row.journey_status === 'pending_invite') {
    return `Não há Código da Essência disponível para ${getFirstName(row.full_name)} no Identity. Ela ainda não acessou ou aceitou o convite da equipe, por isso não há dados corporativos compartilhados.`;
  }
  const missing = missingMaps(row);
  if (!missing.length) return null;
  const missingLabels = missing.map((map) => MAP_LABELS[map] || map).join(', ');
  return `Não há informação suficiente sobre ${getFirstName(row.full_name)} em: ${missingLabels}. A leitura abaixo usa apenas ${row.available_maps?.map((map) => MAP_LABELS[map] || map).join(', ') || 'os dados disponíveis'}.`;
}

function enrichRow(row: TeamMemberRow): MemberProfile {
  const disc = extractDisc(row);
  const temperament = extractTemperament(row);
  const archetypes = extractArchetypes(row);
  const maps = row.available_maps || [];
  const completeness: MemberProfile['completeness'] = row.has_essence_code ? 'codigo_completo' : row.journey_status === 'completed' ? 'jornada_sem_codigo' : 'parcial';
  // Sempre considerar a equipe inteira como um único grupo, exceto quando o admin
  // tiver definido manualmente um departamento (e houver mais de um departamento real).
  const groupName = row.department?.trim() || 'Equipe completa';
  const base = {
    ...row,
    groupName,
    discProfile: disc.primary,
    discSecondary: disc.secondary,
    discScores: disc.scores,
    temperamentProfile: temperament.primary,
    temperamentSecondary: temperament.secondary,
    temperamentScores: temperament.scores,
    archetypePrimary: archetypes.primary,
    archetypeSecondary: archetypes.secondary,
    topIntelligence: extractTopIntelligence(row),
    connectionStyle: extractConnection(row),
    enneagramType: extractEnneagram(row),
    nello16Type: extractNello16(row),
    available_maps: maps,
    completeness,
  };
  return { ...base, leadershipMode: getLeadershipMode(base) };
}

function buildDistribution<T extends string>(rows: MemberProfile[], getter: (row: MemberProfile) => T | null, labels?: Record<string, string>): DistributionItem[] {
  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    const raw = getter(row);
    if (raw) acc[raw] = (acc[raw] || 0) + 1;
    return acc;
  }, {});
  const keys = labels ? Object.keys(labels) : Object.keys(counts);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  return keys.map((key, index) => ({
    key,
    label: labels?.[key] || key,
    count: counts[key] || 0,
    percent: total > 0 ? Math.round(((counts[key] || 0) / total) * 100) : 0,
    fill: CHART_FILLS[index % CHART_FILLS.length],
  })).filter((item) => labels || item.count > 0);
}

function rowsWithCode(rows: MemberProfile[]) {
  return rows.filter((row) => row.has_essence_code);
}

function getAverageRadar(rows: MemberProfile[], kind: 'disc' | 'temperament'): RadarItem[] {
  const labels = kind === 'disc' ? DISC_LABELS : TEMPERAMENT_LABELS;
  return Object.entries(labels).map(([key, label]) => {
    const values = rows.map((row) => kind === 'disc' ? row.discScores[key] : row.temperamentScores[key]).filter((value) => typeof value === 'number');
    const value = values.length ? Math.round(values.reduce((sum, current) => sum + current, 0) / values.length) : 0;
    return { axis: label, value, fullMark: 100 };
  });
}

function Metric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-lg border bg-background/60 p-3">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {detail && <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>}
    </div>
  );
}

function DistributionChart({ title, data }: { title: string; data: DistributionItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} formatter={(value, name, item) => [`${value} pessoa(s) · ${item.payload.percent}%`, 'Total']} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry) => <Cell key={entry.key} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamRadar({ title, data }: { title: string; data: RadarItem[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Média']} />
              <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.22} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ExecutiveSummary({ rows }: { rows: MemberProfile[] }) {
  const analyzableRows = rows.filter((row) => row.has_essence_code);
  const fullCodes = rows.filter((row) => row.has_essence_code).length;
  const partial = rows.length - fullCodes;
  const pending = rows.filter((row) => row.journey_status === 'pending_invite').length;
  const supervisor = analyzableRows.find((row) => normalizeKey(row.job_title).includes('supervisor'));
  const modes = buildDistribution(analyzableRows, (row) => row.leadershipMode);
  const topMode = [...modes].sort((a, b) => b.count - a.count)[0];
  const topDisc = [...buildDistribution(analyzableRows, (row) => row.discProfile, DISC_LABELS)].sort((a, b) => b.count - a.count)[0];
  const topTemp = [...buildDistribution(analyzableRows, (row) => row.temperamentProfile, TEMPERAMENT_LABELS)].sort((a, b) => b.count - a.count)[0];

  const summary = `A equipe mostra maior força em ${topMode?.label || 'perfis ainda indefinidos'}, com predominância comportamental em ${topDisc?.label || 'DISC parcial'} e ${topTemp?.label || 'temperamentos parciais'}. Esta leitura usa somente pessoas vinculadas à equipe e dados do Nello Identity; convites pendentes aparecem apenas como ausência de informação.`;
  const leadership = supervisor
    ? `${supervisor.full_name} foi incluída como supervisora. A leitura dela funciona como ponto de coordenação entre direção, rotina e comunicação da equipe.`
    : 'Ainda não há supervisora identificada pelo cargo; a leitura está organizada pela equipe geral.';
  const management = `Para ação na empresa, conduza a equipe cruzando três perguntas: quem acelera decisões, quem preserva constância e quem percebe detalhes. Assim você delega venda, rotina, atendimento, conferência e supervisão sem exigir que todas funcionem do mesmo jeito.`;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-5 w-5 text-primary" /> Resumo executivo da equipe</CardTitle>
        <CardDescription>Leitura estratégica para gestão, delegação e desenvolvimento humano.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-3 text-sm leading-relaxed">
          <p>{summary}</p>
          <p className="text-muted-foreground">{leadership}</p>
          <p className="text-muted-foreground">{management}</p>
          <p className="text-muted-foreground">O Identity Nello One é uma ferramenta de autoconhecimento e educação comportamental. Não substitui diagnóstico, avaliação clínica ou decisão profissional isolada.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Pessoas" value={rows.length} />
          <Metric label="Códigos completos" value={fullCodes} detail={`${partial} sem código completo · ${pending} convite(s) pendente(s)`} />
          <Metric label="Supervisão" value={supervisor ? 'Incluída' : '—'} />
          <Metric label="Força central" value={topMode?.label || '—'} />
        </div>
      </CardContent>
    </Card>
  );
}

function TeamGroups({ rows }: { rows: MemberProfile[] }) {
  const groups = Object.entries(rows.reduce<Record<string, MemberProfile[]>>((acc, row) => {
    acc[row.groupName] = [...(acc[row.groupName] || []), row];
    return acc;
  }, {}));

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {groups.map(([group, members]) => {
        const direction = members.filter((m) => m.leadershipMode === 'Direção').length;
        const sustain = members.filter((m) => m.leadershipMode === 'Sustentação').length;
        const connect = members.filter((m) => m.leadershipMode === 'Conexão').length;
        const criterion = members.filter((m) => m.leadershipMode === 'Critério').length;
        return (
          <Card key={group}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4 text-primary" /> {group}</CardTitle>
              <CardDescription>{members.length} pessoa(s) consideradas neste grupo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Metric label="Direção" value={direction} />
                <Metric label="Conexão" value={connect} />
                <Metric label="Sustentação" value={sustain} />
                <Metric label="Critério" value={criterion} />
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Como tende a funcionar:</strong> {sustain >= direction ? 'time com boa capacidade de manter rotina, atender com constância e preservar confiança.' : 'time com maior impulso de ação e decisão, útil para metas e mudanças rápidas.'}</p>
                <p><strong className="text-foreground">Gestão recomendada:</strong> combine clareza de prioridade, rituais simples de acompanhamento e delegação alinhada ao modo natural de cada pessoa.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {members.map((member) => <Badge key={member.user_id || member.full_name} variant="secondary">{member.full_name.split(' ')[0]} · {member.leadershipMode}</Badge>)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function CrossingsPanel({ rows }: { rows: MemberProfile[] }) {
  const supervisor = rows.find((row) => normalizeKey(row.job_title).includes('supervisor'));
  const others = supervisor ? rows.filter((row) => row.user_id !== supervisor.user_id) : rows;
  const complementary = others.filter((row) => row.leadershipMode !== supervisor?.leadershipMode).slice(0, 3);
  const samePattern = supervisor ? others.filter((row) => row.leadershipMode === supervisor.leadershipMode) : [];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><GitCompare className="h-4 w-4 text-primary" /> Supervisora x equipe</CardTitle>
          <CardDescription>Cruzamento empresarial inspirado na lógica de códigos do Identity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {supervisor ? (
            <>
              <p><strong>{supervisor.full_name}</strong> aparece como força de <strong>{supervisor.leadershipMode}</strong>. No papel de supervisão, isso indica como ela tende a organizar ritmo, comunicação e tomada de decisão.</p>
              <p className="text-muted-foreground">Com a equipe, o melhor uso é combinar a força dela com perfis complementares: quem sustenta rotina, quem conecta clientes e quem traz critério para detalhes.</p>
              <div className="flex flex-wrap gap-2">
                {complementary.map((member) => <Badge key={member.user_id || member.full_name} variant="outline">Complementar: {member.full_name.split(' ')[0]} · {member.leadershipMode}</Badge>)}
                {samePattern.map((member) => <Badge key={member.user_id || member.full_name} variant="secondary">Mesmo modo: {member.full_name.split(' ')[0]}</Badge>)}
              </div>
            </>
          ) : <p className="text-muted-foreground">Cadastre ou ajuste o cargo de supervisão para ativar esta leitura específica.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Network className="h-4 w-4 text-primary" /> Como extrair o melhor delas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Direção:</strong> delegue metas claras, autonomia e decisões com prazo.</p>
          <p><strong className="text-foreground">Conexão:</strong> use em atendimento, acolhimento, relacionamento e integração da equipe.</p>
          <p><strong className="text-foreground">Sustentação:</strong> posicione em rotinas, consistência, pós-venda e preservação de confiança.</p>
          <p><strong className="text-foreground">Critério:</strong> envolva em conferência, organização, qualidade, estoque e detalhes sensíveis.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function CollaboratorCard({ row }: { row: MemberProfile }) {
  const completedMaps = row.has_essence_code ? ['codigo_essencia', ...(row.available_maps || [])] : row.available_maps || [];
  const statusLabel = row.journey_status === 'pending_invite' ? 'Convite pendente' : row.completeness === 'codigo_completo' ? 'Código completo' : row.completeness === 'jornada_sem_codigo' ? 'Jornada completa' : 'Dados parciais';
  const dataNotice = getDataNotice(row);
  const actionItems = getActionReading(row);

  return (
    <Card className={row.journey_status === 'pending_invite' ? 'border-dashed' : undefined}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{row.full_name}</CardTitle>
            <CardDescription>{[row.job_title, row.groupName].filter(Boolean).join(' · ')}</CardDescription>
          </div>
          <Badge variant={row.has_essence_code ? 'secondary' : 'outline'} className="gap-1"><CheckCircle2 className="h-3 w-3" /> {statusLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoTile label="DISC" value={row.discProfile ? DISC_LABELS[row.discProfile] : 'Não mapeado'} detail={row.discSecondary ? `Secundário: ${DISC_LABELS[row.discSecondary]}` : undefined} />
          <InfoTile label="Temperamento" value={row.temperamentProfile ? TEMPERAMENT_LABELS[row.temperamentProfile] : 'Não mapeado'} detail={row.temperamentSecondary ? `Secundário: ${TEMPERAMENT_LABELS[row.temperamentSecondary]}` : undefined} />
          <InfoTile label="Arquétipo" value={row.archetypePrimary || 'Não mapeado'} detail={row.archetypeSecondary ? `Apoio: ${row.archetypeSecondary}` : undefined} />
          <InfoTile label="Modo de contribuição" value={row.leadershipMode} detail={row.topIntelligence || undefined} />
          <InfoTile label="Estilo de conexão" value={row.connectionStyle || 'Não mapeado'} />
          <InfoTile label="Eneagrama / nello16" value={[row.enneagramType && `E${row.enneagramType}`, row.nello16Type].filter(Boolean).join(' · ') || 'Não mapeado'} />
        </div>
        {dataNotice && (
          <div className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{dataNotice}</span>
          </div>
        )}
        <div className="grid gap-3 lg:grid-cols-2">
          <ReadingBlock icon={HeartHandshake} title="Como ela tende a agir e reagir" text={getBehaviorReading(row)} />
          <ReadingBlock icon={Target} title="Como ela pode ser melhor na empresa" text={getGrowthReading(row)} />
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><AlertCircle className="h-4 w-4 text-amber-600" /> Pontos de atenção para o empreendedor</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {getRiskReading(row).map((item) => <li key={item} className="leading-relaxed">• {item}</li>)}
            </ul>
          </div>
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><ClipboardCheck className="h-4 w-4 text-primary" /> Ações de gestão</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {actionItems.map((item) => <li key={item} className="leading-relaxed">• {item}</li>)}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {completedMaps.map((map) => <Badge key={map} variant="outline">{map === 'codigo_essencia' ? 'Código da Essência' : MAP_LABELS[map] || map}</Badge>)}
        </div>
      </CardContent>
    </Card>
  );
}

function ReadingBlock({ icon: Icon, title, text }: { icon: typeof HeartHandshake; title: string; text: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><Icon className="h-4 w-4 text-primary" /> {title}</div>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function InfoTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}

function OneOnOneCard({ leader, member }: { leader: MemberProfile; member: MemberProfile }) {
  const reading = getLeaderToMemberReading(leader, member);
  return (
    <Card className={member.journey_status === 'pending_invite' ? 'border-dashed' : undefined}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{getFirstName(leader.full_name)} → {member.full_name}</CardTitle>
            <CardDescription>
              {[member.job_title || 'Sem cargo cadastrado', member.leadershipMode].filter(Boolean).join(' · ')}
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            {member.discProfile ? `DISC ${member.discProfile}` : 'Sem DISC'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {(reading.leaderNotice || reading.memberNotice) && (
          <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
            {reading.leaderNotice && <p className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {reading.leaderNotice}</p>}
            {reading.memberNotice && <p className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {reading.memberNotice}</p>}
          </div>
        )}
        {reading.roleNote && (
          <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Cargo no cruzamento: </span>{reading.roleNote}
          </div>
        )}
        <ReadingBlock icon={HeartHandshake} title="Como acessar" text={reading.accessing} />
        <div className="grid gap-3 lg:grid-cols-2">
          <ReadingBlock icon={Target} title="Como delegar" text={reading.delegating} />
          <ReadingBlock icon={ClipboardCheck} title="Como dar feedback" text={reading.feedback} />
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
            <AlertCircle className="h-4 w-4 text-amber-600" /> O que evitar
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{reading.avoid}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LeadershipOneOnOne({ rows }: { rows: MemberProfile[] }) {
  const eligible = rows.filter((r) => r.user_id || r.full_name);
  const keyOf = (r: MemberProfile) => r.user_id || r.full_name;
  const [leaderKey, setLeaderKey] = useState<string>(() => {
    const presumed = eligible.find((r) => /(ce[oa]|fundador|s[oó]ci|owner|diretor|head|gerente|gestor|supervisor|coordenador|l[ií]der)/i.test(r.job_title || '') || r.business_role === 'company_admin' || r.business_role === 'super_admin');
    return presumed ? keyOf(presumed) : (eligible[0] ? keyOf(eligible[0]) : '');
  });

  const leader = eligible.find((r) => keyOf(r) === leaderKey);
  const liderados = eligible.filter((r) => keyOf(r) !== leaderKey);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Crown className="h-4 w-4 text-primary" /> Quem está liderando?</CardTitle>
          <CardDescription>Escolha a gestora (Lisa, você ou outra liderança). O sistema gera uma leitura individual de como ela acessa cada uma das outras colaboradoras, considerando perfil + cargo cadastrado em company_users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:max-w-md">
            <Select value={leaderKey} onValueChange={setLeaderKey}>
              <SelectTrigger><SelectValue placeholder="Selecionar gestora" /></SelectTrigger>
              <SelectContent>
                {eligible.map((r) => (
                  <SelectItem key={keyOf(r)} value={keyOf(r)}>
                    {r.full_name}{r.job_title ? ` · ${r.job_title}` : ' · sem cargo'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {leader && !leader.job_title && (
            <div className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Não há cargo cadastrado para <strong>{leader.full_name}</strong> em company_users. A leitura usará apenas o perfil comportamental. Cadastre o cargo (ex: "Gerente", "CEO", "Supervisora") para refinar a análise gestor → liderado.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {leader && (
        <div className="grid gap-4 xl:grid-cols-2">
          {liderados.map((m) => (
            <OneOnOneCard key={keyOf(m)} leader={leader} member={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupBuilder({ rows }: { rows: MemberProfile[] }) {
  const eligible = rows.filter((row) => row.journey_status !== 'pending_invite');
  const keyOf = (row: MemberProfile) => row.user_id || row.full_name;

  const [selected, setSelected] = useState<string[]>([]);
  const [leaderKey, setLeaderKey] = useState<string>('');
  const [groups, setGroups] = useState<Array<{ id: string; memberKeys: string[]; leaderKey: string | null }>>([]);

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      if (!next.includes(leaderKey)) setLeaderKey('');
      return next;
    });
  };

  const selectAll = () => setSelected(eligible.map(keyOf));
  const clearSelection = () => { setSelected([]); setLeaderKey(''); };

  const buildGroup = () => {
    if (selected.length < 2) {
      toast.error('Selecione pelo menos duas colaboradoras');
      return;
    }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setGroups((prev) => [{ id, memberKeys: [...selected], leaderKey: leaderKey || null }, ...prev]);
    setSelected([]); setLeaderKey('');
  };

  const removeGroup = (id: string) => setGroups((prev) => prev.filter((g) => g.id !== id));
  const findRow = (key: string) => eligible.find((row) => keyOf(row) === key);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><UserPlus className="h-4 w-4 text-primary" /> Montar cruzamento entre colaboradoras</CardTitle>
          <CardDescription>Selecione quantas colaboradoras quiser (sem limite). Opcionalmente, marque uma delas como líder do grupo — o sistema gera leitura individual de como ela acessa cada uma das outras.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Button variant="outline" size="sm" onClick={selectAll} disabled={!eligible.length}>Selecionar todas</Button>
            <Button variant="ghost" size="sm" onClick={clearSelection} disabled={!selected.length}>Limpar</Button>
            <span className="text-muted-foreground">{selected.length} selecionada(s){leaderKey && findRow(leaderKey) ? ` · líder: ${getFirstName(findRow(leaderKey)!.full_name)}` : ''}</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eligible.map((row) => {
              const k = keyOf(row);
              const isOn = selected.includes(k);
              const isLeader = leaderKey === k;
              return (
                <div key={k} className={`flex items-start gap-2 rounded-lg border p-2 text-sm transition-colors ${isOn ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <button type="button" onClick={() => toggle(k)} className="flex flex-1 items-start gap-2 text-left">
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isOn ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'}`}>
                      {isOn && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <div>
                      <p className="font-medium leading-tight">{row.full_name}</p>
                      <p className="text-xs text-muted-foreground">{row.job_title || row.leadershipMode || 'Sem cargo'}</p>
                    </div>
                  </button>
                  {isOn && (
                    <button
                      type="button"
                      onClick={() => setLeaderKey(isLeader ? '' : k)}
                      title={isLeader ? 'Remover como líder' : 'Marcar como líder do grupo'}
                      className={`shrink-0 rounded-md border p-1 transition-colors ${isLeader ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30 text-muted-foreground hover:bg-muted/50'}`}
                    >
                      <Crown className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end">
            <Button onClick={buildGroup} className="gap-2" disabled={selected.length < 2}><GitCompare className="h-4 w-4" /> Cruzar grupo ({selected.length})</Button>
          </div>
          {eligible.length < 2 && <p className="text-xs text-muted-foreground">É necessário ter pelo menos duas colaboradoras com dados disponíveis.</p>}
        </CardContent>
      </Card>

      {groups.map((group) => {
        const members = group.memberKeys.map(findRow).filter(Boolean) as MemberProfile[];
        if (members.length < 2) return null;
        const leader = group.leaderKey ? members.find((m) => keyOf(m) === group.leaderKey) || null : null;
        const liderados = leader ? members.filter((m) => keyOf(m) !== keyOf(leader)) : [];
        const synergy = getGroupSynergy(members);
        return (
          <Card key={group.id} className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-primary" /> {leader ? `${getFirstName(leader.full_name)} liderando ${members.length - 1}` : `Grupo de ${members.length} colaboradoras`}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {leader && <span className="font-medium text-foreground">👑 {leader.full_name}{leader.job_title ? ` (${leader.job_title})` : ''} → </span>}
                    {(leader ? liderados : members).map((m) => m.full_name).join(' • ')}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeGroup(group.id)} className="gap-1 text-muted-foreground"><X className="h-3 w-3" /> Remover</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-3">
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Onde se fortalecem</div>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {synergy.strengths.length ? synergy.strengths.map((item) => <li key={item} className="leading-relaxed">• {item}</li>) : <li className="leading-relaxed">• Sem sinergia clara identificada nos dados disponíveis.</li>}
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><AlertCircle className="h-4 w-4 text-amber-600" /> Pontos de atrito</div>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {synergy.tensions.length ? synergy.tensions.map((item) => <li key={item} className="leading-relaxed">• {item}</li>) : <li className="leading-relaxed">• Sem pontos críticos identificados nos dados disponíveis.</li>}
                  </ul>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><HeartHandshake className="h-4 w-4 text-primary" /> Como podem trabalhar juntas</div>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {synergy.howToWork.length ? synergy.howToWork.map((item) => <li key={item} className="leading-relaxed">• {item}</li>) : <li className="leading-relaxed">• Combinem papéis claros e revisem juntas a cada semana.</li>}
                  </ul>
                </div>
              </div>

              {leader && liderados.length > 0 && (
                <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Crown className="h-4 w-4 text-primary" /> Liderança 1:1 — como {getFirstName(leader.full_name)} acessa cada uma
                  </div>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {liderados.map((m) => (
                      <OneOnOneCard key={keyOf(m)} leader={leader} member={m} />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
export default function BusinessTeamComparison() {
  const { company } = useBusinessAuth();
  const enforcement = useBusinessEnforcement();
  const [rows, setRows] = useState<MemberProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfMode, setPdfMode] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const { generatePDFFromRef, isGenerating } = useScreenPDF();

  const loadData = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);
    const { data, error } = await (supabase as unknown as TeamCrossingRpc).rpc('get_company_identity_team_crossing', { p_company_id: company.id });
    if (error) {
      console.error('Erro ao carregar cruzamento da equipe:', error);
      toast.error('Erro ao carregar cruzamento da equipe');
    } else {
      setRows((data || []).map(enrichRow));
    }
    setIsLoading(false);
  }, [company?.id]);

  useEffect(() => {
    if (enforcement.canViewInsights) loadData();
  }, [enforcement.canViewInsights, loadData]);

  const codedRows = useMemo(() => rowsWithCode(rows), [rows]);
  const discData = useMemo(() => buildDistribution(codedRows, (row) => row.discProfile, DISC_LABELS), [codedRows]);
  const temperamentData = useMemo(() => buildDistribution(codedRows, (row) => row.temperamentProfile, TEMPERAMENT_LABELS), [codedRows]);
  const archetypeData = useMemo(() => buildDistribution(codedRows, (row) => row.archetypePrimary), [codedRows]);
  const contributionData = useMemo(() => buildDistribution(codedRows, (row) => row.leadershipMode), [codedRows]);
  const discRadar = useMemo(() => getAverageRadar(codedRows, 'disc'), [codedRows]);
  const temperamentRadar = useMemo(() => getAverageRadar(codedRows, 'temperament'), [codedRows]);

  const handleExportPDF = useCallback(async () => {
    if (rows.length === 0 || isGenerating) return;
    setPdfMode(true);
    // Espera o DOM renderizar todas as secoes empilhadas e os graficos do recharts montarem.
    await new Promise((resolve) => setTimeout(resolve, 800));
    const safeCompany = (company?.name || 'empresa').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    try {
      await generatePDFFromRef(pdfRef, {
        fileName: `cruzamento-equipe-${safeCompany}`,
        scale: 1.5,
        backgroundColor: '#ffffff',
      });
    } finally {
      setPdfMode(false);
    }
  }, [rows.length, isGenerating, company?.name, generatePDFFromRef]);

  if (!enforcement.canViewInsights) {
    return (
      <BusinessLayout>
        <Card className="mx-auto max-w-lg">
          <CardContent className="py-12 text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Recurso indisponível</h1>
            <p className="mt-2 text-sm text-muted-foreground">O cruzamento da equipe está disponível para empresas com assinatura ativa.</p>
          </CardContent>
        </Card>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 px-0 hover:bg-transparent"><ArrowLeft className="h-4 w-4" /> Voltar</Button>
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight"><Compass className="h-6 w-6 text-primary" /> Cruzamento de códigos da equipe</h1>
              <p className="mt-1 text-sm text-muted-foreground">Leitura completa e parcial dos mapas compartilhados pelas colaboradoras, com visão por time e supervisão.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={isLoading || isGenerating || rows.length === 0}
              className="gap-2"
            >
              <Download className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
              {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
            </Button>
            <Button variant="outline" onClick={loadData} disabled={isLoading} className="gap-2"><RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-44" />
            <div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-80" /><Skeleton className="h-80" /></div>
          </div>
        ) : rows.length === 0 ? (
          <Card className="mx-auto max-w-xl border-dashed">
            <CardContent className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Ainda não há resultados compartilhados</h2>
              <p className="mt-2 text-sm text-muted-foreground">Convide colaboradoras para a jornada e confirme o consentimento de compartilhamento para ativar esta visão.</p>
            </CardContent>
          </Card>
        ) : (
          <div ref={pdfRef} className="space-y-6 bg-background">
            {pdfMode && (
              <div className="space-y-1 border-b pb-3">
                <h2 className="text-xl font-bold">Cruzamento de códigos da equipe</h2>
                <p className="text-sm text-muted-foreground">
                  {company?.name ? `${company.name} • ` : ''}
                  Relatório gerado em {new Date().toLocaleString('pt-BR')}
                </p>
              </div>
            )}

            <ExecutiveSummary rows={rows} />

            {pdfMode ? (
              <div className="space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-2"><Compass className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Resumo</h2></div>
                  <div className="grid gap-6 xl:grid-cols-2">
                    <DistributionChart title="Distribuição DISC" data={discData} />
                    <DistributionChart title="Distribuição de Temperamentos" data={temperamentData} />
                    <DistributionChart title="Arquétipos predominantes" data={archetypeData} />
                    <DistributionChart title="Modo de contribuição no time" data={contributionData} />
                  </div>
                  <div className="grid gap-6 xl:grid-cols-2">
                    <TeamRadar title="Média da equipe por eixo DISC" data={discRadar} />
                    <TeamRadar title="Média da equipe por temperamento" data={temperamentRadar} />
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Insights por time</h2></div>
                  <TeamGroups rows={rows} />
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Cruzamentos de funcionamento</h2></div>
                  <CrossingsPanel rows={rows} />
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2"><Crown className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Leitura Gestor → Liderado (1:1)</h2></div>
                  <p className="text-sm text-muted-foreground">Para cada gestora, leitura individual de como acessar, delegar, dar feedback e o que evitar com cada colaboradora.</p>
                  <LeadershipOneOnOne rows={rows} />
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Combinar grupos da equipe</h2></div>
                  <p className="text-sm text-muted-foreground">Cruzamentos personalizados disponíveis na tela. Os grupos montados pelo usuário aparecem abaixo.</p>
                  <GroupBuilder rows={rows} />
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Mapa por colaboradora</h2></div>
                  <div className="grid gap-4 grid-cols-1">{rows.map((row) => <CollaboratorCard key={row.user_id || row.full_name} row={row} />)}</div>
                </section>
              </div>
            ) : (
              <Tabs defaultValue="resumo" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
                  <TabsTrigger value="resumo">Resumo</TabsTrigger>
                  <TabsTrigger value="times">Times</TabsTrigger>
                  <TabsTrigger value="cruzamentos">Cruzamentos</TabsTrigger>
                  <TabsTrigger value="lideranca">Liderança 1:1</TabsTrigger>
                  <TabsTrigger value="combinar">Combinar grupos</TabsTrigger>
                  <TabsTrigger value="individual">Individual</TabsTrigger>
                </TabsList>

                <TabsContent value="resumo" className="space-y-6">
                  <div className="grid gap-6 xl:grid-cols-2">
                    <DistributionChart title="Distribuição DISC" data={discData} />
                    <DistributionChart title="Distribuição de Temperamentos" data={temperamentData} />
                    <DistributionChart title="Arquétipos predominantes" data={archetypeData} />
                    <DistributionChart title="Modo de contribuição no time" data={contributionData} />
                  </div>
                  <div className="grid gap-6 xl:grid-cols-2">
                    <TeamRadar title="Média da equipe por eixo DISC" data={discRadar} />
                    <TeamRadar title="Média da equipe por temperamento" data={temperamentRadar} />
                  </div>
                </TabsContent>

                <TabsContent value="times" className="space-y-4">
                  <div className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Insights por time</h2></div>
                  <TeamGroups rows={rows} />
                </TabsContent>

                <TabsContent value="cruzamentos" className="space-y-4">
                  <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Cruzamentos de funcionamento</h2></div>
                  <CrossingsPanel rows={rows} />
                </TabsContent>


                <TabsContent value="lideranca" className="space-y-4">
                  <div className="flex items-center gap-2"><Crown className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Leitura Gestor → Liderado (1:1)</h2></div>
                  <p className="text-sm text-muted-foreground">Escolha quem está liderando (Lisa, você, Larissa…). O sistema gera, para cada uma das outras colaboradoras, uma leitura individual de como acessá-la, como delegar, como dar feedback e o que evitar — cruzando perfil + cargo cadastrado.</p>
                  <LeadershipOneOnOne rows={rows} />
                </TabsContent>

                <TabsContent value="combinar" className="space-y-4">
                  <div className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Combinar grupos da equipe</h2></div>
                  <p className="text-sm text-muted-foreground">Monte cruzamentos personalizados com quantas colaboradoras quiser (sem limite). Veja como o grupo se complementa, onde pode atritar e como devem se organizar para trabalhar juntas.</p>
                  <GroupBuilder rows={rows} />
                </TabsContent>

                <TabsContent value="individual" className="space-y-4">
                  <div className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Mapa por colaboradora</h2></div>
                  <div className="grid gap-4 grid-cols-1">{rows.map((row) => <CollaboratorCard key={row.user_id || row.full_name} row={row} />)}</div>
                </TabsContent>
              </Tabs>
            )}

            <div className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Esta página exibe somente pessoas vinculadas à equipe e dados do Nello Identity compartilhados com a empresa. Convites pendentes aparecem sem leitura comportamental até o acesso ser concluído. O acesso é restrito aos administradores da empresa.</span>
            </div>
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}
