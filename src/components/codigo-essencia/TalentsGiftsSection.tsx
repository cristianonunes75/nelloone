import { useState } from "react";
import { cn } from "@/lib/utils";
import { Zap, Gift, ChevronDown } from "lucide-react";

interface TalentsGiftsSectionProps {
  talents?: Array<{
    talent: string;
    origin: string;
    application: string;
  }>;
  gifts?: Array<{
    gift: string;
    manifestation: string;
  }>;
  language?: string;
}

export const TalentsGiftsSection = ({ 
  talents = [], 
  gifts = [], 
  language = "pt" 
}: TalentsGiftsSectionProps) => {
  const [expandedTalent, setExpandedTalent] = useState<number | null>(null);
  const [expandedGift, setExpandedGift] = useState<number | null>(null);

  const labels = {
    talents: { pt: "Seus Talentos Naturais", "pt-pt": "Os Teus Talentos Naturais", en: "Your Natural Talents" },
    gifts: { pt: "Seus Dons", "pt-pt": "Os Teus Dons", en: "Your Gifts" },
    origin: { pt: "Origem:", "pt-pt": "Origem:", en: "Origin:" },
    application: { pt: "Aplicação:", "pt-pt": "Aplicação:", en: "Application:" },
    manifests: { pt: "Manifesta-se:", "pt-pt": "Manifesta-se:", en: "Manifests as:" },
  };

  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";

  if (talents.length === 0 && gifts.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Talents */}
      {talents.length > 0 && (
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-sm">{labels.talents[lang]}</h3>
          </div>
          <div className="space-y-2">
            {talents.map((item, i) => {
              const isExpanded = expandedTalent === i;
              return (
                <div 
                  key={i}
                  className="bg-background/60 rounded-lg p-3 cursor-pointer hover:bg-background/80 transition-colors"
                  onClick={() => setExpandedTalent(isExpanded ? null : i)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm">{item.talent}</p>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </div>
                  {isExpanded && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.origin[lang]}</span> {item.origin}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.application[lang]}</span> {item.application}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gifts */}
      {gifts.length > 0 && (
        <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-sm">{labels.gifts[lang]}</h3>
          </div>
          <div className="space-y-2">
            {gifts.map((item, i) => {
              const isExpanded = expandedGift === i;
              return (
                <div 
                  key={i}
                  className="bg-background/60 rounded-lg p-3 cursor-pointer hover:bg-background/80 transition-colors"
                  onClick={() => setExpandedGift(isExpanded ? null : i)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm">{item.gift}</p>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </div>
                  {isExpanded && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.manifests[lang]}</span> {item.manifestation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
