import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, Eye, ShieldQuestion, Puzzle, Layers, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import SocialInviteShare from "./SocialInviteShare";

interface Props {
  onDeepen: () => void;
  inviterName?: string;
  inviterLeadId?: string;
  leadEmail?: string;
}

const HIDDEN_DIMENSIONS = [
  { icon: <Eye className="h-4 w-4" />, text: 'Seus padrões emocionais profundos' },
  { icon: <ShieldQuestion className="h-4 w-4" />, text: 'Como você reage sob pressão real' },
  { icon: <Puzzle className="h-4 w-4" />, text: 'Os conflitos internos que moldam suas decisões' },
  { icon: <Layers className="h-4 w-4" />, text: 'A integração entre suas forças naturais e seus desafios invisíveis' },
];

export default function EssenceUpsell({ onDeepen, inviterName, inviterLeadId, leadEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          productType: "codigo_essencia_express",
          language,
          userEmail: leadEmail || undefined,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e) {
      console.error("Checkout error:", e);
      toast.error("Erro ao iniciar pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto space-y-5"
    >
      {/* Confirmation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Seu Código está salvo.</p>
            <p className="text-xs text-muted-foreground">Agora você pode descobrir sua leitura completa.</p>
          </div>
        </CardContent>
      </Card>

      {/* Social Invite */}
      <SocialInviteShare
        inviterName={inviterName}
        inviterLeadId={inviterLeadId}
      />

      {/* Identity Gap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="border-border">
          <CardContent className="p-5 sm:p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              O que ainda não apareceu na sua leitura
            </h3>

            <div className="space-y-3">
              {HIDDEN_DIMENSIONS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-muted-foreground mt-0.5">{item.icon}</span>
                  <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upsell Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-3">
              <Badge variant="secondary" className="text-xs">
                Próximo passo da sua jornada
              </Badge>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Descubra seu Código da Essência
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Uma leitura profunda integrando padrões emocionais, comportamentais e internos que não aparecem em uma análise rápida.
              </p>
            </div>

            <div className="text-center space-y-1">
              <p className="text-3xl font-bold text-foreground">R$ 99,00</p>
              <p className="text-xs text-muted-foreground">pagamento único</p>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full h-12 text-base rounded-xl"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {loading ? "Preparando..." : "Quero ver minha leitura completa"}
              {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
