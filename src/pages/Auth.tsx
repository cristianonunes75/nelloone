import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LogoText } from "@/components/LogoText";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";
import { Info, Eye, EyeOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { PasswordBreachWarning } from "@/components/PasswordBreachWarning";
import { usePasswordBreachCheck } from "@/hooks/usePasswordBreachCheck";
import { Separator } from "@/components/ui/separator";
import { ConsentCheckbox, ConsentError } from "@/components/consent/ConsentCheckbox";
import { recordConsent } from "@/hooks/useConsentRecord";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { lovable } from "@/integrations/lovable/index";

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
  const [consentError, setConsentError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const { isBreached, isChecking, breachCount, checkPassword, reset: resetBreachCheck } = usePasswordBreachCheck();

  // Check password breach when password changes (only in signup mode)
  useEffect(() => {
    if (!isLogin && password) {
      checkPassword(password);
    } else {
      resetBreachCheck();
    }
  }, [password, isLogin, checkPassword, resetBreachCheck]);
  
  // Check redirect parameter
  const redirectParam = searchParams.get("redirect");
  const redirectToPurchase = redirectParam === "purchase";
  const redirectToFundadores = redirectParam === "/fundadores" || redirectParam === "fundadores";
  // Generic path redirect (e.g. /convite, /convite#comecar)
  const redirectToPath = redirectParam && redirectParam.startsWith("/") && !redirectToFundadores ? redirectParam : null;

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
    startJourney: language === 'en' ? 'Start your Identity journey' : (language === 'pt-pt' ? 'Comece a sua Jornada Identity' : 'Comece sua Jornada Identity'),
    validationError: language === 'en' ? 'Validation Error' : 'Erro de validação',
    loginSuccess: language === 'en' ? 'Login successful!' : 'Login realizado!',
    welcomeBack: language === 'en' ? 'Welcome back to Identity.' : (language === 'pt-pt' ? 'Bem-vindo de volta ao Identity.' : 'Bem-vindo de volta ao Identity.'),
    accountCreated: language === 'en' ? 'Account created!' : 'Conta criada!',
    welcomeNew: language === 'en' 
      ? 'Check your inbox and click the confirmation link to activate your account.' 
      : (language === 'pt-pt' 
        ? 'Verifique a sua caixa de entrada e clique no link de confirmação para ativar a conta.' 
        : 'Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.'),
    emailNotConfirmed: language === 'en'
      ? 'Email not confirmed yet. Check your inbox and click the confirmation link.'
      : (language === 'pt-pt'
        ? 'Email ainda não confirmado. Verifique a sua caixa de entrada e clique no link de confirmação.'
        : 'Email ainda não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.'),
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
    consentRequired: language === 'en'
      ? 'You must accept the Terms and Privacy Policy to continue.'
      : language === 'pt-pt'
        ? 'Tem de aceitar os Termos e a Política de Privacidade para continuar.'
        : 'Você precisa aceitar os Termos e a Política de Privacidade para continuar.',
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
    orContinueWith: language === 'en' ? 'or continue with' : 'ou continue com',
    continueWithGoogle: language === 'en' ? 'Continue with Google' : 'Continuar com Google',
  };

  // Redirect if already logged in
  if (user) {
    if (redirectToFundadores) {
      navigate("/fundadores?autoCheckout=true");
    } else if (redirectToPath) {
      navigate(redirectToPath);
    } else {
      navigate(getLocalizedPath("/cliente"));
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError(false);
    
    // Check consent for signup
    if (!isLogin && !termsAccepted) {
      setConsentError(true);
      toast({
        title: texts.validationError,
        description: texts.consentRequired,
        variant: "destructive",
      });
      return;
    }
    
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
          if (error.message.includes("Email not confirmed")) {
            throw new Error(texts.emailNotConfirmed);
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

          // Generic path redirect (e.g. /convite)
          if (redirectToPath) {
            navigate(redirectToPath);
            return;
          }

          // Link express lead to newly created account (merge guest → user)
          const expressLeadId = sessionStorage.getItem("expressLeadId");
          if (expressLeadId) {
            const currentUser = (await supabase.auth.getUser()).data.user;
            if (currentUser) {
              await supabase
                .from("codigo_inicial_leads" as any)
                .update({ user_id: currentUser.id } as any)
                .eq("id", expressLeadId);
            }
            sessionStorage.removeItem("expressLeadId");
            sessionStorage.removeItem("expressLeadName");
          }

          // If there's a pending checkout session (guest paid then created account)
          const pendingSession = sessionStorage.getItem("pendingCheckoutSession");
          if (pendingSession) {
            sessionStorage.removeItem("pendingCheckoutSession");
            navigate(`/checkout/success?session_id=${pendingSession}`);
            return;
          }

          const { data: rolesData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

          const roles = (rolesData || []).map((r: any) => r.role);
          const primaryRole = roles.find((r: string) => r === "admin") || "cliente";

          if (primaryRole === "admin") {
            navigate("/admin");
          } else {
            navigate(getLocalizedPath("/cliente"));
          }
        }, 500);
      } else {
        const { data, error } = await supabase.auth.signUp({
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

        // Register user for Nello One Identity app and record consent
        if (data.user) {
          // Record app registration
          await supabase
            .from('user_app_registrations')
            .insert({
              user_id: data.user.id,
              app_name: 'identity',
            });
          
          // Record LGPD consent
          await recordConsent({
            userId: data.user.id,
            consentType: 'signup',
            acceptedTerms: true,
            acceptedPrivacy: true,
          });
        }

        toast({
          title: texts.accountCreated,
          description: texts.welcomeNew,
          duration: 8000, // Longer duration for important message
        });

        // Switch to login mode so user can sign in after confirming email
        setIsLogin(true);
        // Clear form but keep email for convenience
        setPassword("");
        setConfirmPassword("");
        setFullName("");
        setPhone("");
        setTermsAccepted(false);
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // On custom domains, the ~oauth route doesn't exist, so we need to
      // use the lovable.app domain as the OAuth broker
      const hostname = window.location.hostname;
      const isLovableDomain = hostname.endsWith('.lovable.app') || hostname.endsWith('.lovableproject.com');
      const isCustomDomain = !isLovableDomain;
      
      if (isCustomDomain) {
        const lovableAuth = createLovableAuth({
          oauthBrokerUrl: "https://nelloone.lovable.app/~oauth/initiate",
        });
        const result = await lovableAuth.signInWithOAuth("google", {
          redirect_uri: `${window.location.origin}/auth`,
        });
        if (result.redirected) return;
        if (result.error) throw result.error;
        await supabase.auth.setSession(result.tokens);
      } else {
        const { error } = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: `${window.location.origin}/auth`,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast({
        title: texts.error,
        description: error.message || texts.tryAgain,
        variant: "destructive",
      });
      setIsGoogleLoading(false);
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
            {!isLogin && (
              <PasswordBreachWarning 
                isBreached={isBreached} 
                isChecking={isChecking} 
                breachCount={breachCount}
                language={language}
              />
            )}
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
            <div className="space-y-1">
              <ConsentCheckbox
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  setTermsAccepted(checked);
                  if (checked) setConsentError(false);
                }}
                variant="signup"
                error={consentError}
              />
              {consentError && <ConsentError language={language} />}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || (!isLogin && !termsAccepted) || (!isLogin && isBreached === true)}
          >
            {isLoading
              ? texts.loading
              : isLogin
              ? texts.login
              : texts.createAccount}
          </Button>
        </form>

        {/* 
          Google OAuth - Desativado temporariamente
          Para ativar: Configure as credenciais OAuth no Google Cloud Console
          e habilite o provider no Lovable Cloud (Users -> Auth Settings -> Google Settings)
          Depois, mude ENABLE_GOOGLE_AUTH para true
        */}
        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground uppercase">
            {texts.orContinueWith}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          size="lg"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {texts.continueWithGoogle}
        </Button>

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
