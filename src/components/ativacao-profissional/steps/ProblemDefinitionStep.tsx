import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ActivationStepProps } from "../types";
import { getTranslations } from "../translations";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export function ProblemDefinitionStep({ 
  activation, 
  onUpdate, 
  onNext, 
  onBack,
  language = "pt" 
}: ActivationStepProps) {
  const t = getTranslations(language);
  const [rewrittenDecision, setRewrittenDecision] = useState<string>("");

  // Generate rewritten decision when both fields are filled
  useEffect(() => {
    if (activation.main_doubt && activation.stuck_reason) {
      // Simple local rewriting - could be enhanced with AI
      const decision = activation.main_doubt.trim();
      const firstWord = decision.charAt(0).toLowerCase() + decision.slice(1);
      setRewrittenDecision(firstWord.replace(/[.!?]$/, ""));
      onUpdate({ rewritten_decision: rewrittenDecision });
    }
  }, [activation.main_doubt, activation.stuck_reason]);

  const canProceed = activation.main_doubt && activation.stuck_reason;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t.problemDefinition.title}</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="main-doubt" className="text-base font-medium">
            {t.problemDefinition.mainDoubt}
          </Label>
          <Textarea
            id="main-doubt"
            placeholder={t.problemDefinition.mainDoubtPlaceholder}
            value={activation.main_doubt || ""}
            onChange={(e) => onUpdate({ main_doubt: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stuck-reason" className="text-base font-medium">
            {t.problemDefinition.stuckReason}
          </Label>
          <Textarea
            id="stuck-reason"
            placeholder={t.problemDefinition.stuckReasonPlaceholder}
            value={activation.stuck_reason || ""}
            onChange={(e) => onUpdate({ stuck_reason: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        {canProceed && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.problemDefinition.validation}
                  </p>
                  <p className="font-medium mt-1">
                    {rewrittenDecision || activation.main_doubt}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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
