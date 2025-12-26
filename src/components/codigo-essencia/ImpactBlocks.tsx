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
    essence: { pt: "Essência em uma frase", "pt-pt": "Essência numa frase", en: "Essence in one phrase" },
    risk: { pt: "Seu maior risco", "pt-pt": "O teu maior risco", en: "Your biggest risk" },
    calling: { pt: "Seu chamado", "pt-pt": "O teu chamado", en: "Your calling" },
    gift: { pt: "Seu maior dom hoje", "pt-pt": "O teu maior dom hoje", en: "Your greatest gift today" },
  };

  const blocks = [
    { key: "essence", icon: Flame, value: essence, color: "from-orange-500/20 to-red-500/20 border-orange-500/50", iconColor: "text-orange-500" },
    { key: "risk", icon: AlertTriangle, value: risk, color: "from-amber-500/20 to-yellow-500/20 border-amber-500/50", iconColor: "text-amber-500" },
    { key: "calling", icon: Compass, value: calling, color: "from-purple-500/20 to-indigo-500/20 border-purple-500/50", iconColor: "text-purple-500" },
    { key: "gift", icon: Diamond, value: gift, color: "from-emerald-500/20 to-green-500/20 border-emerald-500/50", iconColor: "text-emerald-500" },
  ].filter(b => b.value);

  if (blocks.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {blocks.map(({ key, icon: Icon, value, color, iconColor }) => (
        <div 
          key={key}
          className={cn(
            "p-4 rounded-xl bg-gradient-to-br border transition-all hover:scale-[1.02]",
            color
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg bg-background/50", iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                {labels[key as keyof typeof labels]?.[lang] || key}
              </p>
              <p className="font-semibold leading-snug">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
