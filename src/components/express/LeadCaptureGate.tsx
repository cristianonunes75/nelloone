import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { ExpressPrediction } from "@/lib/codigoExpress";
import { toast } from "sonner";

interface Props {
  prediction: ExpressPrediction;
  answers: Record<string, number>;
  onSaved: () => void;
}

export default function LeadCaptureGate({ prediction, answers, onSaved }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);

  const isValid = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("codigo_inicial_leads" as any).insert({
        full_name: name.trim(),
        email: email.trim().toLowerCase(),
        whatsapp: whatsapp.trim() || null,
        prediction: prediction as any,
        answers: answers as any,
        archetype_name: prediction.archetypeName,
        confidence_score: prediction.overallConfidence,
      } as any);

      if (error) throw error;

      toast.success("Seu Código foi salvo com sucesso!");
      onSaved();
    } catch (e) {
      console.error("Error saving lead:", e);
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="border-primary/20 bg-card shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                Seu Código foi revelado.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Quer guardar essa leitura e continuar sua jornada depois?
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead-name">Nome</Label>
              <Input
                id="lead-name"
                placeholder="Como você se chama?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-whatsapp" className="flex items-center gap-1">
                WhatsApp <span className="text-xs text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="lead-whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!isValid || saving}
            className="w-full h-12 text-base rounded-xl"
            size="lg"
          >
            {saving ? "Salvando..." : "Salvar meu Código"}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Seus dados estão protegidos e não serão compartilhados.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
