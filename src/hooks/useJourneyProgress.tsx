import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTests } from "./useTests";
import { useTestAccess } from "./useTestAccessV2";
import { useAuth } from "./useAuth";
import { useImpersonate } from "@/contexts/ImpersonateContext";
import { supabase } from "@/integrations/supabase/client";
import { TEST_TYPE_TO_SLUG, SLUG_TO_DB_TYPES, type JourneyTestSlug } from "@/utils/journey";
import { useEntryPath } from "./useEntryPath";

// Define the sequential order of tests in the NELLO ONE journey
// OFFICIAL SLUGS: These are the canonical identifiers for the journey
// This is now the fallback - actual order comes from useEntryPath
const DEFAULT_JOURNEY_ORDER = [
  "arquetipos_proposito",
  "inteligencias_multiplas",
  "estilos_conexao",
  "nello16",
  "disc",
  "eneagrama",
  "temperamentos",
] as const;

export type TestType = typeof DEFAULT_JOURNEY_ORDER[number];

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
  const { impersonatedUserId, isImpersonating } = useImpersonate();
  const { journeyOrder } = useEntryPath();
  
  // Use impersonated user if active, otherwise use targetUserId or current user
  const effectiveUserId = targetUserId || (isImpersonating ? impersonatedUserId : user?.id);
  const isViewingOther = (!!targetUserId && targetUserId !== user?.id) || isImpersonating;
  
  const { tests, userTests: currentUserTests, getTestStatus, isLoading: testsLoading } = useTests();
  const { hasPurchased, hasFullJourneyAccess } = useTestAccess();

  // When viewing another user (admin impersonate), fetch their user_tests directly
  const { data: targetUserTests, isLoading: targetLoading } = useQuery({
    queryKey: ["target-user-tests", effectiveUserId],
    enabled: isViewingOther && !!effectiveUserId,
    queryFn: async () => {
      // ORDER BY ensures completed tests are prioritized over duplicates
      const { data, error } = await supabase
        .from("user_tests")
        .select("*, tests(*)")
        .eq("user_id", effectiveUserId!)
        .order("status", { ascending: true }) // 'completed' comes before 'in_progress' alphabetically
        .order("completed_at", { ascending: false, nullsFirst: false }); // Most recent first
      if (error) throw error;
      return data || [];
    },
  });

  // Use target user tests when viewing another user, otherwise use current user's
  const userTests = isViewingOther ? targetUserTests : currentUserTests;
  const isLoading = testsLoading || (isViewingOther && targetLoading);

  const journeySteps = useMemo<JourneyStep[]>(() => {
    if (!tests) return [];

    // Create a map of journey slug to the best test data (prioritizing tests with questions)
    // This handles duplicates and legacy type names
    const testBySlug = new Map<string, typeof tests[0]>();
    
    // For each journey slug, find the best matching test (one with questions)
    (Object.keys(SLUG_TO_DB_TYPES) as JourneyTestSlug[]).forEach(slug => {
      const possibleTypes = SLUG_TO_DB_TYPES[slug];
      
      // Find all tests matching any of the possible types
      const matchingTests = tests.filter(t => possibleTypes.includes(t.type));
      
      if (matchingTests.length > 0) {
        // Prioritize tests with questions
        const bestTest = matchingTests.reduce((best, current) => {
          const bestCount = best.questions_count || 0;
          const currentCount = current.questions_count || 0;
          return currentCount > bestCount ? current : best;
        });
        testBySlug.set(slug, bestTest);
      }
    });

    // Track which step we're on (first incomplete test)
    let currentStepFound = false;

    return journeyOrder.map((journeySlug, index) => {
      // Find the test by either the journey slug or the original database type
      const test = testBySlug.get(journeySlug);
      if (!test) return null;

      // When viewing another user, derive status from their user_tests directly
      // Match by any possible type for this journey slug (handles legacy type names)
      const possibleTypes = SLUG_TO_DB_TYPES[journeySlug as JourneyTestSlug] || [test.type];
      const userTest = userTests?.find(ut => {
        const utTest = ut.tests as any;
        return possibleTypes.includes(utTest?.type) || ut.test_id === test.id;
      });
      
      // Get base status from userTest or fallback
      const baseStatus = isViewingOther 
        ? (userTest?.status as "not_started" | "in_progress" | "completed" || "not_started")
        : getTestStatus(test.id);
      
      const isPurchased = isViewingOther ? true : (hasFullJourneyAccess || hasPurchased(test.id)); // Full journey access bypasses individual check
      
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
  }, [tests, userTests, getTestStatus, hasPurchased, isViewingOther, journeyOrder]);

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
