import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { useTestAccess } from "./useTestAccess";
import { useLanguage } from "@/contexts/LanguageContext";

export const useTestExecution = (testId: string, userTestId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { hasPurchased, isFounder } = useTestAccess();
  const { language } = useLanguage();
  
  // Auto-save state
  const [pendingAnswer, setPendingAnswer] = useState<{questionId: string; answer: any} | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';

  // Get test info to check if it's paid
  const { data: testInfo } = useQuery({
    queryKey: ["test-info", testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("is_free")
        .eq("id", testId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const isFreeTest = testInfo?.is_free || false;
  const hasPaidAccess = hasPurchased(testId);

  // Fetch questions for this test
  const { data: allQuestions, isLoading: questionsLoading } = useQuery({
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

  // For freemium test (Archetypes): limit to 5 questions if not purchased/founder
  // Founders always get full access to all questions
  // If user has paid, show ALL questions (full version)
  const FREEMIUM_QUESTION_LIMIT = 5;
  
  // Founders and paid users get full access regardless of is_free flag
  const questions = (isFreeTest && !hasPaidAccess && !isFounder)
    ? allQuestions?.slice(0, FREEMIUM_QUESTION_LIMIT)
    : allQuestions;

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

  // Auto-save effect: debounce saves with 1.5 second delay
  useEffect(() => {
    if (!pendingAnswer) return;

    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(async () => {
      if (!userTestId || !user || !pendingAnswer) return;

      setIsAutoSaving(true);
      try {
        await supabase
          .from("test_answers")
          .upsert(
            {
              user_test_id: userTestId,
              question_id: pendingAnswer.questionId,
              answer: pendingAnswer.answer,
            },
            {
              onConflict: "user_test_id,question_id",
            }
          );
        
        queryClient.invalidateQueries({ queryKey: ["test-answers", userTestId] });
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsAutoSaving(false);
        setPendingAnswer(null);
      }
    }, 1500);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [pendingAnswer, userTestId, user, queryClient]);

  // Cleanup on unmount - save any pending answer immediately
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Save answer mutation (immediate save)
  const saveAnswer = useMutation({
    mutationFn: async ({
      questionId,
      answer,
    }: {
      questionId: string;
      answer: any;
    }) => {
      if (!userTestId || !user) throw new Error("User test not initialized");

      // Set pending for auto-save
      setPendingAnswer({ questionId, answer });

      const { data, error } = await supabase
        .from("test_answers")
        .upsert(
          {
            user_test_id: userTestId,
            question_id: questionId,
            answer,
          },
          {
            onConflict: "user_test_id,question_id",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-answers", userTestId] });
      setPendingAnswer(null);
    },
    onError: (error: any) => {
      toast({
        title: language === 'en' ? "Error saving answer" : "Erro ao salvar resposta",
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
      const messages = language === 'en'
        ? { title: "Test completed!", description: "Your results are ready." }
        : { title: "Teste concluído!", description: "Seus resultados estão prontos." };
      toast(messages);
      navigate(`${basePath}/cliente/test-results/${userTestId}`);
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
    allQuestions, // Export all questions for reference
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
    hasPaidAccess,
    isFreeTest,
    totalQuestions: allQuestions?.length || 0,
    isFounder,
  };
};
