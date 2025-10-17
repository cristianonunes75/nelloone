import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { FileText, DollarSign, Gift } from "lucide-react";

interface Test {
  id: string;
  name: string;
  description: string;
  type: string;
  active: boolean;
  is_free: boolean;
  price_brl: number;
  questions_count: number;
  estimated_minutes: number;
}

export const TestsManagement = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .order("created_at");

      if (error) throw error;
      setTests(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar testes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (testId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("tests")
        .update({ active: !currentStatus })
        .eq("id", testId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Teste ${!currentStatus ? "ativado" : "desativado"} com sucesso.`,
      });

      fetchTests();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleFree = async (testId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("tests")
        .update({ 
          is_free: !currentStatus,
          price_brl: !currentStatus ? 0 : 29.0
        })
        .eq("id", testId);

      if (error) throw error;

      toast({
        title: "Status de gratuidade atualizado",
        description: `Teste ${!currentStatus ? "agora é gratuito" : "agora é pago"}.`,
      });

      fetchTests();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Gerenciamento de Testes</h2>
        <p className="text-muted-foreground">
          Ative/desative testes, defina preços e controle o acesso gratuito
        </p>
      </div>

      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-gold" />
                  <h3 className="text-xl font-semibold">{test.name}</h3>
                  {test.is_free && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      <Gift className="w-3 h-3 mr-1" />
                      Gratuito
                    </Badge>
                  )}
                  {!test.active && (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {test.description}
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Questões:</span>
                    <span className="font-medium">{test.questions_count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Tempo:</span>
                    <span className="font-medium">{test.estimated_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gold" />
                    <span className="font-bold text-lg">
                      R$ {test.price_brl.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 ml-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={test.active}
                    onCheckedChange={() => toggleActive(test.id, test.active)}
                  />
                  <span className="text-sm">
                    {test.active ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={test.is_free}
                    onCheckedChange={() => toggleFree(test.id, test.is_free)}
                  />
                  <span className="text-sm">
                    {test.is_free ? "Gratuito" : "Pago"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
