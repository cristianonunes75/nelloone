import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ActivationStepProps } from "../types";
import { getTranslations } from "../translations";
import { ChevronLeft, Loader2 } from "lucide-react";

interface ClosingStepProps extends ActivationStepProps {
  onComplete: () => void;
  isCompleting?: boolean;
}

export function ClosingStep({ 
  activation, 
  onUpdate, 
  onBack,
  onComplete,
  isCompleting,
  language = "pt" 
}: ClosingStepProps) {
  const t = getTranslations(language);

  const canComplete = activation.direction_sentence && activation.chosen_path && activation.saboteur_to_watch;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t.closing.title}</h2>
        <p className="text-muted-foreground">{t.closing.subtitle}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-medium">{t.closing.directionSentence}</Label>
          <Textarea
            placeholder={t.closing.directionPlaceholder}
            value={activation.direction_sentence || ""}
            onChange={(e) => onUpdate({ direction_sentence: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">{t.closing.chosenPath}</Label>
          <RadioGroup
            value={activation.chosen_path || undefined}
            onValueChange={(v) => onUpdate({ chosen_path: v as "A" | "B" | "C" })}
            className="flex gap-4"
          >
            {(["A", "B", "C"] as const).map((p) => (
              <div key={p} className="flex items-center space-x-2">
                <RadioGroupItem value={p} id={`path-${p}`} />
                <Label htmlFor={`path-${p}`}>{language === "en" ? `Path ${p}` : `Caminho ${p}`}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">{t.closing.saboteurToWatch}</Label>
          <Textarea
            placeholder={t.closing.saboteurPlaceholder}
            value={activation.saboteur_to_watch || ""}
            onChange={(e) => onUpdate({ saboteur_to_watch: e.target.value })}
            className="min-h-[60px]"
          />
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm italic text-muted-foreground">"{t.closing.finalInsight}"</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onBack}><ChevronLeft className="w-4 h-4 mr-2" />{t.navigation.back}</Button>
        <Button onClick={onComplete} disabled={!canComplete || isCompleting}>
          {isCompleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {t.closing.complete}
        </Button>
      </div>
    </div>
  );
}
