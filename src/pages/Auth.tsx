import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LogoText } from "@/components/LogoText";
import { z } from "zod";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const authSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  fullName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).optional(),
  phone: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos para continuar",
  }).optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Check if user came from a purchase attempt
  const redirectToPurchase = searchParams.get("redirect") === "purchase";

  // Redirect if already logged in
  if (user) {
    navigate("/cliente");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      const validation = authSchema.safeParse({
        email,
        password,
        fullName: isLogin ? undefined : fullName,
        phone: isLogin ? undefined : phone,
        termsAccepted: isLogin ? undefined : termsAccepted,
      });

      if (!validation.success) {
        toast({
          title: "Erro de validação",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Email ou senha incorretos");
          }
          throw error;
        }

        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta ao Essentia.",
        });
        
        // Wait for roles to be fetched before redirecting
        setTimeout(async () => {
          const { data: rolesData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
          
          const roles = (rolesData || []).map((r: any) => r.role);
          const primaryRole = roles.find((r: string) => r === "admin") || 
                             roles.find((r: string) => r === "fotografo") || 
                             "cliente";
          
          if (primaryRole === "admin") {
            navigate("/admin");
          } else if (primaryRole === "fotografo") {
            navigate("/fotografo");
          } else {
            navigate("/cliente");
          }
        }, 500);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("Este email já está cadastrado. Faça login.");
          }
          throw error;
        }

        toast({
          title: "Conta criada!",
          description: "Bem-vindo ao Essentia. Você já pode fazer login.",
        });

        // Auto login after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error("Error auto-signing in:", signInError);
        } else {
          // Wait for roles to be fetched before redirecting
          setTimeout(async () => {
            const { data: rolesData } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
            
            const roles = (rolesData || []).map((r: any) => r.role);
            const primaryRole = roles.find((r: string) => r === "admin") || 
                               roles.find((r: string) => r === "fotografo") || 
                               "cliente";
            
            if (primaryRole === "admin") {
              navigate("/admin");
            } else if (primaryRole === "fotografo") {
              navigate("/fotografo");
            } else {
              navigate("/cliente");
            }
          }, 500);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <LogoText className="text-4xl mb-6" />
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? "Entrar" : "Criar Conta"}
          </h1>
          <p className="text-muted-foreground mb-4">
            {isLogin
              ? "Acesse sua área reservada"
              : "Comece sua jornada Essentia"}
          </p>
          {redirectToPurchase && (
            <Alert className="text-left mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isLogin 
                  ? "Para concluir sua compra, faça login ou crie uma conta."
                  : "Para comprar e realizar os testes, é necessário criar uma conta. Seus resultados ficarão salvos para consulta futura."
                }
              </AlertDescription>
            </Alert>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <Label htmlFor="phone">WhatsApp (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {!isLogin && (
            <div className="flex items-start space-x-3 p-4 bg-accent/10 rounded-lg border border-border">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-1"
              />
              <div className="flex-1">
                <label
                  htmlFor="terms"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  Ao prosseguir, você concorda com o uso de seus dados exclusivamente para fins de 
                  análise de imagem e entrega da proposta de ensaio fotográfico. Leia nossos{" "}
                  <button
                    type="button"
                    onClick={() => window.open("/termos", "_blank")}
                    className="text-gold hover:underline font-semibold"
                  >
                    Termos de Uso
                  </button>
                  {" "}e{" "}
                  <button
                    type="button"
                    onClick={() => window.open("/privacidade", "_blank")}
                    className="text-gold hover:underline font-semibold"
                  >
                    Política de Privacidade
                  </button>
                  .
                </label>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || (!isLogin && !termsAccepted)}
          >
            {isLoading
              ? "Carregando..."
              : isLogin
              ? "Entrar"
              : "Criar conta"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin
              ? "Não tem conta? Cadastre-se"
              : "Já tem conta? Faça login"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para o site
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
