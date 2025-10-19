import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Compass, TrendingUp, Target, Palette, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConsultoriaEssentia = () => {
  const navigate = useNavigate();

  const etapas = [
    {
      icon: Compass,
      number: "01",
      title: "🧭 Etapa 1 — Diagnóstico Essencial",
      content: "Revisão profunda de propósito, valores e arquétipos. Análise simbólica e comportamental da marca. Entendimento do comportamento organizacional e espiritual da liderança. Identificação de bloqueios e desalinhamentos."
    },
    {
      icon: TrendingUp,
      number: "02",
      title: "📊 Etapa 2 — Análise Financeira e Comportamental",
      content: "Avaliação da saúde financeira e emocional da empresa. Identificação de padrões de escassez, desperdício e crenças limitantes. Construção de um plano financeiro simbólico e estratégico, que traduza fé e prosperidade em ação."
    },
    {
      icon: Target,
      number: "03",
      title: "🎯 Etapa 3 — Estratégia e Estrutura de Marketing Real",
      content: "Posicionamento da marca com base na verdade e propósito. Criação da narrativa central, planejamento de comunicação, calendário editorial e estratégia digital. O marketing nasce como reflexo da essência curada."
    },
    {
      icon: Palette,
      number: "04",
      title: "🎨 Etapa 4 — Branding e Comunicação Visual",
      content: "Direção de arte e consultoria estética. Revisão da identidade visual, tom de voz e simbologia da marca. Aplicação prática nas redes sociais, vídeos e campanhas publicitárias com coerência espiritual e impacto visual."
    },
    {
      icon: Settings,
      number: "05",
      title: "⚙️ Etapa 5 — Operação e Execução Guiada",
      content: "Planejamento operacional e acompanhamento estratégico. Coordenação das ações de marketing, feedbacks contínuos e alinhamento com equipes internas. Aqui, o plano se transforma em movimento real e sustentável."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Consultoria <span className="text-gold">Essentia</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gold mb-8 font-light">
            Estratégia Integral de Propósito e Performance
          </p>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Da essência à execução. Um processo completo para alinhar propósito, comunicação, finanças e operação.
          </p>
        </div>
      </section>

      {/* What is */}
      <section className="py-16 px-6">
        <div className="container max-w-4xl mx-auto">
          <Card className="border-gold/20 bg-muted/30">
            <CardContent className="p-10">
              <div className="flex items-start gap-4 mb-6">
                <Sparkles className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-4">🌿 O que é a Consultoria Essentia</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    A Consultoria Essentia é um acompanhamento 360º para marcas, profissionais e empresas que desejam unir identidade, marketing, gestão e propósito. É uma jornada de reposicionamento integral — onde o marketing é consequência de uma base sólida e espiritualmente alinhada.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Etapas */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Processo de Transformação Integral
          </h2>
          <div className="space-y-6">
            {etapas.map((etapa, index) => (
              <Card key={index} className="hover:shadow-lg transition-all border-border">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4 md:flex-row flex-col md:items-center">
                      <div className="w-16 h-16 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <etapa.icon className="w-8 h-8 text-gold" />
                      </div>
                      <div className="text-4xl font-bold text-gold/20 flex-shrink-0">
                        {etapa.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{etapa.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {etapa.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Format Details */}
      <section className="py-16 px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Híbrido</h3>
              <p className="text-sm text-muted-foreground">Estratégico e operacional</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Sob Demanda</h3>
              <p className="text-sm text-muted-foreground">Agendamento manual</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Executivo</h3>
              <p className="text-sm text-muted-foreground">Consultivo e espiritual</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-gold/10">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-xl text-muted-foreground mb-6 italic">
            "Deseja aplicar tudo o que descobriu com acompanhamento direto e estratégia completa?"
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transforme verdade em impacto real
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            A consultoria é personalizada e adaptada às necessidades específicas de cada cliente. Entre em contato para análise e proposta sob medida.
          </p>
          <Button 
            size="lg"
            className="text-lg px-12 py-6 bg-gold hover:bg-gold-dark text-foreground font-semibold"
            onClick={() => window.location.href = "mailto:contato@essentia.com.br?subject=Interesse em Consultoria Essentia"}
          >
            Quero uma consultoria completa
          </Button>
          <p className="text-sm text-muted-foreground mt-6">
            Sem valor fixo — sob análise e proposta personalizada
          </p>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-lg text-muted-foreground italic leading-relaxed">
            O Essentia revela quem você é. O Essentia Influence ensina a comunicar sua verdade. 
            A Consultoria Essentia transforma essa verdade em impacto real no mundo.
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default ConsultoriaEssentia;
