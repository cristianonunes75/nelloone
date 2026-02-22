/**
 * Nello Control Center - Mission Control dashboard for the Nello One ecosystem.
 * Centralizes monitoring of Identity, Praxis, Business, and Discernir.
 * Access: admin / super_admin only.
 */

import { useState, useEffect } from 'react';
import {
  Users, Briefcase, Building2, DollarSign, Cpu,
  TrendingUp, TrendingDown, Activity, RefreshCw,
  UserCheck, BookOpen, CreditCard, AlertTriangle,
  ToggleLeft, Zap, ServerCrash, Layers,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getEcosystemMetrics, type EcosystemMetrics } from '@/services/getEcosystemMetrics';

// ─── Metric Card ────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  accent?: string;
}

function MetricCard({ label, value, icon, trend, subtitle, accent }: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-border hover:shadow-sm">
      {/* Subtle accent glow */}
      {accent && (
        <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.07] ${accent}`} />
      )}
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
            {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
            {trend === 'neutral' && <Minus className="w-3 h-3" />}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────

function SectionHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/80">{title}</h3>
      {badge && (
        <Badge variant="outline" className="text-[10px] ml-auto">{badge}</Badge>
      )}
    </div>
  );
}

// ─── Module Status Indicator ────────────────────────────

function ModuleStatus({ modules }: { modules: string[] }) {
  const moduleColors: Record<string, string> = {
    Identity: 'bg-primary',
    Praxis: 'bg-emerald-500',
    Business: 'bg-amber-500',
    Discernir: 'bg-sky-500',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {modules.map(mod => (
        <div key={mod} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/50 bg-card">
          <div className={`w-2 h-2 rounded-full ${moduleColors[mod] || 'bg-muted-foreground'}`} />
          <span className="text-xs font-medium text-foreground/80">{mod}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────

export function AdminControlCenter() {
  const [metrics, setMetrics] = useState<EcosystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await getEcosystemMetrics();
      setMetrics(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching ecosystem metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading && !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const formatCurrency = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <Cpu className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Control Center</h1>
              <p className="text-xs text-muted-foreground">
                Visão executiva do ecossistema Nello One
                {lastUpdate && (
                  <> · Atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</>
                )}
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMetrics}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Active Modules */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Módulos ativos</span>
        <ModuleStatus modules={metrics.system.activeModules} />
      </div>

      {/* ── USERS ──────────────────────────────── */}
      <section>
        <SectionHeader icon={<Users className="w-4 h-4" />} title="Usuários" badge="Identity" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="Total de usuários"
            value={metrics.users.total.toLocaleString('pt-BR')}
            icon={<Users className="w-4 h-4" />}
            accent="bg-primary"
          />
          <MetricCard
            label="Novos (7 dias)"
            value={metrics.users.newLast7Days}
            icon={<TrendingUp className="w-4 h-4" />}
            trend={metrics.users.newLast7Days > 0 ? 'up' : 'neutral'}
            accent="bg-primary"
          />
          <MetricCard
            label="Códigos ativados"
            value={metrics.users.codigosEssenciaAtivados.toLocaleString('pt-BR')}
            icon={<Zap className="w-4 h-4" />}
            accent="bg-primary"
          />
          <MetricCard
            label="Ativos (7 dias)"
            value={metrics.users.activeUsers}
            icon={<Activity className="w-4 h-4" />}
            trend={metrics.users.activeUsers > 0 ? 'up' : 'neutral'}
            accent="bg-primary"
          />
        </div>
      </section>

      {/* ── OPERATORS ──────────────────────────── */}
      <section>
        <SectionHeader icon={<UserCheck className="w-4 h-4" />} title="Operadores" badge="Praxis" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="Operadores ativos"
            value={metrics.operators.active}
            icon={<UserCheck className="w-4 h-4" />}
            accent="bg-emerald-500"
          />
          <MetricCard
            label="Clientes / operador"
            value={metrics.operators.avgClientsPerOperator}
            icon={<Users className="w-4 h-4" />}
            subtitle="média"
            accent="bg-emerald-500"
          />
          <MetricCard
            label="Empresas vinculadas"
            value={metrics.operators.companiesLinked}
            icon={<Building2 className="w-4 h-4" />}
            accent="bg-emerald-500"
          />
          <MetricCard
            label="Programas ativos"
            value={metrics.operators.activeProgramas}
            icon={<BookOpen className="w-4 h-4" />}
            accent="bg-emerald-500"
          />
        </div>
      </section>

      {/* ── COMPANIES ──────────────────────────── */}
      <section>
        <SectionHeader icon={<Building2 className="w-4 h-4" />} title="Empresas" badge="Business" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="Empresas cadastradas"
            value={metrics.companies.total}
            icon={<Building2 className="w-4 h-4" />}
            accent="bg-amber-500"
          />
          <MetricCard
            label="Colaboradores mapeados"
            value={metrics.companies.colaboradoresMapeados}
            icon={<Users className="w-4 h-4" />}
            accent="bg-amber-500"
          />
          <MetricCard
            label="Assinaturas ativas"
            value={metrics.companies.activeSubscriptions}
            icon={<CreditCard className="w-4 h-4" />}
            accent="bg-amber-500"
          />
          <MetricCard
            label="Renovações (30 dias)"
            value={metrics.companies.renewalsNext30Days}
            icon={<AlertTriangle className="w-4 h-4" />}
            trend={metrics.companies.renewalsNext30Days > 0 ? 'down' : 'neutral'}
            subtitle="atenção necessária"
            accent="bg-amber-500"
          />
        </div>
      </section>

      {/* ── FINANCIAL ──────────────────────────── */}
      <section>
        <SectionHeader icon={<DollarSign className="w-4 h-4" />} title="Financeiro" badge="Receita" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="MRR Individual"
            value={formatCurrency(metrics.financial.mrrIndividual)}
            icon={<TrendingUp className="w-4 h-4" />}
            accent="bg-primary"
          />
          <MetricCard
            label="MRR Corporate"
            value={formatCurrency(metrics.financial.mrrCorporate)}
            icon={<Building2 className="w-4 h-4" />}
            accent="bg-amber-500"
          />
          <MetricCard
            label="Receita total"
            value={formatCurrency(metrics.financial.totalRevenue)}
            icon={<DollarSign className="w-4 h-4" />}
            trend={metrics.financial.totalRevenue > 0 ? 'up' : 'neutral'}
            accent="bg-emerald-500"
          />
          <MetricCard
            label="Churn rate"
            value={`${metrics.financial.churnRate}%`}
            icon={<TrendingDown className="w-4 h-4" />}
            trend={metrics.financial.churnRate > 10 ? 'down' : metrics.financial.churnRate > 0 ? 'neutral' : 'up'}
            accent="bg-destructive"
          />
        </div>
      </section>

      {/* ── SYSTEM ─────────────────────────────── */}
      <section>
        <SectionHeader icon={<Cpu className="w-4 h-4" />} title="Sistema" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="Feature Flags"
            value={`${metrics.system.featureFlagsEnabled}/${metrics.system.featureFlagsTotal}`}
            icon={<ToggleLeft className="w-4 h-4" />}
            subtitle="habilitadas"
          />
          <MetricCard
            label="Uso de IA (est.)"
            value="—"
            icon={<Zap className="w-4 h-4" />}
            subtitle="requer analytics"
          />
          <MetricCard
            label="Erros recentes"
            value={metrics.system.recentErrors}
            icon={<ServerCrash className="w-4 h-4" />}
            trend={metrics.system.recentErrors === 0 ? 'up' : 'down'}
          />
          <MetricCard
            label="Módulos ativos"
            value={metrics.system.activeModules.length}
            icon={<Layers className="w-4 h-4" />}
            subtitle={metrics.system.activeModules.join(', ')}
          />
        </div>
      </section>

      {/* Footer */}
      <div className="text-[10px] text-muted-foreground/50 text-center pt-4 border-t border-border/30">
        Nello Control Center · Dados agregados em tempo real · Sem dados individuais expostos
      </div>
    </div>
  );
}

export default AdminControlCenter;
