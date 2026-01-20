import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEntryPath } from "./useEntryPath";

export type JourneyFlowState = 
  | "test_execution" 
  | "insight_screen" 
  | "full_results" 
  | "strategic_checkpoint" 
  | "final_report";

interface TestCompletionData {
  testId: string;
  testName: string;
  testType: string;
  userTestId: string;
  resultData: Record<string, any>;
}

export function useTestJourneyFlow() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { journeyOrder } = useEntryPath();
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  
  const [flowState, setFlowState] = useState<JourneyFlowState>("test_execution");
  const [completedTestData, setCompletedTestData] = useState<TestCompletionData | null>(null);
  const [showInsight, setShowInsight] = useState(false);

  // Calculate which test comes next based on entry path order
  const getNextTestSlug = useCallback((currentTestType: string): string | null => {
    const currentIndex = journeyOrder.findIndex(slug => slug === currentTestType);
    if (currentIndex === -1 || currentIndex >= journeyOrder.length - 1) {
      return null; // Last test or not found
    }
    return journeyOrder[currentIndex + 1];
  }, [journeyOrder]);

  // Get current test index in journey
  const getCurrentTestIndex = useCallback((testType: string): number => {
    const index = journeyOrder.findIndex(slug => slug === testType);
    return index >= 0 ? index : 0;
  }, [journeyOrder]);

  // Handle test completion - show insight screen first
  const handleTestComplete = useCallback((data: TestCompletionData) => {
    setCompletedTestData(data);
    setShowInsight(true);
    setFlowState("insight_screen");
  }, []);

  // Continue to next test from insight screen
  const continueToNextTest = useCallback(async () => {
    if (!completedTestData) return;

    const nextSlug = getNextTestSlug(completedTestData.testType);
    
    if (!nextSlug) {
      // Last test - go to strategic checkpoint, then final report
      setFlowState("strategic_checkpoint");
      return;
    }

    // Navigate to client dashboard which will show next test
    setShowInsight(false);
    setFlowState("test_execution");
    navigate(`${basePath}/cliente`);
  }, [completedTestData, getNextTestSlug, basePath, navigate]);

  // View detailed results for current test
  const viewTestDetails = useCallback(() => {
    if (!completedTestData) return;
    setFlowState("full_results");
    setShowInsight(false);
    navigate(`${basePath}/test-results/${completedTestData.userTestId}`);
  }, [completedTestData, basePath, navigate]);

  // Go to strategic checkpoint (before final report)
  const goToCheckpoint = useCallback(() => {
    setFlowState("strategic_checkpoint");
  }, []);

  // Go to final essence code report
  const goToFinalReport = useCallback(() => {
    setFlowState("final_report");
    navigate(`${basePath}/codigo-essencia`);
  }, [basePath, navigate]);

  // Reset flow state
  const resetFlow = useCallback(() => {
    setFlowState("test_execution");
    setCompletedTestData(null);
    setShowInsight(false);
  }, []);

  return {
    flowState,
    showInsight,
    completedTestData,
    journeyOrder,
    handleTestComplete,
    continueToNextTest,
    viewTestDetails,
    goToCheckpoint,
    goToFinalReport,
    resetFlow,
    getNextTestSlug,
    getCurrentTestIndex,
  };
}
