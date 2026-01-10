import { useState, useEffect } from 'react';
import { 
  Building2, 
  CreditCard, 
  Bell,
  Users,
  Save,
  Loader2,
  ExternalLink,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BusinessLayout } from '../components/BusinessLayout';
import { BusinessPricingCard } from '../components/BusinessPricingCard';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { useBusinessSubscription, BUSINESS_TIERS } from '../hooks/useBusinessSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function BusinessSettings() {
  const { company, refetch } = useBusinessAuth();
  const { 
    subscription, 
    isLoading: isSubLoading, 
    isCheckingOut,
    startCheckout, 
    openCustomerPortal,
    remainingSlots,
  } = useBusinessSubscription();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Company info
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  
  // Notifications
  const [emailOnComplete, setEmailOnComplete] = useState(true);
  const [emailWeekly, setEmailWeekly] = useState(true);

  // Initialize form values when company loads
  useEffect(() => {
    if (company) {
      setCompanyName(company.name || '');
      setWebsite(company.website || '');
      setBillingEmail(company.billing_email || '');
    }
  }, [company]);

  const handleSaveCompany = async () => {
    if (!company) return;
    
    setIsLoading(true);
    try {
      await supabase
        .from('companies')
        .update({
          name: companyName,
          website,
          billing_email: billingEmail,
        })
        .eq('id', company.id);
      
      await refetch();
      toast.success('Configurações salvas');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!subscription) return null;
    
    switch (subscription.status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'trial':
        return <Badge variant="secondary">Trial</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Pagamento pendente</Badge>;
      default:
        return null;
    }
  };

  const collaboratorUsagePercent = subscription 
    ? (subscription.currentCollaborators / subscription.maxCollaborators) * 100
    : 0;

  return (
    <BusinessLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta empresarial
          </p>
        </div>

        <Tabs defaultValue="billing">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="billing">Assinatura</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Dados da empresa
                </CardTitle>
                <CardDescription>
                  Informações básicas da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da empresa</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://suaempresa.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-email">Email de cobrança</Label>
                  <Input
                    id="billing-email"
                    type="email"
                    placeholder="financeiro@empresa.com"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveCompany} disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Salvar alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Seu Plano
                  {getStatusBadge()}
                </CardTitle>
                <CardDescription>
                  Gerencie seu plano e forma de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isSubLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : subscription ? (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Plano atual</span>
                        <span className="text-primary font-semibold capitalize">
                          {BUSINESS_TIERS[subscription.tier]?.name || subscription.tier}
                        </span>
                      </div>
                      {subscription.status === 'trial' && (
                        <p className="text-sm text-muted-foreground">
                          Você está no período de teste gratuito de 14 dias
                        </p>
                      )}
                      {subscription.subscriptionEnd && subscription.status === 'active' && (
                        <p className="text-sm text-muted-foreground">
                          Próxima cobrança: {new Date(subscription.subscriptionEnd).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Colaboradores</p>
                            <p className="text-sm text-muted-foreground">
                              {subscription.currentCollaborators}/{subscription.maxCollaborators} utilizados
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {remainingSlots} {remainingSlots === 1 ? 'vaga' : 'vagas'} restantes
                        </span>
                      </div>
                      <Progress value={collaboratorUsagePercent} className="h-2" />
                    </div>

                    {subscription.subscribed && (
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={openCustomerPortal}
                        disabled={isSubLoading}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Gerenciar assinatura no Stripe
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Carregando informações...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing Plans */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Escolha seu plano</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <BusinessPricingCard
                  tier="starter"
                  name={BUSINESS_TIERS.starter.name}
                  price={BUSINESS_TIERS.starter.pricePerMonth}
                  features={BUSINESS_TIERS.starter.features}
                  isCurrentPlan={subscription?.tier === 'starter'}
                  onSelect={() => startCheckout('starter')}
                  isLoading={isCheckingOut}
                  disabled={subscription?.subscribed}
                />
                <BusinessPricingCard
                  tier="growth"
                  name={BUSINESS_TIERS.growth.name}
                  price={BUSINESS_TIERS.growth.pricePerMonth}
                  features={BUSINESS_TIERS.growth.features}
                  isCurrentPlan={subscription?.tier === 'growth'}
                  isPopular
                  onSelect={() => startCheckout('growth')}
                  isLoading={isCheckingOut}
                  disabled={subscription?.subscribed}
                />
                <BusinessPricingCard
                  tier="enterprise"
                  name={BUSINESS_TIERS.enterprise.name}
                  price={BUSINESS_TIERS.enterprise.pricePerMonth}
                  features={BUSINESS_TIERS.enterprise.features}
                  isCurrentPlan={subscription?.tier === 'enterprise'}
                  onSelect={() => startCheckout('enterprise')}
                  isLoading={isCheckingOut}
                  disabled={subscription?.subscribed}
                />
              </div>
              {subscription?.subscribed && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Para alterar seu plano, use o portal de gerenciamento acima
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure quando você deseja receber atualizações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Conclusão de jornada</p>
                    <p className="text-sm text-muted-foreground">
                      Receba um email quando um colaborador completar a jornada
                    </p>
                  </div>
                  <Switch
                    checked={emailOnComplete}
                    onCheckedChange={setEmailOnComplete}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Resumo semanal</p>
                    <p className="text-sm text-muted-foreground">
                      Receba um resumo semanal do progresso da equipe
                    </p>
                  </div>
                  <Switch
                    checked={emailWeekly}
                    onCheckedChange={setEmailWeekly}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}
