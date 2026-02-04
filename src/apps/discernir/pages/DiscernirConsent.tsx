import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Shield, 
  Users, 
  Eye,
  CheckCircle2,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CONSENT_VERSION = '1.0';

const CONSENT_TEXTS = {
  individual: `Eu compreendo que o DISCERNIR é apenas um apoio para a conversa pastoral. 
Não é avaliação, diagnóstico ou julgamento. 
Posso revogar este consentimento a qualquer momento, sem precisar justificar.`,
  
  conjugal: `Eu autorizo que meu cônjuge e eu participemos juntos do Cruzamento Essencial de Proteção do Casal.
Este cruzamento não avalia compatibilidade, apenas oferece pontos para conversa sobre ritmo, família e decisões.
Posso revogar este consentimento a qualquer momento.`,
  
  priest_access: `Eu autorizo que o padre responsável pela pastoral tenha acesso ao meu Apoio de Escuta.
Este acesso é apenas para apoiar a conversa pastoral.
Serei notificado sempre que o padre acessar.
Posso revogar este consentimento a qualquer momento.`,
};

export function DiscernirConsent() {
  const { user } = useAuth();
  const { 
    couple,
    hasIndividualConsent, 
    hasConjugalConsent, 
    hasPriestAccessConsent,
    consents,
    refetchData
  } = useDiscernirAuth();

  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState<Record<string, boolean>>({});

  const grantConsent = async (consentType: string) => {
    if (!user || !acceptedTerms[consentType]) return;
    
    setIsLoading(consentType);
    try {
      const { error } = await supabase
        .from('discernir_consents')
        .insert({
          user_id: user.id,
          couple_id: couple?.id,
          consent_type: consentType,
          consent_text: CONSENT_TEXTS[consentType as keyof typeof CONSENT_TEXTS],
          consent_version: CONSENT_VERSION,
        });

      if (error) throw error;
      
      toast.success('Consentimento registrado');
      refetchData();
    } catch (error: any) {
      toast.error('Erro ao registrar consentimento', { description: error.message });
    } finally {
      setIsLoading(null);
    }
  };

  const revokeConsent = async (consentType: string) => {
    if (!user) return;
    
    const consent = consents.find(c => c.consent_type === consentType);
    if (!consent) return;

    setIsLoading(consentType);
    try {
      const { error } = await supabase
        .from('discernir_consents')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
        })
        .eq('id', consent.id);

      if (error) throw error;
      
      toast.success('Consentimento revogado');
      refetchData();
    } catch (error: any) {
      toast.error('Erro ao revogar consentimento', { description: error.message });
    } finally {
      setIsLoading(null);
    }
  };

  const ConsentCard = ({ 
    type, 
    title, 
    description, 
    icon: Icon,
    hasConsent,
    disabled = false,
  }: {
    type: string;
    title: string;
    description: string;
    icon: any;
    hasConsent: boolean;
    disabled?: boolean;
  }) => (
    <Card className={`border-amber-200/50 ${disabled ? 'opacity-50' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="h-5 w-5 text-amber-700" />
            {title}
          </CardTitle>
          {hasConsent && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Ativo
            </Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasConsent ? (
          <>
            <div className="p-4 bg-amber-50/50 rounded-lg text-sm text-amber-800 border border-amber-200/50">
              {CONSENT_TEXTS[type as keyof typeof CONSENT_TEXTS]}
            </div>
            <div className="flex items-start gap-2">
              <Checkbox 
                id={`accept-${type}`}
                checked={acceptedTerms[type] || false}
                onCheckedChange={(checked) => 
                  setAcceptedTerms(prev => ({ ...prev, [type]: !!checked }))
                }
                disabled={disabled || isLoading === type}
              />
              <Label htmlFor={`accept-${type}`} className="text-sm text-muted-foreground">
                Li e compreendo o texto acima
              </Label>
            </div>
            <Button 
              onClick={() => grantConsent(type)}
              disabled={disabled || !acceptedTerms[type] || isLoading === type}
              className="w-full bg-amber-700 hover:bg-amber-800"
            >
              {isLoading === type && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Dar consentimento
            </Button>
          </>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full text-amber-700 border-amber-200"
                disabled={isLoading === type}
              >
                {isLoading === type && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Revogar consentimento
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Revogar consentimento?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Você pode revogar a qualquer momento, sem precisar justificar. 
                  O padre não terá mais acesso a este conteúdo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => revokeConsent(type)}
                  className="bg-amber-700 hover:bg-amber-800"
                >
                  Confirmar revogação
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-semibold text-amber-900">
          Consentimento
        </h1>
        <p className="text-amber-800/70">
          Você tem total controle sobre seus dados e pode revogar a qualquer momento
        </p>
      </div>

      {/* Warning Box */}
      <Card className="border-amber-300 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Seus dados estão protegidos</p>
              <p className="text-amber-700/80">
                O DISCERNIR não armazena dados de forma permanente. 
                Cada acesso é registrado e você será notificado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <ConsentCard
          type="individual"
          title="Consentimento Individual"
          description="Permite gerar seu Apoio de Escuta pessoal"
          icon={Heart}
          hasConsent={hasIndividualConsent}
        />

        <ConsentCard
          type="priest_access"
          title="Acesso Pastoral"
          description="Permite que o padre veja seu Apoio de Escuta"
          icon={Eye}
          hasConsent={hasPriestAccessConsent}
          disabled={!hasIndividualConsent}
        />

        <ConsentCard
          type="conjugal"
          title="Consentimento Conjugal"
          description="Permite o Cruzamento Essencial de Proteção do Casal"
          icon={Users}
          hasConsent={hasConjugalConsent}
          disabled={!couple || !hasIndividualConsent}
        />
      </div>
    </div>
  );
}
