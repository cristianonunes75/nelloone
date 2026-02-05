import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Sparkles, Users, Brain, Heart, Target, Palette, Link2, Shield } from "lucide-react";
import { NelloGlobalFooter } from "@/components/global/NelloGlobalFooter";

const mapas = [
  {
    id: "eneagrama",
    icon: Heart,
    titlePt: "1. Eneagrama — Padrões emocionais e motivações centrais",
    titleEn: "1. Enneagram — Emotional patterns and core motivations",
    contentPt: `O Eneagrama explora padrões emocionais automáticos e motivações internas que tendem a se repetir sob pressão.

Ele ajuda a reconhecer medos recorrentes, reações emocionais e caminhos de amadurecimento.

**Exemplo:** Um perfil pode ser extremamente leal em equilíbrio, mas em estresse cair em preocupação excessiva.`,
    contentEn: `The Enneagram explores automatic emotional patterns and internal motivations that tend to repeat under pressure.

It helps recognize recurring fears, emotional reactions, and paths to maturity.

**Example:** A profile can be extremely loyal when balanced, but under stress fall into excessive worry.`
  },
  {
    id: "disc",
    icon: Target,
    titlePt: "2. DISC — Estilo comportamental e tomada de decisão",
    titleEn: "2. DISC — Behavioral style and decision making",
    contentPt: `O DISC é amplamente aplicado em liderança, comunicação e ambiente profissional.

Ele mostra tendências do modo como você se posiciona no mundo: ação, influência, estabilidade ou análise.

**Exemplo:** Um perfil analítico entrega excelência, mas sob pressão pode travar por perfeccionismo.`,
    contentEn: `DISC is widely applied in leadership, communication, and professional environments.

It shows tendencies in how you position yourself in the world: action, influence, stability, or analysis.

**Example:** An analytical profile delivers excellence, but under pressure may freeze due to perfectionism.`
  },
  {
    id: "temperamentos",
    icon: Sparkles,
    titlePt: "3. Temperamentos — Energia emocional de base",
    titleEn: "3. Temperaments — Base emotional energy",
    contentPt: `Os temperamentos ajudam a reconhecer predisposições naturais de ritmo, impulso e reação emocional.

Eles não definem destino, mas explicam tendências.

**Exemplo:** Uma pessoa muito determinada pode liderar com força, mas precisa aprender a desacelerar.`,
    contentEn: `Temperaments help recognize natural predispositions of rhythm, impulse, and emotional reaction.

They don't define destiny, but explain tendencies.

**Example:** A very determined person can lead strongly, but needs to learn to slow down.`
  },
  {
    id: "inteligencias",
    icon: Brain,
    titlePt: "4. Inteligências Múltiplas — Onde estão seus talentos reais",
    titleEn: "4. Multiple Intelligences — Where your real talents are",
    contentPt: `Baseado na teoria de Howard Gardner, esse mapa mostra diferentes formas de inteligência e talento.

Nem todo dom é lógico ou escolar.

Esse mapa ajuda a identificar onde você brilha naturalmente.`,
    contentEn: `Based on Howard Gardner's theory, this map shows different forms of intelligence and talent.

Not every gift is logical or academic.

This map helps identify where you naturally shine.`
  },
  {
    id: "nello16",
    icon: Palette,
    titlePt: "5. Nello 16 — Estrutura mental e maturidade",
    titleEn: "5. Nello 16 — Mental structure and maturity",
    contentPt: `Inspirado nos Tipos Psicológicos de Jung, esse mapa explora padrões de percepção, decisão e estilo de vida.

Aqui não se trata de rótulo, mas de crescimento.`,
    contentEn: `Inspired by Jung's Psychological Types, this map explores patterns of perception, decision, and lifestyle.

Here it's not about labels, but about growth.`
  },
  {
    id: "arquetipos",
    icon: Shield,
    titlePt: "6. Arquétipos — Forças simbólicas da identidade",
    titleEn: "6. Archetypes — Symbolic forces of identity",
    contentPt: `Os arquétipos são padrões universais descritos na psicologia analítica.

Eles ajudam a explorar forças internas que influenciam escolhas, desejos e narrativa pessoal.

**Exemplo:** Criador busca expressão. Governante busca liderança. Cuidador busca servir.`,
    contentEn: `Archetypes are universal patterns described in analytical psychology.

They help explore internal forces that influence choices, desires, and personal narrative.

**Example:** Creator seeks expression. Ruler seeks leadership. Caregiver seeks to serve.`
  },
  {
    id: "estilos-conexao",
    icon: Link2,
    titlePt: "7. Estilos de Conexão — Como você cria vínculo",
    titleEn: "7. Connection Styles — How you create bonds",
    contentPt: `Esse mapa mostra tendências de como você expressa afeto e como se sente compreendido.

Muitos conflitos relacionais não são falta de amor, mas estilos diferentes de conexão.`,
    contentEn: `This map shows tendencies of how you express affection and how you feel understood.

Many relationship conflicts are not lack of love, but different connection styles.`
  }
];

export default function Os7Mapas() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            {isEn ? 'The 7 Maps of Nello Identity' : 'Os 7 Mapas do Nello Identity'}
          </h1>
          <p className="text-xl md:text-2xl text-primary font-medium">
            {isEn 
              ? 'Structured clarity on personality, patterns, and development.'
              : 'Clareza estruturada sobre personalidade, padrões e desenvolvimento.'}
          </p>
          <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              {isEn 
                ? 'Nello Identity is a self-knowledge journey built from 7 integrated maps that help organize emotional, behavioral, and relational patterns.'
                : 'O Nello Identity é uma jornada de autoconhecimento construída a partir de 7 mapas integrados que ajudam a organizar padrões emocionais, comportamentais e relacionais.'}
            </p>
            <p className="text-lg font-medium text-foreground">
              {isEn 
                ? "The goal is not to label people. It's to offer clarity, language, and direction."
                : 'O objetivo não é rotular pessoas. É oferecer clareza, linguagem e direção.'}
            </p>
          </div>
          <div className="pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/cliente">
                {isEn ? 'Access my Essence Code' : 'Acessar meu Código da Essência'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 1 - O que é */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {isEn ? 'What is Nello Identity' : 'O que é o Nello Identity'}
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              {isEn 
                ? 'Nello Identity is based on frameworks widely used in human development, in contexts such as education, career guidance, leadership, communication, and personal reflection.'
                : 'O Nello Identity é baseado em frameworks amplamente utilizados no desenvolvimento humano, em contextos como educação, orientação vocacional, liderança, comunicação e reflexão pessoal.'}
            </p>
            <div className="space-y-2 py-4 text-foreground font-medium">
              <p>{isEn ? "It's not a psychological diagnosis." : 'Ele não é um diagnóstico psicológico.'}</p>
              <p>{isEn ? "It's not a clinical report." : 'Não é um laudo clínico.'}</p>
              <p>{isEn ? "It doesn't replace therapy or professional guidance." : 'Não substitui terapia ou acompanhamento profissional.'}</p>
            </div>
            <p>
              {isEn 
                ? "It's an educational and reflective tool, made to support self-knowledge with responsibility."
                : 'É uma ferramenta educativa e reflexiva, feita para apoiar o autoconhecimento com responsabilidade.'}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 - Para Profissionais */}
      <section className="py-16 md:py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8 md:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {isEn ? 'For professionals who accompany people' : 'Para profissionais que acompanham pessoas'}
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  {isEn 
                    ? 'Nello Identity can also be used as a complementary tool in professional care, as support for language and structured reflection.'
                    : 'O Nello Identity também pode ser utilizado como ferramenta complementar em atendimentos profissionais, como apoio de linguagem e reflexão estruturada.'}
                </p>
                <p>
                  {isEn 
                    ? 'Many therapists, mentors, and facilitators use personality maps to help their clients organize emotional patterns, name recurring difficulties, and deepen conversations with more clarity.'
                    : 'Muitos terapeutas, mentores e facilitadores utilizam mapas de personalidade para ajudar seus clientes a organizar padrões emocionais, nomear dificuldades recorrentes e aprofundar conversas com mais clareza.'}
                </p>
                <div className="pt-2 text-foreground font-medium">
                  <p>{isEn ? "Nello doesn't replace clinical work." : 'O Nello não substitui o trabalho clínico.'}</p>
                  <p>{isEn ? 'It works as a complementary, educational, and ethical resource.' : 'Ele funciona como recurso complementar, educativo e ético.'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3 - Os 7 Mapas Accordion */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {isEn ? 'The 7 Maps' : 'Os 7 Mapas'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {isEn 
                ? 'Each map illuminates a different dimension of identity. The value is in the integration.'
                : 'Cada mapa ilumina uma dimensão diferente da identidade. O valor está na integração.'}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {mapas.map((mapa) => (
              <AccordionItem 
                key={mapa.id} 
                value={mapa.id}
                className="border border-border/50 rounded-xl px-6 bg-card shadow-soft"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <div className="flex items-center gap-3">
                    <mapa.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-foreground">
                      {isEn ? mapa.titleEn : mapa.titlePt}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line pl-8">
                    {(isEn ? mapa.contentEn : mapa.contentPt).split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Section 4 - Código da Essência */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Sparkles className="h-12 w-12 text-primary mx-auto" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {isEn ? 'Essence Code — When everything fits together' : 'Código da Essência — Quando tudo se encaixa'}
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            <p>
              {isEn 
                ? "The Essence Code is Nello Identity's integrative synthesis."
                : 'O Código da Essência é a síntese integrativa do Nello Identity.'}
            </p>
            <p>
              {isEn 
                ? 'It connects the 7 maps and reveals consistent patterns, dominant strengths, and clear directions for development.'
                : 'Ele conecta os 7 mapas e revela padrões consistentes, forças dominantes e direções claras de desenvolvimento.'}
            </p>
            <p className="text-foreground font-medium pt-2">
              {isEn 
                ? "The goal is not to define you. It's to organize you from within."
                : 'O objetivo não é te definir. É te organizar por dentro.'}
            </p>
          </div>
          <div className="pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/cliente">
                {isEn ? 'Generate my Essence Code' : 'Gerar meu Código da Essência'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Responsibility Note */}
      <section className="py-12 px-6 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {isEn ? 'Responsibility Note' : 'Nota de responsabilidade'}
          </h3>
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            {isEn 
              ? "Nello Identity is a self-knowledge and human development tool. It has no diagnostic purpose and does not replace clinical psychological evaluation or professional therapeutic guidance. Its use should always be reflective, complementary, and ethical."
              : 'O Nello Identity é uma ferramenta de autoconhecimento e desenvolvimento humano. Ele não possui finalidade diagnóstica e não substitui avaliação psicológica clínica ou acompanhamento terapêutico profissional. Seu uso deve ser sempre reflexivo, complementar e ético.'}
          </p>
        </div>
      </section>

      <NelloGlobalFooter currentApp="identity" variant="light" />
    </div>
  );
}
