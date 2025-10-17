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

interface PurchaseTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: string;
  testName: string;
  price: number;
}

export const PurchaseTestDialog = ({
  open,
  onOpenChange,
  testId,
  testName,
  price,
}: PurchaseTestDialogProps) => {
  const { toast } = useToast();

  const handlePurchase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para fazer uma compra.",
          variant: "destructive",
        });
        return;
      }

      // Create checkout session
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          testId,
          testName,
          price,
          userId: user.id,
          userEmail: user.email,
        },
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Desbloquear {testName}</DialogTitle>
          <DialogDescription>
            Escolha como deseja pagar para ter acesso imediato ao teste.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-accent/10 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Teste Individual</span>
              <span className="text-2xl font-bold text-primary">
                R$ {price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Acesso vitalício ao teste {testName}
            </p>
          </div>

          <Button onClick={handlePurchase} className="w-full" size="lg">
            <CreditCard className="w-4 h-4 mr-2" />
            Pagar Agora
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou escolha um combo
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Combo 3 Testes</span>
                <span className="text-lg font-bold text-gold">R$ 59,00</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Economize R$ 28,00 • Escolha 3 testes à sua escolha
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gold/30 hover:bg-gold/10"
                onClick={handlePurchase}
              >
                <ShoppingCart className="w-3 h-3 mr-2" />
                Comprar Combo
              </Button>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Plano Premium</span>
                <span className="text-lg font-bold text-primary">R$ 950,00</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Todos os testes + sessão fotográfica + consultoria completa
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary/30 hover:bg-primary/10"
                onClick={handlePurchase}
              >
                <ShoppingCart className="w-3 h-3 mr-2" />
                Comprar Premium
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground">
          <p>✅ Acesso imediato após pagamento</p>
          <p>✅ Nota fiscal gerada automaticamente</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
