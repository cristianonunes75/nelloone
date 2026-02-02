import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Save, Target } from "lucide-react";
import { 
  IdealProfile, 
  IDEAL_PROFILE_OPTIONS, 
  IDEAL_PROFILE_SECTIONS,
  CultureValue 
} from "../lib/salesMatchEngine";

interface IdealProfileFormProps {
  initialData?: Partial<IdealProfile> | null;
  onSave: (profile: IdealProfile) => Promise<void>;
  saving?: boolean;
}

const DEFAULT_PROFILE: IdealProfile = {
  business_segment: ['varejo'],
  ticket_size: ['medio'],
  decision_type: ['media'],
  customer_emotional_state: ['indeciso'],
  customer_arrival_mode: ['em_duvida'],
  seller_main_skill: ['argumentar_persuadir'],
  relationship_level: ['medio'],
  operation_rhythm: ['constante'],
  goal_pressure: ['media'],
  has_individual_goals: true,
  culture_values: ['performance'],
  team_preference: ['constancia'],
};

export function IdealProfileForm({ initialData, onSave, saving }: IdealProfileFormProps) {
  const [profile, setProfile] = useState<IdealProfile>({
    ...DEFAULT_PROFILE,
    ...initialData,
  });

  const handleToggle = (field: keyof IdealProfile, value: string) => {
    setProfile(prev => {
      const currentValues = prev[field] as string[];
      if (currentValues.includes(value)) {
        // Remove if already selected (but keep at least one)
        const newValues = currentValues.filter(v => v !== value);
        return { ...prev, [field]: newValues.length > 0 ? newValues : currentValues };
      } else {
        // Add new value
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const handleBooleanChange = (field: keyof IdealProfile, value: boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleCultureValueToggle = (value: CultureValue) => {
    setProfile(prev => {
      const current = prev.culture_values || [];
      if (current.includes(value)) {
        return { ...prev, culture_values: current.filter(v => v !== value) };
      } else if (current.length < 3) {
        return { ...prev, culture_values: [...current, value] };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(profile);
  };

  const renderField = (fieldKey: string) => {
    const options = IDEAL_PROFILE_OPTIONS[fieldKey as keyof typeof IDEAL_PROFILE_OPTIONS];
    
    if (fieldKey === 'has_individual_goals') {
      return (
        <div className="space-y-2">
          <Label>Existe meta individual?</Label>
          <RadioGroup
            value={profile.has_individual_goals ? 'sim' : 'nao'}
            onValueChange={(v) => handleBooleanChange('has_individual_goals', v === 'sim')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="goals-yes" />
              <Label htmlFor="goals-yes" className="cursor-pointer">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="goals-no" />
              <Label htmlFor="goals-no" className="cursor-pointer">Não</Label>
            </div>
          </RadioGroup>
        </div>
      );
    }

    if (fieldKey === 'culture_values') {
      const cultureOptions = IDEAL_PROFILE_OPTIONS.culture_values || [];
      return (
        <div className="space-y-2">
          <Label>A cultura valoriza mais (selecione até 3)</Label>
          <div className="flex flex-wrap gap-2">
            {cultureOptions.map((opt) => {
              const isSelected = profile.culture_values?.includes(opt.value as CultureValue);
              const isDisabled = !isSelected && (profile.culture_values?.length || 0) >= 3;
              
              return (
                <button
                  type="button"
                  key={opt.value}
                  disabled={isDisabled}
                  onClick={() => handleCultureValueToggle(opt.value as CultureValue)}
                  className={`
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-background border-border hover:border-primary/50'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${isSelected ? 'bg-primary-foreground border-primary-foreground' : 'border-muted-foreground'}`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (!options) return null;

    const fieldLabels: Record<string, string> = {
      business_segment: 'Segmento principal do negócio',
      ticket_size: 'Ticket médio aproximado',
      decision_type: 'Tipo de decisão do cliente',
      customer_emotional_state: 'Estado emocional mais comum do cliente',
      customer_arrival_mode: 'O cliente costuma chegar...',
      seller_main_skill: 'O vendedor precisa principalmente...',
      relationship_level: 'Grau de relacionamento esperado',
      operation_rhythm: 'Ritmo da operação',
      goal_pressure: 'Pressão por metas',
      team_preference: 'Preferência de equipe',
    };

    const currentValues = (profile[fieldKey as keyof IdealProfile] as string[]) || [];

    return (
      <div className="space-y-2">
        <Label>{fieldLabels[fieldKey] || fieldKey} <span className="text-xs text-muted-foreground">(pode selecionar múltiplos)</span></Label>
        <div className="grid grid-cols-1 gap-2">
          {options.map((opt: { value: string; label: string; description?: string }) => {
            const isSelected = currentValues.includes(opt.value);
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => handleToggle(fieldKey as keyof IdealProfile, opt.value)}
                className={`
                  flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm border transition-all text-left
                  ${isSelected 
                    ? 'bg-primary/10 border-primary text-foreground' 
                    : 'bg-background border-border hover:border-primary/50'}
                `}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{opt.label}</span>
                  {opt.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Configurar Perfil Ideal</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Configure o contexto do negócio para que o sistema calcule a compatibilidade 
        dos candidatos automaticamente.
      </p>

      {IDEAL_PROFILE_SECTIONS.map((section) => (
        <Card key={section.key}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map((field) => (
              <div key={field}>{renderField(field)}</div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salvar Perfil Ideal
          </>
        )}
      </Button>
    </form>
  );
}
