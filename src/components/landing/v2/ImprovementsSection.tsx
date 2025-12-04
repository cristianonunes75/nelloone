import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { 
  Heart, Brain, Shield, Compass, MessageCircle, 
  Users, Zap, TrendingUp 
} from "lucide-react";

const icons = [Heart, Brain, Shield, Compass, MessageCircle, Users, Zap, TrendingUp];

export const ImprovementsSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const improvements = (t.landing as any).improvements;

  if (!improvements) return null;

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] gradient-glow opacity-15" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 
            className={cn(
              "font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-foreground mb-14 md:mb-20 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {improvements.title}
          </h2>

          {/* Grid - 2 cols mobile, 4 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {improvements.items?.map((item: string, index: number) => {
              const IconComponent = icons[index % icons.length];
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center text-center p-6 md:p-8 bg-muted/40 rounded-2xl border border-border/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1",
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
                  )}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-ink-blue/10 flex items-center justify-center mb-5">
                    <IconComponent className="w-6 h-6 text-ink-blue" strokeWidth={1.5} />
                  </div>
                  <span className="text-foreground/90 text-sm md:text-base font-medium leading-snug">
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
