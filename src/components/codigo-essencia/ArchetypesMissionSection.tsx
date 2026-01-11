import { useState } from "react";
import { cn } from "@/lib/utils";
import { Crown, Shield, ChevronDown, AlertTriangle } from "lucide-react";

interface ArchetypesMissionSectionProps {
  primary?: {
    archetype: string;
    role: string;
    contribution: string;
  };
  secondary?: {
    archetype: string;
    role: string;
    contribution: string;
  };
  synergy?: string;
  deviationRisks?: Array<{
    risk: string;
    trigger: string;
    consequence: string;
  }>;
  language?: string;
}

export const ArchetypesMissionSection = ({ 
  primary, 
  secondary, 
  synergy,
  deviationRisks = [],
  language = "pt" 
}: ArchetypesMissionSectionProps) => {
  const [showPrimaryDetails, setShowPrimaryDetails] = useState(false);
  const [showSecondaryDetails, setShowSecondaryDetails] = useState(false);
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  const labels = {
    title: { pt: "Como seus Arquétipos moldam seu Chamado", "pt-pt": "Como os teus Arquétipos moldam o teu Chamado", en: "How your Archetypes shape your Calling" },
    primary: { pt: "Arquétipo Principal", "pt-pt": "Arquétipo Principal", en: "Primary Archetype" },
    secondary: { pt: "Arquétipo Secundário", "pt-pt": "Arquétipo Secundário", en: "Secondary Archetype" },
    role: { pt: "Papel na missão:", "pt-pt": "Papel na missão:", en: "Role in mission:" },
    contribution: { pt: "Contribuição:", "pt-pt": "Contribuição:", en: "Contribution:" },
    synergy: { pt: "Sinergia:", "pt-pt": "Sinergia:", en: "Synergy:" },
    deviationTitle: { pt: "Riscos de Desvio do Chamado", "pt-pt": "Riscos de Desvio do Chamado", en: "Calling Deviation Risks" },
    trigger: { pt: "Gatilho:", "pt-pt": "Gatilho:", en: "Trigger:" },
    consequence: { pt: "Consequência:", "pt-pt": "Consequência:", en: "Consequence:" },
  };

  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";

  const notIdentifiedLabel = {
    pt: "Não identificado",
    "pt-pt": "Não identificado", 
    en: "Not identified"
  };

  // Show section if we have at least primary archetype OR deviation risks
  const hasPrimaryArchetype = primary?.archetype && primary.archetype.trim() !== '';
  const hasSecondaryArchetype = secondary?.archetype && secondary.archetype.trim() !== '';
  const hasDeviationRisks = deviationRisks.length > 0;
  
  if (!hasPrimaryArchetype && !hasSecondaryArchetype && !hasDeviationRisks) return null;

  return (
    <div className="space-y-4">
      {/* Archetypes Mission */}
      {(hasPrimaryArchetype || hasSecondaryArchetype) && (
        <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-xl p-4">
          <h3 className="font-bold text-sm mb-3">{labels.title[lang]}</h3>
          
          <div className="grid md:grid-cols-2 gap-3">
            {/* Primary */}
            {hasPrimaryArchetype && (
              <div 
                className="bg-background/60 rounded-lg p-3 cursor-pointer hover:bg-background/80 transition-colors"
                onClick={() => setShowPrimaryDetails(!showPrimaryDetails)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Crown className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{labels.primary[lang]}</p>
                      <p className="font-bold text-sm">{primary?.archetype}</p>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform",
                    showPrimaryDetails && "rotate-180"
                  )} />
                </div>
                {showPrimaryDetails && (
                  <div className="mt-2 space-y-1">
                    {primary?.role && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.role[lang]}</span> {primary.role}
                      </p>
                    )}
                    {primary?.contribution && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.contribution[lang]}</span> {primary.contribution}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Secondary */}
            {hasSecondaryArchetype && (
              <div 
                className="bg-background/60 rounded-lg p-3 cursor-pointer hover:bg-background/80 transition-colors"
                onClick={() => setShowSecondaryDetails(!showSecondaryDetails)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{labels.secondary[lang]}</p>
                      <p className="font-bold text-sm">{secondary?.archetype}</p>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform",
                    showSecondaryDetails && "rotate-180"
                  )} />
                </div>
                {showSecondaryDetails && (
                  <div className="mt-2 space-y-1">
                    {secondary?.role && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.role[lang]}</span> {secondary.role}
                      </p>
                    )}
                    {secondary?.contribution && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.contribution[lang]}</span> {secondary.contribution}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Synergy */}
          {synergy && (
            <div className="bg-background/40 rounded-lg p-3 mt-3">
              <p className="text-xs">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{labels.synergy[lang]}</span>{" "}
                <span className="text-muted-foreground">{synergy}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Deviation Risks */}
      {deviationRisks.length > 0 && (
        <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-sm">{labels.deviationTitle[lang]}</h3>
          </div>
          <div className="space-y-2">
            {deviationRisks.map((item, i) => {
              const isExpanded = expandedRisk === i;
              return (
                <div 
                  key={i}
                  className="bg-background/60 rounded-lg p-3 cursor-pointer hover:bg-background/80 transition-colors"
                  onClick={() => setExpandedRisk(isExpanded ? null : i)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm">{item.risk}</p>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </div>
                  {isExpanded && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.trigger[lang]}</span> {item.trigger}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.consequence[lang]}</span> {item.consequence}
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
