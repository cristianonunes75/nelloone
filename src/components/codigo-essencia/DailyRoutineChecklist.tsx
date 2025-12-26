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
  language = "pt" 
}: DailyRoutineChecklistProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  const labels = {
    morning: { pt: "Manhã", "pt-pt": "Manhã", en: "AM" },
    afternoon: { pt: "Tarde", "pt-pt": "Tarde", en: "PM" },
    night: { pt: "Noite", "pt-pt": "Noite", en: "Night" },
  };

  const periods = [
    { key: "morning", value: morning, icon: Sun, color: "bg-amber-500", bg: "bg-amber-500/10" },
    { key: "afternoon", value: afternoon, icon: CloudSun, color: "bg-sky-500", bg: "bg-sky-500/10" },
    { key: "night", value: night, icon: Moon, color: "bg-indigo-500", bg: "bg-indigo-500/10" },
  ].filter(p => p.value);

  if (periods.length === 0) return null;

  return (
    <div className="grid gap-2 md:grid-cols-3">
      {periods.map(({ key, value, icon: Icon, color, bg }) => (
        <div key={key} className={cn("rounded-lg p-3", bg)}>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-white", color)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs uppercase">
              {labels[key as keyof typeof labels]?.[lang]}
            </span>
          </div>
          <p className="text-xs leading-snug">{value}</p>
        </div>
      ))}
    </div>
  );
};
