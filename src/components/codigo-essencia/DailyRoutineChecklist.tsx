import { cn } from "@/lib/utils";
import { Sun, CloudSun, Moon } from "lucide-react";

interface RoutineItem {
  practice?: string;
  ritual_name?: string;
}

interface DailyRoutineChecklistProps {
  morning?: string | RoutineItem;
  afternoon?: string | RoutineItem;
  night?: string | RoutineItem;
  source?: string;
  language?: string;
}

const extractPractice = (value: string | RoutineItem | undefined): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.practice || value.ritual_name;
};

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
    { key: "morning", raw: morning, icon: Sun, color: "bg-amber-500", bg: "bg-amber-500/10" },
    { key: "afternoon", raw: afternoon, icon: CloudSun, color: "bg-sky-500", bg: "bg-sky-500/10" },
    { key: "night", raw: night, icon: Moon, color: "bg-indigo-500", bg: "bg-indigo-500/10" },
  ].map(p => ({ ...p, value: extractPractice(p.raw), ritualName: typeof p.raw === 'object' ? p.raw?.ritual_name : undefined }))
   .filter(p => p.value);

  if (periods.length === 0) return null;

  return (
    <div className="grid gap-2 md:grid-cols-3">
      {periods.map(({ key, value, ritualName, icon: Icon, color, bg }) => (
        <div key={key} className={cn("rounded-lg p-3", bg)}>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-white", color)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs uppercase">
              {labels[key as keyof typeof labels]?.[lang]}
            </span>
          </div>
          {ritualName && <p className="text-[10px] font-medium text-muted-foreground mb-1 italic">"{ritualName}"</p>}
          <p className="text-xs leading-snug">{value}</p>
        </div>
      ))}
    </div>
  );
};
