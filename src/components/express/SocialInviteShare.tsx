import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Copy, Check, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  inviterName?: string;
  inviterUserId?: string;
  inviterLeadId?: string;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function SocialInviteShare({ inviterName, inviterUserId, inviterLeadId }: Props) {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  const inviteUrl = inviteCode
    ? `${window.location.origin}/codigo-inicial?ref=${inviteCode}`
    : null;

  const createInvite = async () => {
    setCreating(true);
    try {
      const code = generateCode();
      const { error } = await supabase.from("social_invites" as any).insert({
        invite_code: code,
        inviter_user_id: inviterUserId || null,
        inviter_lead_id: inviterLeadId || null,
        inviter_name: inviterName || null,
      } as any);

      if (error) throw error;
      setInviteCode(code);
    } catch (e) {
      console.error("Error creating invite:", e);
      toast.error("Erro ao gerar link. Tente novamente.");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    createInvite();
  }, []);

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const handleShare = async () => {
    if (!inviteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Descubra seu Código Inicial',
          text: 'Eu descobri meu Código Inicial. Agora quero descobrir o seu.',
          url: inviteUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  if (!inviteCode) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Card className="border-border bg-card">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Agora quero descobrir o código de alguém próximo.
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Envie o link abaixo para alguém que você gostaria de entender melhor.
            Vocês poderão comparar seus códigos depois.
          </p>

          <div className="flex gap-2">
            <Button
              onClick={handleShare}
              className="flex-1 h-11 rounded-xl"
              size="lg"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Enviar para alguém
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="h-11 px-4 rounded-xl"
              size="lg"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
