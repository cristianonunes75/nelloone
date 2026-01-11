import { supabase } from "@/integrations/supabase/client";
import { calculateEstilosConexaoAfetiva } from "@/lib/estilosConexaoAfetiva";

interface RecalculationResult {
  userId: string;
  userTestId: string;
  userName: string;
  userEmail?: string;
  success: boolean;
  oldPrimary?: string;
  newPrimary?: string;
  newScores?: Record<string, number>;
  error?: string;
  emailSent?: boolean;
}

/**
 * Recalculates all linguagens_amor test results that have zero scores.
 * This fixes the bug where scores weren't being calculated correctly
 * because the calculation function was looking for old answer values.
 */
export async function recalculateLinguagensAmorResults(sendEmailNotifications: boolean = false): Promise<{
  total: number;
  successful: number;
  failed: number;
  emailsSent: number;
  results: RecalculationResult[];
}> {
  const results: RecalculationResult[] = [];
  let emailsSent = 0;
  
  // Get all completed linguagens_amor tests
  const { data: userTests, error: fetchError } = await supabase
    .from("user_tests")
    .select(`
      id,
      user_id,
      result_data,
      profiles!inner(full_name)
    `)
    .eq("status", "completed")
    .in("test_id", 
      // Get test IDs for linguagens_amor type
      (await supabase
        .from("tests")
        .select("id")
        .eq("type", "linguagens_amor")
      ).data?.map(t => t.id) || []
    );

  if (fetchError) {
    console.error("Error fetching user tests:", fetchError);
    return { total: 0, successful: 0, failed: 0, emailsSent: 0, results: [] };
  }

  if (!userTests || userTests.length === 0) {
    return { total: 0, successful: 0, failed: 0, emailsSent: 0, results: [] };
  }

  // Filter tests that need recalculation (scores are all zero or missing)
  const testsToRecalculate = userTests.filter(ut => {
    const resultData = ut.result_data as any;
    if (!resultData) return true;
    
    // Check if scores are all zero
    const scores = resultData.scores;
    if (!scores) return true;
    
    // Check both old and new score keys
    const hasNonZeroScore = Object.values(scores).some((v: any) => typeof v === 'number' && v > 0);
    return !hasNonZeroScore;
  });

  // Fetch user emails if we need to send notifications
  let userEmails: Record<string, string> = {};
  if (sendEmailNotifications && testsToRecalculate.length > 0) {
    const userIds = testsToRecalculate.map(ut => ut.user_id);
    try {
      const { data: emailsData } = await supabase.functions.invoke('get-user-emails', {
        body: { userIds }
      });
      if (emailsData?.emails) {
        userEmails = emailsData.emails;
      }
    } catch (error) {
      console.error("Error fetching user emails:", error);
    }
  }

  for (const userTest of testsToRecalculate) {
    const userName = (userTest.profiles as any)?.full_name || "Unknown";
    const userEmail = userEmails[userTest.user_id];
    const oldResultData = userTest.result_data as any;
    const oldPrimary = oldResultData?.primary?.name || oldResultData?.primary?.style || "Unknown";
    
    try {
      // Get all answers for this test
      const { data: answers, error: answersError } = await supabase
        .from("test_answers")
        .select("id, question_id, answer")
        .eq("user_test_id", userTest.id);

      if (answersError || !answers || answers.length === 0) {
        results.push({
          userId: userTest.user_id,
          userTestId: userTest.id,
          userName,
          userEmail,
          success: false,
          oldPrimary,
          error: answersError?.message || "No answers found",
        });
        continue;
      }

      // Recalculate using the new function
      const estilosResults = calculateEstilosConexaoAfetiva(answers as any, "pt");
      
      // Format result data
      const newResultData = {
        testType: "linguagens_amor",
        completed_at: oldResultData?.completed_at || new Date().toISOString(),
        total_questions: answers.length,
        // New format fields
        ...estilosResults,
        // Legacy compatible fields
        primary: {
          style: estilosResults.primary.style,
          score: estilosResults.primary.score,
          name: estilosResults.primary.name.pt,
          symbol: estilosResults.primary.symbol,
          essence: estilosResults.primary.essence.pt,
        },
        secondary: {
          style: estilosResults.secondary.style,
          score: estilosResults.secondary.score,
          name: estilosResults.secondary.name.pt,
          symbol: estilosResults.secondary.symbol,
          essence: estilosResults.secondary.essence.pt,
        },
      };

      // Update the user_tests record
      const { error: updateError } = await supabase
        .from("user_tests")
        .update({ result_data: newResultData })
        .eq("id", userTest.id);

      if (updateError) {
        results.push({
          userId: userTest.user_id,
          userTestId: userTest.id,
          userName,
          userEmail,
          success: false,
          oldPrimary,
          error: updateError.message,
        });
      } else {
        let emailSentSuccess = false;
        
        // Send email notification if enabled and email available
        if (sendEmailNotifications && userEmail) {
          try {
            const { error: emailError } = await supabase.functions.invoke('send-email', {
              body: {
                type: 'results_updated',
                to: userEmail,
                data: {
                  name: userName,
                  newResult: estilosResults.primary.name.pt,
                  language: 'pt'
                }
              }
            });
            if (!emailError) {
              emailSentSuccess = true;
              emailsSent++;
            }
          } catch (error) {
            console.error("Error sending email to", userEmail, error);
          }
        }
        
        results.push({
          userId: userTest.user_id,
          userTestId: userTest.id,
          userName,
          userEmail,
          success: true,
          oldPrimary,
          newPrimary: estilosResults.primary.name.pt,
          newScores: estilosResults.scores,
          emailSent: emailSentSuccess,
        });
      }
    } catch (error: any) {
      results.push({
        userId: userTest.user_id,
        userTestId: userTest.id,
        userName,
        userEmail,
        success: false,
        oldPrimary,
        error: error.message || "Unknown error",
      });
    }
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    total: testsToRecalculate.length,
    successful,
    failed,
    emailsSent,
    results,
  };
}
