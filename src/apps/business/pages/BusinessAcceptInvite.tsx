import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface InviteData {
  id: string;
  email: string;
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

  useEffect(() => {
    if (token) {
      fetchInvite();
    }
  }, [token]);

  const fetchInvite = async () => {
    try {
      const { data, error } = await supabase
        .from('company_invites')
        .select(`
          id,
          email,
          status,
          expires_at,
          companies:company_id (
            id,
            name,
            logo_url
          )
        `)
        .eq('invite_token', token)
        .single();
      
      if (error) throw error;
      
      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        setError('Este convite expirou. Solicite um novo convite ao administrador.');
        return;
      }
      
      // Check if already accepted
      if (data.status === 'accepted') {
        setError('Este convite já foi aceito.');
        return;
      }
      
      // Transform data
      const companyData = Array.isArray(data.companies) ? data.companies[0] : data.companies;
      setInvite({
        id: data.id,
        email: data.email,
        status: data.status,
        expires_at: data.expires_at,
        company: companyData as { id: string; name: string; logo_url: string | null }
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
      
      // If not logged in, create account
      if (!user) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: invite.email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        
        if (authError) throw authError;
        if (!authData.user) throw new Error('Erro ao criar conta');
        
        userId = authData.user.id;
      }
      
      // Create company_user link
      const { error: linkError } = await supabase
        .from('company_users')
        .insert({
          company_id: invite.company.id,
          user_id: userId,
          role: 'collaborator',
          is_active: true,
          consent_given: true,
          consent_given_at: new Date().toISOString(),
          consent_text_version: '1.0',
          joined_at: new Date().toISOString(),
        });
      
      if (linkError) throw linkError;
      
      // Update invite status
      await supabase
        .from('company_invites')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          accepted_by: userId,
        })
        .eq('id', invite.id);
      
      toast.success('Convite aceito! Bem-vindo à equipe.');
      navigate('/my-journey');
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
            Você foi convidado para fazer parte da equipe
          </p>
        </div>

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

        {/* Consent Checkbox and Action */}
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
      </div>
    </div>
  );
}
