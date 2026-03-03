import { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Clock, AlertCircle, Search, MoreHorizontal, Mail, Trash2, Pencil
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { OperatorLinkingSection } from './OperatorLinkingSection';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  consent_given: boolean;
  share_report_with_company: boolean;
  joined_at: string | null;
  job_title: string | null;
  department: string | null;
  profile: {
    full_name: string;
    journey_status: string;
    journey_completed_tests: number;
    journey_total_tests: number;
  } | null;
  has_essence_code: boolean;
  // For pending invites displayed inline
  source: 'member' | 'invite';
  invite_email?: string;
  invite_sent_at?: string;
}

export function TeamMembersTab() {
  const { company } = useBusinessAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editJobTitle, setEditJobTitle] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (company) fetchMembers();
  }, [company]);

  const fetchMembers = async () => {
    if (!company) return;
    try {
      // Fetch active company_users
      const { data, error } = await supabase
        .from('company_users')
        .select(`
          id, user_id, role, is_active, consent_given, share_report_with_company, joined_at, job_title, department,
          profiles:user_id (full_name, journey_status, journey_completed_tests, journey_total_tests)
        `)
        .eq('company_id', company.id)
        .order('joined_at', { ascending: false });
      if (error) throw error;

      const userIds = (data || []).map(d => d.user_id);
      const { data: essenceCodes } = userIds.length > 0
        ? await supabase.from('ativacao_codigo').select('user_id').in('user_id', userIds)
        : { data: [] };
      const essenceUserIds = new Set((essenceCodes || []).map(e => e.user_id));

      const activeMembers: TeamMember[] = (data || []).map(item => ({
        ...item,
        profile: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        has_essence_code: essenceUserIds.has(item.user_id),
        source: 'member' as const,
      }));

      // Fetch pending invites that haven't become company_users yet
      const { data: pendingInvites, error: invErr } = await supabase
        .from('company_invites')
        .select('id, email, role, status, sent_at')
        .eq('company_id', company.id)
        .eq('status', 'pending')
        .order('sent_at', { ascending: false });
      if (invErr) throw invErr;

      const pendingAsMembers: TeamMember[] = (pendingInvites || []).map(inv => ({
        id: inv.id,
        user_id: '',
        role: inv.role,
        is_active: false,
        consent_given: false,
        share_report_with_company: false,
        joined_at: inv.sent_at,
        job_title: null,
        department: null,
        profile: null,
        has_essence_code: false,
        source: 'invite' as const,
        invite_email: inv.email,
        invite_sent_at: inv.sent_at,
      }));

      setMembers([...activeMembers, ...pendingAsMembers]);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Erro ao carregar membros da equipe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (member: TeamMember) => {
    if (member.source === 'invite') {
      if (!confirm('Tem certeza que deseja cancelar este convite?')) return;
      try {
        await supabase.from('company_invites').delete().eq('id', member.id);
        toast.success('Convite removido');
        fetchMembers();
      } catch (error) {
        toast.error('Erro ao remover convite');
      }
    } else {
      if (!confirm('Tem certeza que deseja remover este membro da equipe?')) return;
      try {
        await supabase.from('company_users').update({ is_active: false }).eq('id', member.id);
        toast.success('Membro removido da equipe');
        fetchMembers();
      } catch (error) {
        toast.error('Erro ao remover membro');
      }
    }
  };

  const handleResendInvite = async (email: string) => {
    toast.info('Funcionalidade em desenvolvimento');
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setEditJobTitle(member.job_title || '');
    setEditDepartment(member.department || '');
  };

  const handleSaveJobTitle = async () => {
    if (!editingMember) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('company_users')
        .update({
          job_title: editJobTitle.trim() || null,
          department: editDepartment.trim() || null,
        })
        .eq('id', editingMember.id);
      if (error) throw error;
      toast.success('Cargo atualizado com sucesso');
      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      toast.error('Erro ao atualizar cargo');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const term = searchTerm.toLowerCase();
    return (
      member.profile?.full_name?.toLowerCase().includes(term) ||
      member.invite_email?.toLowerCase().includes(term) ||
      member.role.toLowerCase().includes(term) ||
      member.job_title?.toLowerCase().includes(term) ||
      member.department?.toLowerCase().includes(term)
    );
  });

  const totalCount = members.length;
  const pendingCount = members.filter(m => m.source === 'invite').length;

  const getStatusBadge = (member: TeamMember) => {
    if (member.source === 'invite') {
      return <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300"><Mail className="w-3 h-3" /> Convite pendente</Badge>;
    }
    if (!member.consent_given) {
      return <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" /> Aguardando consentimento</Badge>;
    }
    const status = member.profile?.journey_status;
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 gap-1"><CheckCircle2 className="w-3 h-3" /> Concluído</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Em andamento</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><AlertCircle className="w-3 h-3" /> Não iniciado</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'company_admin':
        return <Badge variant="default">Admin</Badge>;
      case 'super_admin':
        return <Badge className="bg-purple-100 text-purple-700">Super Admin</Badge>;
      default:
        return <Badge variant="outline">Colaborador</Badge>;
    }
  };

  const getMemberName = (member: TeamMember) => {
    if (member.source === 'invite') {
      return (
        <div className="flex flex-col">
          <span className="text-muted-foreground italic">{member.invite_email}</span>
          <span className="text-xs text-muted-foreground">Ainda não acessou</span>
        </div>
      );
    }
    return member.profile?.full_name || 'Nome não disponível';
  };

  return (
    <div className="space-y-6">
      <OperatorLinkingSection />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Membros ({totalCount})
              </CardTitle>
              <CardDescription>
                Todos os colaboradores vinculados à sua empresa
                {pendingCount > 0 && (
                  <span className="ml-1">· {pendingCount} convite{pendingCount > 1 ? 's' : ''} pendente{pendingCount > 1 ? 's' : ''}</span>
                )}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum membro encontrado</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Desde</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={`${member.source}-${member.id}`} className={member.source === 'invite' ? 'opacity-75' : ''}>
                      <TableCell className="font-medium">
                        {getMemberName(member)}
                      </TableCell>
                      <TableCell>
                        {member.source === 'member' ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm">{member.job_title || <span className="text-muted-foreground">—</span>}</span>
                            {member.department && (
                              <span className="text-xs text-muted-foreground">{member.department}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell>{getStatusBadge(member)}</TableCell>
                      <TableCell>
                        {member.source === 'invite' ? (
                          <span className="text-muted-foreground text-sm">—</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {member.profile ? (
                              <span className="text-sm">{member.profile.journey_completed_tests}/7 mapas</span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                            {member.has_essence_code && (
                              <Badge className="bg-emerald-100 text-emerald-700 gap-1 w-fit text-[10px]">
                                <CheckCircle2 className="w-3 h-3" /> Código da Essência
                              </Badge>
                            )}
                            {member.share_report_with_company && (
                              <span className="text-[10px] text-muted-foreground">📊 Compartilhando</span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {member.joined_at ? format(new Date(member.joined_at), "dd MMM yyyy", { locale: ptBR }) : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {member.source === 'member' && (
                              <DropdownMenuItem onClick={() => openEditDialog(member)}>
                                <Pencil className="w-4 h-4 mr-2" /> Editar cargo
                              </DropdownMenuItem>
                            )}
                            {member.source === 'invite' && (
                              <DropdownMenuItem onClick={() => handleResendInvite(member.invite_email || '')}>
                                <Mail className="w-4 h-4 mr-2" /> Reenviar convite
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleRemoveMember(member)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" /> {member.source === 'invite' ? 'Cancelar convite' : 'Remover'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar cargo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              {editingMember?.profile?.full_name || 'Colaborador'}
            </p>
            <div className="space-y-2">
              <Label htmlFor="job_title">Cargo</Label>
              <Input
                id="job_title"
                placeholder="Ex: Gerente de Marketing"
                value={editJobTitle}
                onChange={(e) => setEditJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                placeholder="Ex: Comercial"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)}>Cancelar</Button>
            <Button onClick={handleSaveJobTitle} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
