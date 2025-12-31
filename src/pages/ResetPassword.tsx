import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogoText } from "@/components/LogoText";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, EyeOff, Mail, KeyRound, ArrowLeft, Check } from "lucide-react";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";

type ResetMode = 'request' | 'reset';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  // Determine mode based on URL hash (Supabase sends recovery link with hash)
  const [mode, setMode] = useState<ResetMode>('request');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Localized texts
  const texts = {
    forgotPassword: language === 'en' ? 'Forgot Password' : 'Esqueceu a Senha',
    resetPassword: language === 'en' ? 'Reset Password' : 'Redefinir Senha',
    enterEmail: language === 'en' 
      ? 'Enter your email address and we\'ll send you a link to reset your password.'
      : (language === 'pt-pt' 
        ? 'Insira o seu email e enviaremos um link para redefinir a sua senha.'
        : 'Digite seu email e enviaremos um link para redefinir sua senha.'),
    enterNewPassword: language === 'en'
      ? 'Enter your new password below.'
      : (language === 'pt-pt'
        ? 'Introduza a sua nova senha abaixo.'
        : 'Digite sua nova senha abaixo.'),
    email: 'Email',
    newPassword: language === 'en' ? 'New Password' : 'Nova Senha',
    confirmNewPassword: language === 'en' ? 'Confirm New Password' : 'Confirmar Nova Senha',
    sendResetLink: language === 'en' ? 'Send Reset Link' : 'Enviar Link de Redefinição',
    updatePassword: language === 'en' ? 'Update Password' : 'Atualizar Senha',
    backToLogin: language === 'en' ? 'Back to login' : 'Voltar para login',
    loading: language === 'en' ? 'Loading...' : 'Carregando...',
    minChars: language === 'en' ? 'Minimum 6 characters' : 'Mínimo 6 caracteres',
    emailSentTitle: language === 'en' ? 'Email Sent!' : 'Email Enviado!',
    emailSentDesc: language === 'en' 
      ? 'Check your inbox for the password reset link. If you don\'t see it, check your spam folder.'
      : (language === 'pt-pt'
        ? 'Verifique a sua caixa de entrada para o link de redefinição. Se não o vir, verifique a pasta de spam.'
        : 'Verifique sua caixa de entrada para o link de redefinição. Se não encontrar, verifique a pasta de spam.'),
    passwordUpdatedTitle: language === 'en' ? 'Password Updated!' : 'Senha Atualizada!',
    passwordUpdatedDesc: language === 'en' 
      ? 'Your password has been successfully updated. You can now sign in.'
      : (language === 'pt-pt'
        ? 'A sua senha foi atualizada com sucesso. Já pode fazer login.'
        : 'Sua senha foi atualizada com sucesso. Você já pode fazer login.'),
    error: language === 'en' ? 'Error' : 'Erro',
    passwordsDoNotMatch: language === 'en' ? 'Passwords do not match' : 'As senhas não coincidem',
    invalidEmail: language === 'en' ? 'Please enter a valid email' : 'Por favor, insira um email válido',
    tryAgain: language === 'en' ? 'An error occurred. Please try again.' : 'Ocorreu um erro. Tente novamente.',
    sendAnotherLink: language === 'en' ? 'Send another link' : 'Enviar outro link',
  };

  // Helper to get auth path
  const getAuthPath = () => {
    if (language === 'en') return '/en/auth';
    if (language === 'pt-pt') return '/pt-pt/auth';
    return '/auth';
  };

  // Check for recovery token in URL hash on mount
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      setMode('reset');
      // Supabase will automatically set the session from the hash
    }
    
    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: texts.error,
        description: texts.invalidEmail,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: texts.emailSentTitle,
        description: texts.emailSentDesc,
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: texts.error,
        description: error.message || texts.tryAgain,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: texts.error,
        description: texts.passwordsDoNotMatch,
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: texts.error,
        description: texts.minChars,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: texts.passwordUpdatedTitle,
        description: texts.passwordUpdatedDesc,
      });

      // Redirect to auth page after a short delay
      setTimeout(() => {
        navigate(getAuthPath());
      }, 2000);
    } catch (error: any) {
      console.error("Update password error:", error);
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
            {mode === 'request' ? texts.forgotPassword : texts.resetPassword}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'request' ? texts.enterEmail : texts.enterNewPassword}
          </p>
        </div>

        {mode === 'request' ? (
          emailSent ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{texts.emailSentTitle}</h2>
                <p className="text-muted-foreground">{texts.emailSentDesc}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full"
              >
                {texts.sendAnotherLink}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <Label htmlFor="email">{texts.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? texts.loading : texts.sendResetLink}
              </Button>
            </form>
          )
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="password">{texts.newPassword}</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={texts.minChars}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={password} language={language} />
            </div>

            <div>
              <Label htmlFor="confirmPassword">{texts.confirmNewPassword}</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder={texts.minChars}
                  className="pl-10 pr-10"
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

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? texts.loading : texts.updatePassword}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(getAuthPath())}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            {texts.backToLogin}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
