import { cn } from "@/lib/utils";
import { Sun, CloudSun, Moon } from "lucide-react";

interface DailyRoutineChecklistProps {
  morning?: string;
  afternoon?: string;
  night?: string;
  source?: string;
  language?: string;
}

export const DailyRoutineChecklist = ({ 
  morning, 
  afternoon, 
  night, 
  source,
  language = "pt" 
}: DailyRoutineChecklistProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  const labels = {
    morning: { pt: "Manhã", "pt-pt": "Manhã", en: "Morning" },
    afternoon: { pt: "Tarde", "pt-pt": "Tarde", en: "Afternoon" },
    night: { pt: "Noite", "pt-pt": "Noite", en: "Night" },
    source: { pt: "Baseado em:", "pt-pt": "Baseado em:", en: "Based on:" },
  };

  const periods = [
    { 
      key: "morning", 
      value: morning, 
      icon: Sun, 
      color: "from-amber-400/20 to-orange-400/20 border-amber-400/40",
      iconColor: "text-amber-500",
      bgIcon: "bg-amber-500/20"
    },
    { 
      key: "afternoon", 
      value: afternoon, 
      icon: CloudSun, 
      color: "from-sky-400/20 to-blue-400/20 border-sky-400/40",
      iconColor: "text-sky-500",
      bgIcon: "bg-sky-500/20"
    },
    { 
      key: "night", 
      value: night, 
      icon: Moon, 
      color: "from-indigo-400/20 to-purple-400/20 border-indigo-400/40",
      iconColor: "text-indigo-500",
      bgIcon: "bg-indigo-500/20"
    },
  ].filter(p => p.value);

  if (periods.length === 0) return null;

  return (
    <div className="space-y-4">
      {source && (
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {labels.source[lang]} {source}
        </p>
      )}
      
      <div className="grid gap-4 md:grid-cols-3">
        {periods.map(({ key, value, icon: Icon, color, iconColor, bgIcon }) => (
          <div 
            key={key}
            className={cn(
              "rounded-xl p-4 bg-gradient-to-br border transition-all hover:scale-[1.02]",
              color
            )}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("p-2 rounded-lg", bgIcon)}>
                <Icon className={cn("w-5 h-5", iconColor)} />
              </div>
              <h4 className="font-bold">
                {labels[key as keyof typeof labels]?.[lang] || key}
              </h4>
            </div>
            <p className="text-sm leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
