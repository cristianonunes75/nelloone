import { useState } from "react";
import { Briefcase, Heart, Activity, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LifeArea {
  area: string;
  natural_strength: string;
  main_risk: string;
  practical_direction: string;
}

interface LifeAreasSectionProps {
  areas?: LifeArea[];
  language?: string;
}

const AREA_ICONS: Record<string, React.ReactNode> = {
  career: <Briefcase className="w-4 h-4" />,
  carreira: <Briefcase className="w-4 h-4" />,
  relationships: <Heart className="w-4 h-4" />,
  relacionamentos: <Heart className="w-4 h-4" />,
  health: <Activity className="w-4 h-4" />,
  saude: <Activity className="w-4 h-4" />,
  saúde: <Activity className="w-4 h-4" />,
  spirituality: <Sparkles className="w-4 h-4" />,
  espiritualidade: <Sparkles className="w-4 h-4" />,
};

const AREA_COLORS: Record<string, string> = {
  career: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  carreira: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  relationships: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  relacionamentos: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  health: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  saude: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  saúde: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  spirituality: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
  espiritualidade: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
};

export const LifeAreasSection = ({ areas, language = 'pt' }: LifeAreasSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!areas || areas.length === 0) return null;

  const labels = {
    pt: { 
      title: 'Leitura por Áreas da Vida',
      strength: 'Força Natural',
      risk: 'Risco Principal',
      direction: 'Direção Prática'
    },
    'pt-pt': { 
      title: 'Leitura por Áreas da Vida',
      strength: 'Força Natural',
      risk: 'Risco Principal',
      direction: 'Direção Prática'
    },
    en: { 
      title: 'Life Areas Reading',
      strength: 'Natural Strength',
      risk: 'Main Risk',
      direction: 'Practical Direction'
    },
  };

  const t = labels[language as keyof typeof labels] || labels.pt;

  const getAreaKey = (areaName: string) => {
    const lower = areaName.toLowerCase();
    if (lower.includes('carreira') || lower.includes('dinheiro') || lower.includes('career') || lower.includes('money')) return 'carreira';
    if (lower.includes('relacionamento') || lower.includes('amor') || lower.includes('relationship') || lower.includes('love')) return 'relacionamentos';
    if (lower.includes('saúde') || lower.includes('saude') || lower.includes('energia') || lower.includes('health') || lower.includes('energy')) return 'saude';
    if (lower.includes('espiritual') || lower.includes('sentido') || lower.includes('spiritual') || lower.includes('meaning')) return 'espiritualidade';
    return 'carreira';
  };

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 via-rose-500 to-purple-500" />
        {t.title}
      </h3>

      <div className="grid sm:grid-cols-2 gap-3">
        {areas.map((area, i) => {
          const areaKey = getAreaKey(area.area);
          const icon = AREA_ICONS[areaKey] || <Sparkles className="w-4 h-4" />;
          const colorClass = AREA_COLORS[areaKey] || "from-gray-500/20 to-gray-500/20 border-gray-500/30";
          const isExpanded = expandedIndex === i;

          return (
            <div 
              key={i}
              className={cn(
                "bg-gradient-to-br rounded-xl border p-3 cursor-pointer transition-all",
                colorClass,
                isExpanded && "ring-1 ring-primary/30"
              )}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-background/50 flex items-center justify-center">
                    {icon}
                  </div>
                  <span className="font-semibold text-sm">{area.area}</span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ {t.strength}</span>
                  <p className="text-xs text-muted-foreground">{area.natural_strength}</p>
                </div>

                {isExpanded && (
                  <>
                    <div>
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">⚠ {t.risk}</span>
                      <p className="text-xs text-muted-foreground">{area.main_risk}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2">
                      <span className="text-xs font-medium text-primary">→ {t.direction}</span>
                      <p className="text-xs text-foreground mt-0.5">{area.practical_direction}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
