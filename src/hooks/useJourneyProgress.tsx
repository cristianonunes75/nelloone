import { useMemo } from "react";
import { useTests } from "./useTests";
import { useTestAccess } from "./useTestAccess";
import { TEST_TYPE_TO_SLUG } from "@/utils/journey";

// Define the sequential order of tests in the NELLO ONE journey
// OFFICIAL SLUGS: These are the canonical identifiers for the journey
const JOURNEY_ORDER = [
  "arquetipos_proposito",
  "inteligencias_multiplas",
  "estilos_conexao",
  "nello16",
  "disc",
  "eneagrama",
  "temperamentos",
] as const;

export type TestType = typeof JOURNEY_ORDER[number];

// Extended test status to handle freemium flow
export type ExtendedTestStatus = 
  | "not_started" 
  | "in_progress" 
  | "awaiting_payment" // Free version done, waiting for payment
  | "full_version_available" // Paid, can continue to full version
  | "completed";

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
  extendedStatus: ExtendedTestStatus; // New detailed status
  isUnlocked: boolean;
  isCurrentStep: boolean;
  needsContinuation: boolean; // User paid, needs to continue full version
}

export function useJourneyProgress() {
  const { tests, userTests, getTestStatus, isLoading } = useTests();
  const { hasPurchased } = useTestAccess();

  const journeySteps = useMemo<JourneyStep[]>(() => {
    if (!tests) return [];

    // Create a map of test type to test data
    // Support both old and new slugs by normalizing test types
    const testByType = new Map<string, typeof tests[0]>();
    tests.forEach(t => {
      // Store under original type
      testByType.set(t.type, t);
      // Also store under normalized slug for journey lookup
      const slug = TEST_TYPE_TO_SLUG[t.type];
      if (slug && slug !== t.type) {
        testByType.set(slug, t);
      }
    });

    // Track which step we're on (first incomplete test)
    let currentStepFound = false;

    return JOURNEY_ORDER.map((journeySlug, index) => {
      // Find the test by either the journey slug or the original database type
      const test = testByType.get(journeySlug);
      if (!test) return null;

      const baseStatus = getTestStatus(test.id);
      const isPurchased = hasPurchased(test.id);
      
      // Find the user_test record to check result_data
      const userTest = userTests?.find(ut => ut.test_id === test.id);
      const resultData = userTest?.result_data as any;
      
      // Determine extended status for freemium tests
      let extendedStatus: ExtendedTestStatus = baseStatus;
      let needsContinuation = false;
      
      if (test.is_free && resultData) {
        // Check if this is a freemium test awaiting payment
        if (resultData.awaiting_full_version && !isPurchased) {
          extendedStatus = "awaiting_payment";
        }
        // Check if user paid and can now continue
        else if (resultData.awaiting_full_version && isPurchased) {
          extendedStatus = "full_version_available";
          needsContinuation = true;
        }
        // Check if test is truly completed (not partial)
        else if (baseStatus === "completed" && !resultData.partial) {
          extendedStatus = "completed";
        }
        // If partial and completed but no awaiting flag (legacy), treat as awaiting payment
        else if (baseStatus === "completed" && resultData.partial && !isPurchased) {
          extendedStatus = "awaiting_payment";
        }
        // If partial, completed, and purchased - needs continuation
        else if (baseStatus === "completed" && resultData.partial && isPurchased) {
          extendedStatus = "full_version_available";
          needsContinuation = true;
        }
      }
      
      // For journey progression, consider "awaiting_payment" and "full_version_available" as "in_progress"
      const effectiveStatus = extendedStatus === "awaiting_payment" || extendedStatus === "full_version_available"
        ? "in_progress"
        : baseStatus;
      
      const previousCompleted = index === 0 || 
        JOURNEY_ORDER.slice(0, index).every(prevSlug => {
          const prevTest = testByType.get(prevSlug);
          if (!prevTest) return true;
          
          const prevStatus = getTestStatus(prevTest.id);
          const prevUserTest = userTests?.find(ut => ut.test_id === prevTest.id);
          const prevResultData = prevUserTest?.result_data as any;
          const prevIsPurchased = hasPurchased(prevTest.id);
          
          // A freemium test is "completed" for journey purposes if:
          // 1. It's truly completed (not partial), OR
          // 2. It completed free version AND user has access to continue (purchased)
          if (prevTest.is_free && prevResultData?.partial) {
            // If purchased, user can continue - consider it "in progress" not blocking
            // If not purchased, they're waiting - still doesn't block journey
            // For journey progression, free version completion is enough
            return prevResultData.free_questions_completed || prevStatus === "completed";
          }
          
          return prevStatus === "completed";
        });

      const isUnlocked = previousCompleted;
      
      // Current step is the first incomplete/in-progress test that's unlocked
      const isCurrentStep = !currentStepFound && 
        (effectiveStatus !== "completed" || needsContinuation) && 
        isUnlocked;
      
      if (isCurrentStep) {
        currentStepFound = true;
      }

      return {
        step: index + 1,
        testType: journeySlug, // Use the canonical journey slug, not the database type
        testId: test.id,
        name: test.name,
        description: test.description,
        questionsCount: test.questions_count,
        estimatedMinutes: test.estimated_minutes,
        icon: test.icon || "Circle",
        price: test.price_brl,
        isFree: test.is_free,
        status: baseStatus,
        extendedStatus,
        isUnlocked,
        isCurrentStep,
        needsContinuation,
      };
    }).filter(Boolean) as JourneyStep[];
  }, [tests, userTests, getTestStatus, hasPurchased]);

  const completedTests = useMemo(() => {
    return journeySteps.filter(step => 
      step.extendedStatus === "completed"
    ).map(s => s.name);
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
