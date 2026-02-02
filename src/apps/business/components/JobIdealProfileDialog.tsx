import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Settings2, Target, CheckCircle2 } from "lucide-react";
import { IdealProfileForm } from "./IdealProfileForm";
import { IdealProfile, IDEAL_PROFILE_OPTIONS } from "../lib/salesMatchEngine";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JobIdealProfileDialogProps {
  jobId: string;
  currentProfile: IdealProfile | null;
  onProfileSaved: () => void;
}

export function JobIdealProfileDialog({ jobId, currentProfile, onProfileSaved }: JobIdealProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (profile: IdealProfile) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("job_postings")
        .update({ ideal_profile: profile as any })
        .eq("id", jobId);

      if (error) throw error;

      toast.success("Perfil ideal salvo com sucesso!");
      setOpen(false);
      onProfileSaved();
    } catch (error) {
      console.error("Error saving ideal profile:", error);
      toast.error("Erro ao salvar perfil ideal");
    } finally {
      setSaving(false);
    }
  };

  const getProfileSummary = () => {
    if (!currentProfile) return null;
    
    const segmentLabels = currentProfile.business_segment
      .map(s => IDEAL_PROFILE_OPTIONS.business_segment.find(o => o.value === s)?.label)
      .filter(Boolean)
      .slice(0, 2);
    const skillLabels = currentProfile.seller_main_skill
      .map(s => IDEAL_PROFILE_OPTIONS.seller_main_skill.find(o => o.value === s)?.label)
      .filter(Boolean)
      .slice(0, 2);
    
    return { 
      segment: segmentLabels.join(', ') || 'Não definido', 
      skill: skillLabels.join(', ') || 'Não definido' 
    };
  };

  const summary = getProfileSummary();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          {currentProfile ? "Editar Perfil Ideal" : "Configurar Perfil Ideal"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Perfil Ideal para Match
          </DialogTitle>
          <DialogDescription>
            Configure o contexto do negócio e o perfil ideal do vendedor. 
            O sistema usará essas informações para calcular automaticamente a 
            compatibilidade de cada candidato.
          </DialogDescription>
        </DialogHeader>

        {currentProfile && summary && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              Perfil configurado: <strong>{summary.segment}</strong> | {summary.skill}
            </span>
          </div>
        )}

        <IdealProfileForm 
          initialData={currentProfile}
          onSave={handleSave}
          saving={saving}
        />
      </DialogContent>
    </Dialog>
  );
}
