import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
  roles: string[];
}

export const UsersManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get all roles for each user
      const { data: allRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Get auth users to get emails
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      const usersWithData = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Find all roles for this user
          const userRoles = allRoles?.filter(r => r.user_id === profile.id).map(r => r.role) || ["cliente"];
          
          // For now, use a placeholder email since we can't access auth.users easily
          // In production, you'd need a separate API endpoint with proper permissions
          return {
            ...profile,
            email: profile.id === currentUser?.id ? currentUser.email : "user@nello.one",
            roles: userRoles,
          };
        })
      );

      setUsers(usersWithData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, role: "admin" | "cliente", currentRoles: string[]) => {
    try {
      const hasRole = currentRoles.includes(role);
      
      if (hasRole) {
        // Remove role
        const { error } = await supabase.rpc("remove_user_role", {
          _user_id: userId,
          _role: role,
        });

        if (error) throw error;

        await supabase.rpc("log_audit", {
          p_action: "REMOVE_ROLE",
          p_table_name: "user_roles",
          p_record_id: userId,
          p_new_data: { role, action: "removed" } as any,
        });

        toast({
          title: "Role removida",
          description: `Role ${role} foi removida`,
        });
      } else {
        // Add role
        const { error } = await supabase.rpc("add_user_role", {
          _user_id: userId,
          _role: role,
        });

        if (error) throw error;

        await supabase.rpc("log_audit", {
          p_action: "ADD_ROLE",
          p_table_name: "user_roles",
          p_record_id: userId,
          p_new_data: { role, action: "added" } as any,
        });

        toast({
          title: "Role adicionada",
          description: `Usuário agora também é ${role}`,
        });
      }
      
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao alterar role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gerenciamento de Usuários</h2>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map((role) => (
                        <Badge key={role} variant="outline" className={getRoleBadgeColor(role)}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant={user.roles.includes("admin") ? "default" : "ghost"}
                        onClick={() => toggleUserRole(user.id, "admin", user.roles)}
                        title={user.roles.includes("admin") ? "Remover Admin" : "Adicionar Admin"}
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
