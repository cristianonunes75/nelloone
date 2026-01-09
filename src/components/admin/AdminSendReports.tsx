import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePDFEmail } from "@/hooks/usePDFEmail";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Search,
  Mail,
  CheckCircle2,
  Circle,
  Loader2,
  User,
  Sparkles,
  RefreshCw,
} from "lucide-react";

const TEST_TYPE_MAP: Record<string, { name: string; icon: string }> = {
  disc: { name: "DISC", icon: "🎯" },
  mbti: { name: "Nello 16 Personalidades", icon: "🧠" },
  eneagrama: { name: "Eneagrama", icon: "🔢" },
  temperamentos: { name: "Temperamentos", icon: "🌡️" },
  linguagens_amor: { name: "Estilos de Conexão", icon: "💕" },
  inteligencias_multiplas: { name: "Inteligências Múltiplas", icon: "💡" },
  arquetipos_proposito: { name: "Arquétipos", icon: "⚡" },
};

interface UserWithEmail {
  id: string;
  full_name: string;
  email?: string;
}

interface UserTest {
  id: string;
  test_id: string;
  status: string;
  completed_at: string | null;
  result_data: any;
  test: {
    type: string;
    name: string;
  };
}

interface MapaEssencia {
  id: string;
  created_at: string;
  updated_at: string;
}

export function AdminSendReports() {
  const { user } = useAuth();
  const { sendPDFByEmail, isSending } = usePDFEmail();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserWithEmail[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithEmail | null>(null);
  const [userTests, setUserTests] = useState<UserTest[]>([]);
  const [mapaEssencia, setMapaEssencia] = useState<MapaEssencia | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "test" | "mapa";
    testId?: string;
    testType?: string;
    testName?: string;
  }>({ open: false, type: "test" });
  
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Search users
  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        // Get profiles matching search
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .or(`full_name.ilike.%${searchTerm}%`)
          .eq("is_deleted", false)
          .limit(10);

        if (error) throw error;

        if (profiles && profiles.length > 0) {
          // Get emails for these users
          const { data: emailData } = await supabase.functions.invoke("get-user-emails", {
            body: { userIds: profiles.map((p) => p.id) },
          });

          const usersWithEmail = profiles.map((profile) => ({
            ...profile,
            email: emailData?.emails?.find((e: any) => e.id === profile.id)?.email,
          }));

          setUsers(usersWithEmail);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        toast.error("Erro ao buscar usuários");
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Load user tests when selected
  const loadUserTests = async (userId: string) => {
    setIsLoadingTests(true);
    try {
      // Get user tests with test info
      const { data: tests, error: testsError } = await supabase
        .from("user_tests")
        .select(`
          id,
          test_id,
          status,
          completed_at,
          result_data,
          test:tests(type, name)
        `)
        .eq("user_id", userId);

      if (testsError) throw testsError;

      // Get mapa essencia
      const { data: mapa, error: mapaError } = await supabase
        .from("mapa_essencia")
        .select("id, created_at, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (mapaError && mapaError.code !== "PGRST116") throw mapaError;

      setUserTests((tests as UserTest[]) || []);
      setMapaEssencia(mapa);
    } catch (error) {
      console.error("Error loading user tests:", error);
      toast.error("Erro ao carregar testes do usuário");
    } finally {
      setIsLoadingTests(false);
    }
  };

  const selectUser = (user: UserWithEmail) => {
    setSelectedUser(user);
    setSearchTerm("");
    setUsers([]);
    loadUserTests(user.id);
  };

  const handleSendTest = async () => {
    if (!selectedUser || !confirmDialog.testId || !confirmDialog.testType) return;

    const test = userTests.find((t) => t.id === confirmDialog.testId);
    if (!test || !test.result_data) {
      toast.error("Dados do teste não encontrados");
      return;
    }

    setSendingId(confirmDialog.testId);
    setConfirmDialog({ open: false, type: "test" });

    try {
      const success = await sendPDFByEmail({
        testType: confirmDialog.testType,
        testName: confirmDialog.testName || "",
        userName: selectedUser.full_name,
        userEmail: selectedUser.email || "",
        language: "pt",
        resultData: test.result_data,
      });

      if (success) {
        // Log audit
        await supabase.rpc("log_audit", {
          p_action: "admin_send_pdf",
          p_table_name: "user_tests",
          p_record_id: confirmDialog.testId,
          p_new_data: {
            sent_to: selectedUser.email,
            test_type: confirmDialog.testType,
            sent_by_admin: user?.id,
          },
        });
      }
    } finally {
      setSendingId(null);
    }
  };

  const handleSendMapa = async () => {
    if (!selectedUser || !mapaEssencia) return;

    setSendingId("mapa");
    setConfirmDialog({ open: false, type: "mapa" });

    try {
      // For now, we'll show a message that this feature is coming soon
      // Full implementation would require generating the Código da Essência PDF
      toast.info("Funcionalidade de envio do Código da Essência em desenvolvimento");
      
      // Log audit
      await supabase.rpc("log_audit", {
        p_action: "admin_send_codigo_essencia",
        p_table_name: "mapa_essencia",
        p_record_id: mapaEssencia.id,
        p_new_data: {
          sent_to: selectedUser.email,
          sent_by_admin: user?.id,
        },
      });
    } finally {
      setSendingId(null);
    }
  };

  const completedTests = userTests.filter((t) => t.status === "completed");
  const pendingTests = userTests.filter((t) => t.status !== "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Enviar Relatórios</h1>
        <p className="text-muted-foreground mt-1">
          Envie PDFs dos testes para usuários que não conseguem baixar
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar Usuário</CardTitle>
          <CardDescription>Digite o nome do usuário para buscar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome do usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search results */}
          {users.length > 0 && (
            <div className="mt-3 border rounded-lg divide-y">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => selectUser(u)}
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground">{u.email || "Email não disponível"}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected user */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedUser.full_name}</CardTitle>
                  <CardDescription>{selectedUser.email || "Email não disponível"}</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadUserTests(selectedUser.id)}
                disabled={isLoadingTests}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingTests ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingTests ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Completed tests */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Testes Completados ({completedTests.length})
                  </h3>
                  {completedTests.length > 0 ? (
                    <div className="space-y-2">
                      {completedTests.map((test) => {
                        const testInfo = TEST_TYPE_MAP[test.test?.type] || {
                          name: test.test?.name || "Teste",
                          icon: "📝",
                        };
                        const isSendingThis = sendingId === test.id || isSending;
                        
                        return (
                          <div
                            key={test.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{testInfo.icon}</span>
                              <div>
                                <p className="font-medium text-sm">{testInfo.name}</p>
                                {test.completed_at && (
                                  <p className="text-xs text-muted-foreground">
                                    Concluído em {format(new Date(test.completed_at), "dd/MM/yyyy", { locale: ptBR })}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isSendingThis || !selectedUser.email}
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  type: "test",
                                  testId: test.id,
                                  testType: test.test?.type,
                                  testName: testInfo.name,
                                })
                              }
                            >
                              {sendingId === test.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Mail className="h-4 w-4 mr-1" />
                                  Enviar
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg bg-muted/20">
                      Nenhum teste completado
                    </p>
                  )}
                </div>

                {/* Pending tests */}
                {pendingTests.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      Testes Pendentes ({pendingTests.length})
                    </h3>
                    <div className="space-y-2">
                      {pendingTests.map((test) => {
                        const testInfo = TEST_TYPE_MAP[test.test?.type] || {
                          name: test.test?.name || "Teste",
                          icon: "📝",
                        };
                        return (
                          <div
                            key={test.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 opacity-60"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{testInfo.icon}</span>
                              <div>
                                <p className="font-medium text-sm">{testInfo.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {test.status === "in_progress" ? "Em andamento" : "Não iniciado"}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Pendente
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Código da Essência */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Código da Essência
                  </h3>
                  {mapaEssencia ? (
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">✨</span>
                        <div>
                          <p className="font-medium text-sm">Mapa Gerado</p>
                          <p className="text-xs text-muted-foreground">
                            Atualizado em {format(new Date(mapaEssencia.updated_at), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={sendingId === "mapa" || !selectedUser.email}
                        onClick={() => setConfirmDialog({ open: true, type: "mapa" })}
                      >
                        {sendingId === "mapa" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-1" />
                            Enviar
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg bg-muted/20">
                      Código da Essência ainda não gerado
                    </p>
                  )}
                </div>

                {!selectedUser.email && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      ⚠️ Email do usuário não disponível. Não é possível enviar relatórios.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirm dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar envio</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "test" ? (
                <>
                  Deseja enviar o PDF do teste <strong>{confirmDialog.testName}</strong> para{" "}
                  <strong>{selectedUser?.email}</strong>?
                </>
              ) : (
                <>
                  Deseja enviar o <strong>Código da Essência</strong> para <strong>{selectedUser?.email}</strong>?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.type === "test" ? handleSendTest : handleSendMapa}>
              Enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
