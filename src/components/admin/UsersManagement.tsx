import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, UserX, UserCheck, Shield, Trash2 } from "lucide-react";
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
  role: string;
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

      // Get roles separately
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Get auth users to get emails
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      const usersWithData = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Find role
          const userRole = roles?.find(r => r.user_id === profile.id);
          
          // For now, use a placeholder email since we can't access auth.users easily
          // In production, you'd need a separate API endpoint with proper permissions
          return {
            ...profile,
            email: profile.id === currentUser?.id ? currentUser.email : "user@essentia.com.br",
            role: userRole?.role || "cliente",
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

  const changeUserRole = async (userId: string, newRole: "admin" | "fotografo" | "cliente") => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) throw error;

      await supabase.rpc("log_audit", {
        p_action: "CHANGE_ROLE",
        p_table_name: "user_roles",
        p_record_id: userId,
        p_new_data: { role: newRole } as any,
      });

      toast({
        title: "Role atualizada",
        description: `Usuário agora é ${newRole}`,
      });
      
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
      case "fotografo": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
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
                    <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {user.role !== "admin" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => changeUserRole(user.id, "admin")}
                          title="Tornar Admin"
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      )}
                      {user.role !== "fotografo" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => changeUserRole(user.id, "fotografo")}
                          title="Tornar Fotógrafo"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
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
