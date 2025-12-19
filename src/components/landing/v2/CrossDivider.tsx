import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrossDividerProps {
  className?: string;
}

export const CrossDivider = ({ className }: CrossDividerProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-4 py-2", className)}>
      <div className="flex-1 h-px bg-nello-gold/30 max-w-24" />
      <Plus className="w-3 h-3 text-nello-gold/50" strokeWidth={1.5} />
      <div className="flex-1 h-px bg-nello-gold/30 max-w-24" />
    </div>
  );
};
