import { Link } from 'react-router-dom';
import { 
  UserCircle2, 
  FileText, 
  Brain, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Heart,
  Target,
  LineChart,
  MessageSquare,
  Clock,
  Users,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PraxisLanding() {
  const features = [
    {
      icon: UserCircle2,
      title: 'Gestão de Clientes 1:1',
      description: 'Histórico completo, linha do tempo com milestones e consentimento explícito por cliente.',
    },
    {
      icon: FileText,
      title: 'Sessões com Anotações Ricas',
      description: 'Editor avançado com objetivos, insights, tarefas e tags para organizar cada encontro.',
    },
    {
      icon: Brain,
      title: 'IA de Próximos Passos',
      description: 'Sugestões inteligentes baseadas no perfil comportamental e histórico de anotações.',
    },
    {
      icon: LineChart,
      title: 'Acompanhamento de Evolução',
      description: 'Gráficos de progresso, marcos importantes e análise de padrões de desenvolvimento.',
    },
    {
      icon: DollarSign,
      title: 'Controle Financeiro',
      description: 'Valores por sessão, pacotes, faturamento e histórico de pagamentos integrado.',
    },
    {
      icon: Calendar,
      title: 'Lembretes e Follow-up',
      description: 'Notificações automáticas para você e seus clientes, sinais de engajamento.',
    },
  ];

  const plans = [
    {
      name: 'Solo',
      price: 297,
      maxClients: 30,
      features: ['Até 30 clientes', 'Sessões ilimitadas', 'Anotações ricas', 'IA básica de sugestões'],
      popular: false,
    },
    {
      name: 'Pro',
      price: 597,
      maxClients: 80,
      features: ['Até 80 clientes', 'Tudo do Solo', 'IA avançada', 'Relatórios exportáveis', 'Prioridade no suporte'],
      popular: true,
    },
    {
      name: 'Studio',
      price: 997,
      maxClients: 200,
      features: ['Até 200 clientes', 'Tudo do Pro', 'Controle financeiro completo', 'Alertas avançados', 'Templates de sessão'],
      popular: false,
    },
    {
      name: 'Enterprise Coach',
      price: 1997,
      maxClients: -1,
      features: ['Clientes ilimitados', 'Tudo do Studio', 'Multiusuário', 'API de integração', 'White-label disponível'],
      popular: false,
    },
  ];

  const forWho = [
    { icon: Heart, title: 'Coaches de Vida e Executivos' },
    { icon: Target, title: 'Mentores e Facilitadores' },
    { icon: MessageSquare, title: 'Consultores de RH' },
    { icon: Users, title: 'Terapeutas de Desenvolvimento' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Business
              </Link>
              <span className="text-muted-foreground/50">|</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold">Nello One Praxis</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/praxis/auth">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/praxis/auth?mode=register">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  Começar agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white mb-6 text-sm px-4 py-1.5">
            <Sparkles className="w-4 h-4 mr-2" />
            Plataforma para Profissionais de Desenvolvimento Humano
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Sua prática. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Mais foco.</span>
            <br />
            Mais profundidade. Mais impacto.
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforme sessões em evolução consistente com anotações inteligentes, 
            IA de apoio e acompanhamento profissional de cada cliente.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/praxis/auth?mode=register">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                Comece seu trial grátis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Agendar demonstração
            </Button>
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            14 dias grátis • Sem cartão de crédito • Até 30 clientes no trial
          </p>
        </div>
      </section>

      {/* Para Quem */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            {forWho.map((item) => (
              <div key={item.title} className="flex items-center gap-2">
                <item.icon className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tudo que você precisa para atender com excelência</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa que organiza, acompanha e potencializa o trabalho com seus clientes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Highlight */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">IA como aliada, não autoridade</h2>
            <p className="text-muted-foreground mb-6">
              Com base no perfil comportamental, histórico de testes e suas anotações, 
              a IA sugere próximos passos, pontos de foco e mensagens de follow-up.
            </p>
            
            <div className="bg-card border rounded-xl p-6 text-left">
              <p className="text-sm text-amber-600 font-medium mb-3">Exemplo de sugestão:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Considere explorar a tensão entre o perfil executor (DISC D) e a necessidade de escuta ativa do cliente.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">O cliente mencionou "falta de clareza" nas últimas 3 sessões — pode ser um tema transversal.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Isto é sugestão de apoio e não substitui a interpretação profissional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Planos para cada fase da sua prática</h2>
            <p className="text-muted-foreground">
              Escolha o plano ideal para o tamanho da sua carteira de clientes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-amber-500 ring-2 ring-amber-500/20' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600">
                    Mais Popular
                  </Badge>
                )}
                <CardContent className="pt-8 text-center">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">R$ {plan.price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/praxis/auth?mode=register">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-orange-600' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Começar agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            Todos os planos incluem 14 dias de trial grátis • Desconto de 20% no plano anual
          </p>
        </div>
      </section>

      {/* Diferencial */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Por que Praxis?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">✕</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Planilhas + Google Docs</h4>
                  <p className="text-sm text-muted-foreground">
                    Dados fragmentados, sem visão de evolução, perda de histórico.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Nello One Praxis</h4>
                  <p className="text-sm text-muted-foreground">
                    Tudo integrado, histórico permanente, IA sugerindo próximos passos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">✕</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">CRMs genéricos</h4>
                  <p className="text-sm text-muted-foreground">
                    Feitos para vendas, não para desenvolvimento humano.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Nello One Praxis</h4>
                  <p className="text-sm text-muted-foreground">
                    Projetado por e para profissionais de coaching e mentoria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Transforme sua prática hoje
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Comece agora e descubra como organizar, acompanhar e potencializar 
            o desenvolvimento de cada cliente com clareza e profundidade.
          </p>
          <Link to="/praxis/auth?mode=register">
            <Button size="lg" variant="secondary" className="text-amber-600">
              Criar conta gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Nello One Praxis</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Business</Link>
              <a href="https://nello.one" className="hover:text-foreground transition-colors">Nello One</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nello One. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
