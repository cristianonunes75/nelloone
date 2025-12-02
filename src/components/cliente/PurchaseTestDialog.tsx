import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { formatPrice, getCurrencyForLanguage } from "@/lib/priceConfig";

interface PurchaseTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: string;
  testName: string;
  price: number;
  isFreeTest?: boolean;
  answeredQuestions?: number;
}

export const PurchaseTestDialog = ({
  open,
  onOpenChange,
  testId,
  testName,
  price,
  isFreeTest = false,
  answeredQuestions = 0,
}: PurchaseTestDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handlePurchase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        onOpenChange(false);
        navigate("/auth?redirect=purchase");
        return;
      }

      // ANTI-CROSSTRADE: Create checkout session with language/currency
      const currency = getCurrencyForLanguage(language).toLowerCase();
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          testId,
          userId: user.id,
          userEmail: user.email,
          language: language, // Enforces correct currency
          currency: currency,
        },
      });

      if (error) throw error;

      // Handle cross-trade block
      if (data?.code === "CURRENCY_MISMATCH") {
        toast({
          title: language === 'en' ? "Currency Error" : "Erro de Moeda",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: language === 'en' ? "Payment Error" : "Erro ao processar pagamento",
        description: error.message || (language === 'en' ? "Try again shortly." : "Tente novamente em alguns instantes."),
        variant: "destructive",
      });
    }
  };

  // Format price based on language (ANTI-CROSSTRADE)
  const displayPrice = formatPrice(price, language);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light">
            {isFreeTest && answeredQuestions >= 5
              ? "Seu resultado está quase completo"
              : `Desbloquear ${testName}`}
          </DialogTitle>
          <DialogDescription className="text-base pt-2 space-y-3">
            {isFreeTest && answeredQuestions >= 5 ? (
              <>
                <p>
                  {answeredQuestions} respostas já revelaram muito sobre você — mas as próximas questões 
                  trarão clareza sobre quem você realmente é.
                </p>
                <p>
                  O relatório completo mostra como sua energia muda em diferentes contextos 
                  (vida, trabalho e espiritualidade).
                </p>
              </>
            ) : (
              <p>
                Desbloqueie acesso completo ao teste <strong>{testName}</strong> e descubra 
                insights profundos sobre sua personalidade e comportamento.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {language === 'en' ? 'Complete Report' : 'Relatório Completo'}
              </span>
              <span className="text-2xl font-bold text-primary">
                {displayPrice}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? '🌟 Unlock your complete reading and see the archetype that guides your essence'
                : '🌟 Desbloqueie sua leitura completa e veja o arquétipo que conduz sua essência'}
            </p>
          </div>

          <Button onClick={handlePurchase} className="w-full" size="lg">
            <CreditCard className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Unlock Now' : 'Desbloquear Agora'}
          </Button>
        </div>

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <p>✅ Acesso imediato após pagamento</p>
          <p>✅ Nota fiscal gerada automaticamente</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
