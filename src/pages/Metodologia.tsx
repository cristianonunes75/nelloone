import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

const Metodologia = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const content = isEn ? {
    title: "Methodology and Responsibility",
    subtitle: "Nello Identity is a self-knowledge journey based on models widely used in human development.",
    
    whatIsTitle: "What it is",
    whatIsText: "Nello Identity is a self-knowledge and personal development tool built from 7 integrated maps. These maps organize personality tendencies, emotional patterns, and behavioral styles with the aim of bringing clarity, language, and direction. Nello's focus is reflective and educational, helping each person understand themselves better and mature their choices.",
    
    whatIsNotTitle: "What it is not",
    whatIsNotItems: [
      "Nello Identity is not a psychological diagnosis",
      "It is not a clinical report or official psychometric instrument",
      "It does not replace therapy, psychological or psychiatric care",
      "It does not define a person in absolute or definitive terms",
    ],
    whatIsNotFooter: "Nello offers structured reflection maps, not clinical assessments.",
    
    modelsTitle: "Models and references",
    modelsText: "Nello's maps are inspired by frameworks widely used in educational, corporate, and human development contexts, such as:",
    modelsItems: [
      "Personality and motivation models",
      "Behavioral style theories",
      "Symbolic and narrative structures of identity",
      "Modern approaches to talents and learning",
    ],
    modelsFooter: "They should be understood as interpretive lenses, not absolute truths.",
    
    howToUseTitle: "How to use wisely",
    howToUseIntro: "Nello's greatest value lies in integration and conscious application.",
    howToUseText: "We recommend that users utilize the maps as support for:",
    howToUseItems: [
      "Personal reflection",
      "Meaningful conversations",
      "Decision-making with more clarity",
      "Emotional and relational development",
    ],
    howToUseFooter: "Not as a label, sentence, or final answer.",
    
    careTitle: "If you are in emotional distress",
    careText: "If you are experiencing intense anxiety, depression, psychological suffering, or any clinical situation, we recommend seeking care from a qualified professional. Nello Identity can support your self-knowledge, but it does not replace specialized psychological care.",
    
    footerText: "Nello Identity — self-knowledge and human development tool. Educational and reflective use.",
  } : {
    title: "Metodologia e Responsabilidade",
    subtitle: "O Nello Identity é uma jornada de autoconhecimento baseada em modelos amplamente utilizados no desenvolvimento humano.",
    
    whatIsTitle: "O que é",
    whatIsText: "O Nello Identity é uma ferramenta de autoconhecimento e desenvolvimento pessoal construída a partir de 7 mapas integrados. Esses mapas organizam tendências de personalidade, padrões emocionais e estilos de comportamento com o objetivo de trazer clareza, linguagem e direção. O foco do Nello é reflexivo e educativo, ajudando cada pessoa a se compreender melhor e amadurecer suas escolhas.",
    
    whatIsNotTitle: "O que não é",
    whatIsNotItems: [
      "O Nello Identity não é um diagnóstico psicológico",
      "Não é um laudo clínico ou instrumento psicométrico oficial",
      "Não substitui terapia, acompanhamento psicológico ou psiquiátrico",
      "Não define uma pessoa de forma absoluta ou definitiva",
    ],
    whatIsNotFooter: "O Nello oferece mapas de reflexão estruturada, não avaliações clínicas.",
    
    modelsTitle: "Modelos e referências",
    modelsText: "Os mapas do Nello são inspirados em frameworks amplamente difundidos em contextos educacionais, corporativos e de desenvolvimento humano, como:",
    modelsItems: [
      "Modelos de personalidade e motivação",
      "Teorias de estilos comportamentais",
      "Estruturas simbólicas e narrativas de identidade",
      "Abordagens modernas de talentos e aprendizagem",
    ],
    modelsFooter: "Eles devem ser compreendidos como lentes interpretativas e não como verdades absolutas.",
    
    howToUseTitle: "Como usar com sabedoria",
    howToUseIntro: "O maior valor do Nello está na integração e na aplicação consciente.",
    howToUseText: "Recomendamos que o usuário utilize os mapas como apoio para:",
    howToUseItems: [
      "Reflexão pessoal",
      "Conversas significativas",
      "Tomada de decisões com mais clareza",
      "Desenvolvimento emocional e relacional",
    ],
    howToUseFooter: "Não como rótulo, sentença ou resposta final.",
    
    careTitle: "Se você estiver em sofrimento emocional",
    careText: "Se você está vivendo ansiedade intensa, depressão, sofrimento psíquico ou qualquer situação clínica, recomendamos buscar acompanhamento com um profissional habilitado. O Nello Identity pode apoiar seu autoconhecimento, mas não substitui cuidado psicológico especializado.",
    
    footerText: "Nello Identity — ferramenta de autoconhecimento e desenvolvimento humano. Uso educativo e reflexivo.",
  };

  return (
    <>
      <SEOHead
        title={isEn ? "Methodology and Responsibility | Nello Identity" : "Metodologia e Responsabilidade | Nello Identity"}
        description={content.subtitle}
      />
      
      <div className="min-h-screen bg-background">
        <LandingNav />
        
        <main className="pt-24 pb-16">
          <div className="container max-w-4xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                {content.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {content.subtitle}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-16">
              {/* What it is */}
              <section className="animate-fade-in">
                <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-3">
                  <span className="text-gold">✦</span>
                  {content.whatIsTitle}
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  {content.whatIsText}
                </p>
              </section>

              {/* What it is NOT */}
              <section className="animate-fade-in bg-muted/30 rounded-2xl p-8 border border-border/50">
                <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
                  <span className="text-destructive">✕</span>
                  {content.whatIsNotTitle}
                </h2>
                <ul className="space-y-3 mb-6">
                  {content.whatIsNotItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-foreground/80">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-foreground/70 font-medium italic">
                  {content.whatIsNotFooter}
                </p>
              </section>

              {/* Models and references */}
              <section className="animate-fade-in">
                <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-3">
                  <span className="text-gold">📚</span>
                  {content.modelsTitle}
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  {content.modelsText}
                </p>
                <ul className="space-y-2 mb-4 ml-4">
                  {content.modelsItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-foreground/80">
                      <span className="text-gold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-foreground/70 italic">
                  {content.modelsFooter}
                </p>
              </section>

              {/* How to use */}
              <section className="animate-fade-in bg-gradient-to-br from-gold/5 to-gold/10 rounded-2xl p-8 border border-gold/20">
                <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-3">
                  <span className="text-gold">💡</span>
                  {content.howToUseTitle}
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  {content.howToUseIntro}
                </p>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  {content.howToUseText}
                </p>
                <ul className="space-y-2 mb-4 ml-4">
                  {content.howToUseItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-foreground/80">
                      <span className="text-gold mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-foreground font-medium">
                  {content.howToUseFooter}
                </p>
              </section>

              {/* Care section */}
              <section className="animate-fade-in bg-destructive/5 rounded-2xl p-8 border border-destructive/20">
                <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-3">
                  <span className="text-destructive">❤️</span>
                  {content.careTitle}
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  {content.careText}
                </p>
              </section>
            </div>

            {/* Institutional footer */}
            <div className="mt-16 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                {content.footerText}
              </p>
            </div>
          </div>
        </main>

        <LandingFooter />
      </div>
    </>
  );
};

export default Metodologia;
