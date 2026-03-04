import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, Loader2, CheckCircle, AlertCircle, Shield, Crown, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface InviteData {
  id: string;
  email: string;
  role: 'collaborator' | 'company_admin';
  company: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  status: string;
  expires_at: string;
}

export default function BusinessAcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  
  // Check if logged-in user email differs from invite email
  const isWrongAccount = user && currentUserEmail && invite && 
    currentUserEmail.toLowerCase() !== invite.email.toLowerCase();

  useEffect(() => {
    const fetchCurrentUserEmail = async () => {
      if (user) {
        const { data } = await supabase.auth.getUser();
        setCurrentUserEmail(data.user?.email || null);
      }
    };
    fetchCurrentUserEmail();
  }, [user]);

  useEffect(() => {
    if (token) {
      fetchInvite();
    }
  }, [token]);

  const fetchInvite = async () => {
    try {
      // Use SECURITY DEFINER function to fetch invite by token (RLS protected)
      const { data, error } = await supabase
        .rpc('get_company_invite_by_token', { _token: token })
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) {
        setError('Convite não encontrado, expirado ou já aceito.');
        return;
      }
      
      // Map RPC result to expected InviteData structure
      setInvite({
        id: data.id,
        email: data.email,
        role: data.role as 'collaborator' | 'company_admin',
        status: data.status,
        expires_at: data.expires_at,
        company: {
          id: data.company_id,
          name: data.company_name,
          logo_url: data.company_logo_url
        }
      });
    } catch (err) {
      console.error('Error fetching invite:', err);
      setError('Convite não encontrado ou inválido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!invite || !consentGiven) return;
    
    setIsAccepting(true);
    
    try {
      let userId = user?.id;
      
      // If logged in, verify that the logged-in user's email matches the invite email
      if (user) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser?.email?.toLowerCase() !== invite.email.toLowerCase()) {
          toast.error(`Este convite é para ${invite.email}. Faça logout e acesse com a conta correta, ou crie uma nova conta.`);
          setIsAccepting(false);
          return;
        }
      }
      
      // If not logged in, try to create account or sign in if account exists
      if (!user) {
        // First try signUp
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: invite.email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        
        if (authError) {
          // If user already exists, try to sign in instead
          if (authError.message?.includes('already registered') || authError.message?.includes('already exists') || authError.status === 422) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: invite.email,
              password,
            });
            
            if (signInError) {
              toast.error('Conta já existe. Verifique a senha ou faça login primeiro.');
              setIsAccepting(false);
              return;
            }
            
            userId = signInData.user?.id;
          } else {
            throw authError;
          }
        } else {
          if (!authData.user) throw new Error('Erro ao criar conta');
          userId = authData.user.id;
          
          // Check if the user was auto-confirmed or needs confirmation
          // If identities is empty, user already existed (fake signup response)
          if (!authData.user.identities?.length) {
            // User already exists - try sign in
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: invite.email,
              password,
            });
            
            if (signInError) {
              toast.error('Conta já existe para este email. Faça login primeiro e depois acesse o link do convite.');
              setIsAccepting(false);
              return;
            }
            
            userId = signInData.user?.id;
          }
        }
      }
      
      // Create or update company_user link with the invited role
      const isAdmin = invite.role === 'company_admin';
      
      // Check if user is already linked to this company
      const { data: existingLink } = await supabase
        .from('company_users')
        .select('id')
        .eq('company_id', invite.company.id)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existingLink) {
        // Update existing link
        const { error: updateError } = await supabase
          .from('company_users')
          .update({
            role: invite.role,
            is_active: true,
            consent_given: true,
            consent_given_at: new Date().toISOString(),
            consent_text_version: '1.0',
            joined_at: new Date().toISOString(),
            onboarding_completed: isAdmin,
          })
          .eq('id', existingLink.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new link
        const { error: linkError } = await supabase
          .from('company_users')
          .insert({
            company_id: invite.company.id,
            user_id: userId,
            role: invite.role,
            is_active: true,
            consent_given: true,
            consent_given_at: new Date().toISOString(),
            consent_text_version: '1.0',
            joined_at: new Date().toISOString(),
            onboarding_completed: isAdmin,
          });
        
        if (linkError) throw linkError;
      }
      
      // Update invite status using SECURITY DEFINER function
      const { data: acceptResult, error: acceptError } = await supabase
        .rpc('accept_company_invite_by_token', { 
          _token: token!, 
          _user_id: userId! 
        });
      
      if (acceptError) throw acceptError;
      const result = acceptResult as { success: boolean; error?: string } | null;
      if (!result?.success) throw new Error(result?.error || 'Failed to accept invite');
      
      toast.success('Convite aceito! Bem-vindo à equipe.');
      
      // Redirect based on role
      if (invite.role === 'company_admin') {
        navigate('/dashboard');
      } else {
        navigate('/my-journey');
      }
    } catch (err: any) {
      console.error('Error accepting invite:', err);
      toast.error(err.message || 'Erro ao aceitar convite');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Ops!</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link to="/">
              <Button>Voltar ao início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invite) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Company Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            {invite.company.logo_url ? (
              <img src={invite.company.logo_url} alt="" className="w-10 h-10 object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold">{invite.company.name}</h1>
          <p className="text-muted-foreground">
            {invite.role === 'company_admin' 
              ? 'Você foi convidado como Sócio/Administrador'
              : 'Você foi convidado para fazer parte da equipe'
            }
          </p>
          {invite.role === 'company_admin' && (
            <Badge className="mt-2 bg-amber-100 text-amber-700 border-amber-200">
              <Crown className="w-3 h-3 mr-1" />
              Acesso Administrativo
            </Badge>
          )}
        </div>

        {/* Wrong Account Warning Card */}
        {isWrongAccount && (
          <Card className="border-orange-300 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-orange-800">Conta diferente detectada</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Você está logado como <strong>{currentUserEmail}</strong>, mas este convite é para <strong>{invite.email}</strong>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.reload();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair e criar conta para {invite.email.split('@')[0]}...
                    </Button>
                  </div>
                  <p className="text-xs text-orange-600 mt-3">
                    💡 Após sair, você poderá criar uma conta com o email do convite ou fazer login se já tiver uma.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Info Card */}
        {invite.role === 'company_admin' && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-700">Como Sócio/Admin você poderá:</p>
                  <ul className="mt-2 space-y-1 text-sm text-amber-600">
                    <li>• Gerenciar toda a equipe e convites</li>
                    <li>• Ver relatórios agregados da empresa</li>
                    <li>• Convidar novos colaboradores e admins</li>
                    <li>• Gerenciar configurações da empresa</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Only show consent and registration if correct account or not logged in */}
        {!isWrongAccount && (
          <>
            {/* Consent Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Sua privacidade é prioridade
                </CardTitle>
                <CardDescription>
                  Antes de continuar, entenda como seus dados serão utilizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-700">Você terá acesso completo</p>
                      <p className="text-green-600">
                        Seu relatório pessoal com forças, padrões e orientações de desenvolvimento
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-700">A empresa verá apenas dados agregados</p>
                      <p className="text-blue-600">
                        Tendências gerais da equipe, sem identificação individual
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Importante</p>
                      <p className="text-muted-foreground">
                        Este não é um teste psicológico ou diagnóstico clínico. 
                        É uma ferramenta de autoconhecimento para desenvolvimento pessoal e profissional.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Form (if not logged in) */}
            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle>Criar sua conta</CardTitle>
                  <CardDescription>
                    Complete seus dados para aceitar o convite
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Seu nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={invite.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      minLength={8}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Consent Checkbox and Action - Only show if correct account */}
        {!isWrongAccount && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consentGiven}
                  onCheckedChange={(checked) => setConsentGiven(checked === true)}
                />
                <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                  Li e compreendi as informações acima. Aceito participar da jornada de autoconhecimento 
                  e autorizo o uso dos meus dados de forma agregada e anônima para relatórios da equipe.
                </label>
              </div>
              
              <Button
                onClick={handleAcceptInvite}
                disabled={!consentGiven || isAccepting || (!user && (!name || !password))}
                className="w-full"
              >
                {isAccepting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Aceitar convite e começar'
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
