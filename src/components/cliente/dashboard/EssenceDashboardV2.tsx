/**
 * EssenceDashboardV2 — Admin-only premium dark dashboard.
 * Shows a rich visual reading of the user's Código da Essência.
 * Never replaces the v1 stages; rendered only when admin toggles to V2.
 */

import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  Heart,
  Activity,
  Compass,
  Star,
  Flame,
  Zap,
  ArrowRight,
  Shield,
  Eye,
  Sun,
  Moon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useImpersonate } from "@/contexts/ImpersonateContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserTest {
  id: string;
  test_id: string;
  status: string;
  result_data: any;
  completed_at?: string | null;
}

interface MapaSection {
  id: string;
  frase_sintese?: string;
  quem_voce_e?: string;
  maior_forca?: string;
  maior_risco?: string;
  tensao_central?: string;
  direcao_90_dias?: string;
  tres_forcas_centrais?: string[];
  [key: string]: any;
}

interface EssenceDashboardV2Props {
  displayName: string;
  userTests?: UserTest[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TEMPERAMENTO_COLORS: Record<string, string> = {
  Colérico: "#b91c1c",
  Melancólico: "#6366f1",
  Sanguíneo: "#f59e0b",
  Fleumático: "#10b981",
};

const DISC_COLORS: Record<string, string> = {
  D: "#b91c1c",
  I: "#f59e0b",
  S: "#10b981",
  C: "#6366f1",
};

const DISC_LABELS: Record<string, string> = {
  D: "Dominância",
  I: "Influência",
  S: "Estabilidade",
  C: "Conformidade",
};

function getTemperaData(userTests: UserTest[]) {
  const t = userTests.find(
    (ut) =>
      ut.status === "completed" &&
      (ut.result_data?.primary?.name || ut.result_data?.primary)
  );
  if (!t) return null;
  const d = t.result_data;
  const primary =
    typeof d.primary === "object" ? d.primary.name : d.primary;
  const secondary =
    typeof d.secondary === "object" ? d.secondary?.name : d.secondary;
  const pPct = d.primary?.percentage ?? d.scores?.[primary] ?? 32;
  const sPct = d.secondary?.percentage ?? d.scores?.[secondary] ?? 28;
  return { primary, secondary, pPct, sPct };
}

function getDiscData(userTests: UserTest[]) {
  const t = userTests.find(
    (ut) => ut.status === "completed" && ut.result_data?.dominantProfile
  );
  if (!t) return null;
  const d = t.result_data;
  const scores = d.scores || { D: d.D ?? 0, I: d.I ?? 0, S: d.S ?? 0, C: d.C ?? 0 };
  const dominant = d.dominantProfile as string;
  return { scores, dominant };
}

function getArquetipoData(userTests: UserTest[]) {
  const t = userTests.find(
    (ut) =>
      ut.status === "completed" &&
      (ut.result_data?.dominantArchetypes?.primary?.archetype ||
        ut.result_data?.primary?.archetype)
  );
  if (!t) return null;
  const d = t.result_data;
  const primary =
    d.dominantArchetypes?.primary?.archetype || d.primary?.archetype || "";
  const secondary =
    d.dominantArchetypes?.secondary?.archetype || d.secondary?.archetype || "";
  return { primary, secondary };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/70 mb-2">
      {children}
    </p>
  );
}

function Card2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#1e293b] p-5 ${className}`}>
      {children}
    </div>
  );
}

// Radial Bar for temperamentos
function TemperaChart({ primary, secondary, pPct, sPct }: { primary: string; secondary: string; pPct: number; sPct: number }) {
  const data = [
    { name: secondary, value: sPct, fill: TEMPERAMENTO_COLORS[secondary] ?? "#6366f1" },
    { name: primary, value: pPct, fill: TEMPERAMENTO_COLORS[primary] ?? "#b91c1c" },
  ];
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="80%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#ffffff08" }} />
          <Tooltip
            contentStyle={{ background: "#1e293b", border: "1px solid #ffffff20", borderRadius: 8 }}
            itemStyle={{ color: "#f8fafc" }}
            formatter={(v: any) => [`${v}%`, ""]}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-1">
        {data.slice().reverse().map((d) => (
          <span key={d.name} className="flex items-center gap-1 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.fill }} />
            {d.name} <span className="text-white font-semibold">{d.value}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Bar Chart for DISC
function DiscChart({ scores, dominant }: { scores: Record<string, number>; dominant: string }) {
  const data = Object.entries(scores).map(([key, val]) => ({
    key,
    label: DISC_LABELS[key] ?? key,
    value: val,
    fill: DISC_COLORS[key] ?? "#64748b",
    dominant: key === dominant,
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
        <XAxis dataKey="key" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #ffffff20", borderRadius: 8 }}
          itemStyle={{ color: "#f8fafc" }}
          formatter={(v: any) => [v, ""]}
          labelFormatter={(label) => DISC_LABELS[label] ?? label}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.key}
              fill={entry.fill}
              opacity={entry.dominant ? 1 : 0.45}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Thermometer: two-pole gradient bar
function ThermometerBar({ leftLabel, rightLabel }: { leftLabel: string; rightLabel: string }) {
  return (
    <div className="space-y-2">
      <div className="h-3 rounded-full w-full" style={{ background: "linear-gradient(to right, #10b981, #fbbf24, #ef4444)" }} />
      <div className="flex justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-emerald-400" />{leftLabel}</span>
        <span className="flex items-center gap-1">{rightLabel}<Moon className="w-3 h-3 text-red-400" /></span>
      </div>
      <p className="text-xs text-slate-500 text-center">Centro = equilíbrio ideal</p>
    </div>
  );
}

// Quadrant card
function QuadrantCard({ icon: Icon, color, title, text }: { icon: any; color: string; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0f172a]/60 p-4 flex flex-col gap-2 hover:border-amber-400/30 transition-colors cursor-default">
      <div className="flex items-center gap-2">
        <div className="rounded-lg p-1.5" style={{ background: color + "22" }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-sm font-semibold text-white/90">{title}</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
}

// Roadmap milestone
function Milestone({ month, label, sub, active }: { month: string; label: string; sub: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-2 ${active ? "bg-amber-400 border-amber-400 text-slate-900" : "bg-[#1e293b] border-white/20 text-slate-400"}`}>
        {month}
      </div>
      <p className={`text-xs font-semibold text-center ${active ? "text-amber-400" : "text-slate-300"}`}>{label}</p>
      <p className="text-[10px] text-slate-500 text-center max-w-[80px]">{sub}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EssenceDashboardV2({ displayName, userTests = [] }: EssenceDashboardV2Props) {
  const { user } = useAuth();
  const { isImpersonating, impersonatedUserId } = useImpersonate();
  const [mapaSection, setMapaSection] = useState<MapaSection | null>(null);
  const [isLoadingMapa, setIsLoadingMapa] = useState(true);

  const effectiveUserId = isImpersonating ? impersonatedUserId : user?.id;

  useEffect(() => {
    if (!effectiveUserId) { setIsLoadingMapa(false); return; }
    supabase
      .from("mapa_essencia")
      .select("sections")
      .eq("user_id", effectiveUserId)
      .maybeSingle()
      .then(({ data }) => {
        const sections = Array.isArray(data?.sections) ? (data!.sections as any[]) : [];
        const resumo = sections.find((s) => s.id === "resumo_executivo") || sections[0] || null;
        setMapaSection(resumo);
        setIsLoadingMapa(false);
      });
  }, [effectiveUserId]);

  const tempera = getTemperaData(userTests);
  const disc = getDiscData(userTests);
  const arquetipo = getArquetipoData(userTests);

  const sintese = mapaSection?.frase_sintese || mapaSection?.quem_voce_e || null;
  const maisForca = mapaSection?.maior_forca;
  const maisRisco = mapaSection?.maior_risco;
  const direcao = mapaSection?.direcao_90_dias;
  const tresforcas: string[] = Array.isArray(mapaSection?.tres_forcas_centrais)
    ? mapaSection!.tres_forcas_centrais
    : [];

  const hasMapa = !isLoadingMapa && !!sintese;

  // Quadrant content derived from arquétipos + temperamentos
  const quadrants = [
    {
      icon: Briefcase,
      color: "#fbbf24",
      title: "Carreira",
      text: arquetipo
        ? `Seu arquétipo ${arquetipo.primary} impulsiona liderança por visão. Cuidado com decisões impulsivas.`
        : "Complete os testes para ver seu direcionamento de carreira.",
    },
    {
      icon: Heart,
      color: "#ec4899",
      title: "Relações",
      text: tempera
        ? `${tempera.primary} exige resultado — equilibre com escuta ativa. Seu ${tempera.secondary ?? "segundo temperamento"} busca profundidade.`
        : "Complete os testes para ver seu perfil relacional.",
    },
    {
      icon: Activity,
      color: "#10b981",
      title: "Saúde",
      text: tempera
        ? `Alta energia ${tempera.primary} queima rápido. Rituais de recarga são essenciais.`
        : "Complete os testes para ver insights de saúde.",
    },
    {
      icon: Compass,
      color: "#818cf8",
      title: "Sentido",
      text: arquetipo
        ? `${arquetipo.primary}${arquetipo.secondary ? ` + ${arquetipo.secondary}` : ""} — vocação em inspirar, construir legado e mover pessoas.`
        : "Complete os testes para ver seu propósito.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* ── Hero ── */}
        <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #fbbf24 0%, transparent 60%)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Código da Essência</span>
              <span className="ml-auto bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" /> Top 10%
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
              {displayName}
            </h1>
            {isLoadingMapa ? (
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
              </div>
            ) : hasMapa ? (
              <blockquote className="border-l-2 border-amber-400 pl-4 text-slate-300 text-base leading-relaxed italic">
                "{sintese}"
              </blockquote>
            ) : (
              <p className="text-slate-400 text-sm">Gere o Código da Essência para ver a síntese completa.</p>
            )}

            {tresforcas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tresforcas.map((f, i) => (
                  <span key={i} className="text-xs bg-amber-400/10 border border-amber-400/30 text-amber-300 rounded-full px-3 py-1">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Temperamentos */}
          <Card2>
            <SectionLabel>Temperamentos</SectionLabel>
            {tempera ? (
              <TemperaChart
                primary={tempera.primary}
                secondary={tempera.secondary ?? ""}
                pPct={tempera.pPct}
                sPct={tempera.sPct}
              />
            ) : (
              <div className="h-36 flex items-center justify-center">
                <p className="text-slate-500 text-sm">Teste não realizado</p>
              </div>
            )}
          </Card2>

          {/* DISC */}
          <Card2>
            <div className="flex items-center justify-between mb-1">
              <SectionLabel>DISC</SectionLabel>
              {disc && (
                <span className="text-xs font-bold text-white bg-[#b91c1c]/30 border border-red-700/40 px-2 py-0.5 rounded-full">
                  Dominância {disc.dominant}
                </span>
              )}
            </div>
            {disc ? (
              <DiscChart scores={disc.scores} dominant={disc.dominant} />
            ) : (
              <div className="h-36 flex items-center justify-center">
                <p className="text-slate-500 text-sm">Teste não realizado</p>
              </div>
            )}
          </Card2>
        </div>

        {/* ── Estado / Termômetro ── */}
        <Card2>
          <SectionLabel>Estado Interior</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-300 mb-3">
                Tensão entre liderança presente e controle sob pressão:
              </p>
              <ThermometerBar leftLabel="Em Paz (Liderança)" rightLabel="Sob Pressão (Controle)" />
            </div>
            <div className="space-y-3">
              {maisForca && (
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Maior Força</p>
                    <p className="text-sm text-white">{maisForca}</p>
                  </div>
                </div>
              )}
              {maisRisco && (
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Maior Risco</p>
                    <p className="text-sm text-white">{maisRisco}</p>
                  </div>
                </div>
              )}
              {!maisForca && !maisRisco && (
                <p className="text-slate-500 text-sm">Gere o Código da Essência para ver detalhes.</p>
              )}
            </div>
          </div>
        </Card2>

        {/* ── Arquétipo Badge ── */}
        {arquetipo && (
          <Card2 className="flex items-center gap-4">
            <div className="rounded-xl bg-amber-400/10 border border-amber-400/30 p-3 shrink-0">
              <Eye className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <SectionLabel>Arquétipos de Propósito</SectionLabel>
              <p className="text-white font-semibold">
                {arquetipo.primary}
                {arquetipo.secondary && <span className="text-amber-400"> + {arquetipo.secondary}</span>}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Combinação rara que une visão estratégica com profundidade reflexiva.
              </p>
            </div>
          </Card2>
        )}

        {/* ── Quadrants ── */}
        <div>
          <SectionLabel>Quadrantes de Vida</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {quadrants.map((q) => (
              <QuadrantCard key={q.title} icon={q.icon} color={q.color} title={q.title} text={q.text} />
            ))}
          </div>
        </div>

        {/* ── Roadmap 90 Days ── */}
        <Card2>
          <SectionLabel>Roadmap 90 Dias</SectionLabel>
          <p className="text-xs text-slate-500 mb-4">
            {direcao || "Direção sugerida com base no seu perfil de essência."}
          </p>
          <div className="flex items-start gap-2">
            <Milestone month="M1" label="Desapego" sub="Soltar o que não serve mais" active />
            <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-400/60 to-white/10 mt-4 rounded" />
            <Milestone month="M2" label="Escuta" sub="Presença profunda com o outro" />
            <div className="flex-1 h-0.5 bg-white/10 mt-4 rounded" />
            <Milestone month="M3" label="Celebração" sub="Integrar e compartilhar o ganho" />
          </div>
        </Card2>

        {/* ── Admin watermark ── */}
        <p className="text-center text-xs text-slate-700 select-none">
          Visualização V2 — modo admin · não visível para clientes
        </p>
      </div>
    </div>
  );
}
