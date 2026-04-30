import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  UserPlus,
  Pencil
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  consent_given: boolean;
  joined_at: string | null;
  job_title: string | null;
  department: string | null;
  profile: {
    full_name: string;
    journey_status: string;
    journey_completed_tests: number;
    journey_total_tests: number;
  } | null;
}

export function TeamMembersSection() {
  const { company, isCompanyAdmin } = useBusinessAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [editJobTitle, setEditJobTitle] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (company) {
      fetchMembers();
    }
  }, [company]);

  const fetchMembers = async () => {
    if (!company) return;
    
    try {
      const { data, error } = await supabase
        .from('company_users')
        .select(`
          id,
          user_id,
          role,
          is_active,
          consent_given,
          joined_at,
          job_title,
          department,
          profiles:user_id (
            full_name,
            journey_status,
            journey_completed_tests,
            journey_total_tests
          )
        `)
        .eq('company_id', company.id)
        .order('joined_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedData = (data || []).map(item => ({
        ...item,
        profile: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      }));
      
      setMembers(transformedData as unknown as TeamMember[]);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Erro ao carregar membros');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro?')) return;
    
    try {
      await supabase
        .from('company_users')
        .update({ is_active: false })
        .eq('id', memberId);
      
      toast.success('Membro removido');
      fetchMembers();
    } catch (error) {
      toast.error('Erro ao remover membro');
    }
  };

  const openEdit = (member: TeamMember) => {
    setEditing(member);
    setEditJobTitle(member.job_title ?? '');
    setEditDepartment(member.department ?? '');
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.rpc('update_company_user_basics', {
        _company_user_id: editing.id,
        _job_title: editJobTitle,
        _department: editDepartment,
      });
      if (error) throw error;
      toast.success('Dados atualizados');
      setEditing(null);
      fetchMembers();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (member: TeamMember) => {
    if (!member.consent_given) {
      return <Badge variant="outline" className="gap-1 text-xs"><Clock className="w-3 h-3" /> Pendente</Badge>;
    }
    
    const status = member.profile?.journey_status;
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 gap-1 text-xs"><CheckCircle2 className="w-3 h-3" /> Ativo</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1 text-xs">Ativo</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'company_admin':
        return <Badge variant="default" className="text-xs">Admin</Badge>;
      case 'super_admin':
        return <Badge className="bg-purple-100 text-purple-700 text-xs">Super</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Membro</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recrutadores ({members.length})
            </CardTitle>
            <CardDescription>
              Usuários com acesso ao painel de recrutamento
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link to="/team?tab=invite">
              <Button size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Convidar</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum membro encontrado</p>
            <Link to="/team?tab=invite">
              <Button variant="outline" size="sm" className="mt-4 gap-2">
                <UserPlus className="w-4 h-4" />
                Convidar primeiro membro
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.profile?.full_name || 'Nome não disponível'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {member.job_title || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm">
                      {member.department || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell>{getStatusBadge(member)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {member.joined_at 
                        ? format(new Date(member.joined_at), "dd/MM/yy", { locale: ptBR })
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isCompanyAdmin && (
                            <DropdownMenuItem onClick={() => openEdit(member)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar cargo / departamento
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
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
  );
}
