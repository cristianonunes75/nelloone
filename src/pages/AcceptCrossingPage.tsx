import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Heart, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  Shield,
  FileText,
  Baby,
  UsersRound,
  Handshake
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface CrossingData {
  id: string;
  relationship_type: string;
  user_a_id: string;
  user_b_id: string | null;
  user_a_consent_at: string | null;
  user_b_consent_at: string | null;
  invite_email: string | null;
  status: string;
  invite_accepted_at: string | null;
  inviter_name?: string;
}

const TRANSLATIONS = {
  pt: {
    title: "Convite para Cruzamento de Perfis",
    loading: "Carregando convite...",
    invalidToken: "Convite inválido ou expirado",
    invalidTokenDesc: "Este link de convite não é válido. Verifique se copiou o link corretamente ou solicite um novo convite.",
    alreadyAccepted: "Convite já aceito",
    alreadyAcceptedDesc: "Você já aceitou este convite anteriormente. Acesse seu painel para ver o cruzamento.",
    goToDashboard: "Ir para o Painel",
    loginRequired: "Faça login para aceitar",
    loginRequiredDesc: "Para aceitar este convite, você precisa estar logado na sua conta.",
    loginButton: "Fazer Login",
    inviteFrom: "Convite de",
    whatIs: {
      title: "O que é o Cruzamento de Códigos?",
      description: "É um relatório bilateral que combina os Códigos da Essência de duas pessoas para revelar pontos de harmonia, possíveis tensões e caminhos para fortalecer o relacionamento."
    },
    important: {
      title: "Informações importantes",
      items: [
        "Este não é um serviço de terapia ou aconselhamento profissional",
        "Os dados dos seus testes serão cruzados com os da pessoa que convidou",
        "O relatório será visível para ambas as partes",
        "Você pode revogar seu consentimento a qualquer momento"
      ]
    },
    consent: {
      title: "Consentimento",
      text: "Ao aceitar, você autoriza o cruzamento dos dados do seu Código da Essência com os de"
    },
    acceptButton: "Aceitar e autorizar cruzamento",
    declineButton: "Recusar convite",
    accepting: "Processando...",
    success: "Convite aceito com sucesso!",
    successDesc: "O cruzamento foi autorizado. Agora o relatório pode ser gerado.",
    error: "Erro ao aceitar convite",
    declined: "Convite recusado",
    declinedDesc: "O convite foi recusado. A pessoa será notificada.",
    relationships: {
      spouse: "Cônjuge ou Parceiro(a)",
      parent_child: "Pai/Mãe e Filho(a)",
      siblings: "Irmãos",
      friends: "Amigos"
    },
    emailMismatch: "Este convite foi enviado para outro email",
    emailMismatchDesc: "O email do convite não corresponde à sua conta. Por favor, use a conta correta."
  },
  'pt-pt': {
    title: "Convite para Cruzamento de Perfis",
    loading: "A carregar convite...",
    invalidToken: "Convite inválido ou expirado",
    invalidTokenDesc: "Este link de convite não é válido. Verifique se copiou o link corretamente ou solicite um novo convite.",
    alreadyAccepted: "Convite já aceite",
    alreadyAcceptedDesc: "Já aceitaste este convite anteriormente. Acede ao teu painel para ver o cruzamento.",
    goToDashboard: "Ir para o Painel",
    loginRequired: "Inicia sessão para aceitar",
    loginRequiredDesc: "Para aceitar este convite, precisas de estar autenticado na tua conta.",
    loginButton: "Iniciar Sessão",
    inviteFrom: "Convite de",
    whatIs: {
      title: "O que é o Cruzamento de Códigos?",
      description: "É um relatório bilateral que combina os Códigos da Essência de duas pessoas para revelar pontos de harmonia, possíveis tensões e caminhos para fortalecer o relacionamento."
    },
    important: {
      title: "Informações importantes",
      items: [
        "Este não é um serviço de terapia ou aconselhamento profissional",
        "Os dados dos teus testes serão cruzados com os da pessoa que convidou",
        "O relatório será visível para ambas as partes",
        "Podes revogar o teu consentimento a qualquer momento"
      ]
    },
    consent: {
      title: "Consentimento",
      text: "Ao aceitar, autorizas o cruzamento dos dados do teu Código da Essência com os de"
    },
    acceptButton: "Aceitar e autorizar cruzamento",
    declineButton: "Recusar convite",
    accepting: "A processar...",
    success: "Convite aceite com sucesso!",
    successDesc: "O cruzamento foi autorizado. Agora o relatório pode ser gerado.",
    error: "Erro ao aceitar convite",
    declined: "Convite recusado",
    declinedDesc: "O convite foi recusado. A pessoa será notificada.",
    relationships: {
      spouse: "Cônjuge ou Parceiro(a)",
      parent_child: "Pai/Mãe e Filho(a)",
      siblings: "Irmãos",
      friends: "Amigos"
    },
    emailMismatch: "Este convite foi enviado para outro email",
    emailMismatchDesc: "O email do convite não corresponde à tua conta. Por favor, usa a conta correta."
  },
  en: {
    title: "Profile Crossing Invitation",
    loading: "Loading invitation...",
    invalidToken: "Invalid or expired invitation",
    invalidTokenDesc: "This invitation link is not valid. Make sure you copied the link correctly or request a new invitation.",
    alreadyAccepted: "Invitation already accepted",
    alreadyAcceptedDesc: "You have already accepted this invitation. Go to your dashboard to view the crossing.",
    goToDashboard: "Go to Dashboard",
    loginRequired: "Login to accept",
    loginRequiredDesc: "To accept this invitation, you need to be logged into your account.",
    loginButton: "Login",
    inviteFrom: "Invitation from",
    whatIs: {
      title: "What is a Code Crossing?",
      description: "It's a bilateral report that combines the Essence Codes of two people to reveal points of harmony, potential tensions, and paths to strengthen the relationship."
    },
    important: {
      title: "Important information",
      items: [
        "This is not a therapy or professional counseling service",
        "Your test data will be crossed with the inviting person's data",
        "The report will be visible to both parties",
        "You can revoke your consent at any time"
      ]
    },
    consent: {
      title: "Consent",
      text: "By accepting, you authorize the crossing of your Essence Code data with"
    },
    acceptButton: "Accept and authorize crossing",
    declineButton: "Decline invitation",
    accepting: "Processing...",
    success: "Invitation accepted successfully!",
    successDesc: "The crossing has been authorized. The report can now be generated.",
    error: "Error accepting invitation",
    declined: "Invitation declined",
    declinedDesc: "The invitation was declined. The person will be notified.",
    relationships: {
      spouse: "Spouse or Partner",
      parent_child: "Parent and Child",
      siblings: "Siblings",
      friends: "Friends"
    },
    emailMismatch: "This invitation was sent to another email",
    emailMismatchDesc: "The invitation email doesn't match your account. Please use the correct account."
  }
};

const RELATIONSHIP_ICONS = {
  spouse: Heart,
  parent_child: Baby,
  siblings: UsersRound,
  friends: Handshake
};

export default function AcceptCrossingPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();
  
  const [crossing, setCrossing] = useState<CrossingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [declined, setDeclined] = useState(false);

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.pt;

  useEffect(() => {
    if (token) {
      loadCrossing();
    }
  }, [token]);

  const loadCrossing = async () => {
    if (!token) {
      setError("invalid_token");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('codigo_cruzamentos')
        .select(`
          id,
          relationship_type,
          user_a_id,
          user_b_id,
          user_a_consent_at,
          user_b_consent_at,
          invite_email,
          status,
          invite_accepted_at
        `)
        .eq('invite_token', token)
        .single();

      if (fetchError || !data) {
        setError("invalid_token");
        setIsLoading(false);
        return;
      }

      // Get inviter name
      const { data: inviterProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user_a_id)
        .single();

      setCrossing({
        ...data,
        inviter_name: inviterProfile?.full_name || 'Alguém'
      });
    } catch (err) {
      console.error('Error loading crossing:', err);
      setError("invalid_token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!crossing || !user) return;

    // Check email match
    const userEmail = user.email?.toLowerCase();
    const inviteEmail = crossing.invite_email?.toLowerCase();
    
    if (inviteEmail && userEmail && inviteEmail !== userEmail) {
      toast.error(t.emailMismatch);
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error: acceptError } = await supabase.functions.invoke('nello-accept-cruzamento', {
        body: { invite_token: token }
      });

      if (acceptError) throw acceptError;

      if (data?.success) {
        setSuccess(true);
        toast.success(t.success);
      } else {
        throw new Error(data?.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Error accepting invite:', err);
      toast.error(t.error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!crossing) return;

    setIsProcessing(true);
    try {
      const { error: updateError } = await supabase
        .from('codigo_cruzamentos')
        .update({ status: 'declined' })
        .eq('id', crossing.id);

      if (updateError) throw updateError;

      setDeclined(true);
      toast.info(t.declined);
    } catch (err: any) {
      console.error('Error declining invite:', err);
      toast.error(t.error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = () => {
    // Redirect to auth with return URL
    const returnUrl = encodeURIComponent(window.location.pathname);
    navigate(`/auth?redirect=${returnUrl}`);
  };

  const handleGoToDashboard = () => {
    const dashboardPath = language === 'en' ? '/en/cliente/codigo-essencia' : 
                          language === 'pt-pt' ? '/pt-pt/cliente/codigo-essencia' : 
                          '/cliente/codigo-essencia';
    navigate(dashboardPath);
  };

  // Loading state
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (error === "invalid_token" || !crossing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t.invalidToken}</h2>
            <p className="text-muted-foreground text-sm">{t.invalidTokenDesc}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already accepted
  if (crossing.user_b_consent_at || crossing.invite_accepted_at) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t.alreadyAccepted}</h2>
            <p className="text-muted-foreground text-sm mb-6">{t.alreadyAcceptedDesc}</p>
            <Button onClick={handleGoToDashboard}>{t.goToDashboard}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Login required
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t.loginRequired}</h2>
            <p className="text-muted-foreground text-sm mb-6">{t.loginRequiredDesc}</p>
            <Button onClick={handleLogin} className="gap-2">
              {t.loginButton}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t.success}</h2>
            <p className="text-muted-foreground text-sm mb-6">{t.successDesc}</p>
            <Button onClick={handleGoToDashboard} className="gap-2">
              {t.goToDashboard}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Declined state
  if (declined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t.declined}</h2>
            <p className="text-muted-foreground text-sm">{t.declinedDesc}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main acceptance UI
  const RelIcon = RELATIONSHIP_ICONS[crossing.relationship_type as keyof typeof RELATIONSHIP_ICONS] || Heart;
  const relationshipLabel = t.relationships[crossing.relationship_type as keyof typeof t.relationships] || crossing.relationship_type;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RelIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">{t.title}</CardTitle>
          <CardDescription>
            {t.inviteFrom} <span className="font-semibold text-primary">{crossing.inviter_name}</span>
          </CardDescription>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm mt-2">
            <RelIcon className="w-4 h-4" />
            {relationshipLabel}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* What is it */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{t.whatIs.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t.whatIs.description}</p>
          </div>

          {/* Important info */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-amber-700 dark:text-amber-400">{t.important.title}</h3>
            </div>
            <ul className="space-y-2">
              {t.important.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-amber-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Consent */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{t.consent.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.consent.text} <span className="font-semibold">{crossing.inviter_name}</span>.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleAccept}
              disabled={isProcessing}
              className="w-full gap-2 h-12 bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.accepting}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {t.acceptButton}
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost"
              onClick={handleDecline}
              disabled={isProcessing}
              className="w-full text-muted-foreground hover:text-red-500"
            >
              {t.declineButton}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
