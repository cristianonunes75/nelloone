import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Search, 
  Eye, 
  UserCog, 
  ShieldAlert, 
  ShieldCheck,
  Key,
  FileText,
  MessageSquare,
  CreditCard,
  Users,
  Loader2
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
}

export const UsersManagementV2 = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [impersonating, setImpersonating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Fetch user tests count
      const { data: testsData } = await supabase
        .from("user_tests")
        .select("user_id, status");

      // Fetch purchases count
      const { data: purchasesData } = await supabase
        .from("test_purchases")
        .select("user_id");

      // Fetch mapa essencia
      const { data: mapasData } = await supabase
        .from("mapa_essencia")
        .select("user_id");

      // Fetch emails from auth (we'll use profile id since it matches auth.users.id)
      const userEmails: Record<string, string> = {};
      for (const profile of profiles || []) {
        const { data } = await supabase.rpc('get_user_roles', { _user_id: profile.id });
        // For now, we'll use the profile id as a placeholder for email
      }

      const usersWithDetails: UserWithDetails[] = (profiles || []).map((profile) => {
        const userRoles = rolesData?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [];
        const userTests = testsData?.filter((t) => t.user_id === profile.id) || [];
        const completedTests = userTests.filter((t) => t.status === 'completed').length;
        const purchasesCount = purchasesData?.filter((p) => p.user_id === profile.id).length || 0;
        const hasMapa = mapasData?.some((m) => m.user_id === profile.id) || false;

        return {
          id: profile.id,
          email: `${profile.full_name.toLowerCase().replace(/\s/g, '.')}@email.com`, // Placeholder
          full_name: profile.full_name,
          phone: profile.phone,
          created_at: profile.created_at,
          roles: userRoles,
          test_progress: completedTests,
          purchases_count: purchasesCount,
          has_mapa: hasMapa,
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
    // Check if user is admin
    if (user.roles.includes('admin')) {
      toast.error("Não é permitido simular outro administrador");
      return;
    }

    setImpersonating(user.id);
    
    try {
      // Create impersonation session
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

      // Log the action
      await supabase.rpc('log_audit', {
        p_action: 'impersonate_user',
        p_table_name: 'impersonation_sessions',
        p_record_id: session.id,
        p_new_data: { target_user_id: user.id, target_user_name: user.full_name }
      });

      // Open new tab with impersonation token
      const impersonateUrl = `${window.location.origin}/cliente?impersonate=${session.session_token}`;
      window.open(impersonateUrl, '_blank');
      
      toast.success(`Simulando como ${user.full_name}`, {
        description: "Uma nova aba foi aberta com a sessão do usuário"
      });
    } catch (error) {
      console.error("Error creating impersonation session:", error);
      toast.error("Erro ao criar sessão de simulação");
    } finally {
      setImpersonating(null);
    }
  };

  const toggleUserBlock = async (userId: string, currentlyBlocked: boolean) => {
    // This would require a blocked field in profiles - simplified for now
    toast.info("Funcionalidade de bloqueio será implementada em breve");
  };

  const resetPassword = async (userId: string) => {
    toast.info("Funcionalidade de reset de senha será implementada em breve");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "fotografo": return "secondary";
      default: return "outline";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">Gerencie todos os usuários da plataforma</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Users className="w-4 h-4 mr-2" />
          {users.length} usuários
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="text-center">Testes</TableHead>
                <TableHead className="text-center">Compras</TableHead>
                <TableHead className="text-center">Mapa</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map((role) => (
                        <Badge key={role} variant={getRoleBadgeVariant(role)}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{user.test_progress}/7</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{user.purchases_count}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.has_mapa ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Sim</Badge>
                    ) : (
                      <Badge variant="outline">Não</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Usuário</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Nome</p>
                                  <p className="font-medium">{selectedUser.full_name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p className="font-medium">{selectedUser.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Telefone</p>
                                  <p className="font-medium">{selectedUser.phone || "Não informado"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Membro desde</p>
                                  <p className="font-medium">
                                    {format(new Date(selectedUser.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pt-4">
                                <Card>
                                  <CardContent className="pt-4 text-center">
                                    <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-2xl font-bold">{selectedUser.test_progress}</p>
                                    <p className="text-sm text-muted-foreground">Testes Completos</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-4 text-center">
                                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-2xl font-bold">{selectedUser.purchases_count}</p>
                                    <p className="text-sm text-muted-foreground">Compras</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-4 text-center">
                                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-2xl font-bold">-</p>
                                    <p className="text-sm text-muted-foreground">Mensagens Miguel</p>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleImpersonate(user)}
                        disabled={impersonating === user.id || user.roles.includes('admin')}
                        className="gap-2"
                      >
                        {impersonating === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserCog className="w-4 h-4" />
                        )}
                        Simular
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
