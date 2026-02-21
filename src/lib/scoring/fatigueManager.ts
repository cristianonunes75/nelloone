/**
 * Fatigue Management System for Identity V1
 * 
 * Calculates estimated time remaining, manages checkpoints,
 * and supports pause/resume for long test journeys.
 */

// Average seconds per question by test type (empirical estimates)
const AVG_SECONDS_PER_QUESTION: Record<string, number> = {
  disc: 15,
  temperamentos: 15,
  eneagrama: 20,
  inteligencias_multiplas: 18,
  estilos_conexao_afetiva: 12,
  linguagens_amor: 12, // LEGACY alias
  arquetipos_proposito: 10,
  mbti: 15,
  nello16: 15,
};

const DEFAULT_SECONDS_PER_QUESTION = 15;

export interface FatigueEstimate {
  questionsAnswered: number;
  totalQuestions: number;
  questionsRemaining: number;
  estimatedSecondsRemaining: number;
  estimatedMinutesRemaining: number;
  progressPercent: number;
  shouldSuggestBreak: boolean; // after ~15min continuous
}

export interface JourneyTimeEstimate {
  totalTests: number;
  testsCompleted: number;
  testsRemaining: number;
  totalEstimatedMinutes: number;
  remainingEstimatedMinutes: number;
  progressPercent: number;
}

/**
 * Estimate time remaining for current test
 */
export function estimateTestTime(
  testType: string,
  questionsAnswered: number,
  totalQuestions: number,
  elapsedSeconds?: number
): FatigueEstimate {
  const questionsRemaining = Math.max(0, totalQuestions - questionsAnswered);
  
  // Use actual pace if available, otherwise use estimate
  let avgSecondsPerQ: number;
  if (elapsedSeconds && questionsAnswered > 3) {
    avgSecondsPerQ = elapsedSeconds / questionsAnswered;
  } else {
    avgSecondsPerQ = AVG_SECONDS_PER_QUESTION[testType] || DEFAULT_SECONDS_PER_QUESTION;
  }

  const estimatedSecondsRemaining = Math.round(questionsRemaining * avgSecondsPerQ);
  const estimatedMinutesRemaining = Math.ceil(estimatedSecondsRemaining / 60);
  const progressPercent = totalQuestions > 0 
    ? Math.round((questionsAnswered / totalQuestions) * 100) 
    : 0;

  // Suggest break after ~15 min continuous answering
  const shouldSuggestBreak = (elapsedSeconds || 0) > 900 && questionsRemaining > 5;

  return {
    questionsAnswered,
    totalQuestions,
    questionsRemaining,
    estimatedSecondsRemaining,
    estimatedMinutesRemaining,
    progressPercent,
    shouldSuggestBreak,
  };
}

/**
 * Estimate total journey time across all tests
 */
export function estimateJourneyTime(
  testConfigs: Array<{ testType: string; totalQuestions: number; completed: boolean }>,
): JourneyTimeEstimate {
  const totalTests = testConfigs.length;
  const testsCompleted = testConfigs.filter(t => t.completed).length;
  
  let totalMinutes = 0;
  let remainingMinutes = 0;

  testConfigs.forEach(config => {
    const avgSec = AVG_SECONDS_PER_QUESTION[config.testType] || DEFAULT_SECONDS_PER_QUESTION;
    const testMinutes = Math.ceil((config.totalQuestions * avgSec) / 60);
    totalMinutes += testMinutes;
    if (!config.completed) {
      remainingMinutes += testMinutes;
    }
  });

  return {
    totalTests,
    testsCompleted,
    testsRemaining: totalTests - testsCompleted,
    totalEstimatedMinutes: totalMinutes,
    remainingEstimatedMinutes: remainingMinutes,
    progressPercent: totalTests > 0 ? Math.round((testsCompleted / totalTests) * 100) : 0,
  };
}

/**
 * Format time estimate for display
 */
export function formatTimeEstimate(minutes: number, language: 'pt' | 'en' = 'pt'): string {
  if (minutes <= 0) return language === 'en' ? 'Less than 1 min' : 'Menos de 1 min';
  if (minutes === 1) return language === 'en' ? '~1 minute' : '~1 minuto';
  if (minutes < 60) return language === 'en' ? `~${minutes} minutes` : `~${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return language === 'en' ? `~${hours}h` : `~${hours}h`;
  return language === 'en' ? `~${hours}h ${mins}min` : `~${hours}h ${mins}min`;
}
