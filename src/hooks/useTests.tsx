import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useTests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { language, t } = useLanguage();

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
  const { data: userTests, isLoading: userTestsLoading } = useQuery({
    queryKey: ["user-tests", user?.id, language],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      // First get tests in current language
      const { data: languageTests } = await supabase
        .from("tests")
        .select("id, type")
        .eq("language", language)
        .eq("active", true);

      if (!languageTests) return [];

      // Get user tests
      const { data, error } = await supabase
        .from("user_tests")
        .select("*, tests(*)")
        .eq("user_id", user.id);

      if (error) throw error;

      // Map user tests to current language tests (by type)
      return data?.map(ut => {
        const matchingTest = languageTests.find(lt => lt.type === ut.tests?.type);
        return {
          ...ut,
          test_id: matchingTest?.id || ut.test_id,
        };
      }) || [];
    },
  });

  // Start a new test
  const startTest = useMutation({
    mutationFn: async (testId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_tests")
        .upsert(
          {
            user_id: user.id,
            test_id: testId,
            status: "in_progress",
            started_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,test_id",
          }
        )
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
