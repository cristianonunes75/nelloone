import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CalendarDays, Loader2, MessageSquare, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TemplateType = "standard" | "custom";

interface Template {
  id: TemplateType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const TEMPLATES: Template[] = [
  {
    id: "standard",
    label: "Convite padrão",
    description: "Mensagem padrão convidando para entrevista presencial ou online",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    id: "custom",
    label: "Mensagem personalizada",
    description: "Escreva sua própria mensagem de convite",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

interface CandidateInterviewInviteDialogProps {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  positionApplied?: string | null;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CandidateInterviewInviteDialog({
  candidateId,
  candidateName,
  candidateEmail,
  positionApplied,
  onSuccess,
  trigger,
}: CandidateInterviewInviteDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("standard");
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (selectedTemplate === "custom" && (!customSubject.trim() || !customMessage.trim())) {
      toast.error("Preencha o assunto e a mensagem");
      return;
    }

    if (!interviewDate || !interviewTime) {
      toast.error("Informe a data e horário da entrevista");
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("business-interview-invite", {
        body: {
          candidate_id: candidateId,
          template_type: selectedTemplate,
          interview_date: interviewDate,
          interview_time: interviewTime,
          interview_location: interviewLocation || undefined,
          custom_subject: selectedTemplate === "custom" ? customSubject : undefined,
          custom_message: selectedTemplate === "custom" ? customMessage : undefined,
        },
      });

      if (error) throw error;

      toast.success(`Convite enviado para ${candidateName}`);
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error sending interview invite:", error);
      toast.error(error.message || "Erro ao enviar convite");
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setSelectedTemplate("standard");
    setCustomSubject("");
    setCustomMessage("");
    setInterviewDate("");
    setInterviewTime("");
    setInterviewLocation("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" size="sm" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Convidar para Entrevista
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Convidar para Entrevista
          </DialogTitle>
          <DialogDescription>
            Envie um convite de entrevista para <strong>{candidateName}</strong> ({candidateEmail})
            {positionApplied && <> para a vaga de <strong>{positionApplied}</strong></>}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Interview Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="interview-date">Data da Entrevista *</Label>
              <Input
                id="interview-date"
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interview-time">Horário *</Label>
              <Input
                id="interview-time"
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="interview-location">Local / Link da Reunião</Label>
            <Input
              id="interview-location"
              placeholder="Ex: Sala de Reuniões 2 ou https://meet.google.com/..."
              value={interviewLocation}
              onChange={(e) => setInterviewLocation(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Informe o endereço físico ou link para reunião online
            </p>
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Tipo de Mensagem</Label>
            <RadioGroup
              value={selectedTemplate}
              onValueChange={(value) => setSelectedTemplate(value as TemplateType)}
              className="space-y-2"
            >
              {TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={template.id}
                      className="flex items-center gap-2 cursor-pointer font-medium"
                    >
                      {template.icon}
                      {template.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Custom Message Fields */}
          {selectedTemplate === "custom" && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto do email *</Label>
                <Input
                  id="subject"
                  placeholder="Ex: Convite para entrevista - Vaga de..."
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  placeholder="Escreva sua mensagem personalizada..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  O email incluirá automaticamente as informações de data, horário e local.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSending}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isSending} className="gap-2">
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <CalendarDays className="h-4 w-4" />
                Enviar Convite
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
