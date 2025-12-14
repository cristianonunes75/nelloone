import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useCart, calculateCartTotal } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAffiliateCode } from "@/hooks/useAffiliateTracking";

interface CartSummaryProps {
  tests: Array<{
    id: string;
    name: string;
    price_brl: number;
  }>;
}

export const CartSummary = ({ tests }: CartSummaryProps) => {
  const { selectedTests, clearCart } = useCart();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  // ANTI-CROSSTRADE: Use correct currency based on language
  const currency = language === "en" ? "usd" : "brl";
  const currencySymbol = language === "en" ? "$" : "R$";
  
  const cartInfo = calculateCartTotal(tests, selectedTests, currency);

  if (selectedTests.length === 0) return null;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // ANTI-CROSSTRADE: Pass both language and explicit currency
      const affiliateCode = getAffiliateCode();
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          testIds: selectedTests,
          language: language,
          currency: currency, // Explicit currency for validation
          affiliateCode: affiliateCode,
        }
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

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: language === "en" ? "Payment error" : "Erro ao processar pagamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="fixed bottom-6 right-6 p-6 shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm z-50 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <ShoppingCart className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{language === 'en' ? "Shopping Cart" : "Carrinho de Compras"}</h3>
          <p className="text-sm text-muted-foreground">
            {cartInfo.quantity} {language === 'en'
              ? (cartInfo.quantity === 1 ? 'test selected' : 'tests selected')
              : (cartInfo.quantity === 1 ? 'teste selecionado' : 'testes selecionados')
            }
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{currencySymbol} {cartInfo.subtotal.toFixed(2)}</span>
        </div>
        
        {cartInfo.discountPercentage > 0 && (
          <div className="flex justify-between text-sm items-center">
            <span className="flex items-center gap-1 text-green-600">
              <Sparkles className="w-3 h-3" />
              {language === 'en' ? `Discount (${cartInfo.discountPercentage}%)` : `Desconto (${cartInfo.discountPercentage}%)`}
            </span>
            <span className="text-green-600 font-medium">-{currencySymbol} {cartInfo.discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">{currencySymbol} {cartInfo.total.toFixed(2)}</span>
        </div>
      </div>

      {cartInfo.quantity >= 3 && cartInfo.quantity < 5 && (
        <div className="mb-3 p-2 bg-accent/50 rounded-lg text-xs text-center">
          {language === 'en'
            ? "💡 Buy 2 more tests and get 10% off!"
            : "💡 Compre mais 2 testes e ganhe 10% de desconto!"
          }
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          className="flex-1"
        >
          {language === 'en' ? "Clear" : "Limpar"}
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing 
            ? (language === 'en' ? "Processing..." : "Processando...") 
            : (language === 'en' ? "Checkout" : "Finalizar Compra")
          }
        </Button>
      </div>
    </Card>
  );
};