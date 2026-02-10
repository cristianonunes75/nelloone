import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImpersonate } from "@/contexts/ImpersonateContext";

export const useTests = () => {
  const { user } = useAuth();
  const { impersonatedUserId, isImpersonating } = useImpersonate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { language, t } = useLanguage();

  // When impersonating, use the impersonated user's ID for data queries
  const effectiveUserId = isImpersonating ? impersonatedUserId : user?.id;

  // Fetch all available tests filtered by language
  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ["tests", language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("active", true)
        .eq("language", language)
        .order("is_free", { ascending: false })
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });

  // Fetch user's test progress (uses test type to link across languages)
  // When impersonating, fetch the impersonated user's tests
  const { data: userTests, isLoading: userTestsLoading } = useQuery({
    queryKey: ["user-tests", effectiveUserId, language],
    enabled: !!effectiveUserId,
    queryFn: async () => {
      if (!effectiveUserId) return [];

      // First get tests in current language
      const { data: languageTests } = await supabase
        .from("tests")
        .select("id, type")
        .eq("language", language)
        .eq("active", true);

      if (!languageTests) return [];

      // Get user tests for the effective user (current or impersonated)
      // ORDER BY ensures completed tests are prioritized over duplicates
      const { data, error } = await supabase
        .from("user_tests")
        .select("*, tests(*)")
        .eq("user_id", effectiveUserId!)
        .order("status", { ascending: true }) // 'completed' comes before 'in_progress' alphabetically
        .order("completed_at", { ascending: false, nullsFirst: false }); // Most recent first

      if (error) throw error;

      // Map user tests to current language tests (by type)
      // and deduplicate: keep only the best record per test type (completed > in_progress > not_started)
      const mapped = data?.map(ut => {
        const matchingTest = languageTests.find(lt => lt.type === ut.tests?.type);
        return {
          ...ut,
          test_id: matchingTest?.id || ut.test_id,
        };
      }) || [];

      // Deduplicate by test_id: since results are ordered with completed first,
      // the first occurrence for each test_id is the best one
      const seen = new Set<string>();
      return mapped.filter(ut => {
        if (seen.has(ut.test_id)) return false;
        seen.add(ut.test_id);
        return true;
      });
    },
  });

  // Start a new test
  // Prevents duplicates by checking if same TEST TYPE already exists (regardless of test_id)
  const startTest = useMutation({
    mutationFn: async (testId: string) => {
      if (!user) throw new Error("User not authenticated");

      // Fetch the type of the target test
      const { data: targetTest } = await supabase
        .from("tests")
        .select("type")
        .eq("id", testId)
        .single();
      
      if (!targetTest) throw new Error("Test not found");
      
      // Check if user_test already exists for this TEST TYPE (not just test_id)
      // This prevents duplicates when test versions change (e.g., pt-legacy → pt)
      const { data: existingTests } = await supabase
        .from("user_tests")
        .select("id, test_id, status, started_at, tests!inner(type)")
        .eq("user_id", user.id)
        .eq("tests.type", targetTest.type);
      
      // If a record exists for this type, update it instead of creating new
      if (existingTests && existingTests.length > 0) {
        // Prioritize completed record, or take the first one
        const existingRecord = existingTests.find(t => t.status === 'completed') 
                            || existingTests[0];
        
        // Update existing record to point to new test_id (preserving status if completed)
        const { data, error } = await supabase
          .from("user_tests")
          .update({
            test_id: testId,
            // Keep completed status if already completed; otherwise mark in_progress
            status: existingRecord.status === 'completed' ? 'completed' : 'in_progress',
            // Only update started_at if not completed
            ...(existingRecord.status !== 'completed' && {
              started_at: existingRecord.started_at || new Date().toISOString(),
            }),
          })
          .eq("id", existingRecord.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
      
      // No existing record for this type - create new
      const { data, error } = await supabase
        .from("user_tests")
        .insert({
          user_id: user.id,
          test_id: testId,
          status: "in_progress",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-tests"] });
      const messages = language === 'en' 
        ? { title: "Test started!", description: "Answer honestly for the best results." }
        : { title: "Teste iniciado!", description: "Responda com sinceridade para obter o melhor resultado." };
      toast(messages);
    },
    onError: (error: any) => {
      const title = language === 'en' ? "Error starting test" : "Erro ao iniciar teste";
      toast({
        title,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get test status for a specific test
  const getTestStatus = (testId: string) => {
    const userTest = userTests?.find((ut) => ut.test_id === testId);
    return userTest?.status || "not_started";
  };

  // Get test progress percentage
  const getTestProgress = (testId: string) => {
    const userTest = userTests?.find((ut) => ut.test_id === testId);
    if (!userTest) return 0;
    if (userTest.status === "completed") return 100;
    return 0;
  };

  // Reset a test (admin only)
  const resetTest = useMutation({
    mutationFn: async (testId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { data: userTest } = await supabase
        .from("user_tests")
        .select("id")
        .eq("user_id", user.id)
        .eq("test_id", testId)
        .single();

      if (!userTest) throw new Error("Test not found");

      await supabase
        .from("test_answers")
        .delete()
        .eq("user_test_id", userTest.id);

      const { error } = await supabase
        .from("user_tests")
        .update({
          status: "not_started",
          started_at: null,
          completed_at: null,
          result_data: null,
        })
        .eq("id", userTest.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-tests"] });
      const messages = language === 'en'
        ? { title: "Test reset!", description: "You can start again from scratch." }
        : { title: "Teste reiniciado!", description: "Você pode começar novamente do zero." };
      toast(messages);
    },
    onError: (error: any) => {
      const title = language === 'en' ? "Error resetting test" : "Erro ao reiniciar teste";
      toast({
        title,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    tests,
    userTests,
    isLoading: testsLoading || userTestsLoading,
    startTest: startTest.mutate,
    startTestAsync: startTest.mutateAsync,
    resetTest: resetTest.mutate,
    getTestStatus,
    getTestProgress,
  };
};
