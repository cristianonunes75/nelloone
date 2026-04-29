import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, Briefcase, ClipboardList, Target, BookOpen,
  BarChart3, Users, Shield, TrendingUp, TrendingDown, Minus,
  Thermometer, AlertTriangle, Map, Compass, CheckCircle, Circle,
  ChevronDown, ChevronUp, HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { SubscriptionStatusBanner } from '../components/SubscriptionStatusBanner';
import { BlockedAccessOverlay } from '../components/BlockedAccessOverlay';
import { supabase } from '@/integrations/supabase/client';
import { PRODUCT_IDENTITY } from '../config/featureFlags';
import { useENPS } from '../hooks/useENPS';
import { useClimate, DIMENSION_LABELS, getClimateClassification } from '../hooks/useClimate';
import { useTeamInsights } from '../hooks/useTeamInsights';
import { calculateHealthIndex } from '../components/strategy/OrganizationalHealthCard';

// ── Types ──
interface DashboardStats {
  activeJobs: number;
  totalCandidates: number;
  teamMembers: number;
  pendingInvites: number;
  essenceCodes: number;
}

interface JourneyData {
  hasJobs: boolean;
  hasTeamMembers: boolean;
  hasAssessments: boolean;
  hasEssenceCodes: boolean;
  hasIdealProfiles: boolean;
  hasENPSCycle: boolean;
  hasClimateCycle: boolean;
}

// ── Info Tooltip helper ──
function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help shrink-0" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

// ══════════════════════════════════════
// CAMADA 1 — VISÃO EXECUTIVA (CEO VIEW)
// ══════════════════════════════════════

function HealthIndexCard({ 
  index, previousIndex 
}: { index: number | null; previousIndex?: number | null }) {
  const getLevel = (v: number | null) => {
    if (v === null) return { label: 'Sem dados', color: 'text-muted-foreground', bg: 'bg-muted/30', dot: 'bg-muted-foreground' };
    if (v >= 70) return { label: 'Saudável', color: 'text-green-600', bg: 'bg-green-500/10', dot: 'bg-green-500' };
    if (v >= 40) return { label: 'Atenção', color: 'text-amber-600', bg: 'bg-amber-500/10', dot: 'bg-amber-500' };
    return { label: 'Risco', color: 'text-red-600', bg: 'bg-red-500/10', dot: 'bg-red-500' };
  };

  const { label, color, bg, dot } = getLevel(index);
  const trend = index !== null && previousIndex != null ? index - previousIndex : null;

  return (
    <Card className={bg}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center gap-1.5">
            <Shield className={`w-4 h-4 ${color}`} />
            Saúde Organizacional
          </CardDescription>
          <div className="flex items-center gap-1.5">
            <InfoTip text="Índice composto (0-100) que combina eNPS (30%), Clima (30%), Performance (20%) e Aderência ao cargo (20%). Verde ≥70, Amarelo ≥40, Vermelho <40." />
            <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${color}`}>{index ?? '—'}</span>
          {index !== null && <span className="text-sm text-muted-foreground">/100</span>}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs font-semibold ${color}`}>{label}</span>
          {trend !== null && (
            <span className={`flex items-center gap-0.5 text-xs ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {trend > 0 ? '+' : ''}{trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ENPSCard({ 
  score, promoters, neutrals, detractors, cycleStatus 
}: { 
  score: number | null; promoters: number; neutrals: number; detractors: number; cycleStatus: string | null;
}) {
  const getColor = (s: number) => s >= 50 ? 'text-green-600' : s >= 0 ? 'text-amber-600' : 'text-red-600';
  const statusLabel = cycleStatus === 'active' ? 'Ciclo ativo' : cycleStatus === 'closed' ? 'Ciclo fechado' : 'Sem ciclo';
  const statusColor = cycleStatus === 'active' ? 'text-green-500' : cycleStatus === 'closed' ? 'text-muted-foreground' : 'text-amber-500';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-primary" />
          eNPS
          <InfoTip text="Employee Net Promoter Score: mede a lealdade dos colaboradores. Varia de -100 a +100. Acima de 50 é excelente, acima de 0 é bom, abaixo de 0 exige atenção. P=Promotores, N=Neutros, D=Detratores." />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <span className={`text-4xl font-bold ${score !== null ? getColor(score) : 'text-muted-foreground'}`}>
          {score !== null ? Math.round(score) : '—'}
        </span>
        {score !== null && (
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span className="text-green-600">{promoters}P</span>
            <span>·</span>
            <span className="text-amber-600">{neutrals}N</span>
            <span>·</span>
            <span className="text-red-600">{detractors}D</span>
          </div>
        )}
        <p className={`text-xs mt-1 ${statusColor}`}>{statusLabel}</p>
      </CardContent>
    </Card>
  );
}

function ClimateCard({ 
  score, worstDimension, worstScore, cycleStatus 
}: { 
  score: number | null; worstDimension: string | null; worstScore: number | null; cycleStatus: string | null;
}) {
  const { label, color } = getClimateClassification(score);
  const statusLabel = cycleStatus === 'active' ? 'Ciclo ativo' : cycleStatus === 'closed' ? 'Ciclo fechado' : 'Sem ciclo';
  const statusColor = cycleStatus === 'active' ? 'text-green-500' : cycleStatus === 'closed' ? 'text-muted-foreground' : 'text-amber-500';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-1.5">
          <Thermometer className="w-4 h-4 text-primary" />
          Clima Geral
          <InfoTip text="Nota média de satisfação dos colaboradores em múltiplas dimensões (Liderança, Comunicação, Reconhecimento, etc.). Escala de 1 a 5. Acima de 4 é excelente. O ⚠ indica a dimensão mais frágil." />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold ${color}`}>
            {score !== null ? score.toFixed(1) : '—'}
          </span>
          {score !== null && <span className="text-sm text-muted-foreground">/5</span>}
        </div>
        {worstDimension && worstScore !== null && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠ {DIMENSION_LABELS[worstDimension] || worstDimension}: {worstScore.toFixed(1)}
          </p>
        )}
        {!worstDimension && score !== null && (
          <p className={`text-xs mt-1 ${color}`}>{label}</p>
        )}
        <p className={`text-xs mt-1 ${statusColor}`}>{statusLabel}</p>
      </CardContent>
    </Card>
  );
}

function AdherenceCard({ 
  avgAdherence, totalEvaluated 
}: { 
  avgAdherence: number | null; totalEvaluated: number;
}) {
  const getLevel = (v: number | null) => {
    if (v === null) return { label: 'Sem dados', color: 'text-muted-foreground' };
    if (v >= 70) return { label: 'Saudável', color: 'text-green-600' };
    if (v >= 40) return { label: 'Atenção', color: 'text-amber-600' };
    return { label: 'Risco', color: 'text-red-600' };
  };
  const { label, color } = getLevel(avgAdherence);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-primary" />
          Aderência Média
          <InfoTip text="Percentual médio de compatibilidade entre o perfil comportamental dos colaboradores e o perfil ideal definido para seus cargos. Quanto maior, melhor o fit cultural e funcional da equipe." />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold ${color}`}>
            {avgAdherence !== null ? `${Math.round(avgAdherence)}%` : '—'}
          </span>
        </div>
        <p className={`text-xs mt-1 ${color}`}>{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {totalEvaluated > 0 ? `${totalEvaluated} avaliados` : 'Nenhuma avaliação'}
        </p>
      </CardContent>
    </Card>
  );
}

// Empty state CTA for executive layer
function ExecutiveEmptyState() {
  return (
    <Card className="col-span-full border-dashed border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div className="text-center sm:text-left flex-1">
          <h3 className="font-semibold text-foreground">Configure sua Inteligência Organizacional</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Convide sua equipe e rode ciclos de eNPS e Clima para ativar a visão executiva completa.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/team?tab=invite">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Users className="w-3.5 h-3.5" /> Convidar equipe
            </Button>
          </Link>
          <Link to="/people-strategy">
            <Button size="sm" className="gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> People Strategy
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════
// CAMADA 2 — MAPA ORGANIZACIONAL
// ══════════════════════════════════════

const DISC_COLORS: Record<string, string> = {
  D: 'bg-red-500', I: 'bg-amber-500', S: 'bg-green-500', C: 'bg-blue-500',
};
const DISC_LABELS: Record<string, string> = {
  D: 'Dominância', I: 'Influência', S: 'Estabilidade', C: 'Conformidade',
};

function OrganizationalMapSection({
  discDistribution, totalMembers, completedAssessments, worstClimateDimension, worstClimateScore,
}: {
  discDistribution: Record<string, number>;
  totalMembers: number;
  completedAssessments: number;
  worstClimateDimension: string | null;
  worstClimateScore: number | null;
}) {
  const discTotal = Object.values(discDistribution).reduce((a, b) => a + b, 0);
  const maxDiscPct = discTotal > 0 ? Math.max(...Object.values(discDistribution)) / discTotal : 0;
  const concentrationRisk = maxDiscPct > 0.6 ? 'high' : maxDiscPct > 0.4 ? 'medium' : 'low';

  const hasData = totalMembers > 0 || discTotal > 0;
  if (!hasData) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Map className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Mapa Organizacional</h2>
        <InfoTip text="Visão panorâmica da composição comportamental da sua equipe, riscos estruturais e cobertura de avaliações. Dados baseados nos perfis mapeados pelo Identity." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DISC Distribution compact */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              Distribuição DISC
              <InfoTip text="O perfil DISC classifica o comportamento em 4 eixos: Dominância (decisão rápida), Influência (comunicação), Estabilidade (consistência) e Conformidade (análise). Equipes saudáveis têm diversidade entre os perfis." />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {discTotal > 0 ? (
              <>
                <div className="h-3 rounded-full overflow-hidden flex mb-3">
                  {Object.entries(discDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([profile, count]) => (
                      <div
                        key={profile}
                        className={`${DISC_COLORS[profile] || 'bg-muted'}`}
                        style={{ width: `${(count / discTotal) * 100}%` }}
                      />
                    ))}
                </div>
                <div className="space-y-1">
                  {Object.entries(discDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([profile, count]) => (
                      <div key={profile} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${DISC_COLORS[profile]}`} />
                          <span>{DISC_LABELS[profile] || profile}</span>
                        </div>
                        <span className="text-muted-foreground font-mono">{Math.round((count / discTotal) * 100)}%</span>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados DISC</p>
            )}
          </CardContent>
        </Card>

        {/* Risk Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              Risco Estrutural
              <InfoTip text="Avalia riscos na composição da equipe. Concentração alta (>60% de um perfil DISC) indica falta de diversidade comportamental. Clima vulnerável mostra a dimensão com menor pontuação na pesquisa de clima." />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Concentration risk */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                concentrationRisk === 'high' ? 'bg-red-500' : concentrationRisk === 'medium' ? 'bg-amber-500' : 'bg-green-500'
              }`} />
              <span className="text-sm">
                {concentrationRisk === 'high' ? 'Concentração alta' : concentrationRisk === 'medium' ? 'Concentração média' : 'Diversidade saudável'}
              </span>
            </div>
            {/* Climate vulnerability */}
            {worstClimateDimension && worstClimateScore !== null && (
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-3.5 h-3.5 ${worstClimateScore < 3 ? 'text-red-500' : 'text-amber-500'}`} />
                <span className="text-sm">
                  Clima vulnerável: <strong>{DIMENSION_LABELS[worstClimateDimension] || worstClimateDimension}</strong> ({worstClimateScore.toFixed(1)})
                </span>
              </div>
            )}
            {!worstClimateDimension && (
              <p className="text-xs text-muted-foreground">Rode um ciclo de clima para detectar vulnerabilidades</p>
            )}
          </CardContent>
        </Card>

        {/* Team summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              Equipe
              <InfoTip text="Resumo da cobertura de avaliações comportamentais. 'Perfil mapeado' indica quantos colaboradores já concluíram o Identity. Cobertura é o percentual do total que já foi avaliado." />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total de membros</span>
              <span className="font-semibold">{totalMembers}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Perfil mapeado</span>
              <span className="font-semibold">{completedAssessments}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cobertura</span>
              <span className="font-semibold">
                {totalMembers > 0 ? `${Math.round((completedAssessments / totalMembers) * 100)}%` : '0%'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// CAMADA 5 — CHECKLIST DE PROGRESSO
// ══════════════════════════════════════

function OrgProgressChecklist({ data }: { data: JourneyData }) {
  const [expanded, setExpanded] = useState(false);

  const steps = [
    { id: 'jobs', label: 'Cargos configurados', done: data.hasJobs, link: '/jobs' },
    { id: 'ideal', label: 'Perfil ideal definido', done: data.hasIdealProfiles, link: '/jobs' },
    { id: 'team', label: 'Equipe convidada', done: data.hasTeamMembers, link: '/team?tab=invite' },
    { id: 'assess', label: 'Avaliações concluídas', done: data.hasAssessments, link: '/team' },
  ];

  const completedCount = steps.filter(s => s.done).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  if (completedCount === steps.length) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm">Progresso da Estrutura Organizacional</CardTitle>
            <InfoTip text="Checklist das etapas necessárias para ativar toda a inteligência organizacional. Complete todas para obter a visão executiva mais precisa possível." />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold">{progressPct}%</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
          </div>
        </div>
        <Progress value={progressPct} className="h-1.5 mt-1" />
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {steps.map(step => (
              <div key={step.id} className="flex items-center gap-2 py-1">
                {step.done ? (
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                )}
                <span className={`text-xs flex-1 ${step.done ? 'text-muted-foreground line-through' : ''}`}>
                  {step.label}
                </span>
                {!step.done && (
                  <Link to={step.link}>
                    <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2">Ir</Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ══════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════

export default function BusinessDashboard() {
  const { company, isNelloOneSuperAdmin } = useBusinessAuth();
  const [stats, setStats] = useState<DashboardStats>({ activeJobs: 0, totalCandidates: 0, teamMembers: 0, pendingInvites: 0, essenceCodes: 0 });
  const [allCompanies, setAllCompanies] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { insights: teamInsights, fetchInsights: fetchTeamInsights } = useTeamInsights();

  const [journeyData, setJourneyData] = useState<JourneyData>({
    hasJobs: false, hasTeamMembers: false, hasAssessments: false,
    hasEssenceCodes: false, hasIdealProfiles: false,
    hasENPSCycle: false, hasClimateCycle: false,
  });

  // Fetch strategic data
  useEffect(() => {
    if (company) {
      fetchTeamInsights();
    }
  }, [company]);

  // Fetch journey progress
  useEffect(() => {
    if (!company?.id) return;
    const fetchJourney = async () => {
      const [jobs, team] = await Promise.all([
        supabase.from('job_postings').select('id, ideal_profile').eq('company_id', company.id).limit(5),
        supabase.from('company_users').select('id').eq('company_id', company.id).eq('is_active', true).limit(5),
      ]);
      const jobData = jobs.data || [];
      setJourneyData({
        hasJobs: jobData.length > 0,
        hasTeamMembers: (team.data || []).length > 0,
        hasAssessments: (teamInsights?.completed_assessments ?? 0) > 0,
        hasEssenceCodes: (teamInsights?.essence_code?.total_with_essence_code ?? 0) > 0,
        hasIdealProfiles: jobData.some((j: any) => j.ideal_profile !== null),
        hasENPSCycle: false,
        hasClimateCycle: false,
      });
    };
    fetchJourney();
  }, [company?.id, teamInsights]);

  useEffect(() => {
    if (company) {
      fetchStats();
    } else if (isNelloOneSuperAdmin) {
      fetchAllCompanies();
    } else {
      setIsLoading(false);
    }
  }, [company, isNelloOneSuperAdmin]);

  const fetchAllCompanies = async () => {
    try {
      const { data } = await supabase.from('companies').select('id, name, slug').order('created_at', { ascending: false }).limit(20);
      setAllCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!company) return;
    try {
      const [{ count: jobsCount }, { count: candidatesCount }, { data: teamData }, { count: pendingCount }] = await Promise.all([
        supabase.from('job_postings').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'published'),
        supabase.from('hiring_candidates').select('*', { count: 'exact', head: true }).eq('company_id', company.id),
        supabase.from('company_users').select('user_id').eq('company_id', company.id).eq('is_active', true),
        supabase.from('company_invites').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'pending'),
      ]);
      const userIds = (teamData || []).map((item) => item.user_id).filter(Boolean);
      const { data: crossingData } = await (supabase as any).rpc('get_company_identity_team_crossing', { p_company_id: company.id });
      const essenceCodes = (crossingData || []).filter((row: any) => row.has_essence_code).length;
      setStats({ activeJobs: jobsCount || 0, totalCandidates: candidatesCount || 0, teamMembers: userIds.length, pendingInvites: pendingCount || 0, essenceCodes });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Super admin without company
  if (isNelloOneSuperAdmin && !company) {
    return (
      <BusinessLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Overview - {PRODUCT_IDENTITY.name}</h1>
            <p className="text-muted-foreground">Visão geral de todas as empresas</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Empresas cadastradas</CardTitle>
              <CardDescription>{allCompanies.length} empresas encontradas</CardDescription>
            </CardHeader>
            <CardContent>
              {allCompanies.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
              ) : (
                <div className="space-y-2">
                  {allCompanies.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-muted-foreground">/{c.slug}</p>
                      </div>
                      <Button variant="ghost" size="sm">Ver detalhes</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <BlockedAccessOverlay />
      <TooltipProvider delayDuration={300}>
        <div className="space-y-8">
          <SubscriptionStatusBanner />

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm">{PRODUCT_IDENTITY.tagline}</p>
          </div>

          {/* ═══════ VISÃO SIMPLIFICADA DA EQUIPE ═══════ */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Equipe e Código da Essência
              <InfoTip text="Visão simplificada usando somente pessoas vinculadas à equipe e dados compartilhados do Identity." />
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>Pessoas na equipe</CardDescription>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.teamMembers}</div>
                  <p className="text-xs text-muted-foreground mt-1">membros ativos</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>Códigos disponíveis</CardDescription>
                  <Map className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.essenceCodes}</div>
                  <p className="text-xs text-muted-foreground mt-1">no Nello Identity</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>Convites pendentes</CardDescription>
                  <Circle className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingInvites}</div>
                  <p className="text-xs text-muted-foreground mt-1">sem dados compartilhados</p>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <Link to="/team-comparison" className="block h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Compass className="w-5 h-5 text-primary" />
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-sm">Cruzamento da equipe</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ler e comparar códigos</p>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </section>

          {/* ═══════ CAMADA 3 — RECRUTAMENTO E SELEÇÃO ═══════ */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Recrutamento e Seleção
              <InfoTip text="Acompanhe suas vagas abertas e candidatos em processo seletivo. Crie vagas com perfis ideais para que candidatos sejam automaticamente ranqueados por aderência comportamental." />
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription className="flex items-center gap-1.5">
                    Vagas ativas
                    <InfoTip text="Quantidade de vagas publicadas e recebendo candidatos no momento." />
                  </CardDescription>
                  <ClipboardList className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeJobs}</div>
                  <p className="text-xs text-muted-foreground mt-1">publicadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription className="flex items-center gap-1.5">
                    Total de candidatos
                    <InfoTip text="Total de candidatos que se inscreveram nas suas vagas e estão em processo de avaliação comportamental." />
                  </CardDescription>
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCandidates}</div>
                  <p className="text-xs text-muted-foreground mt-1">em avaliação</p>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <Link to="/jobs" className="block h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <ClipboardList className="w-5 h-5 text-primary" />
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-sm">Gerenciar vagas</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Criar vagas e definir perfis ideais</p>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <Link to="/candidates" className="block h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-sm">Ver candidatos</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Avaliações DISC e Temperamentos</p>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </section>

          {/* ═══════ CAMADA 5 — PROGRESSO ═══════ */}
          <OrgProgressChecklist data={journeyData} />
        </div>
      </TooltipProvider>
    </BusinessLayout>
  );
}
