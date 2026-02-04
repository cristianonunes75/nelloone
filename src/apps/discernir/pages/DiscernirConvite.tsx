import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Church, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Heart,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface InviteData {
  id: string;
  parish_id: string;
  spouse_a_email: string;
  spouse_b_email: string;
  spouse_a_name: string | null;
  spouse_b_name: string | null;
  status: string;
  expires_at: string;
  parish?: {
    name: string;
    city: string | null;
  };
}

export function DiscernirConvite() {
  const { token } = useParams<{ token: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvite = async () => {
      if (!token) {
        setError('Convite inválido');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('discernir_couple_invites')
          .select(`
            *,
            parish:discernir_parishes(name, city)
          `)
          .eq('invite_token', token)
          .maybeSingle();

        if (fetchError) throw fetchError;
        
        if (!data) {
          setError('Convite não encontrado');
        } else if (data.status !== 'pending') {
          setError('Este convite já foi utilizado ou expirou');
        } else if (new Date(data.expires_at) < new Date()) {
          setError('Este convite expirou');
        } else {
          setInvite(data);
        }
      } catch (err: any) {
        setError('Erro ao carregar convite');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvite();
  }, [token]);

  const acceptInvite = async () => {
    if (!user || !invite) return;

    setIsAccepting(true);
    try {
      // Check if user email matches one of the spouses
      const userEmail = user.email?.toLowerCase();
      const isSpouseA = userEmail === invite.spouse_a_email.toLowerCase();
      const isSpouseB = userEmail === invite.spouse_b_email.toLowerCase();

      if (!isSpouseA && !isSpouseB) {
        toast.error('Email não corresponde', {
          description: 'Seu email não corresponde a nenhum dos cônjuges convidados.'
        });
        return;
      }

      // Check if couple already exists
      const { data: existingCouple } = await supabase
        .from('discernir_couples')
        .select('*')
        .eq('invite_id', invite.id)
        .maybeSingle();

      if (existingCouple) {
        // Update existing couple with this spouse
        const updateField = isSpouseA ? 'spouse_a_user_id' : 'spouse_b_user_id';
        const { error: updateError } = await supabase
          .from('discernir_couples')
          .update({ [updateField]: user.id })
          .eq('id', existingCouple.id);

        if (updateError) throw updateError;

        // Check if both spouses are now linked
        const otherField = isSpouseA ? 'spouse_b_user_id' : 'spouse_a_user_id';
        if (existingCouple[otherField]) {
          // Mark invite as fully accepted
          await supabase
            .from('discernir_couple_invites')
            .update({ 
              status: 'accepted',
              accepted_at: new Date().toISOString()
            })
            .eq('id', invite.id);
        }
      } else {
        // Create new couple
        const coupleData: any = {
          parish_id: invite.parish_id,
          invite_id: invite.id,
          couple_name: `${invite.spouse_a_name || ''} & ${invite.spouse_b_name || ''}`.trim() || null,
        };
        
        if (isSpouseA) {
          coupleData.spouse_a_user_id = user.id;
        } else {
          coupleData.spouse_b_user_id = user.id;
        }

        const { error: createError } = await supabase
          .from('discernir_couples')
          .insert(coupleData);

        if (createError) throw createError;
      }

      toast.success('Convite aceito!', {
        description: 'Você foi vinculado ao DISCERNIR.'
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Erro ao aceitar convite', { description: err.message });
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-amber-200/50">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              {error}
            </h2>
            <Link to="/">
              <Button variant="outline" className="mt-4">
                Voltar ao início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-amber-200/50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Church className="h-8 w-8 text-amber-700" />
            <span className="font-serif text-2xl font-semibold text-amber-900">
              DISCERNIR
            </span>
          </div>
          <CardTitle className="text-amber-900">
            Convite para Pastoral Familiar
          </CardTitle>
          <CardDescription>
            {invite?.parish?.name}
            {invite?.parish?.city && ` • ${invite.parish.city}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-200/30 text-center">
            <Heart className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <p className="text-amber-800">
              Vocês foram convidados a participar da experiência DISCERNIR
            </p>
            <p className="text-sm text-amber-700/70 mt-2">
              {invite?.spouse_a_name || invite?.spouse_a_email} & {invite?.spouse_b_name || invite?.spouse_b_email}
            </p>
          </div>

          {!user ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-sm text-amber-700/80 bg-amber-50/30 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>Para aceitar o convite, você precisa criar uma conta ou fazer login.</p>
              </div>
              <Link to={`/auth?redirect=/convite/${token}`}>
                <Button className="w-full bg-amber-700 hover:bg-amber-800">
                  Entrar ou criar conta
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-sm text-amber-700/80">
                Você está logado como <strong>{user.email}</strong>
              </div>
              <Button 
                onClick={acceptInvite}
                disabled={isAccepting}
                className="w-full bg-amber-700 hover:bg-amber-800"
              >
                {isAccepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Aceitar convite
              </Button>
            </div>
          )}

          <p className="text-xs text-center text-amber-700/60">
            "Isso não é avaliação nem diagnóstico. É apenas um apoio para a conversa pastoral."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
