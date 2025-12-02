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
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] gradient-glow opacity-20" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 
            className={cn(
              "font-display text-2xl sm:text-3xl md:text-4xl text-center text-foreground mb-10 md:mb-14 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {improvements.title}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {improvements.items?.map((item: string, index: number) => {
              const IconComponent = icons[index % icons.length];
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center text-center p-5 md:p-6 bg-muted/30 rounded-2xl border border-border/30 transition-all duration-500 hover:shadow-medium hover:-translate-y-1",
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
                  )}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-ink-blue/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5 text-ink-blue" />
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
