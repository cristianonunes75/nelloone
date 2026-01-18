import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Target,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getNelloAppUrl } from '@/hooks/useSubdomain';

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
                <span className="text-lg font-semibold">Nello Business</span>
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

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Plataforma B2B de Autoconhecimento
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Entenda sua equipe.
            <br />
            <span className="text-primary">Potencialize resultados.</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra os talentos naturais, estilos de comunicação e potenciais de liderança 
            da sua equipe através de avaliações científicas e relatórios consolidados.
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
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Privacidade garantida</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Ética em primeiro lugar</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Insights acionáveis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Um processo simples e transparente para entender melhor sua equipe
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Convide sua equipe</h3>
                <p className="text-muted-foreground text-sm">
                  Envie convites por email para seus colaboradores. 
                  Eles criam suas contas e realizam os testes em seu próprio ritmo.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Jornada individual</h3>
                <p className="text-muted-foreground text-sm">
                  Cada colaborador recebe seu relatório pessoal completo, 
                  com insights de autoconhecimento e desenvolvimento.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Insights consolidados</h3>
                <p className="text-muted-foreground text-sm">
                  Você recebe relatórios agregados da equipe, 
                  sem acesso a dados individuais sensíveis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Promise */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Privacidade é inegociável</h2>
            <p className="text-muted-foreground mb-8">
              Acreditamos que o autoconhecimento só acontece em um ambiente de confiança. 
              Por isso, a empresa <strong>nunca terá acesso</strong> aos relatórios individuais dos colaboradores.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">O colaborador vê</h4>
                  <p className="text-sm text-muted-foreground">
                    Relatório completo com forças, riscos e orientações pessoais
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">A empresa vê</h4>
                  <p className="text-sm text-muted-foreground">
                    Tendências agregadas e recomendações para gestão de equipe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Preço justo e progressivo</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Quanto maior sua equipe, maior o desconto. Sem surpresas.
          </p>
          
          <div className="inline-flex flex-col items-center bg-card border rounded-2xl p-8 max-w-md">
            <span className="text-sm text-muted-foreground mb-2">A partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">R$ 49,90</span>
              <span className="text-muted-foreground">/colaborador/mês</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Até 30% de desconto para equipes maiores
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
            Pronto para conhecer sua equipe de verdade?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Comece hoje e descubra como o autoconhecimento pode transformar 
            a comunicação, liderança e cultura da sua empresa.
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
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">Nello Business</span>
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
