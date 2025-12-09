import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft, Star, Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const FundadorFeedback = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    titulo: "",
    descricao: "",
  });

  const getBasePath = () => {
    if (language === 'en') return '/en';
    if (language === 'pt-pt') return '/pt-pt';
    return '';
  };

  // Redirect if not a founder
  useEffect(() => {
    if (profile && !profile.is_founder) {
      toast.error("Acesso exclusivo para Fundadores");
      navigate(`${getBasePath()}/cliente`);
    }
  }, [profile, navigate, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo || !formData.titulo || !formData.descricao) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("founder_feedback")
        .insert({
          user_id: user.id,
          tipo: formData.tipo,
          titulo: formData.titulo,
          descricao: formData.descricao,
          url_context: window.location.pathname,
          device_info: navigator.userAgent,
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Feedback enviado com sucesso!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Erro ao enviar feedback. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ tipo: "", titulo: "", descricao: "" });
    setSubmitted(false);
  };

  if (!profile?.is_founder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-xl z-10">
        <div className="container px-4 py-3 flex items-center justify-between">
          <LogoText className="text-xl" variant="solid" />
          <Button variant="ghost" size="sm" onClick={() => navigate(`${getBasePath()}/cliente`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-xl mx-auto">
        <Card className="border-amber-500/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-xl">Feedback de Fundador</CardTitle>
            <CardDescription>
              Como Fundador, sua opinião é essencial para construirmos juntos o NELLO ONE.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-emerald-500/10 rounded-full">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Obrigado pelo seu feedback!</h3>
                <p className="text-muted-foreground text-sm">
                  Seu relato foi registrado e será analisado pela equipe. Sua contribuição é muito valiosa para nós.
                </p>
                <div className="flex gap-3 justify-center pt-4">
                  <Button variant="outline" onClick={resetForm}>
                    Enviar outro feedback
                  </Button>
                  <Button onClick={() => navigate(`${getBasePath()}/cliente`)}>
                    Voltar à Jornada
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de feedback</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(v) => setFormData({ ...formData, tipo: v })}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">🐛 Bug ou falha técnica</SelectItem>
                      <SelectItem value="melhoria">💡 Sugestão de melhoria</SelectItem>
                      <SelectItem value="duvida">❓ Dúvida sobre a experiência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titulo">Título resumido</Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Botão não funciona na página de resultados"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição detalhada</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva o que aconteceu, onde você estava, e o que esperava que acontecesse..."
                    rows={5}
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Enviar Feedback
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          💛 Obrigado por fazer parte da primeira geração do NELLO ONE.
        </p>
      </main>
    </div>
  );
};

export default FundadorFeedback;
