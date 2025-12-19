import { cn } from "@/lib/utils";

interface ScriptureCardProps {
  verse: string;
  reference: string;
  className?: string;
  variant?: "default" | "hero" | "dark";
}

export const ScriptureCard = ({ 
  verse, 
  reference, 
  className,
  variant = "default" 
}: ScriptureCardProps) => {
  if (variant === "hero") {
    return (
      <div className={cn("max-w-xl mx-auto", className)}>
        <div className="px-6 py-5 bg-background/60 backdrop-blur-sm rounded-2xl border border-nello-gold/20">
          <p className="font-scripture text-base sm:text-lg text-foreground/90 leading-relaxed text-center">
            "{verse}"
          </p>
          <p className="text-xs text-nello-gold font-medium tracking-widest uppercase mt-3 text-center">
            {reference}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "dark") {
    return (
      <div className={cn("max-w-xl mx-auto", className)}>
        <div className="px-6 py-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-nello-gold/20">
          <p className="font-scripture text-base sm:text-lg text-white/90 leading-relaxed text-center">
            "{verse}"
          </p>
          <p className="text-xs text-nello-gold font-medium tracking-widest uppercase mt-3 text-center">
            {reference}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-xl mx-auto", className)}>
      <div className="px-6 py-5 bg-nello-gold/5 rounded-2xl border border-nello-gold/20">
        <p className="font-scripture text-base sm:text-lg text-foreground/85 leading-relaxed text-center">
          "{verse}"
        </p>
        <p className="text-xs text-nello-gold font-medium tracking-widest uppercase mt-3 text-center">
          {reference}
        </p>
      </div>
    </div>
  );
};
