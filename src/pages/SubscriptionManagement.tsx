import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  CreditCard, 
  RefreshCcw, 
  Check, 
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Heart,
  Flame,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';

type Language = 'pt' | 'pt-pt' | 'en';

interface SubscriptionInfo {
  module: string;
  moduleName: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  endDate?: string;
  tier?: string;
  color: string;
}

const TRANSLATIONS = {
  pt: {
    title: "Minhas Assinaturas",
    subtitle: "Gerencie todos os seus acessos em um só lugar",
    back: "Voltar",
    refresh: "Atualizar",
    managePayments: "Gerenciar Pagamentos",
    noSubscriptions: "Você ainda não possui assinaturas ativas",
    explore: "Explorar Planos",
    active: "Ativo",
    inactive: "Inativo",
    renews: "Renova em",
    expires: "Expira em",
    oneTimePurchases: "Compras Únicas",
    subscriptions: "Assinaturas",
    modules: {
      identity: "Nello Identity",
      flow: "Nello Flow",
      life: "Nello Life",
      business: "Nello Business",
      praxis: "Nello Praxis",
    },
    identityProducts: "Produtos Identity",
    essenceCode: "Código da Essência",
    fullJourney: "Jornada Completa",
    coupleCode: "Código do Casal",
    activationGuide: "Guia de Ativação",
  },
  'pt-pt': {
    title: "As Minhas Assinaturas",
    subtitle: "Gere todos os teus acessos num só lugar",
    back: "Voltar",
    refresh: "Atualizar",
    managePayments: "Gerir Pagamentos",
    noSubscriptions: "Ainda não tens assinaturas ativas",
    explore: "Explorar Planos",
    active: "Ativo",
    inactive: "Inativo",
    renews: "Renova em",
    expires: "Expira em",
    oneTimePurchases: "Compras Únicas",
    subscriptions: "Assinaturas",
    modules: {
      identity: "Nello Identity",
      flow: "Nello Flow",
      life: "Nello Life",
      business: "Nello Business",
      praxis: "Nello Praxis",
    },
    identityProducts: "Produtos Identity",
    essenceCode: "Código da Essência",
    fullJourney: "Jornada Completa",
    coupleCode: "Código do Casal",
    activationGuide: "Guia de Ativação",
  },
  en: {
    title: "My Subscriptions",
    subtitle: "Manage all your access in one place",
    back: "Back",
    refresh: "Refresh",
    managePayments: "Manage Payments",
    noSubscriptions: "You don't have any active subscriptions yet",
    explore: "Explore Plans",
    active: "Active",
    inactive: "Inactive",
    renews: "Renews on",
    expires: "Expires on",
    oneTimePurchases: "One-Time Purchases",
    subscriptions: "Subscriptions",
    modules: {
      identity: "Nello Identity",
      flow: "Nello Flow",
      life: "Nello Life",
      business: "Nello Business",
      praxis: "Nello Praxis",
    },
    identityProducts: "Identity Products",
    essenceCode: "Essence Code",
    fullJourney: "Full Journey",
    coupleCode: "Couple's Code",
    activationGuide: "Activation Guide",
  },
};

export default function SubscriptionManagement() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const langParam = searchParams.get('lang') as Language | null;
  const language: Language = langParam && ['pt', 'pt-pt', 'en'].includes(langParam) ? langParam : 'pt';
  const { toast } = useToast();
  const t = TRANSLATIONS[language];

  const [isLoading, setIsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<SubscriptionInfo[]>([]);
  const [purchases, setPurchases] = useState<{
    essenceCode: boolean;
    fullJourney: boolean;
    coupleCode: boolean;
    activationGuide: boolean;
  }>({
    essenceCode: false,
    fullJourney: false,
    coupleCode: false,
    activationGuide: false,
  });

  const fetchSubscriptions = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Check Flow subscription
      const { data: flowData } = await supabase.functions.invoke('flow-check-subscription');
      
      // Check Business subscription
      const { data: businessData } = await supabase.functions.invoke('business-check-subscription');

      // Check purchases - using any type to avoid schema mismatch
      const { data: purchaseData } = await supabase
        .from('test_purchases')
        .select('*')
        .eq('user_id', user.id) as { data: any[] | null };

      const subs: SubscriptionInfo[] = [];

      // Flow subscription
      subs.push({
        module: 'flow',
        moduleName: t.modules.flow,
        icon: Flame,
        isActive: flowData?.subscribed || false,
        endDate: flowData?.subscription_end,
        color: 'from-orange-500 to-amber-500',
      });

      // Life subscription (placeholder)
      subs.push({
        module: 'life',
        moduleName: t.modules.life,
        icon: Heart,
        isActive: false,
        color: 'from-emerald-500 to-teal-500',
      });

      // Business subscription
      subs.push({
        module: 'business',
        moduleName: t.modules.business,
        icon: Building2,
        isActive: businessData?.subscribed || false,
        endDate: businessData?.subscription_end,
        tier: businessData?.tier,
        color: 'from-violet-500 to-purple-600',
      });

      // Praxis (placeholder)
      subs.push({
        module: 'praxis',
        moduleName: t.modules.praxis,
        icon: GraduationCap,
        isActive: false,
        color: 'from-rose-500 to-pink-600',
      });

      setSubscriptions(subs);

      // Check one-time purchases
      const hasEssenceCode = purchaseData?.some(p => p.product_type === 'codigo_essencia') || false;
      const hasFullJourney = purchaseData?.some(p => p.product_type === 'jornada_completa') || false;
      const hasCoupleCode = purchaseData?.some(p => p.product_type === 'codigo_casal') || false;
      const hasActivationGuide = purchaseData?.some(p => p.product_type === 'guia_ativacao') || false;

      setPurchases({
        essenceCode: hasEssenceCode || hasFullJourney,
        fullJourney: hasFullJourney,
        coupleCode: hasCoupleCode,
        activationGuide: hasActivationGuide,
      });

    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const handleManagePayments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de pagamentos",
        variant: "destructive",
      });
    }
  };

  const activeCount = subscriptions.filter(s => s.isActive).length;
  const purchaseCount = Object.values(purchases).filter(Boolean).length;

  return (
    <>
      <SEOHead
        title={`${t.title} | Nello One`}
        description={t.subtitle}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={fetchSubscriptions}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleManagePayments} className="gap-1">
                <ExternalLink className="w-4 h-4" />
                {t.managePayments}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Subscriptions */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {t.subscriptions}
              {activeCount > 0 && (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                  {activeCount} {t.active.toLowerCase()}
                </Badge>
              )}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {subscriptions.map((sub) => {
                const Icon = sub.icon;
                return (
                  <Card 
                    key={sub.module}
                    className={`relative overflow-hidden ${
                      sub.isActive 
                        ? 'border-emerald-500/50' 
                        : 'opacity-75'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-5`} />
                    <CardContent className="relative pt-6 pb-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${sub.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold">{sub.moduleName}</h3>
                            <Badge variant={sub.isActive ? "default" : "secondary"}>
                              {sub.isActive ? t.active : t.inactive}
                            </Badge>
                          </div>
                          {sub.tier && (
                            <p className="text-sm text-muted-foreground">{sub.tier}</p>
                          )}
                          {sub.isActive && sub.endDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t.renews}: {new Date(sub.endDate).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* One-time Purchases */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {t.identityProducts}
              {purchaseCount > 0 && (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                  {purchaseCount}
                </Badge>
              )}
            </h2>

            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  {[
                    { key: 'fullJourney', label: t.fullJourney, purchased: purchases.fullJourney },
                    { key: 'essenceCode', label: t.essenceCode, purchased: purchases.essenceCode },
                    { key: 'coupleCode', label: t.coupleCode, purchased: purchases.coupleCode },
                    { key: 'activationGuide', label: t.activationGuide, purchased: purchases.activationGuide },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className={item.purchased ? '' : 'text-muted-foreground'}>
                        {item.label}
                      </span>
                      {item.purchased ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">{t.active}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          {t.inactive}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}
