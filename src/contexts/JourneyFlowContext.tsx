import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEntryPath } from "@/hooks/useEntryPath";

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

interface JourneyFlowContextValue {
  flowState: JourneyFlowState;
  showInsight: boolean;
  completedTestData: TestCompletionData | null;
  journeyOrder: string[];
  handleTestComplete: (data: TestCompletionData) => void;
  continueToNextTest: () => void;
  viewTestDetails: () => void;
  goToCheckpoint: () => void;
  goToFinalReport: () => void;
  resetFlow: () => void;
  getNextTestSlug: (currentTestType: string) => string | null;
  getCurrentTestIndex: (testType: string) => number;
  completedTestCount: number;
  setCompletedTestCount: (count: number) => void;
}

const JourneyFlowContext = createContext<JourneyFlowContextValue | null>(null);

export function JourneyFlowProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { journeyOrder } = useEntryPath();
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  
  const [flowState, setFlowState] = useState<JourneyFlowState>("test_execution");
  const [completedTestData, setCompletedTestData] = useState<TestCompletionData | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [completedTestCount, setCompletedTestCount] = useState(0);

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
    // Navigate to cliente which will now show insight screen
    navigate(`${basePath}/cliente?flow=insight`);
  }, [basePath, navigate]);

  // Continue to next test from insight screen
  const continueToNextTest = useCallback(() => {
    if (!completedTestData) return;

    const nextSlug = getNextTestSlug(completedTestData.testType);
    
    if (!nextSlug) {
      // Last test - go to strategic checkpoint
      setFlowState("strategic_checkpoint");
      navigate(`${basePath}/cliente?flow=checkpoint`);
      return;
    }

    // Reset and go to dashboard to start next test
    setShowInsight(false);
    setFlowState("test_execution");
    navigate(`${basePath}/cliente`);
  }, [completedTestData, getNextTestSlug, basePath, navigate]);

  // View detailed results for current test
  const viewTestDetails = useCallback(() => {
    if (!completedTestData) return;
    setFlowState("full_results");
    setShowInsight(false);
    navigate(`${basePath}/cliente/test-results/${completedTestData.userTestId}`);
  }, [completedTestData, basePath, navigate]);

  // Go to strategic checkpoint (before final report)
  const goToCheckpoint = useCallback(() => {
    setFlowState("strategic_checkpoint");
    navigate(`${basePath}/cliente?flow=checkpoint`);
  }, [basePath, navigate]);

  // Go to final essence code report
  const goToFinalReport = useCallback(() => {
    setFlowState("final_report");
    setShowInsight(false);
    navigate(`${basePath}/codigo-essencia`);
  }, [basePath, navigate]);

  // Reset flow state
  const resetFlow = useCallback(() => {
    setFlowState("test_execution");
    setCompletedTestData(null);
    setShowInsight(false);
  }, []);

  return (
    <JourneyFlowContext.Provider value={{
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
      completedTestCount,
      setCompletedTestCount,
    }}>
      {children}
    </JourneyFlowContext.Provider>
  );
}

export function useJourneyFlow() {
  const context = useContext(JourneyFlowContext);
  if (!context) {
    throw new Error("useJourneyFlow must be used within JourneyFlowProvider");
  }
  return context;
}
