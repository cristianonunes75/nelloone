import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, AlertTriangle, Users, Merge, Search, RefreshCw, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserData {
  id: string;
  full_name: string;
  created_at: string;
  is_founder: boolean;
  is_deleted: boolean;
  journey_status: string;
  test_count: number;
  purchase_count: number;
  is_test_user: boolean;
  test_user_reason?: string;
}

interface DuplicateGroup {
  name: string;
  users: UserData[];
}

export const DataCleanupTool = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [testUsers, setTestUsers] = useState<UserData[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles with related data counts
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, created_at, is_founder, is_deleted, journey_status")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get test counts and purchase counts
      const enrichedUsers = await Promise.all(
        (profiles || []).map(async (profile) => {
          const [testRes, purchaseRes] = await Promise.all([
            supabase.from("user_tests").select("id", { count: "exact", head: true }).eq("user_id", profile.id),
            supabase.from("test_purchases").select("id", { count: "exact", head: true }).eq("user_id", profile.id),
          ]);

          const testCount = testRes.count || 0;
          const purchaseCount = purchaseRes.count || 0;

          // Detect test users
          const { isTestUser, reason } = detectTestUser(profile.full_name, profile.is_founder, testCount, purchaseCount);

          return {
            ...profile,
            test_count: testCount,
            purchase_count: purchaseCount,
            is_test_user: isTestUser,
            test_user_reason: reason,
          };
        })
      );

      setUsers(enrichedUsers);
      setTestUsers(enrichedUsers.filter((u) => u.is_test_user));

      // Find duplicates (same name)
      const nameGroups = new Map<string, UserData[]>();
      enrichedUsers.forEach((user) => {
        const normalizedName = user.full_name.toLowerCase().trim();
        if (!nameGroups.has(normalizedName)) {
          nameGroups.set(normalizedName, []);
        }
        nameGroups.get(normalizedName)!.push(user);
      });

      const duplicateGroups: DuplicateGroup[] = [];
      nameGroups.forEach((users, name) => {
        if (users.length > 1) {
          duplicateGroups.push({ name, users });
        }
      });

      setDuplicates(duplicateGroups);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const detectTestUser = (
    fullName: string,
    isFounder: boolean,
    testCount: number,
    purchaseCount: number
  ): { isTestUser: boolean; reason?: string } => {
    const name = fullName.toLowerCase().trim();

    // Pattern detection for test users
    const testPatterns = [
      { pattern: /^[a-z]{1,3}$/i, reason: "Nome muito curto (possível teste)" },
      { pattern: /^test/i, reason: "Nome começa com 'test'" },
      { pattern: /^teste/i, reason: "Nome começa com 'teste'" },
      { pattern: /^admin/i, reason: "Nome começa com 'admin'" },
      { pattern: /^user[0-9]/i, reason: "Padrão 'user+número'" },
      { pattern: /^aaa+$/i, reason: "Caracteres repetidos" },
      { pattern: /^sss+$/i, reason: "Caracteres repetidos" },
      { pattern: /^xxx+$/i, reason: "Caracteres repetidos" },
      { pattern: /@test\./i, reason: "Email de teste no nome" },
      { pattern: /^[0-9]+$/i, reason: "Apenas números" },
    ];

    for (const { pattern, reason } of testPatterns) {
      if (pattern.test(name)) {
        return { isTestUser: true, reason };
      }
    }

    // Founders with no activity might be test accounts
    if (isFounder && testCount === 0 && purchaseCount === 0) {
      return { isTestUser: true, reason: "Fundador sem atividade" };
    }

    return { isTestUser: false };
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const selectAllTestUsers = () => {
    const allTestUserIds = new Set(testUsers.map((u) => u.id));
    setSelectedUsers(allTestUserIds);
  };

  const clearSelection = () => {
    setSelectedUsers(new Set());
  };

  const handleDeleteSelected = async () => {
    setDeleting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const userId of selectedUsers) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await supabase.functions.invoke("admin-delete-user", {
          body: { target_user_id: userId },
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (response.error) {
          console.error(`Error deleting ${userId}:`, response.error);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        console.error(`Error deleting ${userId}:`, error);
        errorCount++;
      }
    }

    setDeleting(false);
    setDeleteDialogOpen(false);
    setSelectedUsers(new Set());

    toast({
      title: "Limpeza concluída",
      description: `${successCount} usuários deletados${errorCount > 0 ? `, ${errorCount} erros` : ""}`,
      variant: errorCount > 0 ? "destructive" : "default",
    });

    fetchData();
  };

  const filteredTestUsers = testUsers.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Limpeza de Dados</h2>
          <p className="text-muted-foreground">
            Identificar e remover usuários de teste e consolidar duplicados
          </p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card className={testUsers.length > 0 ? "border-destructive/50" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Usuários de Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{testUsers.length}</div>
          </CardContent>
        </Card>

        <Card className={duplicates.length > 0 ? "border-warning/50" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Merge className="h-5 w-5 text-amber-500" />
              Grupos Duplicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{duplicates.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="test-users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="test-users" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Usuários de Teste ({testUsers.length})
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="flex items-center gap-2">
            <Merge className="h-4 w-4" />
            Duplicados ({duplicates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test-users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Usuários Identificados como Teste</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllTestUsers}
                    disabled={testUsers.length === 0}
                  >
                    Selecionar Todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    disabled={selectedUsers.size === 0}
                  >
                    Limpar Seleção
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={selectedUsers.size === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar Selecionados ({selectedUsers.size})
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Usuários detectados automaticamente com base em padrões de nome e atividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Filtrar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Carregando...</div>
              ) : filteredTestUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p>Nenhum usuário de teste detectado!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Testes</TableHead>
                      <TableHead>Compras</TableHead>
                      <TableHead>Fundador</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestUsers.map((user) => (
                      <TableRow key={user.id} className={selectedUsers.has(user.id) ? "bg-destructive/10" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.has(user.id)}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            {user.test_user_reason}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.test_count}</TableCell>
                        <TableCell>{user.purchase_count}</TableCell>
                        <TableCell>
                          {user.is_founder && (
                            <Badge variant="secondary">Fundador</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duplicates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários com Nomes Duplicados</CardTitle>
              <CardDescription>
                Grupos de usuários com o mesmo nome que podem precisar de consolidação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Carregando...</div>
              ) : duplicates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p>Nenhum usuário duplicado encontrado!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {duplicates.map((group) => (
                    <Card key={group.name} className="border-amber-500/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg capitalize">{group.name}</CardTitle>
                        <CardDescription>{group.users.length} contas com este nome</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12"></TableHead>
                              <TableHead>ID (parcial)</TableHead>
                              <TableHead>Jornada</TableHead>
                              <TableHead>Testes</TableHead>
                              <TableHead>Compras</TableHead>
                              <TableHead>Fundador</TableHead>
                              <TableHead>Criado em</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.users.map((user) => (
                              <TableRow key={user.id} className={selectedUsers.has(user.id) ? "bg-destructive/10" : ""}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedUsers.has(user.id)}
                                    onCheckedChange={() => toggleUserSelection(user.id)}
                                  />
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {user.id.substring(0, 8)}...
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      user.journey_status === "completed"
                                        ? "default"
                                        : user.journey_status === "in_progress"
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {user.journey_status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{user.test_count}</TableCell>
                                <TableCell>{user.purchase_count}</TableCell>
                                <TableCell>
                                  {user.is_founder && <Badge variant="secondary">Fundador</Badge>}
                                </TableCell>
                                <TableCell>
                                  {new Date(user.created_at).toLocaleDateString("pt-BR")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          💡 Recomendação: Manter a conta com mais atividade (testes/compras) e deletar as outras.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Você está prestes a deletar permanentemente{" "}
                <strong className="text-destructive">{selectedUsers.size} usuário(s)</strong>.
              </p>
              <p className="text-sm">
                Esta ação irá remover:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Todas as respostas de testes</li>
                <li>Histórico de compras</li>
                <li>Conversas com IA</li>
                <li>Mapas de essência</li>
                <li>Conta de autenticação</li>
              </ul>
              <p className="text-destructive font-semibold mt-4">
                Esta ação NÃO pode ser desfeita!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deletando..." : `Deletar ${selectedUsers.size} usuário(s)`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
