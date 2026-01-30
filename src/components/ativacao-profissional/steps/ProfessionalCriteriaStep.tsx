import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ActivationStepProps, WorkNeed, WorkIntolerance, ChangeHorizon } from "../types";
import { getTranslations } from "../translations";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const WORK_NEEDS: WorkNeed[] = [
  "autonomy", "impact", "stability", "creation", 
  "recognition", "service", "challenge"
];

const WORK_INTOLERANCES: WorkIntolerance[] = [
  "rigid_routine", "toxic_environment", "meaningless_pressure",
  "lack_of_freedom", "excessive_exposure", "loneliness", "constant_conflict"
];

export function ProfessionalCriteriaStep({ 
  activation, 
  onUpdate, 
  onNext, 
  onBack,
  language = "pt" 
}: ActivationStepProps) {
  const t = getTranslations(language);
  
  const selectedNeeds = activation.needs_at_work || [];
  const selectedIntolerances = activation.cannot_tolerate || [];

  const toggleNeed = (need: WorkNeed) => {
    const current = [...selectedNeeds];
    const index = current.indexOf(need);
    
    if (index >= 0) {
      current.splice(index, 1);
    } else if (current.length < 3) {
      current.push(need);
    }
    
    onUpdate({ needs_at_work: current });
  };

  const toggleIntolerance = (intolerance: WorkIntolerance) => {
    const current = [...selectedIntolerances];
    const index = current.indexOf(intolerance);
    
    if (index >= 0) {
      current.splice(index, 1);
    } else if (current.length < 2) {
      current.push(intolerance);
    }
    
    onUpdate({ cannot_tolerate: current });
  };

  const canProceed = 
    selectedNeeds.length === 3 && 
    selectedIntolerances.length === 2 &&
    activation.hours_per_week !== undefined &&
    activation.needs_income_short_term !== undefined &&
    activation.change_horizon;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t.professionalCriteria.title}</h2>
      </div>

      {/* Work Needs */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">{t.professionalCriteria.needs.title}</h3>
          <p className="text-sm text-muted-foreground">{t.professionalCriteria.needs.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {WORK_NEEDS.map((need) => {
            const isSelected = selectedNeeds.includes(need);
            const isDisabled = !isSelected && selectedNeeds.length >= 3;
            return (
              <button
                key={need}
                onClick={() => toggleNeed(need)}
                disabled={isDisabled}
                className={cn(
                  "px-4 py-2 rounded-full border transition-all flex items-center gap-2",
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background hover:border-primary/50",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSelected && <Check className="w-4 h-4" />}
                {t.professionalCriteria.needs.options[need]}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {selectedNeeds.length}/3 {language === "en" ? "selected" : "selecionados"}
        </p>
      </div>

      {/* Work Intolerances */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">{t.professionalCriteria.intolerances.title}</h3>
          <p className="text-sm text-muted-foreground">{t.professionalCriteria.intolerances.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {WORK_INTOLERANCES.map((intolerance) => {
            const isSelected = selectedIntolerances.includes(intolerance);
            const isDisabled = !isSelected && selectedIntolerances.length >= 2;
            return (
              <button
                key={intolerance}
                onClick={() => toggleIntolerance(intolerance)}
                disabled={isDisabled}
                className={cn(
                  "px-4 py-2 rounded-full border transition-all flex items-center gap-2",
                  isSelected 
                    ? "bg-destructive text-destructive-foreground border-destructive" 
                    : "bg-background hover:border-destructive/50",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSelected && <Check className="w-4 h-4" />}
                {t.professionalCriteria.intolerances.options[intolerance]}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {selectedIntolerances.length}/2 {language === "en" ? "selected" : "selecionados"}
        </p>
      </div>

      {/* Real Conditions */}
      <Card>
        <CardContent className="p-5 space-y-5">
          <h3 className="font-semibold">{t.professionalCriteria.conditions.title}</h3>
          
          <div className="space-y-2">
            <Label htmlFor="hours">{t.professionalCriteria.conditions.hoursPerWeek}</Label>
            <Input
              id="hours"
              type="number"
              min={0}
              max={60}
              value={activation.hours_per_week ?? ""}
              onChange={(e) => onUpdate({ hours_per_week: parseInt(e.target.value) || 0 })}
              className="max-w-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label>{t.professionalCriteria.conditions.needsIncome}</Label>
            <RadioGroup
              value={activation.needs_income_short_term === true ? "yes" : activation.needs_income_short_term === false ? "no" : undefined}
              onValueChange={(value) => onUpdate({ needs_income_short_term: value === "yes" })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="income-yes" />
                <Label htmlFor="income-yes">{t.professionalCriteria.conditions.yes}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="income-no" />
                <Label htmlFor="income-no">{t.professionalCriteria.conditions.no}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>{t.professionalCriteria.conditions.changeHorizon}</Label>
            <RadioGroup
              value={activation.change_horizon ?? undefined}
              onValueChange={(value) => onUpdate({ change_horizon: value as ChangeHorizon })}
              className="flex gap-4"
            >
              {(["30", "90", "180"] as ChangeHorizon[]).map((days) => (
                <div key={days} className="flex items-center space-x-2">
                  <RadioGroupItem value={days} id={`horizon-${days}`} />
                  <Label htmlFor={`horizon-${days}`}>
                    {t.professionalCriteria.conditions[`days${days}` as keyof typeof t.professionalCriteria.conditions]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t.navigation.back}
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
        >
          {t.navigation.next}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
