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
  Zap
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
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <span className="text-lg font-semibold">{PRODUCT_IDENTITY.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button>Começar agora</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero - Focused on Hiring */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            Avaliação Comportamental para Recrutamento
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Contrate com mais
            <br />
            <span className="text-primary">assertividade.</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {PRODUCT_IDENTITY.tagline}. Avalie candidatos com DISC e Temperamentos 
            antes de contratar e reduza erros de contratação.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=register">
              <Button size="lg" className="gap-2">
                Começar gratuitamente
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Falar com vendas
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
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Avaliação em 15 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Relatório comparativo</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Hiring Focus */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Um processo simples para avaliar candidatos antes de contratar
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Crie a vaga</h3>
                <p className="text-muted-foreground text-sm">
                  Defina o cargo, descrição e o perfil comportamental ideal 
                  para a posição que você está contratando.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Envie o link</h3>
                <p className="text-muted-foreground text-sm">
                  Compartilhe o link público da vaga com seus candidatos. 
                  Eles fazem a avaliação DISC e Temperamentos em ~15 minutos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Compare perfis</h3>
                <p className="text-muted-foreground text-sm">
                  Receba o relatório comportamental de cada candidato 
                  e veja a compatibilidade com o perfil ideal da vaga.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">O que você recebe</h2>
              <p className="text-muted-foreground">
                Ferramentas objetivas para avaliar candidatos
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {PRODUCT_IDENTITY.delivers.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Importante</h4>
                  <p className="text-sm text-yellow-600/80 dark:text-yellow-500/80">
                    O Nello Hiring é uma ferramenta de avaliação comportamental. 
                    Não substitui entrevistas — é uma camada adicional de análise para 
                    sua tomada de decisão.
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
          <h2 className="text-3xl font-bold mb-4">Preço simples e transparente</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Pague por uso. Sem surpresas.
          </p>
          
          <div className="inline-flex flex-col items-center bg-card border rounded-2xl p-8 max-w-md">
            <span className="text-sm text-muted-foreground mb-2">A partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">R$ 49</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Inclui até 10 avaliações de candidatos
            </p>
            <Link to="/auth?mode=register">
              <Button size="lg">Começar agora</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para contratar melhor?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Comece hoje e avalie seus candidatos com ferramentas comportamentais 
            validadas antes de tomar sua decisão.
          </p>
          <Link to="/auth?mode=register">
            <Button size="lg" variant="secondary">
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
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
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
