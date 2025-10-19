import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Sparkles, BookOpen, Palette, Compass, Video, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Influence = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Sparkles,
      title: "🌿 O que é o Essentia Influence",
      content: "O Essentia Influence é um módulo que ensina pessoas e marcas a comunicarem sua essência com propósito, unindo autoconhecimento, estética e estratégia. Aqui, o marketing deixa de ser autopromoção e se torna expressão da verdade interior. É o elo entre o espiritual e o estratégico — uma comunicação que nasce da alma e gera resultados concretos."
    },
    {
      icon: BookOpen,
      title: "📘 Mini eBook: Comunicar com Verdade",
      content: "Guia prático e inspirador com base na fé aplicada à comunicação. Contém reflexões curtas, exercícios de clareza e três capítulos — Chamado, Verdade e Caminho. É o primeiro passo para comunicar com coerência e presença."
    },
    {
      icon: Palette,
      title: "🎨 Guia de Linguagem Visual por Arquétipo",
      content: "PDF semipersonalizado que traduz o resultado do teste Essentia em expressão visual. Inclui paleta de cores, símbolos, estilo e mini moodboard. Permite ao cliente enxergar sua essência traduzida em imagem."
    },
    {
      icon: Compass,
      title: "🧭 Roteiro de Posicionamento com Propósito",
      content: "Template interativo que guia o cliente a definir: quem é, o que comunica, como serve e qual mensagem quer deixar. Ajuda a transformar essência em narrativa, propósito em posicionamento e fé em linguagem."
    },
    {
      icon: Video,
      title: "🎥 Vídeo: Comunicar é Servir",
      content: "Uma mensagem exclusiva de Cris Nunes sobre o papel espiritual da comunicação e o poder de transformar presença em missão. Mostra que influenciar é servir e que a verdade convence sem esforço."
    },
    {
      icon: Calendar,
      title: "📅 Mini Plano de Conteúdo Essentia",
      content: "Guia leve e prático com sugestões de postagens, legendas e tipos de conteúdo por arquétipo. Inclui ideias de temas de valor e modelo de biografia cristã autêntica. Ajuda o cliente a aplicar imediatamente o aprendizado."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-background via-gold/5 to-background">
        <div className="container max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Essentia <span className="text-gold">Influence</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gold mb-8 font-light">
            Marketing com Propósito e Verdade
          </p>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Transforme fé, propósito e verdade em influência real, com ética, beleza e coerência espiritual.
          </p>
          <Button 
            size="lg"
            className="text-lg px-12 py-6 bg-gold hover:bg-gold-dark text-foreground font-semibold"
            onClick={() => navigate("/consultoria-essentia")}
          >
            Quero comunicar com verdade
          </Button>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-border">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-gold/10 rounded-xl">
                      <section.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold flex-1">{section.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Format & Delivery */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">100% Digital</h3>
              <p className="text-sm text-muted-foreground">Acesso imediato aos materiais</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Entrega Automatizada</h3>
              <p className="text-sm text-muted-foreground">PDFs e vídeos na plataforma</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Tom Inspiracional</h3>
              <p className="text-sm text-muted-foreground">Estratégico e espiritual</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-gold/10">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-xl text-muted-foreground mb-6 italic">
            "Agora que você descobriu sua essência, é hora de comunicá-la com propósito."
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Comece sua jornada de comunicação autêntica
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="text-lg px-12 py-6 bg-gold hover:bg-gold-dark text-foreground font-semibold"
              onClick={() => navigate("/consultoria-essentia")}
            >
              Quero comunicar com verdade
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-lg px-12 py-6 border-gold text-gold hover:bg-gold/10 font-semibold"
              onClick={() => navigate("/auth")}
            >
              Começar pelo Essentia
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Influence;
