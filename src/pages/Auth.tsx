import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LogoText } from "@/components/LogoText";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";
import { Info, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";

const authSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().optional(),
  fullName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).optional(),
  phone: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos para continuar",
  }).optional(),
}).refine((data) => {
  if (data.confirmPassword !== undefined) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  
  // Check redirect parameter
  const redirectParam = searchParams.get("redirect");
  const redirectToPurchase = redirectParam === "purchase";
  const redirectToFundadores = redirectParam === "/fundadores" || redirectParam === "fundadores";

  // Helper to get localized path
  const getLocalizedPath = (path: string) => {
    if (language === 'en') return `/en${path}`;
    if (language === 'pt-pt') return `/pt-pt${path}`;
    return path;
  };

  // Helper to get home path
  const getHomePath = () => {
    if (language === 'en') return '/en';
    if (language === 'pt-pt') return '/pt-pt';
    return '/';
  };

  // Helper to get reset password path
  const getResetPasswordPath = () => {
    if (language === 'en') return '/en/reset-password';
    if (language === 'pt-pt') return '/pt-pt/reset-password';
    return '/reset-password';
  };

  // Localized text
  const texts = {
    login: language === 'en' ? 'Sign In' : 'Entrar',
    createAccount: language === 'en' ? 'Create Account' : 'Criar Conta',
    accessArea: language === 'en' ? 'Access your reserved area' : (language === 'pt-pt' ? 'Aceda à sua área reservada' : 'Acesse sua área reservada'),
    startJourney: language === 'en' ? 'Start your NELLO ONE journey' : (language === 'pt-pt' ? 'Comece a sua jornada NELLO ONE' : 'Comece sua jornada NELLO ONE'),
    validationError: language === 'en' ? 'Validation Error' : 'Erro de validação',
    loginSuccess: language === 'en' ? 'Login successful!' : 'Login realizado!',
    welcomeBack: language === 'en' ? 'Welcome back to NELLO ONE.' : (language === 'pt-pt' ? 'Bem-vindo de volta ao NELLO ONE.' : 'Bem-vindo de volta ao NELLO ONE.'),
    accountCreated: language === 'en' ? 'Account created!' : 'Conta criada!',
    welcomeNew: language === 'en' ? 'Welcome to NELLO ONE. You can now sign in.' : (language === 'pt-pt' ? 'Bem-vindo ao NELLO ONE. Já pode fazer login.' : 'Bem-vindo ao NELLO ONE. Você já pode fazer login.'),
    invalidCredentials: language === 'en' ? 'Invalid email or password' : 'Email ou senha incorretos',
    alreadyRegistered: language === 'en' ? 'This email is already registered. Please sign in.' : (language === 'pt-pt' ? 'Este email já está registado. Faça login.' : 'Este email já está cadastrado. Faça login.'),
    error: language === 'en' ? 'Error' : 'Erro',
    tryAgain: language === 'en' ? 'An error occurred. Please try again.' : 'Ocorreu um erro. Tente novamente.',
    fullName: language === 'en' ? 'Full name' : 'Nome completo',
    yourName: language === 'en' ? 'Your name' : 'Seu nome',
    whatsapp: language === 'en' ? 'WhatsApp (optional)' : 'WhatsApp (opcional)',
    minChars: language === 'en' ? 'Minimum 6 characters' : 'Mínimo 6 caracteres',
    loading: language === 'en' ? 'Loading...' : 'Carregando...',
    noAccount: language === 'en' ? "Don't have an account? Sign up" : (language === 'pt-pt' ? 'Não tem conta? Registe-se' : 'Não tem conta? Cadastre-se'),
    hasAccount: language === 'en' ? 'Already have an account? Sign in' : (language === 'pt-pt' ? 'Já tem conta? Faça login' : 'Já tem conta? Faça login'),
    backToSite: language === 'en' ? '← Back to site' : '← Voltar para o site',
    termsText: language === 'en' 
      ? 'By proceeding, you agree to the use of your data for personality analysis and storage of your test results.' 
      : (language === 'pt-pt' 
        ? 'Ao prosseguir, concorda com o uso dos seus dados para análise de personalidade e armazenamento dos seus resultados.'
        : 'Ao prosseguir, você concorda com o uso de seus dados para análise de personalidade e armazenamento dos seus resultados.'),
    termsOfUse: language === 'en' ? 'Terms of Use' : 'Termos de Uso',
    privacyPolicy: language === 'en' ? 'Privacy Policy' : 'Política de Privacidade',
    purchaseRedirectLogin: language === 'en' 
      ? 'To complete your purchase, please sign in or create an account.'
      : (language === 'pt-pt'
        ? 'Para concluir a sua compra, faça login ou crie uma conta.'
        : 'Para concluir sua compra, faça login ou crie uma conta.'),
    purchaseRedirectSignup: language === 'en'
      ? 'To purchase and take the tests, you need to create an account. Your results will be saved for future reference.'
      : (language === 'pt-pt'
        ? 'Para comprar e realizar os testes, é necessário criar uma conta. Os seus resultados ficarão guardados para consulta futura.'
        : 'Para comprar e realizar os testes, é necessário criar uma conta. Seus resultados ficarão salvos para consulta futura.'),
    confirmPassword: language === 'en' ? 'Confirm password' : 'Confirmar senha',
    passwordsDoNotMatch: language === 'en' ? 'Passwords do not match' : 'As senhas não coincidem',
    forgotPassword: language === 'en' ? 'Forgot your password?' : (language === 'pt-pt' ? 'Esqueceu a sua senha?' : 'Esqueceu sua senha?'),
  };

  // Redirect if already logged in
  if (user) {
    if (redirectToFundadores) {
      navigate("/fundadores?autoCheckout=true");
    } else {
      navigate(getLocalizedPath("/cliente"));
    }
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
        confirmPassword: isLogin ? undefined : confirmPassword,
        fullName: isLogin ? undefined : fullName,
        phone: isLogin ? undefined : phone,
        termsAccepted: isLogin ? undefined : termsAccepted,
      });

      if (!validation.success) {
        toast({
          title: texts.validationError,
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
            throw new Error(texts.invalidCredentials);
          }
          throw error;
        }

        toast({
          title: texts.loginSuccess,
          description: texts.welcomeBack,
        });
        
        // Wait for roles to be fetched before redirecting
        setTimeout(async () => {
          // If coming from Fundadores, redirect there with autoCheckout
          if (redirectToFundadores) {
            navigate("/fundadores?autoCheckout=true");
            return;
          }
          
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
            navigate(getLocalizedPath("/cliente"));
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
            emailRedirectTo: `${window.location.origin}${getHomePath()}`,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error(texts.alreadyRegistered);
          }
          throw error;
        }

        toast({
          title: texts.accountCreated,
          description: texts.welcomeNew,
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
            // If coming from Fundadores, redirect there with autoCheckout
            if (redirectToFundadores) {
              navigate("/fundadores?autoCheckout=true");
              return;
            }
            
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
              navigate(getLocalizedPath("/cliente"));
            }
          }, 500);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: texts.error,
        description: error.message || texts.tryAgain,
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
            {isLogin ? texts.login : texts.createAccount}
          </h1>
          <p className="text-muted-foreground mb-4">
            {isLogin ? texts.accessArea : texts.startJourney}
          </p>
          {redirectToPurchase && (
            <Alert className="text-left mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isLogin ? texts.purchaseRedirectLogin : texts.purchaseRedirectSignup}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="fullName">{texts.fullName}</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  placeholder={texts.yourName}
                />
              </div>
              <div>
                <Label htmlFor="phone">{texts.whatsapp}</Label>
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
            <Label htmlFor="password">{language === 'en' ? 'Password' : 'Senha'}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={texts.minChars}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {!isLogin && <PasswordStrengthIndicator password={password} language={language} />}
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="confirmPassword">{texts.confirmPassword}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder={texts.minChars}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

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
                  {texts.termsText}{" "}
                  <button
                    type="button"
                    onClick={() => window.open(getLocalizedPath("/termos"), "_blank")}
                    className="text-gold hover:underline font-semibold"
                  >
                    {texts.termsOfUse}
                  </button>
                  {" "}{language === 'en' ? 'and' : 'e'}{" "}
                  <button
                    type="button"
                    onClick={() => window.open(getLocalizedPath("/privacidade"), "_blank")}
                    className="text-gold hover:underline font-semibold"
                  >
                    {texts.privacyPolicy}
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
              ? texts.loading
              : isLogin
              ? texts.login
              : texts.createAccount}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {isLogin && (
            <button
              type="button"
              onClick={() => navigate(getResetPasswordPath())}
              className="text-sm text-gold hover:text-gold/80 transition-colors block w-full"
            >
              {texts.forgotPassword}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin ? texts.noAccount : texts.hasAccount}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate(getHomePath())}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {texts.backToSite}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
