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
import { pixel } from "@/lib/metaPixel";

interface Props {
  prediction: ExpressPrediction;
  answers: Record<string, number>;
  refCode?: string | null;
  onSaved: (leadId: string, name: string, email?: string) => void;
  defaultName?: string;
  defaultEmail?: string;
}

export default function LeadCaptureGate({ prediction, answers, refCode, onSaved, defaultName = "", defaultEmail = "" }: Props) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);

  const isValid = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);

    try {
      const { data, error } = await supabase.from("codigo_inicial_leads" as any).insert({
        full_name: name.trim(),
        email: email.trim().toLowerCase(),
        whatsapp: whatsapp.trim() || null,
        prediction: prediction as any,
        answers: answers as any,
        archetype_name: prediction.archetypeName,
        confidence_score: prediction.overallConfidence,
      } as any).select('id').single();

      if (error) throw error;

      // If this person came via a ref code, track the connection
      if (refCode) {
        try {
          // Increment completions on the invite
          const { data: invite } = await supabase
            .from("social_invites" as any)
            .select("id, completions")
            .eq("invite_code", refCode)
            .single();

          if (invite) {
            await supabase.from("social_invite_connections" as any).insert({
              invite_id: (invite as any).id,
              invited_lead_id: (data as any)?.id || null,
              invited_name: name.trim(),
            } as any);

            await supabase.from("social_invites" as any)
              .update({ completions: ((invite as any).completions || 0) + 1 } as any)
              .eq("id", (invite as any).id);
          }
        } catch (refErr) {
          console.error("Error tracking referral:", refErr);
        }
      }

      // Send confirmation email (fire and forget)
      supabase.functions.invoke("send-lead-email", {
        body: {
          email: email.trim().toLowerCase(),
          name: name.trim(),
          archetypeName: prediction.archetypeName,
          leadId: (data as any)?.id,
        },
      }).catch(e => console.error("Error sending lead email:", e));

      pixel.lead();
      toast.success("Sua Leitura foi salva com sucesso!");
      onSaved((data as any)?.id || '', name.trim(), email.trim().toLowerCase());
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
              <h3 className="text-xl font-bold text-foreground">Antes de pagar, precisamos do seu contato.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Seus dados garantem o acesso à leitura completa após o pagamento.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead-name">Nome</Label>
              <Input id="lead-name" placeholder="Como você se chama?" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input id="lead-email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-whatsapp" className="flex items-center gap-1">
                WhatsApp <span className="text-xs text-muted-foreground">(opcional)</span>
              </Label>
              <Input id="lead-whatsapp" type="tel" placeholder="(00) 00000-0000" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleSave} disabled={!isValid || saving} className="w-full h-12 text-base rounded-xl" size="lg">
            {saving ? "Salvando..." : "Continuar para o pagamento →"}
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
