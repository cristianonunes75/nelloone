import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, ArrowRight, Eye, ShieldQuestion, Puzzle, Layers,
  Loader2, Quote, LogIn, Shield, Brain, Heart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { checkTestimonialCompliance, TESTIMONIAL_DISCLAIMER } from "@/lib/compliance/testimonialCompliance";

const HIDDEN_DIMENSIONS = [
  { icon: <Eye className="h-5 w-5" />, text: "Seus padrões emocionais profundos" },
  { icon: <ShieldQuestion className="h-5 w-5" />, text: "Como você reage sob pressão real" },
  { icon: <Puzzle className="h-5 w-5" />, text: "Os conflitos internos que moldam suas decisões" },
  { icon: <Layers className="h-5 w-5" />, text: "A integração entre suas forças naturais e seus desafios invisíveis" },
];

const WHAT_IS_INCLUDED = [
  { icon: <Brain className="h-5 w-5" />, title: "7 Mapas de Autoconhecimento", desc: "DISC, Temperamentos, Eneagrama, Nello16, Estilos de Conexão, Valores e Inteligência Emocional" },
  { icon: <Sparkles className="h-5 w-5" />, title: "Código da Essência", desc: "Leitura integrada que conecta todas as suas dimensões em uma narrativa única" },
  { icon: <Heart className="h-5 w-5" />, title: "Ativação do Código", desc: "Processo guiado para aplicar seu autoconhecimento na vida real" },
  { icon: <Shield className="h-5 w-5" />, title: "Acesso vitalício", desc: "Seus resultados ficam disponíveis para sempre no seu painel" },
];

export default function JornadaIdentity() {
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const navigate = useNavigate();

  const { data: testimonials } = useQuery({
    queryKey: ["jornada-identity-testimonials"],
    queryFn: async () => {
      const { data: raw, error } = await supabase
        .from("testimonials")
        .select("id, content, user_id, display_name")
        .eq("status", "approved")
        .eq("consent_given", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!raw || raw.length === 0) return [];

      const userIds = raw.map((t) => t.user_id).filter(Boolean);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

      return raw
        .filter((t) => checkTestimonialCompliance(t.content).riskLevel !== "critical")
        .map((t) => ({
          name: t.display_name || profileMap.get(t.user_id)?.full_name || "Usuário",
          content: t.content,
        }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { productType: "codigo_essencia_express", language },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL");
      }
    } catch (e) {
      console.error("Checkout error:", e);
      toast.error("Erro ao iniciar pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="secondary" className="text-xs mb-4">Jornada de Autoconhecimento</Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-tight">
              Jornada Identity
            </h1>
            <p className="text-xl sm:text-2xl text-nello-gold font-medium mt-2">Código da Essência</p>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed max-w-lg mx-auto">
              Uma leitura profunda que integra múltiplas dimensões do seu funcionamento e revela padrões que não aparecem em uma análise rápida.
            </p>
          </motion.div>
        </div>
      </section>

      {/* O que você vai descobrir */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-2xl font-bold text-foreground text-center">
            O que você vai descobrir
          </h2>
          <div className="space-y-4">
            {HIDDEN_DIMENSIONS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/30"
              >
                <span className="text-nello-gold mt-0.5">{item.icon}</span>
                <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* O que está incluído */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-2xl font-bold text-foreground text-center">
            O que está incluído
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHAT_IS_INCLUDED.map((item, i) => (
              <Card key={i} className="border-border/30">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-nello-gold">
                    {item.icon}
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preço + CTA */}
      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-nello-gold/30 bg-gradient-to-b from-nello-gold/5 to-transparent shadow-lg">
            <CardContent className="p-8 text-center space-y-5">
              <div className="space-y-1">
                <p className="text-4xl font-bold text-foreground">R$ 99,00</p>
                <p className="text-sm text-muted-foreground">pagamento único · acesso vitalício</p>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full h-12 text-base rounded-xl bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {loading ? "Preparando..." : "Começar minha Jornada"}
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Depoimentos */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-12 md:py-16 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Experiências reais
              </h2>
              <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto">
                {TESTIMONIAL_DISCLAIMER.pt}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * Math.min(i, 8), duration: 0.4 }}
                  className="bg-card rounded-xl p-5 border border-border/30 shadow-soft"
                >
                  <Quote className="w-5 h-5 text-muted-foreground/30 mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-foreground leading-relaxed mb-4 line-clamp-5">
                    "{t.content}"
                  </p>
                  <div>
                    <p className="text-xs font-medium text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">Jornada Identity</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Login para quem já fez a Leitura */}
      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-border/50 bg-muted/10">
            <CardContent className="p-6 text-center space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Já fez sua Leitura Inicial?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Acesse sua conta para continuar sua jornada e desbloquear o Código da Essência.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/auth?redirect=/dashboard")}
                className="w-full rounded-xl"
                size="lg"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Entrar na minha conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4">
        <div className="max-w-lg mx-auto text-center space-y-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            A Jornada Identity é uma ferramenta de autoconhecimento. Não constitui diagnóstico clínico, avaliação terapêutica ou aconselhamento profissional. Os resultados refletem padrões comportamentais e não devem substituir acompanhamento especializado.
          </p>
        </div>
      </section>
    </div>
  );
}
