import { cn } from "@/lib/utils";
import { Target, Dumbbell, HelpCircle, CheckCircle2 } from "lucide-react";

interface MonthData {
  month: number;
  focus: string;
  practice: string;
  check?: string;
  question?: string;
}

interface TimelinePathProps {
  months: MonthData[];
  language?: string;
}

export const TimelinePath = ({ months, language = "pt" }: TimelinePathProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  const labels = {
    month: { pt: "Mês", "pt-pt": "Mês", en: "Month" },
    focus: { pt: "Foco", "pt-pt": "Foco", en: "Focus" },
    practice: { pt: "Prática", "pt-pt": "Prática", en: "Practice" },
    check: { pt: "Verificar", "pt-pt": "Verificar", en: "Check" },
  };

  const monthColors = [
    { bg: "bg-blue-500", light: "bg-blue-500/10", border: "border-blue-500/30" },
    { bg: "bg-purple-500", light: "bg-purple-500/10", border: "border-purple-500/30" },
    { bg: "bg-emerald-500", light: "bg-emerald-500/10", border: "border-emerald-500/30" },
  ];

  if (!months || months.length === 0) return null;

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 hidden md:block" />
      
      <div className="space-y-4 md:space-y-6">
        {months.map((month, index) => {
          const color = monthColors[index % monthColors.length];
          
          return (
            <div 
              key={month.month || index}
              className={cn(
                "relative rounded-xl border p-4 md:p-5 md:ml-12",
                color.light,
                color.border
              )}
            >
              {/* Timeline dot - desktop */}
              <div className={cn(
                "absolute -left-[3.25rem] top-5 w-4 h-4 rounded-full hidden md:flex items-center justify-center",
                color.bg
              )}>
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Month header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold", color.bg)}>
                  {month.month}
                </div>
                <h4 className="font-bold text-lg">
                  {labels.month[lang]} {month.month}
                </h4>
              </div>

              {/* Content grid */}
              <div className="grid gap-3 md:grid-cols-3">
                {/* Focus */}
                <div className="p-3 rounded-lg bg-background/60">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                    <Target className="w-3.5 h-3.5" />
                    {labels.focus[lang]}
                  </div>
                  <p className="font-medium">{month.focus}</p>
                </div>

                {/* Practice */}
                <div className="p-3 rounded-lg bg-background/60">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                    <Dumbbell className="w-3.5 h-3.5" />
                    {labels.practice[lang]}
                  </div>
                  <p>{month.practice}</p>
                </div>

                {/* Check */}
                <div className="p-3 rounded-lg bg-background/60">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    {labels.check[lang]}
                  </div>
                  <p className="italic text-sm">{month.check || month.question}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
