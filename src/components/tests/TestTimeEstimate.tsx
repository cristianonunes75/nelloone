import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TestTimeEstimateProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  testStartTime?: Date;
  className?: string;
}

export const TestTimeEstimate = ({
  currentQuestionIndex,
  totalQuestions,
  testStartTime,
  className = "",
}: TestTimeEstimateProps) => {
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(null);
  const [avgSecondsPerQuestion, setAvgSecondsPerQuestion] = useState<number>(30); // Default 30s per question
  const questionTimestamps = useRef<Date[]>([]);
  const startTime = useRef<Date>(testStartTime || new Date());

  useEffect(() => {
    // Record timestamp when question changes
    if (currentQuestionIndex > 0) {
      questionTimestamps.current[currentQuestionIndex] = new Date();
      
      // Calculate average time per question based on actual progress
      if (questionTimestamps.current.length > 1) {
        const totalElapsed = new Date().getTime() - startTime.current.getTime();
        const avgMs = totalElapsed / currentQuestionIndex;
        setAvgSecondsPerQuestion(avgMs / 1000);
      }
    } else {
      // First question - reset
      startTime.current = new Date();
      questionTimestamps.current = [new Date()];
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    // Calculate remaining time
    const remainingQuestions = totalQuestions - currentQuestionIndex - 1;
    if (remainingQuestions <= 0) {
      setEstimatedMinutes(0);
      return;
    }

    const remainingSeconds = remainingQuestions * avgSecondsPerQuestion;
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    setEstimatedMinutes(remainingMinutes);
  }, [currentQuestionIndex, totalQuestions, avgSecondsPerQuestion]);

  // Don't show if test just started or almost finished
  if (currentQuestionIndex === 0 || estimatedMinutes === null) {
    return null;
  }

  // Format display
  const getTimeDisplay = () => {
    if (estimatedMinutes === 0) {
      return "Quase lá!";
    }
    if (estimatedMinutes === 1) {
      return "~1 min restante";
    }
    if (estimatedMinutes < 60) {
      return `~${estimatedMinutes} min restantes`;
    }
    const hours = Math.floor(estimatedMinutes / 60);
    const mins = estimatedMinutes % 60;
    return `~${hours}h ${mins}min`;
  };

  // Color based on progress
  const getColorClass = () => {
    const progress = (currentQuestionIndex + 1) / totalQuestions;
    if (progress >= 0.8) return "text-green-600 bg-green-50";
    if (progress >= 0.5) return "text-blue-600 bg-blue-50";
    return "text-muted-foreground bg-muted/50";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={estimatedMinutes}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getColorClass()} ${className}`}
      >
        <Clock className="h-3.5 w-3.5" />
        <span>{getTimeDisplay()}</span>
      </motion.div>
    </AnimatePresence>
  );
};
