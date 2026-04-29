import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
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
} from 'lucide-react';
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
  user_id: string;
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
  const primary = getString(visual.primary) || getString(visual.profile) || getString(test.primary) || getString(test.dominantProfile) || getString(test.primaryProfile);
  const secondary = getString(visual.secondary) || getString(test.secondary) || getString(test.secondaryProfile);
  const scores = asNumberMap(visual.scores && Object.keys(asRecord(visual.scores)).length ? visual.scores : test.percentages || test.scores);
  return { primary: normalizeDisc(primary), secondary: normalizeDisc(secondary), scores };
}

function extractTemperament(row: TeamMemberRow) {
  const visual = visualData(row, 'temperament');
  const test = testData(row, 'temperamentos');
  const primary = getString(visual.primary) || pickPrimaryFromObject(test.primary) || getString(test.dominantTemperament);
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
  return (row.available_maps || []).includes(map);
}

function missingMaps(row: MemberProfile) {
  return EXPECTED_MAPS.filter((map) => !hasMap(row, map));
}

function getBehaviorReading(row: MemberProfile) {
  const disc = row.discProfile;
  const temp = row.temperamentProfile;
  const first = getFirstName(row.full_name);

  if (disc === 'D' || temp === 'colerico') {
    return `${first} tende a responder melhor quando entende a prioridade, o prazo e o resultado esperado. Em momentos de pressão, pode acelerar, cobrar objetividade e perder paciência com explicações longas. Dentro da empresa, ela pode render mais quando recebe autonomia com critérios claros de entrega.`;
  }
  if (disc === 'I' || temp === 'sanguineo') {
    return `${first} tende a influenciar o ambiente pela comunicação, presença e capacidade de criar vínculo. Em dias de pressão, pode reagir emocionalmente ao clima do time, oscilar foco ou buscar validação antes de executar. Na empresa, cresce quando sua energia relacional é direcionada para atendimento, acolhimento, vendas e integração.`;
  }
  if (disc === 'S' || temp === 'fleumatico') {
    return `${first} tende a preservar estabilidade, confiança e continuidade. Pode evitar conflito direto, demorar a verbalizar incômodos e preferir rotinas previsíveis. Na empresa, melhora quando recebe segurança, combinados constantes e espaço para se posicionar sem confronto.`;
  }
  if (disc === 'C' || temp === 'melancolico') {
    return `${first} tende a agir com critério, observação e cuidado com detalhes. Em pressão, pode travar diante de ambiguidade, preocupar-se com erro ou precisar de mais contexto antes de decidir. Na empresa, entrega melhor quando há padrão, checklist, referência de qualidade e tempo adequado para organizar.`;
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
  if (row.leadershipMode === 'Direção') return 'Pode ser melhor aproveitada quando assume pequenas frentes, metas de venda, resolução de gargalos e decisões rápidas — desde que acompanhada por rituais de escuta para não atropelar o ritmo das outras.';
  if (row.leadershipMode === 'Conexão') return 'Pode crescer quando sua sensibilidade ao ambiente vira ponte com clientes e colegas — com metas simples, acompanhamento próximo e fechamento claro das tarefas iniciadas.';
  if (row.leadershipMode === 'Sustentação') return 'Pode evoluir quando vira referência de constância, atendimento cuidadoso e preservação de processos — com incentivo para comunicar desconfortos antes que eles acumulem.';
  return 'Pode contribuir mais quando vira guardiã de qualidade, organização e critério — com cuidado para que perfeccionismo ou excesso de análise não atrasem decisões simples.';
}

function getDataNotice(row: MemberProfile) {
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
  const fullCodes = rows.filter((row) => row.has_essence_code).length;
  const partial = rows.length - fullCodes;
  const supervisor = rows.find((row) => normalizeKey(row.job_title).includes('supervisor'));
  const modes = buildDistribution(rows, (row) => row.leadershipMode);
  const topMode = [...modes].sort((a, b) => b.count - a.count)[0];
  const topDisc = [...buildDistribution(rows, (row) => row.discProfile, DISC_LABELS)].sort((a, b) => b.count - a.count)[0];
  const topTemp = [...buildDistribution(rows, (row) => row.temperamentProfile, TEMPERAMENT_LABELS)].sort((a, b) => b.count - a.count)[0];

  const summary = `A equipe mostra maior força em ${topMode?.label || 'perfis ainda indefinidos'}, com predominância comportamental em ${topDisc?.label || 'DISC parcial'} e ${topTemp?.label || 'temperamentos parciais'}. A leitura considera Código completo quando existe e reaproveita os mapas individuais das colaboradoras que ainda têm dados parciais.`;
  const leadership = supervisor
    ? `${supervisor.full_name} foi incluída como supervisora. A leitura dela funciona como ponto de coordenação entre direção, rotina e comunicação da equipe.`
    : 'Ainda não há supervisora identificada pelo cargo; a leitura está organizada pela equipe geral.';

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
          <p className="text-muted-foreground">O Identity Nello One é uma ferramenta de autoconhecimento e educação comportamental. Não substitui diagnóstico, avaliação clínica ou decisão profissional isolada.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Pessoas" value={rows.length} />
          <Metric label="Códigos completos" value={fullCodes} detail={`${partial} com dados parciais`} />
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
                {members.map((member) => <Badge key={member.user_id} variant="secondary">{member.full_name.split(' ')[0]} · {member.leadershipMode}</Badge>)}
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
                {complementary.map((member) => <Badge key={member.user_id} variant="outline">Complementar: {member.full_name.split(' ')[0]} · {member.leadershipMode}</Badge>)}
                {samePattern.map((member) => <Badge key={member.user_id} variant="secondary">Mesmo modo: {member.full_name.split(' ')[0]}</Badge>)}
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
  const completedMaps = row.available_maps || [];
  const statusLabel = row.business_role === 'candidate' ? 'Processo seletivo · dados parciais' : row.completeness === 'codigo_completo' ? 'Código completo' : row.completeness === 'jornada_sem_codigo' ? 'Jornada completa' : 'Dados parciais';
  const dataNotice = getDataNotice(row);
  const actionItems = getActionReading(row);

  return (
    <Card className={row.business_role === 'candidate' ? 'border-primary/25' : undefined}>
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
        <div className="grid gap-3 lg:grid-cols-3">
          <ReadingBlock icon={HeartHandshake} title="Como ela tende a agir e reagir" text={getBehaviorReading(row)} />
          <ReadingBlock icon={Target} title="Como ela pode ser melhor na empresa" text={getGrowthReading(row)} />
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><ClipboardCheck className="h-4 w-4 text-primary" /> Ações de gestão</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {actionItems.map((item) => <li key={item} className="leading-relaxed">• {item}</li>)}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {completedMaps.map((map) => <Badge key={map} variant="outline">{MAP_LABELS[map] || map}</Badge>)}
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

  const discData = useMemo(() => buildDistribution(rows, (row) => row.discProfile, DISC_LABELS), [rows]);
  const temperamentData = useMemo(() => buildDistribution(rows, (row) => row.temperamentProfile, TEMPERAMENT_LABELS), [rows]);
  const archetypeData = useMemo(() => buildDistribution(rows, (row) => row.archetypePrimary), [rows]);
  const contributionData = useMemo(() => buildDistribution(rows, (row) => row.leadershipMode), [rows]);
  const discRadar = useMemo(() => getAverageRadar(rows, 'disc'), [rows]);
  const temperamentRadar = useMemo(() => getAverageRadar(rows, 'temperament'), [rows]);

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
                <div className="grid gap-4 xl:grid-cols-2">{rows.map((row) => <CollaboratorCard key={row.user_id} row={row} />)}</div>
              </TabsContent>
            </Tabs>

            <div className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Esta página exibe dados individuais apenas das pessoas ativas que autorizaram o compartilhamento com a empresa e candidatas com consentimento no processo seletivo. O acesso é restrito aos administradores da empresa.</span>
            </div>
          </>
        )}
      </div>
    </BusinessLayout>
  );
}
