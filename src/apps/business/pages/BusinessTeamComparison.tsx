import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Compass,
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

function getPairSynergy(a: MemberProfile, b: MemberProfile) {
  const firstA = getFirstName(a.full_name);
  const firstB = getFirstName(b.full_name);
  const modeA = a.leadershipMode;
  const modeB = b.leadershipMode;
  const sameMode = modeA === modeB;

  const strengths: string[] = [];
  const tensions: string[] = [];
  const howToWork: string[] = [];

  if (sameMode) {
    strengths.push(`${firstA} e ${firstB} compartilham o modo "${modeA}", o que gera linguagem comum e velocidade de decisão entre elas.`);
    tensions.push(`O risco é reforçarem o mesmo ponto cego: ambas tendem a reagir do mesmo jeito sob pressão e podem deixar lacunas que outra dupla cobriria naturalmente.`);
  } else {
    strengths.push(`A combinação ${modeA} + ${modeB} é complementar: uma puxa o que a outra não vê primeiro.`);
  }

  // Specific pair logic
  const pair = `${modeA}|${modeB}`;
  const inverse = `${modeB}|${modeA}`;
  const has = (p: string) => pair === p || inverse === p;

  if (has('Direção|Conexão')) {
    strengths.push('Direção fecha venda e bate meta; Conexão acolhe cliente e mantém vínculo após a compra.');
    tensions.push('Direção pode atropelar o tempo de Conexão; Conexão pode achar Direção fria ou apressada.');
    howToWork.push(`${firstA === a.full_name.split(' ')[0] && modeA === 'Direção' ? firstA : firstB} abre a abordagem com objetividade e propõe a oferta; a outra cuida do vínculo, da escuta e do pós-venda.`);
    howToWork.push('Combinem um sinal simples para "freia" e "avança" durante o atendimento, evitando atrito na frente do cliente.');
  }
  if (has('Direção|Sustentação')) {
    strengths.push('Direção decide e move; Sustentação garante constância, rotina e qualidade do que ficou combinado.');
    tensions.push('Sustentação pode ser sobrecarregada por Direção; pode silenciar o incômodo até estourar.');
    howToWork.push('Direção define a meta da semana; Sustentação organiza o passo a passo e marca check-in para validar ritmo real.');
  }
  if (has('Direção|Critério')) {
    strengths.push('Direção quer resultado rápido; Critério garante que o resultado tenha qualidade e consistência.');
    tensions.push('Direção pode achar Critério lenta; Critério pode achar Direção descuidada com detalhes que afetam cliente.');
    howToWork.push('Direção define o "o quê" e o prazo; Critério define o padrão mínimo aceitável antes de entregar.');
  }
  if (has('Conexão|Sustentação')) {
    strengths.push('Conexão atrai cliente e gera energia no time; Sustentação mantém constância e cuidado contínuo.');
    tensions.push('Conexão pode dispersar; Sustentação pode se cansar de "segurar" o que a outra começa e não termina.');
    howToWork.push('Conexão abre o atendimento e cria vínculo; Sustentação fecha a tarefa e cuida do follow-up.');
  }
  if (has('Conexão|Critério')) {
    strengths.push('Conexão humaniza a interação; Critério garante que a promessa feita seja cumprida no detalhe.');
    tensions.push('Conexão pode prometer demais; Critério pode soar excessivamente técnica ao revisar a colega.');
    howToWork.push('Conexão fala com cliente; Critério valida estoque, condição e padrão antes de confirmar a venda.');
  }
  if (has('Sustentação|Critério')) {
    strengths.push('Dupla altamente confiável em rotina, organização, conferência e qualidade do atendimento contínuo.');
    tensions.push('Pode faltar iniciativa para mudanças rápidas; ambas tendem a evitar conflito e ruptura.');
    howToWork.push('Combinem revisão semanal curta para decidir o que precisa mudar, em vez de apenas manter o que já existe.');
  }
  if (sameMode) {
    if (modeA === 'Direção') howToWork.push('Dividam responsabilidade por área (uma cuida de meta, outra de processo) para não competirem pela mesma decisão.');
    if (modeA === 'Conexão') howToWork.push('Combinem quem fala com qual cliente para não duplicarem contato e disputarem foco.');
    if (modeA === 'Sustentação') howToWork.push('Tragam alguém de Direção ou Critério para destravar decisões; juntas tendem a adiar mudanças.');
    if (modeA === 'Critério') howToWork.push('Definam um prazo de decisão antes de entrar em análise; juntas podem travar em busca de perfeição.');
  }

  // Temperament-level extra read
  if (a.temperamentProfile && b.temperamentProfile && a.temperamentProfile !== b.temperamentProfile) {
    strengths.push(`Os temperamentos ${TEMPERAMENT_LABELS[a.temperamentProfile]} e ${TEMPERAMENT_LABELS[b.temperamentProfile]} se equilibram em emoção e ritmo.`);
  }

  // Connection-style read
  if (a.connectionStyle && b.connectionStyle && a.connectionStyle !== b.connectionStyle) {
    howToWork.push(`Estilos de conexão diferentes (${a.connectionStyle} x ${b.connectionStyle}): cada uma percebe reconhecimento de um jeito. Combinem como vão sinalizar apoio uma à outra.`);
  }

  return { strengths, tensions, howToWork };
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
  const groupName = row.department?.trim() || (row.job_title?.toLowerCase().includes('vended') ? 'Vendas' : 'Equipe geral');
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

function PairBuilder({ rows }: { rows: MemberProfile[] }) {
  const eligible = rows.filter((row) => row.journey_status !== 'pending_invite');
  const [pairs, setPairs] = useState<Array<{ a: string; b: string }>>([]);
  const [aId, setAId] = useState<string>('');
  const [bId, setBId] = useState<string>('');

  const keyOf = (row: MemberProfile) => row.user_id || row.full_name;
  const findRow = (key: string) => eligible.find((row) => keyOf(row) === key);

  const addPair = () => {
    if (!aId || !bId || aId === bId) {
      toast.error('Selecione duas colaboradoras diferentes');
      return;
    }
    if (pairs.some((p) => (p.a === aId && p.b === bId) || (p.a === bId && p.b === aId))) {
      toast.info('Esse cruzamento já está montado');
      return;
    }
    setPairs((prev) => [...prev, { a: aId, b: bId }]);
    setAId('');
    setBId('');
  };

  const removePair = (index: number) => setPairs((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><UserPlus className="h-4 w-4 text-primary" /> Montar cruzamento entre colaboradoras</CardTitle>
          <CardDescription>Combine duas pessoas da equipe e veja como elas podem trabalhar juntas, onde se complementam e onde podem atritar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <Select value={aId} onValueChange={setAId}>
              <SelectTrigger><SelectValue placeholder="Colaboradora 1" /></SelectTrigger>
              <SelectContent>
                {eligible.map((row) => <SelectItem key={keyOf(row)} value={keyOf(row)}>{row.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={bId} onValueChange={setBId}>
              <SelectTrigger><SelectValue placeholder="Colaboradora 2" /></SelectTrigger>
              <SelectContent>
                {eligible.filter((row) => keyOf(row) !== aId).map((row) => <SelectItem key={keyOf(row)} value={keyOf(row)}>{row.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={addPair} className="gap-2"><GitCompare className="h-4 w-4" /> Cruzar</Button>
          </div>
          {eligible.length < 2 && <p className="text-xs text-muted-foreground">É necessário ter pelo menos duas colaboradoras com dados disponíveis.</p>}
        </CardContent>
      </Card>

      {pairs.map((pair, index) => {
        const a = findRow(pair.a);
        const b = findRow(pair.b);
        if (!a || !b) return null;
        const synergy = getPairSynergy(a, b);
        return (
          <Card key={`${pair.a}-${pair.b}-${index}`} className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-primary" /> {a.full_name} <span className="text-muted-foreground">×</span> {b.full_name}
                  </CardTitle>
                  <CardDescription>{a.leadershipMode} + {b.leadershipMode}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removePair(index)} className="gap-1 text-muted-foreground"><X className="h-3 w-3" /> Remover</Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 lg:grid-cols-3">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Onde se fortalecem</div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {synergy.strengths.map((item) => <li key={item} className="leading-relaxed">• {item}</li>)}
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
                  {synergy.howToWork.length ? synergy.howToWork.map((item) => <li key={item} className="leading-relaxed">• {item}</li>) : <li className="leading-relaxed">• Combine papéis claros e revisem juntas a cada semana.</li>}
                </ul>
              </div>
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
          <Button variant="outline" onClick={loadData} disabled={isLoading} className="gap-2"><RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar</Button>
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
          <>
            <ExecutiveSummary rows={rows} />

            <Tabs defaultValue="resumo" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="resumo">Resumo</TabsTrigger>
                <TabsTrigger value="times">Times</TabsTrigger>
                <TabsTrigger value="cruzamentos">Cruzamentos</TabsTrigger>
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

              <TabsContent value="individual" className="space-y-4">
                <div className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Mapa por colaboradora</h2></div>
                <div className="grid gap-4 xl:grid-cols-2">{rows.map((row) => <CollaboratorCard key={row.user_id || row.full_name} row={row} />)}</div>
              </TabsContent>
            </Tabs>

            <div className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Esta página exibe somente pessoas vinculadas à equipe e dados do Nello Identity compartilhados com a empresa. Convites pendentes aparecem sem leitura comportamental até o acesso ser concluído. O acesso é restrito aos administradores da empresa.</span>
            </div>
          </>
        )}
      </div>
    </BusinessLayout>
  );
}
