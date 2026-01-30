import { motion } from "framer-motion";
import { TestimonialForm } from "@/components/cliente/TestimonialForm";

interface DashboardTestimonialSectionProps {
  className?: string;
}

export function DashboardTestimonialSection({ className }: DashboardTestimonialSectionProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className={className}
    >
      <TestimonialForm testName="NELLO ONE" />
    </motion.div>
  );
}
