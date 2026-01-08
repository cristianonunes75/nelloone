import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { 
  Trash2, 
  AlertTriangle, 
  Users, 
  Merge, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  Activity, 
  Clock, 
  CreditCard,
  TrendingDown,
  Heart,
  AlertCircle,
  ArrowRight,
  FileDown
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

interface HealthMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  incompleteTests: number;
  pendingPurchases: number;
  abandonedJourneys: number;
  healthScore: number;
}

interface InactiveUser {
  id: string;
  full_name: string;
  created_at: string;
  days_inactive: number;
}

interface IncompleteTest {
  id: string;
  user_name: string;
  test_name: string;
  started_at: string;
  days_pending: number;
}

interface PendingPurchase {
  id: string;
  user_name: string;
  test_name: string;
  created_at: string;
  price_paid: number;
  days_pending: number;
}

export const DataCleanupTool = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [testUsers, setTestUsers] = useState<UserData[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [merging, setMerging] = useState(false);
  const [selectedMergeGroup, setSelectedMergeGroup] = useState<DuplicateGroup | null>(null);
  const [primaryUserId, setPrimaryUserId] = useState<string>("");
  
  // Health metrics
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [inactiveUsers, setInactiveUsers] = useState<InactiveUser[]>([]);
  const [incompleteTests, setIncompleteTests] = useState<IncompleteTest[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<PendingPurchase[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsersAndDuplicates(),
        fetchHealthMetrics(),
      ]);
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

  const fetchUsersAndDuplicates = async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, created_at, is_founder, is_deleted, journey_status")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (profilesError) throw profilesError;

    const enrichedUsers = await Promise.all(
      (profiles || []).map(async (profile) => {
        const [testRes, purchaseRes] = await Promise.all([
          supabase.from("user_tests").select("id", { count: "exact", head: true }).eq("user_id", profile.id),
          supabase.from("test_purchases").select("id", { count: "exact", head: true }).eq("user_id", profile.id),
        ]);

        const testCount = testRes.count || 0;
        const purchaseCount = purchaseRes.count || 0;
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

    // Find duplicates
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
  };

  const fetchHealthMetrics = async () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch inactive users (no activity in 30 days)
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("id, full_name, created_at, updated_at")
      .eq("is_deleted", false);

    const inactive: InactiveUser[] = [];
    for (const profile of allProfiles || []) {
      const { count: recentTests } = await supabase
        .from("user_tests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.id)
        .gte("updated_at", thirtyDaysAgo.toISOString());

      if (recentTests === 0) {
        const createdDate = new Date(profile.created_at);
        const daysInactive = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysInactive > 30) {
          inactive.push({
            id: profile.id,
            full_name: profile.full_name,
            created_at: profile.created_at,
            days_inactive: daysInactive,
          });
        }
      }
    }
    setInactiveUsers(inactive.sort((a, b) => b.days_inactive - a.days_inactive).slice(0, 20));

    // Fetch incomplete tests (started but not completed for more than 7 days)
    const { data: incompletedTests } = await supabase
      .from("user_tests")
      .select(`
        id,
        started_at,
        user_id,
        profiles!inner(full_name),
        tests!inner(name)
      `)
      .eq("status", "in_progress")
      .lt("started_at", sevenDaysAgo.toISOString());

    const incompleteList: IncompleteTest[] = (incompletedTests || []).map((test: any) => {
      const startedDate = new Date(test.started_at);
      return {
        id: test.id,
        user_name: test.profiles?.full_name || "Desconhecido",
        test_name: test.tests?.name || "Teste",
        started_at: test.started_at,
        days_pending: Math.floor((now.getTime() - startedDate.getTime()) / (1000 * 60 * 60 * 24)),
      };
    });
    setIncompleteTests(incompleteList.sort((a, b) => b.days_pending - a.days_pending).slice(0, 20));

    // Fetch pending purchases (payment_status = pending for more than 7 days)
    const { data: pendingPurchasesData } = await supabase
      .from("test_purchases")
      .select(`
        id,
        created_at,
        price_paid,
        user_id,
        profiles!inner(full_name),
        tests!inner(name)
      `)
      .eq("payment_status", "pending")
      .lt("purchased_at", sevenDaysAgo.toISOString());

    const pendingList: PendingPurchase[] = (pendingPurchasesData || []).map((purchase: any) => {
      const createdDate = new Date(purchase.created_at);
      return {
        id: purchase.id,
        user_name: purchase.profiles?.full_name || "Desconhecido",
        test_name: purchase.tests?.name || "Produto",
        created_at: purchase.created_at,
        price_paid: purchase.price_paid,
        days_pending: Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)),
      };
    });
    setPendingPurchases(pendingList.sort((a, b) => b.days_pending - a.days_pending).slice(0, 20));

    // Calculate health score
    const totalUsers = allProfiles?.length || 1;
    const activeUsers = totalUsers - inactive.length;
    const healthScore = Math.round(
      ((activeUsers / totalUsers) * 40) +
      ((1 - Math.min(incompleteList.length / totalUsers, 1)) * 30) +
      ((1 - Math.min(pendingList.length / totalUsers, 1)) * 30)
    );

    setHealthMetrics({
      totalUsers,
      activeUsers,
      inactiveUsers: inactive.length,
      incompleteTests: incompleteList.length,
      pendingPurchases: pendingList.length,
      abandonedJourneys: inactive.filter(u => u.days_inactive > 60).length,
      healthScore: Math.max(0, Math.min(100, healthScore)),
    });
  };

  const detectTestUser = (
    fullName: string,
    isFounder: boolean,
    testCount: number,
    purchaseCount: number
  ): { isTestUser: boolean; reason?: string } => {
    const name = fullName.toLowerCase().trim();

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
    setSelectedUsers(new Set(testUsers.map((u) => u.id)));
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
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });

        if (response.error) {
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
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

  const openMergeDialog = (group: DuplicateGroup) => {
    setSelectedMergeGroup(group);
    // Auto-select the user with most activity as primary
    const sorted = [...group.users].sort((a, b) => 
      (b.test_count + b.purchase_count) - (a.test_count + a.purchase_count)
    );
    setPrimaryUserId(sorted[0]?.id || "");
    setMergeDialogOpen(true);
  };

  const handleMergeUsers = async () => {
    if (!selectedMergeGroup || !primaryUserId) return;

    setMerging(true);
    const secondaryUserIds = selectedMergeGroup.users
      .filter(u => u.id !== primaryUserId)
      .map(u => u.id);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Transfer all data from secondary users to primary user
      for (const secondaryId of secondaryUserIds) {
        // Transfer user_tests
        await supabase
          .from("user_tests")
          .update({ user_id: primaryUserId })
          .eq("user_id", secondaryId);

        // Transfer test_purchases
        await supabase
          .from("test_purchases")
          .update({ user_id: primaryUserId })
          .eq("user_id", secondaryId);

        // Transfer test_answers via user_tests (already transferred above, but ensure consistency)
        
        // Transfer ai_conversations
        await supabase
          .from("ai_conversations")
          .update({ user_id: primaryUserId })
          .eq("user_id", secondaryId);

        // Transfer mapa_essencia
        await supabase
          .from("mapa_essencia")
          .update({ user_id: primaryUserId })
          .eq("user_id", secondaryId);

        // Delete the secondary user
        await supabase.functions.invoke("admin-delete-user", {
          body: { target_user_id: secondaryId },
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });
      }

      // Log the merge action
      await supabase.rpc("log_audit", {
        p_action: "MERGE_USERS",
        p_table_name: "profiles",
        p_record_id: primaryUserId,
        p_new_data: {
          primary_user_id: primaryUserId,
          merged_user_ids: secondaryUserIds,
          merged_at: new Date().toISOString(),
        },
      });

      toast({
        title: "Merge concluído",
        description: `${secondaryUserIds.length} conta(s) consolidada(s) com sucesso`,
      });

      setMergeDialogOpen(false);
      setSelectedMergeGroup(null);
      setPrimaryUserId("");
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao fazer merge",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setMerging(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    return "Crítico";
  };

  const exportHealthReportPDF = () => {
    if (!healthMetrics) return;

    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR");
    const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Saúde dos Dados", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Gerado em ${dateStr} às ${timeStr}`, 20, 33);
    doc.setTextColor(0);

    // Health Score Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Índice de Saúde", 20, 50);
    
    doc.setFontSize(28);
    const scoreColor = healthMetrics.healthScore >= 80 ? [34, 197, 94] : 
                       healthMetrics.healthScore >= 60 ? [234, 179, 8] : [239, 68, 68];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${healthMetrics.healthScore}%`, 20, 65);
    
    doc.setFontSize(12);
    doc.text(getHealthScoreLabel(healthMetrics.healthScore), 55, 65);
    doc.setTextColor(0);

    // Metrics Grid
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Métricas Gerais", 20, 85);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const metrics = [
      { label: "Total de Usuários", value: healthMetrics.totalUsers },
      { label: "Usuários Ativos", value: healthMetrics.activeUsers },
      { label: "Usuários Inativos (30d)", value: healthMetrics.inactiveUsers },
      { label: "Testes Parados (7d+)", value: healthMetrics.incompleteTests },
      { label: "Pagamentos Pendentes", value: healthMetrics.pendingPurchases },
      { label: "Jornadas Abandonadas (60d+)", value: healthMetrics.abandonedJourneys },
    ];

    let yPos = 95;
    metrics.forEach((metric, i) => {
      doc.text(`• ${metric.label}:`, 25, yPos);
      doc.setFont("helvetica", "bold");
      doc.text(metric.value.toString(), 120, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 8;
    });

    // Issues Section
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Problemas Identificados", 20, yPos);
    yPos += 10;

    // Inactive Users
    doc.setFontSize(11);
    doc.text(`Usuários Inativos (Top 10)`, 25, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    inactiveUsers.slice(0, 10).forEach((user) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`  - ${user.full_name} (${user.days_inactive} dias)`, 30, yPos);
      yPos += 5;
    });

    // Incomplete Tests
    yPos += 5;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Testes Incompletos (Top 10)`, 25, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    incompleteTests.slice(0, 10).forEach((test) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`  - ${test.user_name}: ${test.test_name} (${test.days_pending} dias)`, 30, yPos);
      yPos += 5;
    });

    // Pending Purchases
    yPos += 5;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Compras Pendentes (Top 10)`, 25, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    pendingPurchases.slice(0, 10).forEach((purchase) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`  - ${purchase.user_name}: R$ ${purchase.price_paid} (${purchase.days_pending} dias)`, 30, yPos);
      yPos += 5;
    });

    // Duplicates Summary
    yPos += 10;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Grupos Duplicados: ${duplicates.length}`, 25, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    duplicates.slice(0, 10).forEach((group) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`  - "${group.name}" (${group.users.length} contas)`, 30, yPos);
      yPos += 5;
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`NELLO ONE - Relatório de Saúde dos Dados - Página ${i} de ${pageCount}`, 20, 285);
    }

    // Save
    const fileName = `relatorio-saude-dados-${now.toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);

    toast({
      title: "PDF exportado!",
      description: `Arquivo ${fileName} baixado com sucesso`,
    });
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
            Saúde dos dados, usuários de teste e consolidação de duplicados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportHealthReportPDF} disabled={!healthMetrics}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Saúde
          </TabsTrigger>
          <TabsTrigger value="test-users" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Teste ({testUsers.length})
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="flex items-center gap-2">
            <Merge className="h-4 w-4" />
            Duplicados ({duplicates.length})
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Problemas
          </TabsTrigger>
        </TabsList>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4">
          {healthMetrics && (
            <>
              {/* Health Score Card */}
              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Índice de Saúde dos Dados
                    </span>
                    <span className={`text-3xl font-bold ${getHealthScoreColor(healthMetrics.healthScore)}`}>
                      {healthMetrics.healthScore}%
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Status: <span className={`font-semibold ${getHealthScoreColor(healthMetrics.healthScore)}`}>
                      {getHealthScoreLabel(healthMetrics.healthScore)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={healthMetrics.healthScore} 
                    className="h-3"
                  />
                </CardContent>
              </Card>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{healthMetrics.totalUsers}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      Ativos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{healthMetrics.activeUsers}</div>
                  </CardContent>
                </Card>

                <Card className={healthMetrics.inactiveUsers > 5 ? "border-amber-500/50" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-amber-500" />
                      Inativos (30d)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-500">{healthMetrics.inactiveUsers}</div>
                  </CardContent>
                </Card>

                <Card className={healthMetrics.incompleteTests > 0 ? "border-orange-500/50" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      Testes Parados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{healthMetrics.incompleteTests}</div>
                  </CardContent>
                </Card>

                <Card className={healthMetrics.pendingPurchases > 0 ? "border-red-500/50" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-red-500" />
                      Pagamentos Pend.
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">{healthMetrics.pendingPurchases}</div>
                  </CardContent>
                </Card>

                <Card className={healthMetrics.abandonedJourneys > 0 ? "border-purple-500/50" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-purple-500" />
                      Abandonos (60d)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-500">{healthMetrics.abandonedJourneys}</div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Inactive Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-amber-500" />
                  Usuários Inativos
                </CardTitle>
                <CardDescription>Sem atividade há mais de 30 dias</CardDescription>
              </CardHeader>
              <CardContent className="max-h-80 overflow-auto">
                {inactiveUsers.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    Todos os usuários estão ativos!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {inactiveUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium truncate flex-1">{user.full_name}</span>
                        <Badge variant="outline" className="ml-2 text-amber-600">
                          {user.days_inactive}d
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Incomplete Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Testes Incompletos
                </CardTitle>
                <CardDescription>Iniciados há mais de 7 dias</CardDescription>
              </CardHeader>
              <CardContent className="max-h-80 overflow-auto">
                {incompleteTests.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    Nenhum teste parado!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {incompleteTests.map((test) => (
                      <div key={test.id} className="p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{test.user_name}</span>
                          <Badge variant="outline" className="text-orange-600">
                            {test.days_pending}d
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{test.test_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Purchases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-red-500" />
                  Compras Pendentes
                </CardTitle>
                <CardDescription>Aguardando pagamento há mais de 7 dias</CardDescription>
              </CardHeader>
              <CardContent className="max-h-80 overflow-auto">
                {pendingPurchases.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    Nenhuma compra pendente!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingPurchases.map((purchase) => (
                      <div key={purchase.id} className="p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{purchase.user_name}</span>
                          <Badge variant="outline" className="text-red-600">
                            R$ {purchase.price_paid}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{purchase.test_name}</span>
                          <span className="text-xs text-muted-foreground">{purchase.days_pending}d</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Test Users Tab */}
        <TabsContent value="test-users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <span>Usuários de Teste</span>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={selectAllTestUsers} disabled={testUsers.length === 0}>
                    Selecionar Todos
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection} disabled={selectedUsers.size === 0}>
                    Limpar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={selectedUsers.size === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar ({selectedUsers.size})
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Filtrar..."
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
                  <p>Nenhum usuário de teste!</p>
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
                      <TableHead>Criado</TableHead>
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
                          <Badge variant="outline" className="bg-destructive/10 text-destructive">
                            {user.test_user_reason}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.test_count}</TableCell>
                        <TableCell>{user.purchase_count}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Duplicates Tab */}
        <TabsContent value="duplicates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Duplicados</CardTitle>
              <CardDescription>
                Clique em "Consolidar" para mesclar contas mantendo o histórico
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Carregando...</div>
              ) : duplicates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p>Nenhum duplicado encontrado!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {duplicates.map((group) => (
                    <Card key={group.name} className="border-amber-500/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg capitalize">{group.name}</CardTitle>
                            <CardDescription>{group.users.length} contas</CardDescription>
                          </div>
                          <Button size="sm" onClick={() => openMergeDialog(group)}>
                            <Merge className="mr-2 h-4 w-4" />
                            Consolidar
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {group.users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">{user.id.substring(0, 8)}...</span>
                                <Badge variant={user.journey_status === "completed" ? "default" : "outline"}>
                                  {user.journey_status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{user.test_count} testes</span>
                                <span>{user.purchase_count} compras</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deletar permanentemente <strong className="text-destructive">{selectedUsers.size}</strong> usuário(s)?
              Esta ação NÃO pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Merge Dialog */}
      <AlertDialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Merge className="h-5 w-5 text-blue-500" />
              Consolidar Contas
            </AlertDialogTitle>
            <AlertDialogDescription>
              Selecione a conta principal que receberá todo o histórico das outras contas.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedMergeGroup && (
            <div className="py-4">
              <RadioGroup value={primaryUserId} onValueChange={setPrimaryUserId}>
                {selectedMergeGroup.users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                    <RadioGroupItem value={user.id} id={user.id} />
                    <Label htmlFor={user.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs">{user.id.substring(0, 8)}...</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={user.journey_status === "completed" ? "default" : "outline"} className="text-xs">
                              {user.journey_status}
                            </Badge>
                            {user.is_founder && <Badge variant="secondary" className="text-xs">Fundador</Badge>}
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{user.test_count} testes</div>
                          <div>{user.purchase_count} compras</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>O que acontecerá:</strong>
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Testes serão transferidos para a conta principal
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Compras serão transferidas para a conta principal
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Conversas com IA serão preservadas
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Outras contas serão deletadas
                  </li>
                </ul>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={merging}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMergeUsers}
              disabled={merging || !primaryUserId}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {merging ? "Consolidando..." : "Consolidar Contas"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
