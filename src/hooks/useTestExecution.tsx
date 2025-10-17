import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

export const useTestExecution = (testId: string, userTestId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch questions for this test
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["test-questions", testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_id", testId)
        .order("question_number");

      if (error) throw error;
      return data;
    },
  });

  // Fetch existing answers
  const { data: answers, isLoading: answersLoading } = useQuery({
    queryKey: ["test-answers", userTestId],
    enabled: !!userTestId,
    queryFn: async () => {
      if (!userTestId) return [];

      const { data, error } = await supabase
        .from("test_answers")
        .select("*")
        .eq("user_test_id", userTestId);

      if (error) throw error;
      return data;
    },
  });

  // Save answer mutation
  const saveAnswer = useMutation({
    mutationFn: async ({
      questionId,
      answer,
    }: {
      questionId: string;
      answer: any;
    }) => {
      if (!userTestId || !user) throw new Error("User test not initialized");

      const { data, error } = await supabase
        .from("test_answers")
        .upsert({
          user_test_id: userTestId,
          question_id: questionId,
          answer,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-answers", userTestId] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar resposta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Complete test mutation
  const completeTest = useMutation({
    mutationFn: async (resultData: any) => {
      if (!userTestId || !user) throw new Error("User test not initialized");

      const { data, error } = await supabase
        .from("user_tests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          result_data: resultData,
        })
        .eq("id", userTestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-tests"] });
      toast({
        title: "Teste concluído!",
        description: "Seus resultados estão prontos.",
      });
      navigate(`/cliente/test-results/${userTestId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao finalizar teste",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const nextQuestion = useCallback(() => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [questions, currentQuestionIndex]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const getAnswerForQuestion = useCallback(
    (questionId: string) => {
      return answers?.find((a) => a.question_id === questionId);
    },
    [answers]
  );

  const progress = questions
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  return {
    questions,
    currentQuestion: questions?.[currentQuestionIndex],
    currentQuestionIndex,
    isLoading: questionsLoading || answersLoading,
    saveAnswer: saveAnswer.mutate,
    completeTest: completeTest.mutate,
    nextQuestion,
    previousQuestion,
    getAnswerForQuestion,
    progress,
    isFirstQuestion: currentQuestionIndex === 0,
    isLastQuestion: questions
      ? currentQuestionIndex === questions.length - 1
      : false,
  };
};
