import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  pt: {
    title: "Criado por Cristiano Nunes",
    paragraphs: [
      "Cristiano Nunes é coach, estrategista digital, consultor em posicionamento de imagem e profissional de Educação Física com mais de 25 anos de experiência no desenvolvimento humano.",
      "Ao longo de décadas, dedicou sua vida a ajudar pessoas a encontrarem clareza, direção e significado. Sua trajetória integra corpo, mente e identidade de forma integrada.",
      "Além da atuação técnica e profissional, também partilha reflexões e formações em ambientes comunitários e espaços religiosos, sempre com foco no propósito, maturidade emocional e crescimento interior.",
      "Essa vivência com pessoas reais ao longo de décadas moldou o Nello One, um sistema que revela padrões, ilumina caminhos e devolve às pessoas a capacidade de fazer escolhas com verdade, consciência e propósito."
    ],
    closing: "Não é sobre rótulos. É sobre despertar quem você realmente é."
  },
  'pt-pt': {
    title: "Criado por Cristiano Nunes",
    paragraphs: [
      "Cristiano Nunes é coach, estratega digital, consultor em posicionamento de imagem e profissional de Educação Física, com mais de 25 anos de experiência em desenvolvimento humano.",
      "Ao longo de toda a sua carreira, dedicou-se a ajudar pessoas a ganharem clareza, direção e sentido para as suas vidas. A sua abordagem integra corpo, mente e identidade de forma harmoniosa.",
      "Para além do trabalho técnico, também partilha reflexões e formações em contextos comunitários e espaços religiosos, sempre centrado no propósito, na maturidade emocional e na evolução pessoal.",
      "Toda essa experiência com pessoas reais contribuiu para a criação do Nello One, um sistema que revela padrões, ilumina caminhos e devolve às pessoas a capacidade de escolher com verdade, consciência e propósito."
    ],
    closing: "Não se trata de rótulos. Trata-se de despertar quem realmente é."
  },
  en: {
    title: "Created by Cristiano Nunes",
    paragraphs: [
      "Cristiano Nunes is a coach, digital strategist, image positioning consultant, and Physical Education professional with more than 25 years of experience in human development.",
      "Throughout his career, he has dedicated his life to helping people find clarity, direction, and meaning. His approach integrates body, mind, and identity into a cohesive path of personal growth.",
      "Beyond his technical work, he also shares reflections and teachings in community and faith-based environments, always focused on purpose, emotional maturity, and inner growth.",
      "This long journey working with real people shaped the foundation of Nello One, a system designed to reveal patterns, illuminate paths, and empower individuals to make choices grounded in truth, awareness, and purpose."
    ],
    closing: "It is not about labels. It is about awakening who you truly are."
  }
};

export function AboutCreator() {
  const { language } = useLanguage();
  
  const lang = language === 'pt-pt' ? 'pt-pt' : language === 'en' ? 'en' : 'pt';
  const t = content[lang];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          {t.title}
        </h2>
        
        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          {t.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          
          <p className="italic text-foreground/70 pt-4 text-center">
            {t.closing}
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutCreator;
