import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, CheckCircle, Loader2, Building2, Heart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { toast } from 'sonner';

const CONSENT_VERSION = '1.0';

export default function BusinessConsent() {
  const navigate = useNavigate();
  const { company, companyUser, refetch } = useBusinessAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [shareWithCompany, setShareWithCompany] = useState(true);

  const handleAcceptConsent = async () => {
    if (!acceptedTerms) {
      toast.error('Você precisa aceitar os termos para continuar');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado');
        return;
      }

      // Update company_user with consent
      const { error } = await supabase
        .from('company_users')
        .update({
          consent_given: true,
          consent_given_at: new Date().toISOString(),
          consent_text_version: CONSENT_VERSION,
          share_report_with_company: shareWithCompany,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating consent:', error);
        toast.error('Erro ao registrar consentimento');
        return;
      }

      // LGPD: Log consent action in company_audit_logs
      if (company?.id) {
        await supabase.from('company_audit_logs').insert({
          company_id: company.id,
          actor_id: user.id,
          action: 'collaborator_consent_granted',
          details: {
            consent_version: CONSENT_VERSION,
            share_report_with_company: shareWithCompany,
            accepted_at: new Date().toISOString(),
          },
        });
      }

      await refetch();
      toast.success('Consentimento registrado! Bem-vindo ao Nello Business.');
      navigate('/my-journey');
    } catch (error) {
      console.error('Consent error:', error);
      toast.error('Erro ao processar consentimento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Bem-vindo ao Nello Business
          </h1>
          {company && (
            <p className="text-muted-foreground mt-2">
              Você foi convidado por <span className="font-medium text-foreground">{company.name}</span>
            </p>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Termos de Consentimento
            </CardTitle>
            <CardDescription>
              Antes de continuar, é importante que você entenda como seus dados serão utilizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What we collect */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                O que você vai fazer
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Responder testes de autoconhecimento (Eneagrama, DISC, Temperamentos)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Receber seu relatório pessoal completo com insights e orientações</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Acessar seu Mapa da Essência personalizado</span>
                </li>
              </ul>
            </div>

            {/* Privacy guarantee */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Sua privacidade é garantida
              </h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Eye className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">O que VOCÊ vê</p>
                    <p className="text-sm text-muted-foreground">
                      Relatório completo com suas forças, pontos de atenção, orientações de desenvolvimento e Mapa da Essência
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <EyeOff className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">O que a EMPRESA vê</p>
                    <p className="text-sm text-muted-foreground">
                      Apenas dados agregados e anônimos da equipe. <strong>Nunca</strong> seu relatório individual ou respostas específicas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sharing consent for aggregated insights - LGPD compliant language */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="share-report"
                  checked={shareWithCompany}
                  onCheckedChange={(checked) => setShareWithCompany(checked === true)}
                  className="mt-1"
                />
                <div className="space-y-2">
                  <label 
                    htmlFor="share-report" 
                    className="font-medium text-sm cursor-pointer"
                  >
                    Autorizo o compartilhamento de insights agregados e anônimos
                  </label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ao marcar esta opção, você autoriza que <strong>apenas dados agregados e anônimos</strong> sejam 
                    utilizados para compor relatórios de equipe. Isso significa:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-3">
                    <li className="flex items-start gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Seu perfil individual <strong>nunca</strong> será exposto</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Insights são gerados apenas quando há mínimo de 3 participantes</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Resultados aparecem como tendências da equipe, sem identificação</span>
                    </li>
                  </ul>
                  <div className="pt-2 border-t border-primary/10 mt-2">
                    <p className="text-xs text-muted-foreground italic">
                      Se preferir não compartilhar, sua jornada continua normalmente — apenas não contribuirá 
                      para os insights agregados da empresa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accept terms */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="accept-terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                />
                <div className="space-y-1">
                  <label 
                    htmlFor="accept-terms" 
                    className="font-medium text-sm cursor-pointer"
                  >
                    Li e aceito os termos de consentimento
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Declaro que li e compreendi como meus dados serão utilizados e concordo em participar 
                    das avaliações de autoconhecimento promovidas pela empresa.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleAcceptConsent} 
            disabled={!acceptedTerms || isLoading}
            size="lg"
            className="w-full gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Aceitar e continuar
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Você pode revogar seu consentimento a qualquer momento nas configurações da sua conta
          </p>
        </div>

        {/* Company branding */}
        {company && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>Parceria com {company.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
