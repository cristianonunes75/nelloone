import { useMemo } from "react";
import { useTests } from "./useTests";

// Define the sequential order of tests in the Essentia journey
const JOURNEY_ORDER = [
  "arquetipos_proposito",
  "inteligencias_multiplas",
  "linguagens_amor",
  "mbti",
  "disc",
  "eneagrama",
  "temperamentos",
] as const;

export type TestType = typeof JOURNEY_ORDER[number];

export interface JourneyStep {
  step: number;
  testType: TestType;
  testId: string;
  name: string;
  description: string;
  questionsCount: number;
  estimatedMinutes: number;
  icon: string;
  price: number | null;
  isFree: boolean;
  status: "not_started" | "in_progress" | "completed";
  isUnlocked: boolean;
  isCurrentStep: boolean;
}

export function useJourneyProgress() {
  const { tests, userTests, getTestStatus, isLoading } = useTests();

  const journeySteps = useMemo<JourneyStep[]>(() => {
    if (!tests) return [];

    // Create a map of test type to test data
    const testByType = new Map(tests.map(t => [t.type, t]));

    // Track which step we're on (first incomplete test)
    let currentStepFound = false;

    return JOURNEY_ORDER.map((testType, index) => {
      const test = testByType.get(testType);
      if (!test) return null;

      const status = getTestStatus(test.id);
      const previousCompleted = index === 0 || 
        JOURNEY_ORDER.slice(0, index).every(prevType => {
          const prevTest = testByType.get(prevType);
          return prevTest && getTestStatus(prevTest.id) === "completed";
        });

      const isUnlocked = previousCompleted;
      const isCurrentStep = !currentStepFound && status !== "completed" && isUnlocked;
      
      if (isCurrentStep) {
        currentStepFound = true;
      }

      return {
        step: index + 1,
        testType,
        testId: test.id,
        name: test.name,
        description: test.description,
        questionsCount: test.questions_count,
        estimatedMinutes: test.estimated_minutes,
        icon: test.icon || "Circle",
        price: test.price_brl,
        isFree: test.is_free,
        status,
        isUnlocked,
        isCurrentStep,
      };
    }).filter(Boolean) as JourneyStep[];
  }, [tests, userTests, getTestStatus]);

  const completedTests = useMemo(() => {
    return journeySteps.filter(step => step.status === "completed").map(s => s.name);
  }, [journeySteps]);

  const completedCount = completedTests.length;
  const totalSteps = journeySteps.length;
  const isJourneyComplete = completedCount === totalSteps && totalSteps > 0;
  const currentStep = journeySteps.find(s => s.isCurrentStep)?.step || (isJourneyComplete ? totalSteps : 1);

  const testResults = useMemo(() => {
    const results: Record<string, any> = {};
    userTests?.forEach(ut => {
      if (ut.status === "completed" && ut.result_data) {
        const test = tests?.find(t => t.id === ut.test_id);
        if (test) {
          results[test.type] = ut.result_data;
        }
      }
    });
    return results;
  }, [userTests, tests]);

  return {
    journeySteps,
    completedTests,
    completedCount,
    totalSteps,
    isJourneyComplete,
    currentStep,
    testResults,
    isLoading,
  };
}
