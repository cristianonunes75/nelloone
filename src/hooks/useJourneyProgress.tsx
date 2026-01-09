import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTests } from "./useTests";
import { useTestAccess } from "./useTestAccess";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
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

export function useJourneyProgress(targetUserId?: string) {
  const { user } = useAuth();
  const effectiveUserId = targetUserId || user?.id;
  const isViewingOther = !!targetUserId && targetUserId !== user?.id;
  
  const { tests, userTests: currentUserTests, getTestStatus, isLoading: testsLoading } = useTests();
  const { hasPurchased } = useTestAccess();

  // When viewing another user (admin), fetch their user_tests directly
  const { data: targetUserTests, isLoading: targetLoading } = useQuery({
    queryKey: ["target-user-tests", targetUserId],
    enabled: isViewingOther,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_tests")
        .select("*, tests(*)")
        .eq("user_id", targetUserId!);
      if (error) throw error;
      return data || [];
    },
  });

  // Use target user tests when viewing another user, otherwise use current user's
  const userTests = isViewingOther ? targetUserTests : currentUserTests;
  const isLoading = testsLoading || (isViewingOther && targetLoading);

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

      // When viewing another user, derive status from their user_tests directly
      const userTest = userTests?.find(ut => {
        // Match by test type since test IDs may differ across languages
        const utTest = ut.tests as any;
        return utTest?.type === test.type || ut.test_id === test.id;
      });
      
      // Get base status from userTest or fallback
      const baseStatus = isViewingOther 
        ? (userTest?.status as "not_started" | "in_progress" | "completed" || "not_started")
        : getTestStatus(test.id);
      
      const isPurchased = isViewingOther ? true : hasPurchased(test.id); // Assume purchased for admin view
      
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
      
      // All tests are now unlocked - users can start any test in any order
      const isUnlocked = true;
      
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
  }, [tests, userTests, getTestStatus, hasPurchased, isViewingOther]);

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
