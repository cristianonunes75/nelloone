import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft, Clock, Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "suporte",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          category: formData.category,
          subject: formData.subject || null,
          message: formData.message,
          status: "novo"
        });

      if (error) throw error;

      // Notify admins via push notification and email
      try {
        await supabase.functions.invoke("send-push", {
          body: {
            title: "📩 Novo ticket de suporte",
            body: `${formData.name}: ${formData.subject || formData.category}`,
            url: "/admin/comunicacao",
            notifyAdmins: true,
            sendEmail: true,
            ticketData: {
              name: formData.name,
              email: formData.email,
              category: formData.category,
              subject: formData.subject,
              message: formData.message
            }
          }
        });
      } catch (pushError) {
        console.log("Notification failed (non-critical):", pushError);
      }

      setSubmitted(true);
      toast({
        title: "Mensagem enviada!",
        description: "Recebemos sua mensagem e responderemos em breve."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-6 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 text-miguel-deep hover:text-miguel-deep/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-miguel-deep font-display mb-4">
              Mensagem enviada!
            </h1>
            <p className="text-miguel-deep/70 max-w-md mx-auto leading-relaxed mb-8">
              Recebemos sua mensagem e nossa equipe responderá em até 2 dias úteis pelo email informado.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl shadow-apple"
            >
              Voltar para o site
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-miguel-deep hover:text-miguel-deep/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <LogoText variant="solid" className="text-4xl mb-4" />
          <h1 className="text-3xl md:text-4xl font-semibold text-miguel-deep font-display">
            Estamos aqui para você.
          </h1>
          <p className="text-miguel-deep/70 mt-4 max-w-xl mx-auto leading-relaxed">
            Para dúvidas, suporte ou solicitações sobre sua experiência no NELLO ONE, 
            preencha o formulário abaixo.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-apple p-8 md:p-12 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suporte">Suporte Geral</SelectItem>
                    <SelectItem value="privacidade">Privacidade e Dados</SelectItem>
                    <SelectItem value="pagamento">Pagamento</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Resumo do assunto"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Descreva sua dúvida ou solicitação..."
                rows={6}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl shadow-apple"
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </>
              )}
            </Button>

            <div className="flex items-center gap-3 pt-4 border-t border-soul-sand/30">
              <Clock className="w-5 h-5 text-miguel-silver" strokeWidth={1.5} />
              <p className="text-miguel-deep/70 text-sm">
                <strong className="text-miguel-deep">Tempo médio de resposta:</strong> 1 a 2 dias úteis
              </p>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-xl"
          >
            Voltar para o site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
