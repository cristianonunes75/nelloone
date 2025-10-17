import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export const useTests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all available tests
  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("active", true)
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });

  // Fetch user's test progress
  const { data: userTests, isLoading: userTestsLoading } = useQuery({
    queryKey: ["user-tests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_tests")
        .select("*, tests(*)")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  // Start a new test
  const startTest = useMutation({
    mutationFn: async (testId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_tests")
        .upsert({
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
      toast({
        title: "Teste iniciado!",
        description: "Responda com sinceridade para obter o melhor resultado.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao iniciar teste",
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
    // TODO: Calculate based on answered questions
    return 0;
  };

  return {
    tests,
    userTests,
    isLoading: testsLoading || userTestsLoading,
    startTest: startTest.mutate,
    getTestStatus,
    getTestProgress,
  };
};
