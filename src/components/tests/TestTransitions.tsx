import { ReactNode } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Direction type for slide animations
type SlideDirection = "left" | "right" | "up" | "down";

// Animation variants for different transition styles
const slideVariants: Record<SlideDirection, Variants> = {
  left: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  right: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  },
  up: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  },
  down: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  },
};

const fadeScaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

const cardFlipVariants: Variants = {
  initial: { rotateY: 90, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  exit: { rotateY: -90, opacity: 0 },
};

interface QuestionTransitionProps {
  children: ReactNode;
  questionKey: string | number;
  direction?: SlideDirection;
  variant?: "slide" | "fade" | "flip";
}

export function QuestionTransition({ 
  children, 
  questionKey, 
  direction = "left",
  variant = "slide" 
}: QuestionTransitionProps) {
  const getVariants = () => {
    switch (variant) {
      case "fade":
        return fadeScaleVariants;
      case "flip":
        return cardFlipVariants;
      case "slide":
      default:
        return slideVariants[direction];
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionKey}
        variants={getVariants()}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
        style={{ perspective: variant === "flip" ? 1000 : undefined }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Animated answer option wrapper
interface AnswerOptionTransitionProps {
  children: ReactNode;
  index: number;
  isSelected?: boolean;
}

export function AnswerOptionTransition({ 
  children, 
  index, 
  isSelected 
}: AnswerOptionTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isSelected ? 1.02 : 1,
      }}
      transition={{
        delay: index * 0.08,
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

// Progress bar animation
interface AnimatedProgressProps {
  value: number;
  className?: string;
}

export function AnimatedProgress({ value, className }: AnimatedProgressProps) {
  return (
    <div className={`h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      />
    </div>
  );
}

// Question number indicator with animation
interface AnimatedQuestionNumberProps {
  current: number;
  total: number;
}

export function AnimatedQuestionNumber({ current, total }: AnimatedQuestionNumberProps) {
  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <motion.span
        key={current}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="font-semibold text-foreground"
      >
        {current}
      </motion.span>
      <span>/</span>
      <span>{total}</span>
    </div>
  );
}

// Staggered list animation for options
interface StaggeredListProps {
  children: ReactNode[];
  staggerDelay?: number;
}

export function StaggeredList({ children, staggerDelay = 0.05 }: StaggeredListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.95 },
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
              }
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Pulse animation for selected answer feedback
export function SelectionPulse({ children, isSelected }: { children: ReactNode; isSelected: boolean }) {
  return (
    <motion.div
      animate={isSelected ? {
        boxShadow: [
          "0 0 0 0 hsl(var(--primary) / 0.4)",
          "0 0 0 8px hsl(var(--primary) / 0)",
        ],
      } : {}}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="rounded-lg"
    >
      {children}
    </motion.div>
  );
}

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}

// Test completion celebration animation
interface TestCompletionTransitionProps {
  children: ReactNode;
  show: boolean;
}

export function TestCompletionTransition({ children, show }: TestCompletionTransitionProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
          }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Confetti-like celebration dots
export function CelebrationDots() {
  const dots = Array.from({ length: 12 });
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((_, i) => {
        const angle = (i / 12) * 360;
        const delay = i * 0.05;
        
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0, 
              scale: 0 
            }}
            animate={{
              x: Math.cos(angle * Math.PI / 180) * 100,
              y: Math.sin(angle * Math.PI / 180) * 100,
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: 1,
              delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

// Smooth step transition for multi-step tests
interface StepTransitionProps {
  children: ReactNode;
  stepKey: string | number;
}

export function StepTransition({ children, stepKey }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
