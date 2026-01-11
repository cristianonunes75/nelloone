import { cn } from "@/lib/utils";
import { Flame, AlertTriangle, Compass, Diamond } from "lucide-react";

interface ImpactBlocksProps {
  essence?: string;
  risk?: string;
  calling?: string;
  gift?: string;
  language?: string;
}

export const ImpactBlocks = ({ essence, risk, calling, gift, language = "pt" }: ImpactBlocksProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  const labels = {
    essence: { pt: "Você é", "pt-pt": "Tu és", en: "You are" },
    risk: { pt: "Seu risco", "pt-pt": "O teu risco", en: "Your risk" },
    calling: { pt: "Seu chamado", "pt-pt": "O teu chamado", en: "Your calling" },
    gift: { pt: "Seu dom", "pt-pt": "O teu dom", en: "Your gift" },
  };

  const blocks = [
    { key: "essence", icon: Flame, value: essence, bg: "bg-orange-500/10", iconBg: "bg-orange-500", iconColor: "text-white" },
    { key: "gift", icon: Diamond, value: gift, bg: "bg-emerald-500/10", iconBg: "bg-emerald-500", iconColor: "text-white" },
    { key: "calling", icon: Compass, value: calling, bg: "bg-purple-500/10", iconBg: "bg-purple-500", iconColor: "text-white" },
    { key: "risk", icon: AlertTriangle, value: risk, bg: "bg-rose-500/10", iconBg: "bg-rose-500", iconColor: "text-white" },
  ].filter(b => b.value);

  if (blocks.length === 0) return null;

  return (
    <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
      {blocks.map(({ key, icon: Icon, value, bg, iconBg, iconColor }) => (
        <div 
          key={key} 
          className={cn("p-3 rounded-xl", bg)}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", iconBg)}>
              <Icon className={cn("w-3.5 h-3.5", iconColor)} />
            </div>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              {labels[key as keyof typeof labels]?.[lang]}
            </span>
          </div>
          <p className="text-xs font-semibold leading-snug">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
};
