import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Purchase {
  id: string;
  price_paid: number;
  payment_status: string;
  payment_method: string | null;
  purchased_at: string;
  test_id: string;
  user_id: string;
  profiles: {
    full_name: string;
  };
  tests: {
    name: string;
  };
}

export const PaymentsManagement = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    revenue: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from("test_purchases")
        .select(`
          id,
          price_paid,
          payment_status,
          payment_method,
          purchased_at,
          test_id,
          user_id
        `)
        .order("purchased_at", { ascending: false });

      if (error) throw error;

      // Fetch related data separately
      const enrichedData = await Promise.all(
        (data || []).map(async (purchase) => {
          const [profileResult, testResult] = await Promise.all([
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", purchase.user_id)
              .single(),
            supabase
              .from("tests")
              .select("name")
              .eq("id", purchase.test_id)
              .single(),
          ]);

          return {
            ...purchase,
            profiles: profileResult.data || { full_name: "Usuário Desconhecido" },
            tests: testResult.data || { name: "Teste Desconhecido" },
          };
        })
      );

      setPurchases(enrichedData);

      // Calculate stats
      const total = enrichedData.length;
      const pending = enrichedData.filter((p) => p.payment_status === "pending").length;
      const completed = enrichedData.filter((p) => p.payment_status === "completed").length;
      const revenue = enrichedData
        .filter((p) => p.payment_status === "completed")
        .reduce((sum, p) => sum + Number(p.price_paid), 0);

      setStats({ total, pending, completed, revenue });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar pagamentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { label: "Concluído", variant: "default" as const },
      pending: { label: "Pendente", variant: "secondary" as const },
      failed: { label: "Falhou", variant: "destructive" as const },
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Gestão Financeira</h2>
        <p className="text-muted-foreground">
          Visualize todas as transações e pagamentos do sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total de Vendas</div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pendentes</div>
          <div className="text-2xl font-bold mt-1 text-orange-500">{stats.pending}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Concluídas</div>
          <div className="text-2xl font-bold mt-1 text-green-500">{stats.completed}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Receita Total</div>
          <div className="text-2xl font-bold mt-1 text-gold">
            R$ {stats.revenue.toFixed(2)}
          </div>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {purchases.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhuma transação encontrada</p>
          </Card>
        ) : (
          purchases.map((purchase) => (
            <Card key={purchase.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gold" />
                  </div>
                  
                  <div>
                    <div className="font-semibold">{purchase.tests.name}</div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {purchase.profiles.full_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(purchase.purchased_at), "dd/MM/yyyy HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(purchase.payment_status)}
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      R$ {Number(purchase.price_paid).toFixed(2)}
                    </div>
                    {purchase.payment_method && (
                      <div className="text-xs text-muted-foreground">
                        {purchase.payment_method}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
