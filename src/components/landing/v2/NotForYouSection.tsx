import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { X, Check } from "lucide-react";

export const NotForYouSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const content = (t.landing as any).not_for_you;

  if (!content) return null;

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div ref={ref} className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            {/* Not For You */}
            <div 
              className={cn(
                "bg-red-50/50 dark:bg-red-950/20 rounded-2xl p-6 md:p-8 border border-red-200/50 dark:border-red-900/30 transition-all duration-700",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
              )}
            >
              <h3 className="font-display text-lg md:text-xl text-red-700 dark:text-red-400 mb-6">
                {content.title_not}
              </h3>
              <div className="space-y-4">
                {content.items_not?.map((item: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-red-800/80 dark:text-red-300/80 text-sm md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* For You */}
            <div 
              className={cn(
                "bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-6 md:p-8 border border-emerald-200/50 dark:border-emerald-900/30 transition-all duration-700 delay-150",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
              )}
            >
              <h3 className="font-display text-lg md:text-xl text-emerald-700 dark:text-emerald-400 mb-6">
                {content.title_for}
              </h3>
              <div className="space-y-4">
                {content.items_for?.map((item: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-emerald-800/80 dark:text-emerald-300/80 text-sm md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
