import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Search, Eye, UserCog, Loader2, Map, Download, Ban, CheckCircle, X, RefreshCw, Trash2
} from "lucide-react";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useAuth } from "@/hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { JOURNEY_TEST_SLUGS, JourneyTestSlug, updateJourneyProgress } from "@/utils/journey";

interface UserWithDetails {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  journey_status: string;
  journey_completed_tests: number;
  journey_tests_status: Record<string, string>;
  codigo_essencia_unlocked: boolean;
  is_blocked: boolean;
  roles: string[];
}

const TEST_DISPLAY_NAMES: Record<JourneyTestSlug, string> = {
  arquetipos_proposito: "Arquétipos com Propósito",
  inteligencias_multiplas: "Inteligências Múltiplas",
  estilos_conexao: "Estilos de Conexão Afetiva",
  nello16: "Nello 16 Personality",
  disc: "DISC",
  eneagrama: "Eneagrama",
  temperamentos: "Temperamentos",
};

export const AdminUsersJourneys = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [impersonating, setImpersonating] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{type: string; user: UserWithDetails} | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserWithDetails | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: rolesData } = await supabase.from("user_roles").select("user_id, role");
      const { data: authUsers } = await supabase.rpc('get_user_roles', { _user_id: profiles?.[0]?.id || '' });

      const usersWithDetails: UserWithDetails[] = (profiles || []).map((profile) => {
        const userRoles = rolesData?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [];
        
        return {
          id: profile.id,
          email: `user-${profile.id.substring(0, 8)}@email.com`,
          full_name: profile.full_name,
          phone: profile.phone,
          created_at: profile.created_at,
          journey_status: profile.journey_status || 'not_started',
          journey_completed_tests: profile.journey_completed_tests || 0,
          journey_tests_status: (profile.journey_tests_status as Record<string, string>) || {},
          codigo_essencia_unlocked: profile.journey_status === 'completed',
          is_blocked: (profile as any).is_blocked || false,
          roles: userRoles,
        };
      });

      setUsers(usersWithDetails);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleImpersonate = async (user: UserWithDetails) => {
    if (user.roles.includes('admin')) {
      toast.error("Não é permitido simular outro administrador");
      return;
    }

    setImpersonating(user.id);
    
    try {
      // Use edge function to create session securely
      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: { 
          action: 'create', 
          targetUserId: user.id 
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to create session');
      }

      // Store session in sessionStorage (not URL) for security
      const sessionData = {
        userId: user.id,
        userName: user.full_name,
        sessionToken: data.sessionToken
      };
      sessionStorage.setItem('nello_impersonation_session', JSON.stringify(sessionData));

      // Open client page without token in URL
      window.open(`${window.location.origin}/cliente`, '_blank');
      
      toast.success(`Simulando como ${user.full_name}`);
    } catch (error) {
      console.error("Error creating impersonation session:", error);
      toast.error("Erro ao criar sessão de simulação");
    } finally {
      setImpersonating(null);
    }
  };

  const handleBlockUser = async (user: UserWithDetails) => {
    setActionLoading('block');
    try {
      const newBlockedStatus = !user.is_blocked;
      const { error } = await supabase
        .from("profiles")
        .update({ is_blocked: newBlockedStatus })
        .eq("id", user.id);

      if (error) throw error;

      await supabase.rpc('log_audit', {
        p_action: newBlockedStatus ? 'block_user' : 'unblock_user',
        p_table_name: 'profiles',
        p_record_id: user.id,
        p_new_data: { is_blocked: newBlockedStatus }
      });

      toast.success(newBlockedStatus ? "Usuário bloqueado" : "Usuário desbloqueado");
      fetchUsers();
      setConfirmAction(null);
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, is_blocked: newBlockedStatus });
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Erro ao alterar status do usuário");
    } finally {
      setActionLoading(null);
    }
  };

  // Note: handleRemoveCodigoAccess removed - codigo_essencia is now automatic when journey is complete

  const handleForceTestComplete = async (user: UserWithDetails, testSlug: JourneyTestSlug) => {
    setActionLoading(testSlug);
    try {
      const result = await updateJourneyProgress(user.id, testSlug, 'completed');
      if (!result.success) throw new Error(result.error);

      await supabase.rpc('log_audit', {
        p_action: 'force_test_complete',
        p_table_name: 'profiles',
        p_record_id: user.id,
        p_new_data: { test_slug: testSlug, forced_by: 'admin' }
      });

      toast.success(`Teste ${TEST_DISPLAY_NAMES[testSlug]} marcado como concluído`);
      fetchUsers();
      
      // Refresh selected user data
      const updatedUser = users.find(u => u.id === user.id);
      if (updatedUser && selectedUser?.id === user.id) {
        setSelectedUser({
          ...selectedUser,
          journey_tests_status: { ...selectedUser.journey_tests_status, [testSlug]: 'completed' },
          journey_completed_tests: selectedUser.journey_completed_tests + 1,
        });
      }
    } catch (error) {
      console.error("Error forcing test complete:", error);
      toast.error("Erro ao forçar conclusão do teste");
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteDialog = (user: UserWithDetails) => {
    // Prevent self-deletion
    if (user.id === currentUser?.id) {
      toast.error("Você não pode deletar a própria conta de administrador");
      return;
    }
    
    // Prevent deleting other admins
    if (user.roles.includes("admin")) {
      toast.error("Não é permitido deletar outro administrador");
      return;
    }
    
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("admin-delete-user", {
        body: { target_user_id: userToDelete.id },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      toast.success(`Usuário ${userToDelete.full_name} deletado com sucesso`);
      
      // Remove user from the list
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Erro ao deletar usuário");
    }
  };

  const exportCSV = () => {
    const headers = ["Nome", "Email", "Status Jornada", "Testes Concluídos", "Código da Essência", "Data de Criação"];
    const rows = filteredUsers.map(u => [
      u.full_name,
      u.email,
      u.journey_status,
      `${u.journey_completed_tests}/7`,
      u.codigo_essencia_unlocked ? "Sim" : "Não",
      format(new Date(u.created_at), "dd/MM/yyyy"),
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_nelloone_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("CSV exportado com sucesso");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "in_progress") return matchesSearch && user.journey_status === "in_progress";
    if (filter === "completed") return matchesSearch && user.journey_status === "completed";
    if (filter === "not_started") return matchesSearch && user.journey_status === "not_started";
    if (filter === "with_codigo") return matchesSearch && user.codigo_essencia_unlocked;
    if (filter === "blocked") return matchesSearch && user.is_blocked;
    
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    inProgress: users.filter(u => u.journey_status === "in_progress").length,
    completed: users.filter(u => u.journey_status === "completed").length,
    withCodigo: users.filter(u => u.codigo_essencia_unlocked).length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Concluída</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Em andamento</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Não iniciada</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Usuários & Jornadas</h1>
          <p className="text-muted-foreground text-xs md:text-sm">Gerencie usuários e acompanhe suas jornadas</p>
        </div>
        <Button variant="outline" onClick={exportCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold">{stats.total}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Total</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-blue-600">{stats.inProgress}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Em andamento</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-emerald-600">{stats.completed}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Jornada completa</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-violet-600">{stats.withCodigo}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Com Código</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="completed">Jornada completa</SelectItem>
                <SelectItem value="not_started">Não iniciada</SelectItem>
                <SelectItem value="with_codigo">Com Código</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 md:px-6">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Usuário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Jornada</TableHead>
                  <TableHead className="text-center">Código</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className={`group ${user.is_blocked ? "opacity-50 bg-destructive/5" : ""}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.is_blocked && <Ban className="w-4 h-4 text-destructive" />}
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">{user.phone || "—"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.journey_status)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="flex gap-0.5">
                          {[...Array(7)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-2 h-2 rounded-full ${i < user.journey_completed_tests ? 'bg-primary' : 'bg-muted'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-1">{user.journey_completed_tests}/7</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.codigo_essencia_unlocked ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.created_at), "dd/MM/yy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImpersonate(user)}
                          disabled={impersonating === user.id || user.roles.includes('admin')}
                        >
                          {impersonating === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserCog className="w-4 h-4" />
                          )}
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(user)}
                              disabled={user.roles.includes('admin') || user.id === currentUser?.id}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {user.roles.includes('admin') 
                              ? "Não é possível deletar admin" 
                              : user.id === currentUser?.id 
                                ? "Não é possível deletar você mesmo"
                                : "Deletar usuário"
                            }
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredUsers.slice(0, 20).map((user) => (
              <Card key={user.id} className={`p-4 ${user.is_blocked ? "opacity-60 border-destructive/30" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {user.is_blocked && <Ban className="w-4 h-4 text-destructive" />}
                    <div>
                      <p className="font-medium text-sm">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.phone || "Sem telefone"}</p>
                    </div>
                  </div>
                  {getStatusBadge(user.journey_status)}
                </div>
                <div className="flex items-center gap-4 mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Jornada:</span>
                    <span className="font-medium">{user.journey_completed_tests}/7</span>
                  </div>
                  {user.codigo_essencia_unlocked && (
                    <Badge variant="outline" className="text-emerald-600 text-xs">Código ✓</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDetails(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleImpersonate(user)}
                    disabled={impersonating === user.id || user.roles.includes('admin')}
                  >
                    <UserCog className="w-4 h-4 mr-1" />
                    Simular
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Detalhes do Usuário
              {selectedUser?.is_blocked && <Badge variant="destructive">Bloqueado</Badge>}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nome</p>
                  <p className="font-medium">{selectedUser.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                  <p className="font-medium">{selectedUser.phone || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Membro desde</p>
                  <p className="font-medium">
                    {format(new Date(selectedUser.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status da Jornada</p>
                  {getStatusBadge(selectedUser.journey_status)}
                </div>
              </div>

              {/* Journey Tests Status */}
              <div>
                <h4 className="text-sm font-medium mb-3">Status dos Testes</h4>
                <div className="space-y-2">
                  {JOURNEY_TEST_SLUGS.map((slug) => {
                    const status = selectedUser.journey_tests_status[slug] || 'not_started';
                    const isCompleted = status === 'completed';
                    return (
                      <div key={slug} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : status === 'in_progress' ? 'bg-blue-500' : 'bg-muted'}`} />
                          <span className="text-sm">{TEST_DISPLAY_NAMES[slug]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {status === 'completed' ? 'Concluído' : status === 'in_progress' ? 'Em andamento' : 'Não iniciado'}
                          </Badge>
                          {!isCompleted && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleForceTestComplete(selectedUser, slug)}
                              disabled={actionLoading === slug}
                            >
                              {actionLoading === slug ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleImpersonate(selectedUser)}
                  disabled={impersonating === selectedUser.id || selectedUser.roles.includes('admin')}
                  className="gap-2"
                >
                  <UserCog className="w-4 h-4" />
                  Impersonar
                </Button>
                <Button
                  variant={selectedUser.is_blocked ? "default" : "outline"}
                  onClick={() => setConfirmAction({ type: 'block', user: selectedUser })}
                  className="gap-2"
                >
                  {selectedUser.is_blocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                  {selectedUser.is_blocked ? "Desbloquear" : "Bloquear"}
                </Button>
                {selectedUser.codigo_essencia_unlocked && (
                  <Button
                    variant="outline"
                    onClick={() => setConfirmAction({ type: 'removeCodigo', user: selectedUser })}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                    Remover Código
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'block' && (
                confirmAction.user.is_blocked 
                  ? `Desbloquear o acesso de ${confirmAction.user.full_name}?`
                  : `Bloquear o acesso de ${confirmAction.user.full_name}? O usuário não conseguirá acessar testes nem o Código da Essência.`
              )}
              {confirmAction?.type === 'removeCodigo' && (
                `Remover o acesso ao Código da Essência de ${confirmAction?.user.full_name}? Esta ação não afeta o pagamento realizado.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction?.type === 'block') {
                  handleBlockUser(confirmAction.user);
                }
                // Note: removeCodigo action removed - codigo_essencia is now automatic
              }}
              disabled={!!actionLoading}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DeleteUserDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        userName={userToDelete?.full_name || ""}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};