import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { 
  ClipboardList, Map, Brain, Target, TrendingUp 
} from "lucide-react";

const itemIcons = [ClipboardList, Map, Brain, Target, TrendingUp];

export const WhatYouGetSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const content = (t.landing as any).what_you_get;

  if (!content) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      <div ref={ref} className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 
              className={cn(
                "font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-4 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {content.title}
            </h2>
            <p 
              className={cn(
                "text-muted-foreground text-lg transition-all duration-700 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {content.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {content.items?.map((item: string, index: number) => {
              const IconComponent = itemIcons[index % itemIcons.length];
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center text-center p-5 md:p-6 bg-background rounded-2xl border border-border/30 shadow-sm transition-all duration-500 hover:shadow-medium hover:-translate-y-1",
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
                  )}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ink-blue/20 to-ink-blue/5 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-ink-blue" />
                  </div>
                  <span className="text-foreground font-medium text-sm md:text-base">
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
