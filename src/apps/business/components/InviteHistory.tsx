import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Clock, CheckCircle, Users, Sparkles, Shield, ShieldCheck, Send, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InviteRecord {
  id: string;
  email: string;
  status: string | null;
  role: string;
  sent_at: string | null;
  accepted_at: string | null;
  accepted_by: string | null;
  // Profile data (after acceptance)
  full_name: string | null;
  profession: string | null;
  gender: string | null;
  journey_status: string | null;
  journey_completed_tests: number | null;
  journey_total_tests: number | null;
  // Company user data
  consent_given: boolean | null;
  share_report_with_company: boolean | null;
  // Essence code
  has_essence_code: boolean;
}

type StatusFilter = 'all' | 'pending' | 'accepted';

interface InviteHistoryProps {
  companyId: string;
}

export function InviteHistory({ companyId }: InviteHistoryProps) {
  const [invites, setInvites] = useState<InviteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [resendingId, setResendingId] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch all invites for this company
      const { data: invitesData, error: invitesError } = await supabase
        .from('company_invites')
        .select('id, email, status, role, sent_at, accepted_at, accepted_by')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (invitesError) throw invitesError;
      if (!invitesData || invitesData.length === 0) {
        setInvites([]);
        setIsLoading(false);
        return;
      }

      // 2. Get accepted user IDs
      const acceptedUserIds = invitesData
        .filter(i => i.accepted_by)
        .map(i => i.accepted_by as string);

      let profilesMap: Record<string, any> = {};
      let companyUsersMap: Record<string, any> = {};
      let essenceCodesSet = new Set<string>();

      if (acceptedUserIds.length > 0) {
        // 3. Fetch profiles
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, profession, gender, journey_status, journey_completed_tests, journey_total_tests')
          .in('id', acceptedUserIds);

        if (profiles) {
          for (const p of profiles) {
            profilesMap[p.id] = p;
          }
        }

        // 4. Fetch company_users
        const { data: companyUsers } = await supabase
          .from('company_users')
          .select('user_id, consent_given, share_report_with_company')
          .eq('company_id', companyId)
          .in('user_id', acceptedUserIds);

        if (companyUsers) {
          for (const cu of companyUsers) {
            companyUsersMap[cu.user_id] = cu;
          }
        }

        // 5. Check essence codes
        const { data: essenceCodes } = await supabase
          .from('ativacao_codigo')
          .select('user_id')
          .in('user_id', acceptedUserIds);

        if (essenceCodes) {
          for (const ec of essenceCodes) {
            essenceCodesSet.add(ec.user_id);
          }
        }
      }

      // 6. Merge data
      const merged: InviteRecord[] = invitesData.map(inv => {
        const profile = inv.accepted_by ? profilesMap[inv.accepted_by] : null;
        const cu = inv.accepted_by ? companyUsersMap[inv.accepted_by] : null;
        return {
          id: inv.id,
          email: inv.email,
          status: inv.status,
          role: inv.role,
          sent_at: inv.sent_at,
          accepted_at: inv.accepted_at,
          accepted_by: inv.accepted_by,
          full_name: profile?.full_name || null,
          profession: profile?.profession || null,
          gender: profile?.gender || null,
          journey_status: profile?.journey_status || null,
          journey_completed_tests: profile?.journey_completed_tests ?? null,
          journey_total_tests: profile?.journey_total_tests ?? 7,
          consent_given: cu?.consent_given ?? null,
          share_report_with_company: cu?.share_report_with_company ?? null,
          has_essence_code: inv.accepted_by ? essenceCodesSet.has(inv.accepted_by) : false,
        };
      });

      setInvites(merged);
    } catch (error) {
      console.error('Error fetching invite history:', error);
      toast.error('Erro ao carregar histórico de convites');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleResend = async (inviteId: string, email: string) => {
    setResendingId(inviteId);
    try {
      const { error } = await supabase.functions.invoke('business-invite-resend', {
        body: { invite_id: inviteId },
      });
      if (error) throw error;
      toast.success(`Convite reenviado para ${email}`);
    } catch {
      toast.error('Erro ao reenviar convite');
    } finally {
      setResendingId(null);
    }
  };

  // Filter logic
  const filtered = invites.filter(inv => {
    if (statusFilter === 'pending' && inv.status !== 'pending') return false;
    if (statusFilter === 'accepted' && inv.status !== 'accepted') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchEmail = inv.email.toLowerCase().includes(q);
      const matchName = inv.full_name?.toLowerCase().includes(q);
      if (!matchEmail && !matchName) return false;
    }
    return true;
  });

  const pendingCount = invites.filter(i => i.status === 'pending').length;
  const acceptedCount = invites.filter(i => i.status === 'accepted').length;

  const getJourneyBadge = (inv: InviteRecord) => {
    if (inv.status === 'pending') {
      return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/15"><Clock className="w-3 h-3 mr-1" />Aguardando</Badge>;
    }
    if (inv.has_essence_code) {
      return <Badge className="bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400/40 hover:bg-amber-400/20"><Sparkles className="w-3 h-3 mr-1" />Código da Essência</Badge>;
    }
    if (inv.journey_status === 'completed') {
      return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15"><CheckCircle className="w-3 h-3 mr-1" />Concluído</Badge>;
    }
    if (inv.journey_status === 'in_progress') {
      return (
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/15">Em andamento</Badge>
          <div className="flex items-center gap-1.5 min-w-[80px]">
            <Progress value={((inv.journey_completed_tests || 0) / (inv.journey_total_tests || 7)) * 100} className="h-2 w-16" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">{inv.journey_completed_tests || 0}/{inv.journey_total_tests || 7}</span>
          </div>
        </div>
      );
    }
    // accepted but not started
    return <Badge variant="secondary" className="hover:bg-secondary"><Users className="w-3 h-3 mr-1" />Não iniciou</Badge>;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'company_admin' || role === 'super_admin') {
      return <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-700 dark:text-amber-400">Admin</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Colaborador</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (invites.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Histórico de Convites
            <Badge variant="secondary" className="ml-1">{invites.length}</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchInvites} className="gap-1.5 self-start">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(['all', 'pending', 'accepted'] as StatusFilter[]).map((f) => (
              <Button
                key={f}
                variant={statusFilter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(f)}
                className="h-8 text-xs"
              >
                {f === 'all' && `Todos (${invites.length})`}
                {f === 'pending' && `Pendentes (${pendingCount})`}
                {f === 'accepted' && `Aceitos (${acceptedCount})`}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email / Nome</TableHead>
                <TableHead>Fase</TableHead>
                <TableHead className="hidden md:table-cell">Acesso</TableHead>
                <TableHead className="hidden lg:table-cell">LGPD</TableHead>
                <TableHead className="hidden lg:table-cell">Profissão</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhum convite encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <div className="min-w-[160px]">
                        {inv.full_name && (
                          <p className="font-medium text-sm">{inv.full_name}</p>
                        )}
                        <p className={`text-sm ${inv.full_name ? 'text-muted-foreground' : ''}`}>{inv.email}</p>
                        {inv.gender && (
                          <span className="text-xs text-muted-foreground">{inv.gender}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[140px]">
                        {getJourneyBadge(inv)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getRoleBadge(inv.role)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {inv.status === 'accepted' ? (
                        <div className="flex flex-col gap-1">
                          {inv.consent_given ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                              <ShieldCheck className="w-3 h-3" />Consentiu
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Shield className="w-3 h-3" />Pendente
                            </span>
                          )}
                          {inv.share_report_with_company && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">Compartilha dados</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{inv.profession || '—'}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {inv.sent_at && (
                          <p>Enviado: {format(new Date(inv.sent_at), "dd/MM/yy", { locale: ptBR })}</p>
                        )}
                        {inv.accepted_at && (
                          <p className="text-emerald-600 dark:text-emerald-400">Aceito: {format(new Date(inv.accepted_at), "dd/MM/yy", { locale: ptBR })}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {inv.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResend(inv.id, inv.email)}
                          disabled={resendingId === inv.id}
                          className="h-8 w-8 p-0"
                          title="Reenviar convite"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
