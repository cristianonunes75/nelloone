import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search,
  MoreHorizontal,
  Mail,
  Trash2
} from 'lucide-react';
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
import { BusinessLayout } from '../components/BusinessLayout';
import { OperatorLinkingSection } from '../components/OperatorLinkingSection';
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
  profile: {
    full_name: string;
    journey_status: string;
    journey_completed_tests: number;
    journey_total_tests: number;
  } | null;
  has_essence_code: boolean;
}

export default function BusinessTeam() {
  const { company } = useBusinessAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
          share_report_with_company,
          joined_at,
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

      // Check which users have essence code generated
      const userIds = (data || []).map(d => d.user_id);
      const { data: essenceCodes } = userIds.length > 0
        ? await supabase
            .from('ativacao_codigo')
            .select('user_id')
            .in('user_id', userIds)
        : { data: [] };
      
      const essenceUserIds = new Set((essenceCodes || []).map(e => e.user_id));
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        profile: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        has_essence_code: essenceUserIds.has(item.user_id),
      }));
      
      setMembers(transformedData as unknown as TeamMember[]);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Erro ao carregar membros da equipe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro da equipe?')) return;
    
    try {
      await supabase
        .from('company_users')
        .update({ is_active: false })
        .eq('id', memberId);
      
      toast.success('Membro removido da equipe');
      fetchMembers();
    } catch (error) {
      toast.error('Erro ao remover membro');
    }
  };

  const handleResendInvite = async (email: string) => {
    toast.info('Funcionalidade em desenvolvimento');
  };

  const filteredMembers = members.filter(member =>
    member.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (member: TeamMember) => {
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

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie os membros da sua equipe e operadores vinculados
          </p>
        </div>

        {/* Operator Linking Section */}
        <OperatorLinkingSection />

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Membros ({members.length})
                </CardTitle>
                <CardDescription>
                  Todos os colaboradores vinculados à sua empresa
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum membro encontrado
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progresso</TableHead>
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
                        <TableCell>{getRoleBadge(member.role)}</TableCell>
                        <TableCell>{getStatusBadge(member)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {member.profile ? (
                              <span className="text-sm">
                                {member.profile.journey_completed_tests}/7 mapas
                              </span>
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
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {member.joined_at 
                            ? format(new Date(member.joined_at), "dd MMM yyyy", { locale: ptBR })
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
                              <DropdownMenuItem onClick={() => handleResendInvite('')}>
                                <Mail className="w-4 h-4 mr-2" />
                                Reenviar email
                              </DropdownMenuItem>
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
      </div>
    </BusinessLayout>
  );
}
