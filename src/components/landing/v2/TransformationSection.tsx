import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Eye, Lightbulb, Rocket } from "lucide-react";

const stepIcons = [Eye, Lightbulb, Rocket];

export const TransformationSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const transformation = (t.landing as any).transformation;

  if (!transformation) return null;

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 gradient-nello opacity-50" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <h2 
          className={cn(
            "font-display text-2xl sm:text-3xl md:text-4xl text-center text-foreground mb-12 md:mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {transformation.title}
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {transformation.steps?.map((step: any, index: number) => {
              const IconComponent = stepIcons[index];
              return (
                <div
                  key={index}
                  className={cn(
                    "relative transition-all duration-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                  )}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Connector line */}
                  {index < transformation.steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-ink-blue/30 to-ink-blue/10" />
                  )}

                  <div className="flex flex-col items-center text-center">
                    {/* Step Number */}
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-2xl bg-ink-blue/10 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-ink-blue" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-ink-blue flex items-center justify-center text-white font-bold text-sm">
                        {step.number}
                      </div>
                    </div>

                    <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
