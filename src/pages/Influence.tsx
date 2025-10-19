import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { MessageCircle, BookOpen, Compass, Sparkles, CheckCircle2, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Influence = () => {
  const navigate = useNavigate();

  const contentBlocks = [
    {
      icon: Sparkles,
      title: "O Chamado da Comunicação Verdadeira",
      points: [
        "A diferença entre marketing e testemunho",
        "Como comunicar sem perder a alma",
        "O poder da coerência entre interior e exterior"
      ]
    },
    {
      icon: MessageCircle,
      title: "Identidade e Linguagem",
      points: [
        "Como traduzir o arquétipo pessoal em expressão pública",
        "Escolha de tom, estilo e ritmo comunicacional",
        "A estética da verdade: fé, sobriedade e autoridade visual"
      ]
    },
    {
      icon: Target,
      title: "Posicionamento com Propósito",
      points: [
        "Como construir uma presença digital sem vaidade",
        "Estratégias simples de impacto e valor",
        "Como criar conteúdo que inspira e atrai naturalmente"
      ]
    },
    {
      icon: Compass,
      title: "Marca Pessoal Cristã",
      points: [
        "Aplicando os resultados do Essentia (testes + imagem) no marketing pessoal",
        "A diferença entre exposição e propósito",
        "Roteiro de 'Comunicação com Luz': transformar essência em mensagem"
      ]
    },
    {
      icon: CheckCircle2,
      title: "Plano Prático",
      points: [
        "Checklist de presença digital cristã",
        "Sugestões de postagens, legendas e biografia coerentes com arquétipo",
        "Mini guia de identidade visual e vocabulário de fé",
        "Mentoria e acompanhamento via WhatsApp (opcional premium)"
      ]
    }
  ];

  const values = [
    "Verdade sobre aparência",
    "Propósito sobre performance",
    "Ética sobre ego",
    "Comunicação sobre manipulação",
    "Testemunho sobre autopromoção"
  ];

  const packages = [
    {
      name: "Light",
      price: "R$ 297",
      description: "Curso + Guia de Linguagem + PDF",
      features: [
        "Mini eBook 'Comunicar com Verdade'",
        "Guia de Linguagem Visual por Arquétipo",
        "Roteiro de Posicionamento com Propósito",
        "Acesso ao conteúdo por 6 meses"
      ]
    },
    {
      name: "Premium",
      price: "R$ 590",
      description: "Curso + Mentoria individual + Plano de conteúdo",
      features: [
        "Tudo do Light +",
        "Mentoria individual via WhatsApp (30 dias)",
        "Plano de conteúdo personalizado",
        "Análise de presença digital atual",
        "Acesso vitalício"
      ],
      highlight: true
    },
    {
      name: "Pro",
      price: "R$ 950",
      description: "Sessão de conteúdo personalizada + Identidade visual",
      features: [
        "Tudo do Premium +",
        "Sessão de conteúdo personalizada (1h)",
        "Desenvolvimento de identidade visual",
        "Templates personalizados para redes sociais",
        "Suporte prioritário por 60 dias"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="text-6xl">🪶</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Essentia <span className="text-gold">Influence</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gold mb-8 font-light">
            Marketing com Propósito e Verdade
          </p>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            A imagem revela quem você é, mas a comunicação mostra o que você veio fazer no mundo.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Após descobrir e revelar sua essência por meio dos testes e da fotografia, aprenda agora a comunicar essa verdade no mundo real, com coerência, propósito e fé.
          </p>
          <Button 
            size="lg"
            className="text-lg px-12 py-6 bg-gold hover:bg-gold-dark"
            onClick={() => navigate("/auth")}
          >
            🟡 Quero expressar minha essência
          </Button>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Valores do Módulo</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-gold/20">
                <CardContent className="p-6 flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0" />
                  <p className="text-lg font-medium">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content Blocks */}
      <section className="py-20 px-6">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Estrutura do Conteúdo
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {contentBlocks.map((block, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-gold/10 rounded-lg">
                      <block.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold flex-1">{block.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {block.points.map((point, i) => (
                      <li key={i} className="flex gap-3 text-muted-foreground">
                        <span className="text-gold mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container max-w-4xl mx-auto text-center">
          <BookOpen className="w-12 h-12 text-gold mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-8">O que você recebe</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              'Mini eBook "Comunicar com Verdade" (PDF incluído)',
              'Guia de Linguagem Visual por Arquétipo',
              'Roteiro de Posicionamento com Propósito',
              'Plano prático de presença digital',
              'Mentoria opcional via WhatsApp'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Escolha seu plano
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Preço de lançamento para os primeiros 50 clientes
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={pkg.highlight ? "border-2 border-gold shadow-xl relative" : ""}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-gold mb-2">{pkg.price}</p>
                  <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={pkg.highlight ? "w-full bg-gold hover:bg-gold-dark" : "w-full"}
                    variant={pkg.highlight ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    Começar agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Da imagem à influência
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            O Essentia revela quem você é.<br />
            O Essentia Influence ensina como comunicar isso com propósito, fé e autoridade.
          </p>
          <Button 
            size="lg"
            className="text-lg px-12 py-6 bg-gold hover:bg-gold-dark"
            onClick={() => navigate("/auth")}
          >
            Comece sua expressão com propósito
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Influence;