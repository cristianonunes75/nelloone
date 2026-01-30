import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ActivationStepProps, LifePhase } from "../types";
import { getTranslations } from "../translations";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LIFE_PHASES: LifePhase[] = [
  "first_career",
  "change_area",
  "align_career_life",
  "decide_without_quitting",
  "couple_decision",
];

export function LifePhaseStep({ 
  activation, 
  onUpdate, 
  onNext, 
  onBack,
  language = "pt" 
}: ActivationStepProps) {
  const t = getTranslations(language);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t.lifePhase.title}</h2>
        <p className="text-muted-foreground">{t.lifePhase.subtitle}</p>
      </div>

      <div className="grid gap-3 max-w-xl mx-auto">
        {LIFE_PHASES.map((phase) => {
          const isSelected = activation.life_phase === phase;
          return (
            <Card
              key={phase}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50",
                isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20"
              )}
              onClick={() => onUpdate({ life_phase: phase })}
            >
              <CardContent className="p-4">
                <p className={cn(
                  "font-medium",
                  isSelected && "text-primary"
                )}>
                  {t.lifePhase.options[phase]}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t.navigation.back}
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!activation.life_phase}
        >
          {t.navigation.next}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
