import { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  Bell,
  Users,
  Save,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function BusinessSettings() {
  const { company, refetch } = useBusinessAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Company info
  const [companyName, setCompanyName] = useState(company?.name || '');
  const [website, setWebsite] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  
  // Notifications
  const [emailOnComplete, setEmailOnComplete] = useState(true);
  const [emailWeekly, setEmailWeekly] = useState(true);

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

  return (
    <BusinessLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta empresarial
          </p>
        </div>

        <Tabs defaultValue="company">
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

          <TabsContent value="billing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Assinatura
                </CardTitle>
                <CardDescription>
                  Gerencie seu plano e forma de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Plano atual</span>
                    <span className="text-primary font-semibold">Trial</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Você está no período de teste gratuito de 14 dias
                  </p>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Limite de colaboradores</p>
                    <p className="text-sm text-muted-foreground">
                      0/10 colaboradores utilizados
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Gerenciar assinatura
                </Button>
              </CardContent>
            </Card>
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
