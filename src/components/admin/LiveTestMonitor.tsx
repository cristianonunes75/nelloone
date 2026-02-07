import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Eye, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActiveTest {
  id: string;
  user_id: string;
  test_id: string;
  updated_at: string;
  full_name: string;
  test_name: string;
  total_questions: number;
  answered_questions: number;
}

interface LiveTestMonitorProps {
  compact?: boolean;
}

export const LiveTestMonitor = ({ compact = false }: LiveTestMonitorProps) => {
  const [activeTests, setActiveTests] = useState<ActiveTest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveTests = async () => {
    try {
      // Get user_tests in progress with profile and test info
      const { data: userTests, error: utError } = await supabase
        .from("user_tests")
        .select(`
          id,
          user_id,
          test_id,
          updated_at,
          profiles!inner(full_name),
          tests!inner(name)
        `)
        .eq("status", "in_progress")
        .order("updated_at", { ascending: false })
        .limit(compact ? 5 : 15);

      if (utError) {
        console.error("Error fetching user_tests:", utError);
        return;
      }

      if (!userTests || userTests.length === 0) {
        setActiveTests([]);
        setLoading(false);
        return;
      }

      // Get answer counts for each user_test
      const testIds = [...new Set(userTests.map((ut) => ut.test_id))];
      const userTestIds = userTests.map((ut) => ut.id);

      const [questionCounts, answerCounts] = await Promise.all([
        // Get total questions per test
        supabase
          .from("test_questions")
          .select("test_id")
          .in("test_id", testIds),
        // Get answer counts per user_test
        supabase
          .from("test_answers")
          .select("user_test_id")
          .in("user_test_id", userTestIds),
      ]);

      // Count questions per test
      const questionsMap: Record<string, number> = {};
      (questionCounts.data || []).forEach((q: any) => {
        questionsMap[q.test_id] = (questionsMap[q.test_id] || 0) + 1;
      });

      // Count answers per user_test
      const answersMap: Record<string, number> = {};
      (answerCounts.data || []).forEach((a: any) => {
        answersMap[a.user_test_id] = (answersMap[a.user_test_id] || 0) + 1;
      });

      // Combine data
      const combined: ActiveTest[] = userTests.map((ut: any) => ({
        id: ut.id,
        user_id: ut.user_id,
        test_id: ut.test_id,
        updated_at: ut.updated_at,
        full_name: ut.profiles?.full_name || "Usuário",
        test_name: ut.tests?.name || "Teste",
        total_questions: questionsMap[ut.test_id] || 0,
        answered_questions: answersMap[ut.id] || 0,
      }));

      setActiveTests(combined);
    } catch (error) {
      console.error("Error in fetchActiveTests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTests();

    // Subscribe to user_tests changes
    const userTestsChannel = supabase
      .channel("live-user-tests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_tests" },
        () => fetchActiveTests()
      )
      .subscribe();

    // Subscribe to test_answers (new answers = progress update)
    const answersChannel = supabase
      .channel("live-test-answers")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "test_answers" },
        () => fetchActiveTests()
      )
      .subscribe();

    // Fallback refresh every 30s
    const interval = setInterval(fetchActiveTests, 30000);

    return () => {
      supabase.removeChannel(userTestsChannel);
      supabase.removeChannel(answersChannel);
      clearInterval(interval);
    };
  }, []);

  const getActivityIndicator = (updatedAt: string) => {
    const minutesAgo = (Date.now() - new Date(updatedAt).getTime()) / 60000;

    if (minutesAgo < 2) {
      // Green pulsing - active now
      return (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
      );
    } else if (minutesAgo < 10) {
      // Yellow - recently active
      return <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />;
    }
    // Gray - inactive
    return <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />;
  };

  const getProgressPercent = (answered: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((answered / total) * 100);
  };

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-ink flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            Testes ao Vivo
          </h3>
          <Badge variant="outline" className="text-xs gap-1">
            <Users className="w-3 h-3" />
            {activeTests.length}
          </Badge>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : activeTests.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Nenhum teste em andamento
          </div>
        ) : (
          <div className="space-y-2">
            {activeTests.slice(0, 3).map((test) => (
              <div
                key={test.id}
                className="flex items-center gap-2 text-sm animate-in fade-in"
              >
                {getActivityIndicator(test.updated_at)}
                <span className="truncate flex-1 text-ink">
                  {test.full_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {test.answered_questions}/{test.total_questions}
                </span>
              </div>
            ))}
            {activeTests.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{activeTests.length - 3} mais
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          Usuários Fazendo Testes Agora
        </h3>
        <Badge variant="outline" className="gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {activeTests.length} {activeTests.length === 1 ? "pessoa" : "pessoas"}
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Carregando...
        </div>
      ) : activeTests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Nenhum teste em andamento no momento
        </div>
      ) : (
        <div className="space-y-3">
          {activeTests.map((test) => {
            const percent = getProgressPercent(
              test.answered_questions,
              test.total_questions
            );
            return (
              <div
                key={test.id}
                className="p-3 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-top-2"
              >
                <div className="flex items-center gap-3 mb-2">
                  {getActivityIndicator(test.updated_at)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {test.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {test.test_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-ink">
                      {test.answered_questions}/{test.total_questions}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(test.updated_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
                <Progress value={percent} className="h-1.5" />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
