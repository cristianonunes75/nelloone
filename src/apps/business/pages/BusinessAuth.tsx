import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Building2, Loader2, Eye, EyeOff, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { PasswordBreachWarning } from '@/components/PasswordBreachWarning';
import { usePasswordBreachCheck } from '@/hooks/usePasswordBreachCheck';

export default function BusinessAuth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [existingUserMode, setExistingUserMode] = useState(false);
  
  const defaultTab = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { isBreached, isChecking, breachCount, checkPassword, reset: resetBreachCheck } = usePasswordBreachCheck();
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form (new user)
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Check password breach when password changes (only in register mode)
  useEffect(() => {
    if (activeTab === 'register' && registerPassword) {
      checkPassword(registerPassword);
    } else {
      resetBreachCheck();
    }
  }, [registerPassword, activeTab, checkPassword, resetBreachCheck]);

  // Check if already logged in and has company
  useEffect(() => {
    if (authLoading) return;
    
    const checkCompanyAssociation = async () => {
      if (user) {
        const { data: companyUser } = await supabase
          .from('company_users')
          .select('company_id, role')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (companyUser) {
          if (companyUser.role === 'collaborator') {
            navigate('/my-journey');
          } else {
            navigate('/dashboard');
          }
        } else {
          // User is logged in but has no company - show create company flow
          setExistingUserMode(true);
        }
      }
    };
    checkCompanyAssociation();
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) throw error;
      
      // Check company association
      const { data: companyUser } = await supabase
        .from('company_users')
        .select('company_id, role')
        .eq('user_id', data.user.id)
        .maybeSingle();
      
      if (companyUser) {
        toast.success('Login realizado com sucesso!');
        if (companyUser.role === 'collaborator') {
          navigate('/my-journey');
        } else {
          navigate('/dashboard');
        }
      } else {
        // User exists but no company - switch to create company mode
        setExistingUserMode(true);
        toast.info('Você já tem uma conta Nello! Crie sua empresa para continuar.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  // Create company for existing Nello One user
  const handleCreateCompanyForExistingUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        throw new Error('Sessão inválida. Faça login novamente.');
      }

      const { data, error } = await supabase.functions.invoke('business-create-company', {
        body: {
          companyName,
          billingEmail: user.email,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Erro ao criar empresa');

      toast.success('Empresa criada com sucesso! Bem-vindo ao Nello Business.');
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Company creation error:', error);
      toast.error(error.message || 'Erro ao criar empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: registerName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar conta');

      // Ensure we have an access token (auto-confirm is enabled in backend)
      const accessToken = authData.session?.access_token;
      if (!accessToken) {
        throw new Error('Não foi possível iniciar sessão após cadastro. Tente entrar com seu email e senha.');
      }

      // 2. Create company via backend function (avoids RLS issues)
      const { data, error } = await supabase.functions.invoke('business-create-company', {
        body: {
          companyName,
          billingEmail: registerEmail,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Erro ao criar empresa');

      toast.success('Conta criada com sucesso! Bem-vindo ao Nello Business.');
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Existing Nello One user - simplified company creation
  if (existingUserMode && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">Nello Business</span>
          </Link>
          
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Olá, {profile?.full_name || 'Usuário'}!</CardTitle>
              <CardDescription>
                Você já tem uma conta Nello One. Crie sua empresa para começar a usar o Nello Business.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Conta conectada</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleCreateCompanyForExistingUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da sua empresa</Label>
                  <Input
                    id="company-name"
                    type="text"
                    placeholder="Sua Empresa Ltda"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Criar empresa
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                Seus dados do Nello One serão aproveitados automaticamente
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold">Nello Business</span>
        </Link>
        
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Bem-vindo de volta</CardTitle>
                <CardDescription>
                  Use sua conta Nello para acessar o painel empresarial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Já tem conta no Nello One? Use a mesma senha!
                  </p>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="register">
              <CardHeader>
                <CardTitle>Criar conta empresarial</CardTitle>
                <CardDescription>
                  Cadastre sua empresa e comece a usar o Nello Business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Seu nome</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name-new">Nome da empresa</Label>
                    <Input
                      id="company-name-new"
                      type="text"
                      placeholder="Sua Empresa Ltda"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email corporativo</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@empresa.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        minLength={8}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <PasswordBreachWarning 
                      isBreached={isBreached} 
                      isChecking={isChecking} 
                      breachCount={breachCount}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || isBreached === true}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar conta'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Ao criar uma conta, você concorda com nossos{' '}
                    <Link to="/terms" className="underline">Termos de Uso</Link>
                    {' '}e{' '}
                    <Link to="/privacy" className="underline">Política de Privacidade</Link>
                  </p>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
