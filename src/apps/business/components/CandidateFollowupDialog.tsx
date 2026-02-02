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
import { Mail, Loader2, Clock, HelpCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TemplateType = "reminder" | "check_problem" | "last_chance" | "custom";

interface Template {
  id: TemplateType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const TEMPLATES: Template[] = [
  {
    id: "reminder",
    label: "Lembrete gentil",
    description: "Lembre o candidato de que a avaliação está pendente",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "check_problem",
    label: "Verificar problema",
    description: "Pergunte se o candidato está com alguma dificuldade",
    icon: <HelpCircle className="h-4 w-4" />,
  },
  {
    id: "last_chance",
    label: "Última chance",
    description: "Urgência para finalizar antes de expirar",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    id: "custom",
    label: "Mensagem personalizada",
    description: "Escreva sua própria mensagem",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

interface CandidateFollowupDialogProps {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CandidateFollowupDialog({
  candidateId,
  candidateName,
  candidateEmail,
  onSuccess,
  trigger,
}: CandidateFollowupDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("reminder");
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (selectedTemplate === "custom" && (!customSubject.trim() || !customMessage.trim())) {
      toast.error("Preencha o assunto e a mensagem");
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("business-candidate-followup", {
        body: {
          candidate_id: candidateId,
          template_type: selectedTemplate,
          custom_subject: selectedTemplate === "custom" ? customSubject : undefined,
          custom_message: selectedTemplate === "custom" ? customMessage : undefined,
        },
      });

      if (error) throw error;

      toast.success(`Follow-up enviado para ${candidateName}`);
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error sending followup:", error);
      toast.error(error.message || "Erro ao enviar follow-up");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Enviar Follow-up
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Enviar Follow-up
          </DialogTitle>
          <DialogDescription>
            Envie um email para <strong>{candidateName}</strong> ({candidateEmail}) sobre o teste incompleto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>Escolha o tipo de mensagem</Label>
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

          {selectedTemplate === "custom" && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto do email</Label>
                <Input
                  id="subject"
                  placeholder="Ex: Sobre sua avaliação..."
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Escreva sua mensagem personalizada..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  O email incluirá automaticamente o nome do candidato e o link para continuar a avaliação.
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
                <Mail className="h-4 w-4" />
                Enviar Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
