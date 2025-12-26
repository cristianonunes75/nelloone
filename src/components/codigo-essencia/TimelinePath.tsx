import { cn } from "@/lib/utils";

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
    practice: { pt: "Faça", "pt-pt": "Faz", en: "Do" },
    check: { pt: "Pergunte-se", "pt-pt": "Pergunta-te", en: "Ask yourself" },
  };

  const monthColors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500"];

  if (!months || months.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {months.map((month, index) => (
        <div 
          key={month.month || index}
          className="flex-1 rounded-xl bg-background/50 border border-border p-4"
        >
          {/* Month badge */}
          <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-white text-xs font-bold mb-3", monthColors[index % monthColors.length])}>
            {labels.month[lang]} {month.month}
          </div>

          {/* Focus */}
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{labels.focus[lang]}</span>
            <p className="font-semibold text-sm leading-snug">{month.focus}</p>
          </div>

          {/* Practice */}
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{labels.practice[lang]}</span>
            <p className="text-xs leading-snug">{month.practice}</p>
          </div>

          {/* Check */}
          {(month.check || month.question) && (
            <div className="p-2 rounded-md bg-muted/50 mt-2">
              <p className="text-xs italic leading-snug">"{month.check || month.question}"</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
