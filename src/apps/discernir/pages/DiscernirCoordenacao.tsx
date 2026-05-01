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
import { Loader2, Users, Download, Search, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  type CircleProfileResult,
  type BlockKey,
  type CircleProfilePercentages,
  type CircleProfileRanking,
  getBlockLabel,
} from '../utils/circleProfileCalculation';
import { downloadPerfilServicoPDF } from '../utils/perfilServicoPDF';
import { cn } from '@/lib/utils';

interface TeamProfile {
  id: string;
  user_id: string;
  display_name: string;
  primary_role: string;
  secondary_role: string | null;
  tertiary_role: string | null;
  percentages: CircleProfilePercentages;
  ranking: CircleProfileRanking[];
  created_at: string;
}

const ROLE_COLORS: Record<string, string> = {
  'Condutor': 'bg-amber-100 text-amber-900 border-amber-300',
  'Pastor do Círculo': 'bg-rose-100 text-rose-900 border-rose-300',
  'Facilitador': 'bg-sky-100 text-sky-900 border-sky-300',
  'Guardião do Clima': 'bg-emerald-100 text-emerald-900 border-emerald-300',
  'Intercessor': 'bg-violet-100 text-violet-900 border-violet-300',
};

export function DiscernirCoordenacao() {
  const { user, isLoading: authLoading } = useAuth();
  const { role, isLoading: discernirLoading } = useDiscernirAuth();
  const { isSuperAdmin, isLoading: adminLoading } = useAdminPermissions();
  const { toast } = useToast();

  const [profiles, setProfiles] = useState<TeamProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isCoordinator = role === 'priest' || role === 'coordinator' || isSuperAdmin;

  useEffect(() => {
    if (authLoading || discernirLoading || adminLoading) return;
    if (!isCoordinator) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data, error } = await supabase
          .from('discernir_circle_profiles_team_view' as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles((data || []) as unknown as TeamProfile[]);
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
    })();
  }, [authLoading, discernirLoading, adminLoading, isCoordinator, toast]);

  const filtered = useMemo(() => {
    if (!search.trim()) return profiles;
    const q = search.toLowerCase();
    return profiles.filter(
      (p) =>
        p.display_name?.toLowerCase().includes(q) ||
        p.primary_role?.toLowerCase().includes(q),
    );
  }, [profiles, search]);

  // Distribution summary
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    profiles.forEach((p) => {
      counts[p.primary_role] = (counts[p.primary_role] || 0) + 1;
    });
    return counts;
  }, [profiles]);

  if (authLoading || discernirLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isCoordinator) return <Navigate to="/dashboard" replace />;

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
          Veja o Perfil de Serviço da equipe lado a lado para montar círculos equilibrados.
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
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(roleCounts).map(([role, count]) => (
                <Badge
                  key={role}
                  variant="outline"
                  className={cn('text-xs px-3 py-1', ROLE_COLORS[role] || '')}
                >
                  {role}: {count}
                </Badge>
              ))}
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

      {/* Profiles grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-amber-700" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {profiles.length === 0
              ? 'Ninguém da equipe completou o Perfil de Serviço ainda.'
              : 'Nenhum resultado para sua busca.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">
                  {p.display_name}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs w-fit mt-1',
                    ROLE_COLORS[p.primary_role] || '',
                  )}
                >
                  {p.primary_role}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Top 3 mini */}
                <div className="space-y-1.5">
                  {p.ranking.slice(0, 3).map((r, i) => (
                    <div
                      key={r.role}
                      className="flex items-center justify-between text-xs"
                    >
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

                {/* Mini bars per dimension */}
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

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(p)}
                  className="w-full gap-2 mt-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
