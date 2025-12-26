import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "dots" | "line" | "gradient" | "wave";
  className?: string;
}

export const SectionDivider = ({ variant = "gradient", className }: SectionDividerProps) => {
  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2 py-8", className)}>
        <span className="w-2 h-2 rounded-full bg-primary/30" />
        <span className="w-2 h-2 rounded-full bg-primary/50" />
        <span className="w-2 h-2 rounded-full bg-primary/30" />
      </div>
    );
  }

  if (variant === "line") {
    return (
      <div className={cn("py-8", className)}>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className={cn("py-8 flex justify-center", className)}>
        <svg width="120" height="12" viewBox="0 0 120 12" className="text-primary/30">
          <path
            d="M0 6C10 6 10 1 20 1C30 1 30 11 40 11C50 11 50 1 60 1C70 1 70 11 80 11C90 11 90 1 100 1C110 1 110 6 120 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }

  // gradient (default)
  return (
    <div className={cn("py-8", className)}>
      <div className="h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full" />
    </div>
  );
};
