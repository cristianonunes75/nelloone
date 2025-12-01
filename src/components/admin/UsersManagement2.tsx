import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Search, 
  Eye, 
  UserCog, 
  FileText,
  CreditCard,
  Users,
  Loader2,
  Activity,
  Map
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserWithDetails {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  roles: string[];
  test_progress: number;
  purchases_count: number;
  has_mapa: boolean;
  last_activity?: string;
}

export const UsersManagement2 = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [impersonating, setImpersonating] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [showDetails, setShowDetails] = useState(false);

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

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id, role");

      const { data: testsData } = await supabase
        .from("user_tests")
        .select("user_id, status, completed_at");

      const { data: purchasesData } = await supabase
        .from("test_purchases")
        .select("user_id, payment_status");

      const { data: mapasData } = await supabase
        .from("mapa_essencia")
        .select("user_id");

      const usersWithDetails: UserWithDetails[] = (profiles || []).map((profile) => {
        const userRoles = rolesData?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [];
        const userTests = testsData?.filter((t) => t.user_id === profile.id) || [];
        const completedTests = userTests.filter((t) => t.status === 'completed').length;
        const purchasesCount = purchasesData?.filter((p) => p.user_id === profile.id && p.payment_status === 'completed').length || 0;
        const hasMapa = mapasData?.some((m) => m.user_id === profile.id) || false;
        
        const lastCompleted = userTests
          .filter(t => t.completed_at)
          .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0];

        return {
          id: profile.id,
          email: `${profile.full_name.toLowerCase().replace(/\s/g, '.')}@email.com`,
          full_name: profile.full_name,
          phone: profile.phone,
          created_at: profile.created_at,
          roles: userRoles,
          test_progress: completedTests,
          purchases_count: purchasesCount,
          has_mapa: hasMapa,
          last_activity: lastCompleted?.completed_at || profile.updated_at,
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
      const { data: session, error } = await supabase
        .from("impersonation_sessions")
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          target_user_id: user.id,
          session_token: crypto.randomUUID(),
          ip_address: 'unknown',
          user_agent: navigator.userAgent,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.rpc('log_audit', {
        p_action: 'impersonate_user',
        p_table_name: 'impersonation_sessions',
        p_record_id: session.id,
        p_new_data: { target_user_id: user.id, target_user_name: user.full_name }
      });

      const impersonateUrl = `${window.location.origin}/cliente?impersonate=${session.session_token}`;
      window.open(impersonateUrl, '_blank');
      
      toast.success(`Simulando como ${user.full_name}`);
    } catch (error) {
      console.error("Error creating impersonation session:", error);
      toast.error("Erro ao criar sessão de simulação");
    } finally {
      setImpersonating(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && user.test_progress > 0;
    if (filter === "paying") return matchesSearch && user.purchases_count > 0;
    if (filter === "completed") return matchesSearch && user.has_mapa;
    if (filter === "pending") return matchesSearch && user.test_progress === 0;
    
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.test_progress > 0).length,
    paying: users.filter(u => u.purchases_count > 0).length,
    completed: users.filter(u => u.has_mapa).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground text-sm">Gerencie todos os usuários da plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 border-border/50">
          <p className="text-2xl font-semibold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </Card>
        <Card className="p-4 border-border/50">
          <p className="text-2xl font-semibold text-blue-600">{stats.active}</p>
          <p className="text-xs text-muted-foreground">Ativos</p>
        </Card>
        <Card className="p-4 border-border/50">
          <p className="text-2xl font-semibold text-emerald-600">{stats.paying}</p>
          <p className="text-xs text-muted-foreground">Pagantes</p>
        </Card>
        <Card className="p-4 border-border/50">
          <p className="text-2xl font-semibold text-violet-600">{stats.completed}</p>
          <p className="text-xs text-muted-foreground">Jornada Completa</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="paying">Pagantes</TabsTrigger>
                <TabsTrigger value="completed">Completos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Usuário</TableHead>
                <TableHead className="text-center">Jornada</TableHead>
                <TableHead className="text-center">Compras</TableHead>
                <TableHead className="text-center">Mapa</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.phone || "—"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(7)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full ${i < user.test_progress ? 'bg-primary' : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">{user.test_progress}/7</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={user.purchases_count > 0 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}>
                      {user.purchases_count}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.has_mapa ? (
                      <Map className="w-4 h-4 text-violet-600 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
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
                    {format(new Date(selectedUser.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Última atividade</p>
                  <p className="font-medium">
                    {selectedUser.last_activity 
                      ? format(new Date(selectedUser.last_activity), "dd/MM/yyyy HH:mm", { locale: ptBR })
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-semibold">{selectedUser.test_progress}</p>
                  <p className="text-xs text-muted-foreground">Testes Completos</p>
                </Card>
                <Card className="p-4 text-center">
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-semibold">{selectedUser.purchases_count}</p>
                  <p className="text-xs text-muted-foreground">Compras</p>
                </Card>
                <Card className="p-4 text-center">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-semibold">{selectedUser.has_mapa ? "Sim" : "Não"}</p>
                  <p className="text-xs text-muted-foreground">Mapa Gerado</p>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleImpersonate(selectedUser)}
                  disabled={selectedUser.roles.includes('admin')}
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Simular como este usuário
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
