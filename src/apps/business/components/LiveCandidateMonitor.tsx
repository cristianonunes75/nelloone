import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Loader2, Clock, CheckCircle2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CandidateActivity {
  id: string;
  full_name: string;
  status: string;
  current_test: string | null;
  current_question: number;
  total_questions: number;
  last_activity_at: string | null;
  assessments: {
    test_type: string;
    status: string;
    current_question_number: number;
    last_activity_at: string | null;
  }[];
}

interface LiveCandidateMonitorProps {
  companyId: string;
}

const TEST_QUESTION_COUNTS: Record<string, number> = {
  disc: 28,
  temperamentos: 40,
};

const TEST_LABELS: Record<string, string> = {
  disc: "DISC",
  temperamentos: "Temperamentos",
};

export function LiveCandidateMonitor({ companyId }: LiveCandidateMonitorProps) {
  const [activities, setActivities] = useState<CandidateActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveCandidates = async () => {
    try {
      // Fetch candidates that are in_progress or recently active
      const { data: candidates, error: candidatesError } = await supabase
        .from("hiring_candidates")
        .select(`
          id,
          full_name,
          status,
          updated_at
        `)
        .eq("company_id", companyId)
        .in("status", ["in_progress", "assessment_started", "assessment_sent", "pending"])
        .order("updated_at", { ascending: false });

      if (candidatesError) throw candidatesError;

      if (!candidates?.length) {
        setActivities([]);
        setLoading(false);
        return;
      }

      // Fetch assessments for these candidates
      const candidateIds = candidates.map(c => c.id);
      const { data: assessments, error: assessmentsError } = await supabase
        .from("hiring_assessments")
        .select("*")
        .in("candidate_id", candidateIds);

      if (assessmentsError) throw assessmentsError;

      // Build activity data
      const activityData: CandidateActivity[] = candidates.map(candidate => {
        const candidateAssessments = (assessments || [])
          .filter(a => a.candidate_id === candidate.id)
          .map(a => ({
            test_type: a.test_type,
            status: a.status,
            current_question_number: a.current_question_number || 0,
            last_activity_at: a.last_activity_at,
          }));

        // Find the current in_progress test
        const inProgressAssessment = candidateAssessments.find(a => a.status === "in_progress");
        const currentTest = inProgressAssessment?.test_type || null;
        const currentQuestion = inProgressAssessment?.current_question_number || 0;
        const totalQuestions = currentTest ? TEST_QUESTION_COUNTS[currentTest] || 28 : 0;

        // Find most recent activity
        const lastActivity = candidateAssessments
          .filter(a => a.last_activity_at)
          .sort((a, b) => new Date(b.last_activity_at!).getTime() - new Date(a.last_activity_at!).getTime())[0];

        return {
          id: candidate.id,
          full_name: candidate.full_name,
          status: candidate.status,
          current_test: currentTest,
          current_question: currentQuestion,
          total_questions: totalQuestions,
          last_activity_at: lastActivity?.last_activity_at || candidate.updated_at,
          assessments: candidateAssessments,
        };
      });

      // Sort by activity - in_progress first, then by last activity
      const sorted = activityData.sort((a, b) => {
        if (a.status === "in_progress" && b.status !== "in_progress") return -1;
        if (b.status === "in_progress" && a.status !== "in_progress") return 1;
        return new Date(b.last_activity_at || 0).getTime() - new Date(a.last_activity_at || 0).getTime();
      });

      setActivities(sorted);
    } catch (error) {
      console.error("Error fetching active candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveCandidates();

    // Subscribe to realtime changes on hiring_assessments
    const assessmentChannel = supabase
      .channel("hiring-assessments-monitor")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hiring_assessments",
        },
        (payload) => {
          console.log("Assessment change detected:", payload);
          fetchActiveCandidates();
        }
      )
      .subscribe();

    // Subscribe to realtime changes on hiring_candidates
    const candidateChannel = supabase
      .channel("hiring-candidates-monitor")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hiring_candidates",
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          console.log("Candidate change detected:", payload);
          fetchActiveCandidates();
        }
      )
      .subscribe();

    // Refresh every 30 seconds as fallback
    const interval = setInterval(fetchActiveCandidates, 30000);

    return () => {
      supabase.removeChannel(assessmentChannel);
      supabase.removeChannel(candidateChannel);
      clearInterval(interval);
    };
  }, [companyId]);

  const getStatusIndicator = (activity: CandidateActivity) => {
    if (activity.status === "in_progress" && activity.current_test) {
      const minutesAgo = activity.last_activity_at 
        ? (Date.now() - new Date(activity.last_activity_at).getTime()) / 60000
        : Infinity;

      if (minutesAgo < 2) {
        return <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>;
      } else if (minutesAgo < 10) {
        return <span className="inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>;
      }
    }
    return <span className="inline-flex rounded-full h-3 w-3 bg-gray-300"></span>;
  };

  const getActivityText = (activity: CandidateActivity) => {
    if (!activity.last_activity_at) return "Sem atividade";
    
    try {
      return formatDistanceToNow(new Date(activity.last_activity_at), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "Sem atividade";
    }
  };

  const getTestProgress = (activity: CandidateActivity) => {
    const completedTests = activity.assessments.filter(a => a.status === "completed").length;
    const totalTests = activity.assessments.length;
    return { completed: completedTests, total: totalTests };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Monitoramento ao Vivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Monitoramento ao Vivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum candidato ativo no momento
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Monitoramento ao Vivo
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Atualização automática
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.slice(0, 5).map((activity) => {
          const testProgress = getTestProgress(activity);
          
          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              {/* Status Indicator */}
              <div className="flex-shrink-0">
                {getStatusIndicator(activity)}
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">
                    {activity.full_name}
                  </span>
                </div>
                
                {activity.current_test ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {TEST_LABELS[activity.current_test] || activity.current_test}
                      </Badge>
                      <span>
                        Pergunta {activity.current_question}/{activity.total_questions}
                      </span>
                    </div>
                    <Progress 
                      value={(activity.current_question / activity.total_questions) * 100} 
                      className="h-1.5"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {testProgress.completed > 0 ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {testProgress.completed}/{testProgress.total} testes
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Aguardando início
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Last Activity */}
              <div className="text-xs text-muted-foreground text-right whitespace-nowrap">
                {getActivityText(activity)}
              </div>
            </div>
          );
        })}

        {activities.length > 5 && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            +{activities.length - 5} candidato(s) adicional(is)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
