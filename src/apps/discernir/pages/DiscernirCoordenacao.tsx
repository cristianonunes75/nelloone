import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Loader2,
  Users,
  Download,
  Search,
  Sparkles,
  Heart,
  User as UserIcon,
  Wand2,
  Save,
  Check,
  ClipboardCopy,
  ChevronDown,
  Brain,
  RefreshCw,
  Activity,
  Mail,
  CircleDot,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  type CircleProfileResult,
  type BlockKey,
  type CircleProfilePercentages,
  type CircleProfileRanking,
  getBlockLabel,
} from '../utils/circleProfileCalculation';
import { downloadPerfilServicoPDF } from '../utils/perfilServicoPDF';
import { gerarLeituraPerfilServico, leituraToText } from '../utils/perfilServicoLeitura';
import {
  calcCompatibilitiesFor,
  calcSpouseBondReading,
  type PairMember,
  type PairCompatibility,
} from '../utils/circleCompatibility';
import { cn } from '@/lib/utils';

type ParticipantType = 'casal' | 'jovem' | null;

interface TeamProfile {
  id: string;
  user_id: string;
  display_name: string;
  primary_role: string;
  secondary_role: string | null;
  tertiary_role: string | null;
  percentages: CircleProfilePercentages;
  ranking: CircleProfileRanking[];
  participant_type: ParticipantType;
  spouse_user_id: string | null;
  gender: 'masculino' | 'feminino' | null;
  birth_date: string | null;
  coordinator_notes: string | null;
  created_at: string;
}

function calcAge(birth: string | null): number | null {
  if (!birth) return null;
  const d = new Date(birth);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

interface MovementRow {
  user_id: string;
  display_name: string;
  email: string;
  journey_status: 'cadastrado' | 'em_andamento' | 'concluido';
  registered_at: string;
  started_at: string | null;
  completed_at: string | null;
  last_activity_at: string;
  profile_id: string | null;
  primary_role: string | null;
  participant_type: string | null;
}

const ROLE_COLORS: Record<string, string> = {
  'Condutor': 'bg-amber-100 text-amber-900 border-amber-300',
  'Pastor do Círculo': 'bg-rose-100 text-rose-900 border-rose-300',
  'Facilitador': 'bg-sky-100 text-sky-900 border-sky-300',
  'Guardião do Clima': 'bg-emerald-100 text-emerald-900 border-emerald-300',
  'Intercessor': 'bg-violet-100 text-violet-900 border-violet-300',
};

const ALL_ROLES = ['Condutor', 'Pastor do Círculo', 'Facilitador', 'Guardião do Clima', 'Intercessor'];

export function DiscernirCoordenacao() {
  const { user, isLoading: authLoading } = useAuth();
  const { role, isLoading: discernirLoading } = useDiscernirAuth();
  const { isSuperAdmin, isLoading: adminLoading } = useAdminPermissions();
  const { toast } = useToast();

  const [profiles, setProfiles] = useState<TeamProfile[]>([]);
  const [movement, setMovement] = useState<MovementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [suggestedCircles, setSuggestedCircles] = useState<TeamProfile[][] | null>(null);

  const isCoordinator = role === 'priest' || role === 'coordinator' || isSuperAdmin;

  const loadProfiles = async () => {
    try {
      const [profilesRes, movementRes] = await Promise.all([
        supabase
          .from('discernir_circle_profiles_team_view' as any)
          .select('*')
          .order('created_at', { ascending: false }),
        supabase.rpc('get_discernir_team_movement' as any),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      setProfiles((profilesRes.data || []) as unknown as TeamProfile[]);

      if (movementRes.error) {
        console.warn('Movement load failed:', movementRes.error);
      } else {
        setMovement((movementRes.data || []) as unknown as MovementRow[]);
      }
    } catch (err: any) {
      console.error('Error loading team profiles:', err);
      toast({
        title: 'Erro ao carregar perfis',
        description: err?.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || discernirLoading || adminLoading) return;
    if (!isCoordinator) {
      setLoading(false);
      return;
    }
    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, discernirLoading, adminLoading, isCoordinator]);

  const updateProfileMarker = async (
    profileId: string,
    patch: Partial<Pick<TeamProfile, 'participant_type' | 'spouse_user_id' | 'gender' | 'birth_date'>>,
  ) => {
    setSavingId(profileId);
    try {
      const { error } = await supabase
        .from('discernir_circle_profiles')
        .update(patch)
        .eq('id', profileId);
      if (error) throw error;

      // Reciprocal spouse link: if setting a spouse, also set the reverse
      if ('spouse_user_id' in patch) {
        const target = profiles.find((p) => p.id === profileId);
        if (target) {
          // Clear any other person who currently points to target.user_id (except new spouse)
          const others = profiles.filter(
            (p) =>
              p.spouse_user_id === target.user_id &&
              p.user_id !== patch.spouse_user_id,
          );
          for (const o of others) {
            await supabase
              .from('discernir_circle_profiles')
              .update({ spouse_user_id: null })
              .eq('id', o.id);
          }
          // Set reverse link on the new spouse
          if (patch.spouse_user_id) {
            const spouseProfile = profiles.find((p) => p.user_id === patch.spouse_user_id);
            if (spouseProfile) {
              await supabase
                .from('discernir_circle_profiles')
                .update({
                  spouse_user_id: target.user_id,
                  participant_type: 'casal',
                })
                .eq('id', spouseProfile.id);
            }
          }
        }
      }

      await loadProfiles();
      setSuggestedCircles(null);
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: err?.message,
        variant: 'destructive',
      });
    } finally {
      setSavingId(null);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return profiles;
    const q = search.toLowerCase();
    return profiles.filter(
      (p) =>
        p.display_name?.toLowerCase().includes(q) ||
        p.primary_role?.toLowerCase().includes(q),
    );
  }, [profiles, search]);

  const couples = useMemo(() => filtered.filter((p) => p.participant_type === 'casal'), [filtered]);
  const youth = useMemo(() => filtered.filter((p) => p.participant_type === 'jovem'), [filtered]);
  const unset = useMemo(() => filtered.filter((p) => !p.participant_type), [filtered]);

  // Group couples into pairs (avoid duplicates)
  const couplePairs = useMemo(() => {
    const seen = new Set<string>();
    const pairs: { a: TeamProfile; b: TeamProfile | null }[] = [];
    for (const p of couples) {
      if (seen.has(p.user_id)) continue;
      const partner = p.spouse_user_id
        ? couples.find((c) => c.user_id === p.spouse_user_id) || null
        : null;
      pairs.push({ a: p, b: partner });
      seen.add(p.user_id);
      if (partner) seen.add(partner.user_id);
    }
    return pairs;
  }, [couples]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    profiles.forEach((p) => {
      counts[p.primary_role] = (counts[p.primary_role] || 0) + 1;
    });
    return counts;
  }, [profiles]);

  const handleDownload = (p: TeamProfile) => {
    const result: CircleProfileResult = {
      version: 'v1',
      primary_role: p.primary_role,
      secondary_role: p.secondary_role || '',
      tertiary_role: p.tertiary_role || '',
      scores: {} as any,
      percentages: p.percentages,
      ranking: p.ranking,
      summary_text: '',
    };
    downloadPerfilServicoPDF(result, p.display_name);
  };

  /**
   * Constrói círculos balanceados de forma DETERMINÍSTICA — mesma entrada,
   * mesma saída. Sem aleatoriedade. Best-fit por compatibilidade real:
   *  1. Cada casal âncora um círculo (ordem fixa por user_id).
   *  2. Para cada vaga restante, escolhe o jovem que MAIS soma ao círculo
   *     (média de score de compatibilidade com os já presentes), respeitando:
   *      - alternância de sexo (1H + 1M no mínimo);
   *      - diversidade de papel pastoral;
   *      - proximidade de idade entre os jovens do mesmo círculo.
   */
  const buildSuggestedCircles = () => {
    const linkedPairs = couplePairs.filter((p) => p.b !== null) as {
      a: TeamProfile;
      b: TeamProfile;
    }[];
    const soloCouples = couplePairs.filter((p) => p.b === null).map((p) => p.a);

    if (linkedPairs.length === 0 && soloCouples.length === 0) {
      toast({
        title: 'Nenhum casal cadastrado',
        description: 'Marque ao menos uma pessoa como "casal" para gerar a sugestão.',
        variant: 'destructive',
      });
      return;
    }

    const totalCouples = linkedPairs.length + soloCouples.length;
    const minYouthNeeded = totalCouples * 2;
    if (youth.length === 0) {
      toast({
        title: 'Nenhum jovem marcado',
        description: 'Marque pelo menos uma pessoa como "jovem" para gerar círculos.',
        variant: 'destructive',
      });
      return;
    }
    const youthShortage = Math.max(0, minYouthNeeded - youth.length);

    // Ordem determinística dos círculos: pelo menor user_id do casal âncora
    const sortedLinked = [...linkedPairs].sort((x, y) =>
      x.a.user_id.localeCompare(y.a.user_id),
    );
    const sortedSolo = [...soloCouples].sort((x, y) =>
      x.user_id.localeCompare(y.user_id),
    );
    const circles: TeamProfile[][] = [
      ...sortedLinked.map(({ a, b }) => [a, b]),
      ...sortedSolo.map((a) => [a]),
    ];

    const toPair = (p: TeamProfile): PairMember => ({
      user_id: p.user_id,
      display_name: p.display_name,
      primary_role: p.primary_role,
      percentages: p.percentages,
      spouse_user_id: p.spouse_user_id,
      participant_type: p.participant_type,
    });

    /** Score do jovem em relação a um círculo já parcial. */
    const scoreFit = (j: TeamProfile, circle: TeamProfile[]): number => {
      const jPair = toPair(j);
      // 1) Compatibilidade média com membros atuais (0–100)
      const compats = circle.map((m) => {
        const list = calcCompatibilitiesFor(jPair, [toPair(m)]);
        return list[0]?.score ?? 50;
      });
      const avgCompat = compats.length
        ? compats.reduce((s, v) => s + v, 0) / compats.length
        : 50;

      // 2) Bônus por equilíbrio de gênero (priorizar o sexo faltante entre jovens)
      const youthInCircle = circle.filter((m) => m.participant_type === 'jovem');
      const men = youthInCircle.filter((m) => m.gender === 'masculino').length;
      const women = youthInCircle.filter((m) => m.gender === 'feminino').length;
      let genderBonus = 0;
      if (j.gender === 'masculino' && men < women) genderBonus = 20;
      else if (j.gender === 'feminino' && women < men) genderBonus = 20;
      else if (j.gender && men === women) genderBonus = 10;
      else if (!j.gender) genderBonus = -5;

      // 3) Bônus por diversidade de papel pastoral
      const rolesPresent = new Set(circle.map((m) => m.primary_role));
      const roleBonus = rolesPresent.has(j.primary_role) ? 0 : 8;

      // 4) Proximidade de idade entre jovens (penaliza diferença grande)
      const jAge = calcAge(j.birth_date);
      const youthAges = youthInCircle
        .map((m) => calcAge(m.birth_date))
        .filter((a): a is number => a !== null);
      let ageBonus = 0;
      if (jAge !== null && youthAges.length > 0) {
        const avgAge = youthAges.reduce((s, v) => s + v, 0) / youthAges.length;
        const diff = Math.abs(jAge - avgAge);
        // 0 anos => +12, 5 anos => +2, 10+ anos => -3
        ageBonus = Math.max(-3, 12 - diff * 2);
      }

      // 5) Penalidade por círculo cheio (incentivar distribuição)
      const sizePenalty = -circle.length * 1.5;

      return avgCompat + genderBonus + roleBonus + ageBonus + sizePenalty;
    };

    // FASE 1: garantir mínimo de 2 jovens por círculo (1 casal + 2 jovens).
    // Round-robin best-fit: para cada círculo (em ordem), aloca o melhor jovem disponível.
    const remaining = [...youth].sort((a, b) => a.user_id.localeCompare(b.user_id));
    for (let pass = 0; pass < 2; pass++) {
      for (let ci = 0; ci < circles.length; ci++) {
        if (remaining.length === 0) break;
        let bestJ = -1;
        let bestScore = -Infinity;
        for (let ji = 0; ji < remaining.length; ji++) {
          const s = scoreFit(remaining[ji], circles[ci]);
          if (s > bestScore) {
            bestScore = s;
            bestJ = ji;
          }
        }
        if (bestJ >= 0) {
          circles[ci].push(remaining[bestJ]);
          remaining.splice(bestJ, 1);
        }
      }
    }

    // FASE 2: distribui jovens restantes pelo melhor (jovem, círculo).
    while (remaining.length > 0) {
      let bestJ = -1;
      let bestC = -1;
      let bestScore = -Infinity;
      for (let ji = 0; ji < remaining.length; ji++) {
        for (let ci = 0; ci < circles.length; ci++) {
          const s = scoreFit(remaining[ji], circles[ci]);
          if (s > bestScore) {
            bestScore = s;
            bestJ = ji;
            bestC = ci;
          }
        }
      }
      if (bestJ < 0) break;
      circles[bestC].push(remaining[bestJ]);
      remaining.splice(bestJ, 1);
    }

    setSuggestedCircles(circles);

    if (youthShortage > 0) {
      toast({
        title: `Faltam ${youthShortage} jovem(ns)`,
        description: `O ideal é 2 jovens por círculo (${minYouthNeeded} no total). Algum círculo ficará com apenas 1 jovem — adicione mais quando puder.`,
      });
    }

    const unknownGender = youth.filter((y) => !y.gender).length;
    if (unknownGender > 0) {
      toast({
        title: `${unknownGender} jovem(ns) sem sexo marcado`,
        description: 'Marque o sexo (Masculino/Feminino) para garantir o equilíbrio H/M.',
      });
    }
  };

  /** Move um membro (jovem) entre círculos. Casais não podem ser movidos.
   *  Bloqueia movimentos que deixariam o círculo de origem com menos de 2 jovens. */
  const moveMember = (memberId: string, targetCircleIdx: number) => {
    if (!suggestedCircles) return;
    const newCircles = suggestedCircles.map((c) => [...c]);
    let found: TeamProfile | null = null;
    for (let ci = 0; ci < newCircles.length; ci++) {
      const circle = newCircles[ci];
      const idx = circle.findIndex((m) => m.id === memberId);
      if (idx >= 0) {
        if (circle[idx].participant_type === 'casal') return; // casais fixos
        if (ci !== targetCircleIdx) {
          const youthCount = circle.filter((m) => m.participant_type === 'jovem').length;
          if (youthCount <= 2) {
            toast({
              title: 'Movimento bloqueado',
              description: 'Cada círculo precisa ter no mínimo 2 jovens. Faça uma troca direta com um jovem do outro círculo.',
              variant: 'destructive',
            });
            return;
          }
        }
        found = circle.splice(idx, 1)[0];
        break;
      }
    }
    if (!found) return;
    if (targetCircleIdx < 0 || targetCircleIdx >= newCircles.length) return;
    newCircles[targetCircleIdx].push(found);
    setSuggestedCircles(newCircles);
  };


  if (authLoading || discernirLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isCoordinator) return <Navigate to="/dashboard" replace />;

  const renderProfileCard = (p: TeamProfile, opts?: { compact?: boolean }) => {
    const compact = opts?.compact;
    const spouseOptions = profiles.filter(
      (o) => o.user_id !== p.user_id && (o.participant_type === 'casal' || !o.participant_type),
    );

    return (
      <Card key={p.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold text-foreground truncate">
                {p.display_name}
              </CardTitle>
              <Badge
                variant="outline"
                className={cn('text-xs w-fit mt-1', ROLE_COLORS[p.primary_role] || '')}
              >
                {p.primary_role}
              </Badge>
            </div>
            {p.participant_type && (
              <Badge variant="secondary" className="text-xs gap-1 shrink-0">
                {p.participant_type === 'casal' ? (
                  <Heart className="w-3 h-3" />
                ) : (
                  <UserIcon className="w-3 h-3" />
                )}
                {p.participant_type === 'casal' ? 'Casal' : 'Jovem'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {!compact && (
            <>
              <div className="space-y-1.5">
                {p.ranking.slice(0, 3).map((r, i) => (
                  <div key={r.role} className="flex items-center justify-between text-xs">
                    <span
                      className={cn(
                        'truncate',
                        i === 0 ? 'font-medium text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {r.role}
                    </span>
                    <span className="font-medium text-amber-800">{r.percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t space-y-1">
                {(['lideranca', 'acolhimento', 'comunicacao', 'equipe', 'espiritualidade', 'conducao'] as BlockKey[]).map(
                  (b) => (
                    <div key={b} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-24 truncate">
                        {getBlockLabel(b)}
                      </span>
                      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-600 rounded-full"
                          style={{ width: `${p.percentages[b] || 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-7 text-right">
                        {p.percentages[b] || 0}%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </>
          )}

          {/* Coordinator markers */}
          <div className="pt-3 border-t space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-14">Tipo:</span>
              <Select
                value={p.participant_type || 'none'}
                onValueChange={(v) =>
                  updateProfileMarker(p.id, {
                    participant_type: v === 'none' ? null : (v as ParticipantType),
                    ...(v !== 'casal' ? { spouse_user_id: null } : {}),
                  })
                }
                disabled={savingId === p.id}
              >
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Não marcado —</SelectItem>
                  <SelectItem value="casal">Casal</SelectItem>
                  <SelectItem value="jovem">Jovem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {p.participant_type === 'casal' && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground w-14">Cônjuge:</span>
                <Select
                  value={p.spouse_user_id || 'none'}
                  onValueChange={(v) =>
                    updateProfileMarker(p.id, {
                      spouse_user_id: v === 'none' ? null : v,
                    })
                  }
                  disabled={savingId === p.id}
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue placeholder="Vincular..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Sem vínculo —</SelectItem>
                    {spouseOptions.map((o) => (
                      <SelectItem key={o.user_id} value={o.user_id}>
                        {o.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-14">Sexo:</span>
              <Select
                value={p.gender || 'none'}
                onValueChange={(v) =>
                  updateProfileMarker(p.id, {
                    gender: v === 'none' ? null : (v as 'masculino' | 'feminino'),
                  })
                }
                disabled={savingId === p.id}
              >
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Não informado —</SelectItem>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {p.participant_type === 'jovem' && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground w-14">Nasc.:</span>
                <Input
                  type="date"
                  value={p.birth_date || ''}
                  onChange={(e) =>
                    updateProfileMarker(p.id, { birth_date: e.target.value || null })
                  }
                  disabled={savingId === p.id}
                  className="h-8 text-xs flex-1"
                />
                {p.birth_date && (
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {calcAge(p.birth_date)} anos
                  </span>
                )}
              </div>
            )}

            {savingId === p.id && (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Salvando...
              </p>
            )}
          </div>

          {/* Leitura pastoral individual + encaixes na equipe */}
          <LeituraPastoralBlock
            percentages={p.percentages}
            primaryRole={p.primary_role}
            secondaryRole={p.secondary_role}
            displayName={p.display_name}
            self={{
              user_id: p.user_id,
              display_name: p.display_name,
              primary_role: p.primary_role,
              percentages: p.percentages,
              spouse_user_id: p.spouse_user_id,
              participant_type: p.participant_type,
            }}
            poolMembers={profiles.map((o) => ({
              user_id: o.user_id,
              display_name: o.display_name,
              primary_role: o.primary_role,
              percentages: o.percentages,
              spouse_user_id: o.spouse_user_id,
              participant_type: o.participant_type,
            }))}
            poolLabel="na equipe"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(p)}
            className="w-full gap-2 mt-1"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar PDF
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-amber-700" />
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Coordenação dos Círculos
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Marque casais e jovens, vincule os cônjuges e gere círculos equilibrados automaticamente.
        </p>
      </div>

      {/* Distribution overview */}
      {profiles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Distribuição da equipe ({profiles.length} {profiles.length === 1 ? 'pessoa' : 'pessoas'})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {Object.entries(roleCounts).map(([r, count]) => (
                <Badge key={r} variant="outline" className={cn('text-xs px-3 py-1', ROLE_COLORS[r] || '')}>
                  {r}: {count}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" /> Casais marcados: {couples.length}
              </span>
              <span className="flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> Jovens marcados: {youth.length}
              </span>
              {unset.length > 0 && (
                <span className="text-amber-700">
                  • {unset.length} sem marcação
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou papel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-amber-700" />
        </div>
      ) : profiles.length === 0 && movement.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Ninguém se cadastrou no Discernir ainda.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="cadastros" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="cadastros" className="gap-1">
              <Activity className="w-3 h-3" /> Cadastros ({movement.length})
            </TabsTrigger>
            <TabsTrigger value="todos">Concluídos ({filtered.length})</TabsTrigger>
            <TabsTrigger value="casais" className="gap-1">
              <Heart className="w-3 h-3" /> Casais ({couples.length})
            </TabsTrigger>
            <TabsTrigger value="jovens" className="gap-1">
              <UserIcon className="w-3 h-3" /> Jovens ({youth.length})
            </TabsTrigger>
            {unset.length > 0 && (
              <TabsTrigger value="pendentes">Sem marcação ({unset.length})</TabsTrigger>
            )}
            <TabsTrigger value="circulos" className="gap-1">
              <Wand2 className="w-3 h-3" /> Sugestão de círculos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cadastros">
            <MovementBoard rows={movement} />
          </TabsContent>

          <TabsContent value="todos">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => renderProfileCard(p))}
            </div>
          </TabsContent>

          <TabsContent value="casais" className="space-y-6">
            {couplePairs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhum casal marcado ainda. Vá em "Todos" e marque o tipo de cada pessoa.
                </CardContent>
              </Card>
            ) : (
              couplePairs.map(({ a, b }, idx) => (
                <div key={a.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <h3 className="text-sm font-semibold text-foreground">
                      Casal {idx + 1}
                      {!b && <span className="text-amber-700 ml-2 text-xs font-normal">(cônjuge não vinculado)</span>}
                    </h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {renderProfileCard(a)}
                    {b && renderProfileCard(b)}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="jovens">
            {youth.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhum jovem marcado ainda.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {youth.map((p) => renderProfileCard(p))}
              </div>
            )}
          </TabsContent>

          {unset.length > 0 && (
            <TabsContent value="pendentes">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unset.map((p) => renderProfileCard(p))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="circulos" className="space-y-4">
            <Card>
              <CardContent className="py-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Wand2 className="w-5 h-5 text-amber-700 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-semibold">Sugestão automática</h3>
                    <p className="text-xs text-muted-foreground">
                      Composição <strong>determinística</strong>: cada casal âncora um círculo
                      e os jovens são alocados ao círculo que <strong>mais soma</strong> em
                      compatibilidade, equilíbrio de gênero (H/M), diversidade de papéis e
                      proximidade de idade. Mesma entrada → mesmo resultado.
                      Você pode <strong>trocar jovens entre círculos</strong> e a leitura da IA
                      se atualiza automaticamente.
                    </p>
                  </div>
                  <Button onClick={buildSuggestedCircles} className="gap-2">
                    <Wand2 className="w-4 h-4" />
                    Gerar sugestão
                  </Button>
                </div>
              </CardContent>
            </Card>

            {suggestedCircles && (
              <div className="space-y-6">
                {suggestedCircles.map((circle, idx) => {
                  const rolesPresent = new Set(circle.map((m) => m.primary_role));
                  const couple = circle.filter((m) => m.participant_type === 'casal');
                  const jovens = circle.filter((m) => m.participant_type === 'jovem');
                  return (
                    <Card key={idx} className="border-amber-200">
                      <CardHeader className="pb-3 bg-amber-50/40">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-700" />
                            Círculo {idx + 1}
                            <span className="text-xs font-normal text-muted-foreground">
                              ({circle.length} pessoas)
                            </span>
                          </CardTitle>
                          <div className="flex flex-wrap gap-1">
                            {ALL_ROLES.map((r) => (
                              <Badge
                                key={r}
                                variant="outline"
                                className={cn(
                                  'text-[10px] px-2',
                                  rolesPresent.has(r)
                                    ? ROLE_COLORS[r]
                                    : 'opacity-30 line-through',
                                )}
                              >
                                {rolesPresent.has(r) && <Check className="w-2.5 h-2.5 mr-0.5" />}
                                {r}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        {couple.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700">
                              <Heart className="w-3 h-3" /> Casal
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {couple.map((m) => (
                                <Badge
                                  key={m.id}
                                  variant="outline"
                                  className={cn('text-xs py-1.5 px-3', ROLE_COLORS[m.primary_role])}
                                >
                                  {m.display_name} · {m.primary_role}
                                </Badge>
                              ))}
                            </div>
                            {couple.some((m) => !m.spouse_user_id) && (
                              <p className="text-[11px] text-amber-800 italic mt-1">
                                ⚠ O cônjuge ainda não fez o Perfil de Serviço — a IA fará a leitura considerando o que se tem hoje.
                              </p>
                            )}
                          </div>
                        )}
                        {jovens.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-sky-700">
                              <UserIcon className="w-3 h-3" /> Jovens ({jovens.length})
                              {(() => {
                                const m = jovens.filter((j) => j.gender === 'masculino').length;
                                const f = jovens.filter((j) => j.gender === 'feminino').length;
                                const u = jovens.filter((j) => !j.gender).length;
                                return (
                                  <span className="text-[10px] font-normal text-muted-foreground">
                                    · {m}H / {f}M{u > 0 ? ` · ${u} sem sexo` : ''}
                                  </span>
                                );
                              })()}
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {jovens.map((m) => {
                                const age = calcAge(m.birth_date);
                                return (
                                  <div key={m.id} className="flex items-center gap-2 flex-wrap">
                                    <Badge
                                      variant="outline"
                                      className={cn('text-xs py-1.5 px-3', ROLE_COLORS[m.primary_role])}
                                    >
                                      {m.display_name}
                                      {m.gender && (
                                        <span className="ml-1 opacity-70">({m.gender === 'masculino' ? 'H' : 'M'})</span>
                                      )}
                                      {age !== null && (
                                        <span className="ml-1 opacity-70">· {age}a</span>
                                      )}
                                      {' · '}
                                      {m.primary_role}
                                    </Badge>
                                    <Select
                                      value={String(idx)}
                                      onValueChange={(v) => moveMember(m.id, Number(v))}
                                    >
                                      <SelectTrigger className="h-7 text-[10px] w-auto px-2 gap-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {suggestedCircles!.map((_, ci) => (
                                          <SelectItem key={ci} value={String(ci)} className="text-xs">
                                            Mover para Círculo {ci + 1}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <LeituraIACirculoBlock
                          key={circle.map((m) => m.id).sort().join('|')}
                          members={circle}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
                <p className="text-xs text-muted-foreground italic text-center">
                  Esta é uma sugestão baseada nos perfis. Ajuste conforme o seu discernimento pastoral.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// =====================================================
// Sub-componente: Leitura pastoral combinada do perfil
// Específico para cada participante (não genérico por papel).
// =====================================================
interface LeituraPastoralBlockProps {
  percentages: CircleProfilePercentages;
  primaryRole: string;
  secondaryRole: string | null;
  displayName: string;
  self?: PairMember;
  poolMembers?: PairMember[];
  poolLabel?: string; // ex.: "neste círculo", "na equipe"
}

function LeituraPastoralBlock({
  percentages,
  primaryRole,
  secondaryRole,
  displayName,
  self,
  poolMembers,
  poolLabel,
}: LeituraPastoralBlockProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const leitura = useMemo(
    () => gerarLeituraPerfilServico(percentages, primaryRole, secondaryRole),
    [percentages, primaryRole, secondaryRole],
  );

  const spouse: PairMember | null = useMemo(() => {
    if (!self?.spouse_user_id || !poolMembers) return null;
    const sp = poolMembers.find((o) => o.user_id === self.spouse_user_id);
    if (!sp) return null;
    // Vínculo recíproco
    if (sp.spouse_user_id && sp.spouse_user_id !== self.user_id) return null;
    return sp;
  }, [self, poolMembers]);

  const encaixes: PairCompatibility[] = useMemo(() => {
    if (!self || !poolMembers || poolMembers.length < 2) return [];
    // Excluir cônjuge dos top encaixes — casal é par fixo, não match
    const filtered = poolMembers.filter(
      (o) => o.user_id !== self.user_id && o.user_id !== self.spouse_user_id,
    );
    return calcCompatibilitiesFor(self, filtered).slice(0, 3);
  }, [self, poolMembers]);

  const vinculoConjugal = useMemo(() => {
    if (!self || !spouse) return null;
    return calcSpouseBondReading(self, spouse);
  }, [self, spouse]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(leituraToText(leitura, displayName));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Leitura copiada', description: 'Cole onde quiser compartilhar.' });
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'destructive' });
    }
  };

  const tipoColor = (tipo: PairCompatibility['tipo']) => {
    switch (tipo) {
      case 'complementar':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'bom_encaixe':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'encaixe_parcial':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'tensao':
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <div className="pt-3 border-t">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left text-xs font-medium text-amber-800 hover:text-amber-900 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Leitura individual + encaixes
        </span>
        <ChevronDown
          className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="mt-2 space-y-2.5 text-xs leading-relaxed">
          <p className="italic text-foreground">{leitura.abertura}</p>

          <div>
            <p className="font-semibold text-emerald-800 mb-1">O que agrega ao círculo</p>
            <ul className="space-y-1 text-muted-foreground pl-3">
              {leitura.agrega.map((a, i) => (
                <li key={i} className="relative before:content-['•'] before:absolute before:-left-3 before:text-emerald-700">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-amber-900 mb-1">Pontos de atenção</p>
            <ul className="space-y-1 text-muted-foreground pl-3">
              {leitura.atencao.map((a, i) => (
                <li key={i} className="relative before:content-['•'] before:absolute before:-left-3 before:text-amber-700">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md bg-amber-50/60 border border-amber-200 px-2.5 py-2">
            <p className="text-[11px] font-semibold text-amber-900 mb-0.5">
              Melhor encaixe no círculo
            </p>
            <p className="text-muted-foreground">{leitura.encaixe}</p>
          </div>

          <div className="rounded-md bg-emerald-50/60 border border-emerald-200 px-2.5 py-2">
            <p className="text-[11px] font-semibold text-emerald-900 mb-0.5">
              Quem complementa este perfil
            </p>
            <p className="text-muted-foreground">{leitura.complementa}</p>
          </div>

          {vinculoConjugal && spouse && (
            <div className="rounded-md bg-rose-50/60 border border-rose-200 px-2.5 py-2 space-y-1">
              <p className="text-[11px] font-semibold text-rose-900 flex items-center gap-1">
                <Heart className="w-3 h-3" /> Vínculo conjugal
              </p>
              <p className="text-[11px] text-foreground">
                <strong>{displayName.split(' ')[0]} + {spouse.display_name.split(' ')[0]}</strong> — par fixo neste círculo.
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {vinculoConjugal.resumo}
              </p>
              {vinculoConjugal.cuidado && (
                <p className="text-[10px] text-amber-800 italic leading-snug">
                  ⚠ {vinculoConjugal.cuidado}
                </p>
              )}
            </div>
          )}

          {encaixes.length > 0 && (
            <div className="rounded-md bg-violet-50/60 border border-violet-200 px-2.5 py-2 space-y-2">
              <p className="text-[11px] font-semibold text-violet-900">
                {spouse ? `Encaixes além do casal ${poolLabel || ''}` : `Top encaixes ${poolLabel || ''}`}
              </p>
              <ol className="space-y-2">
                {encaixes.map((c, i) => (
                  <li key={c.outro_user_id} className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-foreground">
                        {i + 1}. {c.outro_nome}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] px-1.5 py-0', tipoColor(c.tipo))}
                      >
                        {c.score}% · {c.rotulo}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {c.justificativa}
                    </p>
                    {c.cuidado && (
                      <p className="text-[10px] text-amber-800 italic leading-snug">
                        ⚠ {c.cuidado}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="w-full gap-1.5 h-7 text-[11px] text-amber-800 hover:text-amber-900"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> Copiado
              </>
            ) : (
              <>
                <ClipboardCopy className="w-3 h-3" /> Copiar leitura
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// =====================================================
// Sub-componente: Leitura de combinação do círculo por IA
// Sob demanda — só dispara IA quando o coordenador clica.
// =====================================================
interface LeituraIACirculoResult {
  forcas_do_grupo: string[];
  riscos_do_grupo: string[];
  quem_puxa_o_que: { nome: string; papel_no_grupo: string }[];
  dinamicas_de_par?: { membros: string[]; tipo: string; observacao: string }[];
  recomendacao_pratica: string;
}

function LeituraIACirculoBlock({ members }: { members: TeamProfile[] }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LeituraIACirculoResult | null>(null);
  const [cached, setCached] = useState(false);

  const generate = async (force = false) => {
    setLoading(true);
    try {
      const payload = {
        force,
        members: members.map((m) => ({
          user_id: m.user_id,
          display_name: m.display_name,
          primary_role: m.primary_role,
          secondary_role: m.secondary_role,
          participant_type: m.participant_type,
          spouse_user_id: m.spouse_user_id,
          gender: m.gender,
          percentages: m.percentages,
        })),
      };
      const { data, error } = await supabase.functions.invoke(
        'discernir-generate-circle-combination',
        { body: payload },
      );
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult((data as any).result);
      setCached(!!(data as any).cached);
    } catch (e: any) {
      toast({
        title: 'Não foi possível gerar a leitura',
        description: e?.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!result) {
    return (
      <div className="pt-3 border-t">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => generate(false)}
          disabled={loading}
          className="w-full gap-2 border-violet-300 text-violet-800 hover:bg-violet-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Gerando leitura combinada do círculo...
            </>
          ) : (
            <>
              <Brain className="w-3.5 h-3.5" />
              Gerar leitura de combinação por IA
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-3 border-t space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-violet-900 flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5" />
          Leitura combinada do círculo
          {cached && (
            <span className="text-[10px] font-normal text-muted-foreground">(em cache)</span>
          )}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => generate(true)}
          disabled={loading}
          className="h-6 px-2 text-[11px] text-violet-700 hover:text-violet-900"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-3 h-3 mr-1" /> Regenerar
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2.5 text-xs leading-relaxed bg-violet-50/40 rounded-md border border-violet-200 p-3">
        <div>
          <p className="font-semibold text-emerald-800 mb-1">Forças do grupo</p>
          <ul className="space-y-1 text-muted-foreground pl-3">
            {result.forcas_do_grupo.map((f, i) => (
              <li key={i} className="relative before:content-['•'] before:absolute before:-left-3 before:text-emerald-700">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-amber-900 mb-1">Riscos coletivos</p>
          <ul className="space-y-1 text-muted-foreground pl-3">
            {result.riscos_do_grupo.map((r, i) => (
              <li key={i} className="relative before:content-['•'] before:absolute before:-left-3 before:text-amber-700">
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-violet-900 mb-1">Quem puxa o quê neste círculo</p>
          <ul className="space-y-1 text-muted-foreground pl-3">
            {result.quem_puxa_o_que.map((q, i) => (
              <li key={i} className="relative before:content-['•'] before:absolute before:-left-3 before:text-violet-700">
                <strong className="text-foreground">{q.nome}:</strong> {q.papel_no_grupo}
              </li>
            ))}
          </ul>
        </div>

        {result.dinamicas_de_par && result.dinamicas_de_par.length > 0 && (
          <div>
            <p className="font-semibold text-indigo-900 mb-1">Dinâmicas de par</p>
            <div className="flex flex-wrap gap-1.5 mb-2 text-[10px]">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800">
                <strong>Complementar</strong> · perfis diferentes que se equilibram
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-indigo-800">
                <strong>Bom encaixe</strong> · combinam bem, com sobreposições saudáveis
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-900">
                <strong>Tensão a cuidar</strong> · perfis distantes — pedem mediação
              </span>
            </div>
            <ul className="space-y-1.5 text-muted-foreground pl-3">
              {result.dinamicas_de_par.map((d, i) => {
                const tipoColor =
                  d.tipo === 'complementar'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : d.tipo === 'tensao'
                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                    : 'text-indigo-700 bg-indigo-50 border-indigo-200';
                return (
                  <li
                    key={i}
                    className="relative before:content-['•'] before:absolute before:-left-3 before:text-indigo-700"
                  >
                    <span className="text-foreground font-medium">
                      {d.membros.join(' × ')}
                    </span>{' '}
                    <span
                      className={`inline-block text-[10px] font-semibold uppercase tracking-wide border rounded px-1.5 py-0.5 ml-1 ${tipoColor}`}
                    >
                      {d.tipo === 'tensao' ? 'tensão' : d.tipo}
                    </span>
                    <p className="mt-0.5">{d.observacao}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="rounded-md bg-white/70 border border-violet-200 px-2.5 py-2">
          <p className="text-[11px] font-semibold text-violet-900 mb-0.5">Recomendação prática</p>
          <p className="text-muted-foreground">{result.recomendacao_pratica}</p>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Sub-componente: Cadastros / Movimento da equipe
// Mostra TODOS os usuários cadastrados no Discernir,
// não só os que terminaram o teste.
// =====================================================
function MovementBoard({ rows }: { rows: MovementRow[] }) {
  const cadastrados = rows.filter((r) => r.journey_status === 'cadastrado');
  const emAndamento = rows.filter((r) => r.journey_status === 'em_andamento');
  const concluidos = rows.filter((r) => r.journey_status === 'concluido');

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Ninguém se cadastrou no Discernir ainda.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="py-4 text-center">
            <CircleDot className="w-5 h-5 text-amber-700 mx-auto mb-1" />
            <div className="text-2xl font-bold text-amber-900">{cadastrados.length}</div>
            <div className="text-xs text-muted-foreground">Cadastrados, ainda não começaram</div>
          </CardContent>
        </Card>
        <Card className="border-sky-200 bg-sky-50/40">
          <CardContent className="py-4 text-center">
            <Activity className="w-5 h-5 text-sky-700 mx-auto mb-1" />
            <div className="text-2xl font-bold text-sky-900">{emAndamento.length}</div>
            <div className="text-xs text-muted-foreground">Em andamento</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardContent className="py-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
            <div className="text-2xl font-bold text-emerald-900">{concluidos.length}</div>
            <div className="text-xs text-muted-foreground">Perfil concluído</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Movimento da equipe</CardTitle>
          <p className="text-xs text-muted-foreground">
            Todos os participantes que se cadastraram, do mais novo para o mais antigo.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {rows.map((r) => {
              const statusBadge =
                r.journey_status === 'concluido' ? (
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-900 border-emerald-300 gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Concluído
                  </Badge>
                ) : r.journey_status === 'em_andamento' ? (
                  <Badge variant="outline" className="bg-sky-100 text-sky-900 border-sky-300 gap-1">
                    <Activity className="w-3 h-3" /> Em andamento
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-100 text-amber-900 border-amber-300 gap-1">
                    <CircleDot className="w-3 h-3" /> Cadastrado
                  </Badge>
                );
              return (
                <div
                  key={r.user_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 hover:bg-muted/40"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm truncate">{r.display_name}</p>
                      {statusBadge}
                      {r.primary_role && (
                        <Badge
                          variant="outline"
                          className={cn('text-[10px]', ROLE_COLORS[r.primary_role])}
                        >
                          {r.primary_role}
                        </Badge>
                      )}
                    </div>
                    {r.email && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {r.email}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:items-end text-[11px] text-muted-foreground shrink-0">
                    <span>Cadastro: {formatDate(r.registered_at)}</span>
                    {r.completed_at && (
                      <span className="text-emerald-700">Concluiu: {formatDate(r.completed_at)}</span>
                    )}
                    {!r.completed_at && r.started_at && (
                      <span className="text-sky-700">Começou: {formatDate(r.started_at)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
