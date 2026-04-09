import { Link } from 'react-router-dom';
import { 
  Target, 
  Users, 
  FileText, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Clock,
  BarChart3,
  Zap,
  Building2,
  UserCheck,
  TrendingUp,
  Briefcase,
  HeartHandshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getNelloAppUrl } from '@/hooks/useSubdomain';
import { PRODUCT_IDENTITY } from '../config/featureFlags';

export default function BusinessLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <a 
                href={getNelloAppUrl('identity')} 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Voltar para Nello One
              </a>
              <span className="text-muted-foreground/50">|</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-lg font-semibold">{PRODUCT_IDENTITY.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button>Começar empresa</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Conceptual Navigation */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-2 text-sm text-muted-foreground overflow-x-auto">
            <span className="flex items-center gap-1.5 text-foreground font-medium whitespace-nowrap">
              <Building2 className="w-3.5 h-3.5" /> Empresas
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Users className="w-3.5 h-3.5" /> Equipe
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <UserCheck className="w-3.5 h-3.5" /> Recrutamento
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <BarChart3 className="w-3.5 h-3.5" /> Insights
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <FileText className="w-3.5 h-3.5" /> Faturamento
            </span>
          </div>
        </div>
      </div>

      {/* Hero - Corporate Platform */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            Plataforma Corporativa Nello
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Entenda pessoas. Contrate melhor.
            <br />
            <span className="text-primary">Desenvolva equipes extraordinárias.</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {PRODUCT_IDENTITY.description}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=register">
              <Button size="lg" className="gap-2">
                Começar empresa
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Falar com especialista
            </Button>
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            14 dias grátis • Sem cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Diagnóstico comportamental</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Inteligência organizacional</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Organizational Cycle */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Ciclo organizacional completo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Do recrutamento ao desenvolvimento contínuo dos seus colaboradores
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Defina o perfil humano ideal</h3>
                <p className="text-muted-foreground text-sm">
                  Determine as competências comportamentais e o perfil ideal para cada função 
                  na sua organização.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Contrate com inteligência comportamental</h3>
                <p className="text-muted-foreground text-sm">
                  Avalie candidatos com DISC e Temperamentos. Compare perfis e tome decisões 
                  baseadas em dados humanos reais.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Desenvolva colaboradores continuamente</h3>
                <p className="text-muted-foreground text-sm">
                  Acompanhe a evolução comportamental da sua equipe e 
                  construa uma cultura organizacional sólida.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Get - Three Layers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">O que o Nello Business entrega</h2>
              <p className="text-muted-foreground">
                Três camadas integradas para gestão humana completa
              </p>
            </div>
            
            {/* Layer 1: Recrutamento */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Recrutamento Inteligente</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {PRODUCT_IDENTITY.delivers.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 2: Inteligência Organizacional */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Inteligência Organizacional</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {PRODUCT_IDENTITY.delivers.slice(4, 7).map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 3: Desenvolvimento Contínuo */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <HeartHandshake className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Base para Desenvolvimento Contínuo</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {PRODUCT_IDENTITY.delivers.slice(7).map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Importante</h4>
                  <p className="text-sm text-yellow-600/80 dark:text-yellow-500/80">
                    O Nello Business é uma plataforma de inteligência humana. 
                    Não substitui entrevistas — é uma camada adicional de análise 
                    comportamental para decisões mais assertivas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Acesse a plataforma completa</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            O Nello Business inclui todos os módulos em um único plano.
          </p>
          
          <div className="inline-flex flex-col items-center bg-card border rounded-2xl p-8 max-w-md">
            <span className="text-sm text-muted-foreground mb-2">Nello Business</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">R$ 49</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Inclui módulo de Recrutamento Inteligente
            </p>
            <ul className="text-left text-sm text-muted-foreground space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Até 10 avaliações/mês
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Gestão de equipe
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Insights organizacionais
              </li>
            </ul>
            <Link to="/auth?mode=register">
              <Button size="lg">Começar empresa</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA - Closing Message */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            O Nello Business começa no recrutamento e acompanha o crescimento humano da sua empresa.
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Uma plataforma única para entender, contratar e desenvolver as pessoas 
            que fazem sua empresa crescer.
          </p>
          <Link to="/auth?mode=register">
            <Button size="lg" variant="secondary">
              Começar agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">{PRODUCT_IDENTITY.name}</span>
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
