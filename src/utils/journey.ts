import { supabase } from "@/integrations/supabase/client";

// Valid test slugs for the NELLO ONE journey
export const JOURNEY_TEST_SLUGS = [
  'arquetipos_proposito',
  'inteligencias_multiplas',
  'estilos_conexao',
  'nello16',
  'disc',
  'eneagrama',
  'temperamentos',
] as const;

export type JourneyTestSlug = typeof JOURNEY_TEST_SLUGS[number];
export type JourneyTestStatus = 'not_started' | 'in_progress' | 'completed';
export type JourneyStatus = 'not_started' | 'in_progress' | 'completed';

export type JourneyTestsStatus = {
  [K in JourneyTestSlug]: JourneyTestStatus;
};

// Map database test types to journey slugs
// This mapping ensures backward compatibility with legacy test types
export const TEST_TYPE_TO_SLUG: Record<string, JourneyTestSlug> = {
  // Official slugs (1:1 mapping)
  'arquetipos_proposito': 'arquetipos_proposito',
  'inteligencias_multiplas': 'inteligencias_multiplas',
  'estilos_conexao': 'estilos_conexao',
  'nello16': 'nello16',
  'disc': 'disc',
  'eneagrama': 'eneagrama',
  'temperamentos': 'temperamentos',
  // Legacy mappings for backward compatibility
  'arquetipos': 'arquetipos_proposito',
  'linguagens_amor': 'estilos_conexao', // Old name for Estilos de Conexão
  'mbti': 'nello16', // Old name for Nello 16
};

/**
 * Converts a database test type to the journey test slug
 */
export function getJourneySlugFromTestType(testType: string): JourneyTestSlug | null {
  return TEST_TYPE_TO_SLUG[testType] || null;
}

/**
 * Validates if a slug is a valid journey test slug
 */
export function isValidJourneySlug(slug: string): slug is JourneyTestSlug {
  return JOURNEY_TEST_SLUGS.includes(slug as JourneyTestSlug);
}

/**
 * Updates the journey progress for a user when a test status changes
 * 
 * Rules:
 * 1. Validates testSlug is one of the 7 journey tests
 * 2. Updates journey_tests_status[testSlug] with new status
 * 3. If journey_status is 'not_started' and any test becomes 'in_progress' or 'completed':
 *    - Set journey_status = 'in_progress'
 *    - Set journey_started_at = now() if null
 * 4. Recalculates journey_completed_tests counting 'completed' tests
 * 5. If journey_completed_tests equals journey_total_tests:
 *    - Set journey_status = 'completed'
 *    - Set journey_completed_at = now() if null
 * 6. Saves updated profile
 */
export async function updateJourneyProgress(
  userId: string,
  testSlug: string,
  status: JourneyTestStatus
): Promise<{ success: boolean; error?: string }> {
  // Validate testSlug
  if (!isValidJourneySlug(testSlug)) {
    console.warn(`Invalid journey test slug: ${testSlug}`);
    return { success: false, error: `Invalid test slug: ${testSlug}` };
  }

  try {
    // Fetch current profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('journey_status, journey_total_tests, journey_completed_tests, journey_tests_status, journey_started_at, journey_completed_at')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching profile for journey update:', fetchError);
      return { success: false, error: fetchError.message };
    }

    // Parse current tests status
    const defaultTestsStatus: JourneyTestsStatus = {
      arquetipos_proposito: 'not_started',
      inteligencias_multiplas: 'not_started',
      estilos_conexao: 'not_started',
      nello16: 'not_started',
      disc: 'not_started',
      eneagrama: 'not_started',
      temperamentos: 'not_started',
    };
    const currentTestsStatus: JourneyTestsStatus = {
      ...defaultTestsStatus,
      ...(profile?.journey_tests_status as Record<string, JourneyTestStatus> || {}),
    };

    // Update the specific test status
    const updatedTestsStatus: JourneyTestsStatus = {
      ...currentTestsStatus,
      [testSlug]: status,
    };

    // Calculate completed tests count
    const completedCount = JOURNEY_TEST_SLUGS.filter(
      slug => updatedTestsStatus[slug] === 'completed'
    ).length;

    // Determine journey status
    let journeyStatus: JourneyStatus = profile?.journey_status as JourneyStatus || 'not_started';
    let journeyStartedAt = profile?.journey_started_at;
    let journeyCompletedAt = profile?.journey_completed_at;
    const totalTests = profile?.journey_total_tests || 7;

    // If any test is in_progress or completed and journey hasn't started, start it
    if (journeyStatus === 'not_started' && (status === 'in_progress' || status === 'completed')) {
      journeyStatus = 'in_progress';
      if (!journeyStartedAt) {
        journeyStartedAt = new Date().toISOString();
      }
    }

    // If all tests are completed, mark journey as completed
    if (completedCount >= totalTests) {
      journeyStatus = 'completed';
      if (!journeyCompletedAt) {
        journeyCompletedAt = new Date().toISOString();
      }
    } else if (journeyStatus === 'completed' && completedCount < totalTests) {
      // If journey was marked complete but tests aren't all done, revert to in_progress
      journeyStatus = 'in_progress';
      journeyCompletedAt = null;
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        journey_status: journeyStatus,
        journey_completed_tests: completedCount,
        journey_tests_status: JSON.parse(JSON.stringify(updatedTestsStatus)),
        journey_started_at: journeyStartedAt,
        journey_completed_at: journeyCompletedAt,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating journey progress:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log(`Journey progress updated for user ${userId}: ${testSlug} -> ${status}, completed: ${completedCount}/${totalTests}`);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating journey progress:', error);
    return { success: false, error: 'Unexpected error updating journey progress' };
  }
}

/**
 * Syncs the journey progress from user_tests table to profile
 * Useful for initial migration or fixing inconsistencies
 */
export async function syncJourneyProgressFromUserTests(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch all user tests
    const { data: userTests, error: fetchError } = await supabase
      .from('user_tests')
      .select('test_id, status, tests(type)')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Error fetching user tests:', fetchError);
      return { success: false, error: fetchError.message };
    }

    // Build tests status from user_tests
    const testsStatus: JourneyTestsStatus = {
      arquetipos_proposito: 'not_started',
      inteligencias_multiplas: 'not_started',
      estilos_conexao: 'not_started',
      nello16: 'not_started',
      disc: 'not_started',
      eneagrama: 'not_started',
      temperamentos: 'not_started',
    };

    let hasStarted = false;
    
    userTests?.forEach(ut => {
      const testType = (ut.tests as any)?.type;
      if (testType) {
        const slug = getJourneySlugFromTestType(testType);
        if (slug && isValidJourneySlug(slug)) {
          const status = ut.status as JourneyTestStatus;
          testsStatus[slug] = status;
          if (status === 'in_progress' || status === 'completed') {
            hasStarted = true;
          }
        }
      }
    });

    // Calculate completed count
    const completedCount = JOURNEY_TEST_SLUGS.filter(
      slug => testsStatus[slug] === 'completed'
    ).length;

    // Determine journey status
    let journeyStatus: JourneyStatus = 'not_started';
    if (completedCount >= 7) {
      journeyStatus = 'completed';
    } else if (hasStarted) {
      journeyStatus = 'in_progress';
    }

    // Update profile
    const updateData: Record<string, any> = {
      journey_status: journeyStatus,
      journey_completed_tests: completedCount,
      journey_tests_status: testsStatus,
    };

    if (hasStarted) {
      // Get earliest test start date
      const { data: earliestTest } = await supabase
        .from('user_tests')
        .select('started_at')
        .eq('user_id', userId)
        .not('started_at', 'is', null)
        .order('started_at', { ascending: true })
        .limit(1)
        .single();
      
      if (earliestTest?.started_at) {
        updateData.journey_started_at = earliestTest.started_at;
      }
    }

    if (journeyStatus === 'completed') {
      // Get latest test completion date
      const { data: latestTest } = await supabase
        .from('user_tests')
        .select('completed_at')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();
      
      if (latestTest?.completed_at) {
        updateData.journey_completed_at = latestTest.completed_at;
      }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (updateError) {
      console.error('Error syncing journey progress:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log(`Journey synced for user ${userId}: status=${journeyStatus}, completed=${completedCount}/7`);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error syncing journey progress:', error);
    return { success: false, error: 'Unexpected error syncing journey progress' };
  }
}
