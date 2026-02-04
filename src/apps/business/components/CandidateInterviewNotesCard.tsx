import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save, Loader2, Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CandidateInterviewNotesCardProps {
  candidateId: string;
  initialNotes: string | null;
  onUpdate?: () => void;
}

export function CandidateInterviewNotesCard({
  candidateId,
  initialNotes,
  onUpdate,
}: CandidateInterviewNotesCardProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [originalNotes, setOriginalNotes] = useState(initialNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNotes(initialNotes || "");
    setOriginalNotes(initialNotes || "");
  }, [initialNotes]);

  const hasChanges = notes !== originalNotes;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("hiring_candidates")
        .update({ interview_notes: notes || null })
        .eq("id", candidateId);

      if (error) throw error;

      setOriginalNotes(notes);
      setIsEditing(false);
      toast.success("Anotações salvas com sucesso");
      onUpdate?.();
    } catch (error: any) {
      console.error("Error saving notes:", error);
      toast.error("Erro ao salvar anotações");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNotes(originalNotes);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Anotações da Entrevista
          </CardTitle>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Registre suas percepções, pontos observados na entrevista, fit cultural, impressões gerais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="min-h-[100px]">
            {notes ? (
              <p className="text-sm whitespace-pre-wrap text-foreground">{notes}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nenhuma anotação registrada. Clique em "Editar" para adicionar suas percepções da entrevista.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
