import { useAuth } from "@/hooks/useAuth";
import { useTests } from "@/hooks/useTests";
import { useTestAccess } from "@/hooks/useTestAccess";
import { Button } from "@/components/ui/button";
import { TestCard } from "@/components/cliente/TestCard";
import { LockedTestCard } from "@/components/cliente/LockedTestCard";
import { LogoText } from "@/components/LogoText";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { LogOut, User } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import EssentiaConcierge from "@/components/cliente/EssentiaConcierge";

const Cliente = () => {
  const { user, signOut, userRole } = useAuth();
  const { tests, isLoading, getTestStatus, getTestProgress, startTest, startTestAsync, resetTest } = useTests();
  const { hasAccess } = useTestAccess();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle payment success callback
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    
    if (paymentStatus === "success") {
      toast({
        title: "Pagamento confirmado! 🎉",
        description: "Seu teste foi liberado. Você já pode começar!",
      });
      
      // Invalidate queries to refresh test access
      queryClient.invalidateQueries({ queryKey: ["test-purchases"] });
      
      // Clean up URL
      searchParams.delete("payment");
      searchParams.delete("test_id");
      setSearchParams(searchParams);
    } else if (paymentStatus === "cancelled") {
      toast({
        title: "Pagamento cancelado",
        description: "Você pode tentar novamente quando quiser.",
        variant: "destructive",
      });
      
      // Clean up URL
      searchParams.delete("payment");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, toast, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <LogoText className="text-2xl" variant="solid" />
          <div className="flex items-center gap-4">
            <RoleSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cliente/perfil")}
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Olá, {user?.user_metadata?.full_name?.split(" ")[0] || "Cliente"}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Comece pelo <strong>Teste de Arquétipos</strong> — 12 perguntas gratuitas para descobrir sua essência.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Seus Testes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests?.map((test) => {
                const isFree = test.is_free || false;
                const hasTestAccess = hasAccess(test.id, isFree);

                if (!hasTestAccess) {
                  return (
                    <LockedTestCard
                      key={test.id}
                      id={test.id}
                      name={test.name}
                      description={test.description}
                      questionsCount={test.questions_count}
                      estimatedMinutes={test.estimated_minutes}
                      icon={test.icon || "Circle"}
                      price={test.price_brl || 29.0}
                    />
                  );
                }

                return (
                  <TestCard
                    key={test.id}
                    id={test.id}
                    name={test.name}
                    description={test.description}
                    questionsCount={test.questions_count}
                    estimatedMinutes={test.estimated_minutes}
                    icon={test.icon || "Circle"}
                    status={getTestStatus(test.id)}
                    progress={getTestProgress(test.id)}
                    onStart={async () => {
                      const userTest = await startTestAsync(test.id);
                      navigate(`/cliente/test-execution/${test.id}/${userTest.id}`);
                    }}
                    onReset={userRole === "admin" ? () => resetTest(test.id) : undefined}
                    isFree={isFree}
                  />
                );
              })}
            </div>
          </div>

          <div className="bg-accent/10 border border-border rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              ⚠️ <strong>Lembrete importante:</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Os resultados destes testes são simbólicos e servem como ferramentas de autoconhecimento e comunicação. 
              Eles não representam verdade absoluta, nem substituem oração, discernimento espiritual ou aconselhamento pessoal.
            </p>
          </div>
        </div>
      </main>
      <EssentiaConcierge />
    </div>
  );
};

export default Cliente;
