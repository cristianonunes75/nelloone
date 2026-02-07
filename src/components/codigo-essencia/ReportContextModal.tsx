import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Sparkles } from "lucide-react";

export type ReportType = 'parceiro' | 'pai_para_filho' | 'filho_para_pai' | 'para_gestor' | 'para_equipe';

interface ReportContextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: ReportType;
  language: 'pt' | 'pt-pt' | 'en';
  onSubmit: (context: ReportContext) => void;
  onSkip: () => void;
}

export interface ReportContext {
  user_age?: number;
  other_person_age?: number;
  relationship_stage?: string;
  special_context?: string;
}

interface ContextField {
  id: string;
  label: Record<string, string>;
  type: 'number' | 'radio' | 'switch';
  options?: { value: string; label: Record<string, string> }[];
  placeholder?: Record<string, string>;
}

const CONTEXT_FIELDS: Record<ReportType, ContextField[]> = {
  parceiro: [
    {
      id: 'relationship_stage',
      label: { pt: 'Estágio da relação', 'pt-pt': 'Fase da relação', en: 'Relationship stage' },
      type: 'radio',
      options: [
        { value: 'namoro', label: { pt: 'Namoro', 'pt-pt': 'Namoro', en: 'Dating' } },
        { value: 'noivos', label: { pt: 'Noivos', 'pt-pt': 'Noivos', en: 'Engaged' } },
        { value: 'casados', label: { pt: 'Casados', 'pt-pt': 'Casados', en: 'Married' } },
      ],
    },
    {
      id: 'special_context',
      label: { pt: 'Fase atual', 'pt-pt': 'Fase atual', en: 'Current phase' },
      type: 'radio',
      options: [
        { value: 'bem', label: { pt: 'Estamos bem', 'pt-pt': 'Estamos bem', en: 'We\'re good' } },
        { value: 'ajustes', label: { pt: 'Fazendo ajustes', 'pt-pt': 'A fazer ajustes', en: 'Making adjustments' } },
        { value: 'crise', label: { pt: 'Crise leve', 'pt-pt': 'Crise leve', en: 'Mild crisis' } },
      ],
    },
  ],
  pai_para_filho: [
    {
      id: 'other_person_age',
      label: { pt: 'Idade do(a) filho(a)', 'pt-pt': 'Idade do(a) filho(a)', en: 'Child\'s age' },
      type: 'number',
      placeholder: { pt: 'Ex: 15', 'pt-pt': 'Ex: 15', en: 'E.g.: 15' },
    },
    {
      id: 'special_context',
      label: { pt: 'Mora com você?', 'pt-pt': 'Mora contigo?', en: 'Lives with you?' },
      type: 'radio',
      options: [
        { value: 'mora_junto', label: { pt: 'Sim', 'pt-pt': 'Sim', en: 'Yes' } },
        { value: 'mora_separado', label: { pt: 'Não', 'pt-pt': 'Não', en: 'No' } },
      ],
    },
  ],
  filho_para_pai: [
    {
      id: 'user_age',
      label: { pt: 'Sua idade', 'pt-pt': 'A tua idade', en: 'Your age' },
      type: 'number',
      placeholder: { pt: 'Ex: 35', 'pt-pt': 'Ex: 35', en: 'E.g.: 35' },
    },
    {
      id: 'mother_alive',
      label: { pt: 'Mãe está viva?', 'pt-pt': 'Mãe está viva?', en: 'Mother is alive?' },
      type: 'switch',
    },
    {
      id: 'father_alive',
      label: { pt: 'Pai está vivo?', 'pt-pt': 'Pai está vivo?', en: 'Father is alive?' },
      type: 'switch',
    },
    {
      id: 'other_person_age',
      label: { pt: 'Idade do pai/mãe (principal)', 'pt-pt': 'Idade do pai/mãe (principal)', en: 'Parent\'s age (main)' },
      type: 'number',
      placeholder: { pt: 'Ex: 65', 'pt-pt': 'Ex: 65', en: 'E.g.: 65' },
    },
  ],
  para_gestor: [
    {
      id: 'relationship_stage',
      label: { pt: 'Seu papel', 'pt-pt': 'O teu papel', en: 'Your role' },
      type: 'radio',
      options: [
        { value: 'liderado', label: { pt: 'Sou liderado', 'pt-pt': 'Sou liderado', en: 'I\'m a report' } },
        { value: 'lider', label: { pt: 'Sou líder/gestor', 'pt-pt': 'Sou líder/gestor', en: 'I\'m a leader' } },
      ],
    },
    {
      id: 'special_context',
      label: { pt: 'Tipo de gestor', 'pt-pt': 'Tipo de gestor', en: 'Manager type' },
      type: 'radio',
      options: [
        { value: 'direto', label: { pt: 'Gestor direto', 'pt-pt': 'Gestor direto', en: 'Direct manager' } },
        { value: 'rh', label: { pt: 'RH/People', 'pt-pt': 'RH/People', en: 'HR/People' } },
        { value: 'mentor', label: { pt: 'Mentor', 'pt-pt': 'Mentor', en: 'Mentor' } },
      ],
    },
  ],
  para_equipe: [
    {
      id: 'relationship_stage',
      label: { pt: 'Você lidera a equipe?', 'pt-pt': 'Tu lideras a equipa?', en: 'Do you lead the team?' },
      type: 'radio',
      options: [
        { value: 'lider', label: { pt: 'Sim, sou líder', 'pt-pt': 'Sim, sou líder', en: 'Yes, I\'m the leader' } },
        { value: 'membro', label: { pt: 'Não, sou membro', 'pt-pt': 'Não, sou membro', en: 'No, I\'m a member' } },
      ],
    },
    {
      id: 'special_context',
      label: { pt: 'Tamanho da equipe', 'pt-pt': 'Tamanho da equipa', en: 'Team size' },
      type: 'radio',
      options: [
        { value: 'pequena', label: { pt: 'Pequena (1-5)', 'pt-pt': 'Pequena (1-5)', en: 'Small (1-5)' } },
        { value: 'grande', label: { pt: 'Grande (6+)', 'pt-pt': 'Grande (6+)', en: 'Large (6+)' } },
      ],
    },
  ],
};

const TRANSLATIONS = {
  pt: {
    title: 'Contexto rápido',
    subtitle: '10 segundos para um relatório mais personalizado',
    generate: 'Gerar relatório personalizado',
    skip: 'Pular e gerar padrão',
  },
  'pt-pt': {
    title: 'Contexto rápido',
    subtitle: '10 segundos para um relatório mais personalizado',
    generate: 'Gerar relatório personalizado',
    skip: 'Saltar e gerar padrão',
  },
  en: {
    title: 'Quick context',
    subtitle: '10 seconds for a more personalized report',
    generate: 'Generate personalized report',
    skip: 'Skip and generate default',
  },
};

export const ReportContextModal = ({
  open,
  onOpenChange,
  reportType,
  language,
  onSubmit,
  onSkip,
}: ReportContextModalProps) => {
  const { user } = useAuth();
  const t = TRANSLATIONS[language];
  const fields = CONTEXT_FIELDS[reportType];
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [motherAlive, setMotherAlive] = useState(true);
  const [fatherAlive, setFatherAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing context
  useEffect(() => {
    const loadContext = async () => {
      if (!user?.id || !open) return;
      
      const { data } = await supabase
        .from('report_context')
        .select('*')
        .eq('user_id', user.id)
        .eq('report_type', reportType)
        .maybeSingle();
      
      if (data) {
        setFormData({
          user_age: data.user_age,
          other_person_age: data.other_person_age,
          relationship_stage: data.relationship_stage,
          special_context: data.special_context,
        });
        
        // Parse special context for parent report
        if (reportType === 'filho_para_pai' && data.special_context) {
          const ctx = data.special_context;
          setMotherAlive(!ctx.includes('mãe falecida') && !ctx.includes('mother deceased'));
          setFatherAlive(!ctx.includes('pai falecido') && !ctx.includes('father deceased'));
        }
      }
    };
    
    loadContext();
  }, [user?.id, reportType, open]);

  const handleSubmit = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Build special context for parent report
      let specialContext = formData.special_context || '';
      if (reportType === 'filho_para_pai') {
        const parts = [];
        if (!motherAlive) parts.push(language === 'en' ? 'mother deceased' : 'mãe falecida');
        if (!fatherAlive) parts.push(language === 'en' ? 'father deceased' : 'pai falecido');
        if (formData.special_context) parts.push(formData.special_context);
        specialContext = parts.join('; ');
      }
      
      const contextData: ReportContext = {
        user_age: formData.user_age ? parseInt(formData.user_age) : undefined,
        other_person_age: formData.other_person_age ? parseInt(formData.other_person_age) : undefined,
        relationship_stage: formData.relationship_stage,
        special_context: specialContext || undefined,
      };
      
      // Upsert to database
      await supabase
        .from('report_context')
        .upsert({
          user_id: user.id,
          report_type: reportType,
          ...contextData,
        }, { onConflict: 'user_id,report_type' });
      
      onSubmit(contextData);
    } catch (error) {
      console.error('Error saving context:', error);
      onSubmit(formData as ReportContext);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: ContextField) => {
    const label = field.label[language] || field.label.pt;
    
    // Special handling for parent alive switches
    if (field.id === 'mother_alive') {
      return (
        <div key={field.id} className="flex items-center justify-between">
          <Label htmlFor={field.id}>{label}</Label>
          <Switch
            id={field.id}
            checked={motherAlive}
            onCheckedChange={setMotherAlive}
          />
        </div>
      );
    }
    
    if (field.id === 'father_alive') {
      return (
        <div key={field.id} className="flex items-center justify-between">
          <Label htmlFor={field.id}>{label}</Label>
          <Switch
            id={field.id}
            checked={fatherAlive}
            onCheckedChange={setFatherAlive}
          />
        </div>
      );
    }
    
    if (field.type === 'number') {
      const placeholder = field.placeholder?.[language] || field.placeholder?.pt || '';
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{label}</Label>
          <Input
            id={field.id}
            type="number"
            min="1"
            max="120"
            placeholder={placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
            className="max-w-[120px]"
          />
        </div>
      );
    }
    
    if (field.type === 'radio' && field.options) {
      return (
        <div key={field.id} className="space-y-2">
          <Label>{label}</Label>
          <RadioGroup
            value={formData[field.id] || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}
            className="flex flex-wrap gap-2"
          >
            {field.options.map((option) => (
              <div key={option.value} className="flex items-center">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.id}-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`${field.id}-${option.value}`}
                  className="px-3 py-2 rounded-lg border cursor-pointer transition-colors peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary hover:bg-muted"
                >
                  {option.label[language] || option.label.pt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {fields.map(renderField)}
        </div>
        
        <div className="flex flex-col gap-2">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                ...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t.generate}
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onSkip} disabled={isLoading}>
            {t.skip}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportContextModal;
