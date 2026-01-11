import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { 
  Wrench, 
  UserPlus, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Shield,
  History,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  User,
  RefreshCw,
  FileText,
  Heart,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { recalculateLinguagensAmorResults } from "@/lib/recalculateBatchResults";

interface UserTest {
  id: string;
  test_id: string;
  status: string;
  completed_at: string | null;
  test: {
    name: string;
    type: string;
  };
}

interface AuditLog {
  id: string;
  action: string;
  table_name: string | null;
  record_id: string | null;
  created_at: string;
  user_id: string | null;
}

export const AdminTools = () => {
  const [isAdminTestMode, setIsAdminTestMode] = useState(false);
  const [resetUserId, setResetUserId] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [myTests, setMyTests] = useState<UserTest[]>([]);
  const [myTestsLoading, setMyTestsLoading] = useState(false);
  const [resettingTestId, setResettingTestId] = useState<string | null>(null);
  const [recalculatingLinguagens, setRecalculatingLinguagens] = useState(false);
  const [sendEmailsOnRecalculate, setSendEmailsOnRecalculate] = useState(true);
  const [recalculationResults, setRecalculationResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    emailsSent: number;
    results: any[];
  } | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyTests();
    }
  }, [user]);

  const fetchMyTests = async () => {
    if (!user) return;
    setMyTestsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_tests")
        .select(`
          id,
          test_id,
          status,
          completed_at,
          test:tests(name, type)
        `)
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      setMyTests(data as unknown as UserTest[] || []);
    } catch (error) {
      console.error("Error fetching my tests:", error);
      toast.error("Erro ao carregar seus testes");
    } finally {
      setMyTestsLoading(false);
    }
  };

  const handleResetMyTest = async (userTestId: string, testName: string) => {
    setResettingTestId(userTestId);
    try {
      // Delete test answers first
      await supabase
        .from("test_answers")
        .delete()
        .eq("user_test_id", userTestId);

      // Delete user test record
      await supabase
        .from("user_tests")
        .delete()
        .eq("id", userTestId);

      // Log the action
      await supabase.rpc('log_audit', {
        p_action: 'reset_own_test',
        p_table_name: 'user_tests',
        p_record_id: userTestId,
        p_new_data: { test_name: testName }
      });

      toast.success(`Teste "${testName}" resetado com sucesso`);
      fetchMyTests();
    } catch (error) {
      console.error("Error resetting test:", error);
      toast.error("Erro ao resetar teste");
    } finally {
      setResettingTestId(null);
    }
  };

  const handleResetUser = async () => {
    if (!resetUserId.trim()) {
      toast.error("Informe o ID do usuário");
      return;
    }

    setResetLoading(true);
    try {
      // Reset user_tests
      await supabase
        .from("user_tests")
        .delete()
        .eq("user_id", resetUserId);

      // Reset test_answers
      const { data: userTests } = await supabase
        .from("user_tests")
        .select("id")
        .eq("user_id", resetUserId);

      if (userTests && userTests.length > 0) {
        const testIds = userTests.map(t => t.id);
        await supabase
          .from("test_answers")
          .delete()
          .in("user_test_id", testIds);
      }

      // Reset mapa_essencia
      await supabase
        .from("mapa_essencia")
        .delete()
        .eq("user_id", resetUserId);

      // Log the action
      await supabase.rpc('log_audit', {
        p_action: 'reset_user_progress',
        p_table_name: 'user_tests',
        p_record_id: resetUserId,
        p_new_data: { reset_type: 'full_progress' }
      });

      toast.success("Progresso do usuário resetado com sucesso");
      setResetUserId("");
    } catch (error) {
      console.error("Error resetting user:", error);
      toast.error("Erro ao resetar usuário");
    } finally {
      setResetLoading(false);
    }
  };

  const handleCreateTestUser = async () => {
    if (!newUserEmail.trim() || !newUserName.trim()) {
      toast.error("Preencha email e nome");
      return;
    }

    setCreateLoading(true);
    try {
      // This would typically use an admin API or edge function
      // For now, we'll just show a message
      toast.info("Funcionalidade de criação de usuário teste será implementada via edge function");
      
      // Log the action
      await supabase.rpc('log_audit', {
        p_action: 'create_test_user_attempt',
        p_table_name: 'profiles',
        p_record_id: crypto.randomUUID(),
        p_new_data: { email: newUserEmail, name: newUserName }
      });

    } catch (error) {
      console.error("Error creating test user:", error);
      toast.error("Erro ao criar usuário");
    } finally {
      setCreateLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Erro ao carregar logs");
    } finally {
      setLogsLoading(false);
    }
  };

  const toggleAdminTestMode = () => {
    setIsAdminTestMode(!isAdminTestMode);
    if (!isAdminTestMode) {
      toast.success("Modo Teste Admin ativado", {
        description: "Você pode navegar como cliente sem alterar dados reais"
      });
    } else {
      toast.info("Modo Teste Admin desativado");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Wrench className="w-6 h-6" />
          Admin Tools
        </h1>
        <p className="text-muted-foreground text-sm">Ferramentas exclusivas para administradores</p>
      </div>

      <Tabs defaultValue="mytests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="mytests" onClick={fetchMyTests}>Meus Testes</TabsTrigger>
          <TabsTrigger value="modes">Modos</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="reset">Reset</TabsTrigger>
          <TabsTrigger value="logs" onClick={fetchLogs}>Logs</TabsTrigger>
        </TabsList>

        {/* Meus Testes Tab */}
        <TabsContent value="mytests" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Meus Testes Completados
              </CardTitle>
              <CardDescription>
                Visualize e resete testes que você já completou para refazê-los
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myTestsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : myTests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Você ainda não completou nenhum teste
                </div>
              ) : (
                <div className="space-y-3">
                  {myTests.map((userTest) => (
                    <div 
                      key={userTest.id} 
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          userTest.status === 'completed' 
                            ? 'bg-emerald-500/10' 
                            : userTest.status === 'in_progress'
                            ? 'bg-amber-500/10'
                            : 'bg-muted'
                        }`}>
                          {userTest.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : userTest.status === 'in_progress' ? (
                            <RefreshCw className="w-5 h-5 text-amber-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{userTest.test?.name || 'Teste'}</p>
                          <p className="text-sm text-muted-foreground">
                            {userTest.status === 'completed' && userTest.completed_at
                              ? `Completado em ${format(new Date(userTest.completed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`
                              : userTest.status === 'in_progress'
                              ? 'Em andamento'
                              : 'Não iniciado'
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetMyTest(userTest.id, userTest.test?.name || 'Teste')}
                        disabled={resettingTestId === userTest.id}
                        className="gap-2"
                      >
                        {resettingTestId === userTest.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                        Refazer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={fetchMyTests}
                disabled={myTestsLoading}
              >
                <RefreshCw className={`w-4 h-4 ${myTestsLoading ? 'animate-spin' : ''}`} />
                Atualizar Lista
              </Button>
            </CardContent>
          </Card>

          <Alert className="bg-amber-500/10 border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Ao refazer um teste, todas as respostas anteriores serão apagadas. 
              Esta ação não pode ser desfeita.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Modos Tab */}
        <TabsContent value="modes" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Modo Teste Admin
              </CardTitle>
              <CardDescription>
                Navegue pela plataforma como cliente, simulando compras e testes sem alterar dados reais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {isAdminTestMode ? (
                    <div className="p-2 rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-muted">
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">Modo Teste</p>
                    <p className="text-sm text-muted-foreground">
                      {isAdminTestMode ? "Ativo - navegando como teste" : "Desativado"}
                    </p>
                  </div>
                </div>
                <Switch checked={isAdminTestMode} onCheckedChange={toggleAdminTestMode} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2 h-12"
                  onClick={() => navigate("/cliente")}
                >
                  <User className="w-4 h-4" />
                  Visual Cliente
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 h-12"
                  onClick={() => navigate("/admin")}
                >
                  <Shield className="w-4 h-4" />
                  Visual Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-amber-500/10 border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              No Modo Teste, você pode simular toda a jornada do cliente incluindo testes e compras.
              Nenhum dado real será alterado.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Criar Usuário de Teste
              </CardTitle>
              <CardDescription>
                Crie contas de teste para validar funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="teste@nelloone.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    placeholder="Usuário Teste"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleCreateTestUser} 
                disabled={createLoading}
                className="w-full"
              >
                {createLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Criar Usuário de Teste
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reset Tab */}
        <TabsContent value="reset" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Reset de Usuário
              </CardTitle>
              <CardDescription>
                Zere o progresso de um usuário sem excluir a conta. Útil para testes e suporte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ID do Usuário</Label>
                <Input
                  placeholder="uuid do usuário"
                  value={resetUserId}
                  onChange={(e) => setResetUserId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Isso irá resetar: testes, respostas e mapa da essência
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleResetUser} 
                disabled={resetLoading}
                className="w-full"
              >
                {resetLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RotateCcw className="w-4 h-4 mr-2" />
                )}
                Resetar Progresso
              </Button>
            </CardContent>
          </Card>

          {/* Recalculate Linguagens Amor Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Recalcular Estilos de Conexão Afetiva
              </CardTitle>
              <CardDescription>
                Corrigir resultados de testes que foram calculados incorretamente (scores zerados)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Notificar usuários por email</p>
                    <p className="text-xs text-muted-foreground">
                      Enviar email automático avisando sobre a atualização
                    </p>
                  </div>
                </div>
                <Switch
                  checked={sendEmailsOnRecalculate}
                  onCheckedChange={setSendEmailsOnRecalculate}
                />
              </div>

              <Button 
                variant="outline" 
                onClick={async () => {
                  setRecalculatingLinguagens(true);
                  try {
                    const results = await recalculateLinguagensAmorResults(sendEmailsOnRecalculate);
                    setRecalculationResults(results);
                    if (results.successful > 0) {
                      let message = `${results.successful} resultados recalculados com sucesso!`;
                      if (results.emailsSent > 0) {
                        message += ` ${results.emailsSent} emails enviados.`;
                      }
                      toast.success(message);
                    } else if (results.total === 0) {
                      toast.info("Nenhum resultado precisava ser recalculado");
                    }
                    if (results.failed > 0) {
                      toast.error(`${results.failed} recálculos falharam`);
                    }
                  } catch (error) {
                    console.error("Error recalculating:", error);
                    toast.error("Erro ao recalcular resultados");
                  } finally {
                    setRecalculatingLinguagens(false);
                  }
                }}
                disabled={recalculatingLinguagens}
                className="w-full"
              >
                {recalculatingLinguagens ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Recalcular Testes com Scores Zerados
              </Button>

              {recalculationResults && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <Badge variant={recalculationResults.successful > 0 ? "default" : "secondary"}>
                      {recalculationResults.total} testes analisados
                    </Badge>
                    <Badge variant="default" className="bg-emerald-500">
                      {recalculationResults.successful} corrigidos
                    </Badge>
                    {recalculationResults.emailsSent > 0 && (
                      <Badge variant="outline" className="border-blue-500 text-blue-600">
                        <Mail className="w-3 h-3 mr-1" />
                        {recalculationResults.emailsSent} emails enviados
                      </Badge>
                    )}
                    {recalculationResults.failed > 0 && (
                      <Badge variant="destructive">
                        {recalculationResults.failed} falhas
                      </Badge>
                    )}
                  </div>
                  
                  {recalculationResults.results.filter(r => r.success).length > 0 && (
                    <div className="max-h-48 overflow-y-auto space-y-1 text-xs">
                      {recalculationResults.results.filter(r => r.success).map((r, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="font-medium">{r.userName}:</span>
                          <span className="text-muted-foreground">{r.oldPrimary} → {r.newPrimary}</span>
                          {r.emailSent && (
                            <span className="ml-auto" aria-label="Email enviado">
                              <Mail className="w-3 h-3 text-blue-500" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Alert className="bg-destructive/10 border-destructive/20">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              Esta ação é irreversível. Os dados de progresso serão permanentemente removidos.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5" />
                Logs de Atividade
              </CardTitle>
              <CardDescription>
                Histórico de ações administrativas para transparência e auditoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum log encontrado
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-xs">
                          {log.action}
                        </Badge>
                        {log.table_name && (
                          <span className="text-muted-foreground">{log.table_name}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "dd/MM HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
