import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Heart, 
  Loader2, 
  Users, 
  Send,
  Check,
  Clock,
  Eye,
  AlertTriangle,
  UserPlus,
  Baby,
  UsersRound,
  Handshake
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CruzamentoViewer } from "./CruzamentoViewer";
import { useCoupleCodeAccess } from "@/hooks/useCoupleCodeAccess";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface CruzamentoCodigosProps {
  language: 'pt' | 'pt-pt' | 'en';
  hasSavedCodigo: boolean;
}

interface Crossing {
  id: string;
  relationship_type: string;
  invite_email: string | null;
  status: string;
  user_a_id: string;
  user_b_id: string | null;
  content: any;
  created_at: string;
  user_a_consent_at: string | null;
  user_b_consent_at: string | null;
  public_token: string;
  is_public_active: boolean;
  profiles?: { full_name: string | null };
}

const TRANSLATIONS = {
  pt: {
    title: "Cruzamento de Códigos",
    subtitle: "Compare seu perfil com pessoas importantes da sua vida",
    description: "Convide seu cônjuge, filho ou familiar para gerar um relatório bilateral que mostra pontos de harmonia, tensão e caminhos para crescerem juntos.",
    noCode: "Gere seu Código da Essência primeiro",
    noCodeDesc: "Para criar cruzamentos, você precisa ter gerado seu Código da Essência.",
    inviteTitle: "Convidar para Cruzamento",
    emailLabel: "Email da pessoa",
    emailPlaceholder: "email@exemplo.com",
    relationshipLabel: "Tipo de relacionamento",
    sendInvite: "Enviar Convite",
    sending: "Enviando...",
    inviteSuccess: "Convite enviado!",
    inviteError: "Erro ao enviar convite",
    myCrossings: "Meus Cruzamentos",
    noCrossings: "Nenhum cruzamento ainda",
    noCrossingsDesc: "Convide alguém para criar seu primeiro relatório bilateral.",
    status: {
      pending: "Aguardando aceite",
      accepted: "Aguardando geração",
      generated: "Relatório pronto",
      expired: "Expirado",
      declined: "Recusado"
    },
    relationships: {
      spouse: "Cônjuge / Parceiro(a)",
      parent_child: "Pai/Mãe e Filho(a)",
      siblings: "Irmãos",
      friends: "Amigos"
    },
    viewReport: "Ver Relatório",
    generateReport: "Gerar Relatório",
    waitingConsent: "Aguardando consentimento"
  },
  'pt-pt': {
    title: "Cruzamento de Códigos",
    subtitle: "Compare o teu perfil com pessoas importantes da tua vida",
    description: "Convida o teu cônjuge, filho ou familiar para gerar um relatório bilateral que mostra pontos de harmonia, tensão e caminhos para crescerem juntos.",
    noCode: "Gera o teu Código da Essência primeiro",
    noCodeDesc: "Para criar cruzamentos, precisas de ter gerado o teu Código da Essência.",
    inviteTitle: "Convidar para Cruzamento",
    emailLabel: "Email da pessoa",
    emailPlaceholder: "email@exemplo.com",
    relationshipLabel: "Tipo de relacionamento",
    sendInvite: "Enviar Convite",
    sending: "A enviar...",
    inviteSuccess: "Convite enviado!",
    inviteError: "Erro ao enviar convite",
    myCrossings: "Os Meus Cruzamentos",
    noCrossings: "Nenhum cruzamento ainda",
    noCrossingsDesc: "Convida alguém para criar o teu primeiro relatório bilateral.",
    status: {
      pending: "A aguardar aceite",
      accepted: "A aguardar geração",
      generated: "Relatório pronto",
      expired: "Expirado",
      declined: "Recusado"
    },
    relationships: {
      spouse: "Cônjuge / Parceiro(a)",
      parent_child: "Pai/Mãe e Filho(a)",
      siblings: "Irmãos",
      friends: "Amigos"
    },
    viewReport: "Ver Relatório",
    generateReport: "Gerar Relatório",
    waitingConsent: "A aguardar consentimento"
  },
  en: {
    title: "Code Crossings",
    subtitle: "Compare your profile with important people in your life",
    description: "Invite your spouse, child, or family member to generate a bilateral report showing points of harmony, tension, and paths for growing together.",
    noCode: "Generate your Essence Code first",
    noCodeDesc: "To create crossings, you need to have generated your Essence Code.",
    inviteTitle: "Invite for Crossing",
    emailLabel: "Person's email",
    emailPlaceholder: "email@example.com",
    relationshipLabel: "Relationship type",
    sendInvite: "Send Invite",
    sending: "Sending...",
    inviteSuccess: "Invite sent!",
    inviteError: "Error sending invite",
    myCrossings: "My Crossings",
    noCrossings: "No crossings yet",
    noCrossingsDesc: "Invite someone to create your first bilateral report.",
    status: {
      pending: "Waiting for acceptance",
      accepted: "Waiting for generation",
      generated: "Report ready",
      expired: "Expired",
      declined: "Declined"
    },
    relationships: {
      spouse: "Spouse / Partner",
      parent_child: "Parent and Child",
      siblings: "Siblings",
      friends: "Friends"
    },
    viewReport: "View Report",
    generateReport: "Generate Report",
    waitingConsent: "Waiting for consent"
  }
};

const RELATIONSHIP_ICONS = {
  spouse: Heart,
  parent_child: Baby,
  siblings: UsersRound,
  friends: Handshake
};

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-amber-500" },
  accepted: { icon: Check, color: "text-blue-500" },
  generated: { icon: Eye, color: "text-emerald-500" },
  expired: { icon: AlertTriangle, color: "text-muted-foreground" },
  declined: { icon: AlertTriangle, color: "text-red-500" }
};

export const CruzamentoCodigos = ({ language, hasSavedCodigo }: CruzamentoCodigosProps) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [relationshipType, setRelationshipType] = useState<string>("spouse");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [crossings, setCrossings] = useState<Crossing[]>([]);
  const [selectedCrossing, setSelectedCrossing] = useState<Crossing | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (user?.id) {
      loadCrossings();
    }
  }, [user?.id]);

  const loadCrossings = async () => {
    if (!user?.id) return;
    
    try {
      // Fetch crossings where user is either user_a or user_b
      const { data, error } = await supabase
        .from('codigo_cruzamentos')
        .select(`
          *,
          profiles:user_b_id(full_name),
          user_a_profile:user_a_id(full_name)
        `)
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading crossings:', error);
        throw error;
      }
      
      console.log('Crossings loaded:', data);
      setCrossings((data || []) as unknown as Crossing[]);
    } catch (err) {
      console.error('Error loading crossings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!email.trim()) return;
    
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('nello-invite-cruzamento', {
        body: { 
          email: email.trim().toLowerCase(),
          relationshipType,
          locale: language
        }
      });

      if (error) throw error;
      
      if (data?.success) {
        toast.success(t.inviteSuccess);
        setEmail("");
        loadCrossings();
      } else {
        throw new Error(data?.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Error sending invite:', err);
      toast.error(t.inviteError);
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateReport = async (crossingId: string) => {
    setIsGenerating(crossingId);
    try {
      const { data, error } = await supabase.functions.invoke('nello-codigo-cruzamento', {
        body: { 
          cruzamentoId: crossingId,
          locale: language
        }
      });

      if (error) throw error;
      
      if (data?.success) {
        toast.success(language === 'en' ? 'Report generated!' : 'Relatório gerado!');
        loadCrossings();
      } else {
        throw new Error(data?.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Error generating report:', err);
      toast.error(language === 'en' ? 'Error generating report' : 'Erro ao gerar relatório');
    } finally {
      setIsGenerating(null);
    }
  };

  if (!hasSavedCodigo) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{t.noCode}</h3>
        <p className="text-muted-foreground text-sm">{t.noCodeDesc}</p>
      </div>
    );
  }

  const { hasPurchased: hasCoupleCodePurchased, isLoading: purchaseLoading } = useCoupleCodeAccess();

  const handlePurchaseCouple = async () => {
    try {
      // Fixed: Use create-checkout function with correct parameters
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          productType: 'codigo_casal',
          language: language,
          currency: language === 'en' ? 'usd' : language === 'pt-pt' ? 'eur' : 'brl',
        }
      });
      
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      toast.error(language === 'en' ? 'Error starting checkout' : 'Erro ao iniciar checkout');
    }
  };

  if (selectedCrossing) {
    return (
      <ErrorBoundary fallbackTitle={language === "en" ? "Couldn't open the report" : "Não foi possível abrir o relatório"}>
        <CruzamentoViewer 
          crossing={{
            ...selectedCrossing,
            isPurchased: hasCoupleCodePurchased
          }} 
          language={language}
          onBack={() => setSelectedCrossing(null)}
          onPurchase={handlePurchaseCouple}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">{t.title}</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">{t.description}</p>
      </div>

      {/* Invite Form */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            {t.inviteTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t.emailLabel}</label>
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t.relationshipLabel}</label>
            <Select value={relationshipType} onValueChange={setRelationshipType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.relationships).map(([key, label]) => {
                  const Icon = RELATIONSHIP_ICONS[key as keyof typeof RELATIONSHIP_ICONS];
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSendInvite} 
            disabled={isSending || !email.trim()}
            className="w-full gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.sending}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t.sendInvite}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Crossings List */}
      <div>
        <h3 className="font-semibold mb-4">{t.myCrossings}</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : crossings.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <Users className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="font-medium">{t.noCrossings}</p>
              <p className="text-sm text-muted-foreground">{t.noCrossingsDesc}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {crossings.map((crossing) => {
              const RelIcon = RELATIONSHIP_ICONS[crossing.relationship_type as keyof typeof RELATIONSHIP_ICONS] || Heart;
              const StatusConfig = STATUS_CONFIG[crossing.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
              const StatusIcon = StatusConfig.icon;
              const isUserA = crossing.user_a_id === user?.id;
              const partnerName = crossing.profiles?.full_name || crossing.invite_email || 'Convidado';
              const canGenerate = crossing.status === 'accepted' && crossing.user_a_consent_at && crossing.user_b_consent_at;
              
              return (
                <Card key={crossing.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <RelIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{partnerName}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <StatusIcon className={`w-3 h-3 ${StatusConfig.color}`} />
                            <span className="text-muted-foreground">
                              {t.status[crossing.status as keyof typeof t.status] || crossing.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        {crossing.status === 'generated' ? (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedCrossing(crossing)}
                              className="gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              {t.viewReport}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleGenerateReport(crossing.id)}
                              disabled={isGenerating === crossing.id}
                              className="gap-1 text-muted-foreground hover:text-primary"
                              title={language === 'en' ? 'Regenerate with new prompt' : 'Regenerar com novo prompt'}
                            >
                              {isGenerating === crossing.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Users className="w-4 h-4" />
                              )}
                              {language === 'en' ? 'Regenerate' : 'Regenerar'}
                            </Button>
                          </div>
                        ) : canGenerate ? (
                          <Button 
                            size="sm"
                            onClick={() => handleGenerateReport(crossing.id)}
                            disabled={isGenerating === crossing.id}
                            className="gap-1"
                          >
                            {isGenerating === crossing.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Users className="w-4 h-4" />
                            )}
                            {t.generateReport}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">{t.waitingConsent}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
