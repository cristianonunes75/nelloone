import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, CheckCircle, Clock, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const PurchaseHistory = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const { data: purchases, isLoading } = useQuery({
    queryKey: ["purchase-history", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_purchases")
        .select("*, tests(name)")
        .eq("user_id", user!.id)
        .order("purchased_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-emerald-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            {isEn ? "Completed" : "Concluído"}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            {isEn ? "Pending" : "Pendente"}
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            {isEn ? "Failed" : "Falhou"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string = "BRL") => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      language === 'en' ? 'en-US' : 'pt-BR',
      { day: '2-digit', month: 'short', year: 'numeric' }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="w-5 h-5" />
            {isEn ? "Purchase History" : "Histórico de Compras"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingBag className="w-5 h-5" />
          {isEn ? "Purchase History" : "Histórico de Compras"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {purchases && purchases.length > 0 ? (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-3 bg-accent/30 rounded-lg border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {(purchase.tests as any)?.name || purchase.test_slug || isEn ? "Test Purchase" : "Compra de Teste"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(purchase.purchased_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {formatCurrency(purchase.price_paid, purchase.currency || "BRL")}
                  </span>
                  {getStatusBadge(purchase.payment_status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {isEn ? "No purchases yet" : "Nenhuma compra ainda"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
